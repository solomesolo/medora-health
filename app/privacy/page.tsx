import Link from 'next/link'
import { ArrowLeft, X } from 'lucide-react'

export const metadata = {
  title: 'Privacy Policy - Medora',
  description: 'Privacy policy for Medora website.',
}

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>

        <div className="space-y-12 text-[#B9AF9A]">
          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">1. Introduction</h2>
            <p className="leading-relaxed">
              Medora ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our website.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">2. Information We Collect</h2>
            <p className="leading-relaxed mb-4">
              We collect information that you provide directly to us, such as when you:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Fill out our contact form</li>
              <li>Subscribe to our newsletter</li>
              <li>Communicate with us via email</li>
            </ul>
            <p className="leading-relaxed mt-4">
              We also automatically collect certain information about your device and how you interact with our website, including through cookies and similar technologies.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">3. How We Use Your Information</h2>
            <p className="leading-relaxed mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send you updates about our services (with your consent)</li>
              <li>Improve our website and user experience</li>
              <li>Analyze website usage and trends</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">4. Cookies</h2>
            <p className="leading-relaxed mb-4">
              We use cookies to enhance your experience on our website. You can manage your cookie preferences at any time through our{' '}
              <Link href="/cookie-settings" className="text-[#5F7D73] hover:text-[#7A9B8F] underline">
                Cookie Settings
              </Link>
              .
            </p>
            <p className="leading-relaxed">
              Essential cookies are necessary for the website to function and cannot be disabled. Analytics cookies help us understand how visitors use our site and can be disabled.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">5. Data Sharing</h2>
            <p className="leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>With your explicit consent</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights and safety</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">6. Your Rights</h2>
            <p className="leading-relaxed mb-4">
              You have the right to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Access your personal information</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Withdraw consent for data processing</li>
              <li>Manage your cookie preferences</li>
            </ul>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">7. Data Security</h2>
            <p className="leading-relaxed">
              We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <h2 className="text-2xl font-semibold text-[#F3F1EC] mb-4 font-serif">8. Contact Us</h2>
            <p className="leading-relaxed mb-4">
              If you have questions about this Privacy Policy or wish to exercise your rights, please contact us:
            </p>
            <p className="leading-relaxed">
                    Email: <a href="mailto:anna.solovyova@medora.agency" className="text-[#5F7D73] hover:text-[#7A9B8F] underline">anna.solovyova@medora.agency</a>
            </p>
          </div>

          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-[#8A9B8A]">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

