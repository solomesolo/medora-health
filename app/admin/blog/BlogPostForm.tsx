'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { slugify } from '@/lib/utils'
import Link from 'next/link'

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  author: string
  coverImage: string | null
  published: boolean
  publishedAt: Date | null
}

export default function BlogPostForm({ post }: { post?: BlogPost }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: post?.title || '',
    slug: post?.slug || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || '',
    author: post?.author || '',
    coverImage: post?.coverImage || '',
    published: post?.published ?? true,
    publishedAt: post?.publishedAt
      ? new Date(post.publishedAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  })

  // Auto-generate slug from title
  useEffect(() => {
    if (!post && formData.title && !formData.slug) {
      setFormData((prev) => ({ ...prev, slug: slugify(formData.title) }))
    }
  }, [formData.title, formData.slug, post])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = post
        ? `/api/admin/posts/${post.id}`
        : '/api/admin/posts'
      const method = post ? 'PATCH' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push('/admin/blog')
        router.refresh()
      } else {
        const error = await res.json()
        alert(error.error || 'Failed to save post')
      }
    } catch (error) {
      alert('Failed to save post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
          <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
      </div>

      <div>
          <label htmlFor="slug" className="block mb-2 text-sm font-medium text-gray-700">
            Slug *
          </label>
          <input
            type="text"
            id="slug"
            value={formData.slug}
            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="mt-1 text-sm text-gray-500">
            URL-friendly version (auto-generated from title)
          </p>
      </div>

      <div>
          <label htmlFor="excerpt" className="block mb-2 text-sm font-medium text-gray-700">
            Excerpt *
          </label>
          <textarea
            id="excerpt"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
      </div>

      <div>
          <label htmlFor="content" className="block mb-2 text-sm font-medium text-gray-700">
            Content (Markdown) *
          </label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={20}
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-700">
            Category *
          </label>
          <input
            type="text"
            id="category"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label htmlFor="author" className="block mb-2 text-sm font-medium text-gray-700">
            Author *
          </label>
          <input
            type="text"
            id="author"
            value={formData.author}
            onChange={(e) =>
              setFormData({ ...formData, author: e.target.value })
            }
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      <div>
          <label htmlFor="coverImage" className="block mb-2 text-sm font-medium text-gray-700">
            Cover Image URL
          </label>
          <input
            type="url"
            id="coverImage"
            value={formData.coverImage}
            onChange={(e) =>
              setFormData({ ...formData, coverImage: e.target.value })
            }
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://example.com/image.jpg"
          />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="publishedAt" className="block mb-2 text-sm font-medium text-gray-700">
            Published Date
          </label>
          <input
            type="date"
            id="publishedAt"
            value={formData.publishedAt}
            onChange={(e) =>
              setFormData({ ...formData, publishedAt: e.target.value })
            }
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.published}
              onChange={(e) =>
                setFormData({ ...formData, published: e.target.checked })
              }
              className="w-5 h-5"
            />
            <span className="text-gray-700">Published</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium shadow-sm"
          >
            {loading ? 'Saving...' : post ? 'Update Post' : 'Create Post'}
          </button>
          <Link
            href="/admin/blog"
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </Link>
      </div>
    </form>
  )
}

