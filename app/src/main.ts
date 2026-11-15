import 'maplibre-gl/dist/maplibre-gl.css'
import './style.css'
import { el } from './format'
import { lang, remember, savedTheme, t, type Lang } from './i18n'
import { loadJson } from './load'
import type { AppSettings, Manifest } from './types'

const root = document.documentElement
root.lang = lang
root.dir = lang === 'ar' ? 'rtl' : 'ltr'
root.dataset.theme = savedTheme ?? (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')

const [settings, manifest] = await Promise.all([
  loadJson<AppSettings>('app-settings.json') as Promise<AppSettings>,
  loadJson<Manifest>('data/manifest.json'),
])

document.title = settings.product_name
document.getElementById('product-name')!.textContent = settings.product_name
document.getElementById('statement')!.textContent = t(settings.statement)
for (const [name, hex] of Object.entries(manifest?.colours ?? {})) {
  root.style.setProperty(`--${name}`, hex)
}

const languageNames: [Lang, string, string][] = [
  ['en', 'EN', 'English'],
  ['fr', 'FR', 'Français'],
  ['ar', 'ع', 'العربية'],
]
const languageButtons = languageNames.map(([code, short, name]) => {
  const button = el('button', { type: 'button', lang: code, title: name, ariaLabel: name, ariaPressed: String(code === lang) }, [short])
  button.addEventListener('click', () => {
    remember('rot-lang', code)
    location.reload()
  })
  return button
})
const themeButton = el('button', { type: 'button', class: 'theme-switch' })
const drawTheme = () => {
  const dark = root.dataset.theme === 'dark'
  themeButton.textContent = t(dark ? 'Light mode' : 'Dark mode')
  themeButton.ariaPressed = String(dark)
}
themeButton.addEventListener('click', () => {
  root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
  remember('rot-theme', root.dataset.theme)
  drawTheme()
  window.dispatchEvent(new Event('themechange'))
})
drawTheme()
document
  .getElementById('prefs')!
  .append(el('div', { class: 'languages', role: 'group', ariaLabel: t('Language') }, languageButtons), themeButton)

const starters: Record<string, (panel: HTMLElement) => Promise<void>> = {
  home: (panel) => import('./home').then((m) => m.startHome(panel, settings, manifest)),
  explore: (panel) => import('./explore').then((m) => m.startExplore(panel, manifest)),
  service: (panel) => import('./service').then((m) => m.startService(panel, settings, manifest)),
  method: (panel) => import('./method').then((m) => m.startMethod(panel, settings, manifest)),
}
const tabNames: Record<string, string> = { explore: 'Explore', service: 'Customized Service', method: 'Method & Data' }
const started = new Map<string, Promise<void>>()
const tabs = [...document.querySelectorAll<HTMLButtonElement>('[role=tab]')]
document.querySelector('[role=tablist]')!.ariaLabel = t('Sections')
document.getElementById('panel-home')!.ariaLabel = t('Start')
for (const tab of tabs) tab.textContent = t(tabNames[tab.id.replace('tab-', '')])

function show(target: string) {
  const page = target.split('-')[0] in starters ? target.split('-')[0] : 'home'
  for (const tab of tabs) {
    const chosen = tab.id === `tab-${page}`
    tab.setAttribute('aria-selected', String(chosen))
    tab.tabIndex = chosen || (page === 'home' && tab === tabs[0]) ? 0 : -1
  }
  for (const name of Object.keys(starters)) document.getElementById(`panel-${name}`)!.hidden = name !== page
  if (!started.has(page)) started.set(page, starters[page](document.getElementById(`panel-${page}`)!))
  window.dispatchEvent(new Event('resize'))
  if (target.startsWith(`${page}-`)) started.get(page)!.then(() => document.getElementById(target)?.scrollIntoView())
}

const forward = root.dir === 'rtl' ? 'ArrowLeft' : 'ArrowRight'
const back = root.dir === 'rtl' ? 'ArrowRight' : 'ArrowLeft'
for (const tab of tabs) {
  tab.addEventListener('click', () => (location.hash = tab.id.replace('tab-', '')))
  tab.addEventListener('keydown', (event) => {
    const index = tabs.indexOf(tab)
    const next = { [forward]: index + 1, [back]: index - 1, Home: 0, End: tabs.length - 1 }[event.key]
    if (next === undefined) return
    event.preventDefault()
    const chosen = tabs[(next + tabs.length) % tabs.length]
    chosen.focus()
    location.hash = chosen.id.replace('tab-', '')
  })
}

window.addEventListener('hashchange', () => show(location.hash.slice(1)))
show(location.hash.slice(1))
