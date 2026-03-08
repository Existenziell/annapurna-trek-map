import type {
  MapboxMap,
  MapLayerOptions,
  TrekMarkerCollection,
} from '@/types'
import { DEFAULT_MAP_LAYER_OPTIONS } from '@/types'
import {
  DEFAULT_CIRCLE_STROKE_COLOR,
  DEFAULT_SYMBOL_TEXT_COLOR,
  SELECTED_MARKER_STROKE_COLOR,
} from '@/lib/constants'

function addTerrain(map: MapboxMap, options: MapLayerOptions): void {
  if (map.getSource('mapbox-dem')) return
  map.addSource('mapbox-dem', {
    type: 'raster-dem',
    url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
    tileSize: 512,
    maxzoom: 14,
  })
  map.setTerrain({
    source: 'mapbox-dem',
    exaggeration: options.terrainExaggeration,
  })
}

function addSky(map: MapboxMap, options: MapLayerOptions): void {
  if (map.getLayer('sky')) return
  map.addLayer({
    id: 'sky',
    type: 'sky',
    paint: {
      'sky-type': options.skyType,
      'sky-atmosphere-sun': options.skyAtmosphereSun,
      'sky-atmosphere-sun-intensity': options.skyAtmosphereSunIntensity,
    },
  })
}

function addTrekLayers(
  map: MapboxMap,
  data: TrekMarkerCollection,
  options: MapLayerOptions,
): void {
  if (map.getSource('trek')) return
  map.addSource('trek', {
    type: 'geojson',
    data,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
    clusterProperties: {
      sum: ['+', ['get', 'event_count']],
    },
  })

  map.addLayer({
    id: 'clusters',
    type: 'circle',
    source: 'trek',
    filter: ['has', 'point_count'],
    paint: {
      'circle-color': options.clusterColor,
      'circle-radius': ['step', ['get', 'point_count'], 20, 100, 30, 750, 40],
      'circle-opacity': options.circleOpacity,
      'circle-stroke-width': 4,
      'circle-stroke-color': DEFAULT_CIRCLE_STROKE_COLOR,
      'circle-stroke-opacity': options.clusterStrokeOpacity,
    },
  })

  map.addLayer({
    id: 'cluster-count',
    type: 'symbol',
    source: 'trek',
    filter: ['has', 'point_count'],
    layout: {
      'text-field': '{sum}',
      'text-font': ['Open Sans Bold'],
      'text-size': 16,
    },
    paint: {
      'text-color': DEFAULT_SYMBOL_TEXT_COLOR,
    },
  })

  map.addLayer({
    id: 'unclustered-point',
    type: 'circle',
    source: 'trek',
    filter: ['!', ['has', 'point_count']],
    paint: {
      'circle-radius': ['step', ['get', 'event_count'], 20, 100, 30, 750, 40],
      'circle-color': options.clusterColor,
      'circle-opacity': options.circleOpacity,
      'circle-stroke-width': 4,
      'circle-stroke-color': DEFAULT_CIRCLE_STROKE_COLOR,
      'circle-stroke-opacity': options.clusterStrokeOpacity,
    },
  })

  // Selected marker: drawn before event-count so the number label stays on top.
  // Use ['id'] for feature's top-level id (not ['get', 'id'] which reads properties).
  map.addLayer({
    id: 'selected-marker',
    type: 'circle',
    source: 'trek',
    filter: ['all', ['!', ['has', 'point_count']], ['==', ['id'], -1]],
    paint: {
      'circle-radius': 28,
      'circle-color': options.clusterColor,
      'circle-opacity': options.circleOpacity,
      'circle-stroke-width': 5,
      'circle-stroke-color': SELECTED_MARKER_STROKE_COLOR,
      'circle-stroke-opacity': 1,
    },
  })

  map.addLayer({
    id: 'event-count',
    type: 'symbol',
    source: 'trek',
    filter: ['!', ['has', 'point_count']],
    layout: {
      'text-field': '{event_count}',
      'text-font': ['Open Sans Bold'],
      'text-size': 16,
    },
    paint: {
      'text-color': DEFAULT_SYMBOL_TEXT_COLOR,
    },
  })
}

export function addDataLayer(
  map: MapboxMap,
  data: TrekMarkerCollection,
  options: MapLayerOptions = DEFAULT_MAP_LAYER_OPTIONS,
): void {
  addTerrain(map, options)
  addSky(map, options)
  addTrekLayers(map, data, options)
}
