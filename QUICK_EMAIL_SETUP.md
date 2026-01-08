# Quick Email Setup - 5 Minutes

## Step 1: Sign Up for Resend (2 minutes)
1. Go to https://resend.com/signup
2. Sign up with your email (free account)
3. Verify your email address

## Step 2: Get API Key (1 minute)
1. After logging in, go to: https://resend.com/api-keys
2. Click "Create API Key"
3. Name it: "Medora Website"
4. **Copy the key immediately** (starts with `re_`)

## Step 3: Add to .env File (1 minute)
1. Open your `.env` file in the project root
2. Add these two lines:
```
RESEND_API_KEY=re_your_actual_key_here
RESEND_FROM_EMAIL=onboarding@resend.dev
```
3. Replace `re_your_actual_key_here` with the key you copied

## Step 4: Restart Server (1 minute)
1. Stop your current server (press Ctrl+C in terminal)
2. Run: `npm run dev`
3. Test the form - emails will now be sent!

## That's it! 🎉

Emails will be sent to: **anna.solovyova@medora.agency**

---

## Troubleshooting

**Still not working?**
- Make sure you restarted the server after adding the API key
- Check server console for any error messages
- Verify the API key starts with `re_`
- Make sure there are no spaces around the `=` in .env file

**Want to use your own domain email?**
- In Resend dashboard, go to Domains
- Add your domain (e.g., medora.agency)
- Add the DNS records they provide
- Change `RESEND_FROM_EMAIL` to `contact@medora.agency`

