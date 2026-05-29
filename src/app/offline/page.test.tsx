import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OfflinePage from './page'

describe('OfflinePage', () => {
  it('renders offline message', () => {
    render(<OfflinePage />)
    expect(screen.getByText(/you're offline/i)).toBeInTheDocument()
    expect(screen.getByText(/check your connection/i)).toBeInTheDocument()
  })

  it('has try again button', () => {
    render(<OfflinePage />)
    expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument()
  })

  it('has go home link', () => {
    render(<OfflinePage />)
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument()
  })
})
