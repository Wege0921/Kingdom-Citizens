'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Play, Pause, Volume2, VolumeX, Radio, Users, MessageSquare, Heart, Flame, Music, Send, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { connectSocket } from '@/lib/socket/client'
import { useTranslation } from '@/lib/i18n'
import { ListenerPeerManager } from '@/lib/webrtc/peer-manager'

export function ListenerPlayer({ sessionId }: { sessionId: string }) {
  const { t } = useTranslation()
  const supabase = createClient()
  const socket = connectSocket()

  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [listenerCount, setListenerCount] = useState(0)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [reactions, setReactions] = useState<{ [key: string]: number }>({})
  const [showChat, setShowChat] = useState(false)
  const [session, setSession] = useState<any>(null)

  const audioRef = useRef<HTMLAudioElement>(null)
  const peerManagerRef = useRef<ListenerPeerManager | null>(null)
  const currentUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      // Fetch session details
      await fetchSession()

      // Join session via socket
      const { data: { user } } = await supabase.auth.getUser()
      if (!user || !isMounted) return
      currentUserIdRef.current = user.id

      socket.emit('radio:join', {
        sessionId,
        userId: user.id,
        role: 'listener',
      })
    }

    init()

    // Socket listeners
    socket.on('radio:joined', (data: any) => {
      setListenerCount(data.listenerCount)
      setSession((prev: any) => ({ ...prev, status: data.status }))

      // Initialize peer manager once we know the host
      const hostId = data.hostUserId || session?.host_id
      if (hostId && currentUserIdRef.current && !peerManagerRef.current) {
        peerManagerRef.current = new ListenerPeerManager(hostId, {
          sendOffer: () => {},
          sendAnswer: (targetUserId, signal) => {
            socket.emit('webrtc:answer', {
              sessionId,
              fromUserId: currentUserIdRef.current,
              targetUserId,
              signal,
            })
          },
          sendIceCandidate: (targetUserId, candidate) => {
            socket.emit('webrtc:ice-candidate', {
              sessionId,
              fromUserId: currentUserIdRef.current,
              targetUserId,
              candidate,
            })
          },
        })

        peerManagerRef.current.onStream((stream) => {
          if (audioRef.current) {
            audioRef.current.srcObject = stream
            audioRef.current.play().catch((err) => console.error('Auto-play failed:', err))
            setIsPlaying(true)

            // Set up MediaSession API for PWA mini-player
            if ('mediaSession' in navigator) {
              navigator.mediaSession.metadata = new MediaMetadata({
                title: session?.title_en || 'Live Radio',
                artist: 'Kingdom Citizens Radio',
                album: 'Live Broadcast',
                artwork: [
                  { src: '/icons/icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
                ],
              })
              navigator.mediaSession.playbackState = 'playing'
              navigator.mediaSession.setActionHandler('pause', () => {
                audioRef.current?.pause()
              })
              navigator.mediaSession.setActionHandler('play', () => {
                audioRef.current?.play()
              })
            }
          }
        })
      }
    })

    socket.on('radio:listener-joined', (data: any) => {
      setListenerCount(data.listenerCount)
    })

    socket.on('radio:listener-left', (data: any) => {
      setListenerCount(data.listenerCount)
    })

    socket.on('chat:message', (message: any) => {
      setChatMessages((prev) => [...prev, message])
    })

    socket.on('reaction:received', (data: any) => {
      setReactions((prev) => ({
        ...prev,
        [data.emoji]: (prev[data.emoji] || 0) + 1,
      }))
    })

    // WebRTC: receive offer from host
    socket.on('webrtc:offer', async ({ signal, fromUserId, targetUserId }: any) => {
      // Ignore offers not meant for this listener
      if (targetUserId && targetUserId !== currentUserIdRef.current) return

      // Lazy-init peer manager if we somehow missed hostUserId
      if (!peerManagerRef.current && fromUserId && currentUserIdRef.current) {
        peerManagerRef.current = new ListenerPeerManager(fromUserId, {
          sendOffer: () => {},
          sendAnswer: (targetUserId, signal) => {
            socket.emit('webrtc:answer', {
              sessionId,
              fromUserId: currentUserIdRef.current,
              targetUserId,
              signal,
            })
          },
          sendIceCandidate: (targetUserId, candidate) => {
            socket.emit('webrtc:ice-candidate', {
              sessionId,
              fromUserId: currentUserIdRef.current,
              targetUserId,
              candidate,
            })
          },
        })
        peerManagerRef.current.onStream((stream) => {
          if (audioRef.current) {
            audioRef.current.srcObject = stream
            audioRef.current.play().catch((err) => console.error('Auto-play failed:', err))
            setIsPlaying(true)
            if ('mediaSession' in navigator) {
              navigator.mediaSession.metadata = new MediaMetadata({
                title: session?.title_en || 'Live Radio',
                artist: 'Kingdom Citizens Radio',
                album: 'Live Broadcast',
                artwork: [
                  { src: '/icons/icon-512x512.jpg', sizes: '512x512', type: 'image/jpeg' },
                ],
              })
              navigator.mediaSession.playbackState = 'playing'
              navigator.mediaSession.setActionHandler('pause', () => {
                audioRef.current?.pause()
              })
              navigator.mediaSession.setActionHandler('play', () => {
                audioRef.current?.play()
              })
            }
          }
        })
      }

      if (peerManagerRef.current) {
        await peerManagerRef.current.handleOffer(signal)
      }
    })

    // WebRTC: receive ICE candidate from host
    socket.on('webrtc:ice-candidate', async ({ candidate, targetUserId }: any) => {
      // Ignore ICE candidates not meant for this listener
      if (targetUserId && targetUserId !== currentUserIdRef.current) return
      if (peerManagerRef.current) {
        await peerManagerRef.current.handleIceCandidate(candidate)
      }
    })

    return () => {
      isMounted = false
      socket.off('radio:joined')
      socket.off('radio:listener-joined')
      socket.off('radio:listener-left')
      socket.off('chat:message')
      socket.off('reaction:received')
      socket.off('webrtc:offer')
      socket.off('webrtc:ice-candidate')

      if (peerManagerRef.current) {
        peerManagerRef.current.close()
        peerManagerRef.current = null
      }

      if (currentUserIdRef.current) {
        socket.emit('radio:leave', { sessionId, userId: currentUserIdRef.current })
      }
    }
  }, [sessionId])

  const fetchSession = async () => {
    const { data } = await supabase
      .from('radio_sessions')
      .select('*')
      .eq('id', sessionId)
      .single()
    
    if (data) {
      setSession(data)
      setListenerCount(data.listener_count || 0)
    }
  }

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted
      setIsMuted(audioRef.current.muted)
    }
  }

  const sendReaction = (emoji: string) => {
    if (currentUserIdRef.current) {
      socket.emit('reaction:send', {
        sessionId,
        userId: currentUserIdRef.current,
        emoji,
      })
    }
  }

  const sendChatMessage = (content: string) => {
    if (currentUserIdRef.current && content.trim()) {
      socket.emit('chat:send', {
        sessionId,
        userId: currentUserIdRef.current,
        content,
      })
    }
  }

  const reactionEmojis = ['👍', '❤️', '🔥', '🎵', '😂', '🙏']

  if (!session) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Player */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Radio className="h-8 w-8 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{session.title_en}</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Users className="h-4 w-4" />
                {listenerCount} listening
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Button
                size="icon"
                onClick={togglePlay}
                disabled={session.status !== 'live'}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Audio element - connected to WebRTC stream via srcObject */}
          <audio
            ref={audioRef}
            autoPlay
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            className="hidden"
          />

          {/* Reactions */}
          <div className="flex gap-2 justify-center mt-4">
            {reactionEmojis.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="text-2xl"
                onClick={() => sendReaction(emoji)}
              >
                {emoji}
                {reactions[emoji] > 0 && (
                  <span className="ml-1 text-sm">{reactions[emoji]}</span>
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Toggle */}
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowChat(!showChat)}
      >
        <MessageSquare className="mr-2 h-4 w-4" />
        {showChat ? 'Hide Chat' : 'Show Chat'}
      </Button>

      {/* Chat Panel */}
      {showChat && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-2">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    <span className="font-semibold">{msg.profiles?.full_name}:</span>
                    <span>{msg.content}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 px-3 py-2 border rounded-md"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      sendChatMessage(e.currentTarget.value)
                      e.currentTarget.value = ''
                    }
                  }}
                />
                <Button size="icon" onClick={() => sendChatMessage('')}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
