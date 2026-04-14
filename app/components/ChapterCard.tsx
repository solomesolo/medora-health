'use client'

export type VizState = 'hesitation' | 'microfrictions' | 'instability' | 'structural'

export interface ChapterData {
  id: number
  title: string
  explanation: string
  implication: string
  vizState: VizState
}

export interface ChapterCardProps {
  chapter: ChapterData
  isActive?: boolean
  onHover?: (vizState: VizState | null) => void
  sentinelRef?: React.Ref<HTMLDivElement>
}

export default function ChapterCard({
  chapter,
  isActive = false,
  onHover,
  sentinelRef,
}: ChapterCardProps) {
  return (
    <article
      className={`quiet-story-chapter-card ${isActive ? 'quiet-story-chapter-active' : ''}`}
      onMouseEnter={() => onHover?.(chapter.vizState)}
      onMouseLeave={() => onHover?.(null)}
      onFocus={() => onHover?.(chapter.vizState)}
      onBlur={() => onHover?.(null)}
    >
      <div ref={sentinelRef} className="quiet-story-sentinel" data-chapter-index={chapter.id - 1} aria-hidden="true" />
      <h3 className="quiet-story-statement">{chapter.title}</h3>
      <p className="quiet-story-explanation">{chapter.explanation}</p>
      <p className="quiet-story-implication">{chapter.implication}</p>
    </article>
  )
}
