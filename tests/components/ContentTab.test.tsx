import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ContentTab from '@/components/ContentTab'
import type { TrekMarkerType } from '@/types'

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- mock for tests
    <img src={src} alt={alt} />
  ),
}))

const noMarkerProps = {
  selectedMarker: null as TrekMarkerType | null,
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onStartTrek: vi.fn(),
}

const fixtureMarker: TrekMarkerType = {
  type: 'Feature',
  id: 2,
  properties: {
    altitude: 800,
    cluster: false,
    event_count: 1,
    venue: 'trek',
  },
  geometry: {
    type: 'Point',
    coordinates: [84.365696, 28.257915],
  },
}

describe('ContentTab', () => {
  it('shows intro when no marker is selected', () => {
    render(<ContentTab {...noMarkerProps} />)
    expect(screen.getByText(/namaste/i)).toBeInTheDocument()
    expect(screen.getByText(/annapurna circuit/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start trek/i })).toBeInTheDocument()
    expect(screen.getByText(/or click a marker on the map/i)).toBeInTheDocument()
  })

  it('calls onStartTrek when Start trek is clicked', () => {
    render(<ContentTab {...noMarkerProps} />)
    fireEvent.click(screen.getByRole('button', { name: /start trek/i }))
    expect(noMarkerProps.onStartTrek).toHaveBeenCalledTimes(1)
  })

  it('shows marker detail when a marker is selected', () => {
    render(
      <ContentTab
        {...noMarkerProps}
        selectedMarker={fixtureMarker}
      />,
    )
    expect(screen.getByAltText(/trek stop 2/i)).toBeInTheDocument()
    expect(screen.queryByText(/namaste/i)).not.toBeInTheDocument()
  })

  it('calls onPrev when Prev is clicked and marker is selected', () => {
    const onPrev = vi.fn()
    render(
      <ContentTab
        {...noMarkerProps}
        selectedMarker={fixtureMarker}
        onPrev={onPrev}
      />,
    )
    const prevButton = screen.getByRole('button', { name: /prev/i })
    fireEvent.click(prevButton)
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when Next is clicked and marker is selected', () => {
    const onNext = vi.fn()
    render(
      <ContentTab
        {...noMarkerProps}
        selectedMarker={fixtureMarker}
        onNext={onNext}
      />,
    )
    const nextButton = screen.getByRole('button', { name: /next/i })
    fireEvent.click(nextButton)
    expect(onNext).toHaveBeenCalledTimes(1)
  })
})
