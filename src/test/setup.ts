import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock ResizeObserver for Radix UI
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.ResizeObserver = ResizeObserverMock

// Mock IntersectionObserver for lazy-loaded components
class IntersectionObserverMock {
  root = null
  rootMargin = ''
  thresholds = []
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return [] }
}
global.IntersectionObserver = IntersectionObserverMock as any

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    refresh: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}))

// Mock next/head
vi.mock('next/head', () => ({
  default: ({ children }: { children: React.ReactNode }) => children || null,
}))

// Suppress console errors for expected test failures
const originalError = console.error
console.error = (...args: unknown[]) => {
  const message = args[0] as string
  if (
    typeof message === 'string' &&
    /Warning: ReactDOM.render is no longer supported/.test(message)
  ) {
    return
  }
  originalError.apply(console, args)
}
