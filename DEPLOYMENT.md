# Deployment Guide

This guide covers deploying Medora Health to various platforms.

## 🚀 Quick Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications.

### Steps:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js settings

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables, add:
   ```
   DATABASE_URL=file:./prisma/dev.db
   RESEND_API_KEY=your_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ADMIN_PASSWORD=your_secure_password
   NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site is live!

### Database for Production

For production, use a proper database instead of SQLite:
- **Vercel Postgres** (recommended for Vercel)
- **PlanetScale** (MySQL)
- **Supabase** (PostgreSQL)
- **Railway** (PostgreSQL)

Update `DATABASE_URL` in environment variables.

## 🌐 Other Deployment Options

### Netlify

1. Connect GitHub repository
2. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Add environment variables
4. Deploy

### Railway

1. Connect GitHub repository
2. Railway auto-detects Next.js
3. Add environment variables
4. Deploy

### DigitalOcean App Platform

1. Create new app from GitHub
2. Select Next.js preset
3. Configure environment variables
4. Deploy

### AWS Amplify

1. Connect GitHub repository
2. Amplify auto-detects Next.js
3. Add environment variables in console
4. Deploy

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run
- [ ] Resend API key added
- [ ] Production database configured (if not using SQLite)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production URL
- [ ] Test contact form
- [ ] Test all pages load correctly
- [ ] Check mobile responsiveness
- [ ] Verify images load
- [ ] Test navigation links

## 🔧 Production Optimizations

1. **Enable Caching**
   - Vercel handles this automatically
   - For other platforms, configure CDN

2. **Database**
   - Use production database (PostgreSQL/MySQL)
   - Set up connection pooling
   - Enable backups

3. **Email**
   - Verify your domain in Resend
   - Use custom `from` email address
   - Set up email monitoring

4. **Monitoring**
   - Set up error tracking (Sentry, etc.)
   - Monitor API response times
   - Track form submissions

## 🐛 Troubleshooting

### Build Fails

- Check Node.js version (requires 18+)
- Verify all dependencies installed
- Check for TypeScript errors: `npm run lint`

### Environment Variables Not Working

- Restart deployment after adding variables
- Check variable names match exactly
- Verify no typos in values

### Database Issues

- Ensure database URL is correct
- Run migrations: `npm run prisma:migrate`
- Check database connection

### Email Not Sending

- Verify Resend API key is correct
- Check Resend dashboard for errors
- Verify `RESEND_FROM_EMAIL` is set
- Check server logs for errors

## 📞 Support

For deployment issues, check:
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- Project issues on GitHub

