'use client'

import { useLayoutEffect, useRef, useState } from 'react'
import Link from 'next/link'
import DecaySimulatorCanvas, { type DecayPhase } from './DecaySimulatorCanvas'

const PHASE_COPY: Record<
  DecayPhase,
  { primary: string; secondary: string }
> = {
  1: {
    primary: 'Engagement often appears stable.',
    secondary: '',
  },
  2: {
    primary: 'Small frictions begin to interfere.',
    secondary: 'They quietly alter effort perception, confidence, and motivation.',
  },
  3: {
    primary: 'Micro-frictions compound over time.',
    secondary: 'Users must repeatedly re-decide whether to continue.',
  },
  4: {
    primary: 'Behavior becomes fragile and inconsistent.',
    secondary: '',
  },
  5: {
    primary: 'By the time metrics detect it, resistance is structural.',
    secondary: '',
  },
  6: {
    primary: 'Engagement often appears stable.',
    secondary: '',
  },
}

const PHASES: DecayPhase[] = [1, 2, 3, 4, 5, 6]

export default function EngagementDecaySimulator() {
  const [phase, setPhase] = useState<DecayPhase>(1)
  const [phaseProgress, setPhaseProgress] = useState(0.5)
  const [hoverNorm, setHoverNorm] = useState<{ x: number; y: number } | null>(null)
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>(new Array(6).fill(null))
  const intersectingRef = useRef<Set<number>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useLayoutEffect(() => {
    let cleanup: (() => void) | undefined

    function setupObserver(sentinels: HTMLDivElement[]) {
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            const index = sentinels.indexOf(e.target as HTMLDivElement)
            if (index < 0) continue
            if (e.isIntersecting) {
              intersectingRef.current.add(index)
            } else {
              intersectingRef.current.delete(index)
            }
          }
          const indices = Array.from(intersectingRef.current)
          if (indices.length > 0) {
            const maxIndex = Math.max(...indices)
            setPhase((maxIndex + 1) as DecayPhase)
            setPhaseProgress(0.5)
          }
        },
        {
          root: null,
          rootMargin: '-15% 0px -25% 0px',
          threshold: [0, 0.01, 0.5, 1],
        }
      )
      sentinels.forEach((el) => io.observe(el))
      return () => io.disconnect()
    }

    const sentinels = sentinelRefs.current.filter(Boolean) as HTMLDivElement[]
    if (sentinels.length > 0) {
      cleanup = setupObserver(sentinels)
    } else {
      const t = setTimeout(() => {
        const retry = sentinelRefs.current.filter(Boolean) as HTMLDivElement[]
        if (retry.length > 0) cleanup = setupObserver(retry)
      }, 0)
      return () => {
        clearTimeout(t)
        cleanup?.()
      }
    }
    return () => cleanup?.()
  }, [])

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setHoverNorm({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    })
  }

  const handlePointerLeave = () => setHoverNorm(null)

  const copy = PHASE_COPY[phase]

  return (
    <section
      id="engagement-decay-simulator"
      className="decay-simulator-section"
      aria-labelledby="decay-simulator-heading"
    >
      <div className="decay-simulator-container">
        <h2 id="decay-simulator-heading" className="decay-simulator-headline">
          How engagement decays
        </h2>

        <div className="decay-simulator-scroll-wrap">
          <div className="decay-simulator-sticky-card">
            <div className="decay-simulator-card decay-simulator-card-active">
              <div className="decay-simulator-card-inner">
                <div className="decay-simulator-card-content">
                  <div className="decay-simulator-card-icon" aria-hidden="true">
                    {phase}
                  </div>
                  <div className="decay-simulator-card-text">
                    <p className="decay-simulator-card-primary">{copy.primary}</p>
                    {copy.secondary && (
                      <p className="decay-simulator-card-secondary">{copy.secondary}</p>
                    )}
                  </div>
                </div>
                <div
                className="decay-simulator-card-visual"
                ref={containerRef}
                onPointerMove={handlePointerMove}
                onPointerLeave={handlePointerLeave}
              >
                <DecaySimulatorCanvas
                  phase={phase}
                  phaseProgress={phaseProgress}
                  hoverNorm={hoverNorm}
                  paused={reducedMotion}
                />
              </div>
              </div>
            </div>
          </div>

          {PHASES.map((_, i) => (
            <div
              key={i}
              ref={(el) => { sentinelRefs.current[i] = el }}
              className="decay-simulator-sentinel"
              data-phase-index={i}
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="decay-simulator-cta">
          <Link href="#contact" className="decay-simulator-cta-primary">
            Discuss Your Product Challenges
          </Link>
          <Link href="#approach" className="decay-simulator-cta-secondary">
            See the diagnostic approach →
          </Link>
        </div>
      </div>
    </section>
  )
}
