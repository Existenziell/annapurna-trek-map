'use client'

import { useEffect, useRef, useState } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapboxMap } from '@/hooks/useMapboxMap'
import { initializeMap } from '@/lib/initializeMap'
import { addDataLayer } from '@/lib/addDataLayer'
import { applyLayerPaint } from '@/lib/applyLayerPaint'
import { flyToMarker } from '@/lib/flyToMarker'
import { loadSettings, saveSettings } from '@/lib/settingsStorage'
import { data } from '@/data'
import RightPanel from '@/components/RightPanel'
import MobileNotice from '@/components/MobileNotice'
import mapboxgl from 'mapbox-gl'
import type { MapSettings, TrekMarkerType } from '@/types'
import { DEFAULT_MAP_SETTINGS } from '@/types'
import {
  FINAL_VIEW,
  INTRO_FLY_CURVE,
  INTRO_FLY_DURATION_MS,
  INTRO_ZOOM,
  MAP_CONTAINER_ID,
} from '@/lib/constants'

export default function MapPage() {
  const [settings, setSettings] = useState<MapSettings>(() =>
    typeof window !== 'undefined' ? loadSettings() : DEFAULT_MAP_SETTINGS,
  )
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null)
  const lastAppliedStyleRef = useRef<string | null>(null)
  const selectedMarkerIdRef = useRef<number | null>(null)
  selectedMarkerIdRef.current = selectedMarkerId

  const { mapRef, isReady, error } = useMapboxMap(MAP_CONTAINER_ID, {
    style: settings.mapStyle,
    zoom: INTRO_ZOOM,
    center: FINAL_VIEW.center,
    pitch: FINAL_VIEW.pitch,
  })

  const selectedMarker =
    selectedMarkerId != null
      ? data.features.find((m) => m.id === selectedMarkerId) ?? null
      : null

  const hasIntroFlownRef = useRef(false)

  useEffect(() => {
    if (!isReady || !mapRef.current) return
    const map = mapRef.current
    addDataLayer(map, data, settings)
    map.addControl(new mapboxgl.NavigationControl())
    initializeMap(map, {
      onMarkerClick: (marker: TrekMarkerType) => {
        setSelectedMarkerId(Number(marker.id))
        flyToMarker(map, Number(marker.id), data)
      },
    })
    lastAppliedStyleRef.current = settings.mapStyle

    if (!hasIntroFlownRef.current) {
      hasIntroFlownRef.current = true
      map.flyTo({
        ...FINAL_VIEW,
        duration: INTRO_FLY_DURATION_MS,
        curve: INTRO_FLY_CURVE,
        essential: true,
      })
    }
    // Intentionally omit settings: this effect runs once on mount; settings updates are handled in the effect below.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, mapRef])

  useEffect(() => {
    if (!mapRef.current || !isReady) return
    const map = mapRef.current
    if (lastAppliedStyleRef.current === null) return

    if (lastAppliedStyleRef.current !== settings.mapStyle) {
      map.setStyle(settings.mapStyle)
      map.once('style.load', () => {
        if (!mapRef.current) return
        addDataLayer(mapRef.current, data, settings)
        lastAppliedStyleRef.current = settings.mapStyle
        const id = selectedMarkerIdRef.current
        if (mapRef.current.getLayer('selected-marker')) {
          mapRef.current.setFilter('selected-marker', [
            'all',
            ['!', ['has', 'point_count']],
            ['==', ['id'], id ?? -1],
          ])
        }
      })
      return
    }
    applyLayerPaint(map, settings)
  }, [isReady, mapRef, settings])

  useEffect(() => {
    if (!mapRef.current || !isReady) return
    const map = mapRef.current
    if (!map.getLayer('selected-marker')) return
    const id = selectedMarkerId ?? -1
    map.setFilter('selected-marker', [
      'all',
      ['!', ['has', 'point_count']],
      ['==', ['id'], id],
    ])
  }, [selectedMarkerId, isReady, mapRef])

  function handleSettingsChange(newSettings: MapSettings) {
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  function goPrev() {
    if (selectedMarkerId == null) return
    const index = data.features.findIndex((f) => f.id === selectedMarkerId)
    if (index <= 0) return
    const prevMarker = data.features[index - 1]
    setSelectedMarkerId(prevMarker.id)
    if (mapRef.current) flyToMarker(mapRef.current, prevMarker.id, data)
  }

  function goNext() {
    if (selectedMarkerId == null) return
    const index = data.features.findIndex((f) => f.id === selectedMarkerId)
    if (index < 0 || index >= data.features.length - 1) return
    const nextMarker = data.features[index + 1]
    setSelectedMarkerId(nextMarker.id)
    if (mapRef.current) flyToMarker(mapRef.current, nextMarker.id, data)
  }

  function startTrek() {
    setSelectedMarkerId(1)
    if (mapRef.current) flyToMarker(mapRef.current, 1, data)
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-red-600">
        {error.message}
      </div>
    )
  }

  return (
    <div className="relative flex min-h-0 flex-1 flex-col md:flex-row">
      <MobileNotice />
      <div
        id={MAP_CONTAINER_ID}
        className="min-h-0 flex-[3] w-0 min-w-0"
      />
      <RightPanel
        selectedMarker={selectedMarker}
        onPrev={goPrev}
        onNext={goNext}
        onStartTrek={startTrek}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
    </div>
  )
}
