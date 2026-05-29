'use client'

import { WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@/hooks/use-network-status'
import { cn } from '@/lib/utils'

interface OfflineBadgeProps {
  className?: string
}

export function OfflineBadge({ className }: OfflineBadgeProps) {
  const { isOnline } = useNetworkStatus()

  if (isOnline) return null

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground',
        className
      )}
    >
      <WifiOff className="h-3 w-3" />
      <span>Offline</span>
    </div>
  )
}
