import type { MapSettings, StoredSettings } from '@/types'
import { DEFAULT_MAP_SETTINGS, MAP_STYLE_OPTIONS } from '@/types'
import {
  SETTINGS_STORAGE_KEY,
  SETTINGS_STORAGE_VERSION,
} from '@/lib/constants'

function isValidHexColor(s: unknown): s is string {
  return typeof s === 'string' && /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(s)
}

function isValidStyleUrl(url: unknown): url is string {
  return (
    typeof url === 'string' &&
    MAP_STYLE_OPTIONS.some((opt) => opt.value === url)
  )
}

function validateAndCoerce(partial: Partial<MapSettings>): MapSettings {
  return {
    mapStyle: isValidStyleUrl(partial.mapStyle)
      ? partial.mapStyle
      : DEFAULT_MAP_SETTINGS.mapStyle,
    terrainExaggeration:
      typeof partial.terrainExaggeration === 'number' &&
      partial.terrainExaggeration >= 0 &&
      partial.terrainExaggeration <= 2
        ? partial.terrainExaggeration
        : DEFAULT_MAP_SETTINGS.terrainExaggeration,
    skyType:
      partial.skyType === 'atmosphere' || partial.skyType === 'gradient'
        ? partial.skyType
        : DEFAULT_MAP_SETTINGS.skyType,
    skyAtmosphereSun:
      Array.isArray(partial.skyAtmosphereSun) &&
      partial.skyAtmosphereSun.length === 2 &&
      partial.skyAtmosphereSun.every((n) => typeof n === 'number')
        ? (partial.skyAtmosphereSun as [number, number])
        : DEFAULT_MAP_SETTINGS.skyAtmosphereSun,
    skyAtmosphereSunIntensity:
      typeof partial.skyAtmosphereSunIntensity === 'number' &&
      partial.skyAtmosphereSunIntensity >= 0 &&
      partial.skyAtmosphereSunIntensity <= 100
        ? partial.skyAtmosphereSunIntensity
        : DEFAULT_MAP_SETTINGS.skyAtmosphereSunIntensity,
    clusterColor: isValidHexColor(partial.clusterColor)
      ? partial.clusterColor
      : DEFAULT_MAP_SETTINGS.clusterColor,
    clusterStrokeOpacity:
      typeof partial.clusterStrokeOpacity === 'number' &&
      partial.clusterStrokeOpacity >= 0 &&
      partial.clusterStrokeOpacity <= 1
        ? partial.clusterStrokeOpacity
        : DEFAULT_MAP_SETTINGS.clusterStrokeOpacity,
    circleOpacity:
      typeof partial.circleOpacity === 'number' &&
      partial.circleOpacity >= 0 &&
      partial.circleOpacity <= 1
        ? partial.circleOpacity
        : DEFAULT_MAP_SETTINGS.circleOpacity,
  }
}

export function loadSettings(): MapSettings {
  if (typeof window === 'undefined') return DEFAULT_MAP_SETTINGS
  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY)
    if (!raw) return DEFAULT_MAP_SETTINGS
    const parsed = JSON.parse(raw) as StoredSettings | null
    if (
      !parsed ||
      parsed.version !== SETTINGS_STORAGE_VERSION ||
      !parsed.settings
    )
      return DEFAULT_MAP_SETTINGS
    return validateAndCoerce(parsed.settings)
  } catch {
    return DEFAULT_MAP_SETTINGS
  }
}

export function saveSettings(settings: MapSettings): void {
  if (typeof window === 'undefined') return
  try {
    const stored: StoredSettings = {
      version: SETTINGS_STORAGE_VERSION,
      settings,
    }
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify(stored),
    )
  } catch {
    // ignore quota or other errors
  }
}
