'use client'

import { useEffect, useRef } from 'react'

function BehavioralFieldVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationFrameRef = useRef<number>()
  const phaseRef = useRef<'stable' | 'drift' | 'recovery'>('stable')
  const timeRef = useRef(0)
  const mousePosRef = useRef({ x: 0, y: 0 })
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Grid configuration - larger, more prominent
    const gridSize = 50
    const gridCols = Math.ceil(canvas.width / window.devicePixelRatio / gridSize) + 2
    const gridRows = Math.ceil(canvas.height / window.devicePixelRatio / gridSize) + 2

    // Node system
    interface Node {
      baseX: number
      baseY: number
      currentX: number
      currentY: number
      targetX: number
      targetY: number
      phase: number
      speed: number
    }

    const nodes: Node[] = []
    for (let row = 0; row < gridRows; row++) {
      for (let col = 0; col < gridCols; col++) {
        nodes.push({
          baseX: col * gridSize,
          baseY: row * gridSize,
          currentX: col * gridSize,
          currentY: row * gridSize,
          targetX: col * gridSize,
          targetY: row * gridSize,
          phase: Math.random() * Math.PI * 2,
          speed: 0.3 + Math.random() * 0.2
        })
      }
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePosRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      }
    }

    canvas.addEventListener('mousemove', handleMouseMove)

    // Animation loop
    const animate = () => {
      if (reducedMotion) {
        // Static grid for reduced motion
        ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.15)'
        ctx.lineWidth = 1

        for (let row = 0; row < gridRows; row++) {
          for (let col = 0; col < gridCols; col++) {
            const x = col * gridSize
            const y = row * gridSize
            if (col < gridCols - 1) {
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x + gridSize, y)
              ctx.stroke()
            }
            if (row < gridRows - 1) {
              ctx.beginPath()
              ctx.moveTo(x, y)
              ctx.lineTo(x, y + gridSize)
              ctx.stroke()
            }
          }
        }
        return
      }

      timeRef.current += 0.016 // ~60fps

      // Phase transitions (very slow cycles - 20 seconds)
      const cycleDuration = 20000
      const cycleProgress = (timeRef.current % cycleDuration) / cycleDuration

      if (cycleProgress < 0.25) {
        phaseRef.current = 'stable'
      } else if (cycleProgress < 0.75) {
        phaseRef.current = 'drift'
      } else {
        phaseRef.current = 'recovery'
      }

      // Calculate distortion based on phase - more perceptible but still subtle
      let distortionAmount = 0
      if (phaseRef.current === 'stable') {
        distortionAmount = 0
      } else if (phaseRef.current === 'drift') {
        const driftProgress = (cycleProgress - 0.25) / 0.5
        distortionAmount = Math.sin(driftProgress * Math.PI) * 4.5 // Max 4.5px distortion
      } else {
        const recoveryProgress = (cycleProgress - 0.75) / 0.25
        distortionAmount = 4.5 * (1 - recoveryProgress) // Fade back to stable
      }

      // Update nodes
      nodes.forEach((node, index) => {
        const row = Math.floor(index / gridCols)
        const col = index % gridCols

        // Base position
        let targetX = node.baseX
        let targetY = node.baseY

        // Phase-based distortion
        if (distortionAmount > 0) {
          const phaseOffset = node.phase + timeRef.current * node.speed * 0.001
          const microX = Math.sin(phaseOffset) * distortionAmount
          const microY = Math.cos(phaseOffset * 1.3) * distortionAmount

          // Add slight delays (staggered response)
          const delayFactor = Math.sin(row * 0.3 + col * 0.2) * 0.5 + 0.5
          targetX += microX * delayFactor
          targetY += microY * delayFactor
        }

          // Mouse interaction (subtle but more perceptible)
          if (mousePosRef.current.x > 0 && mousePosRef.current.y > 0) {
            const nodeScreenX = node.baseX / (canvas.width / window.devicePixelRatio)
            const nodeScreenY = node.baseY / (canvas.height / window.devicePixelRatio)
            const distX = nodeScreenX - mousePosRef.current.x
            const distY = nodeScreenY - mousePosRef.current.y
            const dist = Math.sqrt(distX * distX + distY * distY)
            
            if (dist < 0.35) {
              const influence = (1 - dist / 0.35) * 0.6
              targetX += distX * influence * 3
              targetY += distY * influence * 3
            }
          }

        // Smooth interpolation
        node.currentX += (targetX - node.currentX) * 0.1
        node.currentY += (targetY - node.currentY) * 0.1
        node.targetX = targetX
        node.targetY = targetY
      })

      // Render
      ctx.clearRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio)
      
      // Add subtle depth glow
      ctx.shadowBlur = phaseRef.current === 'drift' ? 8 : 4
      ctx.shadowColor = 'rgba(59, 130, 246, 0.15)'
      
      ctx.strokeStyle = phaseRef.current === 'stable' 
        ? 'rgba(148, 163, 184, 0.25)' 
        : phaseRef.current === 'drift'
        ? 'rgba(148, 163, 184, 0.35)'
        : 'rgba(148, 163, 184, 0.3)'
      ctx.lineWidth = 1.5

      // Draw grid lines
      for (let row = 0; row < gridRows - 1; row++) {
        for (let col = 0; col < gridCols - 1; col++) {
          const idx = row * gridCols + col
          const node = nodes[idx]
          const nodeRight = nodes[idx + 1]
          const nodeBottom = nodes[row * gridCols + col + gridCols]

          if (node && nodeRight) {
            ctx.beginPath()
            ctx.moveTo(node.currentX, node.currentY)
            ctx.lineTo(nodeRight.currentX, nodeRight.currentY)
            ctx.stroke()
          }

          if (node && nodeBottom) {
            ctx.beginPath()
            ctx.moveTo(node.currentX, node.currentY)
            ctx.lineTo(nodeBottom.currentX, nodeBottom.currentY)
            ctx.stroke()
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      canvas.removeEventListener('mousemove', handleMouseMove)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [reducedMotion])

  return (
    <div className="behavioral-field-container">
      <canvas ref={canvasRef} className="behavioral-field-canvas" />
    </div>
  )
}

export default function ValuePropositionSection() {
  return (
    <section className="section value-prop-section" id="value-proposition">
      <div className="value-prop-background">
        <div className="value-prop-base"></div>
        <div className="value-prop-radial-glow"></div>
      </div>
      <div className="value-prop-container">
        <h2 className="value-prop-title">We Design for How Human Behavior Actually Works</h2>
        
        <div className="value-prop-visual-wrapper">
          <BehavioralFieldVisualization />
        </div>

        <div className="value-prop-copy">
          <p className="value-prop-copy-line-1">
            Most healthcare products are built on rational,<br/>functional, and clinical logic.
          </p>
          <p className="value-prop-copy-line-2">
            Human engagement is governed by attention limits,<br/>cognitive load, trust perception, and emotional context.
          </p>
          <p className="value-prop-copy-line-3">
            When these realities misalign,<br/>adoption quietly degrades.
          </p>
          <p className="value-prop-copy-line-4">
            Medora designs for that gap.
          </p>
        </div>
      </div>
    </section>
  )
}
