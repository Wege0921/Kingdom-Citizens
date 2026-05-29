import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminSidebar } from './admin-sidebar'

vi.mock('next/navigation', () => ({
  usePathname: () => '/admin',
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        'admin.title': 'Admin',
        'admin.dashboard': 'Dashboard',
        'admin.sermons': 'Sermons',
        'admin.speakers': 'Speakers',
        'admin.series': 'Series',
        'admin.topics': 'Topics',
        'admin.socialPosts': 'Social Posts',
        'admin.learningPaths': 'Learning Paths',
        'admin.notifications': 'Notifications',
        'admin.settings': 'Settings',
      }
      return dict[key] ?? key
    },
    language: 'en',
  }),
}))

describe('AdminSidebar', () => {
  const profile = {
    id: 'u1',
    full_name: 'Admin User',
    role: 'ADMIN',
    language_preference: 'en',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  } as any

  it('renders admin title', () => {
    render(<AdminSidebar profile={profile} />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('renders navigation links', () => {
    render(<AdminSidebar profile={profile} />)
    expect(screen.getAllByText('Dashboard').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Sermons').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Speakers').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Series').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Topics').length).toBeGreaterThanOrEqual(1)
  })

  it('has collapse toggle button', () => {
    render(<AdminSidebar profile={profile} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
