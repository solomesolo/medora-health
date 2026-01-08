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
    <div className="min-h-screen bg-[#2F3B34]">
      {/* Hero Section with Cover Image */}
      {post.coverImage && (
        <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2F3B34] via-[#2F3B34]/80 to-[#2F3B34]/40"></div>
          </div>
        </div>
      )}

      <article className="relative">
        <div className="mx-auto max-w-4xl pl-12 pr-6 pt-24 pb-20 lg:pl-20 lg:pr-12 lg:pt-32 lg:pb-28">
          {/* Back Button */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white/80 transition-colors duration-300 mb-16 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" />
            <span className="font-medium">Back to blog</span>
          </Link>

          {/* Article Header */}
          <header className="mb-20">
            <div className="text-xs uppercase tracking-widest text-[#5F7D73] mb-8 font-medium">
              {post.category}
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold mb-12 text-white/90 leading-tight font-serif">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/50 mb-12">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white/40" />
                <span className="font-medium text-white/60">{post.author}</span>
              </div>
              {post.publishedAt && (
                <>
                  <span className="text-white/30">•</span>
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-white/40" />
                    <time dateTime={post.publishedAt.toISOString()} className="text-white/50">
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </time>
                  </div>
                </>
              )}
              <span className="text-white/30">•</span>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white/40" />
                <span className="text-white/50">{readingTime} min read</span>
              </div>
            </div>

            <div 
              className="h-px" 
              style={{ 
                background: 'linear-gradient(to right, transparent, rgba(243, 241, 236, 0.1), transparent)',
                opacity: 0.5,
                filter: 'blur(0.5px)'
              }}
            />
          </header>

          {/* Article Content */}
          <div className="prose prose-invert prose-lg max-w-none 
            prose-headings:text-white prose-headings:font-semibold prose-headings:font-serif
            prose-h1:text-4xl prose-h1:mb-8 prose-h1:mt-16 prose-h1:leading-tight
            prose-h2:text-3xl prose-h2:mb-6 prose-h2:mt-14 prose-h2:leading-tight
            prose-h3:text-2xl prose-h3:mb-4 prose-h3:mt-12 prose-h3:leading-tight
            prose-p:text-white/70 prose-p:leading-relaxed prose-p:mb-8 prose-p:text-base
            prose-a:text-[#5F7D73] prose-a:no-underline hover:prose-a:text-[#7A9B8F] hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-code:text-[#5F7D73] prose-code:bg-white/[0.05] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:border prose-code:border-white/10
            prose-pre:bg-white/[0.03] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl prose-pre:p-8
            prose-blockquote:border-l-4 prose-blockquote:border-[#5F7D73]/50 prose-blockquote:pl-8 prose-blockquote:italic prose-blockquote:text-white/60 prose-blockquote:my-10
            prose-ul:list-disc prose-ol:list-decimal prose-ul:pl-6 prose-ol:pl-6
            prose-li:text-white/70 prose-li:mb-3 prose-li:leading-relaxed
            prose-img:rounded-xl prose-img:shadow-2xl prose-img:my-12
            prose-hr:border-white/10 prose-hr:my-16
            mb-20">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {/* Share Buttons */}
          <div className="mt-20">
            <ShareButtons url={canonicalUrl} title={post.title} />
          </div>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-32 pt-20">
              <div 
                className="h-px mb-16" 
                style={{ 
                  background: 'linear-gradient(to right, transparent, rgba(243, 241, 236, 0.1), transparent)',
                  opacity: 0.5,
                  filter: 'blur(0.5px)'
                }}
              />
              <h2 className="text-3xl font-semibold text-white/90 mb-12 font-serif">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur hover:bg-white/[0.05] hover:border-white/18 transition-all duration-300"
                  >
                    {related.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={related.coverImage}
                          alt={related.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#2F3B34]/80 via-[#2F3B34]/20 to-transparent"></div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="text-xs uppercase tracking-widest text-[#5F7D73] mb-3 font-medium">
                        {related.category}
                      </div>
                      <h3 className="text-lg font-semibold mb-3 text-white/90 group-hover:text-white transition-colors duration-300 line-clamp-2 leading-tight">
                        {related.title}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-2 leading-relaxed">
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
