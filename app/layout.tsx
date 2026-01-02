import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import CustomCursor from './components/CustomCursor'
import Navigation from './components/Navigation'
import CookieConsent from './components/CookieConsent'
import PageWrapper from './components/PageWrapper'

const inter = Inter({ subsets: ['latin'] })

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
      <body className={inter.className}>
        <PageWrapper>
          <CustomCursor />
          <Navigation />
          {children}
          <CookieConsent />
        </PageWrapper>
      </body>
    </html>
  )
}

