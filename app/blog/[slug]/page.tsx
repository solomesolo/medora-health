import { prisma } from '@/lib/prisma'
import { calculateReadingTime } from '@/lib/utils'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import Link from 'next/link'
import ShareButtons from './ShareButtons'
import { CalendarDays, Clock, ArrowLeft, User } from 'lucide-react'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  })

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3008'
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`
  const ogImage =
    post.coverImage || `${siteUrl}/og-default.png`

  return {
    title: `${post.title} - Medora Blog`,
    description: post.excerpt,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: canonicalUrl,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      authors: [post.author],
      tags: [post.category],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [ogImage],
    },
  }
}

async function getPost(slug: string) {
  return prisma.blogPost.findUnique({
    where: { slug, published: true },
  })
}

async function getRelatedPosts(category: string, excludeId: string) {
  return prisma.blogPost.findMany({
    where: {
      category,
      published: true,
      id: { not: excludeId },
    },
    take: 3,
    orderBy: {
      publishedAt: 'desc',
    },
  })
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPost(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = await getRelatedPosts(post.category, post.id)
  const readingTime = calculateReadingTime(post.content)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3008'
  const canonicalUrl = `${siteUrl}/blog/${post.slug}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Hero Section with Cover Image */}
      {post.coverImage && (
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-slate-950/40"></div>
          </div>
        </div>
      )}

      <article className="relative">
        <div className="container mx-auto px-6 py-16 max-w-4xl">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to blog</span>
          </Link>

          {/* Article Header */}
          <header className="mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              {post.category}
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 mb-8">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">{post.author}</span>
              </div>
              {post.publishedAt && (
                <div className="flex items-center gap-2">
                  <CalendarDays className="w-5 h-5" />
                  <time dateTime={post.publishedAt.toISOString()}>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </time>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{readingTime} min read</span>
              </div>
            </div>

            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-bold
            prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-12
            prose-h2:text-3xl prose-h2:mb-4 prose-h2:mt-10
            prose-h3:text-2xl prose-h3:mb-3 prose-h3:mt-8
            prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:text-emerald-300 hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-emerald-400 prose-code:bg-slate-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm
            prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-slate-700/50 prose-pre:rounded-xl prose-pre:p-6
            prose-blockquote:border-l-4 prose-blockquote:border-emerald-500/50 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-slate-400
            prose-ul:list-disc prose-ol:list-decimal
            prose-li:text-slate-300 prose-li:mb-2
            prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-8
            prose-hr:border-slate-700 prose-hr:my-12
            mb-16">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share Buttons */}
          <ShareButtons url={canonicalUrl} title={post.title} />

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-24 pt-16 border-t border-slate-800/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent flex-1"></div>
                <h2 className="text-2xl font-bold text-white">Related Articles</h2>
                <div className="h-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent flex-1"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group block overflow-hidden rounded-xl bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/30 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-1"
                  >
                    {related.coverImage && (
                      <div className="relative h-40 overflow-hidden">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-900/10 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <h3 className="font-bold mb-2 text-white group-hover:text-emerald-400 transition-colors duration-300 line-clamp-2">
                        {related.title}
                      </h3>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                        {related.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
