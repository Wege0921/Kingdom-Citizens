'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  BookOpen,
  Menu,
  LogOut,
  Settings,
  Bookmark,
  GraduationCap,
  LayoutDashboard,
  Globe,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { User } from '@supabase/supabase-js'
import type { Profile } from '@/lib/types'
import { useAppStore } from '@/lib/store'
import { useTranslation } from '@/lib/i18n'
import { OfflineBadge } from '@/components/pwa/offline-badge'
import { useCurrentUser } from '@/hooks/use-current-user'

interface HeaderProps {
  /** Optional. When omitted (e.g. on static/ISR pages), the header resolves
   *  the current user on the client. */
  user?: User | null
  profile?: Profile | null
}

export function Header({ user: userProp, profile: profileProp }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { language, setLanguage, setMobileMenuOpen } = useAppStore()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  // If the server didn't supply auth (static/ISR pages), resolve it client-side.
  const clientAuth = useCurrentUser()
  const user = userProp !== undefined ? userProp : clientAuth.user
  const profile = profileProp !== undefined ? profileProp : clientAuth.profile

  useEffect(() => {
    setMounted(true)
  }, [])

  const navLinks = [
    { href: '/sermons', label: t('nav.sermons') },
    { href: '/learn', label: t('nav.learn') },
    { href: '/radio', label: t('nav.radio') },
    { href: '/community', label: t('nav.community') },
    { href: '/about', label: t('nav.about') },
  ]

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const isStaff = profile?.role === 'ADMIN' || profile?.role === 'LEADER'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container px-4">
        <div className="max-w-6xl mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 text-primary">
            <BookOpen className="h-6 w-6" />
            <span className="font-bold text-lg">{t('app.brandName')}</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6" suppressHydrationWarning>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  pathname === link.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                suppressHydrationWarning
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'am' : 'en')}
            className="hidden sm:flex items-center gap-1"
          >
            <Globe className="h-4 w-4" />
            <span className="text-xs">{language === 'en' ? 'EN' : 'አማ'}</span>
          </Button>

          <OfflineBadge className="hidden sm:flex" />

          {/* Desktop: User dropdown or Sign-in buttons */}
          <div className="hidden sm:flex items-center gap-2">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.full_name ?? ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {getInitials(profile?.full_name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex flex-col space-y-1 p-2">
                    <p className="text-sm font-medium">{profile?.full_name || t('nav.user')}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  {isStaff && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer">
                          <LayoutDashboard className="mr-2 h-4 w-4" />
                          {t('nav.admin')}
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href="/my/bookmarks" className="cursor-pointer">
                      <Bookmark className="mr-2 h-4 w-4" />
                      {t('nav.bookmarks')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my/progress" className="cursor-pointer">
                      <GraduationCap className="mr-2 h-4 w-4" />
                      {t('nav.progress')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/my/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      {t('nav.settings')}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('nav.signOut')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/auth/login">{t('nav.signIn')}</Link>
                </Button>
                <Button asChild>
                  <Link href="/auth/sign-up">{t('nav.signUp')}</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger — opens the MobileDrawer rendered at root in layout.tsx */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="sm:hidden inline-flex items-center justify-center h-11 w-11 rounded-md hover:bg-muted active:bg-muted/80 transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5 pointer-events-none" />
          </button>
        </div>
      </div>
    </div>
    </header>
  )
}
