'use client'

import { useEffect } from 'react'

export default function HorizontalScroll() {
  useEffect(() => {
    // Initialize horizontal scroll functionality
    const container = document.querySelector('.horizontal-scroll-container') as HTMLElement
    if (!container) return

    const sections = container.querySelectorAll('.section')
    if (sections.length === 0) return

    const viewportWidth = window.innerWidth
    let isScrolling = false

    const scrollToSection = (index: number) => {
      if (isScrolling) return
      isScrolling = true
      container.scrollTo({
        left: index * viewportWidth,
        behavior: 'smooth'
      })
      setTimeout(() => {
        isScrolling = false
      }, 500)
    }

    // Handle navigation clicks
    const navItems = document.querySelectorAll('[data-target]')
    navItems.forEach((item) => {
      item.addEventListener('click', (e) => {
        const target = (item as HTMLElement).getAttribute('data-target')
        if (!target) return
        
        const sectionIndex = Array.from(sections).findIndex(
          (section) => section.id === target
        )
        if (sectionIndex !== -1) {
          e.preventDefault()
          scrollToSection(sectionIndex)
        }
      })
    })

    // Handle hash navigation
    const handleHash = () => {
      const hash = window.location.hash.slice(1)
      if (hash) {
        const sectionIndex = Array.from(sections).findIndex(
          (section) => section.id === hash
        )
        if (sectionIndex !== -1) {
          scrollToSection(sectionIndex)
        }
      }
    }

    window.addEventListener('hashchange', handleHash)
    handleHash()

    // Update active navigation on scroll
    const updateActiveNavigation = () => {
      const scrollLeft = container.scrollLeft
      const currentIndex = Math.round(scrollLeft / viewportWidth)
      const currentSection = sections[currentIndex]
      
      if (currentSection) {
        const target = currentSection.id
        navItems.forEach((item) => {
          const itemTarget = (item as HTMLElement).getAttribute('data-target')
          if (itemTarget === target) {
            item.classList.add('active')
          } else {
            item.classList.remove('active')
          }
        })
      }
    }

    container.addEventListener('scroll', updateActiveNavigation)
    updateActiveNavigation()

    return () => {
      navItems.forEach((item) => {
        item.removeEventListener('click', () => {})
      })
      window.removeEventListener('hashchange', handleHash)
      container.removeEventListener('scroll', updateActiveNavigation)
    }
  }, [])

  return null
}


