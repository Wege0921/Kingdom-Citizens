import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BookmarkToggle } from './bookmark-toggle'

const mockMutate = vi.fn()
const mockToast = vi.fn()

vi.mock('@/lib/trpc/client', () => ({
  trpc: {
    useUtils: () => ({
      bookmark: {
        isBookmarked: {
          invalidate: vi.fn(),
        },
      },
    }),
    bookmark: {
      toggle: {
        useMutation: () => ({
          mutate: mockMutate,
          isPending: false,
        }),
      },
      isBookmarked: {
        useQuery: () => ({
          data: { isBookmarked: false },
        }),
      },
    },
  },
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

describe('BookmarkToggle', () => {
  it('renders bookmark button', () => {
    render(<BookmarkToggle sermonId="sermon-1" initialBookmarked={false} isLoggedIn={true} />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('calls mutate when clicked', () => {
    render(<BookmarkToggle sermonId="sermon-1" initialBookmarked={false} isLoggedIn={true} />)
    const button = screen.getByRole('button')
    fireEvent.click(button)
    expect(mockMutate).toHaveBeenCalled()
  })
})
