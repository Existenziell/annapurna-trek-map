import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Welcome from '@/components/Welcome'

describe('Welcome', () => {
  it('renders heading and copy', () => {
    render(<Welcome onStartTrek={vi.fn()} />)
    expect(screen.getByRole('heading', { name: /namaste/i })).toBeInTheDocument()
    expect(screen.getByText(/Annapurna Circuit/i)).toBeInTheDocument()
    expect(screen.getByText(/Start trek/)).toBeInTheDocument()
    expect(screen.getByText(/Or click a marker on the map/i)).toBeInTheDocument()
  })

  it('calls onStartTrek when Start trek is clicked', () => {
    const onStartTrek = vi.fn()
    render(<Welcome onStartTrek={onStartTrek} />)
    fireEvent.click(screen.getByRole('button', { name: /start trek/i }))
    expect(onStartTrek).toHaveBeenCalledTimes(1)
  })
})
