import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AIAutoTag } from './ai-autotag'

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

describe('AIAutoTag', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders generate button', () => {
    render(<AIAutoTag title="Faith" summary="About faith" onTopicsGenerated={vi.fn()} />)
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('shows suggested topics after fetch', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ topics: ['t1', 't2'] }),
    })
    render(<AIAutoTag title="Faith" summary="About faith" onTopicsGenerated={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /generate/i }))
    await waitFor(() => {
      expect(screen.getByText('t1')).toBeInTheDocument()
      expect(screen.getByText('t2')).toBeInTheDocument()
    })
  })
})
