import { describe, it, expect } from 'vitest'
import { data } from '@/data'

describe('data', () => {
  it('is a FeatureCollection', () => {
    expect(data.type).toBe('FeatureCollection')
  })

  it('has features array', () => {
    expect(Array.isArray(data.features)).toBe(true)
    expect(data.features.length).toBeGreaterThan(0)
  })

  it('each marker has required GeoJSON shape', () => {
    data.features.forEach((marker, i) => {
      expect(marker.type).toBe('Feature')
      expect(marker.id).toBe(i + 1)
      expect(marker.geometry.type).toBe('Point')
      expect(Array.isArray(marker.geometry.coordinates)).toBe(true)
      expect(marker.geometry.coordinates).toHaveLength(2)
      expect(typeof marker.properties.altitude).toBe('number')
      expect(marker.properties.cluster).toBe(false)
      expect(marker.properties.event_count).toBe(1)
      expect(marker.properties.venue).toBe('trek')
    })
  })

  it('marker ids are sequential from 1 to n', () => {
    const ids = data.features.map((f) => f.id)
    const expected = Array.from(
      { length: data.features.length },
      (_, i) => i + 1,
    )
    expect(ids).toEqual(expected)
  })
})
