'use client'

import { useState, useCallback, useEffect } from 'react'
import { containsAmharic, detectScriptLanguage } from '@/lib/utils/amharic'
import { useAppStore } from '@/lib/store'

interface UseAmharicDetectionOptions {
  /** Auto-switch app language when Amharic is detected */
  autoSwitchLanguage?: boolean
  /** Minimum characters before triggering detection */
  minLength?: number
  /** Delay in ms before checking (debounce) */
  debounceMs?: number
}

interface UseAmharicDetectionReturn {
  /** Whether Amharic characters were detected in the current text */
  isAmharic: boolean
  /** The detected language ('en' | 'am') */
  detectedLang: 'en' | 'am'
  /** Handler to attach to onChange/onInput events */
  handleInputChange: (value: string) => void
  /** Manually check a string */
  checkText: (text: string) => { isAmharic: boolean; detectedLang: 'en' | 'am' }
}

/**
 * Hook to detect Amharic typing in input fields.
 * Can optionally auto-switch the app's language when Amharic is detected.
 *
 * @example
 * const { isAmharic, handleInputChange } = useAmharicDetection({ autoSwitchLanguage: true })
 * <textarea onChange={(e) => handleInputChange(e.target.value)} />
 */
export function useAmharicDetection(
  options: UseAmharicDetectionOptions = {}
): UseAmharicDetectionReturn {
  const { autoSwitchLanguage = false, minLength = 2, debounceMs = 300 } = options
  const [isAmharic, setIsAmharic] = useState(false)
  const [detectedLang, setDetectedLang] = useState<'en' | 'am'>('en')
  const setLanguage = useAppStore((s) => s.setLanguage)
  const currentLanguage = useAppStore((s) => s.language)

  const checkText = useCallback(
    (text: string): { isAmharic: boolean; detectedLang: 'en' | 'am' } => {
      if (text.length < minLength) {
        return { isAmharic: false, detectedLang: 'en' }
      }
      const hasAmharic = containsAmharic(text)
      const lang = detectScriptLanguage(text)
      return { isAmharic: hasAmharic, detectedLang: lang }
    },
    [minLength]
  )

  const handleInputChange = useCallback(
    (value: string) => {
      const result = checkText(value)
      setIsAmharic(result.isAmharic)
      setDetectedLang(result.detectedLang)

      if (
        autoSwitchLanguage &&
        result.detectedLang === 'am' &&
        currentLanguage !== 'am' &&
        value.length >= minLength
      ) {
        setLanguage('am')
      }
    },
    [checkText, autoSwitchLanguage, setLanguage, currentLanguage, minLength]
  )

  return { isAmharic, detectedLang, handleInputChange, checkText }
}
