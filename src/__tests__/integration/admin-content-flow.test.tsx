import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { SermonForm } from '@/components/admin/sermon-form'
import { SermonsTable } from '@/components/admin/sermons-table'
import { SpeakersTable } from '@/components/admin/speakers-table'
import { AIAutoTag } from '@/components/admin/ai-autotag'
import { AISummarizer } from '@/components/admin/ai-summarizer'

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
    from: () => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => Promise.resolve({ error: null })),
      delete: () => ({ eq: () => Promise.resolve({ error: null }) }),
    }),
  }),
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Admin Content Creation Flow', () => {
  const speakers = [
    { id: 'sp1', name: 'Pastor John', name_am: '', bio_en: '', bio_am: '', avatar_url: null, is_active: true, created_at: '', updated_at: '' },
  ]

  const seriesList = [
    { id: 'ser1', title_en: 'Foundations', title_am: '', description_en: '', description_am: '', cover_image: null, is_active: true, created_at: '', updated_at: '' },
  ]

  const topics = [
    { id: 't1', name_en: 'Faith', name_am: '', created_at: '', updated_at: '' },
  ]

  const sermons = [
    {
      id: 's1',
      title_en: 'Faith Walk',
      title_am: '',
      summary_en: 'Walking by faith',
      summary_am: '',
      video_url: 'https://youtube.com/watch?v=abc',
      video_thumbnail: '',
      speaker_id: 'sp1',
      series_id: 'ser1',
      published_at: '2024-01-15',
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-01-15T10:00:00Z',
      is_published: true,
      created_by: 'u1',
      language: 'en',
    },
  ] as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('admin views sermons table and navigates to create form', () => {
    render(
      <div>
        <SermonsTable sermons={sermons} />
        <SermonForm speakers={speakers} series={seriesList} topics={topics} />
      </div>
    )

    // Table shows sermon
    expect(screen.getByText('Faith Walk')).toBeInTheDocument()

    // Form is present
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('admin views speakers table', () => {
    render(<SpeakersTable speakers={speakers} />)

    expect(screen.getByText('Pastor John')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('admin uses AI tools for sermon content', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ topics: ['Faith', 'Trust'], summary: 'A summary' }),
    })

    render(
      <div>
        <AIAutoTag title="Faith Walk" summary="About faith" onTopicsGenerated={vi.fn()} />
        <AISummarizer sermonId="s1" onSummaryGenerated={vi.fn()} />
      </div>
    )

    // AI tools render (check for sparkles icon buttons)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(2)
  })
})
