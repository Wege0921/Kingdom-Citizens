'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return

    // In development, actively unregister any leftover SW and clear caches
    // so the phone always sees fresh code (no stale cached bundles).
    if (process.env.NODE_ENV !== 'production') {
      navigator.serviceWorker.getRegistrations().then((regs) => {
        regs.forEach((r) => r.unregister())
      })
      if ('caches' in window) {
        caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
      }
      return
    }

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        console.log('SW registered:', registration.scope)

        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60 * 60 * 1000) // Every hour

        // Request periodic background sync for sermon prefetch
        if ('periodicSync' in registration) {
          ;(registration as any).periodicSync
            .register('latest-sermon', { minInterval: 24 * 60 * 60 * 1000 })
            .then(() => console.log('Periodic sync registered'))
            .catch((err: Error) => console.log('Periodic sync not granted:', err))
        }
      })
      .catch((error) => {
        console.error('SW registration failed:', error)
      })
  }, [])

  return null
}
