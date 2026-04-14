import Link from 'next/link'
import LegalPageLayout from '@/app/components/LegalPageLayout'

export const metadata = {
  title: 'Privacy Policy - Medora',
  description: 'Privacy policy for the Medora website.',
}

export default function PrivacyPage() {
  const updated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <LegalPageLayout title="Privacy Policy">
      <div className="space-y-10 text-[15px] leading-relaxed text-slate-600">
        <div className="border-t border-slate-100 pt-8 first:border-0 first:pt-0">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">1. Introduction</h2>
          <p>
            Medora (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, and safeguard your information when you visit our website.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">2. Information we collect</h2>
          <p className="mb-3">We collect information that you provide directly to us, for example when you:</p>
          <ul className="ml-4 list-disc space-y-2 pl-2">
            <li>Use our contact form</li>
            <li>Communicate with us by email</li>
          </ul>
          <p className="mt-4">
            We may also automatically collect certain technical information about your device and how you use the site,
            including through cookies and similar technologies, as described below.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">3. How we use your information</h2>
          <p className="mb-3">We use the information we collect to:</p>
          <ul className="ml-4 list-disc space-y-2 pl-2">
            <li>Respond to inquiries and provide support</li>
            <li>Improve our website and communications</li>
            <li>Analyse usage in line with your cookie choices</li>
            <li>Comply with legal obligations</li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">4. Cookies</h2>
          <p className="mb-3">
            We use cookies where necessary for the site to work, and optional analytics cookies if you allow them. You can
            change your choices at any time on our{' '}
            <Link href="/cookie-settings" className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700">
              Cookie settings
            </Link>{' '}
            page.
          </p>
          <p>
            Essential cookies cannot be switched off in the cookie tool. Analytics cookies help us understand traffic and
            can be disabled.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">5. Legal bases (GDPR)</h2>
          <p>
            Where the GDPR applies, we process personal data on the basis of contract (responding to your request),
            legitimate interests (operating and improving the site, security), or consent (e.g. non-essential cookies),
            as appropriate.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">6. Retention</h2>
          <p>
            We keep personal data only as long as needed for the purposes above, unless a longer period is required by
            law.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">7. Your rights</h2>
          <p className="mb-3">Depending on your location, you may have the right to:</p>
          <ul className="ml-4 list-disc space-y-2 pl-2">
            <li>Access, correct, or delete your personal data</li>
            <li>Restrict or object to certain processing</li>
            <li>Data portability where applicable</li>
            <li>Withdraw consent where processing is consent-based</li>
            <li>Lodge a complaint with a supervisory authority</li>
          </ul>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">8. Security</h2>
          <p>
            We use appropriate technical and organisational measures to protect personal data. No method of transmission
            over the internet is completely secure.
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <h2 className="mb-3 font-sans text-lg font-semibold text-slate-900">9. Contact</h2>
          <p className="mb-2">Questions about this policy or your data:</p>
          <p>
            Email:{' '}
            <a
              href="mailto:annasolovyova@gmx.de"
              className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700"
            >
              annasolovyova@gmx.de
            </a>
          </p>
        </div>

        <div className="border-t border-slate-100 pt-8">
          <p className="text-sm text-slate-500">Last updated: {updated}</p>
        </div>
      </div>
    </LegalPageLayout>
  )
}
