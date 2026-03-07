import { describe, it, expect, vi, beforeEach } from 'vitest'
import { flyToMarker } from '@/lib/flyToMarker'
import { data } from '@/data'

describe('flyToMarker', () => {
  let mockMap: { flyTo: ReturnType<typeof vi.fn> }

  beforeEach(() => {
    mockMap = { flyTo: vi.fn() }
  })

  it('calls map.flyTo with center, duration, curve and essential', () => {
    flyToMarker(mockMap as never, 1, data)
    expect(mockMap.flyTo).toHaveBeenCalledTimes(1)
    const [flyToArg] = mockMap.flyTo.mock.calls[0]
    expect(flyToArg).toMatchObject({
      center: expect.any(Array),
      duration: expect.any(Number),
      curve: expect.any(Number),
      essential: true,
    })
    expect((flyToArg as { center: [number, number] }).center).toHaveLength(2)
  })

  it('flies to marker 2 when flyToMarker(map, 2, data)', () => {
    flyToMarker(mockMap as never, 2, data)
    const marker2 = data.features.find((f) => f.id === 2)
    expect(marker2).toBeDefined()
    const expectedCenter = marker2!.geometry.coordinates
    const [flyToArg] = mockMap.flyTo.mock.calls[0]
    expect((flyToArg as { center: [number, number] }).center).toEqual(
      expectedCenter,
    )
  })

  it('does not call flyTo when marker id is not found', () => {
    flyToMarker(mockMap as never, 99999, data)
    expect(mockMap.flyTo).not.toHaveBeenCalled()
  })
})
