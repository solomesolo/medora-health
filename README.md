# Medora Blog System

A full-featured blog system built with Next.js, Prisma, and SQLite.

## Features

- ✅ Blog index page with search and category filters
- ✅ Dynamic article pages with markdown rendering
- ✅ Social sharing metadata (OpenGraph, Twitter cards)
- ✅ Share buttons (Twitter, LinkedIn, copy link)
- ✅ Admin panel with authentication
- ✅ Full CRUD operations for blog posts
- ✅ Slug generation and uniqueness validation

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Create a `.env` file with:
```
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3008"
ADMIN_PASSWORD="your-secure-password-here"
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Generate Prisma client:
```bash
npm run prisma:generate
```

5. Start the development server:
```bash
npm run dev
```

## Usage

### Accessing the Blog

- Public blog: `http://localhost:3008/blog`
- Admin panel: `http://localhost:3008/admin/blog`
- Login: `http://localhost:3008/admin/login`

### Creating Posts

1. Log in to the admin panel using the password from `.env`
2. Click "New Post"
3. Fill in the form:
   - Title (slug auto-generates)
   - Excerpt
   - Content (Markdown supported)
   - Category
   - Author
   - Cover Image URL (optional)
   - Published status
   - Published date

### Markdown Support

Posts support full Markdown with GitHub Flavored Markdown (GFM):
- Headings, lists, links
- Code blocks with syntax highlighting
- Tables, strikethrough, task lists

## Deployment

1. Set environment variables on your hosting platform
2. Run `npm run build`
3. Deploy the `.next` folder

For production, consider:
- Using a PostgreSQL database instead of SQLite
- Setting up proper image hosting for cover images
- Adding rate limiting to admin routes
- Implementing proper authentication (OAuth, etc.)

## Project Structure

```
app/
  blog/              # Public blog pages
    [slug]/          # Individual article pages
  admin/              # Admin panel
    login/           # Admin login
    blog/            # Blog management
      new/           # Create new post
      [id]/edit/     # Edit existing post
  api/
    admin/           # Admin API routes
      auth/          # Authentication
      posts/         # CRUD operations
lib/
  prisma.ts          # Prisma client singleton
  utils.ts           # Utility functions
prisma/
  schema.prisma      # Database schema
```

