import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAmharicDetection } from './use-amharic-detection'

// Mock the store
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

describe('useAmharicDetection', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    mockLanguage = 'en'
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns isAmharic false initially', () => {
    const { result } = renderHook(() => useAmharicDetection())
    expect(result.current.isAmharic).toBe(false)
    expect(result.current.detectedLang).toBe('en')
  })

  it('detects Amharic text', () => {
    const { result } = renderHook(() => useAmharicDetection())
    act(() => {
      result.current.handleInputChange('ሰላም')
    })
    // After debounce, it should detect
    act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(result.current.detectedLang).toBe('am')
    expect(result.current.isAmharic).toBe(true)
  })

  it('returns English for Latin text', () => {
    const { result } = renderHook(() => useAmharicDetection())
    act(() => {
      result.current.handleInputChange('hello world')
    })
    expect(result.current.detectedLang).toBe('en')
    expect(result.current.isAmharic).toBe(false)
  })

  it('checkText returns correct detection', () => {
    const { result } = renderHook(() => useAmharicDetection())
    const amResult = result.current.checkText('ሰላም')
    expect(amResult.isAmharic).toBe(true)
    expect(amResult.detectedLang).toBe('am')

    const enResult = result.current.checkText('hello')
    expect(enResult.isAmharic).toBe(false)
    expect(enResult.detectedLang).toBe('en')
  })

  it('respects minLength threshold', () => {
    const { result } = renderHook(() => useAmharicDetection({ minLength: 5 }))
    act(() => {
      result.current.handleInputChange('ሰላ')
    })
    expect(result.current.isAmharic).toBe(false)
  })

  it('auto-switches language when enabled', () => {
    const { result } = renderHook(() =>
      useAmharicDetection({ autoSwitchLanguage: true })
    )
    act(() => {
      result.current.handleInputChange('ሰላም እንዴት ነህ')
    })
    // Should eventually call setLanguage with 'am'
    expect(mockSetLanguage).toHaveBeenCalledWith('am')
  })
})
