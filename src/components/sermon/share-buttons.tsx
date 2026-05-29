'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Check, Copy, Link, MessageCircle, Printer, Send, Share2 } from 'lucide-react'

interface ShareButtonsProps {
  url: string
  title: string
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  showPrint?: boolean
}

export function ShareButtons({ url, title, variant = 'outline', size = 'sm', showPrint = true }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  const shareTitle = encodeURIComponent(title)
  const shareUrl = encodeURIComponent(url)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast({ title: 'Link copied', description: 'The link has been copied to your clipboard.' })
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast({ title: 'Failed to copy', variant: 'destructive' })
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
        // User cancelled or error
      }
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {/* WhatsApp */}
      <Button
        variant={variant}
        size={size}
        asChild
        className="bg-[#25D366] text-white hover:bg-[#1DA851] border-[#25D366]"
      >
        <a
          href={`https://wa.me/?text=${shareTitle}%20${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
        >
          <MessageCircle className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">WhatsApp</span>
        </a>
      </Button>

      {/* Telegram */}
      <Button
        variant={variant}
        size={size}
        asChild
        className="bg-[#26A5E4] text-white hover:bg-[#1D8BC5] border-[#26A5E4]"
      >
        <a
          href={`https://t.me/share/url?url=${shareUrl}&text=${shareTitle}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Telegram"
        >
          <Send className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Telegram</span>
        </a>
      </Button>

      {/* Facebook */}
      <Button
        variant={variant}
        size={size}
        asChild
        className="bg-[#1877F2] text-white hover:bg-[#1460C2] border-[#1877F2]"
      >
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on Facebook"
        >
          <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          <span className="hidden sm:inline">Facebook</span>
        </a>
      </Button>

      {/* More Options Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={variant} size={size}>
            <Share2 className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">More</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-600" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            Copy link
          </DropdownMenuItem>
          {typeof navigator.share === 'function' && (
            <DropdownMenuItem onClick={handleNativeShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Share...
            </DropdownMenuItem>
          )}
          {showPrint && (
            <DropdownMenuItem onClick={handlePrint}>
              <Printer className="mr-2 h-4 w-4" />
              Print
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
