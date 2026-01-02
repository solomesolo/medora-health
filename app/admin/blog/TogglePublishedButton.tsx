'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function TogglePublishedButton({
  id,
  published,
}: {
  id: string
  published: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/posts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !published }),
      })

      if (res.ok) {
        router.refresh()
      } else {
        alert('Failed to update post')
      }
    } catch (error) {
      alert('Failed to update post')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 disabled:opacity-50 transition-colors"
    >
      {loading ? '...' : published ? 'Unpublish' : 'Publish'}
    </button>
  )
}

