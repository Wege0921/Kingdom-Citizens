import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createPublicClient } from '@/lib/supabase/public'
import { PublicShell } from '@/components/layout/public-shell'
import { ReadingProgressTracker } from '@/components/sermon/reading-progress-tracker'
import { SermonDetailBody } from '@/components/sermon/sermon-detail-body'
import { ViewCounter } from '@/components/sermon/view-counter'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import type { Sermon, ScriptureReference } from '@/lib/types'

// Sermon detail: ISR-cached per id, refreshed hourly. Bookmark/comment auth
// is resolved on the client so the page can be statically generated.
export const revalidate = 3600

// Prerender published sermons at build time for instant first loads.
// New sermons added later are still served via ISR (dynamicParams defaults true).
export async function generateStaticParams() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return []
  }
  const supabase = createPublicClient()
  const { data } = await supabase
    .from('sermons')
    .select('id')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .limit(200)
  return (data ?? []).map((s: { id: string }) => ({ id: s.id }))
}

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return { title: 'Sermon' }
  }

  const supabase = createPublicClient()
  const { data: sermon } = await supabase
    .from('sermons')
    .select('title_en, summary_en, video_thumbnail, is_published')
    .eq('id', id)
    .single()

  if (!sermon?.is_published) {
    return { title: 'Sermon' }
  }

  const plain = (sermon.summary_en ?? '')
    .replace(/<[^>]+>/g, '')
    .slice(0, 160)

  return {
    title: sermon.title_en,
    description: plain || 'Sermon summary and resources.',
    openGraph: sermon.video_thumbnail
      ? { images: [{ url: sermon.video_thumbnail }] }
      : undefined,
  }
}

export default async function SermonDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = createPublicClient()

  const { data: sermon } = await supabase
    .from('sermons')
    .select(
      `
      *,
      speaker:speakers(id, name, avatar_url),
      series:series(id, title_en, title_am),
      sermon_topics(topic:topics(id, name_en, name_am))
    `,
    )
    .eq('id', id)
    .eq('is_published', true)
    .single()

  if (!sermon) {
    notFound()
  }

  const s = sermon as Sermon & {
    sermon_topics?: { topic: { id: string; name_en: string; name_am?: string | null } | null }[]
  }

  let related: Sermon[] = []
  if (s.series_id) {
    const { data: rel } = await supabase
      .from('sermons')
      .select('id, title_en, title_am, published_at, video_thumbnail')
      .eq('is_published', true)
      .eq('series_id', s.series_id)
      .neq('id', id)
      .order('published_at', { ascending: false })
      .limit(3)
    related = (rel as Sermon[]) ?? []
  }

  const scriptureRefs = Array.isArray(s.scripture_references)
    ? (s.scripture_references as ScriptureReference[])
    : []
  const prayers = Array.isArray(s.prayer_points) ? (s.prayer_points as string[]) : []
  const questions = Array.isArray(s.discussion_questions) ? (s.discussion_questions as string[]) : []

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ''
  const pageUrl = appUrl ? `${appUrl.replace(/\/$/, '')}/sermons/${id}` : `/sermons/${id}`

  const summaryEnPlain = s.summary_en?.replace(/<[^>]+>/g, '') || ''

  // JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: s.title_en,
    description: summaryEnPlain.slice(0, 160) || 'Sermon summary and resources.',
    image: s.video_thumbnail,
    datePublished: s.published_at || s.created_at,
    dateModified: s.updated_at,
    author: s.speaker ? {
      '@type': 'Person',
      name: s.speaker.name,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Kingdom Citizens Platform',
    },
    ...(s.series && {
      isPartOf: {
        '@type': 'Series',
        name: s.series.title_en,
      },
    }),
  }

  return (
    <PublicShell>
      <div className="container px-4 pt-6 pb-0">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/sermons">
            <ArrowLeft className="mr-2 h-4 w-4" />
            All sermons
          </Link>
        </Button>
      </div>
      <ViewCounter sermonId={id} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ReadingProgressTracker sermonId={id} />
      <SermonDetailBody
        sermon={s}
        related={related}
        scriptureRefs={scriptureRefs}
        prayers={prayers}
        questions={questions}
        pageUrl={pageUrl}
      />
    </PublicShell>
  )
}
