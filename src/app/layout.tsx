import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Noto_Sans_Ethiopic } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Toaster } from '@/components/ui/toaster'
import { TRPCProvider } from '@/components/providers/trpc-provider'
import '@/lib/translations'
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration'
import { InstallBanner } from '@/components/pwa/InstallBanner'
import { UpdateBanner } from '@/components/pwa/UpdateBanner'
import { SyncManager } from '@/components/pwa/sync-manager'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { MobileDrawer } from '@/components/layout/mobile-drawer'
import './globals.css'

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: false,
})

const notoSansEthiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-ethiopic',
  weight: ['400', '700'],
  display: 'swap',
  preload: false,
})

export const metadata: Metadata = {
  title: {
    default: 'Kingdom Citizens',
    template: '%s | Kingdom Citizens',
  },
  description: 'Grow in faith through sermons, learning paths, and community engagement',
  keywords: ['church', 'sermons', 'bible study', 'learning', 'faith', 'christian'],
  authors: [{ name: 'Kingdom Citizens' }],
  creator: 'Kingdom Citizens',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icons/icon-512x512.jpg' },
    ],
    apple: '/icons/icon-512x512.jpg',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://kingdom-learning.vercel.app',
    title: 'Kingdom Citizens',
    description: 'Grow in faith through sermons, learning paths, and community engagement',
    siteName: 'Kingdom Citizens',
  },
  other: {
    'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f5f0e8' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1612' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${notoSansEthiopic.variable}`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://img.youtube.com" />
        <link rel="preconnect" href="https://i.ytimg.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-512x512.jpg" />
        <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.jpg" />
        <link
          rel="apple-touch-startup-image"
          href="/kingdom_citizens_splash_iphone.svg"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Kingdom Citizens" />
      </head>
      <body className="font-sans antialiased bg-background pb-16 md:pb-0" suppressHydrationWarning>
        <TRPCProvider>
          <ServiceWorkerRegistration />
          <UpdateBanner />
          <SyncManager />
          {children}
          <InstallBanner />
          <MobileDrawer />
          <MobileBottomNav />
          <Toaster />
        </TRPCProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
