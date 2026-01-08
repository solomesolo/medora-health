import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const dummyPosts = [
  {
    title: "Accounting x AI",
    slug: "accounting-x-ai",
    excerpt: "How artificial intelligence is transforming financial workflows and accounting processes in healthcare organizations.",
    content: "# Accounting x AI\n\nArtificial intelligence is revolutionizing how healthcare organizations handle their financial operations...",
    category: "AI & Technology",
    author: "Anna Solovyova",
    coverImage: null,
    published: true,
    publishedAt: new Date('2024-01-15'),
  },
  {
    title: "Sales x AI",
    slug: "sales-x-ai",
    excerpt: "Leveraging AI to accelerate sales cycles and improve conversion rates in healthtech markets.",
    content: "# Sales x AI\n\nAI-powered sales tools are changing the game for healthtech companies...",
    category: "Sales & Growth",
    author: "Anna Solovyova",
    coverImage: null,
    published: true,
    publishedAt: new Date('2024-01-10'),
  },
  {
    title: "The Future of AI is Already Here",
    slug: "future-of-ai-already-here",
    excerpt: "AI will make you 20% more efficient. Discover how early adopters are already seeing results.",
    content: "# The Future of AI is Already Here\n\nThe future isn't coming—it's already here. Healthcare organizations using AI are seeing dramatic efficiency gains...",
    category: "AI & Technology",
    author: "Anna Solovyova",
    coverImage: null,
    published: true,
    publishedAt: new Date('2024-01-05'),
  },
  {
    title: "Owning the Workflow in B2B Apps",
    slug: "owning-workflow-b2b-apps",
    excerpt: "How to design B2B applications that seamlessly integrate into existing clinical workflows.",
    content: "# Owning the Workflow in B2B Apps\n\nSuccessful B2B healthtech applications don't disrupt workflows—they enhance them...",
    category: "Product Design",
    author: "Anna Solovyova",
    coverImage: null,
    published: true,
    publishedAt: new Date('2023-12-20'),
  },
  {
    title: "How AI Will Turn Capital into Labor",
    slug: "ai-capital-into-labor",
    excerpt: "Exploring the economic transformation as AI capabilities become more accessible and affordable.",
    content: "# How AI Will Turn Capital into Labor\n\nThe democratization of AI is fundamentally changing how we think about capital and labor...",
    category: "Economics & Strategy",
    author: "Anna Solovyova",
    coverImage: null,
    published: true,
    publishedAt: new Date('2023-12-15'),
  },
  {
    title: "Need for Speed in AI Sales: AI Doesn't Just Change What You Sell. It Also Changes How You Sell It.",
    slug: "need-for-speed-ai-sales",
    excerpt: "Enterprise sales are evolving fast. Startups are now adapting their GTM playbooks for the AI era: faster pilots, proof-driven demos, and higher trust standards.",
    content: "# Need for Speed in AI Sales\n\nEnterprise sales are evolving fast. Startups are now adapting their GTM playbooks for the AI era...",
    category: "Sales & Growth",
    author: "Seema Amble and James da Costa",
    coverImage: null,
    published: true,
    publishedAt: new Date('2023-12-10'),
  },
  {
    title: "Investing in Stuut: Automating Accounts Receivable",
    slug: "investing-in-stuut",
    excerpt: "Contrary to popular belief, once you've sold something, people don't just rush to pay you. We have a signed contract, and they're happy with the service—they should just pay their bills!",
    content: "# Investing in Stuut\n\nContrary to popular belief, once you've sold something, people don't just rush to pay you...",
    category: "Investments",
    author: "Seema Amble, Joe Schmidt, and Brian Roberts",
    coverImage: null,
    published: true,
    publishedAt: new Date('2023-12-05'),
  },
  {
    title: "Investing in Sphere",
    slug: "investing-in-sphere",
    excerpt: "As more software companies launch globally from day one, they're quickly confronted by a nasty surprise: international compliance and regulatory challenges.",
    content: "# Investing in Sphere\n\nAs more software companies launch globally from day one, they're quickly confronted by international challenges...",
    category: "Investments",
    author: "Marc Andrusko",
    coverImage: null,
    published: true,
    publishedAt: new Date('2023-11-28'),
  },
]

async function main() {
  console.log('Adding dummy posts...')
  
  for (const post of dummyPosts) {
    try {
      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        update: post,
        create: post,
      })
      console.log(`✓ Added/Updated: ${post.title}`)
    } catch (error) {
      console.error(`✗ Error adding ${post.title}:`, error)
    }
  }
  
  console.log('Done!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })


