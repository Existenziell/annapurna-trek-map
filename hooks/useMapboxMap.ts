'use client'

import { useEffect, useRef, useState } from 'react'
import type { MapboxMap, MapboxMapOptions } from '@/types'
import {
  DEFAULT_MAP_CENTER,
  DEFAULT_MAP_PITCH,
  DEFAULT_MAP_STYLE,
  DEFAULT_MAP_ZOOM,
  MAP_PROJECTION,
} from '@/lib/constants'

const DEFAULT_OPTIONS: MapboxMapOptions = {
  center: DEFAULT_MAP_CENTER,
  zoom: DEFAULT_MAP_ZOOM,
  pitch: DEFAULT_MAP_PITCH,
  style: DEFAULT_MAP_STYLE,
  projection: MAP_PROJECTION,
}

export function useMapboxMap(
  containerId: string,
  options: MapboxMapOptions = {},
): { mapRef: React.RefObject<MapboxMap | null>; isReady: boolean; error: Error | null } {
  const mapRef = useRef<MapboxMap | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const token =
      process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? ''
    if (!token) {
      setError(new Error('Missing NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN'))
      return
    }

    import('mapbox-gl').then((mapboxgl) => {
      mapboxgl.default.accessToken = token
      const opts = { ...DEFAULT_OPTIONS, ...options }
      const map = new mapboxgl.default.Map({
        container: containerId,
        style: opts.style ?? DEFAULT_OPTIONS.style,
        center: opts.center ?? DEFAULT_OPTIONS.center,
        zoom: opts.zoom ?? DEFAULT_OPTIONS.zoom,
        pitch: opts.pitch ?? DEFAULT_OPTIONS.pitch,
        projection: opts.projection ?? DEFAULT_OPTIONS.projection,
      }) as MapboxMap
      mapRef.current = map
      map.once('load', () => setIsReady(true))
    }).catch((err) => {
      setError(err instanceof Error ? err : new Error(String(err)))
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
      setIsReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only init map once on mount
  }, [containerId])

  return { mapRef, isReady, error }
}
