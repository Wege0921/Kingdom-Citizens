'use client'

import { useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { saveLocalProgress } from '@/lib/local-progress'
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useCurrentUser } from '@/hooks/use-current-user'

interface ReadingProgressTrackerProps {
  sermonId: string
  /** Optional. When omitted, the user is resolved on the client. */
  userId?: string | null
}

export function ReadingProgressTracker({ sermonId, userId: userIdProp }: ReadingProgressTrackerProps) {
  const trackedRef = useRef(false)
  const progressRef = useRef<Set<number>>(new Set())
  const { isOnline } = useNetworkStatus()
  const { user } = useCurrentUser()
  const userId = userIdProp !== undefined ? userIdProp : user?.id ?? null

  useEffect(() => {
    if (!userId) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      // Track progress at 25%, 50%, 75%, 80%, 90%, 100%
      const milestones = [25, 50, 75, 80, 90, 100]
      milestones.forEach((milestone) => {
        if (scrollPercent >= milestone && !progressRef.current.has(milestone)) {
          progressRef.current.add(milestone)
          updateProgress(milestone)
        }
      })
    }

    const updateProgress = async (percent: number) => {
      const status = percent >= 80 ? 'completed' : 'in_progress'
      const now = new Date().toISOString()

      // Always save locally first for offline resilience
      await saveLocalProgress({
        sermonId,
        userId,
        progressPercent: percent,
        status,
        lastReadAt: now,
      })

      if (!isOnline) return

      const supabase = createClient()
      try {
        const { data: existing } = await supabase
          .from('reading_progress')
          .select('id')
          .eq('user_id', userId)
          .eq('sermon_id', sermonId)
          .maybeSingle()

        if (existing) {
          await supabase
            .from('reading_progress')
            .update({
              progress_percent: percent,
              status,
              last_read_at: now,
            })
            .eq('id', existing.id)
        } else {
          await supabase.from('reading_progress').insert({
            user_id: userId,
            sermon_id: sermonId,
            progress_percent: percent,
            status,
            last_read_at: now,
          })
        }
      } catch (error) {
        console.error('Failed to update reading progress:', error)
        // Local copy already saved, will sync later
      }
    }

    // Throttle scroll events
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })

    // Initial check in case user is already scrolled
    handleScroll()

    return () => {
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [sermonId, userId])

  return null
}
