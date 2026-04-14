'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function Navigation() {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState('')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/use-cases') {
      setActiveSection('use-cases')
      return
    }

    if (pathname !== '/') {
      setActiveSection('')
      return
    }

    const updateActiveSection = () => {
      const y = window.scrollY + window.innerHeight / 2
      const ids = [
        'contact',
        'final-close',
        'founder',
        'services',
        'solution',
        'reality',
        'hero',
      ] as const

      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const top = el.offsetTop
        const bottom = top + el.offsetHeight
        if (y >= top && y < bottom) {
          if (id === 'services') setActiveSection('services')
          else if (id === 'contact' || id === 'final-close' || id === 'founder')
            setActiveSection('contact')
          else setActiveSection('home')
          return
        }
      }

      if (window.scrollY < 80) setActiveSection('home')
    }

    updateActiveSection()
    window.addEventListener('scroll', updateActiveSection, { passive: true })

    return () => {
      window.removeEventListener('scroll', updateActiveSection)
    }
  }, [pathname])

  const navItems = [
    { href: '/#hero', target: 'home', label: 'Home', external: false },
    { href: '/#services', target: 'services', label: 'Services', external: false },
    { href: '/use-cases', target: 'use-cases', label: 'Use Cases', external: false },
    {
      href: 'https://medoraagency.substack.com/',
      target: 'blog',
      label: 'Blog',
      external: true,
    },
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
        <div className="nav-shell desktop-nav">
          <Link href="/#hero" className="nav-brand">
            Medora
          </Link>
          <div className="nav-links">
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

