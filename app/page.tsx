'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import 'mapbox-gl/dist/mapbox-gl.css'
import { useMapboxMap } from '@/hooks/useMapboxMap'
import { initializeMap } from '@/lib/initializeMap'
import { addDataLayer } from '@/lib/addDataLayer'
import { applyLayerPaint } from '@/lib/applyLayerPaint'
import { flyToMarker } from '@/lib/flyToMarker'
import { loadSettings, saveSettings } from '@/lib/settingsStorage'
import { data } from '@/data'
import ImagePanel from '@/components/ImagePanel'
import Welcome from '@/components/Welcome'
import MobileNotice from '@/components/MobileNotice'
import SettingsPanel from '@/components/SettingsPanel'
import Nav from '@/components/Nav'
import SettingsButton from '@/components/SettingsButton'
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
  PANEL_RIGHT_OFFSET_PX,
  PANEL_WIDTH_MIN,
} from '@/lib/constants'

export default function Page() {
  const [settings, setSettings] = useState<MapSettings>(() =>
    typeof window !== 'undefined' ? loadSettings() : DEFAULT_MAP_SETTINGS,
  )
  const [selectedMarkerId, setSelectedMarkerId] = useState<number | null>(null)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL_WIDTH)
  const [isResizing, setIsResizing] = useState(false)
  const [panelMounted, setPanelMounted] = useState(false)
  const [fullscreenOpen, setFullscreenOpen] = useState(false)
  const layoutRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const panelWidthRef = useRef(panelWidth)
  panelWidthRef.current = panelWidth
  const lastAppliedStyleRef = useRef<string | null>(null)
  const selectedMarkerIdRef = useRef<number | null>(null)
  selectedMarkerIdRef.current = selectedMarkerId

  const { mapRef, isReady, error } = useMapboxMap(MAP_CONTAINER_ID, {
    style: settings.mapStyle,
    zoom: INTRO_ZOOM,
    center: FINAL_VIEW.center,
    pitch: FINAL_VIEW.pitch,
    projection: settings.projection,
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
        applyLayerPaint(mapRef.current, settings)
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
    map.setProjection(settings.projection)
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

  // Map is fullscreen; resize when map becomes ready and whenever the container or window size changes
  useEffect(() => {
    if (!isReady || !mapRef.current) return
    const map = mapRef.current
    const container = document.getElementById(MAP_CONTAINER_ID)
    if (!container) return
    const resize = () => map.resize()
    const rafId = requestAnimationFrame(resize)
    const ro = new ResizeObserver(resize)
    ro.observe(container)
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [isReady, mapRef])

  // Render panel portal only after mount to avoid hydration mismatch (server has no document.body)
  useEffect(() => setPanelMounted(true), [])

  // Close settings on Escape
  useEffect(() => {
    if (!settingsOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [settingsOpen])

  // Max panel width: layout viewport minus right offset, and 50% of container. Panel is portaled to body so fixed = viewport.
  const getMaxPanelWidth = useCallback(() => {
    const clientWidth = document.documentElement.clientWidth
    const viewportMax = clientWidth - PANEL_RIGHT_OFFSET_PX
    const containerW = layoutRef.current?.getBoundingClientRect().width ?? clientWidth
    return Math.min(containerW * 0.5, viewportMax)
  }, [])

  // Clamp panel so it never extends past viewport
  useEffect(() => {
    const container = layoutRef.current
    if (!container) return
    const clamp = () => {
      const maxW = getMaxPanelWidth()
      setPanelWidth((w) => (w > maxW ? maxW : w))
    }
    clamp()
    const ro = new ResizeObserver(clamp)
    ro.observe(container)
    return () => ro.disconnect()
  }, [getMaxPanelWidth])

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      e.preventDefault()
      setIsResizing(true)
      const onMove = (moveEvent: MouseEvent) => {
        const clientWidth = document.documentElement.clientWidth
        const rightEdge = clientWidth - PANEL_RIGHT_OFFSET_PX
        const maxW = getMaxPanelWidth()
        const width = rightEdge - moveEvent.clientX
        setPanelWidth(Math.max(PANEL_WIDTH_MIN, Math.min(maxW, width)))
      }
      const onUp = () => {
        setIsResizing(false)
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
    [getMaxPanelWidth],
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
    <>
      <div
        ref={layoutRef}
        className={`relative flex min-h-0 flex-1 flex-col ${isResizing ? 'select-none' : ''}`}
      >
        <MobileNotice />
      
      {/* Welcome overlay: above panel so Start trek is clickable; only when no marker selected */}
      {selectedMarkerId == null && (
        <div className="fixed inset-0 z-20 flex items-start justify-end pt-4 pr-4 md:pt-12 md:pr-12 pointer-events-none">
          <div className="pointer-events-auto">
            <Welcome onStartTrek={startTrek} />
          </div>
        </div>
      )}

      {/* Global settings button: hidden when settings panel or fullscreen overlay is open */}
      {!settingsOpen && !fullscreenOpen && (
        <div className="fixed top-2.5 right-12 z-30">
          <SettingsButton onClick={() => setSettingsOpen(true)} />
        </div>
      )}

      {/* Fullscreen map: map container is fixed inset-0 so it always has viewport size */}
      <div
        id={MAP_CONTAINER_ID}
        className="fixed inset-0 w-screen h-screen min-h-0 min-w-0"
        aria-hidden
      />

      {/* Navigation: only shown when a marker is selected */}
      {selectedMarkerId != null && selectedMarker && (
        <Nav
          onPrev={goPrev}
          onNext={goNext}
          selectedMarkerId={selectedMarkerId}
          totalMarkers={data.features.length}
        />
      )}

      {/* Floating settings overlay */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        settings={settings}
        onChange={handleSettingsChange}
      />
      </div>

      {/* Floating Image Panel: portaled to body after mount so fixed = viewport; avoids hydration mismatch */}
      {panelMounted &&
        typeof document !== 'undefined' &&
        document.body &&
        createPortal(
          <div
            ref={panelRef}
            className="flex fixed top-12 right-4 bottom-0 z-10 flex-col bg-transparent w-full md:w-[var(--panel-width-px)] md:top-28 md:right-2 overflow-hidden"
            style={{ ['--panel-width-px' as string]: `${panelWidth}px` }}
          >
            <ImagePanel
              selectedMarker={selectedMarker}
              onPrev={goPrev}
              onNext={goNext}
              onResizeHandleMouseDown={handleResizeStart}
              onFullscreenChange={setFullscreenOpen}
            />
          </div>,
          document.body,
        )}
    </>
  )
}
