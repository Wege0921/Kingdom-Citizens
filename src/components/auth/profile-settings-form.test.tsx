import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProfileSettingsForm } from './profile-settings-form'

const mockUpdate = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      update: () => ({
        eq: mockUpdate,
      }),
    }),
  }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

describe('ProfileSettingsForm', () => {
  const profile = {
    id: 'user-1',
    full_name: 'John Doe',
    avatar_url: null,
    role: 'MEMBER',
    language_preference: 'en',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  } as any

  beforeEach(() => {
    vi.clearAllMocks()
    mockUpdate.mockResolvedValue({ error: null })
  })

  it('renders form with profile data', () => {
    render(<ProfileSettingsForm profile={profile} />)
    expect(screen.getByDisplayValue('John Doe')).toBeInTheDocument()
  })

  it('renders language preference select', () => {
    render(<ProfileSettingsForm profile={profile} />)
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('has notifications section', () => {
    render(<ProfileSettingsForm profile={profile} />)
    expect(screen.getByText('Notifications')).toBeInTheDocument()
    expect(screen.getByText('Push Notifications')).toBeInTheDocument()
  })
})
