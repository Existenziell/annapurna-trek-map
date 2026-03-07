/**
 * Centralized constants for the Annapurna Trek Map app.
 */

/** DOM id for the map container element */
export const MAP_CONTAINER_ID = 'map'

/** Default map style URL (Mapbox) */
export const DEFAULT_MAP_STYLE = 'mapbox://styles/mapbox/satellite-v9'

/** Default map center [lng, lat] – Himalayas / Annapurna region */
export const DEFAULT_MAP_CENTER: [number, number] = [84.1, 28.5]

/** Default map zoom level (final view after intro) */
export const DEFAULT_MAP_ZOOM = 9.5

/** Default map pitch (degrees) */
export const DEFAULT_MAP_PITCH = 45

/** Zoom level when map first loads (before intro fly) */
export const INTRO_ZOOM = 2

/** Duration of the intro fly-to animation (ms) */
export const INTRO_FLY_DURATION_MS = 5000

/** Curve for the intro fly-to (lower = less zoom arc) */
export const INTRO_FLY_CURVE = 0.8

/** Duration of marker-to-marker fly animation (ms) */
export const FLY_DURATION_MS = 2000

/** Curve for marker-to-marker fly (higher = zoom out then in) */
export const FLY_CURVE = 2.25

/** localStorage key for persisted map settings */
export const SETTINGS_STORAGE_KEY = 'annapurna-trek-map-settings'

/** Version of stored settings schema (for migrations) */
export const SETTINGS_STORAGE_VERSION = 1

/** Fixed stroke colour for marker circles (not user-configurable) */
export const DEFAULT_CIRCLE_STROKE_COLOR = '#fff'

/** Fixed text colour for marker labels (not user-configurable) */
export const DEFAULT_SYMBOL_TEXT_COLOR = '#ffffff'

/** Final camera view after intro (center, zoom, pitch) */
export const FINAL_VIEW = {
  center: DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  pitch: DEFAULT_MAP_PITCH,
} as const
