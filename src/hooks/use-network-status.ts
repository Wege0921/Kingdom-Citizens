'use client'

import { useState, useEffect, useCallback } from 'react'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true)
  const [effectiveType, setEffectiveType] = useState<string>('4g')

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Connection type detection
    const connection = (navigator as any).connection
    if (connection) {
      setEffectiveType(connection.effectiveType || '4g')
      const handleChange = () => setEffectiveType(connection.effectiveType || '4g')
      connection.addEventListener('change', handleChange)
      return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
        connection.removeEventListener('change', handleChange)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return { isOnline, effectiveType, isSlow: effectiveType === 'slow-2g' || effectiveType === '2g' }
}
