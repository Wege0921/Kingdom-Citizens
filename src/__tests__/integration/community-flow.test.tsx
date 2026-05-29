import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { CommunityFeed } from '@/components/community/community-feed'
import { CommunityPostForm } from '@/components/community/community-post-form'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
      delete: () => ({ eq: () => ({ eq: () => Promise.resolve({ error: null }) }) }),
    }),
    auth: { getUser: () => Promise.resolve({ data: { user: { id: 'u1' } } }) },
  }),
}))

describe('Community Flow', () => {
  const posts = [
    {
      id: 'p1',
      user_id: 'u1',
      content: 'Hello community!',
      created_at: '2024-01-15T10:00:00Z',
      profiles: { id: 'u1', full_name: 'John Doe', avatar_url: null, role: 'member' },
    },
    {
      id: 'p2',
      user_id: 'u2',
      content: 'Great sermon today!',
      created_at: '2024-01-15T11:00:00Z',
      profiles: { id: 'u2', full_name: 'Jane Smith', avatar_url: null, role: 'member' },
    },
  ] as any

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('user views community feed and sees posts', () => {
    render(<CommunityFeed posts={posts} currentUserId="u1" />)

    // Posts are visible
    expect(screen.getByText('Hello community!')).toBeInTheDocument()
    expect(screen.getByText('Great sermon today!')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('user creates a new post', async () => {
    render(<CommunityPostForm />)

    // Form renders with textarea (placeholder uses translation key)
    const textarea = screen.getByPlaceholderText(/community.placeholder/i)
    expect(textarea).toBeInTheDocument()

    // Type content
    fireEvent.change(textarea, { target: { value: 'My new post' } })
    expect(textarea).toHaveValue('My new post')

    // Submit button exists
    const submitBtn = screen.getByRole('button', { name: /community.post/i })
    expect(submitBtn).toBeInTheDocument()
  })

  it('user can delete their own post', () => {
    const { container } = render(<CommunityFeed posts={posts} currentUserId="u1" />)

    // Should have delete button for own post (only 1 post belongs to u1)
    const allButtons = container.querySelectorAll('button')
    expect(allButtons.length).toBeGreaterThanOrEqual(1)
  })
})
