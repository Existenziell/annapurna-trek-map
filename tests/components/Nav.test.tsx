import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import Nav from '@/components/Nav'

describe('Nav', () => {
  it('renders Prev and Next buttons', () => {
    render(
      <Nav
        onPrev={vi.fn()}
        onNext={vi.fn()}
        selectedMarkerId={5}
        totalMarkers={10}
      />,
    )
    expect(screen.getByRole('button', { name: /previous marker/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next marker/i })).toBeInTheDocument()
  })

  it('calls onPrev when Prev is clicked', () => {
    const onPrev = vi.fn()
    render(
      <Nav
        onPrev={onPrev}
        onNext={vi.fn()}
        selectedMarkerId={3}
        totalMarkers={10}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /previous marker/i }))
    expect(onPrev).toHaveBeenCalledTimes(1)
  })

  it('calls onNext when Next is clicked', () => {
    const onNext = vi.fn()
    render(
      <Nav
        onPrev={vi.fn()}
        onNext={onNext}
        selectedMarkerId={3}
        totalMarkers={10}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /next marker/i }))
    expect(onNext).toHaveBeenCalledTimes(1)
  })

  it('disables Prev when selectedMarkerId is 1', () => {
    render(
      <Nav
        onPrev={vi.fn()}
        onNext={vi.fn()}
        selectedMarkerId={1}
        totalMarkers={10}
      />,
    )
    expect(screen.getByRole('button', { name: /previous marker/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /next marker/i })).not.toBeDisabled()
  })

  it('disables Next when selectedMarkerId equals totalMarkers', () => {
    render(
      <Nav
        onPrev={vi.fn()}
        onNext={vi.fn()}
        selectedMarkerId={10}
        totalMarkers={10}
      />,
    )
    expect(screen.getByRole('button', { name: /next marker/i })).toBeDisabled()
    expect(screen.getByRole('button', { name: /previous marker/i })).not.toBeDisabled()
  })
})
