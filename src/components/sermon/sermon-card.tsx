'use client'

import { memo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns/format'
import { Calendar, Play, User } from 'lucide-react'
import type { Sermon } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { sanitizeHTML } from '@/lib/sanitize'
import { compressThumbnailUrl, getYoutubeVideoId, getYoutubeThumbnailMaxRes } from '@/lib/youtube'

interface SermonCardProps {
  sermon: Sermon
}

export const SermonCard = memo(function SermonCard({ sermon }: SermonCardProps) {
  const { language } = useAppStore()

  const displayTitle = language === 'am' && sermon.title_am ? sermon.title_am : sermon.title_en
  const displaySummary = language === 'am' && sermon.summary_am ? sermon.summary_am : sermon.summary_en
  const displaySeries = language === 'am' && sermon.series?.title_am ? sermon.series.title_am : sermon.series?.title_en

  const plainSummary = (displaySummary ?? '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/<[^>]+>/g, '')

  const youtubeId = getYoutubeVideoId(sermon.video_url)
  const thumbnailSrc = sermon.video_thumbnail
    ? (compressThumbnailUrl(sermon.video_thumbnail) || sermon.video_thumbnail)
    : youtubeId
      ? getYoutubeThumbnailMaxRes(youtubeId)
      : 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800'

  return (
    <Link href={`/sermons/${sermon.id}`} className="block">
      <Card className="group overflow-hidden hover:shadow-md transition-shadow h-full">
        <div className="aspect-video relative bg-muted">
          {thumbnailSrc ? (
            <Image
              src={thumbnailSrc}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-primary/10">
              <Play className="h-12 w-12 text-primary/50" />
            </div>
          )}
        </div>
        <CardHeader className="pb-2">
          {displaySeries && (
            <Badge variant="secondary" className="mb-2 w-fit">
              {displaySeries}
            </Badge>
          )}
          <CardTitle className="line-clamp-2 text-lg group-hover:text-primary transition-colors">
            {displayTitle}
          </CardTitle>
          <CardDescription className="line-clamp-2">
            {plainSummary}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {sermon.speaker && (
            <span className="inline-flex items-center gap-1">
              <User className="h-3.5 w-3.5" />
              {sermon.speaker.name}
            </span>
          )}
          {sermon.published_at && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5" />
              {format(new Date(sermon.published_at), 'MMM d, yyyy')}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  )
})
