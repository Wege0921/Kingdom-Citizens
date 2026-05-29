'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Pause, SkipForward, Volume2, VolumeX, Music, Radio, Shuffle, Repeat, Repeat1 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useTranslation } from '@/lib/i18n'

interface Track {
  id: string
  title_en: string
  title_am: string | null
  artist: string | null
  audio_url: string
  duration_sec: number | null
  order_index: number
}

export function FallbackPlayer() {
  const { t } = useTranslation()
  const supabase = createClient()
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [failedIndices, setFailedIndices] = useState<Set<number>>(new Set())
  const [isShuffle, setIsShuffle] = useState(false)
  const [loopMode, setLoopMode] = useState<'off' | 'one' | 'all'>('all')
  const shuffledOrderRef = useRef<number[]>([])
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    fetchTracks()
  }, [])

  useEffect(() => {
    // MediaSession API for PWA mini-player
    if ('mediaSession' in navigator && tracks[currentIndex]) {
      const track = tracks[currentIndex]
      navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title_en,
        artist: track.artist || 'Kingdom Citizens Radio',
        album: 'Live Radio',
        artwork: [
          { src: '/icons/icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
        ],
      })

      navigator.mediaSession.setActionHandler('play', () => playPause())
      navigator.mediaSession.setActionHandler('pause', () => playPause())
      navigator.mediaSession.setActionHandler('nexttrack', () => skipNext())
    }
  }, [currentIndex, tracks])

  const generateShuffledOrder = (length: number) => {
    const arr = Array.from({ length }, (_, i) => i)
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }

  // Regenerate shuffle order when tracks change or shuffle is toggled
  useEffect(() => {
    if (tracks.length > 0) {
      if (isShuffle) {
        shuffledOrderRef.current = generateShuffledOrder(tracks.length)
        // Start from beginning of shuffled order
        setCurrentIndex(shuffledOrderRef.current[0])
      } else {
        shuffledOrderRef.current = []
      }
    }
  }, [tracks.length, isShuffle])

  const fetchTracks = async () => {
    const { data } = await supabase
      .from('radio_fallback_tracks')
      .select('*')
      .eq('is_active', true)
      .order('order_index', { ascending: true })

    if (data && data.length > 0) {
      setTracks(data)
    }
    setIsLoading(false)
  }

  const playPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play().catch((err) => {
          console.error('Play failed:', err)
          setLoadError(err instanceof Error ? err.message : 'Playback failed')
        })
      }
    }
  }

  const skipNext = () => {
    if (tracks.length === 0) return
    if (isShuffle && shuffledOrderRef.current.length > 0) {
      // Find current position in shuffled order, then advance
      const currentPos = shuffledOrderRef.current.indexOf(currentIndex)
      const nextPos = (currentPos + 1) % shuffledOrderRef.current.length
      setCurrentIndex(shuffledOrderRef.current[nextPos])
    } else {
      setCurrentIndex((prev) => (prev + 1) % tracks.length)
    }
    setLoadError(null)
  }

  const handleEnded = () => {
    if (loopMode === 'one') {
      // Replay same track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play().catch(() => {})
      }
      return
    }
    // 'all' or 'off' — go to next track
    if (isShuffle && shuffledOrderRef.current.length > 0) {
      const currentPos = shuffledOrderRef.current.indexOf(currentIndex)
      const isLast = currentPos === shuffledOrderRef.current.length - 1
      if (loopMode === 'off' && isLast) {
        setIsPlaying(false)
        return
      }
    } else {
      if (loopMode === 'off' && currentIndex === tracks.length - 1) {
        setIsPlaying(false)
        return
      }
    }
    skipNext()
  }

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev)
  }

  const toggleLoop = () => {
    setLoopMode((prev) => {
      if (prev === 'off') return 'all'
      if (prev === 'all') return 'one'
      return 'off'
    })
  }

  const handleAudioError = (e: React.SyntheticEvent<HTMLAudioElement, Event>) => {
    const audio = e.currentTarget
    const error = audio.error
    const code = error?.code
    let message = 'Unknown audio error'

    switch (code) {
      case 1: message = 'Audio loading aborted'; break
      case 2: message = 'Network error — check CORS/bucket permissions'; break
      case 3: message = 'Audio decode error — file may be corrupt'; break
      case 4: message = 'Format not supported — check file type and bucket access'; break
    }

    console.error(`[FallbackPlayer] Audio error on "${currentTrack?.title_en}":`, message, audio.src)
    setLoadError(message)

    // Mark this track as failed and try the next one
    setFailedIndices((prev) => {
      const next = new Set(prev)
      next.add(currentIndex)

      // If every track failed, stop trying
      if (next.size >= tracks.length) {
        console.error('[FallbackPlayer] All tracks failed to load.')
        return next
      }

      // Auto-skip to next track after a short delay
      setTimeout(() => skipNext(), 500)
      return next
    })
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(audioRef.current.muted)
    }
  }

  if (isLoading) {
    return null
  }

  if (tracks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="h-5 w-5" />
            {t('radio.fallbackMusic')}
          </CardTitle>
          <CardDescription>
            {t('radio.noFallbackTracks')}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentTrack = tracks[currentIndex]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          {t('radio.fallbackMusic')}
        </CardTitle>
        <CardDescription>
          {t('radio.fallbackDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center">
            <Music className="h-8 w-8 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold truncate">{currentTrack.title_en}</h3>
            {currentTrack.artist && (
              <p className="text-sm text-muted-foreground truncate">{currentTrack.artist}</p>
            )}
            {failedIndices.has(currentIndex) && (
              <p className="text-xs text-amber-600">{t('common.loading')} failed</p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={isShuffle ? 'default' : 'outline'}
              size="icon"
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={toggleMute}>
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button size="icon" onClick={playPause}>
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={skipNext}>
              <SkipForward className="h-4 w-4" />
            </Button>
            <Button
              variant={loopMode !== 'off' ? 'default' : 'outline'}
              size="icon"
              onClick={toggleLoop}
              title={loopMode === 'one' ? 'Repeat one' : loopMode === 'all' ? 'Repeat all' : 'No repeat'}
            >
              {loopMode === 'one' ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {loadError && (
          <p className="text-xs text-red-500 mt-2 bg-red-50 p-2 rounded">
            {loadError}
          </p>
        )}

        <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
          <span>
            Track {isShuffle ? shuffledOrderRef.current.indexOf(currentIndex) + 1 : currentIndex + 1} of {tracks.length}
            {isShuffle && ' (shuffled)'}
          </span>
          <span>
            {loopMode === 'one' && 'Repeat one'}
            {loopMode === 'all' && 'Repeat all'}
            {loopMode === 'off' && 'No repeat'}
          </span>
        </div>

        <audio
          ref={audioRef}
          src={currentTrack.audio_url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          onError={handleAudioError}
          className="hidden"
        />
      </CardContent>
    </Card>
  )
}
