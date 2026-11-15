import type { Corners, LngLat } from './types'

const earthRadiusKm = 6371.0088

export function circle(center: LngLat, radiusKm: number): LngLat[] {
  const [lon, lat] = center.map((degrees) => (degrees * Math.PI) / 180)
  const angular = radiusKm / earthRadiusKm
  const ring: LngLat[] = []
  for (let step = 0; step <= 128; step++) {
    const bearing = (step / 128) * 2 * Math.PI
    const lat2 = Math.asin(Math.sin(lat) * Math.cos(angular) + Math.cos(lat) * Math.sin(angular) * Math.cos(bearing))
    const lon2 =
      lon +
      Math.atan2(Math.sin(bearing) * Math.sin(angular) * Math.cos(lat), Math.cos(angular) - Math.sin(lat) * Math.sin(lat2))
    ring.push([(lon2 * 180) / Math.PI, (lat2 * 180) / Math.PI])
  }
  return ring
}

export function distanceKm(a: LngLat, b: LngLat): number {
  const [lon1, lat1, lon2, lat2] = [...a, ...b].map((degrees) => (degrees * Math.PI) / 180)
  const h = Math.sin((lat2 - lat1) / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2
  return 2 * earthRadiusKm * Math.asin(Math.sqrt(h))
}

export function bounds(points: LngLat[] | Corners): [LngLat, LngLat] {
  const lons = points.map((point) => point[0])
  const lats = points.map((point) => point[1])
  return [
    [Math.min(...lons), Math.min(...lats)],
    [Math.max(...lons), Math.max(...lats)],
  ]
}

export function circleFeature(center: LngLat, radiusKm: number, properties: Record<string, string | boolean> = {}) {
  return {
    type: 'Feature' as const,
    properties,
    geometry: { type: 'Polygon' as const, coordinates: [circle(center, radiusKm)] },
  }
}
