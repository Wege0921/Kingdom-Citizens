import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { SermonCardSkeleton, SermonCardSkeletonGrid } from './sermon-card-skeleton'

describe('SermonCardSkeleton', () => {
  it('renders single skeleton', () => {
    const { container } = render(<SermonCardSkeleton />)
    expect(container.querySelectorAll('[data-slot="skeleton"]').length).toBeGreaterThan(0)
  })

  it('renders grid with default count', () => {
    const { container } = render(<SermonCardSkeletonGrid />)
    expect(container.querySelectorAll('[data-slot="card"]').length).toBe(6)
  })

  it('renders grid with custom count', () => {
    const { container } = render(<SermonCardSkeletonGrid count={3} />)
    expect(container.querySelectorAll('[data-slot="card"]').length).toBe(3)
  })
})
