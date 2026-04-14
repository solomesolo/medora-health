'use client'

import { useState } from 'react'

export default function HomePage() {
  const [isSending, setIsSending] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)

    const form = e.currentTarget
    const formData = new FormData(form)
    const data = Object.fromEntries(formData.entries())

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json().catch(() => null)
      if (!res.ok) {
        throw new Error(json?.error || 'Failed to send message')
      }

      form.reset()
      alert('Message sent. We will reply shortly.')
    } catch (err) {
      const subject = encodeURIComponent(
        `Contact from ${(data as any)?.name || ''} at ${(data as any)?.company || ''}`.trim(),
      )
      const body = encodeURIComponent(
        `Name: ${(data as any)?.name || ''}\n` +
          `Company: ${(data as any)?.company || ''}\n` +
          `Role: ${(data as any)?.role || ''}\n` +
          `Email: ${(data as any)?.email || ''}\n\n` +
          `Message:\n${(data as any)?.['adoption-breaks'] || ''}`,
      )
      window.location.href = `mailto:annasolovyova@gmx.de?subject=${subject}&body=${body}`
    } finally {
      setIsSending(false)
    }
  }

  return (
    <>
      <a href="#hero" className="skip-link">
        Skip to main content
      </a>

      <main
        className="horizontal-scroll-container"
        role="main"
        aria-label="Medora website content"
        style={{ display: 'block' }}
        data-app="next"
      >
        <section className="section hero-section hero-section--photo" id="hero" aria-label="Hero section">
          <div className="container">
            <div className="grid hero-grid">
              <div className="hero-content">
                <p className="hero-eyebrow" data-animate="0">
                  International market entry
                </p>
                <h1 className="hero-headline" data-animate="1">
                  Your healthtech will fail in Germany.
                </h1>
                <p className="hero-subhead" data-animate="2">
                  Unless it fits how the system actually works.
                  <br />
                  We help international healthtech companies adapt their product, compliance, and go-to-market to succeed
                  in Germany.
                </p>
                <div className="hero-ctas" data-animate="3">
                  <a href="/use-cases" className="cta-primary magnetic">
                    See our use cases
                  </a>
                  <a href="#contact" className="cta-secondary magnetic">
                    Fix my market entry
                  </a>
                </div>
                <div className="hero-proof" data-animate="4">
                  <div className="proof-divider"></div>
                  <p className="proof-text">
                    Trusted by teams navigating hospital workflows, procurement reality, and clinical adoption.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section
          className="section reality-section real-problem-section"
          id="reality"
          aria-labelledby="real-problem-heading"
        >
          <div className="container real-problem-container">
            <div className="real-problem-inner">
              <p className="real-problem-eyebrow">The real problem</p>
              <h2 className="real-problem-title" id="real-problem-heading">
                <span className="real-problem-word">It’s</span>
                <span className="real-problem-word real-problem-word--accent">not</span>
                <span className="real-problem-word">your</span>
                <span className="real-problem-word">product.</span>
              </h2>
              <p className="real-problem-intro" id="realProblemIntro">
                The uncomfortable part is rarely the roadmap. It’s the gap between what you shipped and how care is
                actually delivered, bought, documented, and reimbursed in Germany—and how unlike that is from the
                markets you already won.
              </p>

              <div className="real-problem-bullets-wrap">
                <div className="real-problem-timeline" aria-hidden="true">
                  <div className="real-problem-timeline-track"></div>
                  <div className="real-problem-timeline-fill" id="realProblemTimelineFill"></div>
                </div>
                <ul className="real-problem-list" role="list">
                  <li className="real-problem-item" data-real-problem-index="0">
                    <article className="real-problem-card" aria-labelledby="real-problem-card-0-title">
                      <header className="real-problem-card-head">
                        <p className="real-problem-item-text" id="real-problem-card-0-title">
                          How doctors actually work{' '}
                          <span className="real-problem-paren">(Praxis ≠ hospital ≠ other markets)</span>
                        </p>
                      </header>
                      <div className="real-problem-detail">
                        <div className="real-problem-compare" role="group" aria-label="Two care contexts in Germany">
                          <div className="real-problem-compare-col">
                            <p className="real-problem-compare-kicker">Praxis</p>
                            <p className="real-problem-compare-body">Outpatient, time-constrained, efficiency-driven</p>
                          </div>
                          <div className="real-problem-compare-rule" aria-hidden="true"></div>
                          <div className="real-problem-compare-col">
                            <p className="real-problem-compare-kicker">Hospital</p>
                            <p className="real-problem-compare-body">Hierarchical, protocol-heavy</p>
                          </div>
                        </div>
                      </div>
                    </article>
                  </li>
                  <li className="real-problem-item" data-real-problem-index="1">
                    <article className="real-problem-card" aria-labelledby="real-problem-card-1-title">
                      <header className="real-problem-card-head">
                        <p className="real-problem-item-text" id="real-problem-card-1-title">
                          How liability, documentation, and data rules bind the product in practice
                        </p>
                      </header>
                      <div className="real-problem-detail">
                        <div className="real-problem-detail-inset">
                          <p className="real-problem-detail-text">
                            GDPR is table stakes; clinical liability and audit trails shape what “safe to use” means on
                            the floor.
                          </p>
                        </div>
                      </div>
                    </article>
                  </li>
                  <li className="real-problem-item" data-real-problem-index="2">
                    <article className="real-problem-card" aria-labelledby="real-problem-card-2-title">
                      <header className="real-problem-card-head">
                        <p className="real-problem-item-text" id="real-problem-card-2-title">
                          How procurement and hospital IT actually buy—and how slowly consensus forms
                        </p>
                      </header>
                      <div className="real-problem-detail">
                        <div className="real-problem-detail-inset">
                          <p className="real-problem-detail-text">
                            Framework agreements, security reviews, and parallel paper workflows eat timelines you
                            didn’t model.
                          </p>
                        </div>
                      </div>
                    </article>
                  </li>
                  <li className="real-problem-item" data-real-problem-index="3">
                    <article className="real-problem-card" aria-labelledby="real-problem-card-3-title">
                      <header className="real-problem-card-head">
                        <p className="real-problem-item-text" id="real-problem-card-3-title">
                          What counts as proof to German payers, Kliniken, and frontline staff
                        </p>
                      </header>
                      <div className="real-problem-detail">
                        <div className="real-problem-detail-inset">
                          <p className="real-problem-detail-text">
                            Pilot novelty ≠ durable utility. Evidence has to read credible in local clinical and economic
                            language.
                          </p>
                        </div>
                      </div>
                    </article>
                  </li>
                  <li className="real-problem-item" data-real-problem-index="4">
                    <article className="real-problem-card" aria-labelledby="real-problem-card-4-title">
                      <header className="real-problem-card-head">
                        <p className="real-problem-item-text" id="real-problem-card-4-title">
                          Why “it worked elsewhere” quietly breaks at the German bedside
                        </p>
                      </header>
                      <div className="real-problem-detail">
                        <div className="real-problem-detail-inset">
                          <p className="real-problem-detail-text">
                            Workflow density, documentation load, and fragmented systems change what adoption requires.
                          </p>
                        </div>
                      </div>
                    </article>
                  </li>
                </ul>
              </div>

              <p className="real-problem-divider" id="realProblemDivider">
                Germany is not a market.
                <br />
                It’s a system.
              </p>
            </div>
          </div>
        </section>

        <section className="section what-we-do-section" id="solution" aria-labelledby="what-we-do-heading">
          <div className="what-we-do-container">
            <div className="what-we-do-inner">
              <p className="what-we-do-eyebrow">What we do</p>
              <h2 className="what-we-do-title" id="what-we-do-heading">
                <span className="what-we-do-fallback">We make your product work in Germany.</span>
                <span className="what-we-do-type" aria-hidden="true"></span>
                <span className="what-we-do-cursor" aria-hidden="true"></span>
              </h2>

              <ul className="what-we-do-rejects" role="list" aria-label="What we are not">
                <li className="what-we-do-reject-line">
                  <span className="what-we-do-reject-not">Not</span> strategy slides.
                </li>
                <li className="what-we-do-reject-line">
                  <span className="what-we-do-reject-not">Not</span> generic consulting.
                </li>
                <li className="what-we-do-reject-line">
                  <span className="what-we-do-reject-not">Not</span> decks no one owns after the workshop.
                </li>
              </ul>

              <div className="what-we-do-core-card" data-wwd-core>
                <p className="what-we-do-core-text">
                  We go into <span className="what-we-do-phrase" data-wwd-phrase>your product</span>, challenge{' '}
                  <span className="what-we-do-phrase" data-wwd-phrase>your assumptions</span>, rebuild{' '}
                  <span className="what-we-do-phrase" data-wwd-phrase>go-to-market</span>, and ground it all in how the{' '}
                  <span className="what-we-do-phrase" data-wwd-phrase>German healthcare system</span> actually works—not
                  the template that worked elsewhere.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="section services-section" id="services" aria-labelledby="services-heading">
          <div className="container services-container">
            <header className="services-header">
              <p className="services-eyebrow">What we deliver</p>
              <h2 className="services-heading" id="services-heading">Services</h2>
              <p className="services-lede">
                Three ways we help you align product, compliance, and traction with how Germany actually works.
              </p>
            </header>
            <div className="services-grid" data-services-grid>
              <article className="service-card" data-service-card>
                <header className="service-card__header">
                  <h3 className="service-card__title" id="service-title-1">Market Reality Check</h3>
                  <p className="service-card__hook">Should you even enter Germany?</p>
                </header>
                <div className="service-card__body">
                  <div className="service-card__scroll" data-service-scroll>
                    <ul className="service-card__bullets" aria-label="Includes">
                      <li>Market viability assessment</li>
                      <li>Competitive landscape</li>
                      <li>Regulatory blockers</li>
                      <li>Reimbursement potential (e.g. DiGA suitability)</li>
                    </ul>
                    <p className="service-card__outcome">
                      <strong>Outcome:</strong> clear go / no-go + risk map
                    </p>
                  </div>
                  <div className="service-card__dots" data-service-dots aria-hidden="true">
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                  </div>
                </div>
              </article>

              <article className="service-card" data-service-card>
                <header className="service-card__header">
                  <h3 className="service-card__title" id="service-title-2">Product Adaptation Blueprint</h3>
                  <p className="service-card__hook">What must change for your product to work in Germany</p>
                </header>
                <div className="service-card__body">
                  <div className="service-card__scroll" data-service-scroll>
                    <ul className="service-card__bullets" aria-label="Includes">
                      <li>Clinical workflow alignment (Praxis, MVZ, hospital use)</li>
                      <li>Feature gaps vs German expectations</li>
                      <li>Localization beyond language</li>
                      <li>Compliance gaps (MDR, GDPR)</li>
                    </ul>
                    <p className="service-card__outcome">
                      <strong>Outcome:</strong> actionable product roadmap for Germany
                    </p>
                  </div>
                  <div className="service-card__dots" data-service-dots aria-hidden="true">
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                  </div>
                </div>
              </article>

              <article className="service-card" data-service-card>
                <header className="service-card__header">
                  <h3 className="service-card__title" id="service-title-3">Go-To-Market &amp; Partnerships</h3>
                  <p className="service-card__hook">How to get your first traction in Germany</p>
                </header>
                <div className="service-card__body">
                  <div className="service-card__scroll" data-service-scroll>
                    <ul className="service-card__bullets" aria-label="Includes">
                      <li>Target customer definition</li>
                      <li>Provider strategy (clinics, doctors, networks)</li>
                      <li>Pilot and entry strategy</li>
                      <li>Partnership mapping</li>
                    </ul>
                    <p className="service-card__outcome">
                      <strong>Outcome:</strong> clear path to first customers and pilots
                    </p>
                  </div>
                  <div className="service-card__dots" data-service-dots aria-hidden="true">
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                    <span className="service-card__dot"></span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="section founder-section founder-section--light" id="founder" aria-labelledby="founder-heading">
          <div className="founder-container">
            <div className="founder-grid-12">
              <div className="founder-left" data-animate="card">
                <div className="founder-profile-card">
                  <div className="founder-portrait-container">
                    <img
                      src="/images/1699970043785.jpeg"
                      alt="Anna Solovyova"
                      className="founder-portrait"
                      onError={(e) => {
                        const img = e.currentTarget
                        const next = img.nextElementSibling as HTMLElement | null
                        img.style.display = 'none'
                        if (next) next.style.display = 'flex'
                      }}
                    />
                    <div className="founder-portrait-fallback" style={{ display: 'none' }}>
                      <span className="founder-monogram">AS</span>
                    </div>
                  </div>
                  <div className="founder-name">Anna Solovyova</div>
                  <div className="founder-role">Healthtech &amp; AI executive</div>
                  <ul className="founder-credibility">
                    <li>10+ years in healthtech and AI leadership</li>
                    <li>Built and scaled startups; AI programs across 40+ diagnostic labs</li>
                    <li>Clinical validation, MDR, and GDPR in live execution</li>
                  </ul>
                </div>
              </div>
              <div className="founder-right" data-animate="content">
                <div className="founder-story-card">
                  <p className="founder-eyebrow">About the founder</p>
                  <h2 className="founder-headline" id="founder-heading">
                    Built inside clinical reality.
                  </h2>
                  <div className="founder-text">
                    <p className="founder-paragraph">Medora was built from real experience inside the German healthcare system.</p>
                    <p className="founder-paragraph">
                      Founded by Anna Solovyova, a healthtech and AI executive with 10+ years of experience, Medora brings
                      together product, clinical, and regulatory expertise — not in theory, but in execution.
                    </p>
                    <p className="founder-paragraph">
                      From building and scaling healthtech startups, to leading AI programs across 40+ diagnostic laboratories,
                      to designing clinical validation and compliance under MDR and GDPR — this is work done inside the system,
                      not around it.
                    </p>
                    <p className="founder-focus-intro">Medora applies this experience to one problem most teams underestimate:</p>
                    <p className="founder-focus-line">
                      Why products don’t get adopted — even when they are approved, funded, and launched.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section final-close-section" id="final-close" aria-labelledby="final-close-title">
          <div className="final-close-bg" aria-hidden="true"></div>
          <div className="final-close-inner">
            <h2 className="final-close__title" id="final-close-title" data-final-close-line>
              If Germany is on your roadmap — don’t guess.
            </h2>
            <div className="final-close__body">
              <p className="final-close__line" data-final-close-line>Most companies waste months.</p>
              <p className="final-close__line" data-final-close-line>Some waste years.</p>
              <p className="final-close__line" data-final-close-line>You don’t have to.</p>
            </div>
            <a href="#contact" className="final-close__cta magnetic" data-final-close-cta>
              <span className="final-close__cta-label">Book a 30-min reality check</span>
            </a>
            <p className="final-close__micro" data-final-close-micro>30 min. No pitch. Just clarity.</p>
          </div>
        </section>

        <section className="section contact-section contact-section--premium" id="contact" aria-labelledby="contact-heading">
          <div className="contact-premium-wrap">
            <header className="contact-premium-header">
              <p className="contact-premium-eyebrow">Contact</p>
              <h2 className="contact-premium-title" id="contact-heading">
                Start the conversation
              </h2>
              <p className="contact-premium-lede">Brief context is enough. We respond personally.</p>
            </header>
            <div className="contact-premium-grid">
              <div className="contact-premium-panel contact-form-wrapper">
                <form className="contact-form" id="contactForm" noValidate onSubmit={onSubmit}>
                  <div className="form-row">
                    <div className="form-group form-group-half">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" id="name" name="name" className="form-input" autoComplete="name" required />
                    </div>
                    <div className="form-group form-group-half">
                      <label htmlFor="company" className="form-label">Company</label>
                      <input type="text" id="company" name="company" className="form-input" autoComplete="organization" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">Role</label>
                    <input type="text" id="role" name="role" className="form-input" autoComplete="organization-title" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" name="email" className="form-input" autoComplete="email" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="adoption-breaks" className="form-label">Message</label>
                    <textarea
                      id="adoption-breaks"
                      name="adoption-breaks"
                      className="form-input form-textarea"
                      rows={6}
                      placeholder="What you are building and where Germany fits in."
                      required
                    />
                  </div>
                  <button type="submit" className="form-submit" disabled={isSending}>
                    {isSending ? 'Sending...' : 'Send message'}
                  </button>
                </form>
              </div>
              <aside className="contact-premium-panel contact-premium-aside" aria-label="Direct contact">
                <h3 className="contact-aside-title">Direct</h3>
                <div className="contact-aside-block">
                  <span className="contact-aside-label">Email</span>
                  <p className="contact-aside-value">
                    <a href="mailto:annasolovyova@gmx.de">annasolovyova@gmx.de</a>
                  </p>
                </div>
                <div className="contact-aside-block">
                  <span className="contact-aside-label">Phone</span>
                  <p className="contact-aside-value">
                    <a href="tel:+4915207257777">+49 152 07257777</a>
                  </p>
                </div>
                <div className="contact-aside-block">
                  <span className="contact-aside-label">Location</span>
                  <p className="contact-aside-value">Munich · Working internationally</p>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <footer className="site-footer" role="contentinfo">
          <div className="site-footer-inner">
            <span className="site-footer-brand">Medora</span>
            <nav className="site-footer-nav" aria-label="Legal">
              <a href="/privacy">Privacy</a>
              <a href="/cookie-settings">Cookie settings</a>
              <a href="/imprint">Imprint</a>
            </nav>
          </div>
        </footer>
      </main>
    </>
  )
}
