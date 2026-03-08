import type { MapboxMap, TrekMarkerCollection } from '@/types'
import { FLY_CURVE, FLY_DURATION_MS } from '@/lib/constants'
import { computeTargetZoom } from '@/lib/mapZoom'

export interface FlyToMarkerOptions {
  /** When set, zoom is reduced for short hops from this marker. */
  fromMarkerId?: number
}

export function flyToMarker(
  map: MapboxMap,
  markerId: number,
  data: TrekMarkerCollection,
  options?: FlyToMarkerOptions,
): void {
  const marker = data.features.find((f) => Number(f.id) === markerId)
  if (!marker) return
  const [lng, lat] = marker.geometry.coordinates
  const fromMarker =
    options?.fromMarkerId != null
      ? data.features.find((f) => Number(f.id) === options.fromMarkerId) ?? null
      : null
  const zoom = computeTargetZoom(marker, data, fromMarker ?? undefined)
  map.flyTo({
    center: [lng, lat],
    zoom,
    duration: FLY_DURATION_MS,
    curve: FLY_CURVE,
    essential: true,
  })
}
