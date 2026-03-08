'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
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
  DEFAULT_PANEL_WIDTH,
  FINAL_VIEW,
  INTRO_FLY_CURVE,
  INTRO_FLY_DURATION_MS,
  INTRO_ZOOM,
  MAP_CONTAINER_ID,
  PANEL_WIDTH_MIN,
  PANEL_WIDTH_STORAGE_KEY,
} from '@/lib/constants'

function loadPanelWidth(): number {
  if (typeof window === 'undefined') return DEFAULT_PANEL_WIDTH
  try {
    const raw = window.localStorage.getItem(PANEL_WIDTH_STORAGE_KEY)
    if (raw == null) return DEFAULT_PANEL_WIDTH
    const n = Number(raw)
    if (!Number.isFinite(n)) return DEFAULT_PANEL_WIDTH
    return Math.max(PANEL_WIDTH_MIN, Math.round(n))
  } catch {
    return DEFAULT_PANEL_WIDTH
  }
}

function savePanelWidth(width: number): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(PANEL_WIDTH_STORAGE_KEY, String(width))
  } catch {
    // ignore
  }
}

export default function MapPage() {
  const [settings, setSettings] = useState<MapSettings>(() =>
    typeof window !== 'undefined' ? loadSettings() : DEFAULT_MAP_SETTINGS,
  )
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null)
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const layoutRef = useRef<HTMLDivElement>(null)
  const panelWidthRef = useRef(panelWidth)
  panelWidthRef.current = panelWidth
  const lastAppliedStyleRef = useRef<string | null>(null)
  const selectedMarkerIdRef = useRef<number | null>(null)
  selectedMarkerIdRef.current = selectedMarkerId

  // Restore panel width from localStorage after hydration (avoids SSR mismatch)
  useEffect(() => {
    setPanelWidth(loadPanelWidth())
  }, [])

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

  useEffect(() => {
    if (!isReady || !mapRef.current) return
    mapRef.current.resize()
  }, [isReady, panelWidth, mapRef])

  // Clamp panel to at most 50% when container shrinks (e.g. window resize)
  useEffect(() => {
    const container = layoutRef.current
    if (!container) return
    const clamp = () => {
      const rect = container.getBoundingClientRect()
      const maxW = rect.width * 0.5
      setPanelWidth((w) => (w > maxW ? maxW : w))
    }
    clamp()
    const ro = new ResizeObserver(clamp)
    ro.observe(container)
    return () => ro.disconnect()
  }, [])

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      setIsResizing(true)
      const container = layoutRef.current
      if (!container) return
      const onMove = (moveEvent: MouseEvent) => {
        const rect = container.getBoundingClientRect()
        const width = rect.right - moveEvent.clientX
        const maxPanelWidth = rect.width * 0.5
        const clamped = Math.max(
          PANEL_WIDTH_MIN,
          Math.min(maxPanelWidth, width),
        )
        setPanelWidth(clamped)
      }
      const onUp = () => {
        setIsResizing(false)
        savePanelWidth(panelWidthRef.current)
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        document.body.style.cursor = ''
        document.body.style.userSelect = ''
      }
      document.addEventListener('mousemove', onMove)
      document.addEventListener('mouseup', onUp)
      document.body.style.cursor = 'col-resize'
      document.body.style.userSelect = 'none'
      onMove(e.nativeEvent)
    },
    [],
  )

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
    if (mapRef.current)
      flyToMarker(mapRef.current, prevMarker.id, data, {
        fromMarkerId: selectedMarkerId,
      })
  }

  function goNext() {
    if (selectedMarkerId == null) return
    const index = data.features.findIndex((f) => f.id === selectedMarkerId)
    if (index < 0 || index >= data.features.length - 1) return
    const nextMarker = data.features[index + 1]
    setSelectedMarkerId(nextMarker.id)
    if (mapRef.current)
      flyToMarker(mapRef.current, nextMarker.id, data, {
        fromMarkerId: selectedMarkerId,
      })
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
    <div
      ref={layoutRef}
      className={`relative flex min-h-0 flex-1 flex-col md:flex-row ${isResizing ? 'select-none' : ''}`}
    >
      <MobileNotice />
      <div
        id={MAP_CONTAINER_ID}
        className="min-h-0 min-w-0 flex-1"
      />
      <div
        role="separator"
        aria-orientation="vertical"
        aria-valuenow={panelWidth}
        aria-valuemin={PANEL_WIDTH_MIN}
        aria-valuetext={`Panel width ${panelWidth}px, up to 50% of container`}
        title="Drag to resize"
        onMouseDown={handleResizeStart}
        className="hidden w-1.5 flex-shrink-0 cursor-col-resize bg-level-3 hover:bg-accent md:block md:min-h-0 md:self-stretch"
        style={{ touchAction: 'none' }}
      />
      <div
        className="panel-width-wrapper flex min-w-0 flex-shrink-0 flex-col"
        style={{ ['--panel-width-px' as string]: `${panelWidth}px` }}
      >
        <RightPanel
          selectedMarker={selectedMarker}
          onPrev={goPrev}
          onNext={goNext}
          onStartTrek={startTrek}
          settings={settings}
          onSettingsChange={handleSettingsChange}
        />
      </div>
    </div>
  )
}
