import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Footer } from './footer'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        'footer.resources': 'Resources',
        'footer.account': 'Account',
        'footer.connect': 'Connect',
        'footer.tagline': 'Growing together in faith',
        'footer.rights': 'All rights reserved',
        'footer.madeWith': 'Made with love',
      }
      return dict[key] ?? key
    },
    language: 'en',
  }),
}))

describe('Footer', () => {
  it('renders footer sections', () => {
    render(<Footer />)
    expect(screen.getByText('Resources')).toBeInTheDocument()
    expect(screen.getByText('Account')).toBeInTheDocument()
    expect(screen.getByText('Connect')).toBeInTheDocument()
  })

  it('renders tagline', () => {
    render(<Footer />)
    expect(screen.getByText('Growing together in faith')).toBeInTheDocument()
  })

  it('renders copyright notice', () => {
    render(<Footer />)
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument()
  })
})
