import { describe, it, expect, vi, beforeEach } from 'vitest'

const { mockSend } = vi.hoisted(() => ({ mockSend: vi.fn() }))

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: mockSend }
  },
}))

describe('Resend email service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('can send verification email', async () => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

    const { sendVerificationEmail } = await import('./resend')
    expect(sendVerificationEmail).toBeDefined()

    mockSend.mockResolvedValue({ id: 'email-1' })
    await sendVerificationEmail('test@example.com', 'token-123')
    expect(mockSend).toHaveBeenCalled()
    const call = mockSend.mock.calls[0][0]
    expect(call.to).toBe('test@example.com')
    expect(call.subject).toContain('Verify')
  })

  it('can send password reset email', async () => {
    process.env.RESEND_API_KEY = 'test-key'
    process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

    const { sendPasswordResetEmail } = await import('./resend')
    expect(sendPasswordResetEmail).toBeDefined()

    mockSend.mockResolvedValue({ id: 'email-2' })
    await sendPasswordResetEmail('test@example.com', 'token-456')
    expect(mockSend).toHaveBeenCalled()
    const call = mockSend.mock.calls[0][0]
    expect(call.to).toBe('test@example.com')
    expect(call.subject).toContain('Reset')
  })
})
