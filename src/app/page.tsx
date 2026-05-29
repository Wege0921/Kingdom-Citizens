import { createPublicClient } from '@/lib/supabase/public'
import { Header } from '@/components/layout/header'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedSermons } from '@/components/home/featured-sermons'
import { LearningPathsPreview } from '@/components/home/learning-paths-preview'
import { WeeklySermon } from '@/components/home/weekly-sermon'
import { Footer } from '@/components/layout/footer'
import type { Sermon } from '@/lib/types'

// Public landing page: statically generated, refreshed every 5 minutes.
export const revalidate = 300

export default async function HomePage() {
  const supabase = createPublicClient()

  const [weeklyRes, sermonsRes, pathsRes] = await Promise.all([
    supabase
      .from('sermons')
      .select('*, speaker:speakers(*), series:series(*)')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from('sermons')
      .select('*, speaker:speakers(*), series:series(*)')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(6),
    supabase
      .from('learning_paths')
      .select('*')
      .eq('is_published', true)
      .order('sort_order', { ascending: true })
      .limit(3),
  ])

  const weeklySermon = weeklyRes.data
  const sermons = sermonsRes.data
  const learningPaths = pathsRes.data

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <div className="container px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <WeeklySermon sermon={weeklySermon as Sermon | null} />
          </div>
        </div>
        <FeaturedSermons sermons={sermons || []} />
        <LearningPathsPreview paths={learningPaths || []} />
      </main>
      <Footer />
    </div>
  )
}
