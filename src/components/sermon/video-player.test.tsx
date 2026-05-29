import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { VideoPlayer } from './video-player'

vi.mock('@/lib/youtube', () => ({
  getYoutubeVideoId: (url: string | null) => {
    if (!url) return null
    const match = url.match(/v=([a-zA-Z0-9_-]+)/)
    return match ? match[1] : null
  },
}))

describe('VideoPlayer', () => {
  it('renders no video message when no url', () => {
    render(<VideoPlayer videoUrl={null} title="Sermon" />)
    expect(screen.getByText(/no video url/i)).toBeInTheDocument()
  })

  it('renders play button for valid url', () => {
    render(<VideoPlayer videoUrl="https://youtube.com/watch?v=abc123" title="Sermon" />)
    expect(screen.getByRole('button', { name: /play/i })).toBeInTheDocument()
  })
})
