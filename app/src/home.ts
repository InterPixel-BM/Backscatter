import { dataUrl } from './load'
import { dateLong, el } from './format'
import { comma, t } from './i18n'
import type { AppSettings, Manifest } from './types'

export async function startHome(panel: HTMLElement, settings: AppSettings, manifest: Manifest | null) {
  const hero = manifest?.areas.find((area) => area.hero) ?? manifest?.areas[0]
  const dates = manifest?.dates.map((entry) => entry.date) ?? []
  const shots = (hero?.default_dates ?? [])
    .map((date, index) => ({ date, side: index === 0 ? 'A' : 'B', path: hero?.files.hv?.[date] }))
    .filter((shot) => shot.path)
  const preview = shots.length
    ? el('figure', { class: 'home-preview' }, [
        el(
          'div',
          { class: 'home-shots' },
          shots.map((shot) =>
            el('div', { class: 'home-shot' }, [
              el('img', { src: dataUrl(shot.path!), alt: t('{area}, HV radar, {date}', { area: t(hero!.name), date: dateLong(shot.date) }), width: 240, height: 240 }),
              el('span', { class: 'side-tag' }, [`${shot.side} ${dateLong(shot.date)}`]),
            ]),
          ),
        ),
        el('figcaption', { class: 'note' }, [t('{area}, HV radar on two dates, same stretch on both.', { area: t(hero!.name) })]),
      ])
    : ''

  const lookCard = el('a', { class: 'path-card', href: '#explore' }, [
    el('p', { class: 'caps' }, [t('For anyone curious')]),
    el('h3', {}, [t('Look at the preset maps')]),
    preview,
    el('p', {}, [
      manifest
        ? t('Swipe between {n} NISAR radar dates, {from} to {to}, over {areas}. Every map comes with a short reading, the numbers behind it and its flags.', {
            n: dates.length,
            from: dateLong(dates[0]),
            to: dateLong(dates[dates.length - 1]),
            areas: manifest.areas.map((area) => t(area.name)).join(comma),
          })
        : t('Radar layers: not generated yet.'),
    ]),
    el('span', { class: 'button primary' }, [t('Explore the maps')]),
  ])

  const askCard = el('a', { class: 'path-card', href: '#service' }, [
    el('p', { class: 'caps' }, [t('For agencies, companies and researchers')]),
    el('h3', {}, [t('Ask for a custom interpretation')]),
    el('p', {}, [t('A concept for a future service: describe your own area, your dates and the decision the radar should help with.')]),
    el('ul', { class: 'path-list' }, [
      el('li', {}, [t('Area of interest: a centre on the map and a radius')]),
      el('li', {}, [t('Time horizon and service type')]),
      el('li', {}, [t('Report language: English, French or Arabic')]),
    ]),
    el('p', { class: 'note' }, [t('In this prototype the request is prepared as a file. Nothing is sent, sold or stored.')]),
    el('span', { class: 'button' }, [t('Prepare a request')]),
  ])

  const source = manifest?.source
  const members = settings.team_members.map((member) => member.name).join(comma)
  panel.append(
    el('div', { class: 'home' }, [
      el('h2', {}, [t('What would you like to do?')]),
      el('div', { class: 'paths' }, [lookCard, askCard]),
      el('p', { class: 'home-foot note' }, [
        source ? t('{sensor}, {wavelength} cm wavelength, {px} m pixels, one pass every {days} days.', { sensor: source.sensor, wavelength: source.wavelength_cm, px: source.pixel_m, days: source.repeat_days }) : '',
        ' ',
        el('a', { href: '#method-pixels' }, [source ? t('Why {px} m pixels?', { px: source.pixel_m }) : t('Method & Data')]),
        ' ',
        el('a', { href: '#method' }, [t('How every number is made')]),
      ]),
      el('p', { class: 'home-foot note' }, [`${settings.team_name}${members ? ` (${members})` : ''}, `, el('span', {}, [t(settings.event)])]),
    ]),
  )
}
