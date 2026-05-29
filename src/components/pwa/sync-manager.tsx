'use client'

import { useEffect } from 'react'
import { useNetworkStatus } from '@/hooks/use-network-status'
import { getQueuedActions, removeQueuedAction } from '@/lib/sync-queue'
import { getAllLocalProgress, clearLocalProgress } from '@/lib/local-progress'
import { useToast } from '@/hooks/use-toast'
import { createClient } from '@/lib/supabase/client'

export function SyncManager() {
  const { isOnline } = useNetworkStatus()
  const { toast } = useToast()

  useEffect(() => {
    if (!isOnline) return

    async function processQueue() {
      const actions = await getQueuedActions()
      if (actions.length === 0) return

      const supabase = createClient()
      let processed = 0
      let failed = 0

      for (const action of actions) {
        try {
          if (action.type === 'community_post') {
            const { error } = await supabase
              .from('community_posts')
              .insert(action.payload)
            if (error) throw error
          } else if (action.type === 'community_delete') {
            const { error } = await supabase
              .from('community_posts')
              .delete()
              .eq('id', action.payload.id)
            if (error) throw error
          }
          await removeQueuedAction(action.id)
          processed++
        } catch {
          failed++
        }
      }

      if (processed > 0) {
        toast({
          title: 'Synced',
          description: `${processed} offline action${processed > 1 ? 's' : ''} sent.`,
        })
      }
      if (failed > 0) {
        toast({
          title: 'Some syncs failed',
          description: `${failed} action${failed > 1 ? 's' : ''} will retry later.`,
          variant: 'destructive',
        })
      }
    }

    async function syncReadingProgress() {
      const localProgress = await getAllLocalProgress()
      if (localProgress.length === 0) return

      const supabase = createClient()
      let synced = 0

      for (const progress of localProgress) {
        try {
          const { data: existing } = await supabase
            .from('reading_progress')
            .select('id')
            .eq('user_id', progress.userId)
            .eq('sermon_id', progress.sermonId)
            .maybeSingle()

          if (existing) {
            await supabase
              .from('reading_progress')
              .update({
                progress_percent: progress.progressPercent,
                status: progress.status,
                last_read_at: progress.lastReadAt,
              })
              .eq('id', existing.id)
          } else {
            await supabase.from('reading_progress').insert({
              user_id: progress.userId,
              sermon_id: progress.sermonId,
              progress_percent: progress.progressPercent,
              status: progress.status,
              last_read_at: progress.lastReadAt,
            })
          }
          await clearLocalProgress(progress.sermonId)
          synced++
        } catch (error) {
          console.error('Failed to sync reading progress:', error)
        }
      }

      if (synced > 0) {
        toast({
          title: 'Progress synced',
          description: `${synced} reading session${synced > 1 ? 's' : ''} synced.`,
        })
      }
    }

    processQueue()
    syncReadingProgress()
  }, [isOnline, toast])

  return null
}
