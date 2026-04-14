import Link from 'next/link'

export default function HomePage() {
  return (
    <>
      <a href="#hero" className="skip-link">Skip to main content</a>
      <main className="horizontal-scroll-container" role="main" aria-label="Medora website content" style={{ display: 'block' }} data-app="next">
        <section className="section hero-section hero-section--photo" id="hero" aria-label="Hero section">
          <div className="container hero-container">
            <div className="hero-grid-12">
              <div className="hero-content-left">
                <p className="hero-support-line" data-animate="0">Behavioral & Emotional Design for Healthcare</p>
                <h1 className="hero-headline" data-animate="1">Your healthtech will fail in Germany.</h1>
                <p className="hero-subheadline" data-animate="2">
                  Unless it fits how the system actually works.
                  <br />
                  We help international healthtech companies adapt their product, compliance, and go-to-market to succeed in Germany.
                </p>
                <div className="hero-ctas" data-animate="4">
                  <a href="/use-cases" className="cta-primary magnetic">See our use cases</a>
                  <a href="#contact" className="cta-secondary magnetic">Fix my market entry</a>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="section contact-section" id="contact" aria-label="Contact">
          <div className="container" style={{ padding: '6rem 1.5rem' }}>
            <h2 className="contact-headline">Fix my market entry</h2>
            <p className="contact-subtext">Email us at <a href="mailto:annasolovyova@gmx.de" className="contact-link">annasolovyova@gmx.de</a>.</p>
          </div>
        </section>
        <footer className="site-footer" role="contentinfo">
          <div className="site-footer-inner">
            <span className="site-footer-brand">Medora</span>
            <nav className="site-footer-nav" aria-label="Legal">
              <Link href="/privacy">Privacy</Link>
              <Link href="/cookie-settings">Cookie settings</Link>
              <Link href="/imprint">Imprint</Link>
            </nav>
          </div>
        </footer>
      </main>
    </>
  )
}
