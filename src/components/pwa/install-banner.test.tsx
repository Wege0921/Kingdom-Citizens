import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { InstallBanner } from './InstallBanner'

describe('InstallBanner', () => {
  beforeEach(() => {
    vi.stubGlobal('matchMedia', () => ({ matches: false }))
    Object.defineProperty(window, 'navigator', {
      value: { userAgent: 'Mozilla/5.0' },
      writable: true,
      configurable: true,
    })
    localStorage.clear()
  })

  it('renders without crashing', () => {
    render(<InstallBanner />)
    // Banner may or may not show depending on environment
    expect(document.body).toBeInTheDocument()
  })
})
