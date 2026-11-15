import { Map as MapLibre, Marker, NavigationControl, ScaleControl, type GeoJSONSource, type ImageSource } from 'maplibre-gl'
import { loadBasemap } from './basemap'
import { bounds, circle, circleFeature } from './geo'
import { cssColour, el } from './format'
import { t } from './i18n'
import type { Area, Corners, Manifest } from './types'

export interface Picture {
  key: 'overview' | 'backdrop' | 'area'
  url: string
  corners: Corners
  crisp: boolean
}

export interface Tag {
  text: string
  flagged: boolean
}

const pictureKeys = ['overview', 'backdrop', 'area'] as const
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')

function degrees(value: number, positive: string, negative: string): string {
  return `${Math.abs(value).toFixed(4)}° ${value >= 0 ? positive : negative}`
}

export async function createSheet(stage: HTMLElement, scaleBox: HTMLElement, cursor: HTMLElement, manifest: Manifest | null) {
  const boxes = [el('div', { class: 'map map-a' }), el('div', { class: 'map map-b' })]
  const handle = el('div', {
    class: 'swipe',
    role: 'slider',
    tabIndex: 0,
    ariaLabel: t('Swipe line between Date A (left) and Date B (right)'),
    ariaValueMin: '0',
    ariaValueMax: '100',
  }, [el('span', { class: 'swipe-grip', ariaHidden: 'true' }, ['A | B'])])
  const tags = [el('span', { class: 'side-tag left' }), el('span', { class: 'side-tag right' })]
  const status = el('p', { class: 'map-status', role: 'status', hidden: true })
  stage.append(...boxes, handle, ...tags, status)
  handle.hidden = true

  const start = manifest
    ? { bounds: bounds(manifest.overview.corners), fitBoundsOptions: { padding: 16 } }
    : { center: [0, 20] as [number, number], zoom: 1 }
  const basemaps = await Promise.all(boxes.map(() => loadBasemap()))
  const maps = boxes.map(
    (container, index) =>
      new MapLibre({
        container,
        style: basemaps[index].style,
        ...start,
        attributionControl: { compact: true },
        dragRotate: false,
        pitchWithRotate: false,
        maxPitch: 0,
      }),
  )
  const pending = new Set<string>()
  let failed = false
  const drawStatus = () => {
    const parts = [
      basemaps[0].online ? '' : t('Basemap offline: radar layers only.'),
      pending.size ? t('Loading radar image...') : '',
      failed ? t('A radar image could not be loaded.') : '',
    ].filter(Boolean)
    status.textContent = parts.join(' ')
    status.hidden = parts.length === 0
  }
  drawStatus()
  maps.forEach((map, index) => {
    map.on('sourcedata', (event) => {
      if (event.isSourceLoaded && pending.delete(`${index}:${event.sourceId}`)) drawStatus()
    })
    map.on('error', (event) => {
      if (pending.delete(`${index}:${(event as { sourceId?: string }).sourceId}`)) {
        failed = true
        drawStatus()
      }
    })
  })
  for (const map of maps) {
    map.touchZoomRotate.disableRotation()
    map.keyboard.disableRotation()
    map.addControl(new NavigationControl({ showCompass: false }), 'top-right')
  }
  scaleBox.append(new ScaleControl({ maxWidth: 140, unit: 'metric' }).onAdd(maps[0]))
  boxes[1].hidden = true

  let leader = 0
  boxes.forEach((box, index) => {
    for (const type of ['pointerdown', 'wheel', 'keydown', 'touchstart']) {
      box.addEventListener(type, () => (leader = index), { capture: true, passive: true })
    }
  })
  maps.forEach((map, index) =>
    map.on('move', () => {
      if (index === leader) maps[1 - index].jumpTo({ center: map.getCenter(), zoom: map.getZoom() })
    }),
  )

  const idle = cursor.textContent ?? ''
  for (const map of maps) {
    map.on('mousemove', (event) => {
      cursor.textContent = t('Cursor {lat}, {lon}', { lat: degrees(event.lngLat.lat, t('N'), t('S')), lon: degrees(event.lngLat.lng, t('E'), t('W')) })
    })
    map.getCanvasContainer().addEventListener('mouseleave', () => {
      cursor.textContent = idle
    })
  }

  const ready = Promise.all(maps.map((map) => (map.isStyleLoaded() ? Promise.resolve() : new Promise((resolve) => map.once('style.load', resolve)))))
  await ready
  for (const map of maps) {
    map.addSource('areas', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } })
    map.addLayer({ id: 'areas-fill', type: 'fill', source: 'areas', paint: { 'fill-color': cssColour('ink'), 'fill-opacity': 0 } })
    map.addLayer({
      id: 'areas-casing',
      type: 'line',
      source: 'areas',
      paint: { 'line-color': cssColour('paper'), 'line-width': ['case', ['get', 'selected'], 5, 3.5], 'line-opacity': 0.9 },
    })
    map.addLayer({
      id: 'areas-line',
      type: 'line',
      source: 'areas',
      paint: { 'line-color': cssColour('ink'), 'line-width': ['case', ['get', 'selected'], 2.5, 1.2] },
    })
  }

  const shown = maps.map(() => new Map<string, string>())
  let opacity = 1
  let split = 0.5
  const labels: HTMLElement[][] = maps.map(() => [])
  const declutter = () => {
    for (const [index, group] of labels.entries()) {
      const placed: DOMRect[] = []
      const frame = boxes[index].getBoundingClientRect()
      const ordered = [...group].sort((a, b) => Number(b.classList.contains('selected')) - Number(a.classList.contains('selected')))
      for (const label of ordered) {
        label.style.visibility = 'visible'
        const box = label.getBoundingClientRect()
        const cut = box.left < frame.left || box.right > frame.right || box.top < frame.top || box.bottom > frame.bottom
        const clash = cut || placed.some((other) => box.left < other.right && box.right > other.left && box.top < other.bottom && box.bottom > other.top)
        label.style.visibility = clash ? 'hidden' : 'visible'
        if (!clash) placed.push(box)
      }
    }
  }
  const areas = manifest?.areas ?? []

  const setSplit = (value: number) => {
    split = Math.min(1, Math.max(0, value))
    const percent = `${(split * 100).toFixed(1)}%`
    boxes[1].style.clipPath = `inset(0 0 0 ${percent})`
    handle.style.left = percent
    handle.ariaValueNow = String(Math.round(split * 100))
    handle.ariaValueText = t('{n} % of the width shows Date A', { n: Math.round(split * 100) })
  }
  setSplit(split)

  handle.addEventListener('pointerdown', (event) => {
    handle.setPointerCapture(event.pointerId)
  })
  handle.addEventListener('pointermove', (event) => {
    if (!handle.hasPointerCapture(event.pointerId)) return
    const frame = stage.getBoundingClientRect()
    setSplit((event.clientX - frame.left) / frame.width)
  })
  handle.addEventListener('keydown', (event) => {
    const step = event.shiftKey ? 0.1 : 0.02
    const next = {
      ArrowLeft: split - step,
      ArrowDown: split - step,
      ArrowRight: split + step,
      ArrowUp: split + step,
      PageDown: split - 0.1,
      PageUp: split + 0.1,
      Home: 0,
      End: 1,
    }[event.key]
    if (next === undefined) return
    event.preventDefault()
    setSplit(next)
  })

  const place = (index: number, pictures: Picture[]) => {
    const map = maps[index]
    for (const key of pictureKeys) {
      const id = `picture-${key}`
      const picture = pictures.find((candidate) => candidate.key === key)
      const signature = picture ? `${picture.url}|${picture.crisp}` : ''
      if (shown[index].get(key) === signature) continue
      shown[index].set(key, signature)
      const source = map.getSource<ImageSource>(id)
      const pendingKey = `${index}:${id}`
      if (!picture) {
        if (map.getLayer(id)) map.removeLayer(id)
        if (source) map.removeSource(id)
        pending.delete(pendingKey)
        continue
      }
      pending.add(pendingKey)
      failed = false
      if (source) {
        source.updateImage({ url: picture.url, coordinates: picture.corners })
        map.setPaintProperty(id, 'raster-resampling', picture.crisp ? 'nearest' : 'linear')
        continue
      }
      map.addSource(id, { type: 'image', url: picture.url, coordinates: picture.corners })
      map.addLayer(
        {
          id,
          type: 'raster',
          source: id,
          paint: {
            'raster-opacity': opacity,
            'raster-fade-duration': 0,
            'raster-resampling': picture.crisp ? 'nearest' : 'linear',
          },
        },
        pictureKeys
          .slice(pictureKeys.indexOf(key) + 1)
          .map((above) => `picture-${above}`)
          .find((above) => map.getLayer(above)) ?? 'areas-fill',
      )
    }
    drawStatus()
  }

  return {
    maps,
    show(left: Picture[], right: Picture[] | null, sideTags: Tag[]) {
      place(0, left)
      const pair = right !== null
      const appearing = pair && boxes[1].hidden
      boxes[1].hidden = !pair
      handle.hidden = !pair
      tags[1].hidden = !pair
      sideTags.forEach((tag, index) => {
        tags[index].textContent = tag.text
        tags[index].classList.toggle('flagged', tag.flagged)
      })
      if (appearing) {
        maps[1].resize()
        maps[1].jumpTo({ center: maps[0].getCenter(), zoom: maps[0].getZoom() })
      }
      if (pair) place(1, right)
    },
    setOpacity(value: number) {
      opacity = value
      for (const map of maps) {
        for (const key of pictureKeys) {
          if (map.getLayer(`picture-${key}`)) map.setPaintProperty(`picture-${key}`, 'raster-opacity', value)
        }
      }
    },
    restyle() {
      for (const map of maps) {
        map.setPaintProperty('areas-casing', 'line-color', cssColour('paper'))
        map.setPaintProperty('areas-line', 'line-color', cssColour('ink'))
      }
    },
    drawAreas(onPick: (id: string) => void) {
      maps.forEach((map, index) => {
        for (const area of areas) {
          const tag = el('span', { class: 'area-label' }, [t(area.name)])
          tag.dataset.area = area.id
          labels[index].push(tag)
          new Marker({ element: tag, anchor: 'bottom-right' }).setLngLat(circle(area.center, area.radius_km)[112]).addTo(map)
        }
        map.on('moveend', declutter)
        map.on('click', 'areas-fill', (event) => {
          const id = event.features?.[0]?.properties?.id
          if (typeof id === 'string') onPick(id)
        })
        map.on('mouseenter', 'areas-fill', () => {
          map.getCanvas().style.cursor = 'pointer'
        })
        map.on('mouseleave', 'areas-fill', () => {
          map.getCanvas().style.cursor = ''
        })
      })
      declutter()
    },
    select(selected: string | null) {
      const circles = {
        type: 'FeatureCollection' as const,
        features: areas.map((area) => circleFeature(area.center, area.radius_km, { id: area.id, selected: area.id === selected })),
      }
      for (const map of maps) map.getSource<GeoJSONSource>('areas')!.setData(circles)
      for (const label of labels.flat()) label.classList.toggle('selected', label.dataset.area === selected)
      declutter()
    },
    fly(area: Area | null) {
      const target = area ? bounds(circle(area.center, area.radius_km)) : manifest ? bounds(manifest.overview.corners) : null
      if (target) {
        leader = 0
        maps[0].fitBounds(target, { padding: { top: 60, bottom: 30, left: 30, right: 30 }, duration: reducedMotion.matches ? 0 : 1400 })
      }
    },
  }
}

export type Sheet = Awaited<ReturnType<typeof createSheet>>
