import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AmharicInput } from './amharic-input'

const mockSetLanguage = vi.fn()
let mockLanguage = 'en'

vi.mock('@/lib/store', () => ({
  useAppStore: (selector?: (state: any) => any) => {
    const state = {
      language: mockLanguage,
      setLanguage: mockSetLanguage,
    }
    if (selector) return selector(state)
    return state
  },
}))

describe('AmharicInput', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLanguage = 'en'
  })

  it('renders as input by default', () => {
    render(<AmharicInput placeholder="Type here" />)
    expect(screen.getByPlaceholderText('Type here')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Type here').tagName).toBe('INPUT')
  })

  it('renders as textarea when specified', () => {
    render(<AmharicInput as="textarea" placeholder="Type here" />)
    expect(screen.getByPlaceholderText('Type here').tagName).toBe('TEXTAREA')
  })

  it('shows Amharic badge when typing Amharic', async () => {
    render(<AmharicInput showBadge detectDelay={100} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'ሰላም' } })

    await waitFor(() => {
      expect(screen.getByText('አማርኛ')).toBeInTheDocument()
    })
  })

  it('does not show badge for English text', async () => {
    render(<AmharicInput showBadge detectDelay={100} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'hello world' } })

    await waitFor(() => {
      expect(screen.queryByText('አማርኛ')).not.toBeInTheDocument()
    })
  })

  it('calls onChange with the value', () => {
    const handleChange = vi.fn()
    render(<AmharicInput onChange={handleChange} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'test' } })
    expect(handleChange).toHaveBeenCalledWith('test')
  })

  it('auto-switches language when enabled', async () => {
    render(<AmharicInput autoSwitchLanguage showBadge detectDelay={100} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'ሰላም እንዴት ነህ' } })

    await waitFor(() => {
      expect(mockSetLanguage).toHaveBeenCalledWith('am')
    })
  })

  it('does not auto-switch for English text', async () => {
    render(<AmharicInput autoSwitchLanguage detectDelay={100} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'hello world' } })

    await waitFor(() => {
      expect(mockSetLanguage).not.toHaveBeenCalled()
    })
  })

  it('hides badge when showBadge is false', async () => {
    render(<AmharicInput showBadge={false} detectDelay={100} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: 'ሰላም' } })

    await waitFor(() => {
      expect(screen.queryByText('አማርኛ')).not.toBeInTheDocument()
    })
  })
})
