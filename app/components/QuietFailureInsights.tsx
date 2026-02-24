'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Activity, Clock, Layers, Waves, Lock } from 'lucide-react'
import InsightRow, { type Insight } from './InsightRow'

const INSIGHTS: Insight[] = [
  {
    id: 'statement-1',
    title: 'Most healthcare products appear to work.',
    secondary:
      'Early engagement signals often create a false sense of stability.',
    expertPoints: [
      'Initial adoption does not guarantee behavioral commitment',
      'Usage consistency is governed by cognitive & emotional variables',
      'Apparent stability frequently masks latent disengagement risk',
    ],
    visualStateModifier: 'ripple',
  },
  {
    id: 'statement-2',
    title: 'Disengagement rarely begins as rejection.',
    secondary:
      'Behavioral decline often starts with hesitation and confidence erosion.',
    expertPoints: [
      'Users delay before they disengage',
      'Micro-frictions reshape effort perception',
      'Trust weakening precedes abandonment',
    ],
    visualStateModifier: 'delay',
  },
  {
    id: 'statement-3',
    title: 'Minor frictions compound silently.',
    secondary:
      'Small experience costs accumulate into structural behavioral resistance.',
    expertPoints: [
      'Friction effects are nonlinear',
      'Cognitive load amplifies disengagement probability',
      'Feature expansion rarely resolves systemic effort problems',
    ],
    visualStateModifier: 'distortion',
  },
  {
    id: 'statement-4',
    title: 'Behavior becomes unstable long before failure is obvious.',
    secondary: 'Engagement volatility precedes measurable adoption decline.',
    expertPoints: [
      'Users repeatedly re-evaluate continuation decisions',
      'Motivation decay accelerates under uncertainty',
      'Trust & clarity deficits destabilize routines',
    ],
    visualStateModifier: 'volatility',
  },
  {
    id: 'statement-5',
    title: 'By the time metrics show the problem, resistance is structural.',
    secondary:
      'Late intervention drastically increases correction complexity and cost.',
    expertPoints: [
      'Behavioral patterns have already consolidated',
      'Trust repair demands disproportionate effort',
      'Experience redesign now competes with habituated avoidance',
    ],
    visualStateModifier: 'peak',
  },
]

const ICON_MAP = {
  'statement-1': Activity,
  'statement-2': Clock,
  'statement-3': Layers,
  'statement-4': Waves,
  'statement-5': Lock,
}

type QuietFailureInsightsProps = {
  id?: string
  insights?: Insight[]
  className?: string
}

export default function QuietFailureInsights({
  id = 'quiet-failure',
  insights = INSIGHTS,
  className = '',
}: QuietFailureInsightsProps) {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sectionEngaged, setSectionEngaged] = useState(false)
  const [inView, setInView] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const fn = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const io = new IntersectionObserver(
      (entries) => {
        setInView(entries[0]?.isIntersecting ?? false)
      },
      { root: null, rootMargin: '80px 0px', threshold: 0.1 }
    )
    io.observe(section)
    return () => io.disconnect()
  }, [])

  const handleMouseMove = useCallback(() => {
    setSectionEngaged(true)
  }, [])

  const handleEnter = useCallback((insightId: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
    setActiveId(insightId)
  }, [])

  const handleLeave = useCallback(() => {
    leaveTimeoutRef.current = setTimeout(() => {
      setActiveId(null)
      leaveTimeoutRef.current = null
    }, 400)
  }, [])

  const handleToggle = useCallback((insightId: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current)
      leaveTimeoutRef.current = null
    }
    setActiveId((prev) => (prev === insightId ? null : insightId))
  }, [])

  return (
    <section
      ref={sectionRef}
      id={id}
      className={`quiet-failure-insights ${className}`.trim()}
      aria-label="Quiet Failure insights"
      data-active-id={activeId ?? ''}
      data-engaged={sectionEngaged}
      data-in-view={inView}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
      onMouseMove={handleMouseMove}
    >
      <div className="quiet-insights-visual" aria-hidden="true" />
      <div className="quiet-insights-container">
        <h2 className="quiet-insights-heading">Quiet Failure</h2>
        <ul className="quiet-insights-list" role="list">
          {insights.map((insight) => {
            const Icon = ICON_MAP[insight.id] ?? Activity
            return (
              <InsightRow
                key={insight.id}
                insight={insight}
                icon={Icon}
                isActive={activeId === insight.id}
                sectionEngaged={sectionEngaged}
                inView={inView}
                onEnter={() => handleEnter(insight.id)}
                onLeave={handleLeave}
                onToggle={() => handleToggle(insight.id)}
                reducedMotion={reducedMotion}
              />
            )
          })}
        </ul>
      </div>
    </section>
  )
}
