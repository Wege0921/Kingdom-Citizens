// Custom Next.js server with Socket.io for live radio module
require('dotenv').config()
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')
const { createClient } = require('@supabase/supabase-js')
const ws = require('ws')

const dev = process.env.NODE_ENV !== 'production'
const hostname = 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    realtime: { transport: ws },
  }
)

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason);
});

console.log('Starting server setup...');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'set' : 'NOT SET');

app.prepare().then(() => {
  console.log('Next.js app prepared, creating HTTP server...');
  console.log('.next exists:', require('fs').existsSync('.next'));
  const httpServer = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error handling request:', err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })

  // Initialize Socket.IO
  const io = new Server(httpServer, {
    path: '/api/socket',
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || `http://${hostname}:${port}`,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  })

  const sessionListeners = new Map() // sessionId -> Set<userId>
  const userSockets = new Map() // userId -> socketId
  const sessionHosts = new Map() // sessionId -> hostUserId

  io.on('connection', (socket) => {
    console.log('[Socket] Connected:', socket.id)

    // Join radio session
    socket.on('radio:join', async (data) => {
      const { sessionId, userId, role } = data

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
      socket.data = { sessionId, userId, role }
      userSockets.set(userId, socket.id)

      if (!sessionListeners.has(sessionId)) {
        sessionListeners.set(sessionId, new Set())
      }
      sessionListeners.get(sessionId).add(userId)

      if (role === 'host') {
        sessionHosts.set(sessionId, userId)
      }

      const listenerCount = sessionListeners.get(sessionId).size
      await supabase
        .from('radio_sessions')
        .update({
          listener_count: listenerCount,
          peak_listeners: Math.max(session.peak_listeners || 0, listenerCount),
        })
        .eq('id', sessionId)

      socket.to(`session:${sessionId}`).emit('radio:listener-joined', {
        userId,
        listenerCount,
      })

      socket.emit('radio:joined', {
        sessionId,
        listenerCount,
        status: session.status,
        hostUserId: sessionHosts.get(sessionId),
      })

      // Notify host that a new listener joined (so host can send WebRTC offer)
      if (role === 'listener' && sessionHosts.has(sessionId)) {
        const hostSocketId = userSockets.get(sessionHosts.get(sessionId))
        if (hostSocketId) {
          io.to(hostSocketId).emit('radio:new-listener', { listenerUserId: userId })
        }
      }
    })

    // Leave radio session
    socket.on('radio:leave', async (data) => {
      const { sessionId, userId } = data
      socket.leave(`session:${sessionId}`)

      if (sessionListeners.has(sessionId)) {
        sessionListeners.get(sessionId).delete(userId)
        const listenerCount = sessionListeners.get(sessionId).size

        await supabase
          .from('radio_sessions')
          .update({ listener_count: listenerCount })
          .eq('id', sessionId)

        socket.to(`session:${sessionId}`).emit('radio:listener-left', {
          userId,
          listenerCount,
        })
      }

      userSockets.delete(userId)
    })

    // WebRTC signaling - relay to specific user
    socket.on('webrtc:offer', (data) => {
      const { targetUserId, signal, fromUserId, sessionId } = data
      const targetSocketId = userSockets.get(targetUserId)
      if (targetSocketId) {
        io.to(targetSocketId).emit('webrtc:offer', { signal, fromUserId, sessionId })
      }
    })

    socket.on('webrtc:answer', (data) => {
      const { targetUserId, signal, fromUserId, sessionId } = data
      const targetSocketId = userSockets.get(targetUserId)
      if (targetSocketId) {
        io.to(targetSocketId).emit('webrtc:answer', { signal, fromUserId, sessionId })
      }
    })

    socket.on('webrtc:ice-candidate', (data) => {
      const { targetUserId, candidate, fromUserId, sessionId } = data
      const targetSocketId = userSockets.get(targetUserId)
      if (targetSocketId) {
        io.to(targetSocketId).emit('webrtc:ice-candidate', { candidate, fromUserId, sessionId })
      }
    })

    // Live chat
    socket.on('chat:send', async (data) => {
      const { sessionId, userId, content } = data
      const { data: message } = await supabase
        .from('radio_chat_messages')
        .insert({ session_id: sessionId, user_id: userId, content })
        .select('*, profiles(full_name, avatar_url)')
        .single()

      io.to(`session:${sessionId}`).emit('chat:message', message)
    })

    // Emoji reactions
    socket.on('reaction:send', async (data) => {
      const { sessionId, userId, emoji } = data
      await supabase.from('radio_reactions').insert({
        session_id: sessionId,
        user_id: userId,
        emoji,
      })

      io.to(`session:${sessionId}`).emit('reaction:received', { userId, emoji })
    })

    // Song requests
    socket.on('request:send', async (data) => {
      const { sessionId, userId, artist, title } = data
      const { data: request } = await supabase
        .from('radio_song_requests')
        .insert({ session_id: sessionId, user_id: userId, artist, title })
        .select('*, profiles(full_name)')
        .single()

      io.to(`session:${sessionId}`).emit('request:received', request)
    })

    // Disconnect
    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected:', socket.id)
      const data = socket.data
      if (data && data.sessionId && data.userId) {
        if (sessionListeners.has(data.sessionId)) {
          sessionListeners.get(data.sessionId).delete(data.userId)
          const listenerCount = sessionListeners.get(data.sessionId).size

          supabase
            .from('radio_sessions')
            .update({ listener_count: listenerCount })
            .eq('id', data.sessionId)
            .then(() => {})

          socket.to(`session:${data.sessionId}`).emit('radio:listener-left', {
            userId: data.userId,
            listenerCount,
          })
        }
        userSockets.delete(data.userId)
        if (sessionHosts.get(data.sessionId) === data.userId) {
          sessionHosts.delete(data.sessionId)
        }
      }
    })
  })

  httpServer
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
      console.log(`> Socket.IO running on /api/socket`)
    })
}).catch((err) => {
  console.error('FAILED to prepare Next.js app:', err);
  console.error('Stack:', err.stack);
  process.exit(1);
});
