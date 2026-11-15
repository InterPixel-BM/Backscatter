import { distanceKm } from './geo'
import { dataUrl, imagePixelM, loadJson } from './load'
import { dateLong, el, notGenerated, swatch } from './format'
import { comma, lang, t, untranslated } from './i18n'
import type { AppSettings, Manifest, Method } from './types'

const steps = [
  ['Measure', 'code', 'Clean the radar, sort terrain into classes with our k-means model, map water, measure change, compute statistics.'],
  ['Evidence', 'code', 'Write one JSON file per area and date, and per area and date pair, with every number a text may use.'],
  ['Interpret', 'Claude', 'Claude writes each text from its evidence file only, with fixed templates. It sees statistics, never images.'],
  ['Check', 'code', 'A script pulls every number and date out of each text and rejects the text if one is not in its evidence.'],
  ['Display', 'app', 'The text, its key numbers, the label and the full evidence are shown together.'],
]

const gcovSpacing = [
  [5, 80],
  [20, 20],
  [40, 10],
  [77, 20],
]
const gcovGuide = 'https://nisar-docs.asf.alaska.edu/gcov/'

function block(title: string, children: (Node | string)[], values: Record<string, string | number> = {}, id = ''): HTMLElement {
  return el('section', { class: 'method-block', id }, [el('h3', {}, [t(title, values)]), ...children])
}

function english(text: string): HTMLElement {
  return el('span', untranslated(text) ? { lang: 'en' } : {}, [t(text)])
}

function table(head: string[], rows: (string | number | Node)[][], numeric: number[] = []): HTMLTableElement {
  const cell = (tag: 'th' | 'td', value: string | number | Node, index: number) =>
    el(tag, { class: numeric.includes(index) ? 'num' : '' }, [typeof value === 'number' ? String(value) : value])
  return el('table', {}, [
    el('thead', {}, [el('tr', {}, head.map((label, index) => cell('th', t(label), index)))]),
    el('tbody', {}, rows.map((row) => el('tr', {}, row.map((value, index) => cell('td', value, index))))),
  ])
}

export async function startMethod(panel: HTMLElement, settings: AppSettings, manifest: Manifest | null) {
  const method = await loadJson<Method>('data/method.json')
  const source = manifest?.source
  const texts = manifest?.areas.flatMap((area) => Object.values(area.texts?.dates ?? {}).concat(Object.values(area.texts?.pairs ?? {})))

  const pipeline = el(
    'ol',
    { class: 'pipeline' },
    steps.map(([name, who, text], index) =>
      el('li', {}, [
        el('span', { class: 'step-no' }, [String(index + 1)]),
        el('strong', {}, [t(name)]),
        el('span', { class: 'step-who' }, [t(who)]),
        el('p', {}, [t(text)]),
      ]),
    ),
  )

  const nisar = block('NISAR radar, HH and HV', [
    source
      ? el('p', {}, [
          t(
            "NISAR carries an L-band radar with a wavelength of {cm} cm. It sends its own microwave pulses, so it sees the ground through cloud and at night. We use {sensor} data, track {track}, {px} m pixels, one pass every {days} days. Areas are measured in the radar's own grid, {crs}.",
            { cm: source.wavelength_cm, sensor: source.sensor, track: source.track, px: source.pixel_m, days: source.repeat_days, crs: source.crs_measure ?? '' },
          ),
        ])
      : notGenerated('Sensor details'),
    el('p', {}, [t('HH: sent horizontal, received horizontal. Calm water reflects the pulse away from the radar and looks dark. Rough ground and buildings send more back.')]),
    el('p', {}, [
      t(
        'HV: sent horizontal, received vertical. The signal changes polarisation when it bounces around inside a volume such as a crop canopy or shrubs, so HV rises with vegetation and stays low on water and smooth bare soil.',
      ),
    ]),
    el('p', {}, [t('HV:HH is the ratio of the two. All values are backscatter in dB, averaged in linear power before converting to dB.')]),
    manifest
      ? el('p', {}, [
          t('Dates used ({n}): {dates}. NISAR has no data from {from} to {to}.', {
            n: manifest.dates.length,
            dates: manifest.dates.map((entry) => dateLong(entry.date)).join(comma),
            from: dateLong(manifest.no_data_window[0]),
            to: dateLong(manifest.no_data_window[1]),
          }),
        ])
      : notGenerated('Date list'),
    method?.speckle
      ? el('p', {}, [
          t('Speckle filter: {filter}. Pixels used in every comparison: valid on all dates, {pct} % of the window.', {
            filter: t(method.speckle),
            pct: method.common_valid_pct ?? '',
          }),
        ])
      : notGenerated('Speckle and valid pixels'),
  ])

  const px = source?.pixel_m ?? 0
  const filterPx = Number(method?.speckle?.match(/(\d+)x\1/)?.[1] ?? 0)
  const overviewPath = manifest?.overview.files.hv?.[manifest.dates[0].date]
  const overviewM = manifest && overviewPath ? Math.round(await imagePixelM(dataUrl(overviewPath), manifest.overview.corners)) : 0
  const corners = manifest?.overview.corners
  const pixels = source
    ? block(
        'Pixel size: why {px} m',
        [
          el('p', {}, [
            t(
              'We did not pick {px} m: it is the grid NASA delivers for our data. NISAR recorded track {track} in its 20 MHz mode, written 2005 in every file name (20 MHz on the main band, frequency A, which we use; 5 MHz on the second band). For a 20 MHz acquisition the GCOV product is posted at {px} m.',
              { px, track: source.track },
            ),
          ]),
          el('div', { class: 'fit' }, [
            table(
              ['Range bandwidth (MHz)', 'GCOV pixel (m)', ''],
              gcovSpacing.map(([mhz, metres]) =>
                mhz === 20 ? [el('strong', {}, [String(mhz)]), el('strong', {}, [String(metres)]), el('strong', {}, [t('our data')])] : [mhz, metres, ''],
              ),
              [0, 1],
            ),
          ]),
          el('p', {}, [
            t(
              'How NASA makes it: the single-look radar image has samples about 5 m apart along the track and 6.25 m apart across it, in slant range. GCOV averages the samples that fall in each {px} m cell (multi-looking), corrects the brightness for terrain (gamma-0) and projects the result to UTM. Averaging also lowers speckle, the grain of radar images.',
              { px },
            ),
          ]),
          el('p', {}, [
            t(
              'What we did: we read only our window from the frequency A grid, cut on {px} m boundaries, and never resampled the radar. One pixel in our numbers is one NASA pixel, in {crs}.',
              { px, crs: source.crs_measure ?? '' },
            ),
            corners
              ? ` ${t('The window is about {w} km by {h} km.', { w: Math.round(distanceKm(corners[0], corners[1])), h: Math.round(distanceKm(corners[0], corners[3])) })}`
              : '',
            ` ${t('The optical photos (HLS, 30 m) were moved onto the radar grid, not the radar onto the photos.')}`,
          ]),
          el('p', {}, [
            t(
              'Why we kept it: a finer grid would only repeat the same values, and a coarser one would merge small fields and the lake shore. Areas are counted in whole pixels: one pixel is {m2} m², {km2} km².',
              { m2: px * px, km2: (px * px) / 1e6 },
            ),
            filterPx ? ` ${t('The speckle filter mixes {n} × {n} pixels, {w} m × {w} m, so details narrower than that blur.', { n: filterPx, w: filterPx * px })}` : '',
          ]),
          el('p', {}, [
            t('On the map, area images are at the full {px} m.', { px }),
            overviewM ? ` ${t('The whole-window images are shrunk to about {m} m per image pixel so the page loads fast; no number is measured on them.', { m: overviewM })}` : '',
          ]),
          el('p', { class: 'note' }, [t('Source: '), el('a', { href: gcovGuide, target: '_blank', rel: 'noopener' }, [t('ASF, NISAR GCOV product guide')]), '.']),
        ],
        { px },
        'method-pixels',
      )
    : notGenerated('Sensor details')

  const terrain = method?.terrain
  const terrainBlock = block('Terrain types, our model', [
    terrain
      ? el('div', {}, [
          el('p', {}, [
            t(
              'k-means clustering with these features: {features}. Tested k = {tested}; chosen k = {k}. Each cluster was named by comparing it with the optical photo.',
              { features: (terrain.features ?? []).join('; '), tested: (terrain.k_tested ?? []).join(comma), k: terrain.k_chosen ?? '' },
            ),
          ]),
          table(['Agreement check', '%'], (terrain.agreement ?? []).map((row) => [english(row.check), row.pct]), [1]),
        ])
      : notGenerated('Terrain model numbers'),
    manifest?.classes.length
      ? table(
          ['Class', 'Why it looks this way in HH and HV'],
          manifest.classes.map((terrainClass) => [
            el('span', { class: 'nowrap' }, [swatch(terrainClass.colour), english(terrainClass.name)]),
            english(terrainClass.signature),
          ]),
        )
      : notGenerated('Terrain classes'),
  ])

  const water = method?.water
  const waterBlock = block('Water', [
    water
      ? el('div', {}, [
          el('p', {}, [t('Mapped from {pol} only.', { pol: water.pol ?? '' }), ' ', english(water.method ?? '')]),
          el('p', {}, [
            t(
              'A date is flagged when the lake area changes by more than {pct} % from the previous date, or its threshold moves by more than {db} dB. These limits are our method choice.',
              { pct: water.flag_area_jump_pct ?? '', db: water.flag_threshold_jump_db ?? '' },
            ),
          ]),
        ])
      : notGenerated('Water method numbers'),
  ])

  const change = method?.change
  const changeBlock = block('Change between two dates', [
    change
      ? el('div', {}, [
          el('p', {}, [
            t(
              'Per-pixel difference in dB on the filtered radar. Brighter: more than +{up} dB. Darker: less than {down} dB. These thresholds are our method choice.',
              { up: change.brighter_db ?? '', down: change.darker_db ?? '' },
            ),
          ]),
          el('p', {}, [
            t(
              'Stable-target check: median backscatter over the built-up class on each date. Buildings should change little, so a shift there points to weather or processing rather than land change.',
            ),
          ]),
          table(['Date', 'HH dB', 'HV dB'], (change.stable_target ?? []).map((row) => [dateLong(row.date), row.hh_db, row.hv_db]), [1, 2]),
        ])
      : notGenerated('Change method numbers'),
  ])

  const flagRows = Object.entries(manifest?.flag_text ?? {}).map(([code, text]) => {
    const dates = manifest!.dates.filter((entry) => entry.flags.includes(code)).map((entry) => dateLong(entry.date))
    return el('li', {}, [english(text), '. ', el('strong', {}, [dates.length ? dates.join(comma) : t('no date')])])
  })
  const caveats = block('Caveats and flags', [
    method?.caveats?.length ? el('ul', {}, method.caveats.map((text) => el('li', {}, [english(text)]))) : notGenerated('Caveats'),
    flagRows.length ? el('ul', { class: 'flag-list' }, flagRows) : notGenerated('Flags'),
  ])

  const ai = block('About the texts', [
    el('p', {}, [
      t(
        'The interpretation and comparison texts are written by Claude (Anthropic) from the evidence file of each area and date. The model receives numbers only, never the radar images. Possible causes are labelled as such, and flagged dates are described with lower confidence.',
      ),
    ]),
    el('p', {}, [
      t(
        'In this prototype the texts are generated in advance, because live calls need a paid API key and a server. The templates are the same ones a live service would send to the Claude API, for any area.',
      ),
    ]),
    el('p', {}, [
      t(
        'A script rejects any text that contains a number or date missing from its evidence file. It does not check that a sentence uses a number correctly, so the evidence and the key numbers are shown next to every text.',
      ),
    ]),
    lang === 'en'
      ? ''
      : el('p', {}, [t('The texts were written in English. The French and Arabic versions are translations whose numbers are checked against the English.')]),
    texts?.length ? el('p', {}, [t('Texts in this build: {n}.', { n: texts.length })]) : notGenerated('Texts'),
  ])

  const photoSensors = [...new Set((manifest?.optical_dates ?? []).flatMap((photo) => (photo.sensor ? [photo.sensor] : [])))]
  const credits = block('Data and credits', [
    method?.credits?.length
      ? el('ul', {}, [
          ...method.credits.map((credit) => {
            const details = Object.keys(credit).filter((key) => credit[key] === null)
            return el('li', {}, [english(`${credit.what}: ${credit.from}${details.length ? ` (${details.join(', ')})` : ''}`)])
          }),
          photoSensors.length ? el('li', {}, [t('Optical photos near the radar dates: {sensors}, from NASA LP DAAC.', { sensors: photoSensors.join(comma) })]) : '',
          el('li', {}, [t('Pixel spacing by bandwidth: ASF, NISAR GCOV product guide, {url}', { url: gcovGuide })]),
        ])
      : notGenerated('Data credits'),
  ])

  const team = block('Team', [
    el('p', {}, [`${settings.team_name}, `, english(settings.event), '.']),
    settings.team_members.length ? el('ul', {}, settings.team_members.map((member) => el('li', {}, [member.role ? `${member.name}, ${member.role}` : member.name]))) : '',
  ])

  panel.append(
    el('div', { class: 'method' }, [
      el('h2', {}, [t('Method & Data')]),
      el('p', { class: 'lead' }, [t('How every map, number and sentence in Explore is made, and where it can be wrong.')]),
      block('From radar to text in five steps', [pipeline]),
      nisar,
      pixels,
      terrainBlock,
      waterBlock,
      changeBlock,
      caveats,
      ai,
      credits,
      team,
    ]),
  )
}
