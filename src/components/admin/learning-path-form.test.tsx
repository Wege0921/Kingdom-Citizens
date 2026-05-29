import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LearningPathForm } from './learning-path-form'

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

describe('LearningPathForm', () => {
  it('renders empty form', () => {
    render(<LearningPathForm />)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders form with path data', () => {
    const path = {
      id: 'p1',
      title_en: 'Foundations',
      title_am: 'መሰረቶች',
      description_en: 'Basic teachings',
      description_am: '',
      cover_image: '',
      difficulty_level: 'beginner' as const,
      estimated_duration_minutes: 60,
      is_published: true,
      sort_order: 1,
      created_by: null,
      created_at: '',
      updated_at: '',
    }
    render(<LearningPathForm path={path} />)
    expect(screen.getByDisplayValue('Foundations')).toBeInTheDocument()
  })
})
