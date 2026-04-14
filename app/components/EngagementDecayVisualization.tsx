'use client'

import { useEffect, useRef, useState } from 'react'

interface LayerState {
  x: number
  y: number
  rotation: number
  scale: number
  opacity: number
  blur: number
}

interface EngagementDecayVisualizationProps {
  decayPhase: number // 0-1, where 0 = stable, 1 = peak friction
  reducedMotion?: boolean
}

export default function EngagementDecayVisualization({
  decayPhase,
  reducedMotion = false
}: EngagementDecayVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const layersRef = useRef<LayerState[]>([])
  const timeRef = useRef(0)
  const phaseOffsetRef = useRef<number[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true })
    if (!ctx) return

    let animationId: number
    let ctxRef: CanvasRenderingContext2D | null = ctx

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (rect && ctxRef) {
        const dpr = window.devicePixelRatio || 1
        const width = rect.width
        const height = rect.height
        
        canvas.width = width * dpr
        canvas.height = height * dpr
        canvas.style.width = `${width}px`
        canvas.style.height = `${height}px`
        
        // Reset transform and scale
        ctxRef.setTransform(1, 0, 0, 1, 0, 0)
        ctxRef.scale(dpr, dpr)
      }
    }

    updateCanvasSize()
    const resizeObserver = new ResizeObserver(updateCanvasSize)
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement)
    }
    
    window.addEventListener('resize', updateCanvasSize)

    // Initialize layers (3-5 translucent panels)
    const layerCount = reducedMotion ? 2 : 4
    layersRef.current = Array.from({ length: layerCount }, (_, i) => ({
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 0.15 - i * 0.03,
      blur: 0
    }))

    // Phase offsets for each layer (prevents synchronized motion)
    phaseOffsetRef.current = layersRef.current.map((_, i) => i * 0.25)

    // Master cycle duration: 16 seconds
    const cycleDuration = 16000

    const animate = (currentTime: number) => {
      if (!ctxRef) return
      const ctx2d = ctxRef

      // Initialize time
      if (timeRef.current === 0) {
        timeRef.current = currentTime
      }

      const elapsed = currentTime - timeRef.current
      const cycleProgress = (elapsed % cycleDuration) / cycleDuration

      const dpr = window.devicePixelRatio || 1
      const width = canvas.width / dpr
      const height = canvas.height / dpr

      // Clear canvas
      ctx2d.clearRect(0, 0, width, height)
      const centerX = width / 2
      const centerY = height / 2

      // Calculate decay intensity based on phase
      const decayIntensity = Math.min(decayPhase, 1)

      // Render each layer
      layersRef.current.forEach((layer, index) => {
        const phaseOffset = phaseOffsetRef.current[index]
        const layerCycle = (cycleProgress + phaseOffset) % 1

        // Determine phase within cycle
        let phase: 'stable' | 'decay' | 'peak' | 'recovery'
        if (layerCycle < 0.2) phase = 'stable'
        else if (layerCycle < 0.75) phase = 'decay'
        else if (layerCycle < 0.9) phase = 'peak'
        else phase = 'recovery'

        // Calculate motion parameters based on phase and decay intensity
        let translationX = 0
        let translationY = 0
        let rotation = 0
        let scale = 1
        let blur = 0

        if (!reducedMotion) {
          switch (phase) {
            case 'stable':
              translationX = 0
              translationY = 0
              rotation = 0
              scale = 1
              blur = 0
              break
            case 'decay':
              const decayProgress = (layerCycle - 0.2) / 0.55
              translationX = Math.sin(layerCycle * Math.PI * 2 + index) * 3 * decayProgress * decayIntensity
              translationY = Math.cos(layerCycle * Math.PI * 2 + index * 1.5) * 4 * decayProgress * decayIntensity
              rotation = Math.sin(layerCycle * Math.PI * 4 + index) * 0.15 * decayProgress * decayIntensity
              scale = 1 + Math.sin(layerCycle * Math.PI * 2) * 0.015 * decayProgress * decayIntensity
              blur = decayProgress * 0.5 * decayIntensity
              break
            case 'peak':
              translationX = Math.sin(layerCycle * Math.PI * 2 + index) * 5 * decayIntensity
              translationY = Math.cos(layerCycle * Math.PI * 2 + index * 1.5) * 6 * decayIntensity
              rotation = Math.sin(layerCycle * Math.PI * 4 + index) * 0.25 * decayIntensity
              scale = 1 + Math.sin(layerCycle * Math.PI * 2) * 0.02 * decayIntensity
              blur = 0.8 * decayIntensity
              break
            case 'recovery':
              const recoveryProgress = (layerCycle - 0.9) / 0.1
              const peakValue = 0.9
              translationX = Math.sin(layerCycle * Math.PI * 2 + index) * 5 * (1 - recoveryProgress) * decayIntensity
              translationY = Math.cos(layerCycle * Math.PI * 2 + index * 1.5) * 6 * (1 - recoveryProgress) * decayIntensity
              rotation = Math.sin(layerCycle * Math.PI * 4 + index) * 0.25 * (1 - recoveryProgress) * decayIntensity
              scale = 1 + Math.sin(layerCycle * Math.PI * 2) * 0.02 * (1 - recoveryProgress) * decayIntensity
              blur = 0.8 * (1 - recoveryProgress) * decayIntensity
              break
          }
        }

        // Layer dimensions (decreasing size for depth)
        const baseWidth = width * (0.85 - index * 0.15)
        const baseHeight = height * (0.75 - index * 0.12)

        // Apply transformations
        ctx2d.save()
        ctx2d.translate(centerX + translationX, centerY + translationY)
        ctx2d.rotate((rotation * Math.PI) / 180)
        ctx2d.scale(scale, scale)

        // Apply blur via shadow (more performant than filter)
        if (blur > 0) {
          ctx2d.shadowBlur = blur * 2
          ctx2d.shadowColor = 'rgba(59, 130, 246, 0.1)'
        }

        // Draw rounded rectangle
        const cornerRadius = 16 - index * 2
        ctx2d.globalAlpha = layer.opacity * (1 - decayIntensity * 0.3)

        // Gradient fill
        const gradient = ctx2d.createLinearGradient(
          -baseWidth / 2,
          -baseHeight / 2,
          baseWidth / 2,
          baseHeight / 2
        )
        gradient.addColorStop(0, `rgba(59, 130, 246, ${0.08 - index * 0.015})`)
        gradient.addColorStop(0.5, `rgba(34, 211, 238, ${0.04 - index * 0.01})`)
        gradient.addColorStop(1, `rgba(59, 130, 246, ${0.06 - index * 0.01})`)

        ctx2d.fillStyle = gradient
        ctx2d.strokeStyle = `rgba(59, 130, 246, ${0.12 - index * 0.02})`
        ctx2d.lineWidth = 1

        // Draw rounded rect (compatible method)
        ctx2d.beginPath()
        const x = -baseWidth / 2
        const y = -baseHeight / 2
        const w = baseWidth
        const h = baseHeight
        const r = cornerRadius
        
        ctx2d.moveTo(x + r, y)
        ctx2d.lineTo(x + w - r, y)
        ctx2d.quadraticCurveTo(x + w, y, x + w, y + r)
        ctx2d.lineTo(x + w, y + h - r)
        ctx2d.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
        ctx2d.lineTo(x + r, y + h)
        ctx2d.quadraticCurveTo(x, y + h, x, y + h - r)
        ctx2d.lineTo(x, y + r)
        ctx2d.quadraticCurveTo(x, y, x + r, y)
        ctx2d.closePath()
        ctx2d.fill()
        ctx2d.stroke()

        ctx2d.restore()
      })

      // Add subtle noise/interference overlay
      if (!reducedMotion && decayIntensity > 0.3) {
        ctx2d.save()
        ctx2d.globalAlpha = decayIntensity * 0.02
        ctx2d.fillStyle = '#94A3B8'
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * width
          const y = Math.random() * height
          ctx2d.fillRect(x, y, 1, 1)
        }
        ctx2d.restore()
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    animationFrameRef.current = animationId

    return () => {
      window.removeEventListener('resize', updateCanvasSize)
      resizeObserver.disconnect()
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      ctxRef = null
    }
  }, [decayPhase, reducedMotion])

  return (
    <div className="engagement-decay-canvas-wrapper">
      <canvas ref={canvasRef} className="engagement-decay-canvas" />
    </div>
  )
}
