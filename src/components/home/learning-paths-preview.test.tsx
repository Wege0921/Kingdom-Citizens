import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LearningPathsPreview } from './learning-paths-preview'
import type { LearningPath } from '@/lib/types'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const dict: Record<string, string> = {
        'home.learningPaths': 'Learning Paths',
        'home.startLearning': 'Start Learning',
        'home.viewAll': 'View All',
        'learn.beginner': 'Beginner',
        'learn.intermediate': 'Intermediate',
        'learn.advanced': 'Advanced',
      }
      return dict[key] ?? key
    },
    language: 'en',
  }),
}))

describe('LearningPathsPreview', () => {
  const mockPaths: LearningPath[] = [
    {
      id: 'path-1',
      title_en: 'New Believers',
      title_am: 'ለአዳዲስ እምነተኞች',
      description_en: 'Foundational course',
      description_am: 'መሰረታዊ ኮርስ',
      cover_image: 'https://example.com/cover1.jpg',
      difficulty_level: 'beginner',
      estimated_duration_minutes: 180,
      is_published: true,
      sort_order: 1,
      created_by: 'user-1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
    {
      id: 'path-2',
      title_en: 'Faith Walk',
      title_am: 'የእምነት ጉዞ',
      description_en: 'Advanced discipleship',
      description_am: 'የበለጠ ተማሪነት',
      cover_image: null,
      difficulty_level: 'advanced',
      estimated_duration_minutes: 300,
      is_published: true,
      sort_order: 2,
      created_by: 'user-1',
      created_at: '2024-01-01',
      updated_at: '2024-01-01',
    },
  ]

  it('renders section title', () => {
    render(<LearningPathsPreview paths={mockPaths} />)
    expect(screen.getByText('learn.title')).toBeInTheDocument()
  })

  it('renders all learning paths', () => {
    render(<LearningPathsPreview paths={mockPaths} />)
    expect(screen.getByText('New Believers')).toBeInTheDocument()
    expect(screen.getByText('Faith Walk')).toBeInTheDocument()
  })

  it('shows difficulty badges', () => {
    render(<LearningPathsPreview paths={mockPaths} />)
    expect(screen.getByText('Beginner')).toBeInTheDocument()
    expect(screen.getByText('Advanced')).toBeInTheDocument()
  })

  it('renders empty state when no paths', () => {
    render(<LearningPathsPreview paths={[]} />)
    expect(screen.getByText('learn.title')).toBeInTheDocument()
    expect(screen.getByText('learn.comingSoon')).toBeInTheDocument()
  })
})
