# Vercel Email Troubleshooting Guide

## Problem: Emails Not Sending in Production

If emails are not being sent from your Vercel deployment, follow these steps:

## Step 1: Verify Environment Variables in Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **Medora Health** project
3. Go to **Settings** → **Environment Variables**
4. Verify these variables exist:

### Required Variables:
- **`RESEND_API_KEY`** 
  - Value: `re_K75KGncP_3D9BAsMRjz6d4mem46jpLzub`
  - Environment: ✅ Production ✅ Preview ✅ Development
  - ⚠️ Make sure it's set for **Production** environment!

- **`RESEND_FROM_EMAIL`** (Optional but recommended)
  - Value: `onboarding@resend.dev` (or your verified domain email)
  - Environment: ✅ Production ✅ Preview ✅ Development

### Common Mistakes:
- ❌ Variable name has extra spaces: `RESEND_API_KEY ` (with trailing space)
- ❌ Value includes quotes: `"re_K75KGncP..."` (should be without quotes)
- ❌ Only set for Preview, not Production
- ❌ Variable name is different: `RESEND_KEY` instead of `RESEND_API_KEY`

## Step 2: Check Vercel Function Logs

1. Go to your project in Vercel Dashboard
2. Click on **Functions** tab (or **Deployments** → Latest deployment → **Functions**)
3. Find `/api/contact` function
4. Check the logs for:
   - ✅ `✅ Email sent successfully!` - Email was sent
   - ❌ `❌ RESEND_API_KEY is not set` - API key missing
   - ❌ `❌ Resend API error:` - API key invalid or other Resend error
   - ❌ `❌ Failed to initialize Resend:` - Package issue

## Step 3: Verify Resend API Key

1. Go to [Resend Dashboard](https://resend.com/api-keys)
2. Check if your API key `re_K75KGncP_3D9BAsMRjz6d4mem46jpLzub` is:
   - ✅ Active (not revoked)
   - ✅ Has permission to send emails
   - ✅ Not expired

## Step 4: Test the API Route Directly

You can test the API route using curl:

```bash
curl -X POST https://your-project.vercel.app/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "company": "Test Company",
    "role": "Test Role",
    "email": "test@example.com",
    "adoption-breaks": "Test message"
  }'
```

Check the response:
- ✅ `{"success":true,"message":"Form submitted successfully"}` - Success
- ❌ `{"error":"..."}` - Check the error message

## Step 5: Redeploy After Environment Variable Changes

⚠️ **Important**: After adding or changing environment variables in Vercel:
1. Go to **Deployments** tab
2. Click **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. Wait for deployment to complete
5. Test the form again

## Step 6: Check Resend Dashboard

1. Go to [Resend Dashboard](https://resend.com/emails)
2. Check the **Emails** section
3. Look for:
   - Sent emails (should appear if working)
   - Failed emails with error messages
   - Rate limit warnings

## Common Issues & Solutions

### Issue: "RESEND_API_KEY is not set"
**Solution**: 
- Go to Vercel → Settings → Environment Variables
- Add `RESEND_API_KEY` with value `re_K75KGncP_3D9BAsMRjz6d4mem46jpLzub`
- Make sure it's enabled for **Production** environment
- Redeploy the project

### Issue: "Resend API error: Invalid API key"
**Solution**:
- Verify the API key in Resend dashboard
- Check if the key was revoked or regenerated
- Update the key in Vercel if needed
- Redeploy

### Issue: "Domain not verified"
**Solution**:
- If using custom domain email (e.g., `contact@medora.agency`), verify domain in Resend
- Or use `onboarding@resend.dev` for testing (no verification needed)

### Issue: Emails sent but not received
**Solution**:
- Check spam/junk folder
- Verify recipient email: `anna.solovyova@medora.agency`
- Check Resend dashboard for delivery status
- Check if email provider is blocking Resend emails

## Debug Mode

The API route now includes detailed logging. Check Vercel function logs for:
- `📧 Attempting to send email...` - Starting email send
- `✅ Email sent successfully!` - Success
- `❌` - Any errors with details

## Still Not Working?

1. **Check Vercel Logs**: Look for detailed error messages
2. **Test Locally**: Make sure it works in development first
3. **Verify Package**: Ensure `resend` is in `package.json` dependencies
4. **Contact Support**: Share Vercel function logs with support team

## Quick Checklist

- [ ] `RESEND_API_KEY` is set in Vercel Environment Variables
- [ ] Environment variable is enabled for **Production**
- [ ] API key is active in Resend dashboard
- [ ] Project has been redeployed after adding variables
- [ ] Checked Vercel function logs for errors
- [ ] Checked Resend dashboard for sent/failed emails
- [ ] Tested with curl or form submission

