interface JsonLdProps {
  data: Record<string, unknown>
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

interface SermonJsonLdProps {
  title: string
  description: string
  publishDate: string
  authorName: string
  thumbnailUrl?: string
  videoUrl?: string
  audioUrl?: string
  url: string
}

export function SermonJsonLd({
  title,
  description,
  publishDate,
  authorName,
  thumbnailUrl,
  videoUrl,
  audioUrl,
  url,
}: SermonJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: title,
    description,
    uploadDate: publishDate,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    thumbnailUrl: thumbnailUrl || 'https://kingdom-learning.vercel.app/icon-512x512.png',
    contentUrl: videoUrl,
    embedUrl: videoUrl,
    ...(audioUrl && { audio: audioUrl }),
    url,
  }

  return <JsonLd data={data} />
}

interface ArticleJsonLdProps {
  title: string
  description: string
  publishDate: string
  authorName: string
  imageUrl?: string
  url: string
}

export function ArticleJsonLd({
  title,
  description,
  publishDate,
  authorName,
  imageUrl,
  url,
}: ArticleJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    datePublished: publishDate,
    author: {
      '@type': 'Person',
      name: authorName,
    },
    image: imageUrl || 'https://kingdom-learning.vercel.app/icon-512x512.png',
    url,
    publisher: {
      '@type': 'Organization',
      name: 'Kingdom Citizens',
      logo: {
        '@type': 'ImageObject',
        url: 'https://kingdom-learning.vercel.app/icon-512x512.png',
      },
    },
  }

  return <JsonLd data={data} />
}

interface LearningPathJsonLdProps {
  title: string
  description: string
  durationMinutes?: number
  url: string
}

export function LearningPathJsonLd({
  title,
  description,
  durationMinutes,
  url,
}: LearningPathJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: title,
    description,
    ...(durationMinutes && {
      duration: `PT${durationMinutes}M`,
    }),
    url,
    provider: {
      '@type': 'Organization',
      name: 'Kingdom Citizens',
    },
  }

  return <JsonLd data={data} />
}

interface BreadcrumbJsonLdProps {
  items: Array<{
    name: string
    url: string
  }>
}

export function BreadcrumbJsonLd({ items }: BreadcrumbJsonLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return <JsonLd data={data} />
}
