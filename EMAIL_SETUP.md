# Email Setup Instructions

The contact form is now configured to send emails using Resend. Follow these steps to enable email sending:

## Step 1: Sign up for Resend

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (free tier includes 3,000 emails/month)
3. Verify your email address

## Step 2: Get Your API Key

1. Log in to your Resend dashboard
2. Go to [API Keys](https://resend.com/api-keys)
3. Click "Create API Key"
4. Give it a name (e.g., "Medora Website")
5. Copy the API key (you'll only see it once!)

## Step 3: Configure Environment Variables

1. Create a `.env` file in the project root (if it doesn't exist)
2. Add the following:

```env
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=contact@medora.agency
```

**Important Notes:**
- Replace `re_xxxxxxxxxxxxxxxxxxxxx` with your actual API key from Resend
- For `RESEND_FROM_EMAIL`, you have two options:
  - **Option 1 (Testing)**: Use `onboarding@resend.dev` (works immediately, no setup needed)
  - **Option 2 (Production)**: Use your own domain email like `contact@medora.agency` (requires domain verification in Resend)

## Step 4: Verify Your Domain (Optional, for Production)

If you want to use `contact@medora.agency` or your own domain:

1. Go to [Domains](https://resend.com/domains) in Resend dashboard
2. Click "Add Domain"
3. Enter your domain (e.g., `medora.agency`)
4. Add the DNS records Resend provides to your domain's DNS settings
5. Wait for verification (usually a few minutes)

## Step 5: Restart the Server

After adding the environment variables:

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

## Testing

1. Fill out the contact form on your website
2. Submit it
3. Check `anna.solovyova@medora.agency` inbox
4. You should receive the email within seconds

## Troubleshooting

- **No emails received**: Check the server console for errors. Make sure `RESEND_API_KEY` is set correctly.
- **API Key error**: Verify the key is correct and hasn't been revoked in Resend dashboard.
- **Domain not verified**: If using a custom domain, make sure DNS records are properly configured.

## Alternative Email Services

If you prefer a different service, you can modify `/app/api/contact/route.ts` to use:
- **SendGrid**: Similar setup, requires API key
- **Nodemailer**: Requires SMTP credentials
- **AWS SES**: Requires AWS account setup

