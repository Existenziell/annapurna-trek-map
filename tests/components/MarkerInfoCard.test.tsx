import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MarkerInfoCard from '@/components/MarkerInfoCard'
import type { TrekMarkerType } from '@/types'

const markerWithProperties: TrekMarkerType = {
  type: 'Feature',
  id: 1,
  properties: {
    altitude: 1200,
    cluster: false,
    event_count: 1,
    venue: 'trek',
    image: '1.jpg',
  },
  geometry: {
    type: 'Point',
    coordinates: [84.1, 28.5],
  },
}

const markerWithDateTime: TrekMarkerType = {
  ...markerWithProperties,
  id: 2,
  properties: {
    ...markerWithProperties.properties!,
    dateTime: '2019-11-15T10:00:00Z',
  },
}

describe('MarkerInfoCard', () => {
  it('returns null when marker has no properties', () => {
    const { container } = render(
      <MarkerInfoCard marker={{ ...markerWithProperties, properties: undefined! }} />,
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders altitude', () => {
    render(<MarkerInfoCard marker={markerWithProperties} />)
    const altParagraph = screen.getByText((_, el) => (el?.textContent?.trim() === 'Alt: 1200m' && el?.tagName === 'P'))
    expect(altParagraph).toBeInTheDocument()
  })

  it('renders date when dateTime is set', () => {
    render(<MarkerInfoCard marker={markerWithDateTime} />)
    const altParagraph = screen.getByText((_, el) => (el?.textContent?.trim() === 'Alt: 1200m' && el?.tagName === 'P'))
    expect(altParagraph).toBeInTheDocument()
    // Component uses toLocaleDateString(undefined, { dateStyle: 'medium' }); format varies by locale
    expect(screen.getByText(/2019/)).toBeInTheDocument()
  })
})
