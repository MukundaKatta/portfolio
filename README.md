# Developer Portfolio + Blog CMS

A fast, content-driven developer portfolio and blog built with Astro, MDX, and Cloudflare Pages.

## Features

- **MDX Blog** — Write posts in MDX with syntax highlighting (Shiki), table of contents, and reading time
- **Project Showcase** — Dedicated project pages with image galleries and live demos
- **Full-Text Search** — Client-side search powered by Pagefind
- **RSS Feed** — Auto-generated RSS for blog subscribers
- **Admin Panel** — Basic CMS interface for managing posts
- **Newsletter** — Subscription form backed by Cloudflare Functions
- **Contact Form** — Server-side form handling via Cloudflare Workers
- **SEO Optimized** — Sitemap, Open Graph tags, and structured data
- **Dark Mode** — Theme toggle with React island component
- **Edge Deployed** — Cloudflare Pages with Workers for API routes

## Tech Stack

- **Framework:** Astro 4 with MDX integration
- **Styling:** Tailwind CSS + @tailwindcss/typography
- **Interactive:** React 18 (island components)
- **Search:** Pagefind (static search index)
- **Syntax Highlighting:** Shiki
- **Image Processing:** Sharp
- **Deployment:** Cloudflare Pages + Workers (Wrangler)
- **Markdown:** rehype-slug, rehype-autolink-headings, remark-toc, remark-reading-time

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Wrangler CLI (for Cloudflare deployment)

### Installation

```bash
git clone <repo-url>
cd portfolio
npm install
```

### Run

```bash
npm run dev          # start Astro dev server
npm run build        # build static site + Pagefind index
npm run preview      # preview production build locally
npm run deploy       # deploy to Cloudflare Pages
```

## Project Structure

```
src/
├── content/
│   ├── blog/            # MDX blog posts
│   └── projects/        # MDX project case studies
├── pages/
│   ├── blog/            # Blog listing, post pages, tag pages
│   ├── projects/        # Project listing and detail pages
│   ├── admin/           # CMS admin panel
│   └── rss.xml.ts       # RSS feed generation
├── components/
│   ├── *.astro          # Static components (Hero, Cards, SEO)
│   └── react/           # Interactive islands (Search, ThemeToggle)
├── layouts/             # Base, Blog, and Project layouts
├── data/                # Site config and CMS data (JSON)
└── styles/              # Global CSS
functions/
└── api/                 # Cloudflare Worker endpoints
public/                  # Static assets
```

