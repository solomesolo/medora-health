'use client'

import { useEffect, useRef, useCallback } from 'react'

function smoothstep(t: number): number {
  const x = Math.max(0, Math.min(1, t))
  return x * x * (3 - 2 * x)
}

export interface DegradationFieldCanvasProps {
  /** 0–1 override for distortion (when set, overrides internal loop) */
  intensity?: number
  /** Pause animation (reduced motion or offscreen) */
  paused?: boolean
  /** Optional deterministic seed */
  seed?: number
  /** Optional className for wrapper */
  className?: string
}

// Seeded random
function createSeededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

export default function DegradationFieldCanvas({
  intensity: intensityProp,
  paused = false,
  seed,
  className = '',
}: DegradationFieldCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)
  const timeRef = useRef(0)
  const loopDurationRef = useRef(16 + Math.random() * 4) // 16–20s ±
  const pointerRef = useRef<{ x: number; y: number } | null>(null)
  const isPointerInRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const nodesRef = useRef<Array<{
    baseX: number
    baseY: number
    phaseX: number
    phaseY: number
    magnitude: number
  }> | null>(null)
  const reducedMotionRef = useRef(false)
  const inViewRef = useRef(true)
  const lastPointerThrottleRef = useRef(0)

  const getPhaseFromTime = useCallback((t: number) => {
    const duration = loopDurationRef.current
    const loop = t % duration
    const p = loop / duration
    if (p < 0.25) return 0
    if (p < 0.75) return smoothstep((p - 0.25) / 0.5)
    if (p < 0.88) return 1
    return 1 - smoothstep((p - 0.88) / 0.12)
  }, [])

  useEffect(() => {
    reducedMotionRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')!

    const random = seed != null ? createSeededRandom(seed) : Math.random
    const gridSpacing = 28
    let width = 0
    let height = 0
    let dpr = 1
    let isMobile = false

    function initNodes() {
      const cols = Math.ceil(width / gridSpacing) + 2
      const rows = Math.ceil(height / gridSpacing) + 2
      const nodes: Array<{
        baseX: number
        baseY: number
        phaseX: number
        phaseY: number
        magnitude: number
      }> = []
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          nodes.push({
            baseX: c * gridSpacing,
            baseY: r * gridSpacing,
            phaseX: random() * Math.PI * 2,
            phaseY: random() * Math.PI * 2,
            magnitude: 0.6 + random() * 0.4,
          })
        }
      }
      nodesRef.current = nodes
    }

    const resizeObserver = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const rect = entry.contentRect
      dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1
      isMobile = rect.width < 768
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      initNodes()
    })
    resizeObserver.observe(container)

    const maxDisplacement = () => (isMobile ? 3 : 4)

    let lastT = 0
    function tick(t: number) {
      if (!lastT) lastT = t
      const dt = (t - lastT) / 1000
      lastT = t

      if (!inViewRef.current && !paused) {
        timeRef.current += dt * 0.08 // ~5fps when offscreen
      } else if (!paused) {
        timeRef.current += dt
      }

      const intensityOverride = intensityProp
      const phase =
        intensityOverride !== undefined
          ? intensityOverride
          : getPhaseFromTime(timeRef.current)
      const reduced = reducedMotionRef.current
      const distort = reduced ? 0 : phase

      const nodes = nodesRef.current
      if (!nodes) {
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const maxD = maxDisplacement()
      const pointer = pointerRef.current
      const useHover =
        isPointerInRef.current &&
        !reduced &&
        typeof window !== 'undefined' &&
        window.matchMedia('(pointer: fine)').matches

      ctx.clearRect(0, 0, width, height)

      const lineOpacity = 0.15 + (1 - distort * 0.4) * 0.12
      ctx.strokeStyle = `rgba(148, 163, 184, ${lineOpacity})`
      ctx.lineWidth = 1

      const rows = Math.ceil(height / gridSpacing) + 2
      const cols = Math.ceil(width / gridSpacing) + 2
      let idx = 0

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const node = nodes[idx]
          if (!node) {
            idx++
            continue
          }
          let dx =
            Math.sin(node.phaseX + timeRef.current * 0.5) *
            node.magnitude *
            maxD *
            distort
          let dy =
            Math.cos(node.phaseY + timeRef.current * 0.3) *
            node.magnitude *
            maxD *
            distort

          if (useHover && pointer) {
            const px = pointer.x * width
            const py = pointer.y * height
            const nx = node.baseX
            const ny = node.baseY
            const dist = Math.hypot(px - nx, py - ny)
            const radius = 120
            if (dist < radius) {
              const f = (1 - dist / radius) * 1.5
              const ax = (px - nx) / (dist || 1)
              const ay = (py - ny) / (dist || 1)
              dx += ax * f
              dy += ay * f
            }
          }

          ;(node as { currentX?: number; currentY?: number }).currentX =
            node.baseX + dx
          ;(node as { currentX?: number; currentY?: number }).currentY =
            node.baseY + dy
          idx++
        }
      }

      // Draw horizontal lines
      idx = 0
      for (let r = 0; r < rows - 1; r++) {
        for (let c = 0; c < cols - 1; c++) {
          const i = r * cols + c
          const n = nodes[i]
          const nRight = nodes[i + 1]
          const nDown = nodes[i + cols]
          if (n && nRight && nDown) {
            const x0 = (n as { currentX?: number }).currentX ?? n.baseX
            const y0 = (n as { currentY?: number }).currentY ?? n.baseY
            const x1 = (nRight as { currentX?: number }).currentX ?? nRight.baseX
            const y1 = (nRight as { currentY?: number }).currentY ?? nRight.baseY
            const x2 = (nDown as { currentX?: number }).currentX ?? nDown.baseX
            const y2 = (nDown as { currentY?: number }).currentY ?? nDown.baseY
            ctx.beginPath()
            ctx.moveTo(x0, y0)
            ctx.lineTo(x1, y1)
            ctx.stroke()
            ctx.beginPath()
            ctx.moveTo(x0, y0)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)

    const handlePointerMove = (e: MouseEvent) => {
      const now = performance.now()
      if (now - lastPointerThrottleRef.current < 32) return
      lastPointerThrottleRef.current = now
      const rect = container.getBoundingClientRect()
      pointerRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height,
      }
    }
    const handlePointerEnter = () => {
      isPointerInRef.current = true
    }
    const handlePointerLeave = () => {
      isPointerInRef.current = false
      pointerRef.current = null
    }

    container.addEventListener('mousemove', handlePointerMove, { passive: true })
    container.addEventListener('mouseenter', handlePointerEnter)
    container.addEventListener('mouseleave', handlePointerLeave)

    const io = new IntersectionObserver(
      (entries) => {
        inViewRef.current = entries[0]?.isIntersecting ?? true
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    io.observe(container)

    return () => {
      cancelAnimationFrame(rafRef.current)
      resizeObserver.disconnect()
      container.removeEventListener('mousemove', handlePointerMove)
      container.removeEventListener('mouseenter', handlePointerEnter)
      container.removeEventListener('mouseleave', handlePointerLeave)
      io.disconnect()
    }
  }, [paused, intensityProp, getPhaseFromTime])

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  )
}
