import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { SermonCard } from '@/components/sermon/sermon-card'
import { SermonFilters } from '@/components/sermon/sermon-filters'
import { ShareButtons } from '@/components/sermon/share-buttons'
import { BookmarkToggle } from '@/components/sermon/bookmark-toggle'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/sermons',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/store', () => ({
  useAppStore: () => ({ language: 'en' }),
}))

vi.mock('@/lib/youtube', () => ({
  compressThumbnailUrl: (url: string) => url,
  getYoutubeVideoId: (url: string | null) => {
    if (!url) return null
    const match = url.match(/v=([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  },
}))

vi.mock('@/lib/sanitize', () => ({
  sanitizeHTML: (html: string) => html,
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

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({ eq: () => ({ maybeSingle: () => Promise.resolve({ data: null }) }) }),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      delete: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
    }),
  }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    bookmark: {
      toggle: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
        }),
      },
      isBookmarked: {
        useQuery: () => ({ data: false, isLoading: false }),
      },
    },
    useUtils: () => ({
      invalidate: vi.fn(),
    }),
  },
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('Sermon Discovery Flow', () => {
  const sermon = {
    id: 's1',
    title_en: 'Faith Walk',
    title_am: 'የእምነት ጉዞ',
    summary_en: 'Walking by faith',
    summary_am: '',
    video_url: 'https://youtube.com/watch?v=abc123',
    video_thumbnail: 'https://img.youtube.com/vi/abc/hqdefault.jpg',
    speaker_id: 'sp1',
    speaker: { id: 'sp1', name: 'Pastor John', name_am: '', bio_en: '', bio_am: '', avatar_url: null, is_active: true, created_at: '', updated_at: '' },
    series_id: 'ser1',
    series: { id: 'ser1', title_en: 'Foundations', title_am: '', description_en: '', description_am: '', cover_image: null, is_active: true, created_at: '', updated_at: '' },
    published_at: '2024-01-15',
    created_at: '',
    updated_at: '',
    is_published: true,
    created_by: 'u1',
    language: 'en',
  } as any

  const speakers = [{ id: 'sp1', name: 'Pastor John' }]
  const seriesList = [{ id: 'ser1', title_en: 'Foundations' }]
  const topics = [{ id: 't1', name_en: 'Faith' }]

  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn(() => Promise.resolve()) },
      writable: true,
      configurable: true,
    })
  })

  it('user browses sermon card and sees share buttons', () => {
    render(
      <div>
        <SermonCard sermon={sermon} />
        <ShareButtons url="https://example.com/sermons/s1" title="Faith Walk" />
      </div>
    )

    // Sermon card renders
    expect(screen.getByText('Faith Walk')).toBeInTheDocument()
    expect(screen.getByText('Pastor John')).toBeInTheDocument()

    // Share buttons are present (dropdown trigger shows "More")
    expect(screen.getByRole('button', { name: /more/i })).toBeInTheDocument()
  })

  it('user filters sermons by speaker', async () => {
    render(
      <SermonFilters
        speakers={speakers}
        seriesList={seriesList}
        topics={topics}
      />
    )

    // Filters render
    expect(screen.getByText(/sermons.speaker/i)).toBeInTheDocument()
  })

  it('user sees bookmark toggle with sermon', () => {
    render(
      <div>
        <SermonCard sermon={sermon} />
        <BookmarkToggle sermonId="s1" initialBookmarked={false} isLoggedIn={true} />
      </div>
    )

    // Sermon title and bookmark button both render
    expect(screen.getByText('Faith Walk')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /bookmark/i })).toBeInTheDocument()
  })
})
