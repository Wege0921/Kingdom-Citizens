import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ModuleQuiz } from './module-quiz'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({ upsert: vi.fn() }),
  }),
}))

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

describe('ModuleQuiz', () => {
  const quizzes = [
    {
      id: 'q1',
      module_id: 'm1',
      question_en: 'What is faith?',
      question_am: '',
      options_en: ['Trust', 'Fear', 'Doubt'],
      options_am: null,
      correct_index: 0,
      explanation_en: 'Faith is trust',
      explanation_am: null,
      sort_order: 1,
      created_at: '',
    },
    {
      id: 'q2',
      module_id: 'm1',
      question_en: 'Who wrote Hebrews?',
      question_am: '',
      options_en: ['Paul', 'Peter', 'John'],
      options_am: null,
      correct_index: 0,
      explanation_en: 'Traditionally Paul',
      explanation_am: null,
      sort_order: 2,
      created_at: '',
    },
  ]

  it('renders null when no quizzes', () => {
    const { container } = render(<ModuleQuiz moduleId="m1" pathId="p1" quizzes={[]} nextModuleId={null} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders first question', () => {
    render(<ModuleQuiz moduleId="m1" pathId="p1" quizzes={quizzes} nextModuleId={null} />)
    expect(screen.getByText('What is faith?')).toBeInTheDocument()
    expect(screen.getByText('Trust')).toBeInTheDocument()
  })

  it('allows selecting an answer', () => {
    render(<ModuleQuiz moduleId="m1" pathId="p1" quizzes={quizzes} nextModuleId={null} />)
    fireEvent.click(screen.getByText('Trust'))
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })
})
