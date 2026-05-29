'use client'

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Calendar, Clock, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Sermon } from '@/lib/types'
import { format } from 'date-fns/format'
import { useTranslation } from '@/lib/i18n'
import { compressThumbnailUrl, getYoutubeVideoId, getYoutubeThumbnailMaxRes } from '@/lib/youtube'

interface Props {
  sermon: Sermon | null
}

export const WeeklySermon = memo(function WeeklySermon({ sermon }: Props) {
  const { t } = useTranslation()
  if (!sermon) return null

  const isThisWeek = sermon.published_at
    ? new Date(sermon.published_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false

  const youtubeId = getYoutubeVideoId(sermon.video_url)
  const thumbnailSrc = sermon.video_thumbnail
    ? (compressThumbnailUrl(sermon.video_thumbnail) || sermon.video_thumbnail)
    : youtubeId
      ? getYoutubeThumbnailMaxRes(youtubeId)
      : 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800'

  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            {isThisWeek ? t('home.thisWeek') : t('home.latestSermon')}
          </CardTitle>
          {isThisWeek && <Badge variant="default">{t('home.newBadge')}</Badge>}
        </div>
      </CardHeader>
      <CardContent>
        <Link
          href={`/sermons/${sermon.id}`}
          className="group block space-y-3"
        >
          <div className="flex items-start justify-between gap-4">
            {thumbnailSrc && (
              <div className="relative aspect-video w-32 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={thumbnailSrc}
                  alt=""
                  fill
                  sizes="128px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                {sermon.title_en}
              </h3>
              {sermon.speaker && (
                <p className="text-sm text-muted-foreground mt-1">
                  {sermon.speaker.name}
                </p>
              )}
              {sermon.published_at && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                  <Clock className="h-3 w-3" />
                  {format(new Date(sermon.published_at), 'MMMM d, yyyy')}
                </div>
              )}
            </div>
            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
          </div>
        </Link>
      </CardContent>
    </Card>
  )
})
