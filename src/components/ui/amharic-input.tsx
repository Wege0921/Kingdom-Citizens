'use client'

import React, { useState, useCallback, forwardRef } from 'react'
import { cn } from '@/lib/utils'
import { containsAmharic } from '@/lib/utils/amharic'
import { useAppStore } from '@/lib/store'

export interface AmharicInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement> & React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  /** Input element type */
  as?: 'input' | 'textarea'
  /** Auto-switch app language when Amharic is detected */
  autoSwitchLanguage?: boolean
  /** Show a language badge indicating detected script */
  showBadge?: boolean
  /** Custom onChange handler (receives the raw event) */
  onChange?: (value: string) => void
  /** Debounce delay in ms before detecting */
  detectDelay?: number
}

/**
 * Smart input/textarea that detects Amharic typing and shows a visual indicator.
 * Can optionally auto-switch the app's language preference.
 *
 * @example
 * <AmharicInput
 *   as="textarea"
 *   autoSwitchLanguage
 *   showBadge
 *   placeholder="Type in English or Amharic..."
 *   className="min-h-[100px]"
 * />
 */
export const AmharicInput = forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  AmharicInputProps
>(
  (
    {
      as = 'input',
      autoSwitchLanguage = false,
      showBadge = true,
      onChange,
      detectDelay = 400,
      className,
      value,
      defaultValue,
      ...props
    },
    ref
  ) => {
    const [isAmharic, setIsAmharic] = useState(false)
    const [isTyping, setIsTyping] = useState(false)
    const setLanguage = useAppStore((s) => s.setLanguage)
    const currentLanguage = useAppStore((s) => s.language)
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

    const detectLanguage = useCallback(
      (text: string) => {
        if (text.length < 2) {
          setIsAmharic(false)
          return
        }
        const hasAmharic = containsAmharic(text)
        setIsAmharic(hasAmharic)

        if (autoSwitchLanguage && hasAmharic && currentLanguage !== 'am') {
          setLanguage('am')
        }
      },
      [autoSwitchLanguage, currentLanguage, setLanguage]
    )

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const text = e.target.value
        onChange?.(text)
        setIsTyping(true)

        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          detectLanguage(text)
          setIsTyping(false)
        }, detectDelay)
      },
      [onChange, detectLanguage, detectDelay]
    )

    const Component = as === 'textarea' ? 'textarea' : 'input'

    return (
      <div className="relative w-full">
        <Component
          ref={ref as React.Ref<HTMLInputElement & HTMLTextAreaElement>}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          dir={isAmharic ? 'ltr' : undefined}
          lang={currentLanguage}
          className={cn(
            'w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            'disabled:cursor-not-allowed disabled:opacity-50',
            isAmharic && 'border-amber-500/50 bg-amber-50/30',
            className
          )}
          {...props}
        />
        {showBadge && !isTyping && isAmharic && (
          <span className="absolute right-2 top-2 text-[10px] font-medium text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded-full animate-in fade-in">
            አማርኛ
          </span>
        )}
      </div>
    )
  }
)

AmharicInput.displayName = 'AmharicInput'
