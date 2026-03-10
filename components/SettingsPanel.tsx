'use client'

import type { MapSettings, SettingsPanelProps } from '@/types'
import { DEFAULT_MAP_SETTINGS, MAP_STYLE_OPTIONS, PROJECTION_OPTIONS } from '@/types'
import { useTheme } from '@/components/ThemeProvider'
import type { Theme } from '@/lib/theme'
import { SunIcon, MoonIcon, SystemIcon, XIcon } from '@/components/Icons'

const THEME_OPTIONS: { value: Theme; Icon: typeof SunIcon; label: string }[] = [
  { value: 'light', Icon: SunIcon, label: 'Light' },
  { value: 'system', Icon: SystemIcon, label: 'System' },
  { value: 'dark', Icon: MoonIcon, label: 'Dark' },
]

export default function SettingsPanel({ open, onClose, settings, onChange }: SettingsPanelProps) {
  const { theme, setTheme } = useTheme()

  function update<K extends keyof MapSettings>(key: K, value: MapSettings[K]) {
    onChange({ ...settings, [key]: value })
  }

  function handleReset() {
    onChange(DEFAULT_MAP_SETTINGS)
    setTheme('system')
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-30 flex justify-end bg-black/20 md:bg-black/10"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Settings"
    >
      <div
        className="settings-panel-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium text-level-6">Settings</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-level-4 hover:text-level-5 rounded focus-ring"
            aria-label="Close settings"
          >
            <XIcon className="w-5 h-5" />
          </button>
        </div>
        <div className="max-w-md w-full mx-auto">
          <div className="card flex flex-col gap-4 text-sm text-left">
            <div>
              <div className="flex gap-1 p-1 rounded-lg bg-level-3/50 w-fit" role="group" aria-label="Theme">
                {THEME_OPTIONS.map(({ value, Icon, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setTheme(value)}
                    title={label}
                    aria-label={label}
                    aria-pressed={theme === value}
                    className={`p-2 rounded-md transition-colors focus-ring-offset-level-1 ${theme === value
                        ? 'bg-level-2 text-accent shadow-sm ring-1 ring-accent/40'
                        : 'bg-level-2 text-level-4 hover:bg-level-3 hover:text-level-5'
                      }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                ))}
              </div>
            </div>
            <h3 className="section-heading">Map settings</h3>
            <div className="flex flex-wrap gap-2">
              <fieldset className="min-w-0 mb-2">
                <legend className="block font-medium mb-2">Projection</legend>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5" role="radiogroup" aria-label="Projection">
                  {PROJECTION_OPTIONS.map(({ value, label }) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 cursor-pointer text-level-5"
                    >
                      <input
                        type="radio"
                        name="projection"
                        value={value}
                        checked={settings.projection === value}
                        onChange={() => update('projection', value)}
                        className="input-radio"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
              <fieldset className="min-w-0">
                <legend className="block font-medium mb-2">Map style</legend>
                <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Map style">
                  {MAP_STYLE_OPTIONS.map((opt) => (
                    <label
                      key={opt.value}
                      className="flex items-center gap-2 cursor-pointer text-level-5"
                    >
                      <input
                        type="radio"
                        name="map-style"
                        value={opt.value}
                        checked={settings.mapStyle === opt.value}
                        onChange={() => update('mapStyle', opt.value)}
                        className="input-radio"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="min-w-0">
                <legend className="block font-medium mb-2">Sky type</legend>
                <div className="flex flex-col gap-1.5" role="radiogroup" aria-label="Sky type">
                  {(['atmosphere', 'gradient'] as const).map((value) => (
                    <label
                      key={value}
                      className="flex items-center gap-2 cursor-pointer text-level-5 capitalize"
                    >
                      <input
                        type="radio"
                        name="sky-type"
                        value={value}
                        checked={settings.skyType === value}
                        onChange={() =>
                          update('skyType', value)
                        }
                        className="input-radio"
                      />
                      <span>{value}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            <h3 className="section-heading">Atmosphere (skybox)</h3>
            <div className="flex flex-wrap gap-4 mb-4">
              <div>
                <label htmlFor="fog-color" className="block font-medium mb-1">Lower sky</label>
                <input
                  id="fog-color"
                  type="color"
                  value={settings.fogColor.startsWith('#') ? settings.fogColor : '#bad2eb'}
                  onChange={(e) => update('fogColor', e.target.value)}
                  className="input-color"
                />
              </div>
              <div>
                <label htmlFor="fog-high-color" className="block font-medium mb-1">Upper sky</label>
                <input
                  id="fog-high-color"
                  type="color"
                  value={settings.fogHighColor.startsWith('#') ? settings.fogHighColor : '#245cdf'}
                  onChange={(e) => update('fogHighColor', e.target.value)}
                  className="input-color"
                />
              </div>
              <div>
                <label htmlFor="fog-space-color" className="block font-medium mb-1">Space</label>
                <input
                  id="fog-space-color"
                  type="color"
                  value={settings.fogSpaceColor.startsWith('#') ? settings.fogSpaceColor : '#0b0b19'}
                  onChange={(e) => update('fogSpaceColor', e.target.value)}
                  className="input-color"
                />
              </div>
            </div>
            <div className="flex flex-col gap-4 mb-4">
              <div className="w-full">
                <div className="flex justify-between items-baseline mb-1">
                  <label htmlFor="star-intensity" className="font-medium">Star intensity</label>
                  <span className="text-xs">{Math.round(settings.fogStarIntensity * 100)}%</span>
                </div>
                <input
                  id="star-intensity"
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(settings.fogStarIntensity * 100)}
                  onChange={(e) => update('fogStarIntensity', Number(e.target.value) / 100)}
                  className="input-range w-full"
                />
              </div>
              <div className="w-full">
                <div className="flex justify-between items-baseline mb-1">
                  <label htmlFor="horizon-blend" className="font-medium">Horizon blend</label>
                  <span className="text-xs">{Math.round(settings.fogHorizonBlend * 100)}%</span>
                </div>
                <input
                  id="horizon-blend"
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(settings.fogHorizonBlend * 100)}
                  onChange={(e) => update('fogHorizonBlend', Number(e.target.value) / 100)}
                  className="input-range w-full"
                />
              </div>
            </div>

            <h3 className="section-heading">Sky layer (Mercator)</h3>
            <div>
              <label className="block font-medium mb-1">Sun position (azimuth, polar)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  max={360}
                  step={0.1}
                  value={settings.skyAtmosphereSun[0]}
                  onChange={(e) =>
                    update('skyAtmosphereSun', [
                      Number(e.target.value),
                      settings.skyAtmosphereSun[1],
                    ])
                  }
                  className="input-number"
                />
                <input
                  type="number"
                  min={0}
                  max={90}
                  step={0.1}
                  value={settings.skyAtmosphereSun[1]}
                  onChange={(e) =>
                    update('skyAtmosphereSun', [
                      settings.skyAtmosphereSun[0],
                      Number(e.target.value),
                    ])
                  }
                  className="input-number"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label htmlFor="sun-intensity" className="font-medium">
                  Sun intensity
                </label>
                <span className="text-xs">{settings.skyAtmosphereSunIntensity}</span>
              </div>
              <input
                id="sun-intensity"
                type="range"
                min={0}
                max={100}
                value={settings.skyAtmosphereSunIntensity}
                onChange={(e) =>
                  update('skyAtmosphereSunIntensity', Number(e.target.value))
                }
                className="input-range w-full"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label htmlFor="terrain-exaggeration" className="font-medium">
                  Terrain exaggeration
                </label>
                <span className="text-xs">{settings.terrainExaggeration}</span>
              </div>
              <input
                id="terrain-exaggeration"
                type="range"
                min={0}
                max={2}
                step={0.1}
                value={settings.terrainExaggeration}
                onChange={(e) =>
                  update('terrainExaggeration', Number(e.target.value))
                }
                className="input-range w-full"
              />
            </div>

            <div className="flex flex-wrap items-end gap-6">
              <div>
                <label htmlFor="cluster-color" className="block font-medium mb-1">
                  Marker colour
                </label>
                <input
                  id="cluster-color"
                  type="color"
                  value={settings.clusterColor}
                  onChange={(e) => update('clusterColor', e.target.value)}
                  className="input-color-full"
                />
              </div>
              <div>
                <label htmlFor="highlight-color" className="block font-medium mb-1">
                  Highlight colour
                </label>
                <input
                  id="highlight-color"
                  type="color"
                  value={settings.selectedMarkerStrokeColor}
                  onChange={(e) =>
                    update('selectedMarkerStrokeColor', e.target.value)
                  }
                  className="input-color-full"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label htmlFor="marker-opacity" className="font-medium">
                  Marker opacity
                </label>
                <span className="text-xs">{Math.round(settings.circleOpacity * 100)}%</span>
              </div>
              <input
                id="marker-opacity"
                type="range"
                min={0}
                max={1}
                step={0.05}
                value={settings.circleOpacity}
                onChange={(e) =>
                  update('circleOpacity', Number(e.target.value))
                }
                className="input-range w-full"
              />
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="text-level-4 hover:text-level-5 underline"
                aria-label="Reset all settings to default"
              >
                Reset to default
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
