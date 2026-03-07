import type { MapboxMap, MapSettings } from '@/types'
import {
  DEFAULT_CIRCLE_STROKE_COLOR,
  DEFAULT_SYMBOL_TEXT_COLOR,
} from '@/lib/constants'

export function applyLayerPaint(
  map: MapboxMap,
  settings: MapSettings,
): void {
  map.setTerrain({
    source: 'mapbox-dem',
    exaggeration: settings.terrainExaggeration,
  })
  if (map.getLayer('sky')) {
    map.setPaintProperty('sky', 'sky-type', settings.skyType)
    map.setPaintProperty('sky', 'sky-atmosphere-sun', settings.skyAtmosphereSun)
    map.setPaintProperty(
      'sky',
      'sky-atmosphere-sun-intensity',
      settings.skyAtmosphereSunIntensity,
    )
  }
  if (map.getLayer('clusters')) {
    map.setPaintProperty('clusters', 'circle-color', settings.clusterColor)
    map.setPaintProperty('clusters', 'circle-opacity', settings.circleOpacity)
    map.setPaintProperty(
      'clusters',
      'circle-stroke-color',
      DEFAULT_CIRCLE_STROKE_COLOR,
    )
    map.setPaintProperty(
      'clusters',
      'circle-stroke-opacity',
      settings.clusterStrokeOpacity,
    )
  }
  if (map.getLayer('unclustered-point')) {
    map.setPaintProperty(
      'unclustered-point',
      'circle-color',
      settings.clusterColor,
    )
    map.setPaintProperty(
      'unclustered-point',
      'circle-opacity',
      settings.circleOpacity,
    )
    map.setPaintProperty(
      'unclustered-point',
      'circle-stroke-color',
      DEFAULT_CIRCLE_STROKE_COLOR,
    )
    map.setPaintProperty(
      'unclustered-point',
      'circle-stroke-opacity',
      settings.clusterStrokeOpacity,
    )
  }
  if (map.getLayer('cluster-count')) {
    map.setPaintProperty(
      'cluster-count',
      'text-color',
      DEFAULT_SYMBOL_TEXT_COLOR,
    )
  }
  if (map.getLayer('event-count')) {
    map.setPaintProperty(
      'event-count',
      'text-color',
      DEFAULT_SYMBOL_TEXT_COLOR,
    )
  }
}
