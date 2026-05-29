import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SermonsTable } from './sermons-table'

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

describe('SermonsTable', () => {
  const mockSermons = [
    {
      id: 's1',
      title_en: 'Faith Walk',
      title_am: '',
      summary_en: 'Walking by faith.',
      summary_am: '',
      video_url: '',
      video_thumbnail: null,
      speaker_id: 'sp1',
      speaker: { id: 'sp1', name: 'Pastor John', name_am: '', bio: '', bio_am: '', image_url: null, created_at: '', updated_at: '' },
      series_id: null,
      series: null,
      published_at: '2024-01-15',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      is_published: true,
      created_by_id: 'u1',
      language: 'en',
    },
  ] as any

  it('renders table with sermon data', () => {
    render(<SermonsTable sermons={mockSermons} />)
    expect(screen.getByText('Faith Walk')).toBeInTheDocument()
    expect(screen.getByText('Pastor John')).toBeInTheDocument()
  })

  it('has search input', () => {
    render(<SermonsTable sermons={mockSermons} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
