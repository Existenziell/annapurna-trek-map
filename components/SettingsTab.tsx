'use client'

import type { MapSettings, SettingsTabProps } from '@/types'
import { MAP_STYLE_OPTIONS } from '@/types'
import { useTheme } from '@/components/ThemeProvider'
import type { Theme } from '@/lib/theme'
import { SunIcon, MoonIcon, SystemIcon } from '@/components/Icons'

const THEME_OPTIONS: { value: Theme; Icon: typeof SunIcon; label: string }[] = [
  { value: 'light', Icon: SunIcon, label: 'Light' },
  { value: 'system', Icon: SystemIcon, label: 'System' },
  { value: 'dark', Icon: MoonIcon, label: 'Dark' },
]

export default function SettingsTab({ settings, onChange }: SettingsTabProps) {
  const { theme, setTheme } = useTheme()

  function update<K extends keyof MapSettings>(key: K, value: MapSettings[K]) {
    onChange({ ...settings, [key]: value })
  }

  return (
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
                className={`p-2 rounded-md transition-colors ${theme === value
                    ? 'bg-level-2 text-accent shadow-sm'
                    : 'text-level-4 hover:text-level-5'
                  }`}
              >
                <Icon className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>
        <h3 className="font-medium mt-2 text-lg border-t border-level-3 pt-6">Map settings:</h3>
        <div className="flex flex-wrap gap-12">
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
          <label htmlFor="sun-intensity" className="block font-medium mb-1">
            Sun intensity
          </label>
          <input
            id="sun-intensity"
            type="range"
            min={0}
            max={100}
            value={settings.skyAtmosphereSunIntensity}
            onChange={(e) =>
              update('skyAtmosphereSunIntensity', Number(e.target.value))
            }
            className="input-range"
          />
          <span className="text-xs">{settings.skyAtmosphereSunIntensity}</span>
        </div>

        <div>
          <label htmlFor="terrain-exaggeration" className="block font-medium mb-1">
            Terrain exaggeration
          </label>
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
            className="input-range"
          />
          <span className="text-xs">{settings.terrainExaggeration}</span>
        </div>

        <div>
          <label htmlFor="cluster-color" className="block font-medium mb-1">
            Marker colour
          </label>
          <input
            id="cluster-color"
            type="color"
            value={settings.clusterColor}
            onChange={(e) => update('clusterColor', e.target.value)}
            className="h-10 w-full rounded border border-level-3 cursor-pointer"
          />
        </div>

        <div>
          <label htmlFor="marker-opacity" className="block font-medium mb-1">
            Marker opacity
          </label>
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
            className="input-range"
          />
          <span className="text-xs">{Math.round(settings.circleOpacity * 100)}%</span>
        </div>

        <section className="pt-6 mt-2 text-left border-t border-level-3">
          <h3 className="font-medium mb-2 text-lg">Map controls:</h3>
          <ul className="leading-relaxed space-y-0.5 list-none text-sm">
            <li>Hold left mouse button to drag</li>
            <li>Hold right mouse button to pan / rotate</li>
            <li>Mouse wheel to zoom</li>
            <li>Click a marker to view details in this panel</li>
            <li>Click an image in the Content tab to enlarge it</li>
          </ul>
        </section>
      </div>
    </div>
  )
}
