import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import { ReadingProgressTracker } from './reading-progress-tracker'

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      select: () => ({
        eq: () => ({
          eq: () => ({
            maybeSingle: () => Promise.resolve({ data: null }),
          }),
        }),
      }),
      insert: vi.fn(() => Promise.resolve({ error: null })),
    }),
  }),
}))

describe('ReadingProgressTracker', () => {
  it('renders nothing', () => {
    const { container } = render(<ReadingProgressTracker sermonId="s1" userId="u1" />)
    expect(container.firstChild).toBeNull()
  })

  it('does not track when no user', () => {
    const { container } = render(<ReadingProgressTracker sermonId="s1" userId={null} />)
    expect(container.firstChild).toBeNull()
  })
})
