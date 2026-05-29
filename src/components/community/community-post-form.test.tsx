import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CommunityPostForm } from './community-post-form'

const mockInsert = vi.fn()
const mockGetUser = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockGetUser },
    from: () => ({
      insert: mockInsert,
    }),
  }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

describe('CommunityPostForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUser.mockResolvedValue({ data: { user: { id: 'user-1' } } })
    // insert(...).select().single() => resolved result
    mockInsert.mockReturnValue({
      select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
    })
  })

  it('renders the post form', () => {
    render(<CommunityPostForm />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('has a submit button', () => {
    render(<CommunityPostForm />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('disables submit when content is empty', () => {
    render(<CommunityPostForm />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('enables submit when content is entered', () => {
    render(<CommunityPostForm />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello community!' } })
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('submits a post successfully', async () => {
    render(<CommunityPostForm />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Test post' } })

    const button = screen.getByRole('button')
    fireEvent.click(button)

    await waitFor(() => {
      expect(mockInsert).toHaveBeenCalled()
    })
  })

  it('shows character count', () => {
    render(<CommunityPostForm />)
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Hello' } })
    expect(screen.getByText('5/500')).toBeInTheDocument()
  })
})
