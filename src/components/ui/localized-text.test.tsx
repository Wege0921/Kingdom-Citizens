import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { T } from './localized-text'
import type { TranslationKey } from '@/lib/i18n'

// Mock the store to control language
let mockLanguage = 'en'
vi.mock('@/lib/store', () => ({
  useAppStore: (selector?: (state: any) => any) => {
    const state = { language: mockLanguage }
    if (selector) return selector(state)
    return state
  },
}))

// Mock translations
vi.mock('@/lib/i18n', async () => {
  const actual = await vi.importActual<typeof import('@/lib/i18n')>('@/lib/i18n')
  return {
    ...actual,
    useTranslation: () => ({
      t: (key: string, vars?: Record<string, string>) => {
        const dict: Record<string, Record<string, string>> = {
          en: {
            'nav.sermons': 'Sermons',
            'nav.learn': 'Learn',
            'home.heroTitle': 'Welcome to Kingdom Citizens',
          },
          am: {
            'nav.sermons': 'ስብከቶች',
            'nav.learn': 'ተማር',
            'home.heroTitle': 'የመንግስት ዜጎች ይኑሩ',
          },
        }
        let text = dict[mockLanguage]?.[key] ?? dict['en']?.[key] ?? key
        if (vars) {
          for (const [k, v] of Object.entries(vars)) {
            text = text.replace(new RegExp(`{${k}}`, 'g'), v)
          }
        }
        return text
      },
      language: mockLanguage,
    }),
  }
})

describe('T component', () => {
  it('renders English text by default', () => {
    mockLanguage = 'en'
    render(<T k="nav.sermons" />)
    expect(screen.getByText('Sermons')).toBeInTheDocument()
  })

  it('renders Amharic text when language is am', () => {
    mockLanguage = 'am'
    render(<T k="nav.sermons" />)
    expect(screen.getByText('ስብከቶች')).toBeInTheDocument()
  })

  it('falls back to key if translation missing', () => {
    mockLanguage = 'en'
    render(<T k={'unknown.key.here' as TranslationKey} />)
    expect(screen.getByText('unknown.key.here')).toBeInTheDocument()
  })
})
