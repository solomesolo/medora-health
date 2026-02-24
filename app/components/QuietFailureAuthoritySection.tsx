'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import DegradationFieldCanvas from './DegradationFieldCanvas'

const INSIGHT_LINES = [
  'Disengagement rarely begins as rejection — it begins as hesitation.',
  'Small delays. Minor confusion. Reduced confidence.',
  'These micro-frictions compound until behavior becomes unstable.',
  'By the time metrics show the problem, resistance is already structural.',
]

export default function QuietFailureAuthoritySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [revealStarted, setRevealStarted] = useState(false)
  const [revealPhase, setRevealPhase] = useState<number | undefined>(undefined)
  const hasRevealedRef = useRef(false)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        if (!e?.isIntersecting || hasRevealedRef.current) return
        hasRevealedRef.current = true
        setRevealStarted(true)

        const duration = 480
        const t0 = performance.now()
        const run = (t: number) => {
          const elapsed = t - t0
          if (elapsed >= duration) {
            setRevealPhase(undefined)
            return
          }
          const progress = elapsed / duration
          const eased = 1 - Math.pow(1 - progress, 2)
          setRevealPhase(eased * 0.9)
          requestAnimationFrame(run)
        }
        requestAnimationFrame(run)
      },
      { threshold: 0.2, rootMargin: '0px' }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="framework-authority"
      ref={sectionRef}
      className="framework-authority-section"
      aria-labelledby="framework-authority-heading"
    >
      <div className="framework-authority-container">
        <p className="framework-authority-eyebrow">
          MEDORA&apos;S BEHAVIORAL DESIGN FRAMEWORK
        </p>
        <h2 id="framework-authority-heading" className="framework-authority-headline">
          Most healthcare products don&apos;t fail loudly.
          <br />
          <span className="framework-authority-headline-heavy">They fail quietly.</span>
        </h2>

        <div className="framework-authority-card">
          <DegradationFieldCanvas
            intensity={revealPhase}
            paused={false}
            className="framework-authority-canvas"
          />
        </div>

        <div className="framework-authority-narrative">
          {INSIGHT_LINES.map((line, i) => (
            <p
              key={i}
              className="framework-authority-insight-line"
              style={{
                animation: revealStarted
                  ? `framework-insight-reveal 420ms cubic-bezier(0.22, 1, 0.36, 1) ${i * 120}ms both`
                  : 'none',
                opacity: revealStarted ? undefined : 0,
              }}
            >
              <span className="framework-authority-dot" aria-hidden="true" />
              {line}
            </p>
          ))}
        </div>

        <p className="framework-authority-bridge">
          Medora is designed to detect and resolve these invisible dynamics before adoption degrades.
        </p>

        <div className="framework-authority-cta">
          <Link href="#contact" className="framework-authority-cta-primary">
            Discuss Your Product Challenges
          </Link>
          <Link href="#approach" className="framework-authority-cta-secondary">
            See how we diagnose friction →
          </Link>
        </div>
      </div>
    </section>
  )
}
