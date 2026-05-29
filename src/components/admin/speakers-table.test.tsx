import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SpeakersTable } from './speakers-table'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({ delete: () => ({ eq: vi.fn() }) }),
  }),
}))

describe('SpeakersTable', () => {
  const speakers = [
    {
      id: 'sp1',
      name: 'Pastor John',
      bio_en: 'Lead pastor',
      bio_am: '',
      avatar_url: null,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 'sp2',
      name: 'Pastor Jane',
      bio_en: 'Youth pastor',
      bio_am: '',
      avatar_url: null,
      is_active: true,
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ]

  it('renders speaker names', () => {
    render(<SpeakersTable speakers={speakers} />)
    expect(screen.getByText('Pastor John')).toBeInTheDocument()
    expect(screen.getByText('Pastor Jane')).toBeInTheDocument()
  })

  it('has search input', () => {
    render(<SpeakersTable speakers={speakers} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
