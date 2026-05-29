// Amharic/Ethiopic script detection utilities

/** Unicode ranges for Ethiopic script (Amharic and related languages) */
const ETHIOPIC_RANGES = [
  [0x1200, 0x137F], // Ethiopic
  [0x1380, 0x139F], // Ethiopic Supplement
  [0x2D80, 0x2DDF], // Ethiopic Extended
  [0xAB00, 0xAB2F], // Ethiopic Extended-A
]

/**
 * Check if a single character is in the Ethiopic/Amharic Unicode range
 */
export function isAmharicChar(char: string): boolean {
  const code = char.codePointAt(0)
  if (!code) return false
  return ETHIOPIC_RANGES.some(([start, end]) => code >= start && code <= end)
}

/**
 * Detect if text contains Amharic/Ethiopic script characters
 */
export function containsAmharic(text: string): boolean {
  for (const char of text) {
    if (isAmharicChar(char)) return true
  }
  return false
}

/**
 * Count Amharic characters in text
 */
export function countAmharicChars(text: string): number {
  let count = 0
  for (const char of text) {
    if (isAmharicChar(char)) count++
  }
  return count
}

/**
 * Determine the dominant script in text
 * Returns 'am' if majority Amharic, 'en' otherwise
 */
export function detectScriptLanguage(text: string): 'en' | 'am' {
  if (!text.trim()) return 'en'
  const amharicCount = countAmharicChars(text)
  const latinCount = text.replace(/\s/g, '').length - amharicCount
  return amharicCount > latinCount ? 'am' : 'en'
}

/**
 * Check if text appears to be primarily Amharic
 * (more than 50% Amharic characters)
 */
export function isPrimarilyAmharic(text: string): boolean {
  return detectScriptLanguage(text) === 'am'
}
