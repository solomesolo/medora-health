'use client'

import type { VizState } from './ChapterCard'

export interface JourneyStoryVizProps {
  activeChapter: number
  hoverState: VizState | null
  className?: string
}

const TRANSITION_MS = 550

export default function JourneyStoryViz({
  activeChapter,
  hoverState,
  className = '',
}: JourneyStoryVizProps) {
  const duration = TRANSITION_MS

  const opacity = (state: number) => (activeChapter === state ? 1 : 0)
  const hoverBrighten = (state: VizState) =>
    hoverState === state ? 1 : 0

  return (
    <div className={`journey-story-viz ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 400 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="journey-story-svg"
      >
        <defs>
          <linearGradient id="journey-path-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(148, 163, 184, 0.4)" />
            <stop offset="100%" stopColor="rgba(148, 163, 184, 0.25)" />
          </linearGradient>
          <filter id="journey-soft-glow">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ——— CHAPTER 1: Hesitation ——— */}
        <g
          className="journey-viz-layer journey-viz-hesitation"
          style={{
            opacity: opacity(1),
            transition: `opacity ${duration}ms ease-out`,
          }}
        >
          <path
            d="M 40 110 Q 120 110 160 110 T 280 110 T 360 110"
            stroke="url(#journey-path-grad)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {[40, 120, 200, 280, 360].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={110}
              r={i === 1 ? 8 : 6}
              fill={i === 1 ? 'rgba(59, 130, 246, 0.25)' : 'rgba(148, 163, 184, 0.2)'}
              stroke="rgba(148, 163, 184, 0.35)"
              strokeWidth="1"
            />
          ))}
          <circle
            className="journey-pause-ripple"
            cx={120}
            cy={110}
            r={14}
            fill="none"
            stroke="rgba(59, 130, 246, 0.2)"
            strokeWidth="1.5"
          />
        </g>

        {/* ——— CHAPTER 2: Micro-frictions ——— */}
        <g
          className="journey-viz-layer journey-viz-microfrictions"
          style={{
            opacity: opacity(2),
            transition: `opacity ${duration}ms ease-out`,
          }}
        >
          <path
            d="M 40 110 Q 100 105 160 112 Q 220 118 280 108 T 360 110"
            stroke="url(#journey-path-grad)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {[40, 120, 200, 280, 360].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={i === 0 ? 110 : i === 1 ? 108 : i === 2 ? 114 : i === 3 ? 109 : 110}
              r={6}
              fill="rgba(148, 163, 184, 0.2)"
              stroke="rgba(148, 163, 184, 0.35)"
              strokeWidth="1"
            />
          ))}
          <g style={{ opacity: 0.85 + hoverBrighten('microfrictions') * 0.15, transition: 'opacity 0.3s ease' }}>
            <rect x="72" y="92" width="56" height="20" rx="4" fill="rgba(59, 130, 246, 0.12)" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
            <text x="100" y="106" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="500">Delay</text>
            <rect x="158" y="98" width="64" height="20" rx="4" fill="rgba(59, 130, 246, 0.12)" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
            <text x="190" y="112" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="500">Confusion</text>
            <rect x="248" y="88" width="72" height="20" rx="4" fill="rgba(59, 130, 246, 0.12)" stroke="rgba(148, 163, 184, 0.25)" strokeWidth="1" />
            <text x="284" y="102" textAnchor="middle" fill="#94A3B8" fontSize="10" fontWeight="500">Confidence</text>
          </g>
        </g>

        {/* ——— CHAPTER 3: Instability ——— */}
        <g
          className="journey-viz-layer journey-viz-instability"
          style={{
            opacity: opacity(3),
            transition: `opacity ${duration}ms ease-out`,
          }}
        >
          <path
            d="M 40 110 Q 100 98 160 118 Q 220 102 280 114 Q 340 106 360 110"
            stroke="url(#journey-path-grad)"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
          />
          {[40, 115, 195, 275, 360].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={110 + (i % 2 === 0 ? 4 : -6)}
              r={6}
              fill="rgba(148, 163, 184, 0.25)"
              stroke="rgba(148, 163, 184, 0.4)"
              strokeWidth="1"
            />
          ))}
          <path
            d="M 60 130 Q 140 128 200 132 Q 260 127 340 130"
            stroke="rgba(148, 163, 184, 0.15)"
            strokeWidth="1"
            fill="none"
            strokeDasharray="4 3"
          />
        </g>

        {/* ——— CHAPTER 4: Structural ——— */}
        <g
          className="journey-viz-layer journey-viz-structural"
          style={{
            opacity: opacity(4),
            transition: `opacity ${duration}ms ease-out`,
          }}
        >
          <path
            d="M 40 110 L 160 110 L 200 110 L 280 110 L 360 110"
            stroke="url(#journey-path-grad)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
          />
          {[40, 160, 200, 280, 360].map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={110}
              r={6}
              fill="rgba(148, 163, 184, 0.2)"
              stroke="rgba(148, 163, 184, 0.3)"
              strokeWidth="1"
            />
          ))}
          <ellipse
            className="journey-constraint-ring"
            cx="240"
            cy="110"
            rx="95"
            ry="28"
            fill="none"
            stroke="rgba(148, 163, 184, 0.2)"
            strokeWidth="1.5"
            style={{
              opacity: 0.7 + hoverBrighten('structural') * 0.15,
              transition: 'opacity 0.3s ease',
            }}
          />
          <path
            d="M 80 180 L 120 172 L 180 165 L 260 158 L 320 152"
            stroke="rgba(148, 163, 184, 0.25)"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  )
}
