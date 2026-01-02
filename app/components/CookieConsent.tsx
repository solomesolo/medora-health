'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)

  useEffect(() => {
    // Check if consent has been given
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) {
      // Check if analytics was previously enabled
      const analytics = localStorage.getItem('cookie-analytics')
      setAnalyticsEnabled(analytics === 'true')
      setShowBanner(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    localStorage.setItem('cookie-analytics', analyticsEnabled ? 'true' : 'false')
    setShowBanner(false)
    setShowDetails(false)
    setShowSettings(false)
  }

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    localStorage.setItem('cookie-analytics', 'false')
    setShowBanner(false)
    setShowDetails(false)
    setShowSettings(false)
  }

  const handleSaveSettings = () => {
    localStorage.setItem('cookie-consent', 'custom')
    localStorage.setItem('cookie-analytics', analyticsEnabled ? 'true' : 'false')
    setShowBanner(false)
    setShowDetails(false)
    setShowSettings(false)
  }

  const openSettings = () => {
    setShowSettings(true)
    setShowDetails(false)
  }

  if (!showBanner) return null

  return (
    <>
      <noscript>
        <div className="fixed bottom-6 left-6 z-[10000] max-w-[420px] bg-[#4A4541] border border-white/10 rounded-lg p-6">
          <p className="text-[#B9AF9A] text-sm">
            This website uses cookies. Please enable JavaScript to manage your cookie preferences.
          </p>
        </div>
      </noscript>
      <div className="fixed bottom-6 left-6 z-[10000] max-w-[420px]">
        <div className="bg-[#4A4541] border border-white/10 rounded-lg p-6 shadow-lg">
        {!showSettings ? (
          <>
            <p className="text-[#B9AF9A] text-sm leading-relaxed mb-4">
              We use cookies to enhance your experience and analyze site usage. 
              {!showDetails && (
                <>
                  {' '}
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-[#5F7D73] hover:text-[#7A9B8F] underline focus:outline-none focus:ring-2 focus:ring-[#5F7D73] focus:ring-offset-2 focus:ring-offset-[#4A4541] rounded"
                  >
                    View details
                  </button>
                </>
              )}
            </p>

            {showDetails && (
              <div className="mb-4 space-y-4 pt-4 border-t border-white/10">
                <div>
                  <h3 className="text-[#F3F1EC] text-sm font-semibold mb-2">Essential</h3>
                  <p className="text-[#B9AF9A] text-xs leading-relaxed">
                    These cookies are necessary for the website to function. They cannot be disabled.
                  </p>
                </div>
                <div>
                  <h3 className="text-[#F3F1EC] text-sm font-semibold mb-2">Analytics</h3>
                  <p className="text-[#B9AF9A] text-xs leading-relaxed">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAccept}
                className="text-[#5F7D73] hover:text-[#7A9B8F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5F7D73] focus:ring-offset-2 focus:ring-offset-[#4A4541] rounded px-2 py-1"
              >
                Accept all
              </button>
              <button
                onClick={handleReject}
                className="text-[#B9AF9A] hover:text-[#F3F1EC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5F7D73] focus:ring-offset-2 focus:ring-offset-[#4A4541] rounded px-2 py-1"
              >
                Reject all
              </button>
              <button
                onClick={openSettings}
                className="text-[#B9AF9A] hover:text-[#F3F1EC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5F7D73] focus:ring-offset-2 focus:ring-offset-[#4A4541] rounded px-2 py-1"
              >
                Customize
              </button>
            </div>
          </>
        ) : (
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
                      <div className="w-11 h-6 bg-white/10 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#5F7D73] peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/20 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5F7D73]"></div>
                    </label>
                  </div>
                  <p className="text-[#B9AF9A] text-xs leading-relaxed">
                    These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
              <button
                onClick={handleSaveSettings}
                className="text-[#5F7D73] hover:text-[#7A9B8F] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5F7D73] focus:ring-offset-2 focus:ring-offset-[#4A4541] rounded px-2 py-1"
              >
                Save preferences
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="text-[#B9AF9A] hover:text-[#F3F1EC] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#5F7D73] focus:ring-offset-2 focus:ring-offset-[#4A4541] rounded px-2 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        </div>
      </div>
    </>
  )
}

