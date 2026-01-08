import CookieSettings from '@/app/components/CookieSettings'
import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'

export const metadata = {
  title: 'Cookie Settings - Medora',
  description: 'Manage your cookie preferences.',
}

export default function CookieSettingsPage() {
  return (
    <section className="relative overflow-hidden bg-[#2F3B34] min-h-screen" style={{ paddingTop: '6rem' }}>
      <div className="mx-auto max-w-[720px] px-6 pb-20 lg:pb-28" style={{ paddingTop: '2rem' }}>
        <div className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white/90 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to home</span>
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] text-white/60 hover:text-white/90 transition-all"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </Link>
        </div>

        <h1 className="text-4xl lg:text-5xl font-semibold text-[#F3F1EC] mb-8 font-serif">
          Cookie Settings
        </h1>

        <div className="bg-[#4A4541] border border-white/10 rounded-lg p-8">
          <CookieSettings />
        </div>

        <div className="mt-8 text-sm text-[#8A9B8A]">
          <p>
            For more information, please see our{' '}
            <Link href="/privacy" className="text-[#5F7D73] hover:text-[#7A9B8F] underline">
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}

