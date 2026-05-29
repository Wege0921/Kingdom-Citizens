import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendVerificationEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const verifyUrl = `${baseUrl}/auth/verify?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Verify your email - Kingdom Citizens',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Verify your email</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8B6914; margin: 0;">Kingdom Citizens</h1>
              </div>
              <h2 style="color: #333;">Verify your email address</h2>
              <p>Thank you for signing up for Kingdom Citizens! Please verify your email address to complete your registration.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #8B6914; color: white; text-decoration: none; border-radius: 4px;">Verify Email</a>
              </div>
              <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
              <p style="font-size: 12px; color: #666; word-break: break-all;">${verifyUrl}</p>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 24 hours.</p>
              <p style="font-size: 14px; color: #666;">If you didn't create an account, you can safely ignore this email.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send verification email:', error)
    throw error
  }
}

export async function sendPasswordResetEmail(email: string, token: string) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Reset your password - Kingdom Citizens',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset your password</title>
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #8B6914; margin: 0;">Kingdom Citizens</h1>
              </div>
              <h2 style="color: #333;">Reset your password</h2>
              <p>We received a request to reset your password. Click the button below to create a new password.</p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #8B6914; color: white; text-decoration: none; border-radius: 4px;">Reset Password</a>
              </div>
              <p style="font-size: 14px; color: #666;">Or copy and paste this link into your browser:</p>
              <p style="font-size: 12px; color: #666; word-break: break-all;">${resetUrl}</p>
              <p style="font-size: 14px; color: #666; margin-top: 30px;">This link will expire in 1 hour.</p>
              <p style="font-size: 14px; color: #666;">If you didn't request a password reset, you can safely ignore this email.</p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      throw error
    }

    return data
  } catch (error) {
    console.error('Failed to send password reset email:', error)
    throw error
  }
}
