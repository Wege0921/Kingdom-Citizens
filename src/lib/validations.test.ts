import { describe, it, expect } from 'vitest'
import {
  sermonSchema,
  speakerSchema,
  seriesSchema,
  topicSchema,
  commentSchema,
  profileSchema,
  socialPostSchema,
  learningPathSchema,
} from './validations'

describe('sermonSchema', () => {
  it('validates a complete sermon', () => {
    const result = sermonSchema.safeParse({
      title_en: 'Test Sermon',
      title_am: 'ፈተና ስብከት',
      summary_en: 'A test sermon summary',
      speaker_id: '550e8400-e29b-41d4-a716-446655440000',
      series_id: '',
      video_url: 'https://youtube.com/watch?v=test',
      is_published: true,
    })
    expect(result.success).toBe(true)
  })

  it('fails without English title', () => {
    const result = sermonSchema.safeParse({
      title_en: '',
      is_published: false,
    })
    expect(result.success).toBe(false)
  })

  it('accepts minimal valid sermon', () => {
    const result = sermonSchema.safeParse({
      title_en: 'Minimal',
      is_published: false,
    })
    expect(result.success).toBe(true)
  })
})

describe('speakerSchema', () => {
  it('validates a speaker with name', () => {
    const result = speakerSchema.safeParse({
      name: 'Pastor John',
      bio_en: 'A bio',
      is_active: true,
    })
    expect(result.success).toBe(true)
  })

  it('fails without name', () => {
    const result = speakerSchema.safeParse({
      name: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('seriesSchema', () => {
  it('validates a series', () => {
    const result = seriesSchema.safeParse({
      title_en: 'Faith Series',
      title_am: 'የእምነት ተከታታይ',
      is_active: true,
    })
    expect(result.success).toBe(true)
  })
})

describe('topicSchema', () => {
  it('validates a topic', () => {
    const result = topicSchema.safeParse({
      name_en: 'Prayer',
      name_am: 'ጸሎት',
    })
    expect(result.success).toBe(true)
  })

  it('fails without English name', () => {
    const result = topicSchema.safeParse({
      name_en: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('commentSchema', () => {
  it('validates a comment', () => {
    const result = commentSchema.safeParse({
      sermon_id: '550e8400-e29b-41d4-a716-446655440000',
      content: 'Great sermon!',
    })
    expect(result.success).toBe(true)
  })

  it('fails for empty content', () => {
    const result = commentSchema.safeParse({
      sermon_id: '550e8400-e29b-41d4-a716-446655440000',
      content: '',
    })
    expect(result.success).toBe(false)
  })
})

describe('profileSchema', () => {
  it('validates a profile', () => {
    const result = profileSchema.safeParse({
      full_name: 'John Doe',
      language_preference: 'am',
    })
    expect(result.success).toBe(true)
  })

  it('defaults language to en', () => {
    const result = profileSchema.safeParse({
      full_name: 'Jane',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.language_preference).toBe('en')
    }
  })
})

describe('socialPostSchema', () => {
  it('validates a social post', () => {
    const result = socialPostSchema.safeParse({
      sermon_id: '550e8400-e29b-41d4-a716-446655440000',
      platform: 'telegram',
      caption_en: 'Check out this sermon',
    })
    expect(result.success).toBe(true)
  })

  it('fails with invalid platform', () => {
    const result = socialPostSchema.safeParse({
      sermon_id: '550e8400-e29b-41d4-a716-446655440000',
      platform: 'invalid-platform',
    })
    expect(result.success).toBe(false)
  })
})

describe('learningPathSchema', () => {
  it('validates a learning path', () => {
    const result = learningPathSchema.safeParse({
      title_en: 'New Believers',
      title_am: 'ለአዳዲስ እምነተኞች',
      difficulty_level: 'beginner',
      estimated_duration_minutes: '120',
      sort_order: '1',
      is_published: true,
    })
    expect(result.success).toBe(true)
  })

  it('coerces string numbers to numbers', () => {
    const result = learningPathSchema.safeParse({
      title_en: 'Test',
      sort_order: '5',
      estimated_duration_minutes: '60',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(typeof result.data.sort_order).toBe('number')
      expect(result.data.sort_order).toBe(5)
    }
  })
})
