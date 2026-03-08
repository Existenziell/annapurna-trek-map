import type { TrekMarker, TrekMarkerCollection, TrekMarkerType } from '@/types'
import markersJson from './markers.json'

function isVideoOnly(m: TrekMarker): boolean {
  return Boolean(m.video && !m.image)
}

/** Order markers by dateTime ascending; video-only (no image) at the end. */
function orderMarkersByDateTime(markers: TrekMarker[]): TrekMarker[] {
  const withImage = markers.filter((m) => !isVideoOnly(m))
  const videoOnly = markers.filter(isVideoOnly)
  withImage.sort((a, b) => {
    const da = a.dateTime ?? ''
    const db = b.dateTime ?? ''
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return da.localeCompare(db)
  })
  return [...withImage, ...videoOnly]
}

const rawMarkers = markersJson as TrekMarker[]
const markers = orderMarkersByDateTime(rawMarkers)

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
        ...(marker.video && { video: marker.video }),
        ...(marker.dateTime && { dateTime: marker.dateTime }),
        ...(marker.desc !== undefined && { desc: marker.desc }),
      },
      geometry: {
        type: 'Point',
        coordinates: marker.coordinates,
      },
    }),
  ),
}
