import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PushNotificationButton } from './PushNotificationButton'

describe('PushNotificationButton', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'Notification', {
      value: { permission: 'default' },
      writable: true,
      configurable: true,
    })
    Object.defineProperty(navigator, 'serviceWorker', {
      value: { ready: Promise.resolve({ pushManager: { getSubscription: () => Promise.resolve(null) } }) },
      writable: true,
      configurable: true,
    })
  })

  it('renders button', () => {
    render(<PushNotificationButton />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
