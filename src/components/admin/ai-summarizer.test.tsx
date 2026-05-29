import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AISummarizer } from './ai-summarizer'

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

describe('AISummarizer', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders generate button', () => {
    render(<AISummarizer sermonId="s1" onSummaryGenerated={vi.fn()} />)
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('calls fetch on generate', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ summary: 'Generated summary' }),
    })
    const onSummaryGenerated = vi.fn()
    render(<AISummarizer sermonId="s1" onSummaryGenerated={onSummaryGenerated} />)
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })
  })
})
