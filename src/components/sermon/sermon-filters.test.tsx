import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SermonFilters } from './sermon-filters'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        'sermons.filters': 'Filters',
        'sermons.speaker': 'Speaker',
        'sermons.series': 'Series',
        'sermons.topic': 'Topic',
        'sermons.sortBy': 'Sort By',
        'sermons.newest': 'Newest',
        'sermons.oldest': 'Oldest',
        'sermons.byTitle': 'By Title',
        'common.all': 'All',
      }
      return dict[key] ?? key
    },
    language: 'en',
  }),
}))

describe('SermonFilters', () => {
  const speakers = [
    { id: 's1', name: 'Pastor John' },
    { id: 's2', name: 'Pastor Jane' },
  ]
  const seriesList = [
    { id: 'ser1', title_en: 'Foundations' },
    { id: 'ser2', title_en: 'Wisdom' },
  ]
  const topics = [
    { id: 't1', name_en: 'Prayer' },
    { id: 't2', name_en: 'Faith' },
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders filter dropdown triggers', () => {
    render(
      <SermonFilters
        speakers={speakers}
        seriesList={seriesList}
        topics={topics}
      />
    )
    const comboboxes = screen.getAllByRole('combobox')
    expect(comboboxes).toHaveLength(4)
  })

  it('renders sort dropdown with default newest', () => {
    render(
      <SermonFilters
        speakers={speakers}
        seriesList={seriesList}
        topics={topics}
      />
    )
    expect(screen.getByText('Newest')).toBeInTheDocument()
  })

  it('renders with pre-selected sort value', () => {
    render(
      <SermonFilters
        speakers={speakers}
        seriesList={seriesList}
        topics={topics}
        currentSpeaker="s1"
        currentSeries="ser1"
        currentTopic="t1"
        currentSort="oldest"
      />
    )
    expect(screen.getByText('Oldest')).toBeInTheDocument()
    expect(screen.getByText('Pastor John')).toBeInTheDocument()
  })
})
