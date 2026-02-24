'use client'

import { useEffect, useRef, useCallback } from 'react'

export type DecayPhase = 1 | 2 | 3 | 4 | 5 | 6

export interface DecaySimulatorCanvasProps {
  phase?: DecayPhase
  phaseProgress?: number
  /** When set, phase/phaseProgress are derived from progress (0–1) in the draw loop; no re-render needed */
  progressRef?: React.RefObject<number>
  hoverNorm?: { x: number; y: number } | null
  paused?: boolean
  className?: string
}

function noise2D(x: number, t: number): number {
  return (
    Math.sin(x * 2.7 + t) * 0.5 +
    Math.sin(x * 5.3 + t * 1.3) * 0.3 +
    Math.sin(x * 8.1 + t * 0.7) * 0.2
  )
}

export default function DecaySimulatorCanvas({
  phase: phaseProp,
  phaseProgress: phaseProgressProp,
  progressRef,
  hoverNorm = null,
  paused = false,
  className = '',
}: DecaySimulatorCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const timeRef = useRef(0)
  const rafRef = useRef<number>(0)
  const useProgressRef = Boolean(progressRef)

  const getNoiseIntensity = useCallback((ph: number, progress: number) => {
    if (ph <= 1) return 0
    if (ph === 2) return 0.08 + progress * 0.12
    if (ph === 3) return 0.2 + progress * 0.25
    if (ph === 4) return 0.45 + progress * 0.2
    if (ph === 5) return 0.65 + progress * 0.35
    return 0
  }, [])

  const getAmplitude = useCallback((ph: number, progress: number) => {
    if (ph <= 4) return 1
    if (ph === 5) return 1 - progress * 0.85
    return 0.15 + progress * 0.85
  }, [])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = 0
    let height = 0
    let dpr = 1

    const resize = () => {
      const rect = container.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const draw = () => {
      if (!canvas.width || !canvas.height) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      timeRef.current += paused ? 0 : 0.016
      const t = timeRef.current

      let phase: DecayPhase
      let phaseProgress: number
      if (useProgressRef && progressRef?.current != null) {
        const p = Math.max(0, Math.min(1, progressRef.current))
        const phaseIndex = Math.min(5, Math.floor(p * 6))
        phase = (phaseIndex + 1) as DecayPhase
        phaseProgress = p * 6 - phaseIndex
      } else {
        phase = phaseProp ?? 1
        phaseProgress = phaseProgressProp ?? 0.5
      }

      const centerY = height / 2
      const baseAmplitude = height * 0.12
      const points = 320
      const step = width / (points - 1)

      const noiseIntensity = reducedMotion
        ? 0.08
        : getNoiseIntensity(phase, phaseProgress)
      const amplitudeMult = reducedMotion ? 1 : getAmplitude(phase, phaseProgress)
      const amplitude = baseAmplitude * amplitudeMult

      ctx.clearRect(0, 0, width, height)

      ctx.beginPath()
      ctx.moveTo(0, centerY)

      for (let i = 0; i < points; i++) {
        const x = i * step
        const normX = i / (points - 1)
        const base = Math.sin(normX * Math.PI * 2 + t * 0.4) * amplitude
        const noise = noise2D(normX * 10, t) * noiseIntensity * height * 0.25
        let y = centerY + base + noise

        if (hoverNorm && !reducedMotion) {
          const dx = normX - hoverNorm.x
          const dist = Math.abs(dx) * 3
          if (dist < 1) {
            const localNoise = (1 - dist) * height * 0.04
            y += localNoise * (Math.sin(t * 4 + dx * 10) * 0.5 + 0.5)
          }
        }

        ctx.lineTo(x, y)
      }

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)'
      ctx.lineWidth = 1.5
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.stroke()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [phaseProp, phaseProgressProp, progressRef, useProgressRef, hoverNorm, paused, getNoiseIntensity, getAmplitude])

  return (
    <div
      ref={containerRef}
      className={`decay-simulator-canvas-wrap ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="decay-simulator-canvas" />
    </div>
  )
}
