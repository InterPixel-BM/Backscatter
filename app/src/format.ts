import { months, t } from './i18n'

const dayMs = 86_400_000

export function dateShort(iso: string): string {
  const [, month, day] = iso.slice(0, 10).split('-')
  return `${day} ${months[Number(month) - 1]}`
}

export function dateLong(iso: string): string {
  return `${dateShort(iso)} ${iso.slice(0, 4)}`
}

export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(b) - Date.parse(a)) / dayMs)
}

export function pairKey(a: string, b: string): string {
  return `${a}_${b}`
}

export function addDays(iso: string, days: number): string {
  return new Date(Date.parse(iso) + days * dayMs).toISOString().slice(0, 10)
}

export function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  props: Partial<HTMLElementTagNameMap[K]> & { class?: string } = {},
  children: (Node | string)[] = [],
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag)
  const { class: className, ...rest } = props
  if (className) node.className = className
  Object.assign(node, rest)
  node.append(...children)
  return node
}

export function cssColour(name: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(`--${name}`).trim()
}

export function swatch(colour: string): HTMLElement {
  const mark = el('span', { class: 'swatch', ariaHidden: 'true' })
  mark.style.background = colour
  return mark
}

export function notGenerated(what: string): HTMLElement {
  return el('p', { class: 'missing' }, [t('{what}: not generated yet.', { what: t(what) })])
}
