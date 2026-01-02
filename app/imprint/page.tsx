import Link from 'next/link'

export const metadata = {
  title: 'Imprint - Medora',
  description: 'Legal imprint for Medora.',
}

export default function ImprintPage() {
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
              Email: <a href="mailto:annasolovyova@gmx.de" className="text-[#5F7D73] hover:text-[#7A9B8F] underline">annasolovyova@gmx.de</a><br />
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

