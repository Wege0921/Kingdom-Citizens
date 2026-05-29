import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MarkCompleteButton } from './mark-complete-button'

const mockRefresh = vi.fn()
const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: mockRefresh, push: mockPush }),
}))

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

const mockAuthGetUser = vi.fn()
const mockUpsert = vi.fn()

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    auth: { getUser: mockAuthGetUser },
    from: () => ({ upsert: mockUpsert }),
  }),
}))

describe('MarkCompleteButton', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: 'u1' } } })
    // upsert(...).select().single() => resolved result
    mockUpsert.mockReturnValue({
      select: () => ({ single: () => Promise.resolve({ data: null, error: null }) }),
    })
  })

  it('renders mark as complete when not completed', () => {
    render(<MarkCompleteButton moduleId="m1" pathId="p1" nextModuleId={null} alreadyCompleted={false} />)
    expect(screen.getByText('Mark as complete')).toBeInTheDocument()
  })

  it('renders completed state when already completed', () => {
    render(<MarkCompleteButton moduleId="m1" pathId="p1" nextModuleId={null} alreadyCompleted={true} />)
    expect(screen.getByText('Completed')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('calls upsert on click', async () => {
    render(<MarkCompleteButton moduleId="m1" pathId="p1" nextModuleId="m2" alreadyCompleted={false} />)
    fireEvent.click(screen.getByText('Mark as complete'))
    await waitFor(() => {
      expect(mockUpsert).toHaveBeenCalled()
    })
  })
})
