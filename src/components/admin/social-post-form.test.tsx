import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SocialPostForm } from './social-post-form'

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

describe('SocialPostForm', () => {
  const sermons = [
    { id: 's1', title_en: 'Faith Walk', title_am: '', speaker_id: 'sp1', series_id: null, summary_en: '', summary_am: '', video_url: '', video_thumbnail: null, audio_url: null, pdf_url: null, memory_verse_en: null, memory_verse_am: null, prayer_points: [], discussion_questions: [], is_published: true, published_at: null, scheduled_at: null, view_count: 0, created_by: null, created_at: '', updated_at: '', language: 'en' },
  ] as any

  it('renders empty form', () => {
    render(<SocialPostForm sermons={sermons} />)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders platform select', () => {
    render(<SocialPostForm sermons={sermons} />)
    expect(screen.getByText('facebook')).toBeInTheDocument()
  })
})
