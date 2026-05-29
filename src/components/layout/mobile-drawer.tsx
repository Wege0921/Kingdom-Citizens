'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  X,
  BookOpen,
  Home,
  GraduationCap,
  Radio,
  Users,
  HelpCircle,
  Bookmark,
  Settings,
  LogOut,
  LayoutDashboard,
  Globe,
  User as UserIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { createClient } from '@/lib/supabase/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { OfflineBadge } from '@/components/pwa/offline-badge'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'

const navItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/sermons', label: 'Sermons', icon: BookOpen },
  { href: '/learn', label: 'Learn', icon: GraduationCap },
  { href: '/radio', label: 'Radio', icon: Radio },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/about', label: 'About', icon: HelpCircle },
]

function getInitials(name: string | null | undefined) {
  if (!name) return 'U'
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function MobileDrawer() {
  const { mobileMenuOpen, setMobileMenuOpen, language, setLanguage } = useAppStore()
  const { t } = useTranslation()
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
      if (data.user) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .maybeSingle()
          .then(({ data: p }) => setProfile(p))
      }
    })
  }, [])

  const close = () => setMobileMenuOpen(false)

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    close()
    router.push('/')
    router.refresh()
  }

  const isStaff = profile?.role === 'ADMIN' || profile?.role === 'LEADER'

  if (!mobileMenuOpen) return null

  return (
    <div className="md:hidden">
      {/* Backdrop */}
      <div
        style={{ position: 'fixed', inset: 0, zIndex: 99998, backgroundColor: 'rgba(0,0,0,0.5)' }}
        onClick={close}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '50%',
          maxWidth: '280px',
          zIndex: 99999,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
        }}
        className="bg-background border-l shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <Link href="/" className="flex items-center gap-2 text-primary" onClick={close}>
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-lg">{t('app.brandName')}</span>
          </Link>
          <button
            type="button"
            onClick={close}
            className="inline-flex items-center justify-center h-9 w-9 rounded-md hover:bg-muted"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">Menu</p>
          {navItems.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={close}
                className={cn(
                  'flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Account */}
        {user ? (
          <div className="flex flex-col gap-1 p-4 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">Account</p>
            <div className="flex items-center gap-3 px-3 py-2">
              <Avatar className="h-9 w-9">
                <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? ''} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {getInitials(profile?.full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-medium truncate">{profile?.full_name || 'User'}</span>
                <span className="text-xs text-muted-foreground truncate">{user.email}</span>
              </div>
            </div>
            {isStaff && (
              <Link href="/admin" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
                <LayoutDashboard className="h-5 w-5" />
                {t('nav.admin')}
              </Link>
            )}
            <Link href="/my/bookmarks" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Bookmark className="h-5 w-5" />
              {t('nav.bookmarks')}
            </Link>
            <Link href="/my/progress" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <GraduationCap className="h-5 w-5" />
              {t('nav.progress')}
            </Link>
            <Link href="/my/settings" onClick={close} className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <Settings className="h-5 w-5" />
              {t('nav.settings')}
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors text-left w-full"
            >
              <LogOut className="h-5 w-5" />
              {t('nav.signOut')}
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-2 p-4 border-t">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">Account</p>
            <Button variant="outline" asChild className="w-full justify-start" onClick={close}>
              <Link href="/auth/login">
                <UserIcon className="mr-2 h-4 w-4" />
                {t('nav.signIn')}
              </Link>
            </Button>
            <Button asChild className="w-full justify-start" onClick={close}>
              <Link href="/auth/sign-up">
                <UserIcon className="mr-2 h-4 w-4" />
                {t('nav.signUp')}
              </Link>
            </Button>
          </div>
        )}

        {/* Settings */}
        <div className="flex flex-col gap-1 p-4 border-t">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1">Settings</p>
          <button
            type="button"
            onClick={() => { setLanguage(language === 'en' ? 'am' : 'en'); close() }}
            className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left w-full"
          >
            <Globe className="h-5 w-5" />
            {language === 'en' ? 'Switch to Amharic' : 'Switch to English'}
          </button>
          <div className="flex items-center gap-3 px-3 py-2">
            <OfflineBadge />
          </div>
        </div>
      </div>
    </div>
  )
}
