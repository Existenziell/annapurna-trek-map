import { describe, it, expect, vi, beforeEach } from 'vitest'
import { addDataLayer } from '@/lib/addDataLayer'
import type { MapLayerOptions, TrekMarkerCollection } from '@/types'

const mockMarkerCollection: TrekMarkerCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 1,
      properties: { altitude: 1000, cluster: false, event_count: 1, venue: 'trek' },
      geometry: { type: 'Point', coordinates: [84.1, 28.5] },
    },
  ],
}

describe('addDataLayer', () => {
  let mockMap: {
    addSource: ReturnType<typeof vi.fn>
    setTerrain: ReturnType<typeof vi.fn>
    addLayer: ReturnType<typeof vi.fn>
    getSource: ReturnType<typeof vi.fn>
    getLayer: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockMap = {
      addSource: vi.fn(),
      setTerrain: vi.fn(),
      addLayer: vi.fn(),
      getSource: vi.fn().mockReturnValue(undefined),
      getLayer: vi.fn().mockReturnValue(undefined),
    }
  })

  it('adds mapbox-dem source', () => {
    addDataLayer(mockMap as never, mockMarkerCollection)
    expect(mockMap.addSource).toHaveBeenCalledWith(
      'mapbox-dem',
      expect.objectContaining({
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      }),
    )
  })

  it('sets terrain with mapbox-dem source', () => {
    addDataLayer(mockMap as never, mockMarkerCollection)
    expect(mockMap.setTerrain).toHaveBeenCalledWith({
      source: 'mapbox-dem',
      exaggeration: 0.5,
    })
  })

  it('adds trek GeoJSON source with provided data', () => {
    addDataLayer(mockMap as never, mockMarkerCollection)
    expect(mockMap.addSource).toHaveBeenCalledWith(
      'trek',
      expect.objectContaining({
        type: 'geojson',
        data: mockMarkerCollection,
        cluster: true,
        clusterMaxZoom: 14,
        clusterRadius: 50,
      }),
    )
  })

  it('adds sky, clusters, cluster-count, unclustered-point, event-count, and selected-marker layers', () => {
    addDataLayer(mockMap as never, mockMarkerCollection)
    const layerIds = mockMap.addLayer.mock.calls.map((c) => c[0].id)
    expect(layerIds).toContain('sky')
    expect(layerIds).toContain('clusters')
    expect(layerIds).toContain('cluster-count')
    expect(layerIds).toContain('unclustered-point')
    expect(layerIds).toContain('event-count')
    expect(layerIds).toContain('selected-marker')
    expect(mockMap.addLayer).toHaveBeenCalledTimes(6)
  })

  it('uses custom options when provided', () => {
    const options: MapLayerOptions = {
      terrainExaggeration: 1,
      skyType: 'gradient',
      skyAtmosphereSun: [90, 45],
      skyAtmosphereSunIntensity: 25,
      clusterColor: '#ff0000',
      clusterStrokeOpacity: 0.8,
      circleOpacity: 0.9,
    }
    addDataLayer(mockMap as never, mockMarkerCollection, options)
    expect(mockMap.setTerrain).toHaveBeenCalledWith({
      source: 'mapbox-dem',
      exaggeration: 1,
    })
    const skyLayer = mockMap.addLayer.mock.calls.find((c) => c[0].id === 'sky')
    expect(skyLayer).toBeDefined()
    expect(skyLayer![0].paint).toMatchObject({
      'sky-type': 'gradient',
      'sky-atmosphere-sun': [90, 45],
      'sky-atmosphere-sun-intensity': 25,
    })
    const clustersLayer = mockMap.addLayer.mock.calls.find(
      (c) => c[0].id === 'clusters',
    )
    expect(clustersLayer![0].paint).toMatchObject({
      'circle-color': '#ff0000',
      'circle-opacity': 0.9,
      'circle-stroke-opacity': 0.8,
    })
  })
})
