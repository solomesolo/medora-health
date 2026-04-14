import LegalPageLayout from '@/app/components/LegalPageLayout'

export const metadata = {
  title: 'Imprint - Medora',
  description: 'Legal imprint (Impressum) for Medora.',
}

export default function ImprintPage() {
  return (
    <LegalPageLayout title="Imprint">
      <div className="space-y-8 text-[15px] leading-relaxed text-slate-600">
        <div className="border-t border-slate-100 pt-8 first:border-0 first:pt-0">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">Information according to § 5 TMG</h2>
          <p>
            Medora
            <br />
            Anna Solovyova
            <br />
            Munich, Germany
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">Contact</h2>
          <p>
            Email:{' '}
            <a
              href="mailto:annasolovyova@gmx.de"
              className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700"
            >
              annasolovyova@gmx.de
            </a>
            <br />
            Phone:{' '}
            <a
              href="tel:+4915207257777"
              className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700"
            >
              +49 152 07257777
            </a>
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">Responsible for content (§ 55 Abs. 2 RStV)</h2>
          <p>
            Anna Solovyova
            <br />
            Munich, Germany
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">EU dispute resolution</h2>
          <p>
            The European Commission provides a platform for online dispute resolution (ODR):{' '}
            <a
              href="https://ec.europa.eu/consumers/odr/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700"
            >
              https://ec.europa.eu/consumers/odr/
            </a>
            . We are not obliged or willing to participate in dispute resolution before a consumer arbitration board.
          </p>
        </div>
      </div>
    </LegalPageLayout>
  )
}
