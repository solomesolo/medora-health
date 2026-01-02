import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import BlogPostForm from '../BlogPostForm'

export default async function NewPostPage() {
  const cookieStore = await cookies()
  const adminCookie = cookieStore.get('admin')

  if (!adminCookie || adminCookie.value !== '1') {
    redirect('/admin/login')
  }

  return (
    <div className="bg-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">New Post</h1>
        <BlogPostForm />
      </div>
    </div>
  )
}

