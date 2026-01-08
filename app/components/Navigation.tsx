'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    // Determine active section based on pathname
    if (pathname !== '/') {
      setActiveSection('')
      return
    }

    // For the main page, use scroll position to determine active section
    const updateActiveSection = () => {
      const sections = ['hero', 'reality', 'failure', 'solution', 'engagement', 'audience', 'founder', 'packages', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i])
        if (section) {
          const sectionTop = section.offsetTop
          const sectionBottom = sectionTop + section.offsetHeight
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            setActiveSection(sections[i])
            return
          }
        }
      }
      
      // Default to hero if at the top
      if (window.scrollY < 100) {
        setActiveSection('hero')
      }
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })
    
    return () => {
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [pathname])

  const navItems = [
    { href: '/#hero', target: 'hero', label: 'Hero', external: false },
    { href: '/#reality', target: 'reality', label: 'Reality', external: false },
    { href: '/#failure', target: 'failure', label: 'Why It Fails', external: false },
    { href: '/#solution', target: 'solution', label: 'What We Do', external: false },
    { href: '/#engagement', target: 'engagement', label: 'Engagement', external: false },
    { href: '/#audience', target: 'audience', label: "Who It's For", external: false },
    { href: '/#founder', target: 'founder', label: 'Founder', external: false },
    { href: '/#packages', target: 'packages', label: 'Packages', external: false },
    { href: 'https://substack.com/@medoraagency', target: 'blog', label: 'Blog', external: true },
    { href: 'https://www.eventbrite.co.uk/o/medora-health-120819087631', target: 'events', label: 'Events', external: true },
    { href: '/#contact', target: 'contact', label: 'Contact', external: false },
  ]

  return (
    <nav className="top-navigation" role="navigation" aria-label="Main navigation">
      <div className="nav-container">
        {navItems.map((item) => {
          const isActive = activeSection === item.target
          
          if (item.external) {
            return (
              <a
                key={item.target}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`nav-item ${isActive ? 'active' : ''}`}
                data-target={item.target}
              >
                {item.label}
              </a>
            )
          }
          
          return (
            <Link
              key={item.target}
              href={item.href}
              className={`nav-item ${isActive ? 'active' : ''}`}
              data-target={item.target}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

