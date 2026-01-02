'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'

export default function HomePage() {
  useEffect(() => {
    // Check if we're in vertical scroll mode before loading the script
    if (typeof window !== 'undefined') {
      const loadScript = () => {
        // Remove existing script if any
        const existing = document.querySelector('script[src*="/js/main.js"]')
        if (existing) existing.remove()
        
        const script = document.createElement('script')
        script.src = '/js/main.js?v=71' // Increment version to force reload
        script.async = true
        script.onload = () => {
          // Force trigger animations if they don't fire automatically
          setTimeout(() => {
            const animateElements = document.querySelectorAll('[data-animate]')
            animateElements.forEach((el) => {
              const target = el as HTMLElement
              if (target.classList.contains('hero-eyebrow') || 
                  target.classList.contains('hero-headline') || 
                  target.classList.contains('hero-subhead') ||
                  target.classList.contains('hero-ctas') ||
                  target.classList.contains('hero-proof')) {
                target.classList.add('animate')
              }
              // Add animate class to engagement cards
              if (target.classList.contains('engagement-card') || target.getAttribute('data-animate') === 'card') {
                target.classList.add('animate')
              }
            })
            const heroCard = document.getElementById('heroCard')
            if (heroCard) heroCard.classList.add('animate')
            
            // Force animate all engagement cards
            const engagementCards = document.querySelectorAll('.engagement-card')
            engagementCards.forEach((card) => {
              card.classList.add('animate')
            })
          }, 100)
        }
        document.body.appendChild(script)
      }
      
      // Also trigger animations immediately for elements that should be visible
      const triggerAnimations = () => {
        const animateElements = document.querySelectorAll('[data-animate]')
        animateElements.forEach((el) => {
          const target = el as HTMLElement
          if (target.classList.contains('hero-eyebrow') || 
              target.classList.contains('hero-headline') || 
              target.classList.contains('hero-subhead') ||
              target.classList.contains('hero-ctas') ||
              target.classList.contains('hero-proof')) {
            target.classList.add('animate')
          }
          // Add animate class to all medora-does blocks
          if (target.classList.contains('medora-does-block')) {
            target.classList.add('animate')
          }
          // Add animate class to engagement cards
          if (target.classList.contains('engagement-card') || target.getAttribute('data-animate') === 'card') {
            target.classList.add('animate')
          }
        })
        const heroCard = document.getElementById('heroCard')
        if (heroCard) heroCard.classList.add('animate')
        
        // Force animate all medora-does blocks
        const medoraBlocks = document.querySelectorAll('.medora-does-block')
        medoraBlocks.forEach((block) => {
          block.classList.add('animate')
        })
        
        // Force animate all engagement cards
        const engagementCards = document.querySelectorAll('.engagement-card')
        engagementCards.forEach((card) => {
          card.classList.add('animate')
        })
        
        // Force animate all who-section panels
        const whoPanels = document.querySelectorAll('.who-panel')
        whoPanels.forEach((panel) => {
          panel.classList.add('animate')
        })
        
        // Force animate all founder section elements
        const founderCards = document.querySelectorAll('.founder-profile-card')
        founderCards.forEach((card) => {
          card.classList.add('animate')
        })
        const founderRight = document.querySelectorAll('.founder-right')
        founderRight.forEach((el) => {
          el.classList.add('animate')
        })
      }
      
      // Check for vertical mode - if true, DON'T load the scroll script
      const bodyStyles = window.getComputedStyle(document.body)
      const isVerticalMode = bodyStyles.overflowY === 'auto' || bodyStyles.overflowY === 'scroll'
      
      if (isVerticalMode) {
        console.log('✅ VERTICAL MODE - NOT loading scroll script, only triggering animations')
        // Just trigger animations, don't load the script that has scroll handlers
        if (document.readyState === 'complete') {
          triggerAnimations()
        } else {
          window.addEventListener('load', () => {
            triggerAnimations()
          })
          setTimeout(triggerAnimations, 50)
          setTimeout(triggerAnimations, 200)
        }
      } else {
        // Horizontal mode - load the full script
        if (document.readyState === 'complete') {
          loadScript()
          triggerAnimations()
        } else {
          window.addEventListener('load', () => {
            loadScript()
            triggerAnimations()
          })
          setTimeout(triggerAnimations, 50)
        }
      }
    }
  }, [])

  return (
    <>
      <a href="#hero" className="skip-link">Skip to main content</a>
      <main className="horizontal-scroll-container" role="main" aria-label="Medora website content" style={{ display: 'block' }}>
        <section className="section hero-section" id="hero" aria-label="Hero section">
          <div className="container">
            <div className="grid hero-grid">
              <div className="hero-content">
                <p className="hero-eyebrow" data-animate="0">Your product works. Adoption does not.</p>
                <h1 className="hero-headline" data-animate="1">Adoption engineered for real-world healthcare.</h1>
                <p className="hero-subhead" data-animate="2">Medora helps healthtech teams convert pilots into daily clinical usage—and usage into revenue and proof investors trust.</p>
                <div className="hero-ctas" data-animate="3">
                  <a href="#contact" className="cta-primary magnetic">Start the conversation</a>
                  <a href="#packages" className="cta-secondary magnetic">See how the Adoption Sprint works</a>
                </div>
                <div className="hero-proof" data-animate="4">
                  <div className="proof-divider"></div>
                  <p className="proof-text">Trusted by teams navigating hospital workflows, procurement reality, and clinical adoption.</p>
                </div>
              </div>
              <div className="hero-visual">
                <div className="hero-card" id="heroCard">
                  <div className="card-title">The Adoption Engine</div>
                  <div className="card-items">
                    <div className="card-item">
                      <div className="item-title">Adoption Diagnosis</div>
                      <div className="item-description">Identify where usage breaks between demo, pilot, and daily workflow.</div>
                    </div>
                    <div className="card-item">
                      <div className="item-title">Conversion Architecture</div>
                      <div className="item-description">Design activation + proof moments aligned to clinical reality.</div>
                    </div>
                    <div className="card-item">
                      <div className="item-title">Execution Blueprint</div>
                      <div className="item-description">A clear plan: what to change, in what order, and which metrics matter.</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section reality-section" id="reality">
          <div className="reality-background">
            <div className="reality-gradient"></div>
            <div className="reality-grid"></div>
            <div className="reality-grain"></div>
          </div>
          <div className="container">
            <div className="reality-content">
              <div className="reality-header" data-animate="header">
                <p className="reality-badge">Reality check</p>
                <h2 className="reality-title">Most healthtech leaders recognize this reality.</h2>
                <p className="reality-subtitle">Interest is high. Pilots run. But adoption breaks quietly — and growth stalls.</p>
              </div>
              <div className="reality-editorial-grid">
                <div className="reality-editorial-list">
                  <button className="reality-list-item" data-animate="item" data-index="0" data-stage="DEMO" tabIndex={0}>
                    <span className="reality-item-number">01</span>
                    <span className="reality-item-text">Sales reports interest but contracts stall.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="1" data-stage="PILOT" tabIndex={0}>
                    <span className="reality-item-number">02</span>
                    <span className="reality-item-text">Product ships but real world usage is inconsistent.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="2" data-stage="PILOT" tabIndex={0}>
                    <span className="reality-item-number">03</span>
                    <span className="reality-item-text">Hospitals agree to pilots but internal friction kills momentum.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="3" data-stage="USAGE" tabIndex={0}>
                    <span className="reality-item-number">04</span>
                    <span className="reality-item-text">Patients onboard then disappear.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="4" data-stage="USAGE" tabIndex={0}>
                    <span className="reality-item-number">05</span>
                    <span className="reality-item-text">Investors ask for adoption metrics that are hard to defend.</span>
                  </button>
                </div>
                <div className="reality-diagnosis-panel">
                  <div className="diagnosis-panel-sticky">
                    <div className="diagnosis-panel">
                      <div className="diagnosis-label">DIAGNOSIS</div>
                      <h3 className="diagnosis-statement">Adoption is the bottleneck.</h3>
                      <p className="diagnosis-support">Not demand. Not features.</p>
                      <p className="diagnosis-support">It breaks between intent and workflow.</p>
                      <div className="diagnosis-rail">
                        <div className="rail-line"></div>
                        <div className="rail-indicator" id="railIndicator"></div>
                        <div className="rail-labels">
                          <div className="rail-label" data-stage="DEMO">
                            <span className="label-text">DEMO</span>
                          </div>
                          <div className="rail-label" data-stage="PILOT">
                            <span className="label-text">PILOT</span>
                          </div>
                          <div className="rail-label" data-stage="USAGE">
                            <span className="label-text">USAGE</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section failure-section" id="failure">
          <div className="failure-background">
            <div className="failure-gradient"></div>
            <div className="failure-grid"></div>
            <div className="failure-grain"></div>
          </div>
          <div className="failure-container">
            <div className="failure-grid-12">
              <div className="failure-left">
                <div className="failure-header" data-animate="header">
                  <p className="failure-badge">Why adoption fails</p>
                  <h2 className="failure-headline">Adoption breaks between intent and workflow.</h2>
                  <p className="failure-intro">Digital health products fail to scale in predictable ways. The problem isn't demand — it's the missing system that carries adoption from demo to daily use.</p>
                </div>
                <div className="failure-reasons-list">
                  <ul className="failure-reasons-ul">
                  </ul>
                </div>
              </div>
              <div className="failure-right">
                <div className="failure-panel-sticky">
                  <div className="failure-panel" id="failureRailCard">
                    <div className="failure-panel-title">Adoption pipeline</div>
                    <div className="failure-pipeline">
                      <div className="failure-pipeline-stage" data-step="DEMO">
                        <div className="pipeline-stage-badge">1</div>
                        <div className="pipeline-stage-content">
                          <div className="pipeline-stage-label">DEMO</div>
                          <div className="pipeline-stage-title">Interest without activation</div>
                          <ul className="pipeline-stage-bullets">
                            <li>Buying intent is validated, but no one owns post-demo activation.</li>
                            <li>Success is measured in meetings, not behavior change.</li>
                          </ul>
                        </div>
                      </div>
                      <div className="pipeline-divider"></div>
                      <div className="failure-pipeline-stage" data-step="PILOT">
                        <div className="pipeline-stage-badge">2</div>
                        <div className="pipeline-stage-content">
                          <div className="pipeline-stage-label">PILOT</div>
                          <div className="pipeline-stage-title">Friction kills momentum</div>
                          <ul className="pipeline-stage-bullets">
                            <li>Clinical, operational, and procurement realities surface late.</li>
                            <li>Pilots lack a clear path to scale or internal ownership.</li>
                          </ul>
                        </div>
                      </div>
                      <div className="pipeline-divider"></div>
                      <div className="failure-pipeline-stage" data-step="USAGE">
                        <div className="pipeline-stage-badge">3</div>
                        <div className="pipeline-stage-content">
                          <div className="pipeline-stage-label">USAGE</div>
                          <div className="pipeline-stage-title">Habits never form</div>
                          <ul className="pipeline-stage-bullets">
                            <li>Onboarding optimizes first use, not daily repetition.</li>
                            <li>Without systematic proof, retention and expansion stall.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section medora-does-section" id="solution">
          <div className="medora-does-container">
            <div className="medora-does-grid">
              <div className="medora-does-left">
                <p className="medora-does-eyebrow">WHAT MEDORA DOES</p>
                <h2 className="medora-does-headline">Adoption engineered for real-world healthcare.</h2>
                <p className="medora-does-support">Medora designs adoption and conversion systems for healthtech products.</p>
              </div>
              <div className="medora-does-right">
                <div className="medora-does-block" data-animate="block">
                  <div className="medora-does-block-label">CONTEXT</div>
                  <p className="medora-does-block-text">We work at the intersection of product, sales, clinical reality, and data — where most teams struggle and growth quietly breaks.</p>
                </div>
                <div className="medora-does-divider"></div>
                <div className="medora-does-block" data-animate="block">
                  <div className="medora-does-block-label">WHAT WE DO</div>
                  <p className="medora-does-block-text">We design the systems that carry adoption from pilot intent into daily clinical workflow.</p>
                </div>
                <div className="medora-does-divider"></div>
                <div className="medora-does-block" data-animate="block">
                  <div className="medora-does-block-label">WHAT WE DON'T DO</div>
                  <p className="medora-does-block-text">Our role is not advisory theater. We don't produce decks without accountability.</p>
                </div>
                <div className="medora-does-divider"></div>
                <div className="medora-does-block" data-animate="block">
                  <div className="medora-does-block-label">OUTCOME</div>
                  <p className="medora-does-block-text">We remove the blockers that prevent adoption from turning into revenue and defensible proof.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section engagement-section" id="engagement">
          <div className="container">
            <div className="engagement-content">
              <h2 className="engagement-headline">The Engagement Model</h2>
              <div className="engagement-cards-wrapper">
                <div className="engagement-connector-line" aria-hidden="true"></div>
                <div className="engagement-cards">
                  <div className="engagement-card" data-card="1" data-animate="card">
                    <div className="card-step-badge">01</div>
                    <div className="card-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <line x1="4" y1="8" x2="28" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="4" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        <line x1="4" y1="24" x2="20" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="card-kicker">STEP 01</div>
                    <h3 className="card-title">Adoption Diagnosis</h3>
                    <p className="card-description">Identify where usage drops between demo, pilot, and daily workflow.</p>
                    <ul className="card-bullets">
                      <li>Map friction across stakeholders and processes</li>
                      <li>Define the adoption metrics that matter</li>
                    </ul>
                  </div>
                  <div className="engagement-card" data-card="2" data-animate="card">
                    <div className="card-step-badge">02</div>
                    <div className="card-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 16 L16 8 L24 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                        <line x1="16" y1="8" x2="16" y2="24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <div className="card-kicker">STEP 02</div>
                    <h3 className="card-title">Conversion Architecture</h3>
                    <p className="card-description">Design activation, onboarding, and proof moments that fit clinical reality.</p>
                    <ul className="card-bullets">
                      <li>Build a conversion path from pilots to contracts</li>
                      <li>Align product flows with ops constraints</li>
                    </ul>
                  </div>
                  <div className="engagement-card" data-card="3" data-animate="card">
                    <div className="card-step-badge">03</div>
                    <div className="card-icon" aria-hidden="true">
                      <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="6" y="6" width="20" height="20" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                        <line x1="6" y1="14" x2="26" y2="14" stroke="currentColor" strokeWidth="1.5"/>
                        <line x1="6" y1="18" x2="26" y2="18" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                    </div>
                    <div className="card-kicker">STEP 03</div>
                    <h3 className="card-title">Execution Blueprint</h3>
                    <p className="card-description">Deliver a sequenced plan with owners, priorities, and measurable outcomes.</p>
                    <ul className="card-bullets">
                      <li>What to change, in what order</li>
                      <li>Who owns each action internally</li>
                    </ul>
                  </div>
                </div>
              </div>
              <p className="engagement-output">Output: a system that turns pilots into usage, usage into revenue, and revenue into proof.</p>
            </div>
          </div>
        </section>
        
        <section className="section who-section" id="audience">
          <div className="who-container">
            <div className="who-grid-12">
              <div className="who-left" data-animate="panel">
                <div className="who-panel">
                  <div className="who-eyebrow">SELF-CHECK</div>
                  <h2 className="who-headline">Adoption is your bottleneck if…</h2>
                  <ul className="who-checklist">
                    <li className="who-checklist-item">
                      <div className="who-check-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8 L6 11 L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="who-checklist-text">You win pilots, but usage never becomes routine.</span>
                    </li>
                    <div className="who-checklist-divider"></div>
                    <li className="who-checklist-item">
                      <div className="who-check-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8 L6 11 L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="who-checklist-text">Internal hospital friction slows everything down.</span>
                    </li>
                    <div className="who-checklist-divider"></div>
                    <li className="who-checklist-item">
                      <div className="who-check-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8 L6 11 L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="who-checklist-text">Stakeholders agree, but ownership is unclear.</span>
                    </li>
                    <div className="who-checklist-divider"></div>
                    <li className="who-checklist-item">
                      <div className="who-check-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8 L6 11 L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="who-checklist-text">Patients onboard — then disappear.</span>
                    </li>
                    <div className="who-checklist-divider"></div>
                    <li className="who-checklist-item">
                      <div className="who-check-icon">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 8 L6 11 L13 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <span className="who-checklist-text">Investors ask for proof you can't defend yet.</span>
                    </li>
                  </ul>
                  <p className="who-checklist-note">If 2+ are true, Medora can help.</p>
                </div>
              </div>
              <div className="who-right" data-animate="panel">
                <div className="who-panel">
                  <div className="who-eyebrow">DELIVERABLES</div>
                  <h2 className="who-headline">What you get in an Adoption Sprint</h2>
                  <div className="who-deliverables">
                    <div className="who-deliverable-item">
                      <div className="who-deliverable-number">01</div>
                      <div className="who-deliverable-content">
                        <div className="who-deliverable-title">Adoption diagnosis</div>
                        <div className="who-deliverable-desc">Where usage drops between demo, pilot, and daily workflow.</div>
                      </div>
                    </div>
                    <div className="who-deliverable-item">
                      <div className="who-deliverable-number">02</div>
                      <div className="who-deliverable-content">
                        <div className="who-deliverable-title">Conversion architecture</div>
                        <div className="who-deliverable-desc">Activation + onboarding logic aligned to clinical reality.</div>
                      </div>
                    </div>
                    <div className="who-deliverable-item">
                      <div className="who-deliverable-number">03</div>
                      <div className="who-deliverable-content">
                        <div className="who-deliverable-title">Proof moments</div>
                        <div className="who-deliverable-desc">A plan for the metrics and evidence that convert pilots.</div>
                      </div>
                    </div>
                    <div className="who-deliverable-item">
                      <div className="who-deliverable-number">04</div>
                      <div className="who-deliverable-content">
                        <div className="who-deliverable-title">Execution blueprint</div>
                        <div className="who-deliverable-desc">What to change, in what order, and who owns it internally.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="who-cta-bar">
              <p className="who-cta-text">Not sure? Send a 2-minute description of where adoption breaks.</p>
              <div className="who-cta-buttons">
                <a href="#contact" className="who-cta-primary">Start the conversation</a>
              </div>
            </div>
            <p className="who-footnote">Best fit: post-pilot or post-launch teams with real market pull.</p>
          </div>
        </section>
        
        <section className="section founder-section" id="founder">
          <div className="founder-container">
            <div className="founder-grid-12">
              <div className="founder-left" data-animate="card">
                <div className="founder-profile-card">
                  <div className="founder-portrait-container">
                    <img src="/images/1699970043785.jpeg" alt="Anna Solovyova" className="founder-portrait" />
                  </div>
                  <div className="founder-name">Anna Solovyova</div>
                  <div className="founder-role">Healthtech & AI executive</div>
                  <ul className="founder-credibility">
                    <li>10+ years building and scaling digital health</li>
                    <li>AI/ML programs across 40+ laboratories</li>
                    <li>Worked with hospitals, clinicians, regulators, and investors</li>
                  </ul>
                </div>
              </div>
              <div className="founder-right" data-animate="content">
                <div className="founder-eyebrow">ABOUT THE FOUNDER</div>
                <h2 className="founder-headline">Built inside clinical reality.</h2>
                <div className="founder-text">
                  <p className="founder-paragraph">Medora was founded by Anna Solovyova, a healthtech and AI executive with more than ten years of experience building and scaling digital health products. Her background includes founding and leading healthtech startups, building AI and machine learning programs across more than forty laboratories, designing clinical validation and compliance processes.</p>
                  <p className="founder-paragraph">Medora is the synthesis of this experience, applied directly to the adoption problems most teams struggle to solve.</p>
                </div>
                <div className="founder-chips">
                  <span className="founder-chip">Hospital deployments</span>
                  <span className="founder-chip">Clinical validation</span>
                  <span className="founder-chip">Compliance + governance</span>
                  <span className="founder-chip">Procurement reality</span>
                  <span className="founder-chip">Investor metrics</span>
                  <span className="founder-chip">AI/ML programs</span>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <section className="section packages-section" id="packages">
          <div className="packages-container">
            <div className="packages-header">
              <div className="packages-eyebrow">ENGAGEMENT</div>
              <h2 className="packages-headline">Engagement Packages</h2>
              <p className="packages-subtext">Choose the level of intervention your adoption needs.</p>
            </div>
            <div className="packages-cards">
              <div className="package-card package-card-recommended" data-animate="card">
                <h3 className="package-title">Adoption Sprint</h3>
                <div className="package-best-for">
                  <span className="package-label">BEST FOR</span>
                  <p className="package-value">Post-pilot teams who need clarity on what breaks and what to fix first.</p>
                </div>
                <div className="package-duration">
                  <span className="package-label">DURATION</span>
                  <p className="package-value">4–6 weeks</p>
                </div>
                <div className="package-deliverables">
                  <span className="package-label">WHAT YOU GET</span>
                  <ul className="package-bullets">
                    <li>Adoption diagnosis (where usage drops and why)</li>
                    <li>Conversion architecture (activation + onboarding + proof moments)</li>
                    <li>Execution blueprint (owners, sequence, metrics)</li>
                  </ul>
                </div>
                <a href="#contact" className="package-cta">Start the conversation</a>
              </div>
              <div className="package-card" data-animate="card">
                <h3 className="package-title">Adoption Reset</h3>
                <div className="package-best-for">
                  <span className="package-label">BEST FOR</span>
                  <p className="package-value">Teams with stalled growth post-launch who need product + sales realignment.</p>
                </div>
                <div className="package-duration">
                  <span className="package-label">DURATION</span>
                  <p className="package-value">8–12 weeks</p>
                </div>
                <div className="package-deliverables">
                  <span className="package-label">WHAT YOU GET</span>
                  <ul className="package-bullets">
                    <li>Workflow and stakeholder redesign</li>
                    <li>Pilot-to-contract conversion system</li>
                    <li>Measurement plan that creates defensible proof</li>
                  </ul>
                </div>
                <a href="#contact" className="package-cta">Start the conversation</a>
              </div>
              <div className="package-card" data-animate="card">
                <h3 className="package-title">Advisory Partnership</h3>
                <div className="package-best-for">
                  <span className="package-label">BEST FOR</span>
                  <p className="package-value">Leaders who want adoption thinking embedded into ongoing decisions.</p>
                </div>
                <div className="package-duration">
                  <span className="package-label">DURATION</span>
                  <p className="package-value">Monthly</p>
                </div>
                <div className="package-deliverables">
                  <span className="package-label">WHAT YOU GET</span>
                  <ul className="package-bullets">
                    <li>Ongoing strategic review + prioritization</li>
                    <li>Support across product, sales, clinical reality, and data</li>
                    <li>Adoption metrics reviews + board-ready narrative</li>
                  </ul>
                </div>
                <a href="#contact" className="package-cta">Start the conversation</a>
              </div>
            </div>
            <div className="packages-cta-bar">
              <p className="packages-cta-text">Not sure which package fits? Describe where adoption breaks — we'll recommend the right starting point.</p>
              <a href="#contact" className="packages-cta-button">Start the conversation</a>
            </div>
          </div>
        </section>
        
        <section className="section contact-section" id="contact">
          <div className="container">
            <div className="grid contact-grid">
              <div className="contact-form-wrapper">
                <h2 className="contact-headline">Contact Medora</h2>
                <form className="contact-form" id="contactForm">
                  <div className="form-row">
                    <div className="form-group form-group-half">
                      <label htmlFor="name" className="form-label">Name</label>
                      <input type="text" id="name" name="name" className="form-input" required />
                    </div>
                    <div className="form-group form-group-half">
                      <label htmlFor="company" className="form-label">Company</label>
                      <input type="text" id="company" name="company" className="form-input" required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="role" className="form-label">Role</label>
                    <input type="text" id="role" name="role" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" id="email" name="email" className="form-input" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="adoption-breaks" className="form-label">Your message</label>
                    <textarea id="adoption-breaks" name="adoption-breaks" className="form-input form-textarea" rows={6} required></textarea>
                  </div>
                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea id="message" name="message" className="form-input form-textarea" rows={5} required></textarea>
                  </div>
                  <button type="submit" className="form-submit">Start the conversation</button>
                </form>
              </div>
              <div className="contact-info">
                <h2 className="contact-headline">Get in Touch</h2>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-label">Email</span>
                    <a href="mailto:annasolovyova@gmx.de" className="contact-link">annasolovyova@gmx.de</a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Phone</span>
                    <a href="tel:+4915207257777" className="contact-link">+49 152 07257777</a>
                  </div>
                  <div className="contact-item">
                    <span className="contact-label">Location</span>
                    <span className="contact-text">Based in Munich. Working internationally.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="legal-footer" style={{ padding: '3rem 1.5rem', borderTop: '1px solid rgba(243, 241, 236, 0.08)' }}>
          <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
              <Link href="/privacy" style={{ color: 'rgba(185, 175, 154, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                Privacy Policy
              </Link>
              <Link href="/cookie-settings" style={{ color: 'rgba(185, 175, 154, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                Cookie Settings
              </Link>
              <Link href="/imprint" style={{ color: 'rgba(185, 175, 154, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
                Imprint
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </>
  )
}
