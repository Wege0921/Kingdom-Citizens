import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CertificateModal } from './certificate-modal'

describe('CertificateModal', () => {
  it('renders when open', () => {
    render(
      <CertificateModal
        open={true}
        onOpenChange={vi.fn()}
        pathTitle="New Believers Course"
        userName="John Doe"
        completionDate="2024-06-01"
      />
    )
    expect(screen.getByText('New Believers Course')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })

  it('does not render content when closed', () => {
    render(
      <CertificateModal
        open={false}
        onOpenChange={vi.fn()}
        pathTitle="New Believers Course"
        userName="John Doe"
        completionDate="2024-06-01"
      />
    )
    expect(screen.queryByText('New Believers Course')).not.toBeInTheDocument()
  })

  it('shows completion date', () => {
    render(
      <CertificateModal
        open={true}
        onOpenChange={vi.fn()}
        pathTitle="Test Path"
        userName="Jane"
        completionDate="2024-06-01"
      />
    )
    expect(screen.getByText(/Completed on/)).toBeInTheDocument()
  })

  it('has download button', () => {
    render(
      <CertificateModal
        open={true}
        onOpenChange={vi.fn()}
        pathTitle="Test Path"
        userName="Jane"
        completionDate="2024-06-01"
      />
    )
    expect(screen.getByText('Download')).toBeInTheDocument()
  })
})
