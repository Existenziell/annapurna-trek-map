/** Centralized constants for the Annapurna Trek Map app. */

export const MAP_CONTAINER_ID = 'map'
export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/satellite-v9'
export const MAP_PROJECTION = 'globe' as const

export const DEFAULT_MAP_CENTER: [number, number] = [84.1, 28.5]
export const DEFAULT_MAP_ZOOM = 9.5
export const DEFAULT_MAP_PITCH = 45

export const INTRO_ZOOM = 1
export const INTRO_FLY_DURATION_MS = 10000
export const INTRO_FLY_CURVE = 0.8

export const FINAL_VIEW = {
  center: DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  pitch: DEFAULT_MAP_PITCH,
} as const

export const FLY_DURATION_MS = 4000
export const FLY_CURVE = 3.5
export const MARKER_ZOOM = 14.5
export const MARKER_ZOOM_MIN = 11
export const MARKER_ZOOM_MAX = 17
export const MARKER_ZOOM_REF_DISTANCE_M = 3000
export const MARKER_CLUSTER_REF_DISTANCE_M = 250

export const DEFAULT_PANEL_WIDTH = 600
export const PANEL_WIDTH_MIN = 300
export const PANEL_RIGHT_OFFSET_PX = 8

export const DEFAULT_CIRCLE_STROKE_COLOR = '#fff'
export const DEFAULT_SYMBOL_TEXT_COLOR = '#ffffff'
export const SELECTED_MARKER_STROKE_COLOR = '#ccff00'

export const SETTINGS_STORAGE_KEY = 'annapurna-trek-map-settings'

export const SHOW_NAVIGATION_CONTROL = false
