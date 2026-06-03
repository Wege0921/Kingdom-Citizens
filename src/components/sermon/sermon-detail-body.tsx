'use client'

import Link from 'next/link'
import { VideoPlayer } from '@/components/sermon/video-player'
import { BookmarkToggle } from '@/components/sermon/bookmark-toggle'
import { SermonComments } from '@/components/sermon/comments'
import { ShareButtons } from '@/components/sermon/share-buttons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SafeHTML } from '@/components/ui/safe-html'
import type { Sermon, ScriptureReference } from '@/lib/types'
import { format } from 'date-fns/format'
import { BookOpen, Calendar, Download, ExternalLink } from 'lucide-react'
import { T } from '@/components/ui/localized-text'
import { useAppStore } from '@/lib/store'
import type { User } from '@supabase/supabase-js'

interface SermonDetailBodyProps {
  sermon: Sermon & {
    sermon_topics?: { topic: { id: string; name_en: string; name_am?: string | null } | null }[]
  }
  related: Sermon[]
  /** Optional. When omitted, auth/bookmark state is resolved on the client. */
  bookmarked?: boolean
  user?: User | null
  scriptureRefs: ScriptureReference[]
  prayers: string[]
  questions: string[]
  pageUrl: string
}

function ScriptureList({ refs }: { refs: ScriptureReference[] }) {
  if (!refs.length) return null
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <BookOpen className="h-5 w-5" />
        <T k="sermons.scriptureReferences" />
      </h2>
      <div className="grid gap-3">
        {refs.map((r, i) => (
          <blockquote
            key={`${r.book}-${r.chapter}-${i}`}
            className="border-l-4 border-primary pl-4 py-2 bg-muted/40 rounded-r-md text-sm"
          >
            <p className="font-medium text-primary">
              {r.book} {r.chapter}
              {r.verses ? `:${r.verses}` : ''}
            </p>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

export function SermonDetailBody({
  sermon,
  related,
  bookmarked,
  user,
  scriptureRefs,
  prayers,
  questions,
  pageUrl,
}: SermonDetailBodyProps) {
  const isLoggedIn = user !== undefined ? !!user : undefined
  const { language } = useAppStore()

  const displayTitle =
    language === 'am' && sermon.title_am ? sermon.title_am : sermon.title_en
  const displaySummary =
    language === 'am' && sermon.summary_am ? sermon.summary_am : sermon.summary_en
  const displaySeriesTitle =
    language === 'am' && sermon.series?.title_am
      ? sermon.series.title_am
      : sermon.series?.title_en

  const memoryVerse =
    language === 'am' && sermon.memory_verse_am
      ? sermon.memory_verse_am
      : sermon.memory_verse_en

  const fullUrl = pageUrl.startsWith('http') ? pageUrl : `https://kingdom-learning.vercel.app${pageUrl}`

  return (
    <article className="container max-w-4xl px-4 py-10 space-y-10">
      <div className="space-y-4">
        {displaySeriesTitle && (
          <Badge variant="secondary" asChild>
            <Link href={`/sermons?q=${encodeURIComponent(displaySeriesTitle)}`}>
              {displaySeriesTitle}
            </Link>
          </Badge>
        )}
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{displayTitle}</h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          {sermon.speaker && <span>{sermon.speaker.name}</span>}
          {sermon.published_at && (
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              {format(new Date(sermon.published_at), 'MMMM d, yyyy')}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <BookmarkToggle sermonId={sermon.id} initialBookmarked={bookmarked} isLoggedIn={isLoggedIn} />
          {sermon.pdf_url && (
            <Button variant="outline" size="sm" asChild>
              <a href={sermon.pdf_url} target="_blank" rel="noopener noreferrer">
                <Download className="mr-2 h-4 w-4" />
                PDF
              </a>
            </Button>
          )}
          <ShareButtons url={fullUrl} title={displayTitle} />
        </div>
      </div>

      <VideoPlayer videoUrl={sermon.video_url} title={displayTitle} />

      {memoryVerse && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg"><T k="sermons.memoryVerse" /></CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-lg leading-relaxed whitespace-pre-wrap">
            <p dir={language === 'am' ? 'rtl' : 'ltr'} className={language === 'am' ? 'text-right' : ''}>
              {memoryVerse}
            </p>
          </CardContent>
        </Card>
      )}

      <section className="max-w-none">
        <h2 className="text-xl font-semibold mb-4"><T k="admin.summary" /></h2>
        {displaySummary ? (
          <SafeHTML html={displaySummary} className="sermon-content" />
        ) : (
          <p className="text-muted-foreground"><T k="common.noResults" /></p>
        )}
      </section>

      <ScriptureList refs={scriptureRefs} />

      {prayers.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold"><T k="sermons.prayerPoints" /></h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            {prayers.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </section>
      )}

      {questions.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold"><T k="sermons.discussionQuestions" /></h2>
          <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
            {questions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        </section>
      )}

      {sermon.sermon_topics && sermon.sermon_topics.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {sermon.sermon_topics.map((st) =>
            st.topic ? (
              <Badge key={st.topic.id} variant="outline">
                {language === 'am' && st.topic.name_am ? st.topic.name_am : st.topic.name_en}
              </Badge>
            ) : null,
          )}
        </div>
      )}

      {related.length > 0 && (
        <>
          <Separator />
          <section className="space-y-4">
            <h2 className="text-xl font-semibold"><T k="sermons.relatedSermons" /></h2>
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={r.id}>
                  <Link href={`/sermons/${r.id}`} className="text-primary hover:underline inline-flex items-center gap-2">
                    {language === 'am' && r.title_am ? r.title_am : r.title_en}
                    <ExternalLink className="h-3 w-3 opacity-60" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </>
      )}

      <Separator />

      <SermonComments
        sermonId={sermon.id}
        currentUser={user !== undefined ? (user ? { id: user.id, email: user.email || '' } : null) : undefined}
      />
    </article>
  )
}
