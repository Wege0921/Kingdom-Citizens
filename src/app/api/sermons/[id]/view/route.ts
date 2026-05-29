import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { id } = await params

    if (!id) {
      return NextResponse.json({ error: 'Missing sermon ID' }, { status: 400 })
    }

    // Atomic increment via RPC (service role bypasses RLS).
    // Avoids the lost-update race of read-modify-write under concurrency.
    const { error: rpcError } = await supabase.rpc('increment_sermon_view', {
      sermon_id: id,
    })

    if (rpcError) {
      // Fallback for environments where the RPC has not been deployed yet.
      // See supabase/migration-increment-sermon-view.sql
      console.warn('increment_sermon_view RPC failed, falling back:', rpcError.message)

      const { data: sermon } = await supabase
        .from('sermons')
        .select('view_count')
        .eq('id', id)
        .single()

      if (sermon) {
        const { error } = await supabase
          .from('sermons')
          .update({ view_count: (sermon.view_count || 0) + 1 })
          .eq('id', id)

        if (error) {
          console.error('View count increment error:', error)
          return NextResponse.json({ error: error.message }, { status: 500 })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('View count API error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
