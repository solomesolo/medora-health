import { NextRequest, NextResponse } from 'next/server'

// Only initialize Resend if API key is available
let resend: any = null
if (process.env.RESEND_API_KEY) {
  try {
    const { Resend } = require('resend')
    resend = new Resend(process.env.RESEND_API_KEY)
  } catch (error) {
    console.warn('Resend package not available:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, company, role, email, 'adoption-breaks': message } = body

    // Validate required fields
    if (!name || !company || !role || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Format email content
    const emailSubject = `Contact Form Submission from ${name} at ${company}`
    const emailBody = `
New contact form submission:

Name: ${name}
Company: ${company}
Role: ${role}
Email: ${email}

Message:
${message}

---
This message was sent from the Medora website contact form.
    `.trim()

    // Send email using Resend
    try {
      if (!process.env.RESEND_API_KEY || !resend) {
        console.warn('RESEND_API_KEY is not set - email will be logged only')
        // Log the email for development/debugging
        console.log('='.repeat(50))
        console.log('CONTACT FORM SUBMISSION (Email not sent - API key missing)')
        console.log('='.repeat(50))
        console.log('To: anna.solovyova@medora.agency')
        console.log('Subject:', emailSubject)
        console.log('From:', email)
        console.log('---')
        console.log(emailBody)
        console.log('='.repeat(50))
        console.log('\nTo enable email sending:')
        console.log('1. Sign up at https://resend.com')
        console.log('2. Get API key from https://resend.com/api-keys')
        console.log('3. Add RESEND_API_KEY to .env file')
        console.log('4. Restart server\n')
      } else {
        const { data, error } = await resend.emails.send({
          from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
          to: 'anna.solovyova@medora.agency',
          subject: emailSubject,
          text: emailBody,
          replyTo: email,
        })

        if (error) {
          console.error('Resend error:', error)
          // Log the email as fallback
          console.log('Email failed to send, but here is the data:')
          console.log('To: anna.solovyova@medora.agency')
          console.log('Subject:', emailSubject)
          console.log('Body:', emailBody)
        } else {
          console.log('✅ Email sent successfully:', data?.id)
        }
      }
    } catch (emailError: any) {
      console.error('Email sending error:', emailError)
      // Log the email data as fallback
      console.log('Email data (for manual sending):')
      console.log('To: anna.solovyova@medora.agency')
      console.log('Subject:', emailSubject)
      console.log('From:', email)
      console.log('Message:', message)
    }

    return NextResponse.json(
      { success: true, message: 'Form submitted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process form submission' },
      { status: 500 }
    )
  }
}

