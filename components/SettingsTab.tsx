'use client'

import type { MapSettings, SettingsTabProps } from '@/types'
import { MAP_STYLE_OPTIONS } from '@/types'

export default function SettingsTab({ settings, onChange }: SettingsTabProps) {
  function update<K extends keyof MapSettings>(key: K, value: MapSettings[K]) {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="flex flex-col gap-4 text-sm">
      <div>
        <label htmlFor="map-style" className="block font-medium mb-1">
          Map style
        </label>
        <select
          id="map-style"
          value={settings.mapStyle}
          onChange={(e) => update('mapStyle', e.target.value)}
          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
        >
          {MAP_STYLE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="sky-type" className="block font-medium mb-1">
          Sky type
        </label>
        <select
          id="sky-type"
          value={settings.skyType}
          onChange={(e) =>
            update('skyType', e.target.value as MapSettings['skyType'])
          }
          className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
        >
          <option value="atmosphere">Atmosphere</option>
          <option value="gradient">Gradient</option>
        </select>
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
            className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
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
            className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2"
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
          className="w-full"
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
          className="w-full"
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
          className="h-10 w-full rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
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
          className="w-full"
        />
        <span className="text-xs">{Math.round(settings.circleOpacity * 100)}%</span>
      </div>
    </div>
  )
}
