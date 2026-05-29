import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SpeakerForm } from './speaker-form'

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
    from: () => ({ upsert: vi.fn() }),
  }),
}))

describe('SpeakerForm', () => {
  it('renders empty form', () => {
    render(<SpeakerForm />)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders form with speaker data', () => {
    const speaker = {
      id: 'sp1',
      name: 'Pastor John',
      bio_en: 'Lead pastor',
      bio_am: '',
      avatar_url: '',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    render(<SpeakerForm speaker={speaker} />)
    expect(screen.getByDisplayValue('Pastor John')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Lead pastor')).toBeInTheDocument()
  })
})
