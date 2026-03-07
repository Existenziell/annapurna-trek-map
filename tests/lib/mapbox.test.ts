import { describe, it, expect } from 'vitest'
import { mapbox } from '@/lib/mapbox'

describe('mapbox', () => {
  it('exports mapbox object', () => {
    expect(mapbox).toBeDefined()
    expect(typeof mapbox).toBe('object')
  })

  it('has accessToken property (string)', () => {
    expect(mapbox).toHaveProperty('accessToken')
    expect(typeof mapbox.accessToken).toBe('string')
  })

  it('has Popup constructor', () => {
    expect(mapbox.Popup).toBeDefined()
    expect(typeof mapbox.Popup).toBe('function')
  })
})
