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
      })
      return
    }
    applyLayerPaint(map, settings)
  }, [isReady, mapRef, settings])

  function handleSettingsChange(newSettings: MapSettings) {
    setSettings(newSettings)
    saveSettings(newSettings)
  }

  function goPrev() {
    if (selectedMarkerId == null || selectedMarkerId <= 1) return
    const nextId = selectedMarkerId - 1
    setSelectedMarkerId(nextId)
    if (mapRef.current) flyToMarker(mapRef.current, nextId, data)
  }

  function goNext() {
    if (selectedMarkerId == null || selectedMarkerId >= data.features.length)
      return
    const nextId = selectedMarkerId + 1
    setSelectedMarkerId(nextId)
    if (mapRef.current) flyToMarker(mapRef.current, nextId, data)
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
    <div className="relative flex min-h-0 flex-1 flex-row">
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
