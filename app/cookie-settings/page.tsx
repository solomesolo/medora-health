import CookieSettings from '@/app/components/CookieSettings'
import Link from 'next/link'

export const metadata = {
  title: 'Cookie Settings - Medora',
  description: 'Manage your cookie preferences.',
}

export default function CookieSettingsPage() {
  return (
    <section className="relative overflow-hidden bg-[#2F3B34] min-h-screen">
      <div className="mx-auto max-w-[720px] px-6 py-20 lg:py-28">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#B9AF9A] hover:text-[#F3F1EC] mb-8 transition-colors"
        >
          ← Back to home
        </Link>

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

