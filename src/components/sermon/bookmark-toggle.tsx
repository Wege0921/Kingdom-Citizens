'use client'

import { Heart, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { trpc } from '@/lib/trpc/client'
import { useToast } from '@/hooks/use-toast'
import { useTranslation } from '@/lib/i18n'
import { useNetworkStatus } from '@/hooks/use-network-status'
import { useCurrentUser } from '@/hooks/use-current-user'

interface BookmarkToggleProps {
  sermonId: string
  /** Optional. When omitted, resolved on the client. */
  initialBookmarked?: boolean
  isLoggedIn?: boolean
}

export function BookmarkToggle({ sermonId, initialBookmarked = false, isLoggedIn: isLoggedInProp }: BookmarkToggleProps) {
  const { toast } = useToast()
  const { t } = useTranslation()
  const utils = trpc.useUtils()
  const { isOnline } = useNetworkStatus()
  const { user, loading: authLoading } = useCurrentUser()
  const isLoggedIn = isLoggedInProp !== undefined ? isLoggedInProp : !!user

  const toggleMutation = trpc.bookmark.toggle.useMutation({
    onSuccess: (result) => {
      toast({ 
        title: result.bookmarked 
          ? t('sermons.savedToBookmarks') 
          : t('sermons.removedFromBookmarks') 
      })
      // Invalidate bookmark queries to refresh data
      utils.bookmark.list.invalidate()
      utils.bookmark.isBookmarked.invalidate({ sermonId })
    },
    onError: (error) => {
      toast({ 
        title: 'Error', 
        description: error.message, 
        variant: 'destructive' 
      })
    },
  })

  // Use query to track current bookmark state
  const { data: isBookmarked, isLoading: isChecking } = trpc.bookmark.isBookmarked.useQuery(
    { sermonId },
    {
      enabled: isLoggedIn,
      initialData: initialBookmarked,
    }
  )

  // While resolving auth on the client, render a neutral placeholder to avoid
  // flashing the sign-in CTA to logged-in users.
  if (isLoggedInProp === undefined && authLoading) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Heart className="mr-2 h-4 w-4" />
        {t('sermons.bookmark')}
      </Button>
    )
  }

  if (!isLoggedIn) {
    return (
      <Button variant="outline" size="sm" asChild>
        <a href={`/auth/login?next=/sermons/${sermonId}`}>{t('sermons.signInToBookmark')}</a>
      </Button>
    )
  }

  const bookmarked = isBookmarked ?? initialBookmarked
  const loading = toggleMutation.isPending || isChecking

  const toggle = () => {
    if (!isOnline) {
      toast({ title: 'You are offline', description: 'Connect to the internet to use this feature.' })
      return
    }
    toggleMutation.mutate({ sermonId })
  }

  return (
    <Button
      type="button"
      variant={bookmarked ? 'default' : 'outline'}
      size="sm"
      onClick={toggle}
      disabled={loading || !isOnline}
      title={!isOnline ? 'You are offline' : undefined}
    >
      {!isOnline ? (
        <WifiOff className="mr-2 h-4 w-4" />
      ) : (
        <Heart className={`mr-2 h-4 w-4 ${bookmarked ? 'fill-current' : ''}`} />
      )}
      {!isOnline ? 'Offline' : bookmarked ? t('sermons.bookmarked') : t('sermons.bookmark')}
    </Button>
  )
}
