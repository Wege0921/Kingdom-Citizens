import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { RadioFallbackTracksTable } from '@/components/admin/radio-fallback-tracks-table'
import { Radio } from 'lucide-react'
import { T } from '@/components/ui/localized-text'

export const metadata = { title: 'Radio Admin' }

export default async function AdminRadioPage() {
  const supabase = await createClient()
  const { data: tracks } = await supabase
    .from('radio_fallback_tracks')
    .select('*')
    .order('order_index', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold"><T k="admin.radio" /></h1>
          <p className="text-muted-foreground"><T k="admin.manageRadioTracks" /></p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <a href="/radio" target="_blank">
              <Radio className="mr-2 h-4 w-4" />
              <T k="radio.goLive" />
            </a>
          </Button>
        </div>
      </div>
      <RadioFallbackTracksTable tracks={tracks ?? []} />
    </div>
  )
}
