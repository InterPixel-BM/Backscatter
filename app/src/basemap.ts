import { setWorkerUrl, type StyleSpecification } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import { cssColour } from './format'

setWorkerUrl(workerUrl)

const positron = 'https://tiles.openfreemap.org/styles/positron'

interface Basemap {
  style: StyleSpecification
  online: boolean
}

let basemap: Promise<Basemap> | null = null

function plainStyle(): StyleSpecification {
  return {
    version: 8,
    sources: {},
    layers: [{ id: 'paper', type: 'background', paint: { 'background-color': cssColour('paper-deep') } }],
  }
}

export function loadBasemap(): Promise<Basemap> {
  basemap ??= fetch(positron, { signal: AbortSignal.timeout(6000) })
    .then((response) => response.json() as Promise<StyleSpecification>)
    .then((style) => ({ style, online: true }))
    .catch(() => ({ style: plainStyle(), online: false }))
  return basemap.then(({ style, online }) => ({ style: structuredClone(style), online }))
}
