import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { TRPCProvider } from './trpc-provider'

describe('TRPCProvider', () => {
  it('renders children', () => {
    render(
      <TRPCProvider>
        <div data-testid="child">Hello</div>
      </TRPCProvider>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })
})
