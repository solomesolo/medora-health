import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Navigation from './components/Navigation'
import CookieConsent from './components/CookieConsent'
import PageWrapper from './components/PageWrapper'

export const metadata: Metadata = {
  title: 'Medora - HealthTech Adoption & Conversion Engineering',
  description: 'Medora helps healthtech companies escape the post pilot dead zone. We turn pilots into usage, usage into revenue, and revenue into proof.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <PageWrapper>
          <Navigation />
          {children}
          <CookieConsent />
        </PageWrapper>
        <Script src="/js/responsiveness-checker.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}

