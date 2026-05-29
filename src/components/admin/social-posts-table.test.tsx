import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SocialPostsTable } from './social-posts-table'

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

describe('SocialPostsTable', () => {
  const posts = [
    {
      id: 'sp1',
      sermon_id: 's1',
      platform: 'facebook',
      caption_en: 'Check out this sermon',
      caption_am: '',
      image_url: null,
      status: 'published',
      scheduled_for: null,
      published_at: '2024-01-01',
      external_post_id: null,
      created_by: null,
      created_at: '',
      updated_at: '',
      sermon: { title_en: 'Faith Walk' },
    },
  ] as any

  it('renders post status', () => {
    render(<SocialPostsTable posts={posts} />)
    expect(screen.getByText('published')).toBeInTheDocument()
  })

  it('has search input', () => {
    render(<SocialPostsTable posts={posts} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
