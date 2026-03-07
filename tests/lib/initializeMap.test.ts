import { describe, it, expect, vi, beforeEach } from 'vitest'
import { initializeMap } from '@/lib/initializeMap'

describe('initializeMap', () => {
  let mockMap: {
    on: ReturnType<typeof vi.fn>
    getCanvas: ReturnType<typeof vi.fn>
  }

  beforeEach(() => {
    mockMap = {
      on: vi.fn(),
      getCanvas: vi.fn(() => ({ style: { cursor: '' } })),
    }
  })

  it('registers click handler for data layer', () => {
    initializeMap(mockMap as never)
    expect(mockMap.on).toHaveBeenCalledWith('click', 'data', expect.any(Function))
  })

  it('registers click handler for clusters layer', () => {
    initializeMap(mockMap as never)
    expect(mockMap.on).toHaveBeenCalledWith('click', 'clusters', expect.any(Function))
  })

  it('registers click handler for unclustered-point layer', () => {
    initializeMap(mockMap as never)
    expect(mockMap.on).toHaveBeenCalledWith(
      'click',
      'unclustered-point',
      expect.any(Function),
    )
  })

  it('registers mouseenter and mouseleave for unclustered-point and clusters', () => {
    initializeMap(mockMap as never)
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseenter',
      'unclustered-point',
      expect.any(Function),
    )
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseleave',
      'unclustered-point',
      expect.any(Function),
    )
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseenter',
      'clusters',
      expect.any(Function),
    )
    expect(mockMap.on).toHaveBeenCalledWith(
      'mouseleave',
      'clusters',
      expect.any(Function),
    )
  })

  it('calls onMarkerClick with marker when unclustered-point click handler runs', () => {
    const onMarkerClick = vi.fn()
    initializeMap(mockMap as never, { onMarkerClick })
    const clickCall = mockMap.on.mock.calls.find(
      (c: [string, string, () => void]) =>
        c[0] === 'click' && c[1] === 'unclustered-point',
    )
    expect(clickCall).toBeDefined()
    const handler = clickCall![2]
    const marker = {
      type: 'Feature' as const,
      id: 1,
      properties: {
        altitude: 1000,
        cluster: false,
        event_count: 1,
        venue: 'trek',
      },
      geometry: { type: 'Point' as const, coordinates: [84.1, 28.5] },
    }
    handler({ features: [marker] })
    expect(onMarkerClick).toHaveBeenCalledWith(marker)
  })
})
