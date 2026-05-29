import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ShareButtons } from './share-buttons'

Object.defineProperty(navigator, 'share', {
  value: undefined,
  writable: true,
  configurable: true,
})

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: vi.fn() }),
}))

describe('ShareButtons', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText: vi.fn(() => Promise.resolve()) },
      writable: true,
      configurable: true,
    })
  })

  it('renders WhatsApp and Telegram buttons', () => {
    render(<ShareButtons url="https://example.com" title="Test" />)
    expect(screen.getByLabelText('Share on WhatsApp')).toBeInTheDocument()
    expect(screen.getByLabelText('Share on Telegram')).toBeInTheDocument()
  })

  it('renders copy link option in dropdown', async () => {
    const user = userEvent.setup()
    render(<ShareButtons url="https://example.com" title="Test" />)
    await user.click(screen.getByText('More'))
    expect(within(document.body).getByText('Copy link')).toBeInTheDocument()
  })

  it('shows print option by default', async () => {
    const user = userEvent.setup()
    render(<ShareButtons url="https://example.com" title="Test" />)
    await user.click(screen.getByText('More'))
    expect(within(document.body).getByText('Print')).toBeInTheDocument()
  })

  it('hides print option when showPrint is false', async () => {
    const user = userEvent.setup()
    render(<ShareButtons url="https://example.com" title="Test" showPrint={false} />)
    await user.click(screen.getByText('More'))
    expect(within(document.body).queryByText('Print')).not.toBeInTheDocument()
  })

  it('shows native share when navigator.share is available', async () => {
    Object.defineProperty(navigator, 'share', {
      value: vi.fn(),
      writable: true,
      configurable: true,
    })
    const user = userEvent.setup()
    render(<ShareButtons url="https://example.com" title="Test" />)
    await user.click(screen.getByText('More'))
    expect(within(document.body).getByText('Share...')).toBeInTheDocument()
  })
})
