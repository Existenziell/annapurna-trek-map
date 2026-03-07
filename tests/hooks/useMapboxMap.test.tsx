import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useMapboxMap } from '@/hooks/useMapboxMap'

const mockMapInstance = {
  once: vi.fn((_event: string, cb: () => void) => {
    setTimeout(cb, 0)
  }),
  remove: vi.fn(),
}

vi.mock('mapbox-gl', () => ({
  default: {
    Map: vi.fn(() => mockMapInstance),
    accessToken: '',
  },
}))

describe('useMapboxMap', () => {
  const originalEnv = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = 'test-token'
    document.body.innerHTML = '<div id="map"></div>'
  })

  it('returns mapRef, isReady, and error', () => {
    const { result } = renderHook(() => useMapboxMap('map'))
    expect(result.current).toHaveProperty('mapRef')
    expect(result.current).toHaveProperty('isReady')
    expect(result.current).toHaveProperty('error')
    expect(result.current.mapRef).toHaveProperty('current')
    expect(typeof result.current.isReady).toBe('boolean')
  })

  it('starts with isReady false and error null', () => {
    const { result } = renderHook(() => useMapboxMap('map'))
    expect(result.current.isReady).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('sets isReady true after map load event', async () => {
    const { result } = renderHook(() => useMapboxMap('map'))
    await waitFor(() => {
      expect(result.current.isReady).toBe(true)
    })
    expect(mockMapInstance.once).toHaveBeenCalledWith('load', expect.any(Function))
  })

  it('sets error when NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN is missing', () => {
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = ''
    const { result } = renderHook(() => useMapboxMap('map'))
    expect(result.current.error).not.toBe(null)
    expect(result.current.error?.message).toContain('MAPBOX')
    process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN = originalEnv
  })
})
