import { createSheet, type Picture, type Sheet, type Tag } from './sheet'
import { createReading } from './panel'
import { dataUrl, imagePixelM } from './load'
import { dateLong, dateShort, daysBetween, el, notGenerated, pairKey, swatch } from './format'
import { comma, t, untranslated } from './i18n'
import type { Area, Layer, Manifest } from './types'

interface State {
  area: Area | null
  pair: boolean
  dateA: string
  dateB: string
  layer: Layer
  pol: string
  opacity: number
}

const frameMs = 1300

const readingHelp: Record<string, string> = {
  hv: 'Brighter means more signal came back. HV rises when the pulse bounces around inside a volume such as crops, shrubs or trees. Calm water and smooth bare soil stay dark.',
  hh: 'Calm water reflects the pulse away from the radar and looks dark. Rough ground is brighter. Buildings facing the radar can be very bright, because walls and ground act as a corner reflector.',
  ratio: 'HV:HH compares the two. It is higher where vegetation volume dominates and lower on bare ground and buildings.',
  classes: 'Each colour is one terrain type from our k-means model on the radar features. The names come from comparing the classes with the optical photo. Method & Data has the details.',
  change: 'Pixels that got brighter or darker than the threshold between Date A and Date B. Crops, harvest, water level, soil moisture and rain can all do this, so read the map with the flags and the text.',
  optical: 'A natural-colour photo from an optical satellite, for comparison. Optical needs daylight and a clear sky. The radar sees through cloud and at night.',
}

export async function startExplore(panel: HTMLElement, manifest: Manifest | null) {
  const controls = el('aside', { class: 'controls', ariaLabel: t('Area, dates and layer') })
  const stage = el('div', { class: 'stage' })
  const mapNote = el('div', { class: 'map-note', role: 'status' })
  const legend = el('div', { class: 'legend' })
  const scale = el('div', { class: 'scale' })
  const cursor = el('div', { class: 'cursor' }, [t('Cursor: move over the map')])
  const pixelKey = el('p', { class: 'pixel-key note' })
  const reading = el('aside', { class: 'reading', ariaLabel: t('Interpretation') })
  panel.append(
    el('div', { class: 'explore' }, [
      controls,
      el('section', { class: 'sheet', ariaLabel: t('Map') }, [
        el('div', { class: 'frame' }, [stage, mapNote]),
        el('div', { class: 'collar' }, [legend, el('div', { class: 'collar-side' }, [scale, pixelKey, cursor])]),
      ]),
      reading,
    ]),
  )
  const sheetReady = createSheet(stage, scale, cursor, manifest)
  let sheet: Sheet | null = null
  if (!manifest) {
    controls.append(notGenerated('Areas, dates and layers'))
    reading.append(notGenerated('Interpretation'))
    mapNote.textContent = t('Radar layers: not generated yet.')
    return
  }

  const dates = manifest.dates.map((entry) => entry.date)
  const [gapStart, gapEnd] = manifest.no_data_window
  const flagsOf = (date: string) => manifest.dates.find((entry) => entry.date === date)?.flags ?? []
  const hero = manifest.areas.find((area) => area.hero) ?? manifest.areas[0]
  const changeLayer = manifest.layers.find((layer) => layer.pols)
  const backdrop = manifest.layers.find((layer) => layer.kind === 'continuous')
  const opticalByDate = manifest.overview.files.optical_by_date
  for (const layer of manifest.layers) {
    if (layer.kind === 'rgb' && opticalByDate) layer.label = 'Optical photo, nearest clear date'
  }
  const photoOf = (date: string) => manifest.optical_dates?.find((entry) => entry.radar_date === date)
  const dated = (layer: Layer) => layer.kind === 'continuous' || (layer.kind === 'rgb' && opticalByDate !== undefined)
  const label = (layer: Layer) => t(layer.label)
  const datedLabels = manifest.layers.filter(dated).map(label).join(comma)
  const noPhoto = t('No clear optical photo near this date')
  const photoLabel = (date: string) => {
    const photo = photoOf(date)
    if (!photo?.photo_date) return t('No clear photo (radar {date})', { date: dateShort(date) })
    return `${t('Photo {photo} (radar {radar})', { photo: dateShort(photo.photo_date), radar: dateShort(date) })}${photo.sun_glint ? t(', sun glint') : ''}`
  }
  const state: State = {
    area: null,
    pair: true,
    dateA: hero?.default_dates[0] ?? dates[0],
    dateB: hero?.default_dates[1] ?? dates[dates.length - 1],
    layer: manifest.layers[0],
    pol: changeLayer?.pols?.[0] ?? '',
    opacity: 1,
  }
  const updateReading = createReading(reading, manifest)
  let timer = 0
  let playing = false
  let saved: Pick<State, 'pair' | 'dateA' | 'dateB'> | null = null
  let helpOpen = false
  const choosable = (date: string) => state.layer.kind !== 'rgb' || !opticalByDate || Boolean(photoOf(date)?.photo_date)
  const openDates = () => dates.filter(choosable)
  const nearest = (date: string, options: string[]) =>
    options.reduce((best, option) => (Math.abs(daysBetween(option, date)) < Math.abs(daysBetween(best, date)) ? option : best))
  const fitDates = () => {
    const open = openDates()
    if (!choosable(state.dateA) || (state.pair && state.dateA === open[open.length - 1])) {
      state.dateA = nearest(state.dateA, state.pair ? open.slice(0, -1) : open)
    }
    if (state.pair && (!choosable(state.dateB) || state.dateB <= state.dateA)) {
      state.dateB = nearest(state.dateB, open.filter((date) => date > state.dateA))
    }
  }

  const change = (update: () => void) => {
    window.clearTimeout(timer)
    playing = false
    saved = null
    update()
    render()
  }

  const regions = [...new Set(manifest.areas.map((area) => area.region))]
  const areaList = el('fieldset', { class: 'control' }, [
    el('legend', { class: 'caps' }, [t('Area')]),
    regions.length === 1 ? el('p', { class: 'note region' }, [t(regions[0])]) : '',
  ])
  const areaOptions = [null, ...manifest.areas].map((area) => {
    const input = el('input', { type: 'radio', name: 'area', value: area?.id ?? '', checked: area === null })
    input.addEventListener('change', () => chooseArea(area))
    const text = area
      ? [
          el('strong', {}, [t(area.name)]),
          ...(regions.length === 1 ? [] : [el('span', { class: 'note' }, [t(area.region)])]),
          el('span', { class: 'note', lang: untranslated(area.description) ? 'en' : '' }, [t(area.description)]),
        ]
      : [
          el('strong', {}, [t('Whole radar window')]),
          el('span', { class: 'note' }, [t('{track}, {n} preset areas', { track: manifest.source.track, n: manifest.areas.length })]),
        ]
    areaList.append(el('label', { class: 'area-option' }, [input, el('span', { class: 'area-text' }, text)]))
    return input
  })

  const modeGroup = el('div', { class: 'mode' }, [
    ...[
      ['pair', t('Two dates, A and B')],
      ['single', t('One date')],
    ].map(([value, label]) => {
      const input = el('input', { type: 'radio', name: 'date-mode', value, checked: value === 'pair' })
      input.addEventListener('change', () =>
        change(() => {
          state.pair = value === 'pair'
          if (state.pair && state.dateA === dates[dates.length - 1]) state.dateA = dates[dates.length - 2]
          if (state.dateB <= state.dateA) state.dateB = dates[dates.indexOf(state.dateA) + 1]
        }),
      )
      return el('label', { class: 'choice inline' }, [input, ` ${label}`])
    }),
  ])

  const dateRows: { date: string; line: HTMLTableRowElement; a: HTMLInputElement; b: HTMLInputElement }[] = []
  const dateBody = el('tbody')
  dates.forEach((date, index) => {
    if (index > 0 && dates[index - 1] < gapStart && date > gapEnd) {
      dateBody.append(
        el('tr', { class: 'gap-row' }, [el('td', { colSpan: 3 }, [t('No NISAR data {from} to {to}', { from: dateShort(gapStart), to: dateShort(gapEnd) })])]),
      )
    }
    const flagged = flagsOf(date).length > 0
    const name = `${dateLong(date)}${flagged ? t(', flagged') : ''}`
    const a = el('input', { type: 'radio', name: 'date-a', value: date, ariaLabel: t('Date A, {name}', { name }) })
    const b = el('input', { type: 'radio', name: 'date-b', value: date, ariaLabel: t('Date B, {name}', { name }) })
    a.addEventListener('change', () =>
      change(() => {
        state.dateA = date
        if (state.pair && state.dateB <= date) state.dateB = dates[index + 1]
      }),
    )
    b.addEventListener('change', () => change(() => (state.dateB = date)))
    const line = el('tr', { class: flagged ? 'flagged' : '' }, [
      el('th', { scope: 'row' }, [flagged ? el('span', { class: 'flagged-mark', title: t('Flagged date') }) : '', dateLong(date)]),
      el('td', {}, [a]),
      el('td', { class: 'col-b' }, [b]),
    ])
    dateBody.append(line)
    dateRows.push({ date, line, a, b })
  })
  const dateHeadA = el('th', { class: 'num', scope: 'col' }, ['A'])
  const dateTable = el('table', { class: 'dates' }, [
    el('thead', {}, [el('tr', {}, [el('th', { scope: 'col' }, [t('Radar date')]), dateHeadA, el('th', { class: 'num col-b', scope: 'col' }, ['B'])])]),
    dateBody,
  ])
  const flagKey = manifest.dates.some((entry) => entry.flags.length)
    ? el('p', { class: 'note flag-key' }, [el('span', { class: 'flagged-mark' }), t('Flagged: read with care.')])
    : ''

  const playButton = el('button', { type: 'button', class: 'button' })
  const stopButton = el('button', { type: 'button', class: 'button' }, [t('Stop')])
  const playStatus = el('span', { class: 'play-status', ariaLive: 'polite' })
  const finish = () => {
    window.clearTimeout(timer)
    playing = false
    if (saved) Object.assign(state, saved)
    saved = null
    render()
  }
  const frame = (index: number) => {
    const frames = openDates()
    state.dateA = frames[index]
    render()
    const next = frames[index + 1]
    if (!next) {
      timer = window.setTimeout(finish, frameMs * 2)
      return
    }
    for (const picture of pictures(next).pictures) new Image().src = picture.url
    const acrossGap = frames[index] < gapStart && next > gapEnd
    if (acrossGap) playStatus.append(t(' Next: {date}, after the gap with no NISAR data.', { date: dateShort(next) }))
    timer = window.setTimeout(() => frame(index + 1), acrossGap ? frameMs * 2 : frameMs)
  }
  playButton.addEventListener('click', () => {
    if (playing) {
      window.clearTimeout(timer)
      playing = false
      render()
      return
    }
    const frames = openDates()
    const resumeAt = saved ? frames.indexOf(state.dateA) + 1 : 0
    saved ??= { pair: state.pair, dateA: state.dateA, dateB: state.dateB }
    playing = true
    state.pair = false
    frame(resumeAt < frames.length ? resumeAt : 0)
  })
  stopButton.addEventListener('click', finish)
  const playRow = el('div', { class: 'play-row' }, [playButton, stopButton, playStatus])

  const dateFacts = el('div', { class: 'date-facts' })
  controls.append(areaList, el('fieldset', { class: 'control' }, [el('legend', { class: 'caps' }, [t('Dates')]), modeGroup, dateTable, flagKey, playRow, dateFacts]))

  const layerSet = el('fieldset', { class: 'control' }, [el('legend', { class: 'caps' }, [t('Layer')])])
  const layerInputs = manifest.layers.map((layer) => {
    const input = el('input', { type: 'radio', name: 'layer', value: layer.id, checked: layer === state.layer })
    input.addEventListener('change', () => change(() => (state.layer = layer)))
    layerSet.append(el('label', { class: 'choice' }, [input, ` ${label(layer)}`]))
    return input
  })
  const polGroup = el('div', { class: 'pol-group' }, [
    el('span', { class: 'note' }, [t('Change in: ')]),
    ...(changeLayer?.pols ?? []).map((pol) => {
      const input = el('input', { type: 'radio', name: 'change-pol', value: pol, checked: pol === state.pol })
      input.addEventListener('change', () => change(() => (state.pol = pol)))
      return el('label', { class: 'choice inline' }, [input, ` ${pol.toUpperCase()}`])
    }),
  ])
  const opacity = el('input', { type: 'range', id: 'opacity', min: '0', max: '100', step: '5', value: '100' })
  const opacityValue = el('output', {}, ['100 %'])
  opacityValue.htmlFor.add('opacity')
  opacity.addEventListener('input', () => {
    state.opacity = opacity.valueAsNumber / 100
    opacityValue.textContent = `${opacity.value} %`
    sheet?.setOpacity(state.opacity)
  })
  layerSet.append(polGroup, el('label', { class: 'opacity', htmlFor: 'opacity' }, [t('Opacity')]), el('div', { class: 'opacity-row' }, [opacity, opacityValue]))
  controls.append(layerSet)

  const pictures = (date: string): { pictures: Picture[]; missing: string[] } => {
    const layer = state.layer
    const area = state.area
    const overviewFiles = manifest.overview.files
    const found: Picture[] = []
    const missing: string[] = []
    const add = (key: Picture['key'], path: string | undefined, what: string, crisp: boolean) => {
      if (path) found.push({ key, url: dataUrl(path), corners: key === 'overview' ? manifest.overview.corners : area!.corners, crisp })
      else missing.push(t('{what}: not generated yet.', { what }))
    }
    const backdropAt = (when: string) => {
      const id = backdrop!.id as 'hv'
      add('overview', overviewFiles[id]?.[when], t('{label} overview, {date}', { label: label(backdrop!), date: dateLong(when) }), false)
      if (area) add('backdrop', area.files[id]?.[when], t('{label}, {area}, {date}', { label: label(backdrop!), area: t(area.name), date: dateLong(when) }), false)
    }
    if (layer.kind === 'continuous') {
      const id = layer.id as 'hv' | 'hh' | 'ratio'
      add('overview', overviewFiles[id]?.[date], t('{label} overview, {date}', { label: label(layer), date: dateLong(date) }), false)
      if (area) add('area', area.files[id]?.[date], t('{label}, {area}, {date}', { label: label(layer), area: t(area.name), date: dateLong(date) }), false)
    } else if (layer.kind === 'rgb' && opticalByDate) {
      if (!photoOf(date)?.photo_date) missing.push(t('{what} (radar {date}).', { what: noPhoto, date: dateLong(date) }))
      else {
        add('overview', opticalByDate[date], t('{label} overview, {date}', { label: label(layer), date: photoLabel(date) }), false)
        if (area) add('area', area.files.optical_by_date?.[date], t('{label}, {area}, {date}', { label: label(layer), area: t(area.name), date: photoLabel(date) }), false)
      }
    } else if (layer.kind === 'rgb') {
      add('overview', overviewFiles.optical, t('{label}, overview', { label: label(layer) }), false)
      if (area) add('area', area.files.optical, t('{label}, {area}', { label: label(layer), area: t(area.name) }), false)
    } else if (layer.pols) {
      backdropAt(state.dateB)
      if (!area) missing.push(t('{label}: drawn per area, choose an area.', { label: label(layer) }))
      else add('area', area.files.change?.[state.pol]?.[pairKey(state.dateA, state.dateB)], t('{label} ({pol}), {area}', { label: label(layer), pol: state.pol.toUpperCase(), area: t(area.name) }), true)
    } else {
      backdropAt(date)
      if (!area) missing.push(t('{label}: drawn per area, choose an area.', { label: label(layer) }))
      else add('area', area.files.classes, t('{label}, {area}', { label: label(layer), area: t(area.name) }), true)
    }
    return { pictures: found, missing }
  }

  const drawLegend = (swipe: boolean) => {
    const layer = state.layer
    const parts: (Node | string)[] = [el('p', { class: 'legend-title' }, [label(layer)])]
    if (layer.kind === 'continuous' && layer.stretch) {
      parts.push(
        el('div', { class: 'ramp-row' }, [
          el('span', {}, [`${layer.stretch[0]} ${layer.unit}`]),
          el('span', { class: `ramp ramp-${layer.colormap}`, ariaHidden: 'true' }),
          el('span', {}, [`${layer.stretch[1]} ${layer.unit}`]),
        ]),
        el('p', { class: 'note' }, [t('Backscatter, same stretch for every date.')]),
      )
    } else if (layer.kind === 'rgb' && opticalByDate) {
      const shown: [string, string][] = swipe ? [['A ', state.dateA], ['B ', state.dateB]] : [['', state.dateA]]
      for (const [prefix, date] of shown) {
        const photo = photoOf(date)
        const text = photo?.photo_date
          ? t('{prefix}{photo}: {sensor}, {cloud} % cloud on its cloudiest tile, natural colour.', { prefix, photo: photoLabel(date), sensor: photo.sensor ?? '', cloud: photo.cloud_pct ?? '' })
          : prefix + t('{what} (radar {date}).', { what: noPhoto, date: dateLong(date) })
        parts.push(el('p', { class: 'note' }, [text]))
        if (photo?.sun_glint) {
          parts.push(
            el('p', { class: 'note glint-note' }, [
              t('Sun glint on {date}: the sun was reflected off the water toward the satellite (glint angle {deg}°), so water looks pale blue instead of dark.', { date: dateShort(photo.photo_date!), deg: photo.glint_deg ?? '' }),
            ]),
          )
        }
      }
    } else if (layer.kind === 'rgb') {
      parts.push(el('p', { class: 'note' }, [t('{sensor}, {date}, natural colour.', { sensor: manifest.optical.sensor, date: dateLong(manifest.optical.date) })]))
    } else {
      const entries = layer.legend ?? manifest.classes.map((terrainClass) => ({ label: terrainClass.name, colour: terrainClass.colour }))
      parts.push(el('ul', { class: 'legend-keys' }, entries.map((entry) => el('li', {}, [swatch(entry.colour), t(entry.label)]))))
      if (backdrop) parts.push(el('p', { class: 'note' }, [t('Under it: {label}, {date}.', { label: label(backdrop), date: dateLong(layer.pols ? state.dateB : state.dateA) })]))
    }
    const dateLine = layer.pols
      ? t('Change from A {a} to B {b}, in {pol}.', { a: dateLong(state.dateA), b: dateLong(state.dateB), pol: state.pol.toUpperCase() })
      : swipe
        ? t('Left of the line: A {a}. Right: B {b}.', { a: dateLong(state.dateA), b: dateLong(state.dateB) })
        : dated(layer)
          ? t('Date: {date}.', { date: dateLong(state.dateA) })
          : ''
    if (dateLine) parts.push(el('p', { class: 'legend-dates' }, [dateLine]))
    if (state.pair && !swipe && !layer.pols) {
      parts.push(el('p', { class: 'note' }, [t('The swipe compares two dates of {layers}.', { layers: datedLabels })]))
    }
    if (readingHelp[layer.id]) {
      const help = el('details', { class: 'reading-help', open: helpOpen }, [
        el('summary', {}, [t('How to read this layer')]),
        el('p', {}, [t(readingHelp[layer.id])]),
      ])
      help.addEventListener('toggle', () => (helpOpen = help.open))
      parts.push(help)
    }
    legend.replaceChildren(...parts)
  }

  let pixelToken = 0
  const drawPixelKey = async (shown: Picture[]) => {
    const mine = ++pixelToken
    const px = manifest.source.pixel_m
    const sizes = await Promise.all(
      shown.filter((picture) => picture.key !== 'backdrop').map(async (picture) => ({ key: picture.key, metres: Math.round(await imagePixelM(picture.url, picture.corners)) })),
    )
    if (mine !== pixelToken) return
    const lines: (Node | string)[][] = [[t('Radar pixel: {px} m × {px} m.', { px }), ' ', el('a', { href: '#method-pixels' }, [t('Why {px} m?', { px })])]]
    for (const { key, metres } of sizes.filter((size) => size.metres > 0)) {
      if (key === 'area') lines.push([metres === px ? t('Area image: 1 image pixel = 1 radar pixel.') : t('Area image: 1 image pixel ≈ {m} m.', { m: metres })])
      else lines.push([t('Whole window: 1 image pixel ≈ {m} m, shrunk to load fast.', { m: metres })])
    }
    if (state.layer.kind === 'rgb') lines.push([t('Optical photos are 30 m, moved onto the radar grid.')])
    pixelKey.replaceChildren(...lines.map((line) => el('span', {}, line)))
  }

  const drawDateFacts = () => {
    const chosen = state.pair ? [state.dateA, state.dateB] : [state.dateA]
    const facts: (Node | string)[] = []
    if (state.pair) facts.push(el('p', {}, [el('strong', {}, [t('{n} days between A and B.', { n: daysBetween(state.dateA, state.dateB) })])]))
    const before = dates.filter((date) => date < gapStart).pop()
    const after = dates.find((date) => date > gapEnd)
    facts.push(
      el('p', { class: 'note' }, [
        t('NASA gap: no NISAR data from {from} to {to}, so nothing between {before} and {after}.', { from: dateLong(gapStart), to: dateLong(gapEnd), before: before ? dateShort(before) : '', after: after ? dateShort(after) : '' }),
      ]),
    )
    const flagItems = chosen.flatMap((date) =>
      flagsOf(date).map((code) =>
        el('li', {}, [el('strong', {}, [`${dateShort(date)}: `]), t(manifest.flag_text[code] ?? code)]),
      ),
    )
    if (flagItems.length) facts.push(el('ul', { class: 'flag-list' }, flagItems))
    const locked = dates.filter((date) => !choosable(date))
    if (locked.length) {
      facts.push(el('p', { class: 'note' }, [t('No clear optical photo near {dates}: not available with this layer.', { dates: locked.map(dateShort).join(comma) })]))
    }
    dateFacts.replaceChildren(...facts)
  }

  const drawPlay = () => {
    const canPlay = dated(state.layer)
    playButton.disabled = !canPlay
    const frames = openDates()
    playButton.textContent = playing ? t('Pause') : saved ? t('Resume') : t('Play all {n} dates', { n: frames.length })
    stopButton.hidden = saved === null
    const flagged = flagsOf(state.dateA).length > 0
    const when = state.layer.kind === 'rgb' ? photoLabel(state.dateA) : dateLong(state.dateA)
    playStatus.textContent = saved
      ? t('{i} of {n}: {when}{flagged}.', { i: frames.indexOf(state.dateA) + 1, n: frames.length, when, flagged: flagged ? t(', flagged') : '' })
      : canPlay
        ? ''
        : t('Play works with {layers}.', { layers: datedLabels })
  }

  const tag = (prefix: string, date: string): Tag => {
    const flagged = flagsOf(date).length > 0
    const when = state.layer.kind === 'rgb' ? photoLabel(date) : dateLong(date)
    return { text: `${prefix}${when}${flagged ? t(', flagged') : ''}`, flagged }
  }

  const render = () => {
    const swipe = state.pair && dated(state.layer)
    fitDates()
    const open = openDates()
    for (const row of dateRows) {
      const allowed = choosable(row.date)
      row.line.classList.toggle('no-photo', !allowed)
      row.a.checked = row.date === state.dateA
      row.b.checked = row.date === state.dateB
      row.a.disabled = !allowed || (state.pair && row.date === open[open.length - 1])
      row.b.disabled = !allowed || !state.pair || row.date <= state.dateA
    }
    dateTable.classList.toggle('single', !state.pair)
    dateHeadA.textContent = state.pair ? 'A' : t('Date')
    areaOptions.forEach((input, index) => {
      input.checked = (index === 0 ? null : manifest.areas[index - 1]) === state.area
    })
    const modeInputs = modeGroup.querySelectorAll('input')
    modeInputs[0].checked = state.pair
    modeInputs[1].checked = !state.pair
    const changeInput = layerInputs[manifest.layers.indexOf(changeLayer!)]
    if (changeInput) {
      changeInput.disabled = !state.pair
      if (!state.pair && state.layer === changeLayer) {
        state.layer = manifest.layers[0]
        layerInputs[0].checked = true
      }
    }
    polGroup.hidden = state.layer !== changeLayer

    const left = pictures(state.dateA)
    const right = swipe ? pictures(state.dateB) : null
    const none = { text: '', flagged: false }
    sheet?.show(left.pictures, right?.pictures ?? null, [
      dated(state.layer) ? tag(swipe ? 'A ' : '', state.dateA) : none,
      swipe ? tag('B ', state.dateB) : none,
    ])
    const missing = [...new Set([...left.missing, ...(right?.missing ?? [])])]
    mapNote.replaceChildren(...missing.map((what) => el('p', {}, [what])))
    mapNote.hidden = missing.length === 0
    drawLegend(swipe)
    drawPixelKey(left.pictures)
    drawDateFacts()
    drawPlay()
    if (!playing) updateReading({ area: state.area, pair: state.pair, dateA: state.dateA, dateB: state.dateB })
  }

  const chooseArea = (area: Area | null) =>
    change(() => {
      state.area = area
      sheet?.select(area?.id ?? null)
      sheet?.fly(area)
    })

  render()
  sheet = await sheetReady
  sheet.drawAreas((id) => chooseArea(manifest.areas.find((area) => area.id === id) ?? null))
  sheet.select(state.area?.id ?? null)
  sheet.setOpacity(state.opacity)
  if (state.area) sheet.fly(state.area)
  render()
  window.addEventListener('themechange', () => {
    sheet?.restyle()
    render()
  })
}
