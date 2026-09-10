# Sanity Studio CMS Setup: Standard Engineering & Agent Guide
> **Version:** 2.0 | **Target Stack:** Next.js (App Router 14/15/16) + React 18/19 + TypeScript + Sanity Studio v3  
> **Audience:** Design Engineers, Full-Stack Developers, and AI Coding Agents (Antigravity, Claude Code, Cursor)

---

## 1. Overview & Core Philosophy

This guide is the team's standard specification for integrating **Sanity Studio v3** directly into modern Next.js web applications.

### Key Tenets for Design Engineers
1. **Design-First Schema Modeling:** Schemas must reflect the actual UI layout and design tokens (sections, badges, galleries, CTAs), not abstract, disorganized generic blobs.
2. **Editor UX is Part of Product Design:** Content editors are users. Provide intuitive titles, helpful helper text, visual previews, collapsible groups, and prevent destructive actions (e.g. accidentally deleting singleton pages).
3. **Resilient Frontend Wiring:** The frontend must never crash if a field is empty. Always provide defensive fallbacks (`DEFAULT_*` constants or optional chaining).
4. **Agent-Executable:** Every section contains deterministic code templates, directory layouts, and execution steps so an AI agent can read this document and implement the CMS end-to-end without guessing.

---

## 2. Architecture & File Structure

All Sanity-related code lives in a clean, self-contained structure at the project root and inside the Next.js App Router:

```
├── app/
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx              # Embedded NextStudio client route
├── sanity/
│   ├── lib/
│   │   ├── client.ts                 # Sanity client instance (read token, fresh/cached)
│   │   ├── image.ts                  # @sanity/image-url builder utility
│   │   └── queries.ts                # GROQ queries with reusable projection fragments
│   └── schemaTypes/
│       ├── index.ts                  # Schema registry combining all types
│       ├── objects/                  # Reusable components (CTA, SEO, Gallery, SectionBlock)
│       │   ├── blockContent.ts
│       │   ├── ctaButton.ts
│       │   ├── gallery.ts
│       │   ├── galleryItem.ts
│       │   ├── sectionBlock.ts
│       │   ├── seo.ts
│       │   └── statItem.ts
│       ├── collections/              # Multi-document types (Projects, Blog, Team, Products)
│       │   ├── post.ts
│       │   └── project.ts
│       ├── pages/                    # Single-instance pages (HomePage, AboutPage, ContactPage)
│       │   ├── homePage.ts
│       │   └── aboutPage.ts
│       └── settings/                 # Global configuration (Navigation, SiteSettings, Footer)
│           ├── globalSettings.ts
│           └── navigation.ts
├── sanity.config.ts                  # Studio desk structure, brand theme, plugins, action rules
├── sanity.cli.ts                     # CLI configuration (projectId & dataset)
└── .env.local                        # API tokens & environment variables
```

---

## 3. Step-by-Step Implementation Workflow

### Step 1: Install Dependencies
Run the following package installation in the root of the Next.js repository:

```bash
npm install sanity next-sanity @sanity/image-url @sanity/vision @portabletext/react styled-components
```

> [!IMPORTANT]
> **React 19 & Next.js 15/16 Compatibility:**  
> `styled-components` (used by `@sanity/ui`) requires React 19 support. Ensure dependencies resolve cleanly. If npm flags peer dependency conflicts during initial installation, use:
> ```bash
> npm install --legacy-peer-deps
> ```

---

### Step 2: Environment Configuration & Access Tokens

1. Visit [sanity.io/manage](https://www.sanity.io/manage) and either create a new project or select an existing one.
2. Note your **Project ID** and **Dataset** (typically `production`).
3. Under **API → Tokens**, create two tokens:
   - **Read Token** (Viewer permission) — for querying private drafts or secure fetching.
   - **Editor / Write Token** (Editor permission) — for running automated seed/migration scripts.
4. Under **API → CORS Origins**, add:
   - `http://localhost:3000` (allow credentials: Yes)
   - `http://localhost:3001` (or your active dev port)
   - `https://*.vercel.app` (allow credentials: Yes)
   - Your custom production domain (e.g. `https://yourbrand.com`)

Create or update `.env.local`:

```bash
# Public variables (Client & Studio)
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id_here"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-01-01"

# Server-only read token (Never prefix with NEXT_PUBLIC_)
SANITY_API_READ_TOKEN="sk..."

# Server/Script-only write token (Never expose on client)
SANITY_API_WRITE_TOKEN="sk..."
```

---

### Step 3: Sanity CLI Configuration (`sanity.cli.ts`)

Create `sanity.cli.ts` in the project root:

```typescript
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
});
```

---

### Step 4: Next.js Studio Route (`app/studio/[[...tool]]/page.tsx`)

To embed Sanity Studio into the Next.js app without needing a separate hosted studio:

```typescript
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

> [!CAUTION]
> **Client Boundary Rule:**  
> The studio page **must** have `'use client'` at the very top. In React 19 / Next.js 15+, rendering context-dependent studio components inside a Server Component module graph will trigger `TypeError: createContext is not a function`.

---

### Step 5: Sanity Client & Helpers (`sanity/lib/`)

#### 1. Sanity Client (`sanity/lib/client.ts`)
```typescript
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token: process.env.SANITY_API_READ_TOKEN,
});
```

#### 2. Image URL Builder (`sanity/lib/image.ts`)
```typescript
import createImageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  if (!source) {
    return {
      url: () => '',
      width: () => ({ url: () => '', height: () => ({ url: () => '' }) }),
      height: () => ({ url: () => '' }),
      format: () => ({ url: () => '' }),
    };
  }
  return builder.image(source).auto('format').fit('max');
}
```

---

## 4. Design Engineering Schema Standards

Schema definitions should be split into **Objects**, **Collections**, **Pages (Singletons)**, and **Settings**.

### 1. Common Reusable Objects (`sanity/schemaTypes/objects/`)

#### `ctaButton.ts` (Call to Action)
```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'ctaButton',
  title: 'CTA Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Target Link / URL',
      type: 'string',
      description: 'Internal route (e.g., /contact) or external URL (https://...)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Visual Variant',
      type: 'string',
      options: {
        list: [
          { title: 'Primary Filled', value: 'primary' },
          { title: 'Secondary Outline', value: 'secondary' },
          { title: 'Ghost / Subtle', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: { title: 'label', subtitle: 'href' },
  },
});
```

#### `galleryItem.ts` (Image with Metadata & Hotspot)
```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'galleryItem',
  title: 'Gallery Image',
  type: 'object',
  fields: [
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title / Alt Text',
      type: 'string',
      description: 'Important for accessibility and lightbox captions.',
    }),
    defineField({
      name: 'caption',
      title: 'Detailed Caption',
      type: 'text',
      rows: 2,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      media: 'image',
    },
    prepare({ title, media }) {
      return {
        title: title || 'Untitled Photo',
        media,
      };
    },
  },
});
```

#### `sectionBlock.ts` (Dynamic Content Section)
```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sectionBlock',
  title: 'Content Section Block',
  type: 'object',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Eyebrow / Tagline',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body Text',
      type: 'array',
      of: [{ type: 'block' }, { type: 'galleryItem' }],
    }),
    defineField({
      name: 'cta',
      title: 'Call to Action',
      type: 'ctaButton',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'tagline' },
  },
});
```

---

### 2. Singleton Page Schema Pattern (`sanity/schemaTypes/pages/homePage.ts`)

Singletons represent unique pages (Home, About, Contact). They should feature grouped tabs (e.g. Hero, Content, SEO) for optimal editor ergonomics:

```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Section' },
    { name: 'sections', title: 'Page Sections' },
    { name: 'seo', title: 'SEO & Social' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      group: 'hero',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 3,
      group: 'hero',
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero Slideshow Images',
      type: 'array',
      of: [{ type: 'galleryItem' }],
      group: 'hero',
    }),
    defineField({
      name: 'featuredSections',
      title: 'Page Content Blocks',
      type: 'array',
      of: [{ type: 'sectionBlock' }],
      group: 'sections',
    }),
    defineField({
      name: 'seo',
      title: 'SEO Settings',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Home Page Settings',
        subtitle: 'Live root page content (/)'
      };
    },
  },
});
```

---

### 3. Collection Schema Pattern (`sanity/schemaTypes/collections/project.ts`)

Collections represent repeatable entities (Projects, Articles, Team Members, Products):

```typescript
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Projects (Case Studies)',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'client',
      title: 'Client Name',
      type: 'string',
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Project Showcase Gallery',
      type: 'array',
      of: [{ type: 'galleryItem' }],
    }),
    defineField({
      name: 'summary',
      title: 'Overview Summary',
      type: 'text',
      rows: 4,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'client',
      media: 'coverImage',
    },
  },
});
```

---

## 5. Custom Desk Structure & Studio Customization (`sanity.config.ts`)

Design engineers should brand the studio to match the project's identity and structure the sidebar logically:
- Prevent duplicate/delete actions on singletons.
- Hide singletons from the global "+" (New Document) button.
- Group singletons into "Pages" and "Site Settings".

```typescript
import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// Brand Theme matching design system tokens
const brandTheme = buildLegacyTheme({
  '--black': '#0F172A',
  '--white': '#FFFFFF',
  '--brand-primary': '#2563EB', // Primary Brand Accent
  '--main-navigation-color': '#0F172A',
  '--main-navigation-color--inverted': '#FFFFFF',
  '--focus-color': '#F59E0B',
});

// Singletons that must never have more than 1 document instance
const SINGLETONS = [
  'homePage',
  'aboutPage',
  'contactPage',
  'navigation',
  'globalSettings',
];

const PAGE_SINGLETONS = [
  { id: 'homePage', title: 'Home Page' },
  { id: 'aboutPage', title: 'About Us' },
  { id: 'contactPage', title: 'Contact Us' },
];

export default defineConfig({
  name: 'default',
  title: 'Project Content Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  theme: brandTheme,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // 1. Pages Group (Singletons)
            S.listItem()
              .title('Pages')
              .child(
                S.list()
                  .title('Pages')
                  .items(
                    PAGE_SINGLETONS.map((page) =>
                      S.listItem()
                        .title(page.title)
                        .id(page.id)
                        .child(S.document().schemaType(page.id).documentId(page.id))
                    )
                  )
              ),

            S.divider(),

            // 2. Dynamic Collections (Repeatable Documents)
            S.documentTypeListItem('project').title('Projects & Case Studies'),

            S.divider(),

            // 3. Global Site Settings
            S.listItem()
              .title('Site Settings')
              .child(
                S.list()
                  .title('Site Settings')
                  .items([
                    S.listItem()
                      .title('Navigation Menus')
                      .id('navigation')
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                    S.listItem()
                      .title('Global Brand Settings')
                      .id('globalSettings')
                      .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

  // Prevent creating new instances of singletons via the (+) button
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },

  // Prevent deleting or duplicating singletons
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action && !['duplicate', 'delete'].includes(action))
        : input,
  },
});
```

---

## 6. Query Layer & GROQ Standards (`sanity/lib/queries.ts`)

Never fetch raw unprojected blobs (`*[_type == "x"][0]`). Unprojected image references return unresolvable asset IDs rather than clean CDN URLs. Use reusable projection fragments:

```typescript
import { client } from './client';

// =========================================
// REUSABLE GROQ PROJECTION FRAGMENTS
// =========================================

export const IMAGE_FIELDS = `{
  "src": asset->url,
  "alt": title,
  caption
}`;

export const GALLERY_FIELDS = `[]{
  "src": image.asset->url,
  "title": title,
  "caption": caption
}`;

export const CTA_FIELDS = `{
  label,
  href,
  style
}`;

export const SEO_FIELDS = `{
  metaTitle,
  metaDescription,
  "ogImage": ogImage.asset->url
}`;

// =========================================
// QUERIES
// =========================================

export async function getHomePage() {
  const query = `*[_type == "homePage"][0] {
    heroHeadline,
    heroSubheadline,
    "heroSlides": heroSlides${GALLERY_FIELDS},
    featuredSections[]{
      tagline,
      heading,
      body,
      cta${CTA_FIELDS}
    },
    seo${SEO_FIELDS}
  }`;

  try {
    return await client.fetch(query, {}, { next: { tags: ['homePage'] } });
  } catch (error) {
    console.error('Failed to fetch home page from Sanity:', error);
    return null;
  }
}

export async function getAllProjects() {
  const query = `*[_type == "project" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    client,
    "coverImage": coverImage.asset->url,
    summary
  }`;

  try {
    return await client.fetch(query, {}, { next: { tags: ['project'] } });
  } catch (error) {
    console.error('Failed to fetch projects:', error);
    return [];
  }
}
```

---

## 7. Frontend Wiring & Defensive Fallback Pattern

When hooking up Next.js Server Components, combine Sanity data with design fallbacks:

```tsx
// app/page.tsx (Server Component)
import { getHomePage } from '@/sanity/lib/queries';
import { HeroSection } from '@/features/home/components/hero-section';

export default async function Page() {
  const sanityData = await getHomePage();

  return (
    <main>
      <HeroSection sanityData={sanityData} />
    </main>
  );
}
```

```tsx
// features/home/components/hero-section.tsx
import Image from 'next/image';

const DEFAULT_HERO = {
  headline: 'Crafting Exceptional Digital Experiences',
  subheadline: 'We build high-performance, design-driven web applications.',
  slides: [
    { src: '/images/hero-1.jpg', title: 'Studio Showcase' },
  ],
};

interface HeroSectionProps {
  sanityData?: {
    heroHeadline?: string;
    heroSubheadline?: string;
    heroSlides?: Array<{ src: string; title: string }>;
  } | null;
}

export function HeroSection({ sanityData }: HeroSectionProps) {
  // Merge Sanity data with hardcoded design defaults
  const headline = sanityData?.heroHeadline || DEFAULT_HERO.headline;
  const subheadline = sanityData?.heroSubheadline || DEFAULT_HERO.subheadline;
  const slides = sanityData?.heroSlides?.length ? sanityData.heroSlides : DEFAULT_HERO.slides;

  return (
    <section className="relative min-h-[80vh] flex flex-col justify-center px-6">
      <h1 className="text-5xl font-bold tracking-tight text-slate-900">{headline}</h1>
      <p className="mt-4 text-xl text-slate-600 max-w-2xl">{subheadline}</p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {slides.map((slide, index) => (
          <div key={index} className="relative h-64 rounded-xl overflow-hidden shadow-sm">
            <Image
              src={slide.src}
              alt={slide.title || 'Slide'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
```

---

## 8. Automated Safe Seeding Blueprint (`scripts/seed-sanity.mjs`)

When transitioning from Figma-coded prototypes to a live CMS, write a seeding script so editors don't have to re-type content.

### Safe Seeding Principles:
1. **Never overwrite human edits:** Use `createIfNotExists` for the shell, and `setIfMissing` for individual fields.
2. **Stable Document IDs:** Use predictable IDs for singletons (`homePage`, `aboutPage`).
3. **Asset Upload Cache:** Cache image asset IDs locally to avoid redundant uploads across script runs.

```javascript
// scripts/seed-sanity.mjs
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2025-01-01',
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

async function uploadLocalImage(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(filePath),
  });
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
  };
}

async function seedHomePage() {
  console.log('Seeding Home Page...');
  
  // 1. Create document shell if it does not exist
  await client.createIfNotExists({
    _id: 'homePage',
    _type: 'homePage',
  });

  // 2. Safe patch using setIfMissing
  await client
    .patch('homePage')
    .setIfMissing({
      heroHeadline: 'Crafting Exceptional Digital Experiences',
      heroSubheadline: 'We build high-performance, design-driven web applications.',
    })
    .commit();

  console.log('✅ Home page seeded safely.');
}

seedHomePage().catch(console.error);
```

---

## 9. Common Pitfalls & Troubleshooting Matrix

| Issue | Root Cause | Solution |
|---|---|---|
| `TypeError: e.createContext is not a function` | A component or icon library (e.g. `@phosphor-icons/react`, `next-sanity/studio`) was imported in a Server Component without `'use client'`. | Add `'use client'` at the top of the file or extract client-only icons into a client wrapper. |
| `CORS error fetching https://...api.sanity.io` | Localhost port or production domain is not whitelisted. | Go to `sanity.io/manage` → **API** → **CORS Origins** → Add `http://localhost:<port>` with Credentials enabled. |
| Studio shows empty white screen at `/studio` | Missing styled-components SSR or incorrect `basePath`. | Verify `basePath: '/studio'` in `sanity.config.ts` matches route `app/studio/[[...tool]]/page.tsx`. |
| Singletons can be duplicated or deleted | Default document actions are enabled. | Add custom `document.actions` filter in `sanity.config.ts` to block `duplicate` and `delete` on `SINGLETONS`. |
| GROQ query returns `null` for images | Missing `.asset->url` dereferencing in projection. | Project images explicitly: `"cover": coverImage.asset->url`. |
| Studio (+) menu creates redundant singletons | Default schema templates include all types. | Add `schema.templates` filter in `sanity.config.ts` to remove singletons from template list. |

---

## 10. AI Agent Kickoff Prompt (For Your Coding Assistant)

Copy and paste the following prompt when handing off a CMS setup task to an AI agent (Antigravity, Cursor, or Claude Code):

```markdown
You are acting as the Lead CMS Design Engineer for this project.
Your task is to set up a production-ready Sanity Studio v3 inside this Next.js project by adhering strictly to the team's guide at `docs/sanity-studio-setup-agent-guide.md`.

Please execute the following tasks:
1. Verify dependencies (`sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `@portabletext/react`, `styled-components`).
2. Verify environment variable bindings in `.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`).
3. Confirm or generate `sanity.cli.ts` and `app/studio/[[...tool]]/page.tsx` (ensure 'use client' is set).
4. Review the project's pages and designs to identify:
   - Singleton pages (Home, About, Contact, Settings)
   - Dynamic collections (Projects, News, Products)
   - Reusable UI objects (Galleries, CTAs, Section blocks, Stats, SEO)
5. Implement the schemas cleanly under `sanity/schemaTypes/` with user-friendly titles, validation rules, and preview cards.
6. Configure `sanity.config.ts` with:
   - Custom brand theme palette
   - Sidebar structure grouping Pages vs Collections vs Site Settings
   - Singleton protection (block delete/duplicate actions and filter from "+" templates)
7. Create `sanity/lib/queries.ts` with reusable GROQ projection fragments and safe try/catch fallbacks.
8. Verify everything compiles cleanly with `npx tsc --noEmit`.
```
