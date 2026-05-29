import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { JsonLd, SermonJsonLd } from './json-ld'

describe('JsonLd', () => {
  it('renders script tag with JSON data', () => {
    const data = { name: 'Test', '@type': 'Thing' }
    const { container } = render(<JsonLd data={data} />)
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    expect(script?.innerHTML).toContain('Test')
  })
})

describe('SermonJsonLd', () => {
  it('renders video object schema', () => {
    const { container } = render(
      <SermonJsonLd
        title="Faith Walk"
        description="A sermon about faith"
        publishDate="2024-01-15"
        authorName="Pastor John"
        url="https://example.com/sermons/s1"
      />
    )
    const script = container.querySelector('script[type="application/ld+json"]')
    expect(script).toBeInTheDocument()
    expect(script?.innerHTML).toContain('Faith Walk')
    expect(script?.innerHTML).toContain('VideoObject')
  })
})
