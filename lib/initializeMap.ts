import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import type {
  Map as MapboxMapType,
  MapLayerMouseEvent,
  MapMouseEvent,
} from 'mapbox-gl'
import { Popup } from 'mapbox-gl'
import type { InitializeMapOptions, TrekMarkerType } from '@/types'

function getTrekSource(
  map: MapboxMapType,
): { getClusterExpansionZoom: (id: number, cb: (err: Error | null, zoom?: number) => void) => void } | undefined {
  return map.getSource('trek') as
    | { getClusterExpansionZoom: (id: number, cb: (err: Error | null, zoom?: number) => void) => void }
    | undefined
}

export function initializeMap(
  map: MapboxMapType,
  options: InitializeMapOptions = {},
): void {
  const { onMarkerClick } = options

  map.on('click', 'data', (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, { layers: ['data'] })
    const first = features[0]
    if (!first?.properties?.cluster_id) return
    const clusterId = first.properties.cluster_id as number
    const coords = (first.geometry as GeoJSON.Point).coordinates
    getTrekSource(map)?.getClusterExpansionZoom(clusterId, (err: Error | null, zoom?: number) => {
      if (err) return
      map.easeTo({
        center: [coords[0], coords[1]],
        zoom: zoom ?? 0,
      })
    })
  })

  map.on('click', 'clusters', (e: MapMouseEvent) => {
    const features = map.queryRenderedFeatures(e.point, {
      layers: ['clusters'],
    })
    const first = features[0]
    if (!first?.properties?.cluster_id) return
    const clusterId = first.properties.cluster_id as number
    const coords = (first.geometry as GeoJSON.Point).coordinates
    getTrekSource(map)?.getClusterExpansionZoom(clusterId, (err: Error | null, zoom?: number) => {
      if (err) return
      map.easeTo({
        center: [coords[0], coords[1]],
        zoom: zoom ?? 0,
        essential: true,
      })
    })
  })

  map.on('click', 'unclustered-point', (e: MapLayerMouseEvent) => {
    const marker = e.features?.[0] as TrekMarkerType | undefined
    if (!marker) return
    onMarkerClick?.(marker)
  })

  map.on('mouseenter', 'unclustered-point', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseenter', 'clusters', () => {
    map.getCanvas().style.cursor = 'pointer'
  })
  map.on('mouseleave', 'unclustered-point', () => {
    map.getCanvas().style.cursor = ''
  })
  map.on('mouseleave', 'clusters', () => {
    map.getCanvas().style.cursor = ''
  })

  map.on('contextmenu', (e: MapMouseEvent) => {
    e.preventDefault()
    const { lng, lat } = e.lngLat
    new Popup({ closeButton: true, closeOnClick: false })
      .setLngLat([lng, lat])
      .setHTML(
        `<div class="text-sm"><strong>Longitude</strong> ${lng.toFixed(6)}<br/><strong>Latitude</strong> ${lat.toFixed(6)}</div>`,
      )
      .addTo(map)
  })
}
