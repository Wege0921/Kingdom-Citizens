import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AdminStatTrends } from './stat-trends'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

describe('AdminStatTrends', () => {
  const sermonViews = [{ date: '2024-01-01', views: 10 }]
  const newUsers = [{ date: '2024-01-01', users: 2 }]
  const sermonPublishes = [{ date: '2024-01-01', count: 1 }]

  it('renders chart titles', () => {
    render(
      <AdminStatTrends
        sermonViews={sermonViews}
        newUsers={newUsers}
        sermonPublishes={sermonPublishes}
      />
    )
    expect(screen.getByText('admin.sermonViews')).toBeInTheDocument()
    expect(screen.getByText('admin.newUsersShort')).toBeInTheDocument()
  })
})
