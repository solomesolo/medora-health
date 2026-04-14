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
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-4 text-base font-semibold text-slate-900">Your preferences</h2>

        <div className="space-y-6">
          <div>
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold text-slate-900">Essential</h3>
              <span className="shrink-0 text-xs text-slate-500">Always active</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Required for the site to function (e.g. security, load balancing). These cannot be disabled here.
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-start justify-between gap-4">
              <h3 className="text-sm font-semibold text-slate-900">Analytics</h3>
              <label className="relative inline-flex cursor-pointer items-center">
                <input
                  type="checkbox"
                  checked={analyticsEnabled}
                  onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                  className="peer sr-only"
                  aria-label="Enable analytics cookies"
                  aria-checked={analyticsEnabled}
                  role="switch"
                />
                <span className="relative h-6 w-11 shrink-0 rounded-full bg-slate-200 transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 peer-focus-visible:ring-offset-2 peer-checked:bg-blue-600 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition-transform peer-checked:after:translate-x-[20px]" />
              </label>
            </div>
            <p className="text-xs leading-relaxed text-slate-600">
              Optional. Helps us understand how visitors use the site in aggregate. No advertising cookies are set
              through this control.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          Save preferences
        </button>
      </div>
    </div>
  )
}
