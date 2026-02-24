'use client'

import { useState, useCallback, useEffect } from 'react'

export type Insight = {
  id: string
  title: string
  secondary: string
  expertPoints: string[]
  visualStateModifier?: string
}

const INSIGHTS: Insight[] = [
  {
    id: 'statement-1',
    title: 'Most healthcare products appear to work.',
    secondary: 'Early engagement signals often create a false sense of stability.',
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
    secondary: 'Behavioral decline often starts with hesitation and confidence erosion.',
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
    secondary: 'Small experience costs accumulate into structural behavioral resistance.',
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
    secondary: 'Late intervention drastically increases correction complexity and cost.',
    expertPoints: [
      'Behavioral patterns have already consolidated',
      'Trust repair demands disproportionate effort',
      'Experience redesign now competes with habituated avoidance',
    ],
    visualStateModifier: 'peak',
  },
]

type InteractiveInsightSectionProps = {
  id?: string
  insights?: Insight[]
  className?: string
}

export default function InteractiveInsightSection({
  id = 'interactive-insights',
  insights = INSIGHTS,
  className = '',
}: InteractiveInsightSectionProps) {
  const [activeInsight, setActiveInsight] = useState<string | null>(null)

  const [reducedMotion, setReducedMotion] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const fn = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const handleEnter = useCallback((insightId: string) => {
    setActiveInsight(insightId)
  }, [])

  const handleLeave = useCallback(() => {
    setActiveInsight(null)
  }, [])

  return (
    <section
      id={id}
      className={`interactive-insight-section ${className}`.trim()}
      aria-label="Interactive insights"
      data-active-insight={activeInsight ?? ''}
      data-reduced-motion={reducedMotion ? 'true' : 'false'}
    >
      <div className="interactive-insight-visual" aria-hidden="true" />
      <div className="interactive-insight-container">
        <h2 className="interactive-insight-heading">Quiet Failure</h2>
        <ul className="interactive-insight-list" role="list">
          {insights.map((insight) => {
            const isActive = activeInsight === insight.id
            return (
              <li
                key={insight.id}
                className="interactive-insight-row"
                data-active={isActive}
                data-visual={insight.visualStateModifier ?? ''}
              >
                <button
                  type="button"
                  className="interactive-insight-trigger"
                  onMouseEnter={() => handleEnter(insight.id)}
                  onMouseLeave={handleLeave}
                  onFocus={() => handleEnter(insight.id)}
                  onBlur={() => handleLeave()}
                  aria-expanded={isActive}
                  aria-controls={`${insight.id}-expert`}
                  id={`${insight.id}-trigger`}
                >
                  <span className="interactive-insight-primary">
                    {insight.title}
                  </span>
                  <span className="interactive-insight-secondary">
                    {insight.secondary}
                  </span>
                </button>
                <div
                  id={`${insight.id}-expert`}
                  className="interactive-insight-expert-layer"
                  aria-hidden={!isActive}
                  data-expanded={isActive}
                >
                  <ul className="interactive-insight-expert-list" role="list">
                    {insight.expertPoints.map((point, i) => (
                      <li key={i} className="interactive-insight-expert-point">
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
