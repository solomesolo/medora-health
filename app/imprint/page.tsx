import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'

export const metadata = {
  title: 'Imprint - Medora',
  description: 'Legal imprint for Medora.',
}

export default function ImprintPage() {
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
          Imprint
        </h1>

        <div className="space-y-8 text-[#B9AF9A]">
          <div className="pt-8 border-t border-white/10">
            <h2 className="text-xl font-semibold text-[#F3F1EC] mb-3 font-serif">Information according to § 5 TMG</h2>
            <p className="leading-relaxed">
              Medora<br />
              Anna Solovyova<br />
              Munich, Germany
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-xl font-semibold text-[#F3F1EC] mb-3 font-serif">Contact</h2>
            <p className="leading-relaxed">
                    Email: <a href="mailto:anna.solovyova@medora.agency" className="text-[#5F7D73] hover:text-[#7A9B8F] underline">anna.solovyova@medora.agency</a><br />
              Phone: <a href="tel:+4915207257777" className="text-[#5F7D73] hover:text-[#7A9B8F] underline">+49 152 07257777</a>
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-xl font-semibold text-[#F3F1EC] mb-3 font-serif">Responsible for content</h2>
            <p className="leading-relaxed">
              Anna Solovyova<br />
              Munich, Germany
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

