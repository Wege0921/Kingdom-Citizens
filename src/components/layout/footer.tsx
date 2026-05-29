'use client'

import Link from 'next/link'
import { BookOpen } from 'lucide-react'
import { useTranslation } from '@/lib/i18n'

export function Footer() {
  const { t } = useTranslation()
  return (
    <footer className="border-t bg-muted/30">
      <div className="container px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-3 md:grid-cols-4 gap-6 md:gap-8">
          <div className="space-y-4 col-span-3 md:col-span-1 order-last md:order-first">
            <Link href="/" className="flex items-center gap-2 text-primary">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-lg">{t('app.brandName')}</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          <div className="order-1 md:order-none">
            <h3 className="font-semibold mb-4">{t('footer.resources')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/sermons" className="hover:text-primary transition-colors">
                  {t('nav.sermons')}
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-primary transition-colors">
                  {t('nav.learn')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary transition-colors">
                  {t('nav.about')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="order-2 md:order-none">
            <h3 className="font-semibold mb-4">{t('footer.account')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/my/bookmarks" className="hover:text-primary transition-colors">
                  {t('nav.bookmarks')}
                </Link>
              </li>
              <li>
                <Link href="/my/progress" className="hover:text-primary transition-colors">
                  {t('nav.progress')}
                </Link>
              </li>
              <li>
                <Link href="/my/settings" className="hover:text-primary transition-colors">
                  {t('nav.settings')}
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="order-3 md:order-none">
            <h3 className="font-semibold mb-4">{t('footer.connect')}</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.facebook')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.instagram')}
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-primary transition-colors">
                  {t('footer.telegram')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t mt-4 pt-3 text-center text-xs text-muted-foreground leading-none">
          <p>&copy; {new Date().getFullYear()} {t('app.brandName')}. {t('footer.rights')}</p>
        </div>
        </div>
      </div>
    </footer>
  )
}
