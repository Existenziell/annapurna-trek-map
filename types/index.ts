import type { Map as MapboxMapType } from 'mapbox-gl'
import type { MouseEvent, SVGProps } from 'react'

/** Mapbox map instance used across lib and hooks */
export type MapboxMap = MapboxMapType

/** EXIF data extracted from trek image (optional, from extract-exif script) */
export interface MarkerExif {
  dateTime?: string
  gps?: { latitude: number; longitude: number; altitude?: number }
  make?: string
  model?: string
}

/** Single trek marker (raw data before GeoJSON) */
export interface TrekMarker {
  altitude: number
  coordinates: [number, number]
  image?: string
  video?: string
  dateTime?: string
  desc?: string
  /** If true, video is an external embed (e.g. Vimeo ID or URL). Default false. */
  external?: boolean
}

/** Properties on a trek marker (GeoJSON feature) */
export interface TrekMarkerProperties {
  altitude: number
  cluster: boolean
  event_count: number
  venue: string
  image?: string
  video?: string
  dateTime?: string
  desc?: string
  exif?: MarkerExif
  /** If true, video is an external embed (e.g. Vimeo). Default false. */
  external?: boolean
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
  projection?: 'globe' | 'mercator'
}

/** Options for terrain, sky, and trek layers (used by addDataLayer) */
export interface MapLayerOptions {
  terrainExaggeration: number
  skyType: 'atmosphere' | 'gradient'
  skyAtmosphereSun: [number, number]
  skyAtmosphereSunIntensity: number
  fogColor: string
  fogHighColor: string
  fogSpaceColor: string
  fogStarIntensity: number
  fogHorizonBlend: number
  clusterColor: string
  clusterStrokeOpacity: number
  circleOpacity: number
  selectedMarkerStrokeColor: string
}

/** Full settings (map style + layer options) for UI and localStorage */
export interface MapSettings extends MapLayerOptions {
  mapStyle: string
  projection: 'globe' | 'mercator'
}

export const DEFAULT_MAP_LAYER_OPTIONS: MapLayerOptions = {
  terrainExaggeration: 0.5,
  skyType: 'atmosphere',
  skyAtmosphereSun: [0.0, 0.0],
  skyAtmosphereSunIntensity: 15,
  fogColor: '#bad2eb',
  fogHighColor: '#245cdf',
  fogSpaceColor: '#0b0b19',
  fogStarIntensity: 0.35,
  fogHorizonBlend: 0.2,
  clusterColor: '#282b29',
  clusterStrokeOpacity: 0.5,
  circleOpacity: 0.75,
  selectedMarkerStrokeColor: SELECTED_MARKER_STROKE_COLOR,
}

import {
  DEFAULT_MAP_STYLE,
  MAP_PROJECTION,
  SELECTED_MARKER_STROKE_COLOR,
} from '@/lib/constants'

export const DEFAULT_MAP_SETTINGS: MapSettings = {
  ...DEFAULT_MAP_LAYER_OPTIONS,
  mapStyle: DEFAULT_MAP_STYLE,
  projection: MAP_PROJECTION,
}

export const PROJECTION_OPTIONS: { value: 'globe' | 'mercator'; label: string }[] = [
  { value: 'globe', label: 'Globe' },
  { value: 'mercator', label: 'Mercator' },
]

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
  settings: MapSettings
}

/** Props for the MarkerView component */
export interface MarkerViewProps {
  marker: TrekMarkerType
  onPrev: () => void
  onNext: () => void
  onResizeHandleMouseDown?: (e: MouseEvent<HTMLElement>) => void
  onFullscreenChange?: (isOpen: boolean) => void
}

/** Props for the ImagePanel component */
export interface ImagePanelProps {
  selectedMarker: TrekMarkerType | null
  onPrev: () => void
  onNext: () => void
  onResizeHandleMouseDown?: (e: MouseEvent<HTMLElement>) => void
  onFullscreenChange?: (isOpen: boolean) => void
}

/** Props for the SettingsPanel component */
export interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  settings: MapSettings
  onChange: (settings: MapSettings) => void
}

/** Props for the Nav component (prev/next marker) */
export interface NavProps {
  onPrev: () => void
  onNext: () => void
  selectedMarkerId: number
  totalMarkers: number
}
