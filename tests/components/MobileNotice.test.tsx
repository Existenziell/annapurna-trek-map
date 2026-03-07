import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import MobileNotice from '@/components/MobileNotice'

describe('MobileNotice', () => {
  it('renders title and message', () => {
    render(<MobileNotice />)
    expect(screen.getByRole('dialog', { name: /optimized for desktop/i })).toBeInTheDocument()
    expect(screen.getByText(/this app works best on a larger screen/i)).toBeInTheDocument()
  })

  it('renders OK button', () => {
    render(<MobileNotice />)
    expect(screen.getByRole('button', { name: /^ok$/i })).toBeInTheDocument()
  })

  it('dismisses when OK is clicked', () => {
    render(<MobileNotice />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /^ok$/i }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
