import { describe, it, expect } from 'vitest'
import {
  haversineMeters,
  minDistanceToOtherMarkers,
  zoomFromDistance,
  zoomToUncluster,
  computeTargetZoom,
} from '@/lib/mapZoom'
import { data } from '@/data'
import {
  MARKER_ZOOM_MAX,
  MARKER_ZOOM_MIN,
  MARKER_ZOOM,
} from '@/lib/constants'

describe('haversineMeters', () => {
  it('returns 0 for same point', () => {
    expect(haversineMeters([84, 28], [84, 28])).toBe(0)
  })

  it('returns positive distance for different points', () => {
    const d = haversineMeters([84, 28], [84.001, 28])
    expect(d).toBeGreaterThan(0)
    expect(d).toBeLessThan(200)
  })

  it('is symmetric', () => {
    expect(haversineMeters([84, 28], [84.1, 28.5])).toBe(
      haversineMeters([84.1, 28.5], [84, 28]),
    )
  })
})

describe('minDistanceToOtherMarkers', () => {
  it('returns distance to nearest other marker', () => {
    const marker = data.features[0]
    const min = minDistanceToOtherMarkers(marker, data)
    expect(min).toBeGreaterThan(0)
    expect(Number.isFinite(min)).toBe(true)
  })

  it('returns large value when only one feature', () => {
    const single = {
      type: 'FeatureCollection' as const,
      features: [data.features[0]],
    }
    const min = minDistanceToOtherMarkers(data.features[0], single)
    expect(min).toBeGreaterThan(400)
  })
})

describe('zoomFromDistance', () => {
  it('returns lower zoom for short distance', () => {
    const short = zoomFromDistance(100)
    const long = zoomFromDistance(10_000)
    expect(short).toBeLessThan(long)
    expect(short).toBeGreaterThanOrEqual(MARKER_ZOOM_MIN)
    expect(long).toBeLessThanOrEqual(MARKER_ZOOM)
  })

  it('clamps to minZoom and maxZoom', () => {
    expect(zoomFromDistance(0)).toBe(MARKER_ZOOM_MIN)
    expect(zoomFromDistance(100_000)).toBeLessThanOrEqual(MARKER_ZOOM)
  })
})

describe('zoomToUncluster', () => {
  it('returns higher zoom for smaller min distance', () => {
    const tight = zoomToUncluster(50)
    const loose = zoomToUncluster(500)
    expect(tight).toBeGreaterThan(loose)
    expect(tight).toBeLessThanOrEqual(MARKER_ZOOM_MAX)
    expect(loose).toBeGreaterThanOrEqual(14)
  })

  it('clamps to min and max zoom', () => {
    expect(zoomToUncluster(1)).toBeLessThanOrEqual(MARKER_ZOOM_MAX)
    expect(zoomToUncluster(10_000)).toBeGreaterThanOrEqual(14)
  })
})

describe('computeTargetZoom', () => {
  it('returns zoom within MARKER_ZOOM_MIN and MARKER_ZOOM_MAX', () => {
    const marker = data.features[0]
    const z = computeTargetZoom(marker, data)
    expect(z).toBeGreaterThanOrEqual(MARKER_ZOOM_MIN)
    expect(z).toBeLessThanOrEqual(MARKER_ZOOM_MAX)
  })

  it('returns higher zoom when fromMarker is close (short hop => lower zoomFromDistance, but cluster may require higher)', () => {
    const from = data.features[0]
    const to = data.features[1]
    const zWithFrom = computeTargetZoom(to, data, from)
    const zWithoutFrom = computeTargetZoom(to, data)
    expect(zWithFrom).toBeGreaterThanOrEqual(MARKER_ZOOM_MIN)
    expect(zWithFrom).toBeLessThanOrEqual(MARKER_ZOOM_MAX)
    expect(zWithoutFrom).toBeGreaterThanOrEqual(MARKER_ZOOM_MIN)
    expect(zWithoutFrom).toBeLessThanOrEqual(MARKER_ZOOM_MAX)
  })
})
