import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'

/**
 * Public layout shell. Intentionally does NOT read auth on the server so that
 * pages wrapping their content in this shell can be statically generated /
 * ISR-cached. The Header resolves the current user on the client.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
