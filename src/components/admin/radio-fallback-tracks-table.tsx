'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Search, Pencil, Trash2, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'

interface Track {
  id: string
  title_en: string
  title_am: string | null
  artist: string | null
  audio_url: string
  duration_sec: number | null
  order_index: number
  is_active: boolean
}

export function RadioFallbackTracksTable({ tracks: initial }: { tracks: Track[] }) {
  const [tracks, setTracks] = useState(initial)
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({
    title_en: '',
    title_am: '',
    artist: '',
    audio_url: '',
    order_index: '',
  })
  const router = useRouter()
  const { toast } = useToast()
  const { t } = useTranslation()

  const filtered = tracks.filter(
    (t) =>
      t.title_en.toLowerCase().includes(search.toLowerCase()) ||
      (t.artist && t.artist.toLowerCase().includes(search.toLowerCase()))
  )

  const handleToggleActive = async (track: Track) => {
    const { error } = await createClient()
      .from('radio_fallback_tracks')
      .update({ is_active: !track.is_active })
      .eq('id', track.id)

    if (error) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' })
    } else {
      setTracks(tracks.map((tr) => (tr.id === track.id ? { ...tr, is_active: !tr.is_active } : tr)))
      router.refresh()
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    const { error } = await createClient().from('radio_fallback_tracks').delete().eq('id', deleteId)
    if (error) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' })
    } else {
      setTracks(tracks.filter((t) => t.id !== deleteId))
      toast({ title: t('common.delete') })
      router.refresh()
    }
    setDeleting(false)
    setDeleteId(null)
  }

  const handleAdd = async () => {
    if (!form.title_en.trim() || !form.audio_url.trim()) return
    setAdding(true)
    const { data, error } = await createClient()
      .from('radio_fallback_tracks')
      .insert({
        title_en: form.title_en.trim(),
        title_am: form.title_am.trim() || null,
        artist: form.artist.trim() || null,
        audio_url: form.audio_url.trim(),
        order_index: parseInt(form.order_index) || tracks.length + 1,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      toast({ title: t('common.error'), description: error.message, variant: 'destructive' })
    } else if (data) {
      setTracks([...tracks, data])
      setForm({ title_en: '', title_am: '', artist: '', audio_url: '', order_index: '' })
      toast({ title: t('common.success') })
      router.refresh()
    }
    setAdding(false)
  }

  return (
    <div className="space-y-6">
      {/* Add Track Form */}
      <div className="rounded-md border p-4 space-y-3 bg-muted/30">
        <h3 className="font-semibold text-sm">{t('admin.newTrack')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            placeholder={`${t('admin.trackTitle')} (English)`}
            value={form.title_en}
            onChange={(e) => setForm({ ...form, title_en: e.target.value })}
          />
          <Input
            placeholder={`${t('admin.trackTitle')} (Amharic)`}
            value={form.title_am}
            onChange={(e) => setForm({ ...form, title_am: e.target.value })}
          />
          <Input
            placeholder={t('admin.trackArtist')}
            value={form.artist}
            onChange={(e) => setForm({ ...form, artist: e.target.value })}
          />
          <Input
            placeholder={t('admin.trackUrl')}
            value={form.audio_url}
            onChange={(e) => setForm({ ...form, audio_url: e.target.value })}
          />
          <Input
            placeholder={t('admin.order')}
            type="number"
            value={form.order_index}
            onChange={(e) => setForm({ ...form, order_index: e.target.value })}
          />
        </div>
        <Button onClick={handleAdd} disabled={adding || !form.title_en.trim() || !form.audio_url.trim()}>
          <Plus className="mr-2 h-4 w-4" />
          {t('admin.newTrack')}
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t('common.search')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('admin.trackTitle')}</TableHead>
              <TableHead>{t('admin.trackArtist')}</TableHead>
              <TableHead>{t('admin.order')}</TableHead>
              <TableHead>{t('admin.status')}</TableHead>
              <TableHead className="w-[70px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {t('admin.noTracksFound')}
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((track) => (
                <TableRow key={track.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {track.title_en}
                    {track.title_am && (
                      <span className="block text-xs text-muted-foreground">{track.title_am}</span>
                    )}
                  </TableCell>
                  <TableCell>{track.artist || '—'}</TableCell>
                  <TableCell>{track.order_index}</TableCell>
                  <TableCell>
                    <Badge variant={track.is_active ? 'default' : 'secondary'}>
                      {track.is_active ? t('admin.active') : t('admin.inactive')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleToggleActive(track)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          {track.is_active ? t('common.deactivate') : t('common.activate')}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => setDeleteId(track.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('admin.deleteTrack')}</AlertDialogTitle>
            <AlertDialogDescription>{t('admin.deleteTrackConfirm')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>{t('common.cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t('common.delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
