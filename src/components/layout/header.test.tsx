import { describe, it, expect, vi } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './header'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        'nav.sermons': 'Sermons',
        'nav.learn': 'Learn',
        'nav.radio': 'Radio',
        'nav.community': 'Community',
        'nav.about': 'About',
        'nav.signIn': 'Sign In',
        'nav.signUp': 'Sign Up',
        'nav.menu': 'Menu',
        'nav.switchToAmharic': 'Switch to Amharic',
        'nav.switchToEnglish': 'Switch to English',
      }
      return dict[key] ?? key
    },
    language: 'en',
  }),
}))

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header user={null} profile={null} />)
    expect(screen.getByText('Sermons')).toBeInTheDocument()
    expect(screen.getByText('Learn')).toBeInTheDocument()
    expect(screen.getByText('Radio')).toBeInTheDocument()
    expect(screen.getByText('Community')).toBeInTheDocument()
  })

  it('shows sign in button for guests', () => {
    render(<Header user={null} profile={null} />)
    expect(screen.getByText('Sign In')).toBeInTheDocument()
  })

  it('shows user avatar when logged in', () => {
    const user = { id: 'u1', email: 'test@example.com' } as any
    render(<Header user={user} profile={{ full_name: 'Test User' } as any} />)
    // Avatar fallback shows initials
    expect(screen.getByText('TU')).toBeInTheDocument()
  })
})
