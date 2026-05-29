'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useCurrentUser } from '@/hooks/use-current-user'
import { T } from '@/components/ui/localized-text'

/**
 * Client-side per-user progress bar for a learning path.
 *
 * Rendered inside the statically generated /learn page so that the page can be
 * ISR-cached while still showing personalized progress after hydration.
 */
export function PathProgress({ pathId }: { pathId: string }) {
  const { user, loading } = useCurrentUser()
  const [progress, setProgress] = useState<{ completed: number; total: number } | null>(null)

  useEffect(() => {
    if (loading) return
    if (!user) {
      setProgress(null)
      return
    }

    let active = true
    const supabase = createClient()

    async function load() {
      const { data: modules } = await supabase
        .from('learning_modules')
        .select('id')
        .eq('learning_path_id', pathId)

      const moduleIds = modules?.map((m: { id: string }) => m.id) ?? []
      if (moduleIds.length === 0) {
        if (active) setProgress({ completed: 0, total: 0 })
        return
      }

      const { count } = await supabase
        .from('user_module_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user!.id)
        .eq('status', 'completed')
        .in('module_id', moduleIds)

      if (active) setProgress({ completed: count ?? 0, total: moduleIds.length })
    }

    load()
    return () => {
      active = false
    }
  }, [pathId, user, loading])

  if (!user || !progress || progress.total === 0) return null

  const pct = Math.round((progress.completed / progress.total) * 100)

  return (
    <div className="space-y-1">
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-xs text-muted-foreground">
        {progress.completed} / {progress.total} <T k="learn.modulesComplete" />
      </p>
    </div>
  )
}
