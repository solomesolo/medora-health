'use client'

import { useEffect, useRef, useState } from 'react'

interface Step {
  number: string
  title: string
  body: string
  visualKey: string
}

interface ScrollyStepsSectionProps {
  id: string
  title: string
  ctaText?: string
  ctaHref?: string
  steps: Step[]
}

export default function ScrollyStepsSection({
  id,
  title,
  ctaText,
  ctaHref,
  steps
}: ScrollyStepsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const stepsColumnRef = useRef<HTMLDivElement>(null)
  const progressRailFillRef = useRef<HTMLDivElement>(null)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const section = sectionRef.current
    const stepsColumn = stepsColumnRef.current
    const progressRailFill = progressRailFillRef.current
    if (!section || !stepsColumn || !progressRailFill) return

    // Find active step based on viewport center (45% from top)
    const findActiveStep = () => {
      const viewportThreshold = window.innerHeight * 0.45
      let closestIndex = 0
      let closestDistance = Infinity

      stepRefs.current.forEach((stepElement, index) => {
        if (!stepElement) return
        
        const rect = stepElement.getBoundingClientRect()
        const stepCenter = rect.top + rect.height / 2
        const distance = Math.abs(stepCenter - viewportThreshold)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      return closestIndex
    }

    // Update progress rail fill
    const updateProgressRail = (currentIndex: number) => {
      const activeStep = stepRefs.current[currentIndex]
      const firstStep = stepRefs.current[0]
      if (!activeStep || !firstStep || !progressRailFill) return

      const firstStepTop = firstStep.offsetTop
      const activeStepTop = activeStep.offsetTop
      const activeStepHeight = activeStep.offsetHeight
      const lastStep = stepRefs.current[steps.length - 1]
      const lastStepBottom = lastStep ? lastStep.offsetTop + lastStep.offsetHeight : stepsColumn.scrollHeight

      const totalHeight = lastStepBottom - firstStepTop
      const progress = totalHeight > 0 
        ? Math.min(Math.max(0, (activeStepTop - firstStepTop + activeStepHeight / 2) / totalHeight), 1)
        : 0
      
      progressRailFill.style.height = `${progress * 100}%`
    }

    let lastActiveIndex = 0
    let rafId: number | null = null
    let lastUpdateTime = 0

    const updateActiveStep = () => {
      const now = performance.now()
      // Throttle updates to prevent excessive state changes
      if (now - lastUpdateTime < 100) {
        rafId = requestAnimationFrame(updateActiveStep)
        return
      }

      const newActiveIndex = findActiveStep()
      
      if (newActiveIndex !== lastActiveIndex) {
        lastActiveIndex = newActiveIndex
        setActiveStepIndex(newActiveIndex)
        lastUpdateTime = now
      }
      
      // Always update progress rail
      updateProgressRail(lastActiveIndex)
      
      rafId = requestAnimationFrame(updateActiveStep)
    }

    // Start the update loop
    rafId = requestAnimationFrame(updateActiveStep)

    // Initial progress rail update
    setTimeout(() => {
      updateProgressRail(activeStepIndex)
    }, 100)

    return () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId)
      }
    }
  }, [steps, activeStepIndex])

  return (
    <section ref={sectionRef} className="scrolly-steps-section" id={id}>
      <div className="scrolly-steps-background">
        <div className="scrolly-steps-base"></div>
      </div>
      <div className="scrolly-steps-container">
        <div className="scrolly-steps-header-row">
          <h2 className="scrolly-steps-title">{title}</h2>
          {ctaText && ctaHref && (
            <a href={ctaHref} className="scrolly-steps-cta">
              {ctaText}
            </a>
          )}
        </div>
        <div className="scrolly-steps-content-grid">
          <div className="scrolly-steps-sticky-visual">
            <div className="scrolly-steps-visual-wrapper">
              {steps.map((step, index) => (
                <div
                  key={step.visualKey}
                  className={`scrolly-steps-visual-panel ${index === activeStepIndex ? 'active' : ''}`}
                  data-step-index={index}
                >
                  <div className={`scrolly-steps-visual-content visual-${step.visualKey}`}>
                    <div className="scrolly-visual-layer scrolly-visual-layer-1"></div>
                    <div className="scrolly-visual-layer scrolly-visual-layer-2"></div>
                    <div className="scrolly-visual-layer scrolly-visual-layer-3"></div>
                    <div className="scrolly-visual-interference"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="scrolly-steps-column" ref={stepsColumnRef}>
            <div className="scrolly-steps-progress-rail">
              <div className="scrolly-steps-progress-fill" ref={progressRailFillRef} style={{ height: '0%' }}></div>
            </div>
            {steps.map((step, index) => (
              <div
                key={index}
                ref={(el) => {
                  stepRefs.current[index] = el
                }}
                className={`scrolly-steps-step ${index === activeStepIndex ? 'active' : ''}`}
                data-step-index={index}
              >
                <div className="scrolly-steps-step-number">{step.number}</div>
                <div className="scrolly-steps-step-content">
                  <h3 className="scrolly-steps-step-title">{step.title}</h3>
                  <div className="scrolly-steps-step-body">
                    <p>{step.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
