import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import RightPanel from '@/components/RightPanel'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DEFAULT_MAP_SETTINGS } from '@/types'

const defaultProps = {
  selectedMarker: null,
  onPrev: vi.fn(),
  onNext: vi.fn(),
  onStartTrek: vi.fn(),
  settings: DEFAULT_MAP_SETTINGS,
  onSettingsChange: vi.fn(),
}

function renderWithTheme(ui: React.ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>)
}

describe('RightPanel', () => {
  it('renders Data and Settings tab buttons', () => {
    renderWithTheme(<RightPanel {...defaultProps} />)
    expect(screen.getByRole('button', { name: /^data$/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^settings$/i })).toBeInTheDocument()
  })

  it('shows Content tab by default', () => {
    renderWithTheme(<RightPanel {...defaultProps} />)
    expect(screen.getByText(/namaste/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start trek/i })).toBeInTheDocument()
  })

  it('shows Settings tab when Settings is clicked', () => {
    renderWithTheme(<RightPanel {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /^settings$/i }))
    expect(screen.getByLabelText(/map style/i)).toBeInTheDocument()
    expect(screen.queryByText(/namaste/i)).not.toBeInTheDocument()
  })

  it('shows map controls instructions in Settings tab', () => {
    renderWithTheme(<RightPanel {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /^settings$/i }))
    expect(screen.getByText(/hold left mouse button to drag/i)).toBeInTheDocument()
  })

  it('calls onStartTrek when Start trek is clicked', () => {
    renderWithTheme(<RightPanel {...defaultProps} />)
    fireEvent.click(screen.getByRole('button', { name: /start trek/i }))
    expect(defaultProps.onStartTrek).toHaveBeenCalledTimes(1)
  })
})
