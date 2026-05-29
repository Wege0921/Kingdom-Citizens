import Link from 'next/link'
import { createPublicClient } from '@/lib/supabase/public'
import { PublicShell } from '@/components/layout/public-shell'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Clock, BarChart } from 'lucide-react'
import type { LearningPath } from '@/lib/types'
import { T } from '@/components/ui/localized-text'
import { PathProgress } from '@/components/learning/path-progress'

// Public learning index: statically generated, refreshed hourly.
// Per-user progress is loaded client-side via <PathProgress />.
export const revalidate = 3600

export const metadata = {
  title: 'Learning Paths',
  description: 'Structured Kingdom Citizens journeys with modules and quizzes.',
}

export default async function LearnPage() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return (
      <PublicShell>
        <div className="container px-4 py-10">
          <p className="text-muted-foreground text-center">Learning paths will appear here.</p>
        </div>
      </PublicShell>
    )
  }

  const supabase = createPublicClient()

  const { data: paths, error } = await supabase
    .from('learning_paths')
    .select('*')
    .eq('is_published', true)
    .order('sort_order', { ascending: true })

  return (
    <PublicShell>
      <div className="container px-4 py-10 space-y-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-center"><T k="learn.title" /></h1>
            <p className="text-muted-foreground">
              <T k="learn.description" />
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive"><T k="learn.couldNotLoad" /></p>
          )}

          {!error && (!paths || paths.length === 0) && (
            <p className="text-muted-foreground"><T k="learn.willAppear" /></p>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {(paths as LearningPath[])?.map((path) => {
            return (
              <Link key={path.id} href={`/learn/${path.id}`} className="block">
                <Card className="group overflow-hidden hover:shadow-md transition-shadow h-full">
                  {path.cover_image && (
                    <div className="aspect-[2/1] overflow-hidden rounded-t-lg">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={path.cover_image} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex gap-2 mb-2">
                      <Badge className="capitalize">{path.difficulty_level}</Badge>
                    </div>
                    <CardTitle className="group-hover:text-primary transition-colors">
                      {path.title_en}
                    </CardTitle>
                    <CardDescription className="line-clamp-3">{path.description_en}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    {path.estimated_duration_minutes && (
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        {Math.round(path.estimated_duration_minutes / 60)}h
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <BarChart className="h-3.5 w-3.5" />
                      {path.difficulty_level}
                    </span>
                  </div>
                  <PathProgress pathId={path.id} />
                </CardContent>
              </Card>
              </Link>
            )
          })}
          </div>
        </div>
      </div>
    </PublicShell>
  )
}
