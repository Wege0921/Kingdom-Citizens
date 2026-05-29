import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT || process.env.NODE_ENV,
  tracesSampleRate: 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  beforeSend(event) {
    // Filter out certain errors if needed
    if (event.exception) {
      const error = event.exception.values?.[0]
      // Ignore client-side errors that are not critical
      if (error?.type === 'ChunkLoadError') {
        return null
      }
    }
    return event
  },
})

export function captureException(error: Error, context?: Record<string, unknown>) {
  Sentry.captureException(error, { extra: context })
}

export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, { level })
}
