import { drawSeries, seriesLines, seriesTable } from './chart'
import { keepValueText, loadData, loadJson } from './load'
import { dateLong, dateShort, daysBetween, el, notGenerated, pairKey, swatch } from './format'
import { comma, lang, t, untranslated } from './i18n'
import type { Area, Evidence, Manifest, Series, TerrainRow, Text, Translation } from './types'

interface Choice {
  area: Area | null
  pair: boolean
  dateA: string
  dateB: string
}

const unitNames: Record<string, string> = { km2: 'km²', pct: '%' }

function withUnit(value: number | string | null | undefined, unit = ''): string | null {
  if (value === null || value === undefined) return null
  return unit ? `${value} ${unitNames[unit] ?? t(unit)}` : String(value)
}

function english(text: string, tag: 'p' | 'span' | 'li' = 'span'): HTMLElement {
  return el(tag, untranslated(text) ? { lang: 'en' } : {}, [t(text)])
}

function evidenceRows(evidence: Evidence, pair: boolean): [string, string | null][] {
  if (pair) {
    return [
      [t('Days between'), withUnit(evidence.days_between, 'days')],
      [t('Brighter in HV'), withUnit(evidence.brighter_km2?.hv, 'km2')],
      [t('Darker in HV'), withUnit(evidence.darker_km2?.hv, 'km2')],
      [t('Brighter in HH'), withUnit(evidence.brighter_km2?.hh, 'km2')],
      [t('Darker in HH'), withUnit(evidence.darker_km2?.hh, 'km2')],
      [t('Water change'), withUnit(evidence.diff?.water_km2, 'km2')],
      [t('Water change'), withUnit(evidence.diff?.water_pct, '%')],
      [t('Mean HV change'), withUnit(evidence.diff?.mean_hv_db, 'dB')],
    ]
  }
  return [
    [t('Area of the circle'), withUnit(evidence.area_km2, 'km2')],
    [t('With radar data'), withUnit(evidence.with_data_pct, '%')],
    [t('Water'), withUnit(evidence.water_km2, 'km2')],
    [t('Mean HH'), withUnit(evidence.mean_hh_db, 'dB')],
    [t('Mean HV'), withUnit(evidence.mean_hv_db, 'dB')],
    [t('Mean HV:HH'), withUnit(evidence.mean_hv_hh_db, 'dB')],
  ]
}

function numbersTable(rows: [string | HTMLElement, string | null][]): HTMLTableElement {
  return el('table', { class: 'compact' }, [
    el(
      'tbody',
      {},
      rows
        .filter((row): row is [string | HTMLElement, string] => row[1] !== null)
        .map(([label, value]) => el('tr', {}, [el('th', { scope: 'row' }, [label]), el('td', { class: 'num' }, [value])])),
    ),
  ])
}

function terrainMix(rows: TerrainRow[], manifest: Manifest): HTMLElement {
  const colour = (id: number) => manifest.classes.find((terrainClass) => terrainClass.id === id)?.colour ?? 'transparent'
  const bar = el('div', {
    class: 'mix-bar',
    role: 'img',
    ariaLabel: t('Terrain mix: {list}', { list: rows.map((row) => `${t(row.name)} ${row.pct} %`).join(comma) }),
  })
  for (const row of rows) {
    const part = el('span', { title: `${t(row.name)}: ${row.pct} %` })
    part.style.width = `${row.pct}%`
    part.style.background = colour(row.class_id)
    bar.append(part)
  }
  const table = el('table', { class: 'compact' }, [
    el('thead', {}, [el('tr', {}, [el('th', {}, [t('Type')]), el('th', { class: 'num' }, ['km²']), el('th', { class: 'num' }, ['%'])])]),
    el(
      'tbody',
      {},
      rows.map((row) =>
        el('tr', {}, [
          el('td', {}, [swatch(colour(row.class_id)), english(row.name)]),
          el('td', { class: 'num' }, [String(row.km2)]),
          el('td', { class: 'num' }, [String(row.pct)]),
        ]),
      ),
    ),
  ])
  return el('div', {}, [bar, table])
}

function radios(name: string, legend: string, options: [string, string][], current: string, onChange: (value: string) => void) {
  return el('fieldset', { class: 'segmented' }, [
    el('legend', { class: 'visually-hidden' }, [legend]),
    ...options.map(([value, label]) => {
      const input = el('input', { type: 'radio', name, value, checked: value === current })
      input.addEventListener('change', () => onChange(value))
      return el('label', {}, [input, el('span', {}, [label])])
    }),
  ])
}

export function createReading(container: HTMLElement, manifest: Manifest) {
  let token = 0
  let view = 'pair'
  let side = 'a'
  let chart: { destroy(): void } | null = null
  let last: Choice | null = null

  const update = async (choice: Choice) => {
    last = choice
    const mine = ++token
    chart?.destroy()
    chart = null
    const area = choice.area
    if (!area) {
      container.replaceChildren(
        el('h2', {}, [t('Interpretation')]),
        el('p', {}, [t('Choose an area in the list or click a circle on the map to read what the radar shows there.')]),
      )
      return
    }
    const showPair = choice.pair && view === 'pair'
    const date = choice.pair && side === 'b' ? choice.dateB : choice.dateA
    const key = pairKey(choice.dateA, choice.dateB)
    const evidencePath = showPair ? area.evidence?.pairs?.[key] : area.evidence?.dates?.[date]
    const switches = el('div', { class: 'switches' })
    if (choice.pair) {
      switches.append(
        radios('reading-view', t('Reading'), [['date', t('This date')], ['pair', t('A vs B')]], view, (value) => {
          view = value
          update(last!)
        }),
      )
      if (!showPair) {
        switches.append(
          radios(
            'reading-side',
            t('Date'),
            [
              ['a', t('A, {date}', { date: dateShort(choice.dateA) })],
              ['b', t('B, {date}', { date: dateShort(choice.dateB) })],
            ],
            side,
            (value) => {
              side = value
              update(last!)
            },
          ),
        )
      }
    }
    const body = el('div', { class: 'reading-body', ariaBusy: 'true' }, [el('p', { class: 'note' }, [t('Loading...')])])
    container.replaceChildren(el('header', { class: 'reading-head' }, [el('h2', {}, [t(area.name)])]), switches, body)

    const textPath = showPair ? area.texts?.pairs?.[key] : area.texts?.dates?.[date]
    const [evidence, text, series, translation] = await Promise.all([
      loadData<Evidence>(evidencePath),
      loadData<Text>(textPath, keepValueText),
      loadData<Series>(area.series),
      lang !== 'en' && textPath ? loadJson<Translation>(`i18n/${lang}/${textPath}`) : Promise.resolve(null),
    ])
    if (mine !== token) return
    const translated = translation?.translated ? translation : null

    const days = evidence?.days_between ?? daysBetween(choice.dateA, choice.dateB)
    const parts: (Node | string)[] = [
      el('h3', {}, [showPair ? t('{a} to {b}, {n} days', { a: dateShort(choice.dateA), b: dateLong(choice.dateB), n: days }) : dateLong(date)]),
    ]
    if (text) {
      parts.push(el('p', { class: 'byline' }, [t(text.label)]))
      if (lang !== 'en') {
        parts.push(
          el('p', { class: 'note' }, [
            t(translated ? 'Translated by Claude from the checked English text. Its numbers match the English.' : 'Text in English, as generated and checked.'),
          ]),
        )
      }
      parts.push(el('p', { class: 'reading-summary', lang: translated ? lang : 'en' }, [translated?.summary ?? text.summary]))
    } else {
      parts.push(notGenerated(showPair ? 'Comparison text' : 'Interpretation text'))
    }

    const flagDates = showPair ? [choice.dateA, choice.dateB] : [date]
    const flagTexts = flagDates.flatMap((flagDate) =>
      (manifest.dates.find((entry) => entry.date === flagDate)?.flags ?? []).map((code) => [flagDate, manifest.flag_text[code] ?? code]),
    )
    const flagItems = flagTexts.map(([flagDate, flagText]) => el('li', {}, [el('strong', {}, [`${dateLong(flagDate)}: `]), english(flagText)]))
    const caveatItems = (evidence?.caveats ?? [])
      .filter((caveat) => !flagTexts.some(([, flagText]) => caveat.includes(flagText)))
      .map((caveat) => english(caveat, 'li'))
    if (flagItems.length) parts.push(el('ul', { class: 'flag-list' }, flagItems))
    if (caveatItems.length) {
      parts.push(
        el('details', { class: 'caveats' }, [
          el('summary', {}, [t('Caveats ({n})', { n: caveatItems.length })]),
          el('ul', { class: 'caveat-list' }, caveatItems),
        ]),
      )
    }

    parts.push(el('h4', {}, [t('Key numbers')]))
    if (text) {
      parts.push(numbersTable(text.key_numbers.map((number) => [english(number.label), withUnit(number.value, number.unit)])))
    } else if (evidence) {
      parts.push(el('p', { class: 'note' }, [t('Straight from the evidence file.')]), numbersTable(evidenceRows(evidence, showPair)))
    } else {
      parts.push(notGenerated('Key numbers'))
    }

    const terrainRows = showPair ? evidence?.a?.terrain : evidence?.terrain
    parts.push(el('h4', {}, [t('Terrain mix')]), terrainRows?.length ? terrainMix(terrainRows, manifest) : notGenerated('Terrain mix'))

    const water = area.chart === 'water'
    const chartTitle = t(water ? 'Lake area by date (km²)' : 'Mean HV by terrain type (dB)')
    const canvas = el('canvas', { role: 'img' })
    parts.push(el('h4', {}, [chartTitle]))
    const lines = series ? seriesLines(area, series, manifest) : []
    if (series && lines.length) {
      const unit = water ? 'km²' : 'dB'
      canvas.ariaLabel = t(
        '{title}, {n} dates from {from} to {to}. The dashed stretch crosses the period with no data. Flagged dates are amber diamonds. Values are in the table below.',
        { title: chartTitle, n: series.dates.length, from: dateLong(series.dates[0]), to: dateLong(series.dates[series.dates.length - 1]) },
      )
      parts.push(
        el('div', { class: 'chart-box' }, [canvas]),
        el('details', {}, [el('summary', {}, [t('Chart values')]), seriesTable(series, lines, unit)]),
      )
    } else {
      parts.push(notGenerated('Time series'))
    }

    for (const section of translated?.sections ?? text?.sections ?? []) {
      const sectionLang = translated ? lang : 'en'
      parts.push(
        el('h4', { lang: sectionLang }, [section.heading]),
        ...section.text.split(/\n+/).map((paragraph) => el('p', { lang: sectionLang }, [paragraph])),
      )
    }

    parts.push(
      evidence
        ? el('details', { class: 'evidence' }, [
            el('summary', {}, [t('Show evidence')]),
            el('p', { class: 'note' }, [t('File: {path}', { path: `data/${evidencePath}` })]),
            text ? el('p', { class: 'note hash' }, [t('SHA-256 of the evidence used for the text: {hash}', { hash: text.evidence_sha256 })]) : '',
            text?.check
              ? el('p', { class: 'note' }, [
                  t('Number check: {result}, {n} numbers checked by {checker}.', {
                    result: t(text.check.passed ? 'passed' : 'failed'),
                    n: text.check.numbers_checked,
                    checker: text.check.checker,
                  }),
                ])
              : '',
            el('pre', { dir: 'ltr' }, [JSON.stringify(evidence, null, 2)]),
          ])
        : notGenerated('Evidence'),
    )

    body.replaceChildren(...parts)
    body.ariaBusy = 'false'
    if (series && lines.length) {
      const drawn = await drawSeries(
        canvas,
        series,
        lines,
        water ? 'km²' : 'dB',
        manifest,
        showPair ? [{ date: choice.dateA, label: 'A' }, { date: choice.dateB, label: 'B' }] : [{ date, label: choice.pair ? side.toUpperCase() : dateShort(date) }],
      )
      if (mine === token) chart = drawn
      else drawn.destroy()
    }
  }
  return update
}
