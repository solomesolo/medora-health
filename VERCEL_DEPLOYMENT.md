# Vercel Deployment Guide

## Quick Deploy (5 minutes)

### Step 1: Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with your GitHub account
3. Click **"Add New Project"**
4. Import your repository: **medora-health**
5. Vercel will auto-detect Next.js settings

### Step 2: Configure Environment Variables

In the Vercel project settings, go to **Settings → Environment Variables** and add:

```
DATABASE_URL=file:./prisma/dev.db
RESEND_API_KEY=re_K75KGncP_3D9BAsMRjz6d4mem46jpLzub
RESEND_FROM_EMAIL=onboarding@resend.dev
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

**Note**: Replace `https://your-project.vercel.app` with your actual Vercel URL after first deployment.

### Step 3: Deploy

1. Click **"Deploy"**
2. Wait for build to complete (usually 1-2 minutes)
3. Your site will be live at: `https://your-project.vercel.app`

## Build Settings (Auto-detected)

Vercel automatically detects:
- **Framework**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

## Environment Variables

### Required for Production:

- `RESEND_API_KEY` - Your Resend API key for email sending
- `RESEND_FROM_EMAIL` - Email address to send from (use `onboarding@resend.dev` for testing)

### Optional:

- `DATABASE_URL` - Only needed if you add database features later
- `NEXT_PUBLIC_SITE_URL` - Your production URL (auto-set by Vercel)

## Post-Deployment

1. **Test the contact form** - Submit a test message
2. **Check email delivery** - Verify emails arrive at `anna.solovyova@medora.agency`
3. **Test all pages** - Navigate through all sections
4. **Check mobile responsiveness** - Test on different devices

## Custom Domain (Optional)

1. Go to **Settings → Domains**
2. Add your custom domain (e.g., `medora.agency`)
3. Follow DNS configuration instructions
4. Wait for DNS propagation (usually a few minutes)

## Troubleshooting

### Build Fails

- Check build logs in Vercel dashboard
- Verify all environment variables are set
- Ensure Node.js version is 18+ (Vercel auto-detects)

### Email Not Sending

- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for errors
- Verify `RESEND_FROM_EMAIL` is set
- Check Vercel function logs

### 404 Errors

- Clear browser cache
- Check Vercel deployment logs
- Verify all routes are accessible

## Continuous Deployment

Vercel automatically deploys:
- Every push to `main` branch
- Pull requests get preview deployments
- You can also trigger manual deployments

## Monitoring

- **Analytics**: Enable in Vercel dashboard
- **Logs**: View function logs in Vercel dashboard
- **Performance**: Check Speed Insights

## Support

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- Project README.md

