import { PublicShell } from '@/components/layout/public-shell'
import { T } from '@/components/ui/localized-text'

export const metadata = {
  title: 'About',
  description: 'About Kingdom Citizens Platform.',
}

export default function AboutPage() {
  return (
    <PublicShell>
      <div className="container px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-center"><T k="about.title" /></h1>
          <p className="text-muted-foreground leading-relaxed">
            <T k="about.description1" />
          </p>
          <p className="text-muted-foreground leading-relaxed">
            <T k="about.description2" />
          </p>
        </div>
      </div>
    </PublicShell>
  )
}
