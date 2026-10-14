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
npm install sanity next-sanity @sanity/image-url @sanity/vision @portabletext/react styled-components lucide-react
```

> [!IMPORTANT]
> **React 19 & Next.js 15/16 Compatibility:**  
> `styled-components` (used by `@sanity/ui`) requires React 19 support. Ensure dependencies resolve cleanly. If npm flags peer dependency conflicts during initial installation, use:
> ```bash
> npm install --legacy-peer-deps
> ```
> 
> **Why `lucide-react` is Mandatory:**  
> Clean, professional SVG icons are used across all studio desk structure lists, collections, widgets, and custom live preview actions. Never use generic emojis in schemas or Studio UIs.

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

#### `blockContent.ts` (Rich Text with Automatic Link Colors & Custom Color Picker)
Rich text must support bold/italic, lists, inline media, and links. 
**Design Engineering Standard**: Links should automatically render in the primary brand color by default, while giving editors an optional radio picker for accent colors (e.g., Orange, Navy, Inherit), clean support for internal relative paths (`/capabilities`, `/contact`), and in-studio visual preview.

```typescript
import { defineType, defineArrayMember } from 'sanity';
import { Link2 } from 'lucide-react';
import React from 'react';

// Live in-editor visual preview of the link color
const LinkAnnotationPreview = ({ children, value }: any) => {
  const color = value?.color;
  const colorMap: Record<string, string> = {
    orange: '#f4691a',
    navy: '#001723',
    blue: '#1470AD',
    inherit: 'inherit',
  };
  const activeColor = colorMap[color] || '#1470AD';

  return React.createElement(
    'span',
    {
      style: {
        color: activeColor,
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        fontWeight: 500,
      },
    },
    children
  );
};

export default defineType({
  name: 'blockContent',
  title: 'Rich Text Content',
  type: 'array',
  of: [
    defineArrayMember({
      title: 'Block',
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'H2', value: 'h2' },
        { title: 'H3', value: 'h3' },
        { title: 'H4', value: 'h4' },
        { title: 'Quote', value: 'blockquote' },
      ],
      lists: [
        { title: 'Bullet', value: 'bullet' },
        { title: 'Number', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Strong', value: 'strong' },
          { title: 'Emphasis', value: 'em' },
          { title: 'Code', value: 'code' },
        ],
        annotations: [
          {
            title: 'URL Link',
            name: 'link',
            type: 'object',
            icon: Link2,
            components: {
              annotation: LinkAnnotationPreview,
            },
            fields: [
              {
                title: 'URL / Path',
                name: 'href',
                type: 'string',
                description: 'Enter a full URL (https://...) or an internal path (e.g. /capabilities, /contact).',
                validation: (Rule: any) =>
                  Rule.required().custom((href: string) => {
                    if (!href) return 'A URL or path is required';
                    if (
                      href.startsWith('/') ||
                      href.startsWith('#') ||
                      href.startsWith('mailto:') ||
                      href.startsWith('tel:') ||
                      href.startsWith('http://') ||
                      href.startsWith('https://')
                    ) {
                      return true;
                    }
                    return 'Please enter a valid URL (starting with https://, http://, or / for internal links)';
                  }),
              },
              {
                title: 'Link Color',
                name: 'color',
                type: 'string',
                description: 'Defaults to Brand Primary Blue automatically. Choose an accent color if needed.',
                initialValue: 'blue',
                options: {
                  list: [
                    { title: 'Brand Action Blue (Default)', value: 'blue' },
                    { title: 'Accent Orange', value: 'orange' },
                    { title: 'Deep Navy / Ink', value: 'navy' },
                    { title: 'Inherit Body Color (Underline only)', value: 'inherit' },
                  ],
                  layout: 'radio',
                },
              },
              {
                title: 'Open in New Window / Tab',
                name: 'openInNewTab',
                type: 'boolean',
                initialValue: false,
                description: 'Recommended for external links outside the domain.',
              },
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: 'image',
      title: 'Inline Image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', type: 'string', title: 'Alternative Text' },
        { name: 'caption', type: 'string', title: 'Caption' },
      ],
    }),
  ],
});
```

#### `sectionBlock.ts` (Dynamic Modular Section Widgets)
Instead of forcing editors into a monolithic form where every section has fixed body, bullet, stat, and quote fields, use the **Modular Section Widget System**. 
The **Section Heading & Tagline** serve as the section anchor, followed by a dynamic, drag-and-drop array of selectable widgets:

```typescript
import { defineField, defineType, defineArrayMember } from 'sanity';
import {
  FileText,
  Video,
  List,
  BarChart3,
  Quote,
  Images,
  MousePointerClick,
  Layers,
} from 'lucide-react';

export default defineType({
  name: 'sectionBlock',
  title: 'Content Section Block',
  type: 'object',
  icon: Layers,
  description: 'A content section with an anchor heading and custom drag-and-drop content widgets.',
  fieldsets: [
    {
      name: 'legacy',
      title: 'Legacy Fields (Previous Monolithic Format)',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Section Tagline / Eyebrow',
      type: 'string',
      description: 'Small uppercase category or topic label above the heading, e.g. "ENGINEERING METHODOLOGY".',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingColor',
      title: 'Heading Style Accent',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Navy', value: 'navy' },
          { title: 'Accent Blue', value: 'blue' },
          { title: 'Accent Orange', value: 'orange' },
        ],
      },
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Widgets',
      type: 'array',
      description: 'Click "Add item" to insert only the widgets needed. Drag to reorder widgets freely.',
      of: [
        // 1. Rich Text Paragraph
        defineArrayMember({
          name: 'richTextWidget',
          title: 'Paragraph / Rich Text',
          type: 'object',
          icon: FileText,
          fields: [
            defineField({
              name: 'content',
              title: 'Text Content',
              type: 'blockContent',
            }),
          ],
          preview: {
            select: { content: 'content' },
            prepare({ content }) {
              const firstBlock = Array.isArray(content)
                ? content.find((b: any) => b._type === 'block')
                : null;
              const text = firstBlock?.children?.map((c: any) => c.text).join('') || 'Empty paragraph';
              return {
                title: text.length > 55 ? `${text.slice(0, 55)}...` : text,
                subtitle: 'Paragraph / Rich Text',
                media: FileText,
              };
            },
          },
        }),

        // 2. Responsive Media Embed (YouTube, Vimeo, MP4, Social)
        defineArrayMember({
          name: 'mediaEmbedWidget',
          title: 'Media Embed (YouTube / Vimeo / Social)',
          type: 'object',
          icon: Video,
          fields: [
            defineField({
              name: 'url',
              title: 'Media URL',
              type: 'url',
              description: 'YouTube (standard or Shorts), Vimeo, direct MP4, or social media link.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption / Label',
              type: 'string',
            }),
            defineField({
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'string',
              initialValue: '16:9',
              options: {
                list: [
                  { title: '16:9 (Standard Video / YouTube)', value: '16:9' },
                  { title: '4:3 (Classic Video)', value: '4:3' },
                  { title: '1:1 (Square / Social)', value: '1:1' },
                  { title: '9:16 (Vertical / Shorts / Reels)', value: '9:16' },
                ],
              },
            }),
          ],
          preview: {
            select: { url: 'url', caption: 'caption' },
            prepare({ url, caption }) {
              return {
                title: caption || url || 'Media Embed',
                subtitle: url ? `Embed • ${url}` : 'Media Embed',
                media: Video,
              };
            },
          },
        }),

        // 3. Bullet Points List
        defineArrayMember({
          name: 'bulletsWidget',
          title: 'Bullet Points List',
          type: 'object',
          icon: List,
          fields: [
            defineField({
              name: 'items',
              title: 'Bullet Points',
              type: 'array',
              of: [{ type: 'string' }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { items: 'items' },
            prepare({ items }) {
              const count = items?.length || 0;
              const first = items?.[0] || 'Empty list';
              return {
                title: `${count} Bullet Point${count === 1 ? '' : 's'}`,
                subtitle: first.length > 50 ? `${first.slice(0, 50)}...` : first,
                media: List,
              };
            },
          },
        }),

        // 4. Highlight Stat Metric
        defineArrayMember({
          name: 'statWidget',
          title: 'Highlight Stat Metric',
          type: 'object',
          icon: BarChart3,
          fields: [
            defineField({
              name: 'value',
              title: 'Metric Value (e.g. 1,200t, 48", 99.8%)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Metric Label / Description',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { value: 'value', label: 'label' },
            prepare({ value, label }) {
              return {
                title: value ? `${value} — ${label || ''}` : 'Highlight Stat',
                subtitle: 'Metric Callout',
                media: BarChart3,
              };
            },
          },
        }),

        // 5. Quote / Engineering Takeaway
        defineArrayMember({
          name: 'quoteWidget',
          title: 'Quote / Key Takeaway',
          type: 'object',
          icon: Quote,
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote or Key Takeaway Text',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({ name: 'author', title: 'Quoted Person / Source', type: 'string' }),
            defineField({ name: 'role', title: 'Role / Designation', type: 'string' }),
          ],
          preview: {
            select: { quote: 'quote', author: 'author' },
            prepare({ quote, author }) {
              return {
                title: quote ? `"${quote.slice(0, 45)}..."` : 'Quote Callout',
                subtitle: author ? `Quote • ${author}` : 'Quote Callout',
                media: Quote,
              };
            },
          },
        }),

        // 6. Photo Gallery Grid
        defineArrayMember({
          name: 'galleryWidget',
          title: 'Photo Gallery Grid',
          type: 'object',
          icon: Images,
          fields: [
            defineField({
              name: 'gallery',
              title: 'Section Photos',
              type: 'gallery',
            }),
          ],
          preview: {
            select: { gallery: 'gallery' },
            prepare({ gallery }) {
              const count = gallery?.items?.length || 0;
              return {
                title: `${count} Photo${count === 1 ? '' : 's'} Gallery`,
                subtitle: 'Photo Gallery Grid',
                media: Images,
              };
            },
          },
        }),

        // 7. Action Button / Link
        defineArrayMember({
          name: 'buttonWidget',
          title: 'Action Button / Link',
          type: 'object',
          icon: MousePointerClick,
          fields: [
            defineField({ name: 'text', title: 'Button Label', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'url', title: 'Link URL', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({
              name: 'variant',
              title: 'Button Style',
              type: 'string',
              initialValue: 'primary',
              options: {
                list: [
                  { title: 'Primary Brand Blue', value: 'primary' },
                  { title: 'Accent Orange', value: 'orange' },
                  { title: 'Outline Navy', value: 'outline' },
                ],
              },
            }),
          ],
          preview: {
            select: { text: 'text', url: 'url' },
            prepare({ text, url }) {
              return {
                title: text || 'Action Button',
                subtitle: url ? `Button • ${url}` : 'Action Button',
                media: MousePointerClick,
              };
            },
          },
        }),
      ],
    }),

    // Legacy fields preserved under a collapsible fieldset for 100% backward compatibility
    defineField({ name: 'body', title: 'Body Paragraphs (Legacy)', type: 'blockContent', fieldset: 'legacy' }),
    defineField({ name: 'bullets', title: 'Bullet Points (Legacy)', type: 'array', of: [{ type: 'string' }], fieldset: 'legacy' }),
    defineField({
      name: 'highlightStat',
      title: 'Highlight Stat (Legacy)',
      type: 'object',
      fieldset: 'legacy',
      fields: [
        defineField({ name: 'value', title: 'Metric Value', type: 'string' }),
        defineField({ name: 'label', title: 'Metric Label', type: 'string' }),
      ],
    }),
    defineField({ name: 'buttonText', title: 'Button Label (Legacy)', type: 'string', fieldset: 'legacy' }),
    defineField({ name: 'buttonLink', title: 'Button Link (Legacy)', type: 'string', fieldset: 'legacy' }),
    defineField({ name: 'gallery', title: 'Photo Gallery (Legacy)', type: 'gallery', fieldset: 'legacy' }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'tagline' },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Content Section',
        subtitle: subtitle ? `Section • ${subtitle}` : 'Content Block',
        media: Layers,
      };
    },
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

## 5. Custom Desk Structure, Lucide Icons & Live Preview (`sanity.config.ts`)

Design engineers should brand the studio to match the project's identity, eliminate all generic emojis in favor of crisp **Lucide React** SVG icons, and equip editors with **Live Preview** and single-click draft previews:

1. **Brand Theme**: Match design system color tokens (`--brand-primary`, `--focus-color`).
2. **Lucide Icons**: Attach Lucide icons to all list items, singletons, collections, and action buttons.
3. **Singleton Protection**: Prevent duplicate/delete actions on singletons and hide them from the global (+) button.
4. **Live Document Preview Pane**: Provide a side-by-side iframe preview with Desktop, Tablet, and Mobile viewport switchers.
5. **Draft Mode Document Action**: Add a "Preview Article" action button directly in the document footer.

```typescript
import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
  Layers,
  FolderKanban,
  Newspaper,
  Package,
  Wrench,
  Settings,
  Compass,
  Sliders,
  Home,
  Building2,
  Cpu,
  Mail,
  Eye,
} from 'lucide-react';
import { schemaTypes } from './sanity/schemaTypes';
import { ArticlePreviewPane } from './sanity/components/article-preview-pane';
import { PreviewArticleAction } from './sanity/actions/preview-article-action';

// Brand Theme matching design system tokens
const brandTheme = buildLegacyTheme({
  '--black': '#001723',
  '--white': '#FFFFFF',
  '--brand-primary': '#1470AD', // Primary Brand Accent
  '--main-navigation-color': '#001723',
  '--main-navigation-color--inverted': '#FFFFFF',
  '--focus-color': '#f4691a',
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
  { id: 'homePage', title: 'Home Page', icon: Home },
  { id: 'aboutPage', title: 'About Us', icon: Building2 },
  { id: 'contactPage', title: 'Contact Us', icon: Mail },
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
            // 1. Pages Group (Singletons with Lucide Icons)
            S.listItem()
              .title('Pages')
              .icon(Layers)
              .child(
                S.list()
                  .title('Pages')
                  .items(
                    PAGE_SINGLETONS.map((page) =>
                      S.listItem()
                        .title(page.title)
                        .id(page.id)
                        .icon(page.icon)
                        .child(S.document().schemaType(page.id).documentId(page.id))
                    )
                  )
              ),

            S.divider(),

            // 2. Dynamic Collections (Repeatable Documents with Lucide Icons)
            S.documentTypeListItem('project').title('Projects & Case Studies').icon(FolderKanban),
            S.documentTypeListItem('newsArticle').title('News & Insights').icon(Newspaper),

            S.divider(),

            // 3. Global Site Settings
            S.listItem()
              .title('Site Settings')
              .icon(Settings)
              .child(
                S.list()
                  .title('Site Settings')
                  .items([
                    S.listItem()
                      .title('Navigation Menus')
                      .id('navigation')
                      .icon(Compass)
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                    S.listItem()
                      .title('Global Brand Settings')
                      .id('globalSettings')
                      .icon(Sliders)
                      .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
                  ])
              ),
          ]),

      // 4. Split-Pane Live Preview View
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType === 'newsArticle' || schemaType === 'project') {
          return S.document().views([
            S.view.form(),
            S.view.component(ArticlePreviewPane).title('Live Preview').icon(Eye),
          ]);
        }
        return S.document().views([S.view.form()]);
      },
    }),
    visionTool(),
  ],

  // Prevent creating new instances of singletons via the (+) button
  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },

  // Document actions: singleton protection + one-click live preview action
  document: {
    actions: (input, context) => {
      let actions = SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action && !['duplicate', 'delete'].includes(action))
        : input;

      if (context.schemaType === 'newsArticle' || context.schemaType === 'project') {
        actions = [...actions, PreviewArticleAction];
      }

      return actions;
    },
  },
});
```

### 1. Document Action: One-Click Live Preview (`sanity/actions/preview-article-action.ts`)

Adds an action button to the editor footer allowing editors to launch the live draft with one click:

```typescript
import type { DocumentActionComponent } from 'sanity';
import { Eye } from 'lucide-react';

export const PreviewArticleAction: DocumentActionComponent = (props) => {
  const { draft, published } = props;
  const doc = draft || published;
  const slug = (doc as any)?.slug?.current as string | undefined;

  return {
    label: 'Preview Article',
    icon: Eye,
    title: slug
      ? 'Open live preview in draft mode in a new tab'
      : 'Please generate or enter a URL slug first to preview',
    disabled: !slug,
    onHandle: () => {
      if (slug) {
        window.open(`/api/draft-mode/enable?slug=${encodeURIComponent(slug)}`, '_blank');
      }
    },
  };
};
```

### 2. Live Preview Split-Pane Component (`sanity/components/article-preview-pane.tsx`)

Renders a live iframe with viewport controls directly inside Sanity Studio:

```tsx
'use client';

import React, { useState } from 'react';
import {
  Eye,
  Monitor,
  Tablet,
  Smartphone,
  RotateCw,
  Radio,
  ExternalLink,
} from 'lucide-react';

type DeviceMode = 'desktop' | 'tablet' | 'mobile';

export function ArticlePreviewPane({ document }: { document?: { displayed?: any; draft?: any; published?: any } }) {
  const [device, setDevice] = useState<DeviceMode>('desktop');
  const [key, setKey] = useState<number>(0);

  const doc = document?.displayed || document?.draft || document?.published;
  const slug = doc?.slug?.current as string | undefined;

  if (!slug) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px', textAlign: 'center', backgroundColor: '#0a1017', color: '#fff' }}>
        <Eye size={32} color="#38bdf8" />
        <h2 style={{ fontSize: '18px', marginTop: '12px' }}>Slug Required for Live Preview</h2>
        <p style={{ color: '#8b949e', fontSize: '14px' }}>Please generate or enter a URL slug in the form to render live preview.</p>
      </div>
    );
  }

  const previewUrl = `/api/draft-mode/enable?slug=${encodeURIComponent(slug)}`;
  const widths: Record<DeviceMode, string> = { desktop: '100%', tablet: '768px', mobile: '375px' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#070d14' }}>
      {/* Viewport Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 16px', backgroundColor: '#0d1824', borderBottom: '1px solid #1c2b3d' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {(['desktop', 'tablet', 'mobile'] as DeviceMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setDevice(mode)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                backgroundColor: device === mode ? '#1470AD' : '#141f2d',
                color: '#fff',
                border: '1px solid #223447',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              {mode === 'desktop' && <Monitor size={14} />}
              {mode === 'tablet' && <Tablet size={14} />}
              {mode === 'mobile' && <Smartphone size={14} />}
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
          <button onClick={() => setKey((k) => k + 1)} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '6px 10px', fontSize: '12px', backgroundColor: '#141f2d', color: '#8b949e', border: '1px solid #223447', borderRadius: '6px', cursor: 'pointer' }}>
            <RotateCw size={13} /> Refresh
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#f59e0b', backgroundColor: 'rgba(245, 158, 11, 0.15)', padding: '4px 8px', borderRadius: '4px' }}>
            <Radio size={12} color="#f59e0b" /> Draft Mode Active
          </span>
          <a href={previewUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', color: '#38bdf8', textDecoration: 'none' }}>
            Open Window <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {/* Frame Container */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', padding: device === 'desktop' ? 0 : '24px', backgroundColor: '#050a10', overflow: 'auto' }}>
        <iframe
          key={key}
          src={previewUrl}
          style={{ width: widths[device], height: '100%', border: 'none', borderRadius: device === 'desktop' ? 0 : '12px', boxShadow: device === 'desktop' ? 'none' : '0 20px 40px rgba(0,0,0,0.5)' }}
        />
      </div>
    </div>
  );
}
```

### 3. Draft Mode API Routes

In `app/api/draft-mode/enable/route.ts`:
```typescript
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  const draft = await draftMode();
  draft.enable();

  redirect(slug ? `/news-insights/${slug}` : '/');
}
```

In `app/api/draft-mode/disable/route.ts`:
```typescript
import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect('/');
}
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

export const SECTION_BLOCK_FIELDS = `{
  _key,
  tagline,
  heading,
  headingColor,
  contentBlocks[]{
    _key,
    _type,
    // richTextWidget
    content,
    // mediaEmbedWidget
    url,
    caption,
    aspectRatio,
    // bulletsWidget
    items,
    // statWidget
    value,
    label,
    // quoteWidget
    quote,
    author,
    role,
    // buttonWidget
    text,
    variant,
    // galleryWidget
    gallery{
      categoryTitle,
      items[]{
        _key,
        title,
        description,
        "url": image.asset->url
      }
    }
  },
  // Legacy monolithic fields for backward compatibility
  body,
  bullets,
  highlightStat,
  buttonText,
  buttonLink,
  gallery{
    categoryTitle,
    items[]{
      _key,
      title,
      description,
      "url": image.asset->url
    }
  }
}`;

// =========================================
// QUERIES
// =========================================

export async function getHomePage() {
  const query = `*[_type == "homePage"][0] {
    heroHeadline,
    heroSubheadline,
    "heroSlides": heroSlides${GALLERY_FIELDS},
    featuredSections[]${SECTION_BLOCK_FIELDS},
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
    summary,
    contentSections[]${SECTION_BLOCK_FIELDS}
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

## 7. Frontend Wiring & Defensive Fallback Patterns

### 1. PortableText Link Component (`shared/components/ui/portable-text-link.tsx`)

Render rich text links with automatic brand primary colors, optional editor color overrides (`blue`, `orange`, `navy`, `inherit`), and Next.js `<Link>` client-side routing:

```tsx
'use client';

import React from 'react';
import Link from 'next/link';

export interface PortableTextLinkProps {
  value?: {
    href?: string;
    color?: 'blue' | 'orange' | 'navy' | 'inherit' | string;
    openInNewTab?: boolean;
  };
  children?: React.ReactNode;
}

const COLOR_CLASSES: Record<string, string> = {
  blue: 'text-[var(--color-primary)] hover:text-[var(--color-accent)] decoration-[var(--color-primary)]/40 hover:decoration-[var(--color-accent)]',
  orange: 'text-[var(--color-accent)] hover:text-[var(--color-primary)] decoration-[var(--color-accent)]/40 hover:decoration-[var(--color-primary)]',
  navy: 'text-[var(--color-ink)] hover:text-[var(--color-primary)] decoration-[var(--color-ink)]/40 hover:decoration-[var(--color-primary)]',
  inherit: 'text-inherit hover:text-[var(--color-primary)] decoration-current/40 hover:decoration-current',
};

export const PortableTextLink: React.FC<PortableTextLinkProps> = ({ value, children }) => {
  const href = value?.href;
  if (!href) return <span>{children}</span>;

  const colorKey = value?.color || 'blue';
  const colorClass = COLOR_CLASSES[colorKey] || COLOR_CLASSES.blue;
  const linkClassName = `inline font-medium underline underline-offset-4 decoration-1 hover:decoration-2 transition-colors duration-200 cursor-pointer ${colorClass}`;

  const isExternal =
    value?.openInNewTab ||
    href.startsWith('http://') ||
    href.startsWith('https://');

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={linkClassName}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  );
};
```

### 2. Responsive Media Embed Component (`features/media/components/media-embed.tsx`)

A single, robust component that handles YouTube (standard URLs, Shorts, embed links, youtu.be), Vimeo, direct MP4/WebM videos, and external embeds with responsive aspect ratio boxes:

```tsx
'use client';

import React from 'react';

interface MediaEmbedProps {
  url?: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16' | string;
  className?: string;
}

const ASPECT_RATIO_CLASSES: Record<string, string> = {
  '16:9': 'aspect-video',
  '4:3': 'aspect-[4/3]',
  '1:1': 'aspect-square',
  '9:16': 'aspect-[9/16] max-w-sm mx-auto',
};

function getYouTubeEmbedUrl(rawUrl: string): string | null {
  try {
    const parsed = new URL(rawUrl);
    if (parsed.hostname.includes('youtu.be')) {
      const id = parsed.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (parsed.pathname.startsWith('/shorts/')) {
      const id = parsed.pathname.split('/shorts/')[1]?.split('/')[0];
      return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
    }
    if (parsed.pathname.startsWith('/embed/')) {
      return rawUrl;
    }
    const id = parsed.searchParams.get('v');
    return id ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}

function getVimeoEmbedUrl(rawUrl: string): string | null {
  try {
    const match = rawUrl.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|)(\d+)(?:|\/\?)/);
    return match?.[2] ? `https://player.vimeo.com/video/${match[2]}` : null;
  } catch {
    return null;
  }
}

export const MediaEmbed: React.FC<MediaEmbedProps> = ({
  url,
  caption,
  aspectRatio = '16:9',
  className = '',
}) => {
  if (!url) return null;

  const aspectClass = ASPECT_RATIO_CLASSES[aspectRatio] || ASPECT_RATIO_CLASSES['16:9'];
  const ytEmbed = getYouTubeEmbedUrl(url);
  const vimeoEmbed = getVimeoEmbedUrl(url);
  const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);

  return (
    <figure className={`w-full my-6 ${className}`}>
      <div className={`w-full overflow-hidden rounded-xl bg-black/10 relative shadow-sm ${aspectClass}`}>
        {ytEmbed ? (
          <iframe
            src={ytEmbed}
            title={caption || 'Embedded Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0"
          />
        ) : vimeoEmbed ? (
          <iframe
            src={vimeoEmbed}
            title={caption || 'Vimeo Video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 absolute inset-0"
          />
        ) : isDirectVideo ? (
          <video src={url} controls className="w-full h-full object-cover" />
        ) : (
          <iframe src={url} title={caption || 'Embedded Content'} className="w-full h-full border-0 absolute inset-0" />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-xs text-center text-slate-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
```

### 3. Modular Section Rendering Loop

In your page or article template, render the dynamic `contentBlocks` widgets when present, or fall back defensively to legacy fields:

```tsx
import { PortableText } from '@portabletext/react';
import { PortableTextLink } from '@/shared/components/ui/portable-text-link';
import { MediaEmbed } from '@/features/media/components/media-embed';

const sectionBodyComponents = {
  block: {
    normal: ({ children }: any) => <p className="text-base leading-relaxed text-slate-800 my-4">{children}</p>,
  },
  marks: {
    link: PortableTextLink,
  },
};

export function SectionRenderer({ section }: { section: any }) {
  const hasWidgets = section.contentBlocks && section.contentBlocks.length > 0;

  return (
    <section className="my-12">
      {section.tagline && (
        <span className="text-xs uppercase tracking-widest font-bold text-blue-600 block mb-2">
          {section.tagline}
        </span>
      )}
      <h2 className="text-3xl font-bold text-slate-900 mb-6">{section.heading}</h2>

      {hasWidgets ? (
        // DYNAMIC WIDGETS PIPELINE
        section.contentBlocks.map((widget: any) => {
          switch (widget._type) {
            case 'richTextWidget':
              return <PortableText key={widget._key} value={widget.content} components={sectionBodyComponents} />;
            case 'mediaEmbedWidget':
              return <MediaEmbed key={widget._key} url={widget.url} caption={widget.caption} aspectRatio={widget.aspectRatio} />;
            case 'bulletsWidget':
              return (
                <ul key={widget._key} className="space-y-2 my-4 list-disc pl-5 text-slate-700">
                  {widget.items?.map((item: string, i: number) => <li key={i}>{item}</li>)}
                </ul>
              );
            case 'statWidget':
              return (
                <div key={widget._key} className="my-6 p-6 rounded-xl bg-blue-50 border border-blue-100 flex items-baseline gap-4">
                  <span className="text-4xl font-extrabold text-blue-700">{widget.value}</span>
                  <span className="text-sm font-medium text-slate-600">{widget.label}</span>
                </div>
              );
            case 'quoteWidget':
              return (
                <blockquote key={widget._key} className="my-6 pl-6 border-l-4 border-blue-500 italic text-lg text-slate-800">
                  "{widget.quote}"
                  {widget.author && <cite className="block text-sm not-italic mt-2 font-semibold text-slate-600">— {widget.author} {widget.role ? `(${widget.role})` : ''}</cite>}
                </blockquote>
              );
            case 'buttonWidget':
              return (
                <div key={widget._key} className="my-6">
                  <a href={widget.url} className="inline-block px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
                    {widget.text}
                  </a>
                </div>
              );
            default:
              return null;
          }
        })
      ) : (
        // DEFENSIVE LEGACY FALLBACK
        <>
          {section.body && <PortableText value={section.body} components={sectionBodyComponents} />}
          {section.bullets && (
            <ul className="space-y-2 my-4 list-disc pl-5 text-slate-700">
              {section.bullets.map((item: string, i: number) => <li key={i}>{item}</li>)}
            </ul>
          )}
        </>
      )}
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
1. Verify dependencies (`sanity`, `next-sanity`, `@sanity/image-url`, `@sanity/vision`, `@portabletext/react`, `styled-components`, `lucide-react`).
2. Verify environment variable bindings in `.env.local` (`NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`).
3. Confirm or generate `sanity.cli.ts` and `app/studio/[[...tool]]/page.tsx` (ensure 'use client' is set).
4. Review the project's pages and designs to identify:
   - Singleton pages (Home, About, Contact, Settings)
   - Dynamic collections (Projects, News, Products)
   - Reusable UI objects (Galleries, CTAs, Section blocks, Stats, SEO, BlockContent)
5. Implement the schemas cleanly under `sanity/schemaTypes/` with:
   - Real **Lucide React** SVG icons on every schema, widget, and list item (never use emojis).
   - The **Modular Section Widget System** in `sectionBlock.ts` (`contentBlocks[]` containing Paragraphs, Media Embeds, Bullets, Stats, Quotes, Galleries, Buttons) with collapsible legacy fieldsets.
   - The **Rich Text Link System** in `blockContent.ts` with automatic primary brand link color, custom color radio picker (`blue`, `orange`, `navy`, `inherit`), relative URL validation (`/capabilities`, `/contact`), and in-studio preview.
6. Configure `sanity.config.ts` with:
   - Custom brand theme palette (`buildLegacyTheme`)
   - Sidebar structure grouping Pages vs Collections vs Site Settings with Lucide icons
   - Singleton protection (block delete/duplicate actions and filter from "+" templates)
   - Live Preview split-pane view (`ArticlePreviewPane`) with Desktop, Tablet, and Mobile viewport modes
   - One-click document action (`PreviewArticleAction`) with draft mode integration
7. Create `sanity/lib/queries.ts` with reusable GROQ projection fragments (`SECTION_BLOCK_FIELDS`, `SEO_FIELDS`, `GALLERY_FIELDS`) and safe try/catch fallbacks.
8. Wire up the frontend components:
   - `portable-text-link.tsx` for brand link colors and Next.js `<Link>` routing
   - `media-embed.tsx` for responsive YouTube (standard + Shorts), Vimeo, and MP4 embeds
   - Section widget renderer loops with defensive fallback to legacy fields
9. Verify everything compiles cleanly with `npx tsc --noEmit` and passes production build `npm run build`.
```
