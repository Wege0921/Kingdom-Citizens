import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SermonCard } from './sermon-card'

vi.mock('@/lib/store', () => ({
  useAppStore: () => ({ language: 'en' }),
}))

vi.mock('@/lib/youtube', () => ({
  compressThumbnailUrl: (url: string) => url,
}))

vi.mock('@/lib/sanitize', () => ({
  sanitizeHTML: (html: string) => html,
}))

describe('SermonCard', () => {
  const sermon = {
    id: 's1',
    title_en: 'Faith Walk',
    title_am: 'የእምነት ጉዞ',
    summary_en: 'Walking by faith',
    summary_am: '',
    video_url: 'https://youtube.com/watch?v=abc',
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

  it('renders sermon title', () => {
    render(<SermonCard sermon={sermon} />)
    expect(screen.getByText('Faith Walk')).toBeInTheDocument()
  })

  it('renders series badge', () => {
    render(<SermonCard sermon={sermon} />)
    expect(screen.getByText('Foundations')).toBeInTheDocument()
  })

  it('renders speaker name', () => {
    render(<SermonCard sermon={sermon} />)
    expect(screen.getByText('Pastor John')).toBeInTheDocument()
  })
})
