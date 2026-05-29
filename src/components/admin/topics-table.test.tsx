import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TopicsTable } from './topics-table'

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
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

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: () => ({ delete: () => ({ eq: vi.fn() }) }),
  }),
}))

describe('TopicsTable', () => {
  const topics = [
    { id: 't1', name_en: 'Faith', name_am: 'እምነት', created_at: '', updated_at: '' },
    { id: 't2', name_en: 'Love', name_am: 'ፍቅር', created_at: '', updated_at: '' },
  ]

  it('renders topic names', () => {
    render(<TopicsTable topics={topics} />)
    expect(screen.getByText('Faith')).toBeInTheDocument()
    expect(screen.getByText('Love')).toBeInTheDocument()
  })

  it('has search input', () => {
    render(<TopicsTable topics={topics} />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })
})
