import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { HeroSection } from './hero-section'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string, vars?: Record<string, string>) => {
      const dict: Record<string, string> = {
        'home.heroTitle': 'Welcome to Kingdom Citizens',
        'home.heroSubtitle': 'Grow in faith together',
        'home.startLearning': 'Start Learning',
        'home.joinCommunity': 'Join Community',
        'home.browseSermons': 'Browse Sermons',
        'home.getStartedFree': 'Get Started',
      }
      return dict[key] ?? key
    },
    language: 'en',
  }),
}))

describe('HeroSection', () => {
  it('renders the hero title', () => {
    render(<HeroSection isLoggedIn={false} />)
    expect(screen.getByText('Grow in Faith')).toBeInTheDocument()
    expect(screen.getByText('Together')).toBeInTheDocument()
  })

  it('shows call-to-action buttons for guests', () => {
    render(<HeroSection isLoggedIn={false} />)
    expect(screen.getByText('Get Started')).toBeInTheDocument()
    expect(screen.getByText('Browse Sermons')).toBeInTheDocument()
  })

  it('shows different CTAs for logged-in users', () => {
    render(<HeroSection isLoggedIn={true} />)
    expect(screen.getByText('Start Learning')).toBeInTheDocument()
    expect(screen.getByText('Join Community')).toBeInTheDocument()
  })
})
