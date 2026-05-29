import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeriesTable } from './series-table'

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

describe('SeriesTable', () => {
  const seriesList = [
    {
      id: 'ser1',
      title_en: 'Foundations',
      title_am: '',
      description_en: 'Basic teachings',
      description_am: '',
      cover_image: null,
      is_active: true,
      created_at: '',
      updated_at: '',
    },
  ]

  it('renders series title', () => {
    render(<SeriesTable series={seriesList} />)
    expect(screen.getByText('Foundations')).toBeInTheDocument()
  })

  it('has search input', () => {
    render(<SeriesTable series={seriesList} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
