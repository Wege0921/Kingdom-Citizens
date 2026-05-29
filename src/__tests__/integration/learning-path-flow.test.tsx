import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MarkCompleteButton } from '@/components/learning/mark-complete-button'
import { CertificateClient } from '@/components/learning/certificate-client'
import { ModuleQuiz } from '@/components/learning/module-quiz'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      upsert: vi.fn(() => Promise.resolve({ error: null })),
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: { status: 'not_started' } }),
          }),
        }),
      }),
    }),
  }),
}))

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    learning: {
      updateProgress: {
        useMutation: () => ({
          mutate: vi.fn(),
          isPending: false,
        }),
      },
    },
    useUtils: () => ({
      invalidate: vi.fn(),
    }),
  },
}))

vi.mock('canvas-confetti', () => ({
  default: vi.fn(),
}))

describe('Learning Path Flow', () => {
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
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('user completes a module and takes a quiz', async () => {
    render(
      <div>
        <MarkCompleteButton moduleId="m1" pathId="p1" nextModuleId={null} alreadyCompleted={false} />
        <ModuleQuiz moduleId="m1" pathId="p1" quizzes={quizzes} nextModuleId={null} />
      </div>
    )

    // Mark complete button renders (text is "Mark as complete")
    expect(screen.getByText('Mark as complete')).toBeInTheDocument()

    // Quiz renders
    expect(screen.getByText('What is faith?')).toBeInTheDocument()

    // Select answer
    fireEvent.click(screen.getByText('Trust'))
    expect(screen.getByRole('button', { name: /submit quiz/i })).toBeInTheDocument()
  })

  it('user earns a certificate after completing all modules', () => {
    render(
      <CertificateClient
        pathTitle="Foundations"
        userName="John Doe"
        completionDate="2024-01-15"
        isComplete={true}
      />
    )

    // Certificate view button renders
    expect(screen.getByRole('button', { name: /view certificate/i })).toBeInTheDocument()

    // Open certificate modal
    fireEvent.click(screen.getByRole('button', { name: /view certificate/i }))
    // Use getAllByText since text may appear multiple times in modal
    expect(screen.getAllByText(/certificate of completion/i).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Foundations').length).toBeGreaterThanOrEqual(1)
  })
})
