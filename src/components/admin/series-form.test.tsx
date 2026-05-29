import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SeriesForm } from './series-form'

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

describe('SeriesForm', () => {
  it('renders empty form', () => {
    render(<SeriesForm />)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders form with series data', () => {
    const series = {
      id: 'ser1',
      title_en: 'Foundations',
      title_am: 'መሰረቶች',
      description_en: 'Basic teachings',
      description_am: '',
      cover_image: '',
      is_active: true,
      created_at: '',
      updated_at: '',
    }
    render(<SeriesForm series={series} />)
    expect(screen.getByDisplayValue('Foundations')).toBeInTheDocument()
  })
})
