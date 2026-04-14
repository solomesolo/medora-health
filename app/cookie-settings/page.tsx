import Link from 'next/link'
import CookieSettings from '@/app/components/CookieSettings'
import LegalPageLayout from '@/app/components/LegalPageLayout'

export const metadata = {
  title: 'Cookie Settings - Medora',
  description: 'Manage your cookie preferences on the Medora website.',
}

export default function CookieSettingsPage() {
  return (
    <LegalPageLayout title="Cookie settings">
      <CookieSettings />
      <p className="mt-8 border-t border-slate-100 pt-6 text-sm text-slate-500">
        For more detail, see our{' '}
        <Link href="/privacy" className="font-medium text-blue-600 underline decoration-blue-600/30 underline-offset-2 hover:text-blue-700">
          Privacy policy
        </Link>
        .
      </p>
    </LegalPageLayout>
  )
}
