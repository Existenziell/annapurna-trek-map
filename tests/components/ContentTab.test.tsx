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
    image: '2.jpg',
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
    expect(screen.getByRole('img')).toHaveAttribute('src', '/trek/2.jpg')
    expect(screen.queryByText(/namaste/i)).not.toBeInTheDocument()
  })

  it('shows placeholder when marker has no image or video', () => {
    const markerWithoutMedia: TrekMarkerType = {
      ...fixtureMarker,
      properties: { ...fixtureMarker.properties, image: undefined },
    }
    render(
      <ContentTab
        {...noMarkerProps}
        selectedMarker={markerWithoutMedia}
      />,
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
        ...fixtureMarker.properties,
        image: '2.jpg',
        video: 'video/01.mp4',
      },
    }
    const { container } = render(
      <ContentTab
        {...noMarkerProps}
        selectedMarker={markerWithVideo}
      />,
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
        ...fixtureMarker.properties,
        image: undefined,
        video: 'video/heli.mp4',
      },
    }
    const { container } = render(
      <ContentTab
        {...noMarkerProps}
        selectedMarker={markerVideoOnly}
      />,
    )
    const video = container.querySelector('video')
    expect(video).toBeInTheDocument()
    expect(video).toHaveAttribute('src', '/trek/video/heli.mp4')
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
