import type { TrekMarker, TrekMarkerCollection, TrekMarkerType } from '@/types'
import markersJson from './markers.json'

/** Order all markers by dateTime ascending; markers without dateTime last. */
function orderMarkersByDateTime(markers: TrekMarker[]): TrekMarker[] {
  return [...markers].sort((a, b) => {
    const da = a.dateTime ?? ''
    const db = b.dateTime ?? ''
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return da.localeCompare(db)
  })
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
        ...(marker.external !== undefined && { external: marker.external }),
      },
      geometry: {
        type: 'Point',
        coordinates: marker.coordinates,
      },
    }),
  ),
}
