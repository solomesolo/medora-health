'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition, useEffect } from 'react'
import { Search, ChevronDown } from 'lucide-react'

export default function BlogSearch({ categories }: { categories: string[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [isPending, startTransition] = useTransition()

  // Update URL when search or category changes (debounced for search)
  useEffect(() => {
    const params = new URLSearchParams()
    if (search) params.set('search', search)
    if (category) params.set('category', category)
    
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        const queryString = params.toString()
        router.push(queryString ? `/blog?${queryString}` : '/blog')
      })
    }, search ? 300 : 0) // Debounce search, instant for category

    return () => clearTimeout(timeoutId)
  }, [search, category, router])

  const clearFilters = () => {
    setSearch('')
    setCategory('')
    startTransition(() => {
      router.push('/blog')
    })
  }

  const hasFilters = search || category

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur p-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search articles..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl border border-white/10 bg-white/[0.02] text-sm text-white/80 placeholder:text-white/40 outline-none focus:border-white/20 transition-colors"
          />
        </div>

        {/* Category Select */}
        <div className="relative w-full md:w-56">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white/70 outline-none focus:border-white/20 transition-colors appearance-none cursor-pointer pr-10"
          >
            <option value="" className="bg-[#2F3B34] text-white/70">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-[#2F3B34] text-white/70">
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
        </div>

        {/* Clear Button - only show when filters are active */}
        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-3 rounded-2xl border border-white/10 bg-white/[0.02] text-white/70 hover:bg-white/[0.05] hover:text-white/90 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
