import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, company, role, email, 'adoption-breaks': message } = body

    // Validate required fields
    if (!name || !company || !role || !email || !message) {
      console.error('❌ Missing required fields:', { name: !!name, company: !!company, role: !!role, email: !!email, message: !!message })
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Check for API key
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.error('❌ RESEND_API_KEY is not set in environment variables')
      console.error('Environment check:', {
        hasKey: !!apiKey,
        nodeEnv: process.env.NODE_ENV,
        allEnvKeys: Object.keys(process.env).filter(k => k.includes('RESEND'))
      })
      return NextResponse.json(
        { 
          error: 'Email service is not configured. Please contact support directly at anna.solovyova@medora.agency',
          debug: process.env.NODE_ENV === 'development' ? 'RESEND_API_KEY is missing' : undefined
        },
        { status: 500 }
      )
    }

    // Initialize Resend inside the handler
    let resend: Resend
    try {
      resend = new Resend(apiKey)
    } catch (initError: any) {
      console.error('❌ Failed to initialize Resend:', initError)
      return NextResponse.json(
        { error: 'Failed to initialize email service. Please try again later.' },
        { status: 500 }
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

    const fromEmail = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev'
    const toEmail = 'anna.solovyova@medora.agency'

    console.log('📧 Attempting to send email...')
    console.log('From:', fromEmail)
    console.log('To:', toEmail)
    console.log('Subject:', emailSubject)

    // Send email using Resend
    try {
      const { data, error } = await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        subject: emailSubject,
        text: emailBody,
        replyTo: email,
      })

      if (error) {
        console.error('❌ Resend API error:', JSON.stringify(error, null, 2))
        console.error('Error details:', {
          message: error.message,
          name: error.name,
          statusCode: (error as any).statusCode
        })
        
        // Return error to client so they know it failed
        return NextResponse.json(
          { 
            error: 'Failed to send email. Please try again or contact us directly at anna.solovyova@medora.agency',
            debug: process.env.NODE_ENV === 'development' ? error : undefined
          },
          { status: 500 }
        )
      }

      if (data) {
        console.log('✅ Email sent successfully!')
        console.log('Email ID:', data.id)
        console.log('Response:', JSON.stringify(data, null, 2))
      } else {
        console.warn('⚠️ No error but also no data returned from Resend')
      }

      return NextResponse.json(
        { 
          success: true, 
          message: 'Form submitted successfully',
          emailId: data?.id 
        },
        { status: 200 }
      )
    } catch (emailError: any) {
      console.error('❌ Exception while sending email:', emailError)
      console.error('Error stack:', emailError.stack)
      console.error('Error message:', emailError.message)
      
      return NextResponse.json(
        { 
          error: 'An unexpected error occurred while sending the email. Please try again or contact us directly at anna.solovyova@medora.agency',
          debug: process.env.NODE_ENV === 'development' ? emailError.message : undefined
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('❌ Contact form processing error:', error)
    console.error('Error stack:', error.stack)
    return NextResponse.json(
      { error: 'Failed to process form submission. Please try again.' },
      { status: 500 }
    )
  }
}

