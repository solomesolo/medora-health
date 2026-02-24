'use client'

import { useEffect, useRef, useState } from 'react'

interface FrameworkPrinciple {
  id: string
  title: string
  description: string
  nodeIndices: number[] // Which nodes in the system relate to this principle
}

const principles: FrameworkPrinciple[] = [
  {
    id: 'diagnose',
    title: 'Diagnose Human Friction',
    description: 'We identify cognitive, behavioral, and emotional barriers limiting engagement, trust, and decision continuity.',
    nodeIndices: [0, 1, 2] // Friction-related nodes
  },
  {
    id: 'map',
    title: 'Map Decision & Motivation Patterns',
    description: 'We analyze how users evaluate effort, risk, clarity, and perceived value across real usage contexts.',
    nodeIndices: [3, 4, 5] // Decision/motivation nodes
  },
  {
    id: 'design',
    title: 'Design for Trust & Behavioral Action',
    description: 'We restructure product experiences to support confidence, clarity, and sustained behavioral commitment.',
    nodeIndices: [6, 7, 8] // Trust/action nodes
  },
  {
    id: 'validate',
    title: 'Validate & Refine',
    description: 'We iterate within realistic cognitive, emotional, and operational environments.',
    nodeIndices: [9, 10, 11] // Validation nodes
  }
]

interface Node {
  x: number
  y: number
  baseX: number
  baseY: number
  radius: number
  targetOpacity: number
  currentOpacity: number
  targetLuminance: number
  currentLuminance: number
  principleGroup: number // Which principle group this node belongs to
}

function CognitiveSystemVisualization({
  activePrincipleIndex,
  isHovered
}: {
  activePrincipleIndex: number
  isHovered: boolean
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const nodesRef = useRef<Node[]>([])
  const timeRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
      initializeNodes()
    }

    const initializeNodes = () => {
      const width = canvas.width
      const height = canvas.height
      const centerX = width / 2
      const centerY = height / 2
      const radius = Math.min(width, height) * 0.35

      nodesRef.current = []
      
      // Create 12 nodes arranged in a network pattern
      const numNodes = 12
      for (let i = 0; i < numNodes; i++) {
        const angle = (i / numNodes) * Math.PI * 2
        const nodeRadius = radius + (i % 3 === 0 ? -20 : i % 3 === 1 ? 0 : 20) // Vary distance slightly
        const x = centerX + Math.cos(angle) * nodeRadius
        const y = centerY + Math.sin(angle) * nodeRadius
        
        // Determine which principle group (0-3)
        const principleGroup = Math.floor(i / 3)
        
        nodesRef.current.push({
          x,
          y,
          baseX: x,
          baseY: y,
          radius: 6,
          targetOpacity: 0.3,
          currentOpacity: 0.3,
          targetLuminance: 0.4,
          currentLuminance: 0.4,
          principleGroup
        })
      }
    }

    const updateNodeStates = () => {
      const activePrinciple = principles[activePrincipleIndex]
      if (!activePrinciple) return

      nodesRef.current.forEach((node, index) => {
        const isActive = activePrinciple.nodeIndices.includes(index)
        
        // Target states based on active principle
        if (isActive) {
          node.targetOpacity = 1.0
          node.targetLuminance = 1.0
        } else {
          node.targetOpacity = 0.15
          node.targetLuminance = 0.2
        }

        // Smooth interpolation
        node.currentOpacity += (node.targetOpacity - node.currentOpacity) * 0.08
        node.currentLuminance += (node.targetLuminance - node.currentLuminance) * 0.08
      })
    }

    const drawNetwork = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const nodes = nodesRef.current
      if (nodes.length === 0) return

      // Draw connections (only between nodes in same or adjacent groups)
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.12)'
      ctx.lineWidth = 1

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const nodeA = nodes[i]
          const nodeB = nodes[j]
          
          // Connect nodes within same group or adjacent groups
          const groupDiff = Math.abs(nodeA.principleGroup - nodeB.principleGroup)
          if (groupDiff <= 1) {
            const avgOpacity = (nodeA.currentOpacity + nodeB.currentOpacity) * 0.5
            ctx.globalAlpha = avgOpacity * 0.3
            ctx.beginPath()
            ctx.moveTo(nodeA.x, nodeA.y)
            ctx.lineTo(nodeB.x, nodeB.y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1

      // Apply hover drift
      if (isHovered) {
        timeRef.current += 0.02
        nodes.forEach((node, index) => {
          const drift = Math.sin(timeRef.current + index) * 2
          node.x = node.baseX + drift
          node.y = node.baseY + drift * 0.5
        })
      } else {
        // Return to base positions
        nodes.forEach((node) => {
          node.x += (node.baseX - node.x) * 0.1
          node.y += (node.baseY - node.y) * 0.1
        })
      }

      // Draw nodes
      nodes.forEach((node) => {
        const luminance = node.currentLuminance
        const opacity = node.currentOpacity

        // Outer glow
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 3
        )
        gradient.addColorStop(0, `rgba(59, 130, 246, ${opacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(59, 130, 246, 0)')
        
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2)
        ctx.fill()

        // Node core
        ctx.fillStyle = `rgba(${148 + luminance * 107}, ${163 + luminance * 69}, ${184 + luminance * 72}, ${opacity})`
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fill()

        // Inner highlight
        ctx.fillStyle = `rgba(255, 255, 255, ${opacity * luminance * 0.3})`
        ctx.beginPath()
        ctx.arc(node.x - 2, node.y - 2, node.radius * 0.4, 0, Math.PI * 2)
        ctx.fill()
      })
    }

    const animate = () => {
      updateNodeStates()
      drawNetwork()
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)
    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [activePrincipleIndex, isHovered])

  return (
    <div ref={containerRef} className="approach-visual-container">
      <canvas ref={canvasRef} className="approach-visual-canvas" />
    </div>
  )
}

export default function ApproachSection() {
  const [activePrincipleIndex, setActivePrincipleIndex] = useState(0)
  const [isHovered, setIsHovered] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // Auto-rotate principles every 4 seconds
    intervalRef.current = setInterval(() => {
      setActivePrincipleIndex((prev) => (prev + 1) % principles.length)
    }, 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const activePrinciple = principles[activePrincipleIndex]

  return (
    <section className="section approach-section" id="approach">
      <div className="approach-background">
        <div className="approach-base"></div>
      </div>
      <div className="approach-container">
        <h2 className="approach-title">Medora's Behavioral Design Framework</h2>

        <div
          className="approach-visual-wrapper"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <CognitiveSystemVisualization
            activePrincipleIndex={activePrincipleIndex}
            isHovered={isHovered}
          />
        </div>

        <div className="approach-principle-container">
          <h3 className="approach-principle-title">{activePrinciple.title}</h3>
          <p className="approach-principle-description">{activePrinciple.description}</p>
        </div>

        {/* Optional: Manual navigation dots */}
        <div className="approach-indicators">
          {principles.map((_, index) => (
            <button
              key={index}
              className={`approach-indicator ${index === activePrincipleIndex ? 'active' : ''}`}
              onClick={() => {
                setActivePrincipleIndex(index)
                // Reset auto-rotation timer
                if (intervalRef.current) {
                  clearInterval(intervalRef.current)
                }
                intervalRef.current = setInterval(() => {
                  setActivePrincipleIndex((prev) => (prev + 1) % principles.length)
                }, 4000)
              }}
              aria-label={`View ${principles[index].title}`}
              type="button"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
