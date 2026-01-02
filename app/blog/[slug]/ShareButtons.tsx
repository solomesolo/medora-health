'use client'

import { useState } from 'react'
import { Twitter, Linkedin, Link2, Check } from 'lucide-react'

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(title)

  const shareTwitter = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`
  const shareLinkedIn = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-4 pt-12 border-t border-slate-800/50">
      <span className="text-slate-500 font-medium text-sm uppercase tracking-wider">Share this article</span>
      <div className="flex gap-3">
        <a
          href={shareTwitter}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-5 py-2.5 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all duration-300 text-slate-300 hover:text-white"
        >
          <Twitter className="w-4 h-4" />
          <span className="text-sm font-medium">Twitter</span>
        </a>
        <a
          href={shareLinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-5 py-2.5 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all duration-300 text-slate-300 hover:text-white"
        >
          <Linkedin className="w-4 h-4" />
          <span className="text-sm font-medium">LinkedIn</span>
        </a>
        <button
          onClick={copyLink}
          className="group flex items-center gap-2 px-5 py-2.5 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-xl hover:bg-slate-700/30 hover:border-slate-600/50 transition-all duration-300 text-slate-300 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-medium text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Link2 className="w-4 h-4" />
              <span className="text-sm font-medium">Copy Link</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
