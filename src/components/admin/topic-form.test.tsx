import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopicForm } from './topic-form'

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

describe('TopicForm', () => {
  it('renders empty form', () => {
    render(<TopicForm />)
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('renders form with topic data', () => {
    const topic = { id: 't1', name_en: 'Faith', name_am: 'እምነት', created_at: '', updated_at: '' }
    render(<TopicForm topic={topic} />)
    expect(screen.getByDisplayValue('Faith')).toBeInTheDocument()
    expect(screen.getByDisplayValue('እምነት')).toBeInTheDocument()
  })
})
