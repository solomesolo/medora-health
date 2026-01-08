'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

interface Post {
  id: string
  title: string
  slug: string
  category: string
  coverImage: string | null
}

interface FeaturedCarouselProps {
  posts: Post[]
}

export default function FeaturedCarousel({ posts }: FeaturedCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320 // Approximate card width + gap
      scrollContainerRef.current.scrollBy({ left: -cardWidth, behavior: 'smooth' })
      setCurrentIndex(Math.max(0, currentIndex - 1))
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const cardWidth = 320
      scrollContainerRef.current.scrollBy({ left: cardWidth, behavior: 'smooth' })
      setCurrentIndex(Math.min(posts.length - 1, currentIndex + 1))
    }
  }

  if (posts.length === 0) return null

  return (
    <div className="mt-0">
      <div className="flex items-center justify-between mb-10">
        <h2 className="text-3xl font-semibold text-white/90 tracking-tight">Featured Content</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={scrollLeft}
            disabled={currentIndex === 0}
            className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-white/70" />
          </button>
          <button
            onClick={scrollRight}
            disabled={currentIndex >= posts.length - 1}
            className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>
      
      <div
        ref={scrollContainerRef}
        className="flex gap-8 overflow-x-auto scrollbar-hide pb-6 -mx-2 px-2"
      >
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="group flex-shrink-0 w-[320px] rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden hover:bg-white/[0.05] hover:border-white/18 transition duration-300"
          >
            {/* Image */}
            <div className="aspect-[4/3] w-full overflow-hidden">
              {post.coverImage ? (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent"></div>
              )}
            </div>
            
            {/* Content */}
            <div className="p-6">
              <div className="text-xs uppercase tracking-widest text-[#5F7D73] mb-3 font-medium">
                {post.category}
              </div>
              <h3 className="text-lg font-semibold text-white/90 leading-tight group-hover:text-white transition-colors line-clamp-2 mb-4">
                {post.title}
              </h3>
              <div className="flex items-center justify-end">
                <ArrowRight className="w-5 h-5 text-white/50 group-hover:text-white/90 transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

