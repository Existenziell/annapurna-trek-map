import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsPanel from '@/components/SettingsPanel'
import { ThemeProvider } from '@/components/ThemeProvider'
import { DEFAULT_MAP_SETTINGS } from '@/types'
import type { MapSettings } from '@/types'

function renderWithTheme(
  props: {
    open: boolean
    onClose: () => void
    settings: MapSettings
    onChange: (s: MapSettings) => void
  },
) {
  return render(
    <ThemeProvider>
      <SettingsPanel {...props} />
    </ThemeProvider>,
  )
}

describe('SettingsPanel', () => {
  it('renders nothing when open is false', () => {
    renderWithTheme({
      open: false,
      onClose: vi.fn(),
      settings: DEFAULT_MAP_SETTINGS,
      onChange: vi.fn(),
    })
    expect(screen.queryByRole('dialog', { name: /settings/i })).not.toBeInTheDocument()
  })

  it('renders dialog with Settings when open is true', () => {
    renderWithTheme({
      open: true,
      onClose: vi.fn(),
      settings: DEFAULT_MAP_SETTINGS,
      onChange: vi.fn(),
    })
    expect(screen.getByRole('dialog', { name: /settings/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^settings$/i })).toBeInTheDocument()
  })

  it('calls onClose when Close button is clicked', () => {
    const onClose = vi.fn()
    renderWithTheme({
      open: true,
      onClose,
      settings: DEFAULT_MAP_SETTINGS,
      onChange: vi.fn(),
    })
    fireEvent.click(screen.getByRole('button', { name: /close settings/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onClose when overlay (dialog) is clicked', () => {
    const onClose = vi.fn()
    renderWithTheme({
      open: true,
      onClose,
      settings: DEFAULT_MAP_SETTINGS,
      onChange: vi.fn(),
    })
    fireEvent.click(screen.getByRole('dialog', { name: /settings/i }))
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('calls onChange when map style is changed', () => {
    const onChange = vi.fn()
    renderWithTheme({
      open: true,
      onClose: vi.fn(),
      settings: DEFAULT_MAP_SETTINGS,
      onChange,
    })
    const streetsOption = screen.getByRole('radio', { name: /streets/i })
    fireEvent.click(streetsOption)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        mapStyle: 'mapbox://styles/mapbox/streets-v12',
      }),
    )
  })

  it('calls onChange with DEFAULT_MAP_SETTINGS when Reset to default is clicked', () => {
    const onChange = vi.fn()
    renderWithTheme({
      open: true,
      onClose: vi.fn(),
      settings: DEFAULT_MAP_SETTINGS,
      onChange,
    })
    fireEvent.click(
      screen.getByRole('button', { name: /reset all settings to default/i }),
    )
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(DEFAULT_MAP_SETTINGS)
  })
})
