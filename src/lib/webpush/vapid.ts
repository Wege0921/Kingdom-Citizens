// @ts-ignore - web-push types not available
import webpush from 'web-push'

// VAPID keys should be generated once and stored in environment variables
// Run: npx web-push generate-vapid-keys
export const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '',
  privateKey: process.env.VAPID_PRIVATE_KEY || '',
  subject: process.env.VAPID_EMAIL || 'mailto:admin@kingdomcitizens.com',
}

export function validateVapidKeys() {
  if (!vapidKeys.publicKey || !vapidKeys.privateKey) {
    throw new Error('VAPID keys are not configured. Run: npx web-push generate-vapid-keys')
  }
}

export function configureWebPush() {
  validateVapidKeys()
  webpush.setVapidDetails(
    vapidKeys.subject,
    vapidKeys.publicKey,
    vapidKeys.privateKey
  )
}

export function generateVapidKeys() {
  const keys = webpush.generateVAPIDKeys()
  console.log('VAPID Keys generated. Add these to your .env file:')
  console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${keys.publicKey}`)
  console.log(`VAPID_PRIVATE_KEY=${keys.privateKey}`)
  return keys
}
