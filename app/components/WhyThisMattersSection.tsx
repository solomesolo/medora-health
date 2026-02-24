'use client'

import { useState, useCallback } from 'react'
import ThreeForcesField, { ActiveForce } from './ThreeForcesField'

const CARDS: { id: ActiveForce; label: string; text: string }[] = [
  { id: 'patients', label: 'Patients', text: 'Experience uncertainty and anxiety.' },
  { id: 'clinicians', label: 'Clinicians', text: 'Operate under cognitive load.' },
  { id: 'orgs', label: 'Organizations', text: 'Assess risk, trust, and credibility.' },
]

export default function WhyThisMattersSection() {
  const [activeCard, setActiveCard] = useState<ActiveForce>(null)

  const handleCardEnter = useCallback((id: ActiveForce) => () => setActiveCard(id), [])
  const handleCardLeave = useCallback(() => setActiveCard(null), [])

  return (
    <section
      id="why-this-matters"
      className="why-matters-section"
      aria-labelledby="why-matters-heading"
    >
      <div className="why-matters-container">
        <div className="why-matters-grid">
          <div className="why-matters-copy-col">
            <p className="why-matters-eyebrow">WHY THIS MATTERS</p>
            <h2 id="why-matters-heading" className="why-matters-title">
              Why Behavioral & Emotional Design Are Critical in Healthcare
            </h2>
            <p className="why-matters-setup">
              Healthcare decisions are shaped by far more than rational evaluation.
            </p>
            <p className="why-matters-consequence">
              Products that fail to reflect these realities often struggle — regardless of technical excellence.
            </p>
            <p className="why-matters-resolution">
              Medora helps organizations bridge the gap between clinical logic, product design, and human psychology.
            </p>
          </div>

          <div className="why-matters-visual-col">
            <ThreeForcesField activeCard={activeCard} />
          </div>

          <div className="why-matters-cards-row">
            {CARDS.map((card) => (
              <div
                key={card.id}
                className={`why-matters-card ${activeCard === card.id ? 'why-matters-card-active' : ''}`}
                onMouseEnter={handleCardEnter(card.id)}
                onMouseLeave={handleCardLeave}
                onFocus={handleCardEnter(card.id)}
                onBlur={handleCardLeave}
                tabIndex={0}
                role="button"
                aria-pressed={activeCard === card.id}
                aria-label={`${card.label}: ${card.text}`}
              >
                <p className="why-matters-card-label">{card.label}</p>
                <p className="why-matters-card-text">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
