'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { AdminRadioDashboard } from '@/components/radio/admin-dashboard'
import { ListenerPlayer } from '@/components/radio/listener-player'
import { FallbackPlayer } from '@/components/radio/fallback-player'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Radio as RadioIcon, Loader2 } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

export default function RadioPage() {
  const { t } = useTranslation()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [activeSession, setActiveSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 10000)

    async function loadData() {
      try {
        const supabase = createClient()
        
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        if (user) {
          const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle()
          setProfile(data)
        }

        const { data: session } = await supabase
          .from('radio_sessions')
          .select('*')
          .eq('status', 'live')
          .order('started_at', { ascending: false })
          .limit(1)
          .maybeSingle()
        setActiveSession(session)
      } catch (error) {
        console.error('Error loading radio page:', error)
      } finally {
        clearTimeout(timeout)
        setLoading(false)
      }
    }
    
    loadData()
    return () => clearTimeout(timeout)
  }, [])

  const isAdmin = profile?.role === 'ADMIN' || profile?.role === 'LEADER'

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header user={user} profile={profile} />
        <div className="container mx-auto px-4 py-8 flex-1">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header user={user} profile={profile} />
      <div className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
              activeSession ? 'bg-red-500 animate-pulse' : 'bg-primary/10'
            }`}>
              <RadioIcon className={`h-6 w-6 ${activeSession ? 'text-white' : 'text-primary'}`} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-center">{t('radio.pageTitle')}</h1>
              <p className="text-muted-foreground">
                {activeSession ? t('radio.liveBroadcast') : t('radio.noLiveSession')}
              </p>
            </div>
          </div>

          {activeSession ? (
            <ListenerPlayer sessionId={activeSession.id} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>{t('radio.noLiveSessionTitle')}</CardTitle>
                <CardDescription>
                  {isAdmin
                    ? t('radio.adminStartBroadcast')
                    : t('radio.userCheckBack')
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isAdmin ? (
                  <AdminRadioDashboard />
                ) : (
                  <FallbackPlayer />
                )}
              </CardContent>
            </Card>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}
