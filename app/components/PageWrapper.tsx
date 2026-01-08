'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function PageWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  useEffect(() => {
    // Set data-page attribute on body for CSS targeting
    const page = pathname === '/privacy' ? 'privacy' :
                 pathname === '/imprint' ? 'imprint' :
                 pathname === '/cookie-settings' ? 'cookie-settings' :
                 'home'
    
    document.body.setAttribute('data-page', page)
    
    return () => {
      document.body.removeAttribute('data-page')
    }
  }, [pathname])
  
  return <>{children}</>
}


