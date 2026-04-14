import type { ReactNode } from 'react'
import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'

type LegalPageLayoutProps = {
  title: string
  children: ReactNode
}

export default function LegalPageLayout({ title, children }: LegalPageLayoutProps) {
  return (
    <section
      className="min-h-screen bg-[#e8edf3] text-slate-900"
      style={{ paddingTop: '5.5rem' }}
    >
      <div className="mx-auto max-w-[720px] px-6 pb-20 lg:pb-28 pt-8">
        <div className="mb-10 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to home
          </Link>
          <Link
            href="/"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200/80 bg-white text-slate-500 shadow-sm transition-all hover:border-slate-300 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>

        <h1 className="mb-8 font-sans text-3xl font-semibold tracking-tight text-slate-900 lg:text-4xl">
          {title}
        </h1>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-8 shadow-[0_4px_24px_rgba(15,23,42,0.06)]">
          {children}
        </div>
      </div>
    </section>
  )
}
