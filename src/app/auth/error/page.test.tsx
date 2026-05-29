import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import AuthErrorPage from './page'

describe('AuthErrorPage', () => {
  it('renders error title', () => {
    render(<AuthErrorPage />)
    expect(screen.getByText('Authentication Error')).toBeInTheDocument()
  })

  it('has back to login link', () => {
    render(<AuthErrorPage />)
    expect(screen.getByRole('link', { name: /back to login/i })).toBeInTheDocument()
  })

  it('has go home link', () => {
    render(<AuthErrorPage />)
    expect(screen.getByRole('link', { name: /go home/i })).toBeInTheDocument()
  })
})
