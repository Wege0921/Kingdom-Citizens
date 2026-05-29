import { describe, it, expect, beforeEach } from 'vitest'
import { useAppStore, useLocalizedContent } from './store'
import { act, renderHook } from '@testing-library/react'

describe('useAppStore', () => {
  beforeEach(() => {
    // Reset store state before each test
    act(() => {
      useAppStore.setState({
        user: null,
        language: 'en',
        sidebarOpen: true,
        adminTab: 'sermons',
      })
    })
  })

  it('has default language as English', () => {
    const { result } = renderHook(() => useAppStore())
    expect(result.current.language).toBe('en')
  })

  it('can change language', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setLanguage('am')
    })
    expect(result.current.language).toBe('am')
  })

  it('persists language preference', () => {
    const { result } = renderHook(() => useAppStore())
    act(() => {
      result.current.setLanguage('am')
    })
    // Re-render to confirm persistence
    const { result: result2 } = renderHook(() => useAppStore())
    expect(result2.current.language).toBe('am')
  })

  it('toggles sidebar state', () => {
    const { result } = renderHook(() => useAppStore())
    expect(result.current.sidebarOpen).toBe(true)
    act(() => {
      result.current.toggleSidebar()
    })
    expect(result.current.sidebarOpen).toBe(false)
  })
})

describe('useLocalizedContent', () => {
  beforeEach(() => {
    act(() => {
      useAppStore.setState({ language: 'en' })
    })
  })

  it('returns English field when language is en', () => {
    const item = { title_en: 'English Title', title_am: 'የአማርኛ ርእስ' }
    const { result } = renderHook(() => useLocalizedContent(item, 'title'))
    expect(result.current).toBe('English Title')
  })

  it('returns Amharic field when language is am', () => {
    act(() => {
      useAppStore.setState({ language: 'am' })
    })
    const item = { title_en: 'English Title', title_am: 'የአማርኛ ርእስ' }
    const { result } = renderHook(() => useLocalizedContent(item, 'title'))
    expect(result.current).toBe('የአማርኛ ርእስ')
  })

  it('falls back to English if localized field is missing', () => {
    act(() => {
      useAppStore.setState({ language: 'am' })
    })
    const item = { title_en: 'English Title' }
    const { result } = renderHook(() => useLocalizedContent(item, 'title'))
    expect(result.current).toBe('English Title')
  })

  it('returns empty string for null item', () => {
    const { result } = renderHook(() => useLocalizedContent(null, 'title'))
    expect(result.current).toBe('')
  })
})
