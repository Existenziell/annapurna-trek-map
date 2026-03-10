import { describe, it, expect, vi, beforeEach } from 'vitest'
import { applyLayerPaint } from '@/lib/applyLayerPaint'
import { DEFAULT_MAP_LAYER_OPTIONS } from '@/types'
import type { MapSettings } from '@/types'

describe('applyLayerPaint', () => {
  let mockMap: {
    setTerrain: ReturnType<typeof vi.fn>
    setFog: ReturnType<typeof vi.fn>
    getLayer: ReturnType<typeof vi.fn>
    setPaintProperty: ReturnType<typeof vi.fn>
  }

  const settings: MapSettings = {
    ...DEFAULT_MAP_LAYER_OPTIONS,
    mapStyle: 'mapbox://styles/mapbox/outdoors-v12',
    projection: 'globe',
  }

  beforeEach(() => {
    mockMap = {
      setTerrain: vi.fn(),
      setFog: vi.fn(),
      getLayer: vi.fn((name: string) => name),
      setPaintProperty: vi.fn(),
    }
  })

  it('calls setFog with atmosphere settings', () => {
    applyLayerPaint(mockMap as never, settings)
    expect(mockMap.setFog).toHaveBeenCalledWith({
      color: settings.fogColor,
      'high-color': settings.fogHighColor,
      'space-color': settings.fogSpaceColor,
      'star-intensity': settings.fogStarIntensity,
      'horizon-blend': settings.fogHorizonBlend,
    })
  })

  it('calls setTerrain with mapbox-dem and terrainExaggeration', () => {
    applyLayerPaint(mockMap as never, settings)
    expect(mockMap.setTerrain).toHaveBeenCalledWith({
      source: 'mapbox-dem',
      exaggeration: settings.terrainExaggeration,
    })
  })

  it('sets sky layer paint when sky layer exists', () => {
    applyLayerPaint(mockMap as never, settings)
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith('sky', 'sky-type', settings.skyType)
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      'sky',
      'sky-atmosphere-sun',
      settings.skyAtmosphereSun,
    )
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      'sky',
      'sky-atmosphere-sun-intensity',
      settings.skyAtmosphereSunIntensity,
    )
  })

  it('sets clusters layer paint when clusters layer exists', () => {
    applyLayerPaint(mockMap as never, settings)
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      'clusters',
      'circle-color',
      settings.clusterColor,
    )
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      'clusters',
      'circle-opacity',
      settings.circleOpacity,
    )
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      'clusters',
      'circle-stroke-opacity',
      settings.clusterStrokeOpacity,
    )
  })

  it('sets unclustered-point layer paint when layer exists', () => {
    applyLayerPaint(mockMap as never, settings)
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      'unclustered-point',
      'circle-color',
      settings.clusterColor,
    )
    expect(mockMap.setPaintProperty).toHaveBeenCalledWith(
      'unclustered-point',
      'circle-opacity',
      settings.circleOpacity,
    )
  })

  it('does not call setPaintProperty for a layer when getLayer returns falsy', () => {
    mockMap.getLayer = vi.fn((name: string) => (name === 'sky' ? null : name))
    applyLayerPaint(mockMap as never, settings)
    const skyCalls = (mockMap.setPaintProperty as ReturnType<typeof vi.fn>).mock.calls.filter(
      (c: [string, string, unknown]) => c[0] === 'sky',
    )
    expect(skyCalls).toHaveLength(0)
  })
})
