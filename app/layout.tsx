import type { Metadata } from 'next'
import { Inter, Inter_Tight } from 'next/font/google'
import Script from 'next/script'
import './globals.css'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import CookieConsent from './components/CookieConsent'
import PageWrapper from './components/PageWrapper'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const interTight = Inter_Tight({ subsets: ['latin'], variable: '--font-inter-tight' })

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
      <body className={`${inter.variable} ${interTight.variable} ${inter.className}`}>
        <PageWrapper>
          <CustomCursor />
          <Navigation />
          {children}
          <CookieConsent />
        </PageWrapper>
        <Script src="/js/responsiveness-checker.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}

