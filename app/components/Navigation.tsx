'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

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
    { href: '/#hero', target: 'hero', label: 'Main', external: false },
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

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Prevent body scroll when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
    document.body.style.overflow = ''
  }

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (isMenuOpen && !target.closest('.mobile-menu') && !target.closest('.burger-button')) {
        closeMenu()
      }
    }

    // Close on escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu()
      }
    }

    if (isMenuOpen) {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  return (
    <>
      <nav className="top-navigation" role="navigation" aria-label="Main navigation">
        <div className="nav-container desktop-nav">
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
        
        {/* Burger Menu Button */}
        <button 
          className="burger-button"
          onClick={toggleMenu}
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
          <span className={`burger-line ${isMenuOpen ? 'open' : ''}`}></span>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu-overlay ${isMenuOpen ? 'open' : ''}`} onClick={closeMenu}></div>

      {/* Mobile Menu Sidebar */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <h3 className="mobile-menu-title">Menu</h3>
          <button className="mobile-menu-close" onClick={closeMenu} aria-label="Close menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="mobile-menu-items">
          {navItems.map((item) => {
            const isActive = activeSection === item.target
            
            if (item.external) {
              return (
                <a
                  key={item.target}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              )
            }
            
            return (
              <Link
                key={item.target}
                href={item.href}
                className={`mobile-nav-item ${isActive ? 'active' : ''}`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            )
          })}
        </div>
      </div>
    </>
  )
}

