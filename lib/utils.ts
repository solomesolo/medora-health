/**
 * Slugify a string for use in URLs
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Generate a unique slug by appending a number if needed
 */
export async function generateUniqueSlug(
  baseSlug: string,
  existingSlug?: string
): Promise<string> {
  const prisma = (await import('./prisma')).prisma
  let slug = baseSlug
  let counter = 1

  while (true) {
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    })

    // If this is an update and the slug matches the existing one, it's fine
    if (existing && existing.slug === existingSlug) {
      return slug
    }

    // If slug doesn't exist, we're good
    if (!existing) {
      return slug
    }

    // Otherwise, try with a number suffix
    slug = `${baseSlug}-${counter}`
    counter++
  }
}

/**
 * Calculate reading time from word count
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const wordCount = content.trim().split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

