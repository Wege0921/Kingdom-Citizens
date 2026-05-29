import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { SermonComments } from './comments'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            order: () => Promise.resolve({ data: [], error: null }),
          }),
        }),
      }),
    }),
    auth: { getUser: vi.fn(() => Promise.resolve({ data: { user: null } })) },
  }),
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

describe('SermonComments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders comments section', () => {
    render(<SermonComments sermonId="sermon-1" currentUser={null} />)
    expect(screen.getByText('sermons.comments')).toBeInTheDocument()
  })

  it('shows no comments message when empty', async () => {
    render(<SermonComments sermonId="sermon-1" currentUser={null} />)
    await waitFor(() => {
      expect(screen.queryByText('sermons.loadingComments')).not.toBeInTheDocument()
    })
    expect(screen.getByText('sermons.noComments')).toBeInTheDocument()
  })
})
