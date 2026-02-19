'use client'

import { useState } from 'react'

interface Symptom {
  id: string
  text: string
  microMeaning: string
}

const symptoms: Symptom[] = [
  {
    id: 'symptom-1',
    text: 'Users register but do not remain meaningfully active',
    microMeaning: 'Implies that initial curiosity or obligation exists, but sustained value, motivation, or behavioral reinforcement may be weak.'
  },
  {
    id: 'symptom-2',
    text: 'Engagement declines despite continuous product updates',
    microMeaning: 'Suggests disengagement drivers may not be feature-related, but rooted in cognitive load, perceived effort, or experience friction.'
  },
  {
    id: 'symptom-3',
    text: 'Retention metrics remain unstable or disappointing',
    microMeaning: 'Often associated with inconsistent habit formation, unclear mental models, or insufficient trust consolidation.'
  },
  {
    id: 'symptom-4',
    text: 'Marketing spend increases while behavioral change remains limited',
    microMeaning: 'Common when awareness grows but underlying adoption barriers remain structurally unresolved.'
  },
  {
    id: 'symptom-5',
    text: 'Users understand the product yet do not fully commit to using it',
    microMeaning: 'Understanding does not guarantee action. Decision confidence, perceived cost, and emotional comfort strongly influence commitment.'
  },
  {
    id: 'symptom-6',
    text: 'Adoption cycles extend beyond expectations',
    microMeaning: 'May indicate hesitation dynamics, risk perception, stakeholder misalignment, or delayed trust formation.'
  },
  {
    id: 'symptom-7',
    text: 'Product usage depends more on obligation than motivation',
    microMeaning: 'Typically signals fragile engagement. Behavior driven by pressure rarely stabilizes long-term usage patterns.'
  }
]

const commonExplanations = [
  {
    text: 'Users need more education',
    reveal: 'Often a symptom, not a cause.'
  },
  {
    text: 'We need stronger promotion',
    reveal: 'Often a symptom, not a cause.'
  },
  {
    text: 'The market is not ready yet',
    reveal: 'Often a symptom, not a cause.'
  },
  {
    text: 'Healthcare adoption simply takes time',
    reveal: 'Often a symptom, not a cause.'
  }
]

// Icon Components
function FragmentedRing({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 4" opacity="0.6" />
      <circle cx="32" cy="32" r="18" stroke="currentColor" strokeWidth="1" opacity="0.4" />
      <path d="M 32 8 L 32 14 M 32 50 L 32 56" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

function InterruptedPath({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 12 32 L 24 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="28" cy="32" r="3" fill="currentColor" opacity="0.3" />
      <path d="M 36 32 L 52 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 32 20 L 32 28 M 32 36 L 32 44" stroke="currentColor" strokeWidth="1" opacity="0.4" />
    </svg>
  )
}

function PathWithBarrier({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 16 32 L 48 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="28" y="24" width="8" height="16" fill="currentColor" opacity="0.15" />
      <path d="M 30 28 L 34 28 M 30 36 L 34 36" stroke="currentColor" strokeWidth="1.5" opacity="0.5" />
    </svg>
  )
}

function SplitDecision({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 32 16 L 32 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M 32 32 L 20 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M 32 32 L 44 44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <circle cx="32" cy="32" r="2" fill="currentColor" />
    </svg>
  )
}

function SoftCenterFade({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="20" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />
      <circle cx="32" cy="32" r="12" fill="currentColor" opacity="0.1" />
      <circle cx="32" cy="32" r="6" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

function PausedProgress({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 16 32 L 32 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <rect x="30" y="28" width="4" height="8" fill="currentColor" opacity="0.4" />
      <rect x="36" y="28" width="4" height="8" fill="currentColor" opacity="0.4" />
      <path d="M 44 32 L 48 32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.3" />
    </svg>
  )
}

function DistortedGrid({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M 16 16 L 16 48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M 32 16 L 32 48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M 48 16 L 48 48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M 16 16 L 48 16" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M 16 32 L 48 32" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <path d="M 16 48 L 48 48" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      <circle cx="32" cy="32" r="3" fill="currentColor" opacity="0.2" />
    </svg>
  )
}

function InterferenceBands({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="20" width="40" height="4" fill="currentColor" opacity="0.2" />
      <rect x="12" y="28" width="40" height="4" fill="currentColor" opacity="0.3" />
      <rect x="12" y="36" width="40" height="4" fill="currentColor" opacity="0.2" />
      <path d="M 28 20 L 36 44" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
    </svg>
  )
}

function IconField({ patternState }: { patternState: 'none' | 'early' | 'emerging' | 'structural' | string }) {
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  
  const getIconsForState = () => {
    switch (patternState) {
      case 'early':
        return [
          { Component: FragmentedRing, delay: 0 },
          { Component: InterruptedPath, delay: 0.2 }
        ]
      case 'emerging':
        return [
          { Component: PathWithBarrier, delay: 0 },
          { Component: SplitDecision, delay: 0.15 },
          { Component: SoftCenterFade, delay: 0.3 }
        ]
      case 'structural':
        return [
          { Component: DistortedGrid, delay: 0 },
          { Component: InterferenceBands, delay: 0.1 },
          { Component: PausedProgress, delay: 0.2 },
          { Component: SoftCenterFade, delay: 0.3 },
          { Component: PathWithBarrier, delay: 0.4 }
        ]
      default:
        return []
    }
  }

  const icons = getIconsForState()

  return (
    <div className="behavioral-icon-field" data-state={patternState}>
      <div className="icon-field-backdrop"></div>
      <div className="icon-field-container">
        {icons.map(({ Component, delay }, index) => (
          <div
            key={index}
            className="behavioral-icon-wrapper"
            style={{
              animationDelay: reducedMotion ? '0s' : `${delay}s`,
              '--icon-index': index
            } as React.CSSProperties & { '--icon-index': number }}
          >
            <Component className="behavioral-icon" />
          </div>
        ))}
      </div>
    </div>
  )
}

function PatternReveal({ selectedCount, selectedIds }: { selectedCount: number; selectedIds: Set<string> }) {
  const [showWhyPanel, setShowWhyPanel] = useState(false)

  // Check for special override combinations
  const checkOverrideCombinations = () => {
    const ids = Array.from(selectedIds)
    
    // Combo: (1) + (5) - Understanding Without Commitment Pattern
    if (ids.includes('symptom-1') && ids.includes('symptom-5') && ids.length === 2) {
      return {
        patternLabel: 'Understanding Without Commitment Pattern',
        interpretation: 'Users appear cognitively aware of the product, yet behavioral activation remains weak.',
        bullets: [
          'Low perceived urgency or value reinforcement',
          'Hidden effort or trust barriers',
          'Insufficient decision confidence triggers'
        ],
        causeBridge: 'This often indicates a gap between cognitive understanding and behavioral activation.'
      }
    }
    
    // Combo: (2) + (4) - Iteration Without Engagement Recovery
    if (ids.includes('symptom-2') && ids.includes('symptom-4') && ids.length === 2) {
      return {
        patternLabel: 'Iteration Without Engagement Recovery',
        interpretation: 'Product evolution and promotion efforts are active, yet engagement continues to erode.',
        bullets: [
          'Root causes are rarely feature gaps',
          'Behavioral friction frequently remains undiagnosed',
          'Experience architecture may conflict with real usage psychology'
        ],
        causeBridge: 'In similar cases, the underlying barriers are typically structural rather than functional.'
      }
    }
    
    // Combo: (3) + (7) - Fragile Retention Structure
    if (ids.includes('symptom-3') && ids.includes('symptom-7') && ids.length === 2) {
      return {
        patternLabel: 'Fragile Retention Structure',
        interpretation: 'Usage appears externally sustained rather than internally stabilized.',
        bullets: [
          'Weak habit formation mechanisms',
          'Limited intrinsic motivation',
          'Experience friction or perceived effort fatigue'
        ],
        causeBridge: 'This pattern often involves engagement that depends on external pressure rather than internal drivers.'
      }
    }
    
    // Combo: (5) + (6) - Decision Hesitation Pattern
    if (ids.includes('symptom-5') && ids.includes('symptom-6') && ids.length === 2) {
      return {
        patternLabel: 'Decision Hesitation Pattern',
        interpretation: 'Users appear informed yet delay adoption or sustained engagement.',
        bullets: [
          'Risk perception or trust uncertainty',
          'Cognitive overload in decision moments',
          'Misaligned perceived cost vs value'
        ],
        causeBridge: 'Frequently linked to hesitation dynamics that prevent commitment despite understanding.'
      }
    }
    
    return null
  }

  const getPatternInsight = () => {
    if (selectedCount === 0) {
      return {
        patternLabel: '',
        interpretation: 'Select symptoms to reveal behavioral friction patterns.',
        bullets: [],
        causeBridge: ''
      }
    }
    
    // Check override combinations first
    const override = checkOverrideCombinations()
    if (override) {
      return override
    }
    
    // State A - Early Behavioral Friction Pattern (1-2 items)
    if (selectedCount <= 2) {
      return {
        patternLabel: 'Early Behavioral Resistance Signals',
        interpretation: 'Your selections reflect conditions commonly observed in products where:',
        bullets: [
          'Initial adoption occurs, but sustained engagement drivers may be fragile',
          'Users may not be forming stable usage habits',
          'Experience or motivation structures may require reinforcement'
        ],
        causeBridge: 'These patterns rarely stem from user indifference. They often emerge from subtle mismatches between product logic and human decision dynamics.'
      }
    }
    
    // State B - Emerging Structural Friction Pattern (3-4 items)
    if (selectedCount <= 4) {
      return {
        patternLabel: 'Emerging Behavioral Friction Pattern',
        interpretation: 'Your selections suggest a recognizable engagement risk structure:',
        bullets: [
          'Users interact with the product but struggle to sustain active usage',
          'Iterations and updates may not be addressing core adoption barriers',
          'Behavioral commitment appears inconsistent or externally driven'
        ],
        causeBridge: 'In similar scenarios, disengagement often persists because the underlying frictions are cognitive or emotional — not functional.'
      }
    }
    
    // State C - Structural Engagement Friction Pattern (5+ items)
    return {
      patternLabel: 'Structural Engagement Friction Pattern',
      interpretation: 'Your selections reflect patterns frequently associated with adoption instability:',
      bullets: [
        'Users may understand the product yet hesitate to internalize usage',
        'Engagement may depend on obligation, reminders, or external pressure',
        'Feature expansion and promotion alone rarely resolve the issue'
      ],
      causeBridge: 'These dynamics typically indicate deeper behavioral, cognitive, or trust-related barriers within the product experience.'
    }
  }

  const { patternLabel, interpretation, bullets, causeBridge } = getPatternInsight()

  // Determine pattern state for icon system
  const getPatternState = (): 'none' | 'early' | 'emerging' | 'structural' => {
    if (selectedCount === 0) return 'none'
    if (selectedCount <= 2) return 'early'
    if (selectedCount <= 4) return 'emerging'
    return 'structural'
  }

  const patternState = getPatternState()

  return (
    <div className="pattern-reveal">
      {patternLabel && (
        <h3 className="pattern-reveal-label" key={patternLabel}>{patternLabel}</h3>
      )}
      
      {selectedCount > 0 ? (
        <>
          <p className="pattern-reveal-interpretation" key={`interpretation-${selectedCount}`}>{interpretation}</p>
          
          {bullets.length > 0 && (
            <ul className="pattern-reveal-bullets" key={`bullets-${selectedCount}`}>
              {bullets.map((bullet, index) => (
                <li key={index}>{bullet}</li>
              ))}
            </ul>
          )}
          
          <p className="pattern-reveal-bridge" key={`bridge-${selectedCount}`}>
            {causeBridge}
          </p>
          
          <p className="pattern-reveal-closing">
            These patterns are predictable and diagnosable.
            They rarely resolve through feature expansion or promotion alone.
          </p>
          
          <button
            className="pattern-reveal-why-trigger"
            onClick={() => setShowWhyPanel(!showWhyPanel)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setShowWhyPanel(!showWhyPanel)
              }
            }}
            aria-expanded={showWhyPanel}
            type="button"
          >
            Why do these patterns emerge?
            <span className={`why-chevron ${showWhyPanel ? 'open' : ''}`} aria-hidden="true">▼</span>
          </button>
          
          <div className={`pattern-reveal-why-panel ${showWhyPanel ? 'open' : ''}`}>
            <p className="pattern-reveal-why-content">
              Because healthcare decisions are rarely governed by rational evaluation alone.
              Attention, perceived effort, trust, and emotional safety strongly influence whether users sustain engagement.
            </p>
          </div>
        </>
      ) : (
        <p className="pattern-reveal-interpretation">{interpretation}</p>
      )}
    </div>
  )
}

// Export pattern state getter for use in parent
export function getPatternStateFromCount(selectedCount: number): 'none' | 'early' | 'emerging' | 'structural' {
  if (selectedCount === 0) return 'none'
  if (selectedCount <= 2) return 'early'
  if (selectedCount <= 4) return 'emerging'
  return 'structural'
}

function CommonExplanationsDrawer() {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className="common-explanations-drawer">
      <button
        className="common-explanations-trigger"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setIsOpen(!isOpen)
          }
        }}
        aria-expanded={isOpen}
        aria-label="Toggle common explanations"
        type="button"
      >
        Common internal explanations
        <span className={`drawer-chevron ${isOpen ? 'open' : ''}`} aria-hidden="true">▼</span>
      </button>
      <div className={`common-explanations-panel ${isOpen ? 'open' : ''}`}>
        {commonExplanations.map((item, index) => (
          <div
            key={index}
            className="common-explanation-chip"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                setHoveredIndex(hoveredIndex === index ? null : index)
              }
            }}
            aria-label={`${item.text}. ${item.reveal}`}
          >
            <span className="explanation-quote">"{item.text}"</span>
            {hoveredIndex === index && (
              <span className="explanation-reveal">{item.reveal}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function FrictionMirrorSection() {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  const toggleSymptom = (id: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedItems(newSelected)
  }

  return (
    <section className="section friction-mirror-section" id="friction-mirror">
      <div className="friction-mirror-background">
        <div className="friction-mirror-base"></div>
      </div>
      <div className="friction-mirror-container">
        <div className="friction-mirror-grid-12">
          <div className="friction-mirror-content-left">
            <h2 className="friction-mirror-title">If You Work on a Healthcare Product, These Patterns May Be Familiar</h2>
            <p className="friction-mirror-hint">Select what you're seeing — we'll reflect the likely friction pattern.</p>
            
            <div className="friction-symptoms-list">
              {symptoms.map((symptom) => {
                const isSelected = selectedItems.has(symptom.id)
                return (
                  <div
                    key={symptom.id}
                    className={`friction-symptom-card-wrapper ${isSelected ? 'active' : ''}`}
                  >
                    <button
                      className={`friction-symptom-card ${isSelected ? 'active' : ''}`}
                      onClick={() => toggleSymptom(symptom.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggleSymptom(symptom.id)
                        }
                      }}
                      aria-pressed={isSelected}
                      type="button"
                    >
                      <div className="symptom-indicator">
                        {isSelected ? (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <circle cx="4" cy="4" r="3" fill="currentColor" />
                          </svg>
                        ) : (
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1" fill="none" />
                          </svg>
                        )}
                      </div>
                      <div className="symptom-content">
                        <span className="symptom-text">{symptom.text}</span>
                      </div>
                    </button>
                    {isSelected && (
                      <div className="symptom-micro-meaning-panel">
                        <span className="symptom-micro-meaning">{symptom.microMeaning}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <CommonExplanationsDrawer />

            <div className="friction-mirror-closing">
              <div className="friction-mirror-divider"></div>
              <p className="friction-mirror-closing-text">
                These are precisely the problems Medora is designed to diagnose and resolve.
              </p>
              <a href="#solution" className="friction-mirror-cta-nudge">See how we diagnose friction →</a>
            </div>
          </div>

          <div className="friction-mirror-visual-right">
            <IconField patternState={getPatternStateFromCount(selectedItems.size)} />
            <PatternReveal selectedCount={selectedItems.size} selectedIds={selectedItems} />
          </div>
        </div>
      </div>
    </section>
  )
}
