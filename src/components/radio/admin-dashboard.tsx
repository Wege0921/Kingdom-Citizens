'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mic, MicOff, Radio, Users, MessageSquare, Heart, Flame, Music, Send, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { connectSocket } from '@/lib/socket/client'
import { useTranslation } from '@/lib/i18n'
import { HostPeerManager } from '@/lib/webrtc/peer-manager'

export function AdminRadioDashboard() {
  const { t } = useTranslation()
  const supabase = createClient()
  const socket = connectSocket()

  const [isLive, setIsLive] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [listenerCount, setListenerCount] = useState(0)
  const [peakListeners, setPeakListeners] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState<any[]>([])
  const [reactions, setReactions] = useState<{ [key: string]: number }>({})
  const [songRequests, setSongRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const localStreamRef = useRef<MediaStream | null>(null)
  const peerManagerRef = useRef<HostPeerManager | null>(null)
  const currentUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Check for active session
    checkActiveSession()

    // Socket event listeners
    socket.on('radio:listener-joined', (data) => {
      setListenerCount(data.listenerCount)
    })

    socket.on('radio:listener-left', (data) => {
      setListenerCount(data.listenerCount)
    })

    socket.on('chat:message', (message) => {
      setChatMessages((prev) => [...prev, message])
    })

    socket.on('reaction:received', (data) => {
      setReactions((prev) => ({
        ...prev,
        [data.emoji]: (prev[data.emoji] || 0) + 1,
      }))
    })

    socket.on('request:received', (request) => {
      setSongRequests((prev) => [...prev, request])
    })

    // WebRTC: new listener joined - send them an offer
    socket.on('radio:new-listener', async ({ listenerUserId }) => {
      if (peerManagerRef.current) {
        await peerManagerRef.current.addListener(listenerUserId)
      }
    })

    // WebRTC: receive answer from a listener
    socket.on('webrtc:answer', async ({ signal, fromUserId, targetUserId }) => {
      // Ignore answers not meant for this host
      if (targetUserId && targetUserId !== currentUserIdRef.current) return
      if (peerManagerRef.current) {
        await peerManagerRef.current.handleAnswer(fromUserId, signal)
      }
    })

    // WebRTC: receive ICE candidate from listener
    socket.on('webrtc:ice-candidate', async ({ candidate, fromUserId, targetUserId }) => {
      // Ignore ICE candidates not meant for this host
      if (targetUserId && targetUserId !== currentUserIdRef.current) return
      if (peerManagerRef.current) {
        await peerManagerRef.current.handleIceCandidate(fromUserId, candidate)
      }
    })

    return () => {
      socket.off('radio:listener-joined')
      socket.off('radio:listener-left')
      socket.off('chat:message')
      socket.off('reaction:received')
      socket.off('request:received')
      socket.off('radio:new-listener')
      socket.off('webrtc:answer')
      socket.off('webrtc:ice-candidate')
    }
  }, [])

  const checkActiveSession = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: session } = await supabase
      .from('radio_sessions')
      .select('*')
      .eq('host_id', user.id)
      .eq('status', 'live')
      .single()

    if (session) {
      setIsLive(true)
      setCurrentSessionId(session.id)
      setTitle(session.title_en)
      setDescription(session.description_en || '')
      setListenerCount(session.listener_count || 0)
      setPeakListeners(session.peak_listeners || 0)

      // Join the session
      socket.emit('radio:join', {
        sessionId: session.id,
        userId: user.id,
        role: 'host',
      })
    }
  }

  const startSession = async () => {
    setIsLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get microphone access
      let stream
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch (mediaError) {
        console.error('Microphone access error:', mediaError)
        alert('Microphone access is required to start a live session. Please allow microphone access in your browser settings and try again.')
        throw mediaError
      }
      localStreamRef.current = stream

      // Create session in database
      const { data: session } = await supabase
        .from('radio_sessions')
        .insert({
          title_en: title || 'Live Session',
          title_am: title || 'Live Session',
          description_en: description,
          status: 'live',
          host_id: user.id,
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (session) {
        setCurrentSessionId(session.id)
        setIsLive(true)
        currentUserIdRef.current = user.id

        // Initialize WebRTC peer manager (only if we have a real stream)
        if (stream) {
          peerManagerRef.current = new HostPeerManager(stream, {
            sendOffer: (targetUserId, signal) => {
              socket.emit('webrtc:offer', {
                sessionId: session.id,
                fromUserId: user.id,
                targetUserId,
                signal,
              })
            },
            sendAnswer: () => {},
            sendIceCandidate: (targetUserId, candidate) => {
              socket.emit('webrtc:ice-candidate', {
                sessionId: session.id,
                fromUserId: user.id,
                targetUserId,
                candidate,
              })
            },
          })
        }

        // Join as host
        socket.emit('radio:join', {
          sessionId: session.id,
          userId: user.id,
          role: 'host',
        })

        // Send push notification to subscribers
        try {
          await fetch('/api/push/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: '🔴 Live Now: ' + (title || 'Radio Session'),
              body: description || 'Join the live broadcast now!',
              url: '/radio',
            }),
          })
        } catch (err) {
          console.warn('Push notification failed (non-critical):', err)
        }
      }
    } catch (error) {
      console.error('Error starting session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const endSession = async () => {
    setIsLoading(true)
    try {
      if (currentSessionId) {
        await supabase
          .from('radio_sessions')
          .update({
            status: 'ended',
            ended_at: new Date().toISOString(),
          })
          .eq('id', currentSessionId)

        // Stop local stream
        if (localStreamRef.current) {
          localStreamRef.current.getTracks().forEach((track) => track.stop())
          localStreamRef.current = null
        }

        // Close peer connections
        if (peerManagerRef.current) {
          peerManagerRef.current.closeAll()
          peerManagerRef.current = null
        }

        // Notify socket
        if (currentUserIdRef.current) {
          socket.emit('radio:leave', {
            sessionId: currentSessionId,
            userId: currentUserIdRef.current,
          })
        }

        setIsLive(false)
        setCurrentSessionId(null)
        setListenerCount(0)
      }
    } catch (error) {
      console.error('Error ending session:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)
        if (peerManagerRef.current) {
          peerManagerRef.current.setMuted(!audioTrack.enabled)
        }
      }
    }
  }

  const sendChatMessage = (content: string) => {
    if (!currentSessionId) return
    socket.emit('chat:send', {
      sessionId: currentSessionId,
      userId: (supabase.auth.getUser() as any).data.user?.id,
      content,
    })
  }

  const reactionEmojis = ['👍', '❤️', '🔥', '🎵', '😂', '🙏']

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Radio className={isLive ? 'text-red-500 animate-pulse' : ''} />
            {isLive ? t('radio.liveNow') : t('radio.startBroadcast')}
          </CardTitle>
          <CardDescription>
            {isLive
              ? `${listenerCount} ${t('radio.listeners')} (Peak: ${peakListeners})`
              : t('radio.startDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isLive ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t('radio.sessionTitle')}</Label>
                <Input
                  id="title"
                  placeholder={t('radio.titlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t('radio.description')}</Label>
                <Textarea
                  id="description"
                  placeholder={t('radio.descriptionPlaceholder')}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
              <Button
                onClick={startSession}
                disabled={isLoading || !title}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('radio.starting')}
                  </>
                ) : (
                  <>
                    <Mic className="mr-2 h-4 w-4" />
                    {t('radio.goLive')}
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button
                  onClick={toggleMute}
                  variant={isMuted ? 'destructive' : 'outline'}
                  size="lg"
                  className="flex-1"
                >
                  {isMuted ? <MicOff className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
                  {isMuted ? t('radio.unmute') : t('radio.mute')}
                </Button>
                <Button
                  onClick={endSession}
                  variant="destructive"
                  size="lg"
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t('radio.ending')}
                    </>
                  ) : (
                    t('radio.endSession')
                  )}
                </Button>
              </div>

              {/* Reactions */}
              <div className="flex gap-2 justify-center">
                {reactionEmojis.map((emoji) => (
                  <Button
                    key={emoji}
                    variant="outline"
                    size="sm"
                    className="text-2xl"
                    onClick={() => {
                      if (currentSessionId) {
                        socket.emit('reaction:send', {
                          sessionId: currentSessionId,
                          userId: (supabase.auth.getUser() as any).data.user?.id,
                          emoji,
                        })
                      }
                    }}
                  >
                    {emoji}
                    {reactions[emoji] > 0 && (
                      <span className="ml-1 text-sm">{reactions[emoji]}</span>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Chat */}
      {isLive && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t('radio.liveChat')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-64 overflow-y-auto space-y-2 border rounded-md p-4">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className="flex gap-2">
                    <span className="font-semibold">{msg.profiles?.full_name}:</span>
                    <span>{msg.content}</span>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  placeholder={t('radio.typeMessage')}
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

      {/* Song Requests */}
      {isLive && songRequests.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Music className="h-5 w-5" />
              {t('radio.songRequests')} ({songRequests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {songRequests.map((req) => (
                <div key={req.id} className="flex justify-between items-center p-2 border rounded">
                  <div>
                    <span className="font-semibold">{req.artist}</span> - {req.title}
                    <span className="text-sm text-muted-foreground ml-2">
                      by {req.profiles?.full_name}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      {t('radio.approve')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t('radio.skip')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
