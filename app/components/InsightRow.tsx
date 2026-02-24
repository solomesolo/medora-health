'use client'

import type { LucideProps } from 'lucide-react'

export type Insight = {
  id: string
  title: string
  secondary: string
  expertPoints: string[]
  visualStateModifier?: string
}

type IconComponent = React.ComponentType<LucideProps>

type InsightRowProps = {
  insight: Insight
  icon: IconComponent
  isActive: boolean
  sectionEngaged: boolean
  inView: boolean
  onEnter: () => void
  onLeave: () => void
  onToggle?: () => void
  reducedMotion: boolean
}

export default function InsightRow({
  insight,
  icon: Icon,
  isActive,
  sectionEngaged,
  inView,
  onEnter,
  onLeave,
  onToggle,
  reducedMotion,
}: InsightRowProps) {
  return (
    <li
      className="quiet-insight-row"
      data-active={isActive}
      data-engaged={sectionEngaged}
      data-in-view={inView}
    >
      <div className="quiet-insight-icon-rail">
        <div className="quiet-insight-icon-holder" data-active={isActive}>
          <Icon
            className="quiet-insight-icon"
            size={22}
            strokeWidth={1.6}
            aria-hidden
          />
        </div>
      </div>
      <div className="quiet-insight-main">
        <button
          type="button"
          className="quiet-insight-trigger"
          onMouseEnter={onEnter}
          onMouseLeave={onLeave}
          onFocus={onEnter}
          onBlur={onLeave}
          onClick={onToggle}
          aria-expanded={isActive}
          aria-controls={`${insight.id}-expert`}
          id={`${insight.id}-trigger`}
        >
          <span className="quiet-insight-primary">{insight.title}</span>
          <span className="quiet-insight-secondary">{insight.secondary}</span>
        </button>
        <div
          id={`${insight.id}-expert`}
          className="quiet-insight-expert-layer"
          aria-hidden={!isActive}
          data-expanded={isActive}
          data-reduced-motion={reducedMotion}
        >
          <ul className="quiet-insight-expert-list" role="list">
            {insight.expertPoints.map((point, i) => (
              <li key={i} className="quiet-insight-expert-point">
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="quiet-insight-right-rail" aria-hidden="true" />
      <div className="quiet-insight-divider" data-active={isActive} />
    </li>
  )
}
