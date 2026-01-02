'use client'

import { useState, useEffect } from 'react'

export default function CookieSettings() {
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const analytics = localStorage.getItem('cookie-analytics')
    setAnalyticsEnabled(analytics === 'true')
  }, [])

  const handleSave = () => {
    localStorage.setItem('cookie-consent', 'custom')
    localStorage.setItem('cookie-analytics', analyticsEnabled ? 'true' : 'false')
    // Close or show confirmation
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-[#F3F1EC] text-base font-semibold mb-4">Cookie Settings</h2>
        
        <div className="space-y-6">
          {/* Essential Cookies */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[#F3F1EC] text-sm font-semibold">Essential</h3>
              <span className="text-[#8A9B8A] text-xs">Always active</span>
            </div>
            <p className="text-[#B9AF9A] text-xs leading-relaxed">
              These cookies are necessary for the website to function. They cannot be disabled.
            </p>
          </div>

          {/* Analytics Cookies */}
          <div>
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-[#F3F1EC] text-sm font-semibold">Analytics</h3>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="sr-only peer"
                  aria-label="Enable analytics cookies"
                  aria-checked={analyticsEnabled}
                  role="switch"
                />
                <div className="w-11 h-6 bg-white/10 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#5F7D73] peer-focus:ring-offset-2 peer-focus:ring-offset-[#4A4541] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/20 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5F7D73]"></div>
              </label>
            </div>
            <p className="text-[#B9AF9A] text-xs leading-relaxed">
              These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
            </p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          className="text-[#5F7D73] hover:text-[#7A9B8F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5F7D73] focus:ring-offset-2 focus:ring-offset-[#4A4541] rounded px-2 py-1"
        >
          Save preferences
        </button>
      </div>
    </div>
  )
}

