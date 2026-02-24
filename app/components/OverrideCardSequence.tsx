'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'

export type Card = {
  id: string
  kicker?: string
  title: string
  body: string
  footnote?: string
}

export type OverrideCardSequenceProps = {
  id?: string
  cards: Card[]
  vhPerCard?: number
  topOffsetPx?: number
  crossfade?: boolean
  crossfadeWindow?: number
  debug?: boolean
}

function clamp(x: number, a: number, b: number): number {
  return Math.max(a, Math.min(b, x))
}

export default function OverrideCardSequence({
  id = 'override-card-sequence',
  cards,
  vhPerCard = 120,
  topOffsetPx = 0,
  crossfade = true,
  crossfadeWindow = 0.18,
  debug = false,
}: OverrideCardSequenceProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  const ticking = useRef(false)
  const inViewRef = useRef(true)
  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const debugRef = useRef<HTMLDivElement>(null)

  const N = cards.length
  const useCrossfade = crossfade && !reducedMotion
  const w = crossfadeWindow

  function update() {
    const section = sectionRef.current
    if (!section) return
    const rect = section.getBoundingClientRect()
    const viewportH = window.innerHeight
    const sectionHeight = rect.height
    const scrollable = sectionHeight - viewportH
    const scrolled =
      scrollable <= 0 ? 0 : clamp(-rect.top, 0, scrollable)
    const progress = scrollable <= 0 ? 0 : scrolled / scrollable

    const raw = progress * N
    const activeIndex = clamp(Math.floor(raw), 0, N - 1)
    const localT = raw - activeIndex

    const opacities = new Array(N).fill(0)

    if (useCrossfade) {
      opacities[activeIndex] =
        localT < w
          ? localT / w
          : localT > 1 - w
            ? (1 - localT) / w
            : 1
      if (localT > 1 - w && activeIndex + 1 < N) {
        opacities[activeIndex + 1] = (localT - (1 - w)) / w
      }
    } else {
      opacities[activeIndex] = 1
    }

    cardRefs.current.forEach((el, i) => {
      if (el) {
        const o = opacities[i]
        el.style.opacity = String(o)
        el.style.pointerEvents = o >= 0.99 ? 'auto' : 'none'
        el.setAttribute('aria-hidden', i !== activeIndex ? 'true' : 'false')
      }
    })

    if (debug && debugRef.current) {
      debugRef.current.textContent = `progress=${progress.toFixed(3)} activeIndex=${activeIndex} localT=${localT.toFixed(3)} rect.top=${rect.top.toFixed(0)}`
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    function onScrollOrResize() {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        ticking.current = false
        update()
      })
    }

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0]?.isIntersecting ?? true
        if (inViewRef.current) onScrollOrResize()
      },
      { root: null, rootMargin: '300px 0px 300px 0px', threshold: 0 }
    )
    io.observe(section)

    window.addEventListener('scroll', onScrollOrResize, { passive: true })
    window.addEventListener('resize', onScrollOrResize)
    onScrollOrResize()
    // Ensure first paint gets correct opacities after refs are attached
    const t = window.setTimeout(() => {
      onScrollOrResize()
    }, 100)

    return () => {
      window.clearTimeout(t)
      io.disconnect()
      window.removeEventListener('scroll', onScrollOrResize)
      window.removeEventListener('resize', onScrollOrResize)
    }
  }, [N, useCrossfade, w])

  // Run update once after refs are committed so active card opacity is correct before paint
  useLayoutEffect(() => {
    update()
  })

  const spacerHeightVh = N * vhPerCard

  return (
    <section
      ref={sectionRef}
      id={id}
      className="override-card-sequence-section"
      data-override-cards="true"
      style={
        {
          '--cards': N,
          '--vhPerCard': vhPerCard,
          '--topOffsetPx': `${topOffsetPx}px`,
        } as React.CSSProperties
      }
      aria-label="Scroll-driven card sequence"
    >
      <h2 className="override-cards-section-title">Quiet Failure</h2>
      {/* All cards in normal flow so content is always visible */}
      <div className="override-cards-in-flow">
        {cards.map((card, i) => (
          <div key={card.id} className="override-cards-flow-card">
            <div className="override-cards-lead-inner">
              {card.kicker && (
                <p className="override-card-kicker">{card.kicker}</p>
              )}
              <h3 className="override-card-title">{card.title}</h3>
              <p className="override-card-body">{card.body}</p>
              {card.footnote && (
                <p className="override-card-footnote">{card.footnote}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="override-cards-scroll-spacer" style={{ height: `${spacerHeightVh}vh` }}>
        <div className="override-cards-sticky-frame">
          <div className="override-cards-viewport">
            <div className="override-cards-layer">
              {cards.map((card, i) => (
                <div
                  key={card.id}
                  ref={(el) => { cardRefs.current[i] = el }}
                  className={`override-card override-card-${i}`}
                  aria-hidden={i !== 0}
                  data-index={i}
                  style={{ opacity: i === 0 ? 1 : 0 }}
                >
                  <div className="override-card-inner">
                    {card.kicker && (
                      <p className="override-card-kicker">{card.kicker}</p>
                    )}
                    <h2 className="override-card-title">{card.title}</h2>
                    <p className="override-card-body">{card.body}</p>
                    {card.footnote && (
                      <p className="override-card-footnote">{card.footnote}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {debug && (
        <div
          ref={debugRef}
          className="override-card-sequence-debug"
          aria-live="polite"
        />
      )}
    </section>
  )
}
