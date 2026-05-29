import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTranslation, tServer, registerTranslations } from './i18n'

let mockLanguage = 'en'

vi.mock('@/lib/store', () => ({
  useAppStore: (selector?: (state: any) => any) => {
    const state = { language: mockLanguage }
    if (selector) return selector(state)
    return state
  },
}))

describe('useTranslation', () => {
  beforeEach(() => {
    mockLanguage = 'en'
    // Register minimal test translations
    registerTranslations('en', {
      'nav.sermons': 'Sermons',
      'home.heroTitle': 'Welcome',
    } as any)
    registerTranslations('am', {
      'nav.sermons': 'ስብከቶች',
      'home.heroTitle': 'እንኳን ደህና መጡ',
    } as any)
  })

  it('returns English translation', () => {
    const { result } = renderHook(() => useTranslation())
    expect(result.current.t('nav.sermons')).toBe('Sermons')
  })

  it('returns Amharic translation when language is am', () => {
    mockLanguage = 'am'
    const { result } = renderHook(() => useTranslation())
    expect(result.current.t('nav.sermons')).toBe('ስብከቶች')
  })

  it('falls back to English if Amharic translation missing', () => {
    mockLanguage = 'am'
    const { result } = renderHook(() => useTranslation())
    expect(result.current.t('home.heroTitle')).toBe('እንኳን ደህና መጡ')
  })

  it('interpolates variables', () => {
    const { result } = renderHook(() => useTranslation())
    registerTranslations('en', {
      'greeting': 'Hello, {name}!',
    } as any)
    expect(result.current.t('greeting' as any, { name: 'John' })).toBe('Hello, John!')
  })
})

describe('tServer', () => {
  it('returns server-side English translation', () => {
    expect(tServer('en', 'nav.sermons' as any)).toBe('Sermons')
  })
})
