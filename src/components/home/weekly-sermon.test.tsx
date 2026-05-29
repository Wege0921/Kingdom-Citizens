import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { WeeklySermon } from './weekly-sermon'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

vi.mock('@/lib/youtube', () => ({
  compressThumbnailUrl: (url: string) => url,
}))

describe('WeeklySermon', () => {
  const mockSermon = {
    id: 's1',
    title_en: 'This Weeks Message',
    title_am: '',
    summary_en: '',
    summary_am: '',
    video_url: '',
    video_thumbnail: 'https://img.youtube.com/vi/abc/hqdefault.jpg',
    speaker_id: 'sp1',
    speaker: { id: 'sp1', name: 'Pastor John', name_am: '', bio_en: '', bio_am: '', avatar_url: null, is_active: true, created_at: '', updated_at: '' },
    series_id: null,
    series: null,
    published_at: new Date().toISOString(),
    created_at: '',
    updated_at: '',
    is_published: true,
    created_by: 'u1',
    language: 'en',
  } as any

  it('renders null when no sermon', () => {
    const { container } = render(<WeeklySermon sermon={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders this week badge for recent sermon', () => {
    render(<WeeklySermon sermon={mockSermon} />)
    expect(screen.getByText('home.thisWeek')).toBeInTheDocument()
    expect(screen.getByText('home.newBadge')).toBeInTheDocument()
  })

  it('renders sermon title', () => {
    render(<WeeklySermon sermon={mockSermon} />)
    expect(screen.getByText('This Weeks Message')).toBeInTheDocument()
  })
})
