import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify, generateUniqueSlug } from '@/lib/utils'

// Verify admin authentication
function isAdmin(request: NextRequest): boolean {
  const adminCookie = request.cookies.get('admin')
  return adminCookie?.value === '1'
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
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

    // Get existing post to check current slug
    const existing = await prisma.blogPost.findUnique({
      where: { id },
    })

    if (!existing) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Generate slug if changed
    let finalSlug = slug || existing.slug
    if (title && title !== existing.title && !slug) {
      finalSlug = await generateUniqueSlug(slugify(title), existing.slug)
    } else if (slug && slug !== existing.slug) {
      finalSlug = await generateUniqueSlug(slug, existing.slug)
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title,
        slug: finalSlug,
        excerpt,
        content,
        category,
        author,
        coverImage: coverImage || null,
        published,
        publishedAt: publishedAt ? new Date(publishedAt) : existing.publishedAt,
      },
    })

    return NextResponse.json(post)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 400 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!isAdmin(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { id } = await params
    await prisma.blogPost.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to delete post' },
      { status: 400 }
    )
  }
}

