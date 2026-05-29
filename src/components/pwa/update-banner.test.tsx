import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'
import { UpdateBanner } from './UpdateBanner'

describe('UpdateBanner', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: Promise.resolve({ addEventListener: vi.fn(), installing: null }) },
      writable: true,
      configurable: true,
    })
  })

  it('renders without crashing', () => {
    const { container } = render(<UpdateBanner />)
    expect(container).toBeInTheDocument()
  })
})
