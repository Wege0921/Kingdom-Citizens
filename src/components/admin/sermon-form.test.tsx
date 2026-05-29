import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SermonForm } from './sermon-form'

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
    auth: { getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } } })) },
    from: () => ({ insert: vi.fn(() => ({ select: vi.fn(() => Promise.resolve({ data: [{ id: 's1' }], error: null })) })) }),
  }),
}))

describe('SermonForm', () => {
  const speakers = [
    { id: 'sp1', name: 'Pastor John', bio_en: '', bio_am: '', avatar_url: null, is_active: true, created_at: '', updated_at: '' },
  ]
  const series = [
    { id: 'ser1', title_en: 'Foundations', title_am: '', description_en: '', description_am: '', cover_image: null, is_active: true, created_at: '', updated_at: '' },
  ]
  const topics = [
    { id: 't1', name_en: 'Faith', name_am: '', created_at: '', updated_at: '' },
  ]

  it('renders form fields', () => {
    render(
      <SermonForm
        speakers={speakers}
        series={series}
        topics={topics}
      />
    )
    expect(screen.getByText('admin.titleLabel')).toBeInTheDocument()
    expect(screen.getByText('admin.summary')).toBeInTheDocument()
  })

  it('renders speaker select', () => {
    render(
      <SermonForm
        speakers={speakers}
        series={series}
        topics={topics}
      />
    )
    expect(screen.getByText('Pastor John')).toBeInTheDocument()
  })
})
