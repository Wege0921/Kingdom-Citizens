import { vi } from 'vitest'

export const mockStore = {
  language: 'en',
  setLanguage: vi.fn(),
  user: null,
  setUser: vi.fn(),
  sidebarOpen: true,
  setSidebarOpen: vi.fn(),
  toggleSidebar: vi.fn(),
  adminTab: 'sermons',
  setAdminTab: vi.fn(),
}

vi.mock('@/lib/store', () => ({
  useAppStore: (selector?: (state: typeof mockStore) => unknown) => {
    if (selector) return selector(mockStore)
    return mockStore
  },
}))
