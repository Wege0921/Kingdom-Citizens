import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { FeaturedSermons } from './featured-sermons'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

vi.mock('@/lib/youtube', () => ({
  compressThumbnailUrl: (url: string) => url,
}))

describe('FeaturedSermons', () => {
  const mockSermons = [
    {
      id: 's1',
      title_en: 'The Good Shepherd',
      title_am: 'የጥሩ እረኛ',
      summary_en: 'A sermon about Jesus as our shepherd.',
      summary_am: '',
      video_url: 'https://youtube.com/watch?v=abc',
      video_thumbnail: 'https://img.youtube.com/vi/abc/hqdefault.jpg',
      speaker_id: 'sp1',
      speaker: { id: 'sp1', name: 'Pastor John', name_am: '', bio: '', bio_am: '', image_url: null, created_at: '', updated_at: '' },
      series_id: 'ser1',
      series: { id: 'ser1', title_en: 'Foundations', title_am: '', description: '', description_am: '', created_at: '', updated_at: '' },
      published_at: '2024-01-15T10:00:00Z',
      created_at: '2024-01-15',
      updated_at: '2024-01-15',
      is_published: true,
      created_by_id: 'u1',
      language: 'en',
    },
  ] as any

  it('renders empty state', () => {
    render(<FeaturedSermons sermons={[]} />)
    expect(screen.getByText('home.latestSermons')).toBeInTheDocument()
    expect(screen.getByText('home.noSermonsYet')).toBeInTheDocument()
  })

  it('renders sermon cards', () => {
    render(<FeaturedSermons sermons={mockSermons} />)
    expect(screen.getByText('The Good Shepherd')).toBeInTheDocument()
    expect(screen.getByText('Pastor John')).toBeInTheDocument()
    expect(screen.getByText('Foundations')).toBeInTheDocument()
  })

  it('has view all link', () => {
    render(<FeaturedSermons sermons={mockSermons} />)
    expect(screen.getByText('home.viewAll')).toBeInTheDocument()
  })
})
