'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import ChapterCard, { type ChapterData, type VizState } from './ChapterCard'
import JourneyStoryViz from './JourneyStoryViz'

const CHAPTERS: ChapterData[] = [
  {
    id: 1,
    title: 'Disengagement rarely begins as rejection. It begins as hesitation.',
    explanation:
      'In healthcare, users often don’t quit. They delay. A small pause is usually a sign of uncertainty, effort perception, or missing confidence.',
    implication: 'Hesitation is the first signal of future adoption drop-off.',
    vizState: 'hesitation',
  },
  {
    id: 2,
    title: 'Small delays. Minor confusion. Reduced confidence.',
    explanation:
      'Tiny frictions rarely look serious alone. But each one adds effort and weakens motivation — especially under real-world constraints.',
    implication: 'Adding features won’t fix this if the friction is structural.',
    vizState: 'microfrictions',
  },
  {
    id: 3,
    title: 'These micro-frictions compound until behavior becomes unstable.',
    explanation:
      'When users must repeatedly re-decide, engagement becomes fragile. Stability requires clarity, trust reinforcement, and low-effort continuity.',
    implication: 'Retention becomes volatile even as teams keep shipping updates.',
    vizState: 'instability',
  },
  {
    id: 4,
    title: 'By the time metrics show the problem, resistance is already structural.',
    explanation:
      'Once the pattern is established, fixing it costs more: retraining habits, rebuilding trust, and rewriting experience logic.',
    implication: 'This is why early behavioral diagnosis is a strategic advantage.',
    vizState: 'structural',
  },
]

export default function QuietFailureStorySection() {
  const [activeChapter, setActiveChapter] = useState(1)
  const [hoverState, setHoverState] = useState<VizState | null>(null)
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const sentinels = sentinelRefs.current.filter(Boolean)
    if (sentinels.length === 0) return

    const io = new IntersectionObserver(
      (entries) => {
        const intersecting = entries
          .filter((e) => e.isIntersecting)
          .map((e) => parseInt((e.target as HTMLElement).getAttribute('data-chapter-index') ?? '', 10))
          .filter((n) => !Number.isNaN(n))
        if (intersecting.length > 0) {
          setActiveChapter(Math.min(...intersecting) + 1)
        }
      },
      { root: null, rootMargin: '-38% 0px -48% 0px', threshold: 0 }
    )

    sentinels.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  return (
    <section
      id="framework-authority"
      className="quiet-story-section"
      aria-labelledby="quiet-story-heading"
    >
      <div className="quiet-story-container" ref={containerRef}>
        <h2 id="quiet-story-heading" className="quiet-story-eyebrow">
          QUIET FAILURE STORY
        </h2>

        <div className="quiet-story-grid">
          <div className="quiet-story-copy-col">
            {CHAPTERS.map((chapter, i) => (
              <ChapterCard
                key={chapter.id}
                chapter={chapter}
                isActive={activeChapter === chapter.id}
                onHover={setHoverState}
                sentinelRef={(el) => {
                  sentinelRefs.current[i] = el
                }}
              />
            ))}

            <div className="quiet-story-resolution">
              <p className="quiet-story-resolution-statement">
                Medora detects and resolves these invisible dynamics before adoption degrades.
              </p>
              <div className="quiet-story-cta">
                <Link href="#contact" className="quiet-story-cta-primary">
                  Discuss Your Product Challenges
                </Link>
                <Link href="#approach" className="quiet-story-cta-secondary">
                  See the diagnostic approach →
                </Link>
              </div>
            </div>
          </div>

          <div className="quiet-story-visual-col">
            <div className="quiet-story-sticky-wrap">
              <JourneyStoryViz
                activeChapter={activeChapter}
                hoverState={hoverState}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
