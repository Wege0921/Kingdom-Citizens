'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

interface CurrentUserState {
  user: User | null
  profile: Profile | null
  loading: boolean
}

/**
 * Client-side hook that resolves the current authenticated user and profile
 * from the browser Supabase session.
 *
 * This lets components fetch auth state on the client so the pages that render
 * them can stay statically generated / ISR-cached (no server-side cookie read).
 */
export function useCurrentUser(): CurrentUserState {
  const [state, setState] = useState<CurrentUserState>({
    user: null,
    profile: null,
    loading: true,
  })

  useEffect(() => {
    const supabase = createClient()
    let active = true

    async function load(user: User | null) {
      if (!user) {
        if (active) setState({ user: null, profile: null, loading: false })
        return
      }
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()
      if (active) setState({ user, profile: profile ?? null, loading: false })
    }

    supabase.auth.getUser().then(({ data }) => load(data.user))

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null)
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  return state
}
