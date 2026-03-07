import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { loadSettings, saveSettings } from '@/lib/settingsStorage'
import { DEFAULT_MAP_SETTINGS } from '@/types'
import { SETTINGS_STORAGE_KEY, SETTINGS_STORAGE_VERSION } from '@/lib/constants'

describe('settingsStorage', () => {
  let localStorageMock: Record<string, string>

  beforeEach(() => {
    localStorageMock = {}
    vi.stubGlobal('window', {
      localStorage: {
        getItem: (key: string) => localStorageMock[key] ?? null,
        setItem: (key: string, value: string) => {
          localStorageMock[key] = value
        },
      },
    })
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('loadSettings returns defaults when localStorage is empty', () => {
    const settings = loadSettings()
    expect(settings).toEqual(DEFAULT_MAP_SETTINGS)
  })

  it('saveSettings writes to localStorage and loadSettings reads it back', () => {
    const custom = {
      ...DEFAULT_MAP_SETTINGS,
      clusterColor: '#ff0000',
    }
    saveSettings(custom)
    expect(localStorageMock[SETTINGS_STORAGE_KEY]).toBeDefined()
    const parsed = JSON.parse(localStorageMock[SETTINGS_STORAGE_KEY])
    expect(parsed.version).toBe(SETTINGS_STORAGE_VERSION)
    expect(parsed.settings.clusterColor).toBe('#ff0000')
    const loaded = loadSettings()
    expect(loaded.clusterColor).toBe('#ff0000')
  })

  it('loadSettings returns defaults when stored data is invalid', () => {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, 'not json')
    const settings = loadSettings()
    expect(settings).toEqual(DEFAULT_MAP_SETTINGS)
  })

  it('loadSettings validates and coerces stored values', () => {
    saveSettings({
      ...DEFAULT_MAP_SETTINGS,
      clusterColor: '#00ff00',
    })
    window.localStorage.setItem(
      SETTINGS_STORAGE_KEY,
      JSON.stringify({
        version: 1,
        settings: {
          ...DEFAULT_MAP_SETTINGS,
          clusterColor: 'invalid',
          mapStyle: 'unknown-style',
        },
      }),
    );
    const settings = loadSettings()
    expect(settings.clusterColor).toBe(DEFAULT_MAP_SETTINGS.clusterColor)
    expect(settings.mapStyle).toBe(DEFAULT_MAP_SETTINGS.mapStyle)
  })
})
