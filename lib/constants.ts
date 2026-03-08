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
export const FLY_DURATION_MS = 4000

/** Curve for marker-to-marker fly (higher = zoom out more during transition, then zoom in) */
export const FLY_CURVE = 3.5

/** Zoom level when arriving at a marker (tight on the point) */
export const MARKER_ZOOM = 14.5

/** Min zoom when flying to a marker (short hops stay more zoomed out) */
export const MARKER_ZOOM_MIN = 11

/** Max zoom when flying to a marker (tight clusters can zoom in further) */
export const MARKER_ZOOM_MAX = 17

/** Distance (m) above which we use full MARKER_ZOOM; below this we scale down. */
export const MARKER_ZOOM_REF_DISTANCE_M = 3000

/** Reference distance (m) for cluster zoom; markers closer than this need higher zoom to separate. */
export const MARKER_CLUSTER_REF_DISTANCE_M = 250

/** localStorage key for persisted map settings */
export const SETTINGS_STORAGE_KEY = 'annapurna-trek-map-settings'

/** localStorage key for right panel width (px) */
export const PANEL_WIDTH_STORAGE_KEY = 'annapurna-trek-map-panel-width'

/** Default right panel width (px) */
export const DEFAULT_PANEL_WIDTH = 380

/** Min right panel width (px). Max is 50% of container (50/50 split). */
export const PANEL_WIDTH_MIN = 280

/** Version of stored settings schema (for migrations) */
export const SETTINGS_STORAGE_VERSION = 1

/** Fixed stroke colour for marker circles (not user-configurable) */
export const DEFAULT_CIRCLE_STROKE_COLOR = '#fff'

/** Fixed text colour for marker labels (not user-configurable) */
export const DEFAULT_SYMBOL_TEXT_COLOR = '#ffffff'

/** Stroke colour for the selected trek marker (neon yellow for visibility) */
export const SELECTED_MARKER_STROKE_COLOR = '#ccff00'

/** Final camera view after intro (center, zoom, pitch) */
export const FINAL_VIEW = {
  center: DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  pitch: DEFAULT_MAP_PITCH,
} as const
