'use client'

export type ActiveForce = 'patients' | 'clinicians' | 'orgs' | null

export interface ThreeForcesFieldProps {
  activeCard: ActiveForce
  className?: string
}

const DRIFT_DURATION = 17

export default function ThreeForcesField({ activeCard, className = '' }: ThreeForcesFieldProps) {
  const patientsBoost = activeCard === 'patients' ? 1 : 0
  const cliniciansBoost = activeCard === 'clinicians' ? 1 : 0
  const orgsBoost = activeCard === 'orgs' ? 1 : 0
  const centerBoost = activeCard ? 1 : 0

  return (
    <div className={`three-forces-field-wrap ${className}`}>
      <svg
        className="three-forces-field-svg"
        viewBox="-35 -60 470 510"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="force-patients" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="40%" stopColor="rgba(59, 130, 246, 0.06)" />
            <stop offset="70%" stopColor="rgba(59, 130, 246, 0.12)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.18)" />
          </radialGradient>
          <radialGradient id="force-clinicians" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34, 211, 238, 0)" />
            <stop offset="40%" stopColor="rgba(34, 211, 238, 0.04)" />
            <stop offset="70%" stopColor="rgba(34, 211, 238, 0.07)" />
            <stop offset="100%" stopColor="rgba(34, 211, 238, 0.10)" />
          </radialGradient>
          <radialGradient id="force-orgs" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0)" />
            <stop offset="40%" stopColor="rgba(59, 130, 246, 0.05)" />
            <stop offset="70%" stopColor="rgba(59, 130, 246, 0.10)" />
            <stop offset="100%" stopColor="rgba(59, 130, 246, 0.15)" />
          </radialGradient>
        </defs>

        {/* Three force fields — positions form triangle converging to center (200,200) */}
        <g className="three-forces-ambient three-forces-force-patients">
          <circle cx="200" cy="90" r="140" fill="url(#force-patients)" style={{ opacity: 0.85 + patientsBoost * 0.15 }} />
        </g>
        <g className="three-forces-ambient three-forces-force-clinicians">
          <circle cx="290" cy="300" r="130" fill="url(#force-clinicians)" style={{ opacity: 0.9 + cliniciansBoost * 0.12 }} />
        </g>
        <g className="three-forces-ambient three-forces-force-orgs">
          <circle cx="110" cy="300" r="130" fill="url(#force-orgs)" style={{ opacity: 0.9 + orgsBoost * 0.12 }} />
        </g>

        {/* Stable core */}
        <circle cx="200" cy="200" r="42" fill="rgba(59, 130, 246, 0.06)" />
        <circle
          className="three-forces-center-ring"
          cx="200"
          cy="200"
          r="48"
          fill="none"
          stroke="rgba(148, 163, 184, 0.2)"
          strokeWidth="1"
          style={{ opacity: 0.7 + centerBoost * 0.08 }}
        />
      </svg>
    </div>
  )
}
