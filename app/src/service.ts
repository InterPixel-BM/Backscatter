import { Map as MapLibre, Marker, type GeoJSONSource } from 'maplibre-gl'
import { loadBasemap } from './basemap'
import { bounds, circleFeature } from './geo'
import { addDays, cssColour, dateShort, el } from './format'
import { locale, t } from './i18n'
import type { AppSettings, LngLat, Manifest } from './types'

type Control = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement

const sectors = ['Water agency', 'Agriculture office', 'Insurance', 'Research', 'Other']
const languages = [
  { value: 'en', label: 'English', name: 'English' },
  { value: 'fr', label: 'Français', name: 'French' },
  { value: 'ar', label: 'العربية', name: 'Arabic' },
]
const weekdayName = new Intl.DateTimeFormat('en-GB', { weekday: 'long', timeZone: 'UTC' })
const weekdayShort = new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' })

function callDay(date: string): string {
  return `${weekdayShort.format(new Date(date))} ${dateShort(date)}`
}

function minutes(clock: string): number {
  const [hours, mins] = clock.split(':').map(Number)
  return hours * 60 + mins
}

function clock(total: number): string {
  return `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

function callDays(settings: AppSettings): { date: string; times: string[] }[] {
  const today = new Intl.DateTimeFormat('en-CA', { timeZone: settings.call_timezone }).format(new Date())
  const days = []
  for (let offset = 1; offset <= settings.call_booking_days_ahead; offset++) {
    const date = addDays(today, offset)
    const weekday = weekdayName.format(new Date(date))
    const times = settings.call_hours
      .filter((hours) => hours.weekday === weekday)
      .flatMap((hours) => {
        const starts = []
        for (let start = minutes(hours.from); start + settings.call_slot_minutes <= minutes(hours.to); start += settings.call_slot_minutes) {
          starts.push(clock(start))
        }
        return starts
      })
    if (times.length) days.push({ date, times })
  }
  return days
}

function field(control: Control, label: string, hint = ''): HTMLElement {
  const describedBy = [hint ? `${control.id}-hint` : '', `${control.id}-error`].filter(Boolean).join(' ')
  control.setAttribute('aria-describedby', describedBy)
  return el('div', { class: 'field' }, [
    el('label', { htmlFor: control.id }, [t(label)]),
    hint ? el('p', { class: 'hint', id: `${control.id}-hint` }, [t(hint)]) : '',
    control,
    el('p', { class: 'error', id: `${control.id}-error` }),
  ])
}

function group(id: string, legend: string, children: (Node | string)[]): HTMLFieldSetElement {
  const set = el('fieldset', { class: 'choice-group', id }, [el('legend', {}, [t(legend)]), ...children])
  set.append(el('p', { class: 'error', id: `${id}-error` }))
  set.setAttribute('aria-describedby', `${id}-error`)
  return set
}

function section(title: string, children: (Node | string)[]): HTMLFieldSetElement {
  return el('fieldset', { class: 'form-section' }, [el('legend', { class: 'caps' }, [title]), ...children])
}

export async function startService(panel: HTMLElement, settings: AppSettings, manifest: Manifest | null) {
  const input = (id: string, type = 'text', extra: Partial<HTMLInputElement> = {}) => el('input', { id, name: id, type, ...extra })
  const organisation = input('rq-organisation', 'text', { autocomplete: 'organization' })
  const sector = el('select', { id: 'rq-sector', name: 'rq-sector' }, [
    el('option', { value: '' }, [t('Choose a sector')]),
    ...sectors.map((name) => el('option', { value: name }, [t(name)])),
  ])
  const contact = input('rq-contact', 'text', { autocomplete: 'name' })
  const email = input('rq-email', 'email', { autocomplete: 'email' })
  const phone = input('rq-phone', 'tel', { autocomplete: 'tel' })
  const region = input('rq-region', 'text', { autocomplete: 'country-name' })
  const place = input('rq-place')
  const lat = input('rq-lat', 'number', { step: 'any', min: '-90', max: '90', inputMode: 'decimal' })
  const lon = input('rq-lon', 'number', { step: 'any', min: '-180', max: '180', inputMode: 'decimal' })
  const radius = input('rq-radius', 'number', { step: 'any', min: '0', inputMode: 'decimal' })
  const from = input('rq-from', 'date')
  const to = input('rq-to', 'date')
  const problem = el('textarea', { id: 'rq-problem', name: 'rq-problem', rows: 5 })
  const callDate = el('select', { id: 'rq-call-date', name: 'rq-call-date' })
  const callTime = el('select', { id: 'rq-call-time', name: 'rq-call-time' })
  const consent = input('rq-consent', 'checkbox')
  for (const control of [email, phone, lat, lon, radius]) control.dir = 'ltr'

  const repeatDays = manifest?.source.repeat_days
  const monitoring = repeatDays ? t('Monitoring at each NISAR pass (every {n} days)', { n: repeatDays }) : t('Monitoring at each NISAR pass')
  const serviceNames: [string, string][] = [
    ['Terrain interpretation', t('Terrain interpretation')],
    ['Change comparison between dates', t('Change comparison between dates')],
    ['Monitoring at each NISAR pass', monitoring],
    ['Other (describe in the problem field)', t('Other (describe in the problem field)')],
  ]
  const services = serviceNames.map(([value]) => el('input', { type: 'checkbox', name: 'services', value }))
  const servicesGroup = group(
    'rq-services',
    'Service type (choose one or more)',
    services.map((box, index) => el('label', { class: 'choice' }, [box, ` ${serviceNames[index][1]}`])),
  )
  const languageBoxes = languages.map((language, index) =>
    el('input', { type: 'radio', name: 'language', value: language.value, checked: index === 0 }),
  )
  const languageGroup = group(
    'rq-language',
    'Report language',
    languageBoxes.map((box, index) =>
      el('label', { class: 'choice inline' }, [
        box,
        ` ${languages[index].value.toUpperCase()} `,
        el('span', { lang: languages[index].value }, [languages[index].label]),
      ]),
    ),
  )
  const consentGroup = group('rq-consent-group', 'Consent', [
    el('label', { class: 'choice' }, [
      consent,
      t(' I agree that {team} uses these details only to answer this request and prepare the call.', { team: settings.team_name }),
    ]),
  ])

  const days = callDays(settings)
  callDate.append(el('option', { value: '' }, [t('Choose a day')]), ...days.map((day) => el('option', { value: day.date }, [callDay(day.date)])))
  const fillTimes = () => {
    const day = days.find((candidate) => candidate.date === callDate.value)
    callTime.replaceChildren(
      el('option', { value: '' }, [t(day ? 'Choose a time' : 'Choose a day first')]),
      ...(day?.times ?? []).map((start) =>
        el('option', { value: start }, [t('{start} to {end}', { start, end: clock(minutes(start) + settings.call_slot_minutes) })]),
      ),
    )
  }
  callDate.addEventListener('change', fillTimes)
  fillTimes()
  const slotsMissing = days.length === 0
  callDate.disabled = slotsMissing
  callTime.disabled = slotsMissing

  const mapBox = el('div', { class: 'pick-map' })
  const prototypeNote = () => el('p', { class: 'prototype-note' }, [t('Prototype: requests are not stored or sent automatically.')])

  const form = el('form', { class: 'request', noValidate: true }, [
    section(t('Who is asking'), [
      el('div', { class: 'field-row' }, [field(organisation, 'Organisation'), field(sector, 'Sector')]),
      el('div', { class: 'field-row' }, [field(contact, 'Contact name'), field(email, 'Email')]),
      el('div', { class: 'field-row' }, [field(phone, 'Phone (optional)'), field(region, 'Country or region')]),
    ]),
    section(t('Area of interest'), [
      field(place, 'Place name'),
      el('p', { class: 'hint' }, [t('Click the map to set the centre, or type its coordinates. Drag the pin to move it.')]),
      mapBox,
      el('div', { class: 'field-row three' }, [field(lat, 'Centre latitude'), field(lon, 'Centre longitude'), field(radius, 'Radius (km)')]),
    ]),
    section(t('What you need'), [
      el('div', { class: 'field-row' }, [field(from, 'Time horizon, from'), field(to, 'to')]),
      servicesGroup,
      field(problem, 'Problem description', 'What decision should the radar help with? What do you already know about the area?'),
      languageGroup,
    ]),
    slotsMissing
      ? ''
      : section(t('Discovery call ({n} minutes, {zone})', { n: settings.call_slot_minutes, zone: settings.call_timezone_label }), [
          el('div', { class: 'field-row' }, [field(callDate, 'Day'), field(callTime, 'Time')]),
        ]),
    consentGroup,
    el('div', { class: 'form-actions' }, [el('button', { class: 'button primary', type: 'submit' }, [t('Review request')]), prototypeNote()]),
  ])

  const confirmation = el('section', { class: 'confirmation', hidden: true, ariaLabel: t('Request summary') })
  const intro = el('div', { class: 'service-intro' }, [
    el('h2', {}, [t('Customized Service')]),
    el('p', {}, [
      t(
        'A concept for a future service: an agency could ask for radar maps of its own area and dates, with a terrain interpretation, change comparisons between dates, and monitoring at each NISAR pass, every {n} days, anywhere NISAR covers.',
        { n: repeatDays ?? '' },
      ),
    ]),
    el('p', {}, [t('It would be meant for water agencies, agriculture offices, insurers and researchers.')]),
    el('p', {}, [
      slotsMissing
        ? t('This form shows what such a request would contain. You can fill it in and download it as a file.')
        : t('Send the request below and book a {n}-minute discovery call. On the call we go through your area, your dates and what the radar can and cannot show there.', {
            n: settings.call_slot_minutes,
          }),
    ]),
    el('p', { class: 'note' }, [t('Nothing is sold or offered here. Explore shows the preset areas only; no custom analysis runs in this prototype.')]),
    prototypeNote(),
  ])

  panel.append(el('div', { class: 'service' }, [intro, el('div', { class: 'service-main' }, [form, confirmation])]))

  const map = new MapLibre({
    container: mapBox,
    style: (await loadBasemap()).style,
    center: [0, 20],
    zoom: 1,
    bounds: manifest ? bounds(manifest.overview.corners) : undefined,
    fitBoundsOptions: { padding: 10 },
    attributionControl: { compact: true },
  })
  const marker = new Marker({ color: cssColour('ink'), draggable: true })
  const centre = (): LngLat | null => {
    const point: LngLat = [lon.valueAsNumber, lat.valueAsNumber]
    return point.every(Number.isFinite) && Math.abs(point[1]) <= 90 && Math.abs(point[0]) <= 180 ? point : null
  }
  const redraw = () => {
    const point = centre()
    const source = map.getSource<GeoJSONSource>('pick')
    if (point) marker.setLngLat(point).addTo(map)
    else marker.remove()
    source?.setData({
      type: 'FeatureCollection',
      features: point && radius.valueAsNumber > 0 ? [circleFeature(point, radius.valueAsNumber)] : [],
    })
  }
  const setCentre = (point: { lng: number; lat: number }) => {
    lat.value = point.lat.toFixed(5)
    lon.value = point.lng.toFixed(5)
    for (const control of [lat, lon]) control.dispatchEvent(new Event('input', { bubbles: true }))
    map.easeTo({ center: point, zoom: Math.max(map.getZoom(), 7) })
  }
  map.on('load', () => {
    map.addSource('pick', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
    map.addLayer({ id: 'pick-fill', type: 'fill', source: 'pick', paint: { 'fill-color': cssColour('ink'), 'fill-opacity': 0.06 } })
    map.addLayer({ id: 'pick-line', type: 'line', source: 'pick', paint: { 'line-color': cssColour('ink'), 'line-width': 1.5 } })
    redraw()
  })
  map.on('click', (event) => setCentre(event.lngLat))
  marker.on('dragend', () => setCentre(marker.getLngLat()))
  for (const control of [lat, lon, radius]) control.addEventListener('input', redraw)

  const setError = (id: string, message: string) => {
    const error = document.getElementById(`${id}-error`)!
    error.textContent = message ? `${t('Check: ')}${message}` : ''
    document.getElementById(id)!.setAttribute('aria-invalid', String(message !== ''))
  }
  const checks: [Control | HTMLFieldSetElement, () => string][] = [
    [organisation, () => (organisation.value.trim() ? '' : t('Enter the organisation name.'))],
    [sector, () => (sector.value ? '' : t('Choose a sector.'))],
    [contact, () => (contact.value.trim() ? '' : t('Enter a contact name.'))],
    [email, () => (email.value.trim() && email.validity.valid ? '' : t('Enter an email address, for example name@agency.org.'))],
    [region, () => (region.value.trim() ? '' : t('Enter a country or region.'))],
    [place, () => (place.value.trim() ? '' : t('Enter a place name.'))],
    [lat, () => (centre() ? '' : t('Click the map or type a latitude between -90 and 90.'))],
    [lon, () => (centre() ? '' : t('Type a longitude between -180 and 180.'))],
    [radius, () => (radius.valueAsNumber > 0 ? '' : t('Enter a radius in km, greater than 0.'))],
    [from, () => (from.value ? '' : t('Choose a start date.'))],
    [to, () => (!to.value ? t('Choose an end date.') : to.value <= from.value ? t('The end date must be after the start date.') : '')],
    [servicesGroup, () => (services.some((box) => box.checked) ? '' : t('Choose at least one service type.'))],
    [problem, () => (problem.value.trim() ? '' : t('Describe the problem in a few sentences.'))],
    ...(slotsMissing
      ? []
      : ([
          [callDate, () => (callDate.value ? '' : t('Choose a day for the call.'))],
          [callTime, () => (callTime.value ? '' : t('Choose a time for the call.'))],
        ] as [Control, () => string][])),
    [consentGroup, () => (consent.checked ? '' : t('Tick the box to agree.'))],
  ]

  for (const [control, check] of checks) {
    const recheck = () => {
      if (control.getAttribute('aria-invalid') === 'true') setError(control.id, check())
    }
    control.addEventListener('input', recheck)
    control.addEventListener('change', recheck)
  }

  const request = () => {
    const language = languages.find((option) => option.value === languageBoxes.find((box) => box.checked)!.value)!
    return {
      created_utc: new Date().toISOString(),
      organisation: organisation.value.trim(),
      sector: sector.value,
      contact_name: contact.value.trim(),
      email: email.value.trim(),
      phone: phone.value.trim() || null,
      country_or_region: region.value.trim(),
      area: { place_name: place.value.trim(), center_lon: lon.valueAsNumber, center_lat: lat.valueAsNumber, radius_km: radius.valueAsNumber },
      time_horizon: { from: from.value, to: to.value },
      services: services.filter((box) => box.checked).map((box) => box.value),
      problem: problem.value.trim(),
      report_language: `${language.name} (${language.value.toUpperCase()})`,
      discovery_call: slotsMissing
        ? null
        : { date: callDate.value, start: callTime.value, minutes: settings.call_slot_minutes, timezone: settings.call_timezone },
      consent: consent.checked,
    }
  }

  const showConfirmation = () => {
    const sent = request()
    const call = sent.discovery_call
    const chosen = services.flatMap((box, index) => (box.checked ? [serviceNames[index][1]] : []))
    const rows: [string, string][] = [
      [t('Organisation'), sent.organisation],
      [t('Sector'), t(sent.sector)],
      [t('Contact name'), sent.contact_name],
      [t('Email'), sent.email],
      [t('Phone'), sent.phone ?? t('not given')],
      [t('Country or region'), sent.country_or_region],
      [t('Place name'), sent.area.place_name],
      [t('Centre (lat, lon)'), `${lat.value}, ${lon.value}`],
      [t('Radius'), `${radius.value} km`],
      [t('Time horizon'), `${sent.time_horizon.from} → ${sent.time_horizon.to}`],
      [t('Services'), chosen.join('; ')],
      [t('Problem'), sent.problem],
      [t('Report language'), sent.report_language],
      ...(call
        ? [
            [
              t('Discovery call'),
              `${callDay(call.date)}, ${t('{start} to {end}', { start: call.start, end: clock(minutes(call.start) + call.minutes) })} (${settings.call_timezone_label})`,
            ] as [string, string],
          ]
        : []),
      [t('Consent'), t('given')],
    ]
    const json = JSON.stringify(sent, null, 2)
    const download = el('button', { class: 'button', type: 'button' }, [t('Download request (JSON)')])
    download.addEventListener('click', () => {
      const link = el('a', {
        href: URL.createObjectURL(new Blob([json], { type: 'application/json' })),
        download: `request-${sent.created_utc.slice(0, 10)}.json`,
      })
      link.click()
    })
    const subject = `Customized Service request: ${sent.organisation}`
    const body = rows.map(([label, value]) => `${label}: ${value}`).join('\n')
    const mail = settings.contact_email
      ? el('a', { class: 'button primary', href: `mailto:${settings.contact_email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` }, [
          t('Send by email'),
        ])
      : null
    if (!mail) download.classList.add('primary')
    const edit = el('button', { class: 'button', type: 'button' }, [t('Edit request')])
    edit.addEventListener('click', () => {
      confirmation.hidden = true
      form.hidden = false
      organisation.focus()
    })
    const heading = el('h2', { tabIndex: -1 }, [t('Request ready to send')])
    confirmation.replaceChildren(
      heading,
      el('p', {}, [
        mail
          ? t('Check the details. Nothing has left this page yet. Download the request or open it in your email program.')
          : t('Check the details. Nothing has left this page yet. Download the request as a file.'),
      ]),
      el('table', { class: 'request-summary' }, [
        el(
          'tbody',
          {},
          rows.map(([label, value]) => el('tr', {}, [el('th', { scope: 'row' }, [label]), el('td', {}, [value])])),
        ),
      ]),
      el('div', { class: 'form-actions' }, [download, ...(mail ? [mail] : []), edit]),
      prototypeNote(),
    )
    form.hidden = true
    confirmation.hidden = false
    heading.focus()
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const invalid = checks.filter(([control, check]) => {
      const message = check()
      setError(control.id, message)
      return message !== ''
    })
    if (invalid.length === 0) {
      showConfirmation()
      return
    }
    const first = invalid[0][0]
    ;(first instanceof HTMLFieldSetElement ? first.querySelector('input')! : first).focus()
  })
}
