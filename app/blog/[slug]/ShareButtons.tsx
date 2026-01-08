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
    <div className="flex flex-wrap items-center gap-6 pt-16">
      <div 
        className="h-px mb-16 -mt-16" 
        style={{ 
          background: 'linear-gradient(to right, transparent, rgba(243, 241, 236, 0.1), transparent)',
          opacity: 0.5,
          filter: 'blur(0.5px)'
        }}
      />
      <span className="text-white/50 font-medium text-sm uppercase tracking-wider">Share this article</span>
      <div className="flex gap-3">
        <a
          href={shareTwitter}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur hover:bg-white/[0.05] hover:border-white/18 transition-all duration-300 text-white/70 hover:text-white"
        >
          <Twitter className="w-4 h-4" />
          <span className="text-sm font-medium">Twitter</span>
        </a>
        <a
          href={shareLinkedIn}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur hover:bg-white/[0.05] hover:border-white/18 transition-all duration-300 text-white/70 hover:text-white"
        >
          <Linkedin className="w-4 h-4" />
          <span className="text-sm font-medium">LinkedIn</span>
        </a>
        <button
          onClick={copyLink}
          className="group flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur hover:bg-white/[0.05] hover:border-white/18 transition-all duration-300 text-white/70 hover:text-white"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-[#5F7D73]" />
              <span className="text-sm font-medium text-[#5F7D73]">Copied!</span>
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
