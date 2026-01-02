import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { CalendarDays, Clock, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Blog - Medora',
  description: 'Insights on healthtech adoption, conversion engineering, and clinical workflow optimization.',
}

async function getPosts() {
  try {
    const posts = await prisma.blogPost.findMany({
      where: {
        published: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
    console.log('Raw posts from DB:', posts.length, posts.map(p => ({ id: p.id, title: p.title, published: p.published, publishedAt: p.publishedAt })))
    // Sort by publishedAt if available, otherwise by createdAt
    const sorted = posts.sort((a, b) => {
      const aDate = a.publishedAt || a.createdAt
      const bDate = b.publishedAt || b.createdAt
      return bDate.getTime() - aDate.getTime()
    })
    console.log('Sorted posts:', sorted.length)
    return sorted
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

function getCover(post: { coverImage: string | null }): string | null {
  return post.coverImage || null
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; category?: string }>
}) {
  const params = await searchParams
  let posts = await getPosts()
  
  // Filter by category
  if (params.category) {
    posts = posts.filter((post) => post.category === params.category)
  }
  
  // Filter by search (case-insensitive)
  if (params.search) {
    const searchLower = params.search.toLowerCase()
    posts = posts.filter(
      (post) =>
        post.title.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower)
    )
  }
  
  const featuredPost = posts.length > 0 ? posts[0] : null
  const recentPosts = posts.length > 1 ? posts.slice(1, 7) : [] // 6 recent posts for right column
  const allOtherPosts = posts.length > 7 ? posts.slice(7) : [] // Posts beyond the first 7

  // Debug: Log posts count
  console.log('[BlogPage] Total posts:', posts.length)
  console.log('[BlogPage] Featured post:', featuredPost?.title || 'none')
  
  return (
    <section className="relative overflow-hidden bg-[#2F3B34] min-h-screen">
      {/* Background pattern - matching landing page style */}
      <div className="absolute inset-0 bg-[#2F3B34] opacity-100">
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(243, 241, 236, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(243, 241, 236, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-20 lg:py-28 relative z-10">
        {/* Hero */}
        <div>
          <h1 className="text-5xl lg:text-6xl font-semibold tracking-tight text-white/90 font-serif mb-5">
            Medora Journal
          </h1>
          <p className="text-lg text-white/65 leading-relaxed">
            Exploring healthtech adoption, conversion engineering, and the future of clinical workflows.
          </p>
        </div>

        {/* Main Blog Layout: Featured (left) + Recent (right) */}
        {featuredPost ? (
          <div className="mt-14 grid grid-cols-12 gap-10 items-start">
            {/* LEFT: Featured Card (big) */}
            <div className="col-span-12 lg:col-span-7">
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="group block rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden hover:bg-white/[0.05] hover:border-white/18 transition duration-300"
              >
                {/* Image header */}
                <div className="aspect-[16/10] w-full overflow-hidden">
                  {getCover(featuredPost) ? (
                    <img
                      src={getCover(featuredPost)!}
                      alt={featuredPost.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent border-b border-white/10"></div>
                  )}
                </div>

                {/* Content block */}
                <div className="p-7 lg:p-8">
                  <div className="text-xs uppercase tracking-widest text-white/45">
                    {featuredPost.category}
                  </div>
                  <h2 className="mt-2 text-2xl lg:text-3xl font-semibold text-white/90 leading-tight font-serif group-hover:text-white transition-colors">
                    {featuredPost.title}
                  </h2>
                  <p className="mt-3 text-sm lg:text-base text-white/65 leading-relaxed line-clamp-3">
                    {featuredPost.excerpt}
                  </p>
                  <div className="mt-5 text-sm text-white/50 flex items-center gap-4 flex-wrap">
                    {featuredPost.publishedAt && (
                      <>
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="w-4 h-4" />
                          <span>{new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <span>•</span>
                      </>
                    )}
                    <span>{featuredPost.author}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4" />
                      <span>{calculateReadingTime(featuredPost.content)} min read</span>
                    </div>
                  </div>
                  <div className="mt-6 inline-flex items-center gap-2 text-sm text-white/70 hover:text-white/90 transition-colors font-medium">
                    <span>Read article</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </div>

            {/* RIGHT: Recent Posts (stacked) */}
            <div className="col-span-12 lg:col-span-5">
              <h2 className="text-sm font-semibold tracking-widest text-white/60 uppercase">
                Recent posts
              </h2>
              <div className="mt-6 space-y-6">
                {recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.slug}`}
                    className="group block rounded-2xl border border-white/10 bg-white/[0.02] backdrop-blur p-4 hover:bg-white/[0.04] hover:border-white/18 transition duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10">
                        {getCover(post) ? (
                          <img
                            src={getCover(post)!}
                            alt={post.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent"></div>
                        )}
                      </div>

                      {/* Text content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-xs uppercase tracking-widest text-white/45">
                          {post.category}
                        </div>
                        <h3 className="mt-1 text-base font-semibold text-white/85 leading-snug line-clamp-2 group-hover:text-white transition-colors">
                          {post.title}
                        </h3>
                        <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="mt-2 text-xs text-white/45 flex items-center gap-2">
                          {post.publishedAt && (
                            <>
                              <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span>•</span>
                            </>
                          )}
                          <span>{calculateReadingTime(post.content)} min</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14 text-center py-20">
            <div className="inline-block rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur p-12 max-w-md">
              <div className="text-white/60 mb-4 text-lg">No articles found.</div>
              <p className="text-white/45 text-sm">Check back soon for new insights.</p>
            </div>
          </div>
        )}

        {/* All Posts Section */}
        {allOtherPosts.length > 0 && (
          <div className="mt-20 lg:mt-28">
            <h2 className="text-sm font-semibold tracking-widest text-white/60 uppercase mb-8">
              All Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allOtherPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group block rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur overflow-hidden hover:bg-white/[0.05] hover:border-white/18 transition duration-300 ease-out hover:-translate-y-[2px]"
                >
                  {/* Image */}
                  <div className="aspect-[16/9] w-full overflow-hidden">
                    {getCover(post) ? (
                      <img
                        src={getCover(post)!}
                        alt={post.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-transparent border-b border-white/10"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="text-xs uppercase tracking-widest text-white/45 mb-3">
                      {post.category}
                    </div>
                    <h3 className="text-xl font-semibold text-white/85 mb-3 group-hover:text-white transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/60 line-clamp-2 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-white/50">
                      {post.publishedAt && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3" />
                            <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                          </div>
                          <span>•</span>
                        </>
                      )}
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3" />
                        <span>{calculateReadingTime(post.content)} min</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-20 mt-14">
            <div className="inline-block rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur p-12 max-w-md">
              <div className="text-white/60 mb-4 text-lg">No articles found.</div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Legal Navigation */}
      <footer className="legal-footer" style={{ 
        padding: '3rem 1.5rem', 
        borderTop: '1px solid rgba(243, 241, 236, 0.08)', 
        marginTop: '3rem', 
        position: 'relative', 
        zIndex: 10,
        backgroundColor: '#2F3B34',
        width: '100%'
      }}>
        <div className="container" style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: 'rgba(185, 175, 154, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
              Privacy Policy
            </Link>
            <Link href="/cookie-settings" style={{ color: 'rgba(185, 175, 154, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
              Cookie Settings
            </Link>
            <Link href="/imprint" style={{ color: 'rgba(185, 175, 154, 0.7)', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}>
              Imprint
            </Link>
          </div>
        </div>
      </footer>
    </section>
  )
}
