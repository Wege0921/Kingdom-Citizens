/* eslint-disable no-undef */
// Service worker push notification handlers with action buttons

// Handle push events (show notification)
self.addEventListener('push', function (event) {
  if (!event.data) return

  let data
  try {
    data = event.data.json()
  } catch {
    data = { title: 'Kingdom Citizens', body: event.data.text() }
  }

  const options = {
    body: data.body || '',
    icon: '/icons/icon-512x512.jpg',
    badge: '/icons/icon-512x512.jpg',
    data: { url: data.url || '/' },
    vibrate: [100, 50, 100],
    tag: data.tag || 'kingdom-notification',
    renotify: true,
    actions: [
      { action: 'open-sermon', title: 'Open Sermon' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  }

  event.waitUntil(
    self.registration.showNotification(data.title || 'Kingdom Citizens', options)
  )
})

// Handle notification click actions
self.addEventListener('notificationclick', function (event) {
  event.notification.close()

  const action = event.action
  const data = event.notification.data || {}

  if (action === 'dismiss') {
    return
  }

  const url = data.url || '/'
  event.waitUntil(
    clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        for (const client of windowClients) {
          if (client.url.includes(url) && 'focus' in client) {
            return client.focus()
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url)
        }
      })
  )
})

// Listen for skip waiting message from UpdateBanner
self.addEventListener('message', function (event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
})
