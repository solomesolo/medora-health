'use client'

import { useState } from 'react'

interface OutcomeTransform {
  before: string
  after: string
}

const outcomes: OutcomeTransform[] = [
  {
    before: 'Fragmented Product Interaction',
    after: 'Meaningful Engagement & Active Usage'
  },
  {
    before: 'Inconsistent Patient Adherence',
    after: 'Stabilized Behavioral Compliance'
  },
  {
    before: 'Complex / Friction-Heavy Interfaces',
    after: 'Cognitively Clear & Low-Effort Experiences'
  },
  {
    before: 'Weak Trust & Decision Confidence',
    after: 'Stronger Perceived Reliability & Safety'
  },
  {
    before: 'Slow / Resistant Adoption Dynamics',
    after: 'Accelerated Adoption & Commitment Patterns'
  },
  {
    before: 'Feature-Driven Experience Complexity',
    after: 'Behaviorally Efficient Product Structures'
  }
]

function TransitionIndicator({ isHovered }: { isHovered: boolean }) {
  return (
    <div className="outcome-transition-indicator" aria-hidden="true">
      <svg width="48" height="4" viewBox="0 0 48 4" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line 
          x1="2" 
          y1="2" 
          x2="46" 
          y2="2" 
          stroke="rgba(148, 163, 184, 0.35)" 
          strokeWidth="1.5"
          strokeLinecap="round"
          className={isHovered ? 'transition-active' : ''}
        />
        <circle 
          cx={isHovered ? "42" : "24"} 
          cy="2" 
          r="2" 
          fill="rgba(59, 130, 246, 0.45)"
          className={isHovered ? 'transition-active' : ''}
        />
      </svg>
    </div>
  )
}

function OutcomeTransformCard({ outcome, index }: { outcome: OutcomeTransform; index: number }) {
  const [isCardHovered, setIsCardHovered] = useState(false)
  const [isBeforeHovered, setIsBeforeHovered] = useState(false)
  const [isAfterHovered, setIsAfterHovered] = useState(false)

  return (
    <div 
      className="outcome-transform-card"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => setIsCardHovered(false)}
    >
      <div 
        className={`outcome-state outcome-before ${isCardHovered || isBeforeHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsBeforeHovered(true)}
        onMouseLeave={() => setIsBeforeHovered(false)}
      >
        {outcome.before}
      </div>
      
      <TransitionIndicator isHovered={isCardHovered || isAfterHovered} />
      
      <div 
        className={`outcome-state outcome-after ${isCardHovered || isAfterHovered ? 'hovered' : ''}`}
        onMouseEnter={() => setIsAfterHovered(true)}
        onMouseLeave={() => setIsAfterHovered(false)}
      >
        {outcome.after}
      </div>
    </div>
  )
}

export default function OutcomesSection() {
  return (
    <section className="section outcomes-section" id="outcomes">
      <div className="outcomes-background">
        <div className="outcomes-gradient"></div>
      </div>
      <div className="outcomes-container">
        <h2 className="outcomes-title">Outcomes We Commonly Help Clients Achieve</h2>
        
        <div className="outcomes-cards-stack">
          {outcomes.map((outcome, index) => (
            <OutcomeTransformCard key={index} outcome={outcome} index={index} />
          ))}
        </div>

        <p className="outcomes-closing-line">
          Medora's focus is not aesthetic optimization alone — but behavioral performance and adoption dynamics.
        </p>
      </div>
    </section>
  )
}
