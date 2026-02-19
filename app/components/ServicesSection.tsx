'use client'

import { useState } from 'react'

// Input Types
type ProductType = 'digital-health' | 'medical-device' | 'clinician-tool' | 'platform-workflow' | null
type Challenge = 'adoption-onboarding' | 'retention-engagement' | 'trust-safety' | 'workflow-friction' | 'adherence-behavior'
type Audience = 'patients' | 'clinicians' | 'buyers-stakeholders' | 'mixed-b2b-b2c' | null
type Lifecycle = 'early-build' | 'live-issues' | 'scaling-optimization' | 'repositioning-expansion' | null

interface PlanStep {
  number: number
  title: string
  description: string
  deliverables: string[]
}

interface PlanData {
  steps: PlanStep[]
  frictionDrivers: string[]
  whyText: string
}

// Plan generation logic based on challenge modes
function generatePlan(
  challenges: Challenge[],
  audience: Audience,
  lifecycle: Lifecycle
): PlanData {
  // Determine primary challenge mode (first selected challenge drives most logic)
  const primaryChallenge = challenges[0] || 'adoption-onboarding'

  // Base plan structure (always 4 steps)
  let steps: PlanStep[] = []
  let frictionDrivers: string[] = []
  let whyText = ''

  // MODE 1: Adoption & Onboarding Drop-off
  if (primaryChallenge === 'adoption-onboarding') {
    steps = [
      {
        number: 1,
        title: 'Diagnose Human Friction',
        description: 'We analyze where users hesitate, delay, or disengage during early interactions.',
        deliverables: [
          'Onboarding friction audit',
          'First-use decision analysis',
          'Expectation vs experience mapping'
        ]
      },
      {
        number: 2,
        title: 'Map Decision & Motivation Patterns',
        description: 'We identify cognitive and motivational blockers preventing sustained adoption.',
        deliverables: [
          'Behavioral trigger mapping',
          'Decision confidence analysis',
          'Motivation decay patterns'
        ]
      },
      {
        number: 3,
        title: 'Design for Trust & Behavioral Action',
        description: 'We restructure activation flows to support confidence, clarity, and momentum.',
        deliverables: [
          'Activation flow redesign',
          'Behavioral reinforcement logic',
          'Perceived effort reduction'
        ]
      },
      {
        number: 4,
        title: 'Validate & Refine',
        description: 'We test in realistic early-use conditions to ensure friction reduction.',
        deliverables: [
          'First-session behavior validation',
          'Cognitive load observation',
          'Iterative friction reduction'
        ]
      }
    ]
    frictionDrivers = [
      'Unclear immediate value perception',
      'Cognitive overload during onboarding',
      'Weak behavioral reinforcement signals'
    ]
    whyText = 'Early adoption failures rarely stem from lack of features. They commonly originate from decision uncertainty, perceived effort, and attention dynamics.'
  }

  // MODE 2: Retention / Engagement Decay
  else if (primaryChallenge === 'retention-engagement') {
    steps = [
      {
        number: 1,
        title: 'Diagnose Human Friction',
        description: 'We map drop-off zones and fatigue dynamics that interrupt sustained engagement.',
        deliverables: [
          'Engagement decay analysis',
          'Behavioral interruption mapping',
          'Re-engagement failure points'
        ]
      },
      {
        number: 2,
        title: 'Map Decision & Motivation Patterns',
        description: 'We analyze habit formation structures and attention competition patterns.',
        deliverables: [
          'Habit loop diagnostics',
          'Motivation sustainability analysis',
          'Usage resistance patterns'
        ]
      },
      {
        number: 3,
        title: 'Design for Trust & Behavioral Action',
        description: 'We rebuild engagement architecture to support behavioral continuity and reduced effort perception.',
        deliverables: [
          'Engagement architecture redesign',
          'Behavioral continuity mechanisms',
          'Cognitive effort smoothing'
        ]
      },
      {
        number: 4,
        title: 'Validate & Refine',
        description: 'We validate across multiple sessions to ensure behavioral consistency.',
        deliverables: [
          'Multi-session engagement validation',
          'Behavioral consistency testing',
          'Friction regression detection'
        ]
      }
    ]
    frictionDrivers = [
      'Weak habit formation structures',
      'Attention fragmentation',
      'Experience fatigue or effort perception'
    ]
    whyText = 'Retention instability typically signals structural behavioral friction rather than feature gaps.'
  }

  // MODE 3: Trust & Perceived Safety
  else if (primaryChallenge === 'trust-safety') {
    steps = [
      {
        number: 1,
        title: 'Diagnose Human Friction',
        description: 'We audit trust formation barriers and risk perception breakdown points.',
        deliverables: [
          'Trust signal audit',
          'Risk perception mapping',
          'Reassurance breakdown points'
        ]
      },
      {
        number: 2,
        title: 'Map Decision & Motivation Patterns',
        description: 'We analyze decision safety dynamics and emotional resistance patterns.',
        deliverables: [
          'Decision safety analysis',
          'Perceived reliability diagnostics',
          'Emotional resistance patterns'
        ]
      },
      {
        number: 3,
        title: 'Design for Trust & Behavioral Action',
        description: 'We design clarity, reassurance, and credibility cues that support decision confidence.',
        deliverables: [
          'Trust-supportive UI logic',
          'Confidence reinforcement structures',
          'Perceived safety architecture'
        ]
      },
      {
        number: 4,
        title: 'Validate & Refine',
        description: 'We validate trust perception and decision comfort in realistic contexts.',
        deliverables: [
          'Trust perception validation',
          'Decision comfort testing',
          'Anxiety-trigger detection'
        ]
      }
    ]
    frictionDrivers = [
      'Ambiguous reliability cues',
      'Perceived risk or uncertainty',
      'Insufficient reassurance signals'
    ]
    whyText = 'In healthcare contexts, trust dynamics often override functional evaluation.'
  }

  // MODE 4: Complex Workflow Friction
  else if (primaryChallenge === 'workflow-friction') {
    steps = [
      {
        number: 1,
        title: 'Diagnose Human Friction',
        description: 'We map workflow friction points and cognitive load hotspots.',
        deliverables: [
          'Workflow friction mapping',
          'Cognitive load hotspots',
          'Interaction resistance analysis'
        ]
      },
      {
        number: 2,
        title: 'Map Decision & Motivation Patterns',
        description: 'We analyze task-switching stress and effort perception patterns.',
        deliverables: [
          'Task-switching stress analysis',
          'Effort perception modeling',
          'Error-risk perception study'
        ]
      },
      {
        number: 3,
        title: 'Design for Trust & Behavioral Action',
        description: 'We simplify workflows and reduce cognitive load while maintaining clarity.',
        deliverables: [
          'Workflow simplification models',
          'Cognitive load reduction design',
          'Decision clarity optimization'
        ]
      },
      {
        number: 4,
        title: 'Validate & Refine',
        description: 'We validate efficiency and fatigue reduction in realistic usage simulations.',
        deliverables: [
          'Realistic usage simulations',
          'Efficiency & fatigue testing',
          'Cognitive strain observation'
        ]
      }
    ]
    frictionDrivers = [
      'Excessive mental processing demand',
      'Fragmented interaction logic',
      'Perceived effort inflation'
    ]
    whyText = 'Complex workflows fail when cognitive load exceeds user capacity or when interaction patterns create unnecessary mental overhead.'
  }

  // MODE 5: Adherence & Behavior Change
  else if (primaryChallenge === 'adherence-behavior') {
    steps = [
      {
        number: 1,
        title: 'Diagnose Human Friction',
        description: 'We identify adherence barriers and behavioral resistance patterns.',
        deliverables: [
          'Adherence barrier analysis',
          'Motivation volatility mapping',
          'Behavioral resistance detection'
        ]
      },
      {
        number: 2,
        title: 'Map Decision & Motivation Patterns',
        description: 'We model compliance psychology and habit persistence dynamics.',
        deliverables: [
          'Compliance psychology modeling',
          'Reward / effort perception study',
          'Habit persistence diagnostics'
        ]
      },
      {
        number: 3,
        title: 'Design for Trust & Behavioral Action',
        description: 'We build behavioral reinforcement systems that sustain motivation and minimize effort.',
        deliverables: [
          'Behavioral reinforcement systems',
          'Motivation sustainment design',
          'Effort minimization structures'
        ]
      },
      {
        number: 4,
        title: 'Validate & Refine',
        description: 'We validate behavioral persistence and adherence durability over time.',
        deliverables: [
          'Behavioral persistence validation',
          'Adherence durability testing',
          'Drop-off trigger detection'
        ]
      }
    ]
    frictionDrivers = [
      'Motivation volatility',
      'Effort-reward misalignment',
      'Weak behavioral reinforcement loops'
    ]
    whyText = 'Adherence challenges require sustained behavioral support structures, not one-time interventions.'
  }

  // Apply modifiers: Audience first, then Lifecycle
  let modifiedPlan = { steps, frictionDrivers, whyText }
  
  if (audience) {
    modifiedPlan = applyAudienceModifier(modifiedPlan, audience, primaryChallenge)
  }
  
  if (lifecycle) {
    modifiedPlan = applyLifecycleModifier(modifiedPlan, lifecycle, primaryChallenge)
  }

  return modifiedPlan
}

// Audience Modifier: Changes friction physics, diagnostic priorities, deliverables
function applyAudienceModifier(
  plan: PlanData,
  audience: Audience,
  challenge: Challenge
): PlanData {
  const { steps, frictionDrivers, whyText } = plan
  let modifiedSteps = [...steps]
  let modifiedDrivers = [...frictionDrivers]
  let modifiedWhy = whyText

  if (audience === 'patients') {
    // Patients: Emotional uncertainty, limited attention, motivation volatility
    modifiedSteps = steps.map((step, index) => {
      if (index === 0) {
        // Step 1: Diagnose Human Friction
        return {
          ...step,
          description: 'We analyze perceived effort barriers, anxiety triggers, and attention loss points that interrupt patient engagement.',
          deliverables: [
            'Emotional friction mapping',
            'Attention & effort analysis',
            'Reassurance signal audit',
            'Clarity & uncertainty gaps'
          ]
        }
      } else if (index === 1) {
        // Step 2: Map Decision & Motivation Patterns
        return {
          ...step,
          description: 'We identify motivation sustainability patterns, behavioral resistance, and habit fragility in patient contexts.',
          deliverables: [
            'Motivation decay analysis',
            'Behavioral activation triggers',
            'Trust formation dynamics',
            'Emotional safety patterns'
          ]
        }
      } else if (index === 2) {
        // Step 3: Design for Trust & Behavioral Action
        return {
          ...step,
          description: 'We design for emotional safety, cognitive ease, and effort minimization to support patient confidence and action.',
          deliverables: [
            'Confidence-supportive interaction flows',
            'Behavioral reinforcement mechanisms',
            'Cognitive load reduction',
            'Reassurance architecture'
          ]
        }
      }
      return step
    })
    modifiedDrivers = [
      'Perceived effort sensitivity',
      'Trust & reassurance dynamics',
      'Motivation instability'
    ]
  } else if (audience === 'clinicians') {
    // Clinicians: Cognitive overload, time pressure, error-risk sensitivity
    modifiedSteps = steps.map((step, index) => {
      if (index === 0) {
        // Step 1: Diagnose Human Friction
        return {
          ...step,
          description: 'We map cognitive load hotspots, task-switching stress, and workflow misalignment that create clinician friction.',
          deliverables: [
            'Cognitive load diagnostics',
            'Workflow friction mapping',
            'Decision density analysis',
            'Error-risk perception zones'
          ]
        }
      } else if (index === 1) {
        // Step 2: Map Decision & Motivation Patterns
        return {
          ...step,
          description: 'We analyze attention fragmentation, interruptibility stress, and efficiency perception in clinical workflows.',
          deliverables: [
            'Cognitive strain modeling',
            'Interaction cost analysis',
            'Decision fatigue zones',
            'Workflow interruption patterns'
          ]
        }
      } else if (index === 2) {
        // Step 3: Design for Trust & Behavioral Action
        return {
          ...step,
          description: 'We optimize for speed, clarity, and error prevention while reducing cognitive burden in clinician interactions.',
          deliverables: [
            'Cognitive simplification models',
            'Workflow compression design',
            'Decision clarity optimization',
            'Error prevention cues'
          ]
        }
      }
      return step
    })
    modifiedDrivers = [
      'Cognitive overload',
      'Workflow interruption',
      'Effort vs efficiency perception'
    ]
  } else if (audience === 'buyers-stakeholders') {
    // Buyers: Risk perception, trust evaluation, organizational inertia
    modifiedSteps = steps.map((step, index) => {
      if (index === 0) {
        // Step 1: Diagnose Human Friction
        return {
          ...step,
          description: 'We identify trust barriers, perceived risk signals, and decision hesitation patterns that block adoption.',
          deliverables: [
            'Adoption resistance diagnostics',
            'Risk perception analysis',
            'Trust barrier mapping',
            'Decision defensibility gaps'
          ]
        }
      } else if (index === 1) {
        // Step 2: Map Decision & Motivation Patterns
        return {
          ...step,
          description: 'We analyze confidence thresholds, internal justification logic, and uncertainty drivers in stakeholder decisions.',
          deliverables: [
            'Decision confidence modeling',
            'Stakeholder hesitation dynamics',
            'Perceived safety evaluation',
            'Organizational inertia patterns'
          ]
        }
      } else if (index === 2) {
        // Step 3: Design for Trust & Behavioral Action
        return {
          ...step,
          description: 'We build confidence reinforcement, clarity, and defensibility structures that support stakeholder commitment.',
          deliverables: [
            'Trust-supportive narratives',
            'Confidence architecture',
            'Risk reduction cues',
            'Decision justification frameworks'
          ]
        }
      }
      return step
    })
    modifiedDrivers = [
      'Risk perception barriers',
      'Trust & credibility gaps',
      'Decision defensibility concerns'
    ]
  }

  return {
    steps: modifiedSteps,
    frictionDrivers: modifiedDrivers,
    whyText: modifiedWhy
  }
}

// Lifecycle Modifier: Changes problem origin, intervention depth, emphasis
function applyLifecycleModifier(
  plan: PlanData,
  lifecycle: Lifecycle,
  challenge: Challenge
): PlanData {
  const { steps, frictionDrivers, whyText } = plan
  let modifiedSteps = steps.map(s => ({ ...s })) // Deep copy
  let modifiedWhy = whyText

  if (lifecycle === 'early-build') {
    // Early Build: Uncertainty is normal, problems = assumption risk, focus = prevent misalignment
    // Step 1: Shift from "fix" to "shape correctly"
    modifiedSteps[0] = {
      ...modifiedSteps[0],
      description: 'We conduct assumption risk analysis and early decision modeling to identify potential misalignment before it becomes structural friction.',
      deliverables: [
        'Behavioral risk mapping',
        'Cognitive model validation',
        'Engagement assumption audit',
        'Early decision pattern analysis'
      ]
    }
    // Step 3: Emphasize preventing friction creation
    modifiedSteps[2] = {
      ...modifiedSteps[2],
      description: 'We design behavioral architecture and trust frameworks to prevent friction creation, ensuring early experience logic aligns with human behavior.',
      deliverables: [
        'Behavioral architecture design',
        'Trust & clarity frameworks',
        'Early experience logic alignment',
        'Friction prevention models'
      ]
    }
    // Step 4: Emphasize validation in realistic contexts
    modifiedSteps[3] = {
      ...modifiedSteps[3],
      description: 'We validate behavioral assumptions and engagement logic before product launch to prevent misalignment.',
      deliverables: [
        'Behavioral hypothesis testing',
        'Early engagement validation',
        'Assumption risk verification',
        'Pre-launch friction prevention'
      ]
    }
    modifiedWhy = whyText.replace(/failures|problems|challenges/i, 'misalignment risks') + ' Early intervention prevents structural friction from becoming embedded.'
  } else if (lifecycle === 'live-issues') {
    // Live Product: Observable symptoms exist, problems = structural friction
    // Step 1: Focus on diagnosis + correction
    modifiedSteps[0] = {
      ...modifiedSteps[0],
      description: 'We diagnose observable engagement failures and structural friction patterns that are causing current drop-off.',
      deliverables: [
        'Behavioral friction audit',
        'Experience breakdown mapping',
        'Drop-off pattern analysis',
        'Structural misalignment detection'
      ]
    }
    // Step 4: Emphasize iterative correction cycles
    modifiedSteps[3] = {
      ...modifiedSteps[3],
      description: 'We implement iterative correction cycles with friction regression detection to ensure sustained improvement.',
      deliverables: [
        'Iterative friction reduction cycles',
        'Friction regression detection',
        'Behavioral improvement validation',
        'Correction effectiveness monitoring'
      ]
    }
    modifiedWhy = whyText + ' Observable symptoms indicate structural issues that require systematic correction.'
  } else if (lifecycle === 'scaling-optimization') {
    // Scaling: System works but unstable under growth
    // Step 1: Focus on scalability friction
    modifiedSteps[0] = {
      ...modifiedSteps[0],
      description: 'We detect scalability friction and behavioral stress points that emerge under growth conditions.',
      deliverables: [
        'Behavioral robustness analysis',
        'Trust stability modeling',
        'Scalability friction detection',
        'Growth stress point mapping'
      ]
    }
    // Step 3: Emphasize reinforcing consistency
    modifiedSteps[2] = {
      ...modifiedSteps[2],
      description: 'We reinforce behavioral consistency and preserve decision clarity at scale to maintain engagement stability.',
      deliverables: [
        'Consistency reinforcement models',
        'Scale-preserved clarity design',
        'Behavioral stability architecture',
        'Trust preservation at scale'
      ]
    }
    modifiedWhy = whyText + ' Systems that work at small scale often develop behavioral instability under growth without structural reinforcement.'
  } else if (lifecycle === 'repositioning-expansion') {
    // Repositioning: Behavior mismatch likely, new audiences introduce friction
    // Step 1: Focus on behavioral model mismatch
    modifiedSteps[0] = {
      ...modifiedSteps[0],
      description: 'We analyze behavioral model mismatch and expectation reconfiguration needs for new contexts or audiences.',
      deliverables: [
        'Adoption barrier analysis',
        'Trust recalibration mapping',
        'Behavioral model mismatch detection',
        'Expectation reconfiguration audit'
      ]
    }
    // Step 3: Emphasize re-alignment
    modifiedSteps[2] = {
      ...modifiedSteps[2],
      description: 'We realign behavioral architecture and trust signals for new contexts to remove adoption barriers.',
      deliverables: [
        'Context-specific behavioral design',
        'Trust signal recalibration',
        'Expectation realignment models',
        'Adoption barrier removal'
      ]
    }
    modifiedWhy = whyText + ' Repositioning introduces new behavioral contexts where existing models may create friction.'
  }

  return {
    steps: modifiedSteps,
    frictionDrivers,
    whyText: modifiedWhy
  }
}

// Chip Component
function Chip({
  label,
  isSelected,
  onClick,
  disabled = false
}: {
  label: string
  isSelected: boolean
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      className={`plan-builder-chip ${isSelected ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
      aria-pressed={isSelected}
    >
      {label}
    </button>
  )
}

// Input Group Component
function InputGroup({
  label,
  children
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="plan-builder-input-group">
      <label className="plan-builder-input-label">{label}</label>
      <div className="plan-builder-chips-grid">{children}</div>
    </div>
  )
}

// Plan Step Card Component
function PlanStepCard({ step, index }: { step: PlanStep; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="plan-step-card" style={{ animationDelay: `${index * 80}ms` }}>
      <div className="plan-step-header">
        <div className="plan-step-number">{step.number}</div>
        <div className="plan-step-content">
          <h3 className="plan-step-title">{step.title}</h3>
          <p className="plan-step-description">{step.description}</p>
        </div>
      </div>
      <button
        className="plan-step-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        type="button"
        aria-expanded={isExpanded}
      >
        <span>Typical deliverables</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          fill="none"
          className={`plan-step-chevron ${isExpanded ? 'open' : ''}`}
        >
          <path
            d="M3 4.5L6 7.5L9 4.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`plan-step-deliverables ${isExpanded ? 'expanded' : ''}`}>
        <ul>
          {step.deliverables.map((deliverable, idx) => (
            <li key={idx}>{deliverable}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

// Timeline Component
function Timeline({ steps }: { steps: PlanStep[] }) {
  return (
    <div className="plan-timeline">
      <div className="plan-timeline-line"></div>
      {steps.map((step, index) => {
        // Calculate position based on step card positions (approximate)
        const stepHeight = 100 / steps.length
        const position = (index * stepHeight) + (stepHeight / 2)
        return (
          <div key={step.number} className="plan-timeline-node" style={{ top: `${position}%` }}>
            <div className="plan-timeline-dot"></div>
          </div>
        )
      })}
    </div>
  )
}

export default function ServicesSection() {
  const [productType, setProductType] = useState<ProductType>(null)
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [audience, setAudience] = useState<Audience>(null)
  const [lifecycle, setLifecycle] = useState<Lifecycle>(null)
  const [showWhy, setShowWhy] = useState(false)

  const plan = challenges.length > 0 ? generatePlan(challenges, audience, lifecycle) : null

  const toggleChallenge = (challenge: Challenge) => {
    setChallenges(prev => {
      if (prev.includes(challenge)) {
        return prev.filter(c => c !== challenge)
      } else if (prev.length < 2) {
        return [...prev, challenge]
      }
      return prev
    })
  }

  return (
    <section className="section services-section" id="services">
      <div className="services-background">
        <div className="services-base"></div>
      </div>
      <div className="services-container">
        <h2 className="services-title">Build Your Medora Intervention Plan</h2>
        <p className="services-subline">
          Select what best matches your situation — we'll map the most likely intervention sequence.
        </p>

        <div className="plan-builder-grid">
          {/* Inputs Panel (Left) */}
          <div className="plan-builder-inputs">
            <InputGroup label="What are you working on?">
              <Chip
                label="Digital health product"
                isSelected={productType === 'digital-health'}
                onClick={() => setProductType(productType === 'digital-health' ? null : 'digital-health')}
              />
              <Chip
                label="Medical device software / companion app"
                isSelected={productType === 'medical-device'}
                onClick={() => setProductType(productType === 'medical-device' ? null : 'medical-device')}
              />
              <Chip
                label="Clinician / professional tool"
                isSelected={productType === 'clinician-tool'}
                onClick={() => setProductType(productType === 'clinician-tool' ? null : 'clinician-tool')}
              />
              <Chip
                label="Platform / workflow system"
                isSelected={productType === 'platform-workflow'}
                onClick={() => setProductType(productType === 'platform-workflow' ? null : 'platform-workflow')}
              />
            </InputGroup>

            <div className="plan-builder-divider"></div>

            <InputGroup label="Primary challenge (select up to 2)">
              <Chip
                label="Adoption & onboarding drop-off"
                isSelected={challenges.includes('adoption-onboarding')}
                onClick={() => toggleChallenge('adoption-onboarding')}
                disabled={!challenges.includes('adoption-onboarding') && challenges.length >= 2}
              />
              <Chip
                label="Retention / engagement decay"
                isSelected={challenges.includes('retention-engagement')}
                onClick={() => toggleChallenge('retention-engagement')}
                disabled={!challenges.includes('retention-engagement') && challenges.length >= 2}
              />
              <Chip
                label="Trust & perceived safety"
                isSelected={challenges.includes('trust-safety')}
                onClick={() => toggleChallenge('trust-safety')}
                disabled={!challenges.includes('trust-safety') && challenges.length >= 2}
              />
              <Chip
                label="Complex workflow friction"
                isSelected={challenges.includes('workflow-friction')}
                onClick={() => toggleChallenge('workflow-friction')}
                disabled={!challenges.includes('workflow-friction') && challenges.length >= 2}
              />
              <Chip
                label="Adherence & behavior change"
                isSelected={challenges.includes('adherence-behavior')}
                onClick={() => toggleChallenge('adherence-behavior')}
                disabled={!challenges.includes('adherence-behavior') && challenges.length >= 2}
              />
            </InputGroup>

            <div className="plan-builder-divider"></div>

            <InputGroup label="Audience context">
              <Chip
                label="Patients"
                isSelected={audience === 'patients'}
                onClick={() => setAudience(audience === 'patients' ? null : 'patients')}
              />
              <Chip
                label="Clinicians"
                isSelected={audience === 'clinicians'}
                onClick={() => setAudience(audience === 'clinicians' ? null : 'clinicians')}
              />
              <Chip
                label="Buyers / stakeholders"
                isSelected={audience === 'buyers-stakeholders'}
                onClick={() => setAudience(audience === 'buyers-stakeholders' ? null : 'buyers-stakeholders')}
              />
              <Chip
                label="Mixed B2B + B2C"
                isSelected={audience === 'mixed-b2b-b2c'}
                onClick={() => setAudience(audience === 'mixed-b2b-b2c' ? null : 'mixed-b2b-b2c')}
              />
            </InputGroup>

            <div className="plan-builder-divider"></div>

            <InputGroup label="Where are you in the lifecycle?">
              <Chip
                label="Early build / validation"
                isSelected={lifecycle === 'early-build'}
                onClick={() => setLifecycle(lifecycle === 'early-build' ? null : 'early-build')}
              />
              <Chip
                label="Live product with engagement issues"
                isSelected={lifecycle === 'live-issues'}
                onClick={() => setLifecycle(lifecycle === 'live-issues' ? null : 'live-issues')}
              />
              <Chip
                label="Scaling / optimization"
                isSelected={lifecycle === 'scaling-optimization'}
                onClick={() => setLifecycle(lifecycle === 'scaling-optimization' ? null : 'scaling-optimization')}
              />
              <Chip
                label="Repositioning / expansion"
                isSelected={lifecycle === 'repositioning-expansion'}
                onClick={() => setLifecycle(lifecycle === 'repositioning-expansion' ? null : 'repositioning-expansion')}
              />
            </InputGroup>
          </div>

          {/* Output Panel (Right) */}
          <div className="plan-builder-output">
            {plan ? (
              <>
                <div className="plan-output-header">
                  <h3 className="plan-output-title">Your Intervention Plan</h3>
                  <button
                    className="plan-why-toggle"
                    onClick={() => setShowWhy(!showWhy)}
                    type="button"
                    aria-expanded={showWhy}
                  >
                    Why this plan?
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      className={`plan-why-chevron ${showWhy ? 'open' : ''}`}
                    >
                      <path
                        d="M2.5 3.75L5 6.25L7.5 3.75"
                        stroke="currentColor"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>

                {showWhy && (
                  <div className="plan-why-panel">
                    <p>{plan.whyText}</p>
                  </div>
                )}

                <div className="plan-steps-container">
                  <Timeline steps={plan.steps} />
                  <div className="plan-steps-list">
                    {plan.steps.map((step, index) => (
                      <PlanStepCard key={step.number} step={step} index={index} />
                    ))}
                  </div>
                </div>

                <div className="plan-focus-panel">
                  <h4 className="plan-focus-title">Most likely friction drivers in your case:</h4>
                  <ul className="plan-focus-list">
                    {plan.frictionDrivers.map((driver, index) => (
                      <li key={index}>{driver}</li>
                    ))}
                  </ul>
                </div>

                <div className="plan-cta-block">
                  <a href="#contact" className="plan-cta-primary">
                    Discuss Your Product Challenges
                  </a>
                  <a href="#approach" className="plan-cta-secondary">
                    See how we work
                  </a>
                </div>
              </>
            ) : (
              <div className="plan-output-empty">
                <p>Select at least one primary challenge to generate your intervention plan.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
