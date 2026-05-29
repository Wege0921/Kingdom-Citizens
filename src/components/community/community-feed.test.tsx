import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CommunityFeed } from './community-feed'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}))

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({ delete: () => ({ eq: vi.fn() }) }),
  }),
}))

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

describe('CommunityFeed', () => {
  const posts = [
    {
      id: 'p1',
      content: 'Hello community!',
      created_at: '2024-06-01T10:00:00Z',
      user_id: 'u1',
      profiles: { id: 'u1', full_name: 'John Doe', avatar_url: null },
    },
    {
      id: 'p2',
      content: 'Great sermon today',
      created_at: '2024-06-02T12:00:00Z',
      user_id: 'u2',
      profiles: { id: 'u2', full_name: 'Jane Smith', avatar_url: null },
    },
  ]

  it('renders empty state', () => {
    render(<CommunityFeed posts={[]} currentUserId={null} />)
    expect(screen.getByText('community.noPosts')).toBeInTheDocument()
  })

  it('renders posts with content', () => {
    render(<CommunityFeed posts={posts} currentUserId={null} />)
    expect(screen.getByText('Hello community!')).toBeInTheDocument()
    expect(screen.getByText('Great sermon today')).toBeInTheDocument()
  })

  it('renders author names', () => {
    render(<CommunityFeed posts={posts} currentUserId={null} />)
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('Jane Smith')).toBeInTheDocument()
  })

  it('shows delete button for own posts', () => {
    render(<CommunityFeed posts={posts} currentUserId="u1" />)
    const deleteButtons = screen.getAllByRole('button')
    expect(deleteButtons.length).toBeGreaterThanOrEqual(1)
  })
})
