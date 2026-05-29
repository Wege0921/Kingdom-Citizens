import { NextRequest } from 'next/server'
import { initializeSocketIO } from '@/lib/socket/server'

// Store the Socket.IO server instance
let io: any = null

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // This is just a health check endpoint
  return new Response('Socket.IO server is running', { status: 200 })
}

// The actual Socket.IO server is initialized in a separate custom server file
// or we can use the Next.js API route with a custom server approach
// For now, this is a placeholder - we'll need to create a custom server file
