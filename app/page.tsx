'use client'

import { useEffect } from 'react'
import Script from 'next/script'
import Link from 'next/link'

export default function HomePage() {
  useEffect(() => {
    // Initialize contact form handler directly
    const initContactForm = () => {
      const contactForm = document.getElementById('contactForm') as HTMLFormElement
      if (!contactForm) {
        setTimeout(initContactForm, 100)
        return
      }

      const handleSubmit = async (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()

        const submitButton = contactForm.querySelector('.form-submit') as HTMLButtonElement
        if (!submitButton) return

        const originalText = submitButton.textContent || 'Start the conversation'
        submitButton.disabled = true
        submitButton.textContent = 'Sending...'

        try {
          const formData = new FormData(contactForm)
          const data = Object.fromEntries(formData)

          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })

          const result = await response.json()

          if (response.ok && result.success) {
            // Hide form
            contactForm.style.transition = 'opacity 0.3s ease'
            contactForm.style.opacity = '0'
            contactForm.style.visibility = 'hidden'
            contactForm.style.height = '0'
            contactForm.style.overflow = 'hidden'
            contactForm.style.margin = '0'
            contactForm.style.padding = '0'

            // Show confirmation
            const formWrapper = contactForm.closest('.contact-form-wrapper')
            if (formWrapper) {
              const existing = formWrapper.querySelector('.form-confirmation')
              if (existing) existing.remove()

              const confirmation = document.createElement('div')
              confirmation.className = 'form-confirmation'
              confirmation.style.cssText = `
                display: block !important;
                opacity: 1 !important;
                visibility: visible !important;
                margin-top: 2rem;
                padding: 2rem;
                background-color: rgba(95, 125, 115, 0.25);
                border: 2px solid rgba(95, 125, 115, 0.5);
                border-radius: 0.75rem;
              `
              confirmation.innerHTML = `
                <div class="form-confirmation-content">
                  <p class="form-confirmation-text" style="font-size: 1.125rem; line-height: 1.6; color: var(--text-primary); margin: 0; font-weight: 500;">
                    We have got your request, our team will contact you soon.
                  </p>
                </div>
              `
              contactForm.insertAdjacentElement('afterend', confirmation)
            }

            contactForm.reset()
          } else {
            throw new Error(result.error || 'Failed to send message')
          }
        } catch (error) {
          console.error('Form error:', error)
          alert('Sorry, there was an error sending your message. Please try again or contact us directly at anna.solovyova@medora.agency')
        } finally {
          submitButton.disabled = false
          submitButton.textContent = originalText
        }
      }

      contactForm.addEventListener('submit', handleSubmit)
      
      // Also add click handler to button
      const submitButton = contactForm.querySelector('.form-submit')
      if (submitButton) {
        submitButton.addEventListener('click', (e) => {
          e.preventDefault()
          handleSubmit(e)
        })
      }

      console.log('✅ Contact form handler initialized directly in React')
    }

    // Initialize contact form
    initContactForm()

    // Check if we're in vertical scroll mode before loading the script
    if (typeof window !== 'undefined') {
      const loadScript = () => {
        // Remove existing script if any
        const existing = document.querySelector('script[src*="/js/main.js"]')
        if (existing) existing.remove()
        
        const script = document.createElement('script')
        script.src = '/js/main.js?v=75' // Increment version to force reload
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
                  target.classList.contains('hero-support') ||
                  target.classList.contains('hero-ctas') ||
                  target.classList.contains('hero-proof')) {
                target.classList.add('animate')
              }
              // Add animate class to engagement cards
              if (target.classList.contains('engagement-card') || target.getAttribute('data-animate') === 'card') {
                target.classList.add('animate')
              }
            })
            
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
      
      // Set up reality section rail indicator (runs in both vertical and horizontal modes)
      const setupRealityRail = () => {
        const realitySection = document.getElementById('reality')
        if (!realitySection) return
        
        const railIndicator = document.getElementById('railIndicator')
        const railLabels = realitySection.querySelectorAll('.rail-label')
        const items = realitySection.querySelectorAll('[data-animate="item"]')
        
        if (!railIndicator || !railLabels.length || !items.length) return
        
        let clickedIndex: number | null = null
        const indexToStage: { [key: number]: string } = {
          0: 'DEMO',
          1: 'PILOT',
          2: 'PILOT',
          3: 'USAGE',
          4: 'USAGE'
        }
        
        const updateRail = (stage: string) => {
          railIndicator.setAttribute('data-stage', stage)
          railLabels.forEach((label) => {
            if (label.getAttribute('data-stage') === stage) {
              label.classList.add('active')
            } else {
              label.classList.remove('active')
            }
          })
        }
        
        // Set default state (PILOT)
        updateRail('PILOT')
        
        items.forEach((item, index) => {
          const stage = item.getAttribute('data-stage') || indexToStage[index]
          
          const handleClick = (e: MouseEvent) => {
            e.preventDefault()
            e.stopPropagation()
            items.forEach((i) => i.classList.remove('active'))
            item.classList.add('active')
            updateRail(stage)
            clickedIndex = index
          }
          
          const handleEnter = () => {
            if (clickedIndex === null) {
              item.classList.add('active')
              updateRail(stage)
            }
          }
          
          const handleLeave = () => {
            if (clickedIndex !== index) {
              item.classList.remove('active')
              if (clickedIndex === null) {
                updateRail('PILOT')
              }
            }
          }
          
          if (item instanceof HTMLElement) {
            if (item.tagName === 'BUTTON') {
              item.setAttribute('type', 'button')
            }
            item.addEventListener('click', handleClick)
            item.addEventListener('mouseenter', handleEnter)
            item.addEventListener('mouseleave', handleLeave)
            item.addEventListener('focus', () => {
              item.classList.add('active')
              updateRail(stage)
            })
            item.addEventListener('blur', () => {
              if (clickedIndex !== index) {
                item.classList.remove('active')
              }
            })
          }
        })
      }
      
      // Initialize reality rail after a short delay to ensure DOM is ready
      setTimeout(() => {
        setupRealityRail()
      }, 500)
      
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
                <p className="hero-support" data-animate="2">For B2B clinical products and B2C and D2C medical products where adoption never becomes routine.</p>
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
                <div className="hero-image-wrapper"></div>
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
                <p className="reality-subtitle">Interest is high. Pilots run. Products launch. Adoption breaks quietly, and growth stalls before teams realize why.</p>
              </div>
              <div className="reality-editorial-grid">
                <div className="reality-editorial-list">
                  <button className="reality-list-item" data-animate="item" data-index="0" data-stage="DEMO" tabIndex={0}>
                    <span className="reality-item-number">01</span>
                    <span className="reality-item-text">Sales reports strong interest, but no one owns activation after the demo.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="1" data-stage="PILOT" tabIndex={0}>
                    <span className="reality-item-number">02</span>
                    <span className="reality-item-text">Clinical usage is inconsistent across teams and sites, and pilots stall without a clear path to scale.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="2" data-stage="PILOT" tabIndex={0}>
                    <span className="reality-item-number">03</span>
                    <span className="reality-item-text">Hospitals agree to continue, but internal ownership remains unclear.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="3" data-stage="USAGE" tabIndex={0}>
                    <span className="reality-item-number">04</span>
                    <span className="reality-item-text">Patients onboard or clinicians try the product, then engagement drops.</span>
                  </button>
                  <div className="reality-item-divider"></div>
                  <button className="reality-list-item" data-animate="item" data-index="4" data-stage="USAGE" tabIndex={0}>
                    <span className="reality-item-number">05</span>
                    <span className="reality-item-text">Leadership is asked to defend adoption metrics they do not fully trust.</span>
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
                  <p className="failure-intro">Adoption does not fail randomly. It fails when there is no system carrying intent into routine behavior, for clinicians and for patients.</p>
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
                            <li>Buying intent is validated, but no one owns behavior change after the demo, whether the user is a clinician or a patient.</li>
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
                            <li>Clinical, operational, and trust constraints surface late. Pilots lack a clear path to scale or internal ownership.</li>
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
                            <li>Onboarding optimizes first use, not repetition. Habits do not form, and sustained usage never stabilizes.</li>
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
                  <p className="medora-does-block-text">The outcome is a repeatable system that turns pilots and launches into routine usage, usage into revenue, and revenue into proof leadership can defend.</p>
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
                    <p className="card-description" style={{ display: 'block', opacity: 1, visibility: 'visible' }}>A sequenced plan that defines what changes, who owns it, and how adoption success is measured for clinicians or patients.</p>
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
        
        <section className="section failure-section" id="audience">
          <div className="failure-background">
            <div className="failure-gradient"></div>
            <div className="failure-grid"></div>
            <div className="failure-grain"></div>
          </div>
          <div className="failure-container">
            <div className="failure-grid-12">
              <div className="failure-left">
                <div className="failure-header" data-animate="header">
                  <p className="failure-badge">Who Medora Is For</p>
                  <h2 className="failure-headline">Nearly 70% of healthcare products fail due to poor market fit.</h2>
                  <p className="failure-intro">Our mission is to help your company define the right strategy and build a clear path to success.</p>
                </div>
                <div className="failure-reasons-list">
                  <div className="who-subsection" data-animate="subsection">
                  </div>
                </div>
              </div>
              <div className="failure-right">
                <div className="failure-panel-sticky">
                  <div className="failure-panel" id="whoMedoraForCard">
                    <div className="failure-panel-title">Who Medora Is For</div>
                    <div className="failure-pipeline">
                      <div className="failure-pipeline-stage" data-step="B2B">
                        <div className="pipeline-stage-badge">1</div>
                        <div className="pipeline-stage-content">
                          <div className="pipeline-stage-label">B2B CLINICAL</div>
                          <div className="pipeline-stage-title">If you build B2C and D2C medical products</div>
                          <ul className="pipeline-stage-bullets">
                            <li>Patients onboard, but habits do not form.</li>
                            <li>Engagement drops after early use.</li>
                            <li>Usage metrics are hard to defend to partners, payers, or investors.</li>
                            <li>Growth stalls despite strong early signals.</li>
                          </ul>
                        </div>
                      </div>
                      <div className="pipeline-divider"></div>
                      <div className="failure-pipeline-stage" data-step="B2C">
                        <div className="pipeline-stage-badge">2</div>
                        <div className="pipeline-stage-content">
                          <div className="pipeline-stage-label">B2C & D2C</div>
                          <div className="pipeline-stage-title">If you build B2C and D2C medical products</div>
                          <ul className="pipeline-stage-bullets">
                            <li>Patients onboard, but habits do not form.</li>
                            <li>Engagement drops after early use.</li>
                            <li>Usage metrics are hard to defend to partners, payers, or investors.</li>
                            <li>Growth stalls despite strong early signals.</li>
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
                  <p className="package-deliverables-intro">The Adoption Sprint is designed to fix adoption before patterns harden and become difficult to reverse.</p>
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
                <form className="contact-form" id="contactForm" action="#" method="post" onSubmit={(e) => e.preventDefault()}>
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
                  <button type="submit" className="form-submit">Start the conversation</button>
                </form>
              </div>
              <div className="contact-info">
                <h2 className="contact-headline">Get in Touch</h2>
                <div className="contact-details">
                  <div className="contact-item">
                    <span className="contact-label">Email</span>
                    <a href="mailto:anna.solovyova@medora.agency" className="contact-link">anna.solovyova@medora.agency</a>
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
