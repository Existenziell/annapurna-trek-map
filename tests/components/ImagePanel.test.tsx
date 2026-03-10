import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ImagePanel from '@/components/ImagePanel'
import { ThemeProvider } from '@/components/ThemeProvider'
import type { TrekMarkerType } from '@/types'

vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => (
    // eslint-disable-next-line @next/next/no-img-element -- mock for tests
    <img src={src} alt={alt} />
  ),
}))

const defaultProps = {
  selectedMarker: null as TrekMarkerType | null,
  onPrev: vi.fn(),
  onNext: vi.fn(),
}

const fixtureMarker: TrekMarkerType = {
  type: 'Feature',
  id: 2,
  properties: {
    altitude: 800,
    cluster: false,
    event_count: 1,
    venue: 'trek',
    image: '2.jpg',
  },
  geometry: {
    type: 'Point',
    coordinates: [84.365696, 28.257915],
  },
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('ImagePanel', () => {
  it('does not show welcome content when no marker selected', () => {
    renderWithTheme(<ImagePanel {...defaultProps} />)
    expect(screen.queryByText(/namaste/i)).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /start trek/i })).not.toBeInTheDocument()
  })

  it('shows marker detail when a marker is selected', () => {
    renderWithTheme(
      <ImagePanel {...defaultProps} selectedMarker={fixtureMarker} />,
    )
    expect(screen.getByAltText(/trek stop 2/i)).toBeInTheDocument()
    expect(screen.getByRole('img')).toHaveAttribute('src', '/trek/2.jpg')
    expect(screen.queryByText(/namaste/i)).not.toBeInTheDocument()
  })

  it('shows placeholder when marker has no image or video', () => {
    const markerWithoutMedia: TrekMarkerType = {
      ...fixtureMarker,
      properties: { ...fixtureMarker.properties!, image: undefined },
    }
    renderWithTheme(
      <ImagePanel {...defaultProps} selectedMarker={markerWithoutMedia} />,
    )
    expect(screen.getByText(/no image/i)).toBeInTheDocument()
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(document.querySelector('video')).not.toBeInTheDocument()
  })

  it('shows video when marker has video (video takes precedence over image)', () => {
    const markerWithVideo: TrekMarkerType = {
      ...fixtureMarker,
      id: 99,
      properties: {
        ...fixtureMarker.properties!,
        image: '2.jpg',
        video: 'video/01.mp4',
      },
    }
    const { container } = renderWithTheme(
      <ImagePanel {...defaultProps} selectedMarker={markerWithVideo} />,
    )
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/trek/video/01.mp4')
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
  })

  it('shows video when marker has video only', () => {
    const markerVideoOnly: TrekMarkerType = {
      ...fixtureMarker,
      id: 98,
      properties: {
        ...fixtureMarker.properties!,
        image: undefined,
        video: 'video/heli.mp4',
      },
    }
    const { container } = renderWithTheme(
      <ImagePanel {...defaultProps} selectedMarker={markerVideoOnly} />,
    )
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/trek/video/heli.mp4')
  })

})
