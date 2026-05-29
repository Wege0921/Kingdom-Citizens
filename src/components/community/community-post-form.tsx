'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Send, Loader2, WifiOff } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'
import { useToast } from '@/hooks/use-toast'
import { useNetworkStatus } from '@/hooks/use-network-status'

interface CommunityPostFormProps {
  onPostCreated?: () => void
}

export function CommunityPostForm({ onPostCreated }: CommunityPostFormProps = {}) {
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { t } = useTranslation()
  const { toast } = useToast()
  const { isOnline } = useNetworkStatus()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim() || isSubmitting) return
    if (!isOnline) {
      toast({ title: 'You are offline', description: 'Connect to the internet to post.' })
      return
    }

    setIsSubmitting(true)
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setIsSubmitting(false)
      toast({
        title: t('common.error'),
        description: t('sermons.signInToLeaveComment'),
        variant: 'destructive',
      })
      return
    }

    const { error, data } = await supabase
      .from('community_posts')
      .insert({ content: content.trim(), user_id: user.id })
      .select()
      .single()

    console.log('[CommunityPostForm] insert result:', { error, data })

    setIsSubmitting(false)
    if (error) {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      })
      return
    }
    setContent('')
    onPostCreated?.()
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 max-w-2xl mx-auto">
      <Textarea
        placeholder={t('community.placeholder')}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={3}
        className="resize-none min-h-[80px]"
      />
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {content.length}/500
        </span>
        <Button type="submit" size="sm" disabled={!content.trim() || isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {t('community.post')}
        </Button>
      </div>
    </form>
  )
}
