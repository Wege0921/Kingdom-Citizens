import { describe, it, expect } from 'vitest'
import {
  isAmharicChar,
  containsAmharic,
  countAmharicChars,
  detectScriptLanguage,
  isPrimarilyAmharic,
} from './amharic'

describe('isAmharicChar', () => {
  it('returns true for Amharic characters', () => {
    expect(isAmharicChar('አ')).toBe(true)
    expect(isAmharicChar('ማ')).toBe(true)
    expect(isAmharicChar('ር')).toBe(true)
    expect(isAmharicChar('ኛ')).toBe(true)
  })

  it('returns false for Latin characters', () => {
    expect(isAmharicChar('a')).toBe(false)
    expect(isAmharicChar('Z')).toBe(false)
    expect(isAmharicChar('1')).toBe(false)
  })

  it('returns false for spaces and punctuation', () => {
    expect(isAmharicChar(' ')).toBe(false)
    expect(isAmharicChar('!')).toBe(false)
    expect(isAmharicChar('?')).toBe(false)
  })
})

describe('containsAmharic', () => {
  it('returns true for Amharic text', () => {
    expect(containsAmharic('ሰላም')).toBe(true)
    expect(containsAmharic('እንዴት ነህ')).toBe(true)
  })

  it('returns true for mixed text', () => {
    expect(containsAmharic('Hello ሰላም')).toBe(true)
  })

  it('returns false for pure English', () => {
    expect(containsAmharic('Hello world')).toBe(false)
    expect(containsAmharic('12345')).toBe(false)
  })

  it('returns false for empty string', () => {
    expect(containsAmharic('')).toBe(false)
  })
})

describe('countAmharicChars', () => {
  it('counts Amharic characters correctly', () => {
    expect(countAmharicChars('ሰላም')).toBe(3)
    expect(countAmharicChars('እንዴት ነህ')).toBe(6) // 6 chars excluding space
  })

  it('returns 0 for English text', () => {
    expect(countAmharicChars('hello')).toBe(0)
  })

  it('counts only Amharic in mixed text', () => {
    expect(countAmharicChars('Hi ሰላም')).toBe(3)
  })
})

describe('detectScriptLanguage', () => {
  it('returns "am" for Amharic text', () => {
    expect(detectScriptLanguage('ሰላም')).toBe('am')
    expect(detectScriptLanguage('እንዴት ነህ')).toBe('am')
  })

  it('returns "en" for English text', () => {
    expect(detectScriptLanguage('hello')).toBe('en')
    expect(detectScriptLanguage('English text here')).toBe('en')
  })

  it('returns "en" for empty string', () => {
    expect(detectScriptLanguage('')).toBe('en')
  })

  it('detects majority script in mixed text', () => {
    expect(detectScriptLanguage('hi ሰላም ሰላም')).toBe('am')
    expect(detectScriptLanguage('hello world ሰ')).toBe('en')
  })
})

describe('isPrimarilyAmharic', () => {
  it('returns true for Amharic-dominant text', () => {
    expect(isPrimarilyAmharic('ሰላም እንዴት ነህ')).toBe(true)
  })

  it('returns false for English-dominant text', () => {
    expect(isPrimarilyAmharic('hello world')).toBe(false)
  })
})
