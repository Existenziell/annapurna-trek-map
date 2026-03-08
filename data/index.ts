import type { TrekMarker, TrekMarkerCollection, TrekMarkerType } from '@/types'
import markersJson from './markers.json'

const FIRST_MARKER_IMAGE = '1.jpg'

function sqDist(a: TrekMarker, b: TrekMarker): number {
  const [x1, y1] = a.coordinates
  const [x2, y2] = b.coordinates
  return (x1 - x2) ** 2 + (y1 - y2) ** 2
}

/** Order markers by nearest-neighbor path so Prev/Next follow the trek. Start from the marker with image "1.jpg". */
function orderMarkersByPath(markers: TrekMarker[]): TrekMarker[] {
  if (markers.length <= 1) return [...markers]
  const startIdx = markers.findIndex((m) => m.image === FIRST_MARKER_IMAGE)
  const start = startIdx >= 0 ? startIdx : 0
  const ordered: TrekMarker[] = [markers[start]]
  const remaining = markers.filter((_, i) => i !== start)
  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1]
    let bestIdx = 0
    let bestSq = sqDist(last, remaining[0])
    for (let i = 1; i < remaining.length; i++) {
      const d = sqDist(last, remaining[i])
      if (d < bestSq) {
        bestSq = d
        bestIdx = i
      }
    }
    ordered.push(remaining[bestIdx])
    remaining.splice(bestIdx, 1)
  }
  return ordered
}

const rawMarkers = markersJson as TrekMarker[]
const markers = orderMarkersByPath(rawMarkers)

export const data: TrekMarkerCollection = {
  type: 'FeatureCollection',
  features: markers.map(
    (marker, idx): TrekMarkerType => ({
      type: 'Feature',
      id: idx + 1,
      properties: {
        altitude: marker.altitude,
        cluster: false,
        event_count: 1,
        venue: 'trek',
        ...(marker.image && { image: marker.image }),
        ...(marker.dateTimeOriginal && {
          exif: { dateTimeOriginal: marker.dateTimeOriginal },
        }),
      },
      geometry: {
        type: 'Point',
        coordinates: marker.coordinates,
      },
    }),
  ),
}
