import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AIQuiz } from './ai-quiz'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('AIQuiz', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders generate button', () => {
    render(<AIQuiz title="Faith" summary="About faith" onQuizGenerated={vi.fn()} />)
    expect(screen.getByRole('button', { name: /admin.generateQuiz/i })).toBeInTheDocument()
  })
})
