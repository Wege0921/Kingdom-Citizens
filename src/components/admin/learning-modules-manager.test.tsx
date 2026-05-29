import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LearningModulesManager } from './learning-modules-manager'

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
    from: () => ({ upsert: vi.fn(), delete: () => ({ eq: vi.fn() }) }),
  }),
}))

describe('LearningModulesManager', () => {
  const modules = [
    {
      id: 'm1',
      learning_path_id: 'p1',
      title_en: 'Module 1',
      title_am: '',
      content_en: 'Intro',
      content_am: '',
      video_url: '',
      sort_order: 1,
      estimated_duration_minutes: 30,
      created_at: '',
      updated_at: '',
    },
  ]

  it('renders module titles', () => {
    render(<LearningModulesManager pathId="p1" modules={modules} />)
    expect(screen.getByText('Module 1')).toBeInTheDocument()
  })

  it('has add module button', () => {
    render(<LearningModulesManager pathId="p1" modules={modules} />)
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument()
  })
})
