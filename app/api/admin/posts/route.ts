import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify, generateUniqueSlug } from '@/lib/utils'

// Verify admin authentication
function isAdmin(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('admin')
  return adminCookie?.value === '1'
}

export async function GET(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const posts = await prisma.blogPost.findMany({
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(posts)
}

export async function POST(request: NextRequest) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const data = await request.json()
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      author,
      coverImage,
      published,
      publishedAt,
    } = data

    // Generate slug if not provided
    const baseSlug = slug || slugify(title)
    const uniqueSlug = await generateUniqueSlug(baseSlug)

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug: uniqueSlug,
        excerpt,
        content,
        category,
        author,
        coverImage: coverImage || null,
        published: published ?? true,
        publishedAt: publishedAt ? new Date(publishedAt) : new Date(),
      },
    })

    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 400 }
    )
  }
}

