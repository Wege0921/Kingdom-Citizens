'use client'

import { useEffect, useRef } from 'react'

export function ViewCounter({ sermonId }: { sermonId: string }) {
  const hasTracked = useRef(false)

  useEffect(() => {
    if (hasTracked.current) return
    hasTracked.current = true

    // Fire-and-forget view count increment
    fetch(`/api/sermons/${sermonId}/view`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).catch((err) => {
      console.error('View count tracking failed:', err)
    })
  }, [sermonId])

  return null
}
