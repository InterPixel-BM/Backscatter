import { distanceKm } from './geo'
import type { Corners } from './types'

type Reviver = (this: unknown, key: string, value: unknown) => unknown

const cache = new Map<string, Promise<unknown>>()
const widths = new Map<string, Promise<number>>()

export async function imagePixelM(url: string, corners: Corners): Promise<number> {
  if (!widths.has(url)) {
    widths.set(
      url,
      new Promise((resolve) => {
        const image = new Image()
        image.onload = () => resolve(image.naturalWidth)
        image.onerror = () => resolve(0)
        image.src = url
      }),
    )
  }
  const width = await widths.get(url)!
  return width ? (distanceKm(corners[0], corners[1]) * 1000) / width : 0
}

export const keepValueText = function (key: string, value: unknown, context?: { source?: string }) {
  return key === 'value' && typeof value === 'number' && context?.source ? context.source : value
} as Reviver

export function loadJson<T>(path: string, reviver?: Reviver): Promise<T | null> {
  if (!cache.has(path)) {
    cache.set(
      path,
      fetch(path)
        .then((response) =>
          response.ok && response.headers.get('content-type')?.includes('json')
            ? response.text().then((text) => JSON.parse(text, reviver))
            : null,
        )
        .catch(() => null),
    )
  }
  return cache.get(path) as Promise<T | null>
}

export function dataUrl(path: string): string {
  return `data/${path}`
}

export function loadData<T>(path: string | undefined, reviver?: Reviver): Promise<T | null> {
  return path ? loadJson<T>(dataUrl(path), reviver) : Promise.resolve(null)
}
