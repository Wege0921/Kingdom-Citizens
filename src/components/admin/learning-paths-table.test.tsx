import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LearningPathsTable } from './learning-paths-table'

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

describe('LearningPathsTable', () => {
  const paths = [
    {
      id: 'p1',
      title_en: 'Foundations',
      title_am: '',
      description_en: '',
      description_am: '',
      cover_image: null,
      difficulty_level: 'beginner' as const,
      estimated_duration_minutes: 60,
      is_published: true,
      sort_order: 1,
      created_by: null,
      created_at: '',
      updated_at: '',
    },
  ]

  it('renders path title', () => {
    render(<LearningPathsTable paths={paths} />)
    expect(screen.getByText('Foundations')).toBeInTheDocument()
  })

  it('has search input', () => {
    render(<LearningPathsTable paths={paths} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
