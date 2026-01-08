# Medora Health - HealthTech Adoption & Conversion Engineering

A modern, responsive website for Medora, helping healthtech teams turn pilot approval and product launches into routine clinical and patient adoption.

## 🚀 Features

- **Modern Design**: Dark theme with elegant typography and smooth animations
- **Responsive**: Fully responsive design tested across all device sizes
- **Contact Form**: Integrated contact form with email notifications via Resend
- **Performance**: Optimized for speed and SEO
- **Accessibility**: Built with accessibility best practices
- **Production Ready**: Clean build, no unnecessary dependencies

## 📋 Tech Stack

- **Framework**: Next.js 16.1.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Database**: SQLite with Prisma ORM
- **Email**: Resend API
- **Deployment**: Vercel (recommended) or any Node.js hosting

## 🛠️ Setup & Installation

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/medora-health.git
   cd medora-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   RESEND_API_KEY=your_resend_api_key_here
   RESEND_FROM_EMAIL=onboarding@resend.dev
   ADMIN_PASSWORD=your_secure_password
   NEXT_PUBLIC_SITE_URL=http://localhost:3008
   ```

4. **Set up the database**
   ```bash
   npm run prisma:generate
   npm run prisma:migrate
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

   The site will be available at `http://localhost:3008`

## 📧 Email Configuration

The contact form uses Resend for email delivery. To set up:

1. Sign up at [Resend.com](https://resend.com) (free tier available)
2. Get your API key from [Resend API Keys](https://resend.com/api-keys)
3. Add `RESEND_API_KEY` to your `.env` file
4. For production, verify your domain in Resend dashboard

See `QUICK_EMAIL_SETUP.md` for detailed instructions.

## 🏗️ Project Structure

```
medora-health/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── contact/      # Contact form endpoint
│   ├── components/        # React components
│   └── page.tsx          # Home page
├── public/                # Static assets
│   ├── images/           # Image files
│   └── js/               # Client-side JavaScript
├── css/                   # Global styles
├── prisma/               # Database schema and migrations
└── lib/                  # Utility functions
```

## 📝 Available Scripts

- `npm run dev` - Start development server (port 3008)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The project can be deployed to any Node.js hosting platform:
- **Netlify**: Configure build command: `npm run build`
- **Railway**: Auto-detects Next.js
- **DigitalOcean App Platform**: Select Next.js preset
- **AWS Amplify**: Connect GitHub repo

### Environment Variables for Production

Make sure to set these in your hosting platform:
- `DATABASE_URL` - Your production database URL
- `RESEND_API_KEY` - Your Resend API key
- `RESEND_FROM_EMAIL` - Verified email address
- `ADMIN_PASSWORD` - Secure password for admin access
- `NEXT_PUBLIC_SITE_URL` - Your production URL

## 🎨 Customization

### Colors & Branding

Edit CSS variables in `css/styles.css`:
```css
:root {
    --bg-primary: #2F3B34;
    --bg-secondary: #4A4541;
    --text-primary: #F3F1EC;
    /* ... */
}
```

### Content Updates

- **Hero Section**: `app/page.tsx` (lines 230-242)
- **Navigation**: `app/components/Navigation.tsx`
- **Contact Info**: `app/page.tsx` (contact section)

## 📱 Responsive Design

The site is fully responsive with breakpoints:
- **Mobile**: < 768px
- **Tablet**: 768px - 1023px
- **Desktop**: ≥ 1024px

See `RESPONSIVENESS_REPORT.md` for detailed testing information.

## 🔒 Security

- Environment variables are never committed to git
- Admin routes are protected with password authentication
- Form submissions are validated server-side
- SQL injection protection via Prisma ORM

## 📄 License

ISC

## 👥 Contact

- **Email**: anna.solovyova@medora.agency
- **Website**: [Medora Agency](https://medora.agency)

## 🙏 Acknowledgments

Built with Next.js, React, and modern web technologies.
