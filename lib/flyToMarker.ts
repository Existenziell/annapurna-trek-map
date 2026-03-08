import type { MapboxMap, TrekMarkerCollection } from '@/types'
import { FLY_CURVE, FLY_DURATION_MS, MARKER_ZOOM } from '@/lib/constants'

export function flyToMarker(
  map: MapboxMap,
  markerId: number,
  data: TrekMarkerCollection,
): void {
  const marker = data.features.find((f) => Number(f.id) === markerId)
  if (!marker) return
  const [lng, lat] = marker.geometry.coordinates
  map.flyTo({
    center: [lng, lat],
    zoom: MARKER_ZOOM,
    duration: FLY_DURATION_MS,
    curve: FLY_CURVE,
    essential: true,
  })
}
