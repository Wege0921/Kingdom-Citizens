import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CertificateClient } from './certificate-client'

vi.mock('@/lib/i18n', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}))

describe('CertificateClient', () => {
  it('renders null when not complete', () => {
    const { container } = render(
      <CertificateClient
        pathTitle="Foundations"
        userName="John"
        completionDate="2024-06-01"
        isComplete={false}
      />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders view certificate button when complete', () => {
    render(
      <CertificateClient
        pathTitle="Foundations"
        userName="John"
        completionDate="2024-06-01"
        isComplete={true}
      />
    )
    expect(screen.getByRole('button', { name: /view certificate/i })).toBeInTheDocument()
  })

  it('opens certificate modal on click', () => {
    render(
      <CertificateClient
        pathTitle="Foundations"
        userName="John"
        completionDate="2024-06-01"
        isComplete={true}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /view certificate/i }))
    expect(screen.getByText('Foundations')).toBeInTheDocument()
    expect(screen.getByText('John')).toBeInTheDocument()
  })
})
