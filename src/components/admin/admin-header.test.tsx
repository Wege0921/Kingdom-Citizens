import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminHeader } from './admin-header'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { signOut: vi.fn() },
  }),
}))

describe('AdminHeader', () => {
  const user = { id: 'u1', email: 'admin@example.com' } as any
  const profile = {
    id: 'u1',
    full_name: 'Admin User',
    role: 'ADMIN',
    language_preference: 'en',
    created_at: '',
    updated_at: '',
  } as any

  it('renders admin title', () => {
    render(<AdminHeader user={user} profile={profile} />)
    expect(screen.getByText('admin.title')).toBeInTheDocument()
  })

  it('renders avatar fallback with initials', () => {
    render(<AdminHeader user={user} profile={profile} />)
    expect(screen.getByText('AU')).toBeInTheDocument()
  })
})
