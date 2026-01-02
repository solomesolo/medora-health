import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import BlogPostForm from '../../BlogPostForm'

async function getPost(id: string) {
  return prisma.blogPost.findUnique({
    where: { id },
  })
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('admin')

  if (!adminCookie || adminCookie.value !== '1') {
    redirect('/admin/login')
  }

  const { id } = await params
  const post = await getPost(id)

  if (!post) {
    notFound()
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">Edit Post</h1>
        <BlogPostForm post={post} />
      </div>
    </div>
  )
}

