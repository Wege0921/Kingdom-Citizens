import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: existing } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .maybeSingle()

        if (!existing) {
          await supabase.from('profiles').insert({
            id: user.id,
            full_name: user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'Member',
            role: 'MEMBER',
            language_preference: 'en',
          })
        }
      }

      return NextResponse.redirect(`${APP_URL}${next}`)
    }
  }

  return NextResponse.redirect(`${APP_URL}/auth/error`)
}
