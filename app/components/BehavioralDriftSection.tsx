'use client'

import { useEffect, useRef, useState } from 'react'

// Static grid component for before/after comparison
function StaticGrid({ isDistorted = false, onHover = false }: { isDistorted?: boolean; onHover?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const distortionOffsetsRef = useRef<Map<number, { x: number; y: number }>>(new Map())

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const gridRows = 9
    const gridCols = 16
    const containerWidth = container.clientWidth
    const containerHeight = container.clientHeight

    if (containerWidth === 0 || containerHeight === 0) {
      setTimeout(resizeCanvas, 50)
      return
    }

    const cellWidth = containerWidth / (gridCols - 1)
    const cellHeight = containerHeight / (gridRows - 1)

    // Create nodes with optional distortion
    const nodes: Array<{ x: number; y: number }> = []
    
    if (isDistorted) {
      const driftNodeIndices = new Set<number>()
      const totalNodes = gridRows * gridCols
      const numDriftNodes = Math.floor(totalNodes * 0.4)

      // Initialize distortion offsets if not already set
      if (distortionOffsetsRef.current.size === 0) {
        // Select drift nodes (same selection logic as animated version)
        while (driftNodeIndices.size < numDriftNodes) {
          const index = Math.floor(Math.random() * totalNodes)
          const row = Math.floor(index / gridCols)
          const col = index % gridCols
          if (row > 0 && row < gridRows - 1 && col > 0 && col < gridCols - 1) {
            driftNodeIndices.add(index)
          } else if (driftNodeIndices.size < numDriftNodes * 0.7) {
            driftNodeIndices.add(index)
          }
        }

        // Store base distortion offsets
        driftNodeIndices.forEach(index => {
          distortionOffsetsRef.current.set(index, {
            x: (Math.random() - 0.5) * 8, // Base -4 to +4px
            y: (Math.random() - 0.5) * 8
          })
        })
      } else {
        // Reuse existing drift node indices from stored offsets
        distortionOffsetsRef.current.forEach((_, index) => {
          driftNodeIndices.add(index)
        })
      }

      const hoverMultiplier = onHover ? 1.3 : 1

      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const index = row * gridCols + col
          const baseX = col * cellWidth
          const baseY = row * cellHeight

          if (driftNodeIndices.has(index)) {
            // Apply static distortion (scaled on hover)
            const offset = distortionOffsetsRef.current.get(index) || { x: 0, y: 0 }
            nodes.push({
              x: baseX + offset.x * hoverMultiplier,
              y: baseY + offset.y * hoverMultiplier
            })
          } else {
            nodes.push({ x: baseX, y: baseY })
          }
        }
      }
    } else {
      // Perfect grid - no distortion
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          nodes.push({
            x: col * cellWidth,
            y: row * cellHeight
          })
        }
      }
    }

    // Render grid
    ctx.clearRect(0, 0, containerWidth, containerHeight)
    ctx.strokeStyle = isDistorted ? 'rgba(148, 163, 184, 0.28)' : 'rgba(148, 163, 184, 0.22)'
    ctx.lineWidth = 1.3

    // Draw horizontal lines
    for (let row = 0; row < gridRows - 1; row++) {
      for (let col = 0; col < gridCols - 1; col++) {
        const idx = row * gridCols + col
        const node = nodes[idx]
        const nodeRight = nodes[idx + 1]

        if (node && nodeRight) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)

          // Add subtle curve if nodes are displaced
          if (isDistorted) {
            const distX = nodeRight.x - node.x
            const distY = nodeRight.y - node.y
            const dist = Math.sqrt(distX * distX + distY * distY)
            const expectedDist = cellWidth
            const displacement = Math.abs(dist - expectedDist)

            if (displacement > 0.3) {
              const midX = node.x + distX * 0.5
              const midY = node.y + distY * 0.5
              const curveOffset = Math.sign(dist - expectedDist) * Math.min(displacement * 0.25, 2)
              ctx.quadraticCurveTo(midX, midY + curveOffset, nodeRight.x, nodeRight.y)
            } else {
              ctx.lineTo(nodeRight.x, nodeRight.y)
            }
          } else {
            ctx.lineTo(nodeRight.x, nodeRight.y)
          }
          ctx.stroke()
        }
      }
    }

    // Draw vertical lines
    for (let row = 0; row < gridRows - 1; row++) {
      for (let col = 0; col < gridCols - 1; col++) {
        const idx = row * gridCols + col
        const node = nodes[idx]
        const nodeBottom = nodes[row * gridCols + col + gridCols]

        if (node && nodeBottom) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)

          // Add subtle curve if nodes are displaced
          if (isDistorted) {
            const distX = nodeBottom.x - node.x
            const distY = nodeBottom.y - node.y
            const dist = Math.sqrt(distX * distX + distY * distY)
            const expectedDist = cellHeight
            const displacement = Math.abs(dist - expectedDist)

            if (displacement > 0.3) {
              const midX = node.x + distX * 0.5
              const midY = node.y + distY * 0.5
              const curveOffset = Math.sign(dist - expectedDist) * Math.min(displacement * 0.25, 2)
              ctx.quadraticCurveTo(midX + curveOffset, midY, nodeBottom.x, nodeBottom.y)
            } else {
              ctx.lineTo(nodeBottom.x, nodeBottom.y)
            }
          } else {
            ctx.lineTo(nodeBottom.x, nodeBottom.y)
          }
          ctx.stroke()
        }
      }
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [isDistorted, onHover])

  return (
    <div className="static-grid-container" ref={containerRef}>
      <div className="static-grid-background"></div>
      <canvas 
        ref={canvasRef} 
        className="static-grid-canvas"
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  )
}

// Legacy animated visualization (kept but not used in new design)
function BehavioralDriftVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number | null>(null)
  const phaseRef = useRef<'stable' | 'drift' | 'recovery'>('stable')
  const timeRef = useRef<number | null>(null)
  const mousePosRef = useRef({ x: -1, y: -1 })
  const cycleDurationRef = useRef(18000 + Math.random() * 6000) // 18-24s randomized (±10%)

  useEffect(() => {
    // Check reduced motion inside useEffect to ensure it's evaluated on client
    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width * window.devicePixelRatio
      canvas.height = rect.height * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Grid configuration
    const gridRows = 9
    const gridCols = 16

    // Node system
    interface Node {
      baseX: number
      baseY: number
      currentX: number
      currentY: number
      targetX: number
      targetY: number
      driftOffsetX: number
      driftOffsetY: number
      targetDriftX: number
      targetDriftY: number
      isDriftNode: boolean
      phase: number
      speed: number
    }

    let nodes: Node[] = []
    let containerWidth = container.clientWidth
    let containerHeight = container.clientHeight

    const initializeNodes = () => {
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      
      if (newWidth === 0 || newHeight === 0) {
        setTimeout(initializeNodes, 50)
        return false
      }

      containerWidth = newWidth
      containerHeight = newHeight

      const cellWidth = containerWidth / (gridCols - 1)
      const cellHeight = containerHeight / (gridRows - 1)

      nodes = []
      // Select ~40% of nodes to be drift nodes (not all nodes drift)
      // Avoid edge nodes for better visual effect
      const driftNodeIndices = new Set<number>()
      const totalNodes = gridRows * gridCols
      const numDriftNodes = Math.floor(totalNodes * 0.4)
      
      while (driftNodeIndices.size < numDriftNodes) {
        const index = Math.floor(Math.random() * totalNodes)
        const row = Math.floor(index / gridCols)
        const col = index % gridCols
        // Prefer interior nodes (not on edges)
        if (row > 0 && row < gridRows - 1 && col > 0 && col < gridCols - 1) {
          driftNodeIndices.add(index)
        } else if (driftNodeIndices.size < numDriftNodes * 0.7) {
          // Allow some edge nodes but prefer interior
          driftNodeIndices.add(index)
        }
      }
      
      for (let row = 0; row < gridRows; row++) {
        for (let col = 0; col < gridCols; col++) {
          const index = row * gridCols + col
          const isDriftNode = driftNodeIndices.has(index)
          
          nodes.push({
            baseX: col * cellWidth,
            baseY: row * cellHeight,
            currentX: col * cellWidth, // Start perfectly aligned
            currentY: row * cellHeight, // Start perfectly aligned
            targetX: col * cellWidth,
            targetY: row * cellHeight,
            driftOffsetX: 0, // Start at zero - perfect alignment
            driftOffsetY: 0, // Start at zero - perfect alignment
            targetDriftX: isDriftNode ? (Math.random() - 0.5) * 8 : 0, // -4 to +4px max displacement
            targetDriftY: isDriftNode ? (Math.random() - 0.5) * 8 : 0,
            isDriftNode,
            phase: Math.random() * Math.PI * 2,
            speed: 0.15 + Math.random() * 0.08 // Slower, more controlled wave motion
          })
        }
      }
      return true
    }

    // Initialize nodes immediately if container has dimensions, otherwise wait
    if (!initializeNodes()) {
      // Will retry via setTimeout in initializeNodes
    }

    // Mouse interaction
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mousePosRef.current = {
        x: (e.clientX - rect.left) / rect.width,
        y: (e.clientY - rect.top) / rect.height
      }
    }

    const handleMouseLeave = () => {
      mousePosRef.current = { x: -1, y: -1 }
    }

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    // Animation loop
    const animate = () => {
      // Re-initialize if container resized
      if (container.clientWidth !== containerWidth || container.clientHeight !== containerHeight) {
        initializeNodes()
      }

      if (nodes.length === 0 || containerWidth === 0 || containerHeight === 0) {
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      if (reducedMotion) {
        // Static grid for reduced motion - perfect alignment only
        ctx.clearRect(0, 0, containerWidth, containerHeight)
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.22)' // Match stable phase opacity
        ctx.lineWidth = 1.3

        for (let row = 0; row < gridRows - 1; row++) {
          for (let col = 0; col < gridCols - 1; col++) {
            const idx = row * gridCols + col
            const node = nodes[idx]
            const nodeRight = nodes[idx + 1]
            const nodeBottom = nodes[row * gridCols + col + gridCols]

            if (node && nodeRight) {
              ctx.beginPath()
              ctx.moveTo(node.baseX, node.baseY)
              ctx.lineTo(nodeRight.baseX, nodeRight.baseY)
              ctx.stroke()
            }

            if (node && nodeBottom) {
              ctx.beginPath()
              ctx.moveTo(node.baseX, node.baseY)
              ctx.lineTo(nodeBottom.baseX, nodeBottom.baseY)
              ctx.stroke()
            }
          }
        }
        animationFrameRef.current = requestAnimationFrame(animate)
        return
      }

      // Increment time in milliseconds (~16ms per frame at 60fps)
      const now = performance.now()
      if (timeRef.current === null) {
        timeRef.current = now
      }
      
      let elapsed = now - timeRef.current
      
      // Reset cycle if needed
      if (elapsed >= cycleDurationRef.current) {
        // Reset drift targets for new cycle BEFORE resetting time
        nodes.forEach(node => {
          if (node.isDriftNode) {
            node.targetDriftX = (Math.random() - 0.5) * 8 // -4 to +4px max displacement
            node.targetDriftY = (Math.random() - 0.5) * 8
            node.driftOffsetX = 0
            node.driftOffsetY = 0
          }
        })
        timeRef.current = now
        cycleDurationRef.current = 21000 + Math.random() * 3000
        elapsed = 0 // Reset elapsed after cycle reset
      }

      // Phase transitions: Stable 35%, Drift 45% (35-80%), Recovery 20% (80-100%)
      const cycleProgress = Math.min(elapsed / cycleDurationRef.current, 1)

      if (cycleProgress < 0.35) {
        phaseRef.current = 'stable' // Phase 1: Perfect alignment (0-35%)
      } else if (cycleProgress < 0.80) {
        phaseRef.current = 'drift' // Phase 2-3: Drift emergence to peak (35-80%)
      } else {
        phaseRef.current = 'recovery' // Phase 4: Stabilization (80-100%)
      }

      // Calculate drift intensity based on phase
      let driftIntensity = 0
      if (phaseRef.current === 'stable') {
        driftIntensity = 0 // Perfect alignment
      } else if (phaseRef.current === 'drift') {
        const driftProgress = (cycleProgress - 0.35) / 0.45
        // Smooth curve: slow start, peak in middle, slow end
        driftIntensity = Math.sin(Math.max(0, Math.min(1, driftProgress)) * Math.PI) // 0 to 1
      } else {
        const recoveryProgress = Math.max(0, Math.min(1, (cycleProgress - 0.80) / 0.20))
        driftIntensity = Math.max(0, 1 - recoveryProgress) // Fade from 1 to 0
      }


      // Update nodes - only drift nodes move
      nodes.forEach((node, index) => {
        const row = Math.floor(index / gridCols)
        const col = index % gridCols

        // Base position
        let targetX = node.baseX
        let targetY = node.baseY

        // Phase-based drift - only for selected drift nodes
        // Smooth interpolation (lerp) - no jumps, feels physical not digital
        if (node.isDriftNode && driftIntensity > 0.01) {
          // Calculate target offset based on drift intensity
          const targetOffsetX = node.targetDriftX * driftIntensity
          const targetOffsetY = node.targetDriftY * driftIntensity
          
          // Slow interpolation (lerp) - smooth, no jumps
          node.driftOffsetX += (targetOffsetX - node.driftOffsetX) * 0.06
          node.driftOffsetY += (targetOffsetY - node.driftOffsetY) * 0.06
          
          // Very soft wave-like tension during drift (not wobble, not glitch)
          const wavePhase = node.phase + elapsed * node.speed * 0.0003
          const waveX = Math.sin(wavePhase) * driftIntensity * 0.6 // Reduced amplitude
          const waveY = Math.cos(wavePhase * 1.2) * driftIntensity * 0.6
          
          targetX += node.driftOffsetX + waveX
          targetY += node.driftOffsetY + waveY
        } else {
          // Non-drift nodes return to base smoothly
          node.driftOffsetX += (0 - node.driftOffsetX) * 0.12
          node.driftOffsetY += (0 - node.driftOffsetY) * 0.12
        }

        // Cursor interaction (desktop only) - subtle ≤2px
        if (mousePosRef.current.x >= 0 && mousePosRef.current.y >= 0) {
          const nodeScreenX = node.baseX / containerWidth
          const nodeScreenY = node.baseY / containerHeight
          const distX = nodeScreenX - mousePosRef.current.x
          const distY = nodeScreenY - mousePosRef.current.y
          const dist = Math.sqrt(distX * distX + distY * distY)
          
          if (dist < 0.2) {
            const influence = (1 - dist / 0.2) * 0.3
            const repelX = distX / dist
            const repelY = distY / dist
            targetX += repelX * influence * 2 // Max 2px
            targetY += repelY * influence * 2
          }
        }

        // Smooth interpolation - slow, no jumps, feels physical
        node.currentX += (targetX - node.currentX) * 0.08
        node.currentY += (targetY - node.currentY) * 0.08
        node.targetX = targetX
        node.targetY = targetY
      })

      // Render
      ctx.clearRect(0, 0, containerWidth, containerHeight)
      
      // Subtle depth glow
      ctx.shadowBlur = phaseRef.current === 'drift' ? 6 : 3
      ctx.shadowColor = 'rgba(59, 130, 246, 0.08)'
      
      // Grid lines - sharp and visible (opacity 0.22-0.28 as specified)
      ctx.strokeStyle = phaseRef.current === 'stable' 
        ? 'rgba(148, 163, 184, 0.22)' // Perfect alignment - slightly more subtle
        : phaseRef.current === 'drift'
        ? 'rgba(148, 163, 184, 0.28)' // Peak drift - most visible
        : 'rgba(148, 163, 184, 0.24)' // Recovery - intermediate
      ctx.lineWidth = 1.3

      // Draw grid lines with subtle curve between displaced nodes
      for (let row = 0; row < gridRows - 1; row++) {
        for (let col = 0; col < gridCols - 1; col++) {
          const idx = row * gridCols + col
          const node = nodes[idx]
          const nodeRight = nodes[idx + 1]
          const nodeBottom = nodes[row * gridCols + col + gridCols]

          if (node && nodeRight) {
            ctx.beginPath()
            ctx.moveTo(node.currentX, node.currentY)
            
            // Line distortion: curve/stretch between displaced nodes (not wobble, not glitch)
            const distX = nodeRight.currentX - node.currentX
            const distY = nodeRight.currentY - node.currentY
            const dist = Math.sqrt(distX * distX + distY * distY)
            const expectedDist = nodeRight.baseX - node.baseX
            const displacement = Math.abs(dist - expectedDist)
            
            if (displacement > 0.3) {
              // Subtle curve using quadratic curve - feels physical, not digital
              const midX = node.currentX + distX * 0.5
              const midY = node.currentY + distY * 0.5
              // Reduced curve offset for more elegant distortion
              const curveOffset = Math.sign(dist - expectedDist) * Math.min(displacement * 0.25, 2)
              ctx.quadraticCurveTo(midX, midY + curveOffset, nodeRight.currentX, nodeRight.currentY)
            } else {
              ctx.lineTo(nodeRight.currentX, nodeRight.currentY)
            }
            ctx.stroke()
          }

          if (node && nodeBottom) {
            ctx.beginPath()
            ctx.moveTo(node.currentX, node.currentY)
            
            // Line distortion: curve/stretch between displaced nodes (not wobble, not glitch)
            const distX = nodeBottom.currentX - node.currentX
            const distY = nodeBottom.currentY - node.currentY
            const dist = Math.sqrt(distX * distX + distY * distY)
            const expectedDist = nodeBottom.baseY - node.baseY
            const displacement = Math.abs(dist - expectedDist)
            
            if (displacement > 0.3) {
              // Subtle curve using quadratic curve - feels physical, not digital
              const midX = node.currentX + distX * 0.5
              const midY = node.currentY + distY * 0.5
              // Reduced curve offset for more elegant distortion
              const curveOffset = Math.sign(dist - expectedDist) * Math.min(displacement * 0.25, 2)
              ctx.quadraticCurveTo(midX + curveOffset, midY, nodeBottom.currentX, nodeBottom.currentY)
            } else {
              ctx.lineTo(nodeBottom.currentX, nodeBottom.currentY)
            }
            ctx.stroke()
          }
        }
      }

      // Reset shadow
      ctx.shadowBlur = 0

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // Start animation after ensuring nodes are initialized
    const startAnimation = () => {
      if (nodes.length === 0 || containerWidth === 0 || containerHeight === 0) {
        setTimeout(startAnimation, 50)
        return
      }
      // Initialize time reference for animation
      timeRef.current = performance.now()
      animate()
    }
    
    // Wait a bit for container to be ready, then start
    setTimeout(() => {
      startAnimation()
    }, 100)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, []) // Empty dependency array - effect runs once on mount

  return (
    <div className="behavioral-drift-visual-container" ref={containerRef}>
      <div className="behavioral-drift-visual-background"></div>
      <canvas 
        ref={canvasRef} 
        className="behavioral-drift-canvas"
        style={{ position: 'absolute', inset: 0 }}
      />
    </div>
  )
}

export default function BehavioralDriftSection() {
  const [rightPanelHover, setRightPanelHover] = useState(false)

  return (
    <section className="section behavioral-drift-section" id="value-proposition">
      <div className="behavioral-drift-background">
        <div className="behavioral-drift-base"></div>
        <div className="behavioral-drift-depth"></div>
      </div>
      <div className="behavioral-drift-container">
        <div className="behavioral-drift-headline-block">
          <h2 className="behavioral-drift-title">We Design for How Human Behavior Actually Works</h2>
        </div>
        
        <div className="behavioral-drift-comparison-block">
          <div className="comparison-panel comparison-panel-left">
            <div className="comparison-panel-visual">
              <StaticGrid isDistorted={false} />
            </div>
            <div className="comparison-panel-label">Designed for Logic</div>
          </div>
          
          <div 
            className="comparison-panel comparison-panel-right"
            onMouseEnter={() => setRightPanelHover(true)}
            onMouseLeave={() => setRightPanelHover(false)}
          >
            <div className="comparison-panel-visual">
              <StaticGrid isDistorted={true} onHover={rightPanelHover} />
            </div>
            <div className="comparison-panel-label">Real Human Behavior</div>
          </div>
        </div>

        <div className="behavioral-drift-positioning-line">
          Most healthcare products are logically designed.<br/>
          Human engagement is behaviorally driven.<br/>
          <strong>Medora aligns the two.</strong>
        </div>
      </div>
    </section>
  )
}
