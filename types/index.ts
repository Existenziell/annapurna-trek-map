import type { Map as MapboxMapType } from 'mapbox-gl'
import { SVGProps } from 'react'

/** Mapbox map instance used across lib and hooks */
export type MapboxMap = MapboxMapType

/** EXIF data extracted from trek image (optional, from extract-exif script) */
export interface MarkerExif {
  dateTimeOriginal?: string
  gps?: { latitude: number; longitude: number; altitude?: number }
  make?: string
  model?: string
}

/** Single trek marker (raw data before GeoJSON) */
export interface TrekMarker {
  altitude: number
  coordinates: [number, number]
  image?: string
  exif?: MarkerExif
}

/** Properties on a trek marker (GeoJSON feature) */
export interface TrekMarkerProperties {
  altitude: number
  cluster: boolean
  event_count: number
  venue: string
  image?: string
  exif?: MarkerExif
}

/** Trek point marker (GeoJSON Feature with our properties) */
export interface TrekMarkerType {
  type: 'Feature'
  id: number
  properties: TrekMarkerProperties
  geometry: {
    type: 'Point'
    coordinates: [number, number]
  }
}

/** Feature collection of trek markers (Mapbox/GeoJSON use "features" key) */
export interface TrekMarkerCollection {
  type: 'FeatureCollection'
  features: TrekMarkerType[]
}

/** Optional map options for initializing the map */
export interface MapboxMapOptions {
  center?: [number, number]
  zoom?: number
  pitch?: number
  style?: string
}

/** Options for terrain, sky, and trek layers (used by addDataLayer) */
export interface MapLayerOptions {
  terrainExaggeration: number
  skyType: 'atmosphere' | 'gradient'
  skyAtmosphereSun: [number, number]
  skyAtmosphereSunIntensity: number
  clusterColor: string
  clusterStrokeOpacity: number
  circleOpacity: number
}

/** Full settings (map style + layer options) for UI and localStorage */
export interface MapSettings extends MapLayerOptions {
  mapStyle: string
}

export const DEFAULT_MAP_LAYER_OPTIONS: MapLayerOptions = {
  terrainExaggeration: 0.5,
  skyType: 'atmosphere',
  skyAtmosphereSun: [0.0, 0.0],
  skyAtmosphereSunIntensity: 15,
  clusterColor: '#282b29',
  clusterStrokeOpacity: 0.5,
  circleOpacity: 0.75,
}

import { DEFAULT_MAP_STYLE } from '@/lib/constants'

export const DEFAULT_MAP_SETTINGS: MapSettings = {
  ...DEFAULT_MAP_LAYER_OPTIONS,
  mapStyle: DEFAULT_MAP_STYLE,
}

/** Known map style URLs for validation */
export const MAP_STYLE_OPTIONS: { value: string; label: string }[] = [
  { value: 'mapbox://styles/mapbox/satellite-v9', label: 'Satellite' },
  { value: 'mapbox://styles/mapbox/streets-v12', label: 'Streets' },
  { value: 'mapbox://styles/mapbox/outdoors-v12', label: 'Outdoors' },
  { value: 'mapbox://styles/mapbox/light-v11', label: 'Light' },
  { value: 'mapbox://styles/mapbox/dark-v11', label: 'Dark' },
]

/** Direction for popup navigation */
export type PopupDirection = 'prev' | 'next'

/** Props for the Icon component */
export interface IconProps extends SVGProps<SVGSVGElement> {
  className?: string
}

/** Options for initializeMap (e.g. onMarkerClick callback) */
export interface InitializeMapOptions {
  onMarkerClick?: (marker: TrekMarkerType) => void
}

/** Shape of settings when stored in localStorage */
export interface StoredSettings {
  version: number
  settings: MapSettings
}

/** Props for the MarkerDetail component */
export interface MarkerDetailProps {
  marker: TrekMarkerType
  onPrev: () => void
  onNext: () => void
  hasPrev: boolean
  hasNext: boolean
}

/** Props for the ContentTab component */
export interface ContentTabProps {
  selectedMarker: TrekMarkerType | null
  onPrev: () => void
  onNext: () => void
  onStartTrek: () => void
}

/** Props for the RightPanel component */
export interface RightPanelProps {
  selectedMarker: TrekMarkerType | null
  onPrev: () => void
  onNext: () => void
  onStartTrek: () => void
  settings: MapSettings
  onSettingsChange: (settings: MapSettings) => void
}

/** Tab identifiers for the right panel */
export type RightPanelTabId = 'content' | 'settings'

/** Props for the SettingsTab component */
export interface SettingsTabProps {
  settings: MapSettings
  onChange: (settings: MapSettings) => void
}
