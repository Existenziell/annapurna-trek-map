import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RightPanel from '@/components/RightPanel'
import { DEFAULT_MAP_SETTINGS } from '@/types'

const defaultProps = {
  selectedMarker: null,
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onStartTrek: vi.fn(),
  settings: DEFAULT_MAP_SETTINGS,
  onSettingsChange: vi.fn(),
}

describe('RightPanel', () => {
  it('renders Content, Controls, and Settings tab buttons', () => {
    render(<RightPanel {...defaultProps} />)
    expect(screen.getByRole('button', { name: /^content$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^controls$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^settings$/i })).toBeInTheDocument()
  })

  it('shows Content tab by default', () => {
    render(<RightPanel {...defaultProps} />)
    expect(screen.getByText(/namaste/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start trek/i })).toBeInTheDocument()
  })

  it('shows Controls tab when Controls is clicked', () => {
    render(<RightPanel {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /^controls$/i }))
    expect(screen.getByText(/hold left mouse button to drag/i)).toBeInTheDocument()
    expect(screen.queryByText(/namaste/i)).not.toBeInTheDocument()
  })

  it('shows Settings tab when Settings is clicked', () => {
    render(<RightPanel {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /^settings$/i }))
    expect(screen.getByLabelText(/map style/i)).toBeInTheDocument()
    expect(screen.queryByText(/namaste/i)).not.toBeInTheDocument()
  })

  it('calls onStartTrek when Start trek is clicked', () => {
    render(<RightPanel {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /start trek/i }))
    expect(defaultProps.onStartTrek).toHaveBeenCalledTimes(1)
  })
})
