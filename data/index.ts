import type { TrekMarker, TrekMarkerCollection, TrekMarkerType } from '@/types'
import markersJson from './markers.json'

const markers = markersJson as TrekMarker[]

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
      },
      geometry: {
        type: 'Point',
        coordinates: marker.coordinates,
      },
    }),
  ),
}
