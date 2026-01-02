'use client'

import { useEffect } from 'react'

export default function CustomCursor() {
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return // Don't initialize custom cursor
    }

    // Check if cursor already exists
    if (document.querySelector('.cursor-dot')) {
      return // Already initialized
    }

    const dot = document.createElement('div')
    const ring = document.createElement('div')
    dot.className = 'cursor-dot'
    ring.className = 'cursor-ring'
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    let x = 0, y = 0
    let rx = 0, ry = 0

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
    }

    const tick = () => {
      // Smooth follow for ring
      rx += (x - rx) * 0.14
      ry += (y - ry) * 0.14
      
      dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`
      
      requestAnimationFrame(tick)
    }

    const setHover = (isHover: boolean) => {
      ring.classList.toggle('is-hover', isHover)
      dot.classList.toggle('is-hover', isHover)
    }

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const el = target?.closest?.('a, button, .magnetic')
      if (el) setHover(true)
    }

    const onOut = () => {
      setHover(false)
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver, true)
    document.addEventListener('mouseout', onOut, true)
    tick()

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver, true)
      document.removeEventListener('mouseout', onOut, true)
      dot.remove()
      ring.remove()
    }
  }, [])

  return null
}

