import { Server as HTTPServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface WebRTCSignalData {
  sessionId: string
  userId: string
  signal: any
  targetUserId?: string
}

interface RadioSessionData {
  sessionId: string
  userId: string
  role: 'host' | 'listener'
}

export function initializeSocketIO(httpServer: HTTPServer) {
  const io = new SocketIOServer(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  })

  // Store active peer connections for WebRTC
  const peerConnections = new Map<string, any>()
  const sessionListeners = new Map<string, Set<string>>()

  // Track socket.id -> userId and userId -> Set<socketId> for targeted messaging
  const socketToUser = new Map<string, string>()
  const userToSockets = new Map<string, Set<string>>()

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id)

    // Join radio session
    socket.on('radio:join', async (data: RadioSessionData) => {
      const { sessionId, userId, role } = data

      // Track this socket belongs to this user
      socketToUser.set(socket.id, userId)
      if (!userToSockets.has(userId)) {
        userToSockets.set(userId, new Set())
      }
      userToSockets.get(userId)!.add(socket.id)

      // Verify user has access to session
      const { data: session } = await supabase
        .from('radio_sessions')
        .select('*')
        .eq('id', sessionId)
        .single()

      if (!session) {
        socket.emit('error', { message: 'Session not found' })
        return
      }

      socket.join(`session:${sessionId}`)

      // Track listeners
      if (!sessionListeners.has(sessionId)) {
        sessionListeners.set(sessionId, new Set())
      }
      sessionListeners.get(sessionId)!.add(userId)

      // Update listener count
      const listenerCount = sessionListeners.get(sessionId)!.size
      await supabase
        .from('radio_sessions')
        .update({
          listener_count: listenerCount,
          peak_listeners: Math.max(session.peak_listeners || 0, listenerCount)
        })
        .eq('id', sessionId)

      // Notify others that a listener joined
      socket.to(`session:${sessionId}`).emit('radio:listener-joined', {
        userId,
        listenerCount,
      })

      // Notify host that a new listener arrived (so host sends WebRTC offer)
      if (role === 'listener') {
        socket.to(`session:${sessionId}`).emit('radio:new-listener', { listenerUserId: userId })
      }

      socket.emit('radio:joined', { sessionId, listenerCount, status: session.status, hostUserId: session.host_id })
    })

    // Leave radio session
    socket.on('radio:leave', async (data: { sessionId: string; userId: string }) => {
      const { sessionId, userId } = data

      socket.leave(`session:${sessionId}`)

      if (sessionListeners.has(sessionId)) {
        sessionListeners.get(sessionId)!.delete(userId)
        const listenerCount = sessionListeners.get(sessionId)!.size

        await supabase
          .from('radio_sessions')
          .update({ listener_count: listenerCount })
          .eq('id', sessionId)

        socket.to(`session:${sessionId}`).emit('radio:listener-left', {
          userId,
          listenerCount,
        })
      }
    })

    // WebRTC signaling - Host offer
    socket.on('webrtc:offer', async (data: WebRTCSignalData) => {
      const { sessionId, signal, targetUserId } = data
      socket.to(`session:${sessionId}`).emit('webrtc:offer', {
        signal,
        fromUserId: data.userId,
        targetUserId,
      })
    })

    // WebRTC signaling - Listener answer
    socket.on('webrtc:answer', async (data: WebRTCSignalData) => {
      const { sessionId, signal, targetUserId } = data
      socket.to(`session:${sessionId}`).emit('webrtc:answer', {
        signal,
        fromUserId: data.userId,
        targetUserId,
      })
    })

    // WebRTC ICE candidates
    socket.on('webrtc:ice-candidate', async (data: WebRTCSignalData) => {
      const { sessionId, signal, targetUserId } = data
      socket.to(`session:${sessionId}`).emit('webrtc:ice-candidate', {
        signal,
        fromUserId: data.userId,
        targetUserId,
      })
    })

    // Live chat
    socket.on('chat:send', async (data: { sessionId: string; userId: string; content: string }) => {
      const { sessionId, userId, content } = data

      // Save to database
      const { data: message } = await supabase
        .from('radio_chat_messages')
        .insert({
          session_id: sessionId,
          user_id: userId,
          content,
        })
        .select('*, profiles(full_name, avatar_url)')
        .single()

      // Broadcast to all in session
      io.to(`session:${sessionId}`).emit('chat:message', message)
    })

    // Emoji reactions
    socket.on('reaction:send', async (data: { sessionId: string; userId: string; emoji: string }) => {
      const { sessionId, userId, emoji } = data

      // Save to database
      await supabase.from('radio_reactions').insert({
        session_id: sessionId,
        user_id: userId,
        emoji,
      })

      // Broadcast to all in session
      io.to(`session:${sessionId}`).emit('reaction:received', {
        userId,
        emoji,
      })
    })

    // Song requests
    socket.on('request:send', async (data: { sessionId: string; userId: string; artist: string; title: string }) => {
      const { sessionId, userId, artist, title } = data

      const { data: request } = await supabase
        .from('radio_song_requests')
        .insert({
          session_id: sessionId,
          user_id: userId,
          artist,
          title,
        })
        .select('*, profiles(full_name)')
        .single()

      // Notify host
      io.to(`session:${sessionId}`).emit('request:received', request)
    })

    // Poll creation (admin only)
    socket.on('poll:create', async (data: { sessionId: string; questionEn: string; questionAm?: string; options: string[] }) => {
      const { sessionId, questionEn, questionAm, options } = data

      const { data: poll } = await supabase
        .from('radio_polls')
        .insert({
          session_id: sessionId,
          question_en: questionEn,
          question_am: questionAm,
          options: options.map((opt, i) => ({ id: i, text: opt, votes: 0 })),
        })
        .select()
        .single()

      io.to(`session:${sessionId}`).emit('poll:created', poll)
    })

    // Poll voting
    socket.on('poll:vote', async (data: { sessionId: string; pollId: string; optionId: number }) => {
      const { sessionId, pollId, optionId } = data

      // Update poll votes (simplified - in production use a separate votes table)
      const { data: poll } = await supabase
        .from('radio_polls')
        .select('options')
        .eq('id', pollId)
        .single()

      if (poll) {
        const options = poll.options as any[]
        options[optionId].votes += 1

        await supabase
          .from('radio_polls')
          .update({ options })
          .eq('id', pollId)

        io.to(`session:${sessionId}`).emit('poll:updated', { pollId, options })
      }
    })

    // Disconnect
    socket.on('disconnect', async () => {
      console.log('Socket disconnected:', socket.id)

      // Clean up socket → user mapping
      const userId = socketToUser.get(socket.id)
      if (userId) {
        socketToUser.delete(socket.id)
        const sockets = userToSockets.get(userId)
        if (sockets) {
          sockets.delete(socket.id)
          // Only clean up session listeners if this was the user's last socket
          if (sockets.size === 0) {
            userToSockets.delete(userId)
            // Clean up from all session listener sets
            for (const [sessionId, listeners] of sessionListeners.entries()) {
              if (listeners.has(userId)) {
                listeners.delete(userId)
                const listenerCount = listeners.size
                try {
                  await supabase
                    .from('radio_sessions')
                    .update({ listener_count: listenerCount })
                    .eq('id', sessionId)
                  io.to(`session:${sessionId}`).emit('radio:listener-left', {
                    userId,
                    listenerCount,
                  })
                } catch (err) {
                  console.error('Error updating listener count on disconnect:', err)
                }
                if (listeners.size === 0) {
                  sessionListeners.delete(sessionId)
                }
              }
            }
          }
        }
      }
    })
  })

  return io
}
