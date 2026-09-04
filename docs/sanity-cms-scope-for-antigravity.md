# PCE Nigeria Website — Sanity CMS Implementation Scope

**Audience:** Antigravity agent implementing this directly in `Projects/pce` (Next.js 16 / React 19, feature-sliced architecture).
**Goal:** Give the client a single, visually organized Sanity Studio where they can manage every page, section, case study, news/insights post, product, resource and "mini gallery" on the site — without touching code.
**Source of truth for this scope:** the current repo at `github.com/TM-Labs-Global/pce` (branch `main`), specifically the existing TypeScript data files under `features/*/data/*.ts` and `features/*/types/*.ts`. Good news: most of the site's content is already cleanly typed (`ProjectDetail`, `NewsArticleDetail`, `ProductDetail`, `CapabilityCard`/`CapabilityDetail`, `GalleryCategory`/`GalleryItem`) — the Sanity schemas below are close to a 1:1 mirror of those interfaces, so this is a migration, not a redesign of the data model.

Section 7 below gives concrete, copy-pasteable file skeletons (config, client, queries, revalidation webhook) adapted from a working Sanity + Next 16 / React 19 setup on another project, so Antigravity has real code to start from rather than only a schema description.

---

## 1. Stack & architecture

- **Sanity Studio embedded in the Next.js app** at `app/studio/[[...tool]]/page.tsx` (single deploy, one repo, simplest for the client to reach at `pce-psi.vercel.app/studio` or the eventual custom domain). Use the latest stable `sanity`, `next-sanity`, and `@sanity/vision` packages — check current versions at implementation time rather than pinning old ones.
- **Content fetching:** `next-sanity`'s client + a shared `sanity/lib/queries.ts`, using GROQ queries per page/section. Replace the hardcoded arrays currently imported from `features/*/data/*.ts` with Sanity queries, keeping the same TypeScript interfaces as the query return shape so the existing components need minimal changes.
- **Images:** all `image: "/pictures/..."` string fields become Sanity `image` fields (with `hotspot: true`). Use `@sanity/image-url`'s `urlFor()` helper + Next's `<Image>` (already used in `home-hero.tsx`). Add `cdn.sanity.io` to `next.config.ts` → `images.remotePatterns` (it currently only allows `images.unsplash.com`).
- **Rich text:** narrative paragraph arrays (`body?: string[]` in `ProjectSection`/`NewsSection`/`ProductSection`) become Sanity `blockContent` (Portable Text, rendered with `@portabletext/react`) so the client can bold/link/paragraph-break from the Studio instead of editing raw string arrays.
- **Live updates without redeploy:** use Sanity webhooks → a Next.js API route (`app/api/revalidate/route.ts`) calling `revalidateTag`/`revalidatePath`, so publishing in Studio updates the live site within seconds. Tag every GROQ fetch appropriately (e.g. `{next: {tags: ['project', `project-${slug}`]}}`).
- **Env vars needed:** `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` (`production`), `NEXT_PUBLIC_SANITY_API_VERSION`, `SANITY_API_READ_TOKEN` (server-side reads of drafts/private data if needed), `SANITY_REVALIDATION_SECRET` (webhook auth).
- **Access:** create the Sanity project, add the client's team as `Editor` role (not `Administrator`) so they can edit content but not the schema; keep an `Administrator`/`Developer` seat for whoever maintains the schema.
- **Install** (React 19 peer-dep note): `npm install sanity next-sanity @sanity/vision @sanity/ui @sanity/image-url @portabletext/react --legacy-peer-deps` — the `--legacy-peer-deps` flag matters here since this repo is already on React 19.2.3 and some Sanity ecosystem packages haven't finished bumping their peer-dep ranges.

---

## 2. Studio UX requirements (this is the "visually appealing, easy to navigate" part)

The client explicitly wants this to be pleasant to use, not just functional. Concretely:

1. **Custom desk structure** (built inline in `sanity.config.ts`, see §7.4), not Sanity's default flat document list. Group into named sections, roughly:
   - 📄 **Pages** (the singletons — Home, Our Company, Capabilities, Equipment & Technology, Safety Quality & Responsibility, Projects, Products, News & Insights, Resources, Contact)
   - 🏗️ **Case Studies** (all `project` documents)
   - 📰 **News & Insights** (all `newsArticle` documents)
   - 🧪 **Products** (all `product` documents)
   - 🔧 **Equipment** (`equipmentCategory` documents)
   - 📁 **Resources** (`resourceCategory` / `resource` documents)
   - ⚙️ **Site Settings** (Navigation, Global Settings — pinned at the bottom, visually separated so it doesn't get lost among content)
2. **Singleton pattern** for every "page" document (Home, Our Company, etc.) — use the standard Sanity singleton pattern (`S.document().id('homePage').schemaType('homePage')`, and hide `homePage` etc. from the global "create new" menu) so the client can never accidentally create a second Home page.
3. **Preview configs on every schema** (`preview: {select: {...}, prepare(selection) {...}}`) so list/reference views show a thumbnail image + real title + a useful subtitle (e.g. a `project` shows its hero image + title + location, not "Untitled"). This alone makes the Studio dramatically easier to scan. See §7.3 for a worked example on the `project` schema.
4. **Orderable arrays**: hero slides, gallery items, capability cards, equipment items, nav links — all need `options: {sortable: true}` so the client can drag-reorder instead of editing an `order` number field.
5. **Field grouping** on the larger documents (`product` especially — it has ~15 optional sub-objects: specs, SDS sections, safety-at-a-glance, supply details, etc.) — use `groups` on the schema (e.g. "Overview", "Technical Specs", "Safety Data Sheet", "Gallery") so editors aren't scrolling through 40 fields on one screen.
6. **Studio branding**: PCE's actual brand tokens live in `shared/styles/colors.css` — use them for the Studio theme rather than Sanity's defaults (accent orange `#f4691a`, primary blue `#1470AD`, navy `#001723`). See §7.4 for the theme config.
7. **Validation**: required alt text on every image, required title/slug on every content document, slug fields auto-generated from title but editable.
8. **Restrict the Vision (raw GROQ query) tool to admins only** — it's a developer tool that would just confuse a content editor. See §7.4.

---

## 3. Schema catalog

### 3.1 Reusable objects (defined once, used across many schemas)

| Object | Fields | Mirrors |
|---|---|---|
| `galleryItem` | `image` (image, hotspot), `title` (string), `description` (text, optional) | `GalleryItem` in `features/home/components/overview-lightbox-modal.tsx` |
| `gallery` | `categoryTitle` (string), `items` (array of `galleryItem`, sortable) | `GalleryCategory` — used today in the home hero slider, the home/Capabilities-page 4-card galleries, and should also back the project `bentoImages` and product `galleryImages`/`technicalImages`. **This is the "mini gallery" object the client asked to be able to edit per-section** — reuse it everywhere a section currently has a small image set, rather than inventing a different gallery shape per page. |
| `statItem` | `number` (string — kept as string since values like "1200t/500t/500t" and "" aren't numeric), `label` (string), `image` (image, optional) | the "PCE at a glance" stats in `features/home/components/overview.tsx` and `features/company/components/people-scale.tsx` |
| `sectionBlock` | `tagline` (string), `heading` (string), `headingColor` (string, optional — or replace with a `light`/`dark`/`accent` style select), `body` (array of `blockContent`), `bullets` (array of strings), `highlightStat` (object: `value`, `label`) | `ProjectSection` / `NewsSection` / `ProductSection` (identical shape in all three type files — worth actually sharing one object type in Sanity even though the TS code currently duplicates the interface three times) |
| `specRow` | `label` (string), `value` (string) | the various `specs?: {label, value}[]` fields |
| `ctaButton` | `label` (string), `href` (string), `style` (`primary`/`tertiary`) | the repeated hero/CTA button pairs across pages |
| `seo` | `metaTitle`, `metaDescription`, `ogImage` | not currently in the codebase at all — worth adding as every page/document's optional `seo` field since there's no per-page metadata today |
| `contactPerson` | `name`, `phone`, `email` | the footer contact block in `shared/components/layout/site-footer.tsx` (currently Wan Yang + Xu Liangkui, hardcoded) |

### 3.2 Singleton "page" documents

Each is a single document (one per type) that assembles the section-level content for that route. Fields map directly to the named component files.

| Document | Route | Sections to make editable | Source components |
|---|---|---|---|
| `homePage` | `/` | Hero slideshow (→ `gallery` object, currently `HERO_SLIDES` array in `home-hero.tsx`), "PCE at a glance" heading + 3 `statItem`s, Featured Projects picks (references to `project` docs — currently hardcoded AKK+OB3 in `featured-project.tsx`), "Our Capabilities" 4-card intro text (the cards themselves reference `capability` documents, see below) | `features/home/components/*` |
| `companyPage` | `/our-company` | Hero, "Who We Are" heading/body/images, "Local delivery capability" bento cards (4 image+title+description cards), "Our Direction" vision/mission timeline copy, "Experience" heading/body/image, "People & Scale" `statItem[]`, "Standards" section | `features/company/components/*` |
| `capabilitiesPage` | `/capabilities` | Page intro/heading only — the 4 cards live in the `capability` collection below, referenced in display order | `features/capabilities/components/core-capabilities.tsx` |
| `equipmentPage` | `/equipment-technology` | Hero, "Our Equipment" intro copy (the 5 categories live in `equipmentCategory` collection below), "Technical Support" heading/body/bullet list | `features/equipment/components/et-hero.tsx`, `our-equipments.tsx`, `support.tsx` |
| `safetyQualityPage` | `/safety-quality-responsibility` | Hero, Safety section, Quality section, Certification section, Environmental Care section, Our Future/Responsibility section — each as a `sectionBlock` + supporting image(s) | `features/safety-quality/components/*` |
| `projectsPage` | `/projects` | Hero gallery (currently `HERO_SLIDES` in `projects-home.tsx`), "Difficult Routes..." intro copy, tab labels/descriptions (Nigeria/Thailand/China/BPDS — currently hardcoded in `featured-projects.tsx`), "Different routes..." 4-card section | `features/projects/components/projects-home.tsx`, `featured-projects.tsx`, `what-works.tsx` |
| `productsPage` | `/products` | Hero, About section, Performance Matrix content, HDD Case Studies picks, Stock & Logistics section, Stratum Guide content, CTA | `features/products/components/*` |
| `newsInsightsPage` | `/news-insights` | Hero only (the articles live in the `newsArticle` collection) | `features/news-insights/components/news-hero.tsx` |
| `resourcesPage` | `/resources` | Hero (the downloadable resources live in the `resource`/`resourceCategory` collection) | `features/resources/components/resources-hero.tsx` |
| `contactPage` | `/contact` | Hero/intro copy, phone/email/address, social links (currently placeholder `linkedin.com`/`instagram.com` URLs in `contact-details.tsx` — flag to the client that these need their real handles), form recipient email (if the form should be configurable) | `features/contact/components/contact-details.tsx`, `contact-form.tsx` |

### 3.3 Repeatable collections

| Document | Fields | Mirrors | Notes |
|---|---|---|---|
| `capability` | `id` (slug: `hdd`/`epc`/`bpds`/`support`), `number`, `title`, `description`, `image`, `gallery` (→ reusable `gallery` object), `headline`, `subtext`, `steps` (array of `{number, title, description}`) | `CapabilityCard` + `CapabilityDetail` combined (`features/capabilities/data/capabilities-data.ts`, `features/home/components/capabilities.tsx`) | Only 4 documents total, but full CRUD/reorder still matters since these appear on both Home and the Capabilities page, plus the nav dropdown (`site-header.tsx` `capabilitySubLinks`) |
| `project` | `title`, `slug`, `subtitle`, `tagline`, `date`, `location`, `country` (**new** field — Nigeria/Thailand/China, replaces the current hardcoded `scope` logic in `featured-projects.tsx`), `isBpds` (**new** boolean, so the client can flag a project into the BPDS Construction Work tab once that content exists), `category`, `heroImage`, `intro`, `sections` (array of `sectionBlock`), `bentoImages` (→ `gallery`), `specs` (array of `specRow`) | `ProjectDetail` (`features/projects/data/projects-data.ts`) | This is the "case studies" collection the client asked for by name. 7 existing entries to migrate; note the BPDS category currently has zero entries (see the earlier feedback-scope doc) |
| `newsArticle` | `title`, `slug`, `category` (News/Insights), `date`, `readTime`, `author`, `heroImage`, `intro`, `sections` (array of `sectionBlock`), `bentoImages` (→ `gallery`), `specs` (array of `specRow`) | `NewsArticleDetail` (`features/news-insights/data/news-data.ts`) | 4 existing entries to migrate |
| `product` | Full mirror of `ProductDetail` (`features/products/types/index.ts`) — this is the largest schema: `title`, `slug`, `subtitle`, `eyebrow`, `description`, `image`, `secondaryImage`, `heroImage`, `galleryImages`/`technicalImages` (→ `gallery`), `intro`, `sections` (array of `sectionBlock`), `specs`, `executiveStandard`, `mainFunctions`, `features`, `applications` (array of `{title, desc, icon}`), `specTables` (array of `{title, headers, rows}` — model `rows` as an array of `{cells: string[]}` objects since Sanity arrays can't nest raw arrays), `howItsUsed` (object with dosage table etc.), `supplyDetails`, `storageInfo`, `sdsSections` (array, each with optional nested `table`), `safetyAtAGlance` (nested object: hazard ratings, PPE table, physical/chemical properties), `salesContacts` (array of `contactPerson`), `tdsUrl`/`sdsUrl` (file fields, not plain strings, so the client can upload/replace the actual PDF), `alsoKnownAs`, `overviewText`, `whatItDoes` | `ProductDetail` (`features/products/data/products-data.ts`) | Use `groups` (per §2.5) — this schema is genuinely large and needs to be organized in tabs: Overview / Specs & SDS / Safety Data / Supply & Contacts / Gallery |
| `equipmentCategory` | `id` (slug), `name`, `tagline`, `description`, `subtext`, `items` (array of `{id, number, title, description, image}`, sortable) | `EquipmentCategory`/`EquipmentItem` (`features/equipment/components/our-equipments.tsx`) | 5 categories, 18 items total — this is exactly the collection that needs new photos per the client's feedback (item #6 in the feedback-scope doc), so making it CMS-editable is directly useful for that outstanding item |
| `resourceCategory` | `id` (slug), `label`, `items` (array of `{title, file}` — `file` as a Sanity `file` field, not a hardcoded `/report/...` path) | `ReportCategory` (`features/resources/components/reports.tsx`) | Currently only 1 category ("Company Profile") with 1 real file and 3 placeholder entries with no file — good candidate to let the client actually attach the missing PDFs themselves once the CMS exists |

### 3.4 Global singletons

| Document | Fields | Mirrors |
|---|---|---|
| `navigation` | `companyMenu` (array of `{title, href, description}`), `capabilitiesMenu` (array, mirrors the 4 capability anchors), `productsMenu` (array of `{title, subtitle, href, description, image}`), `mainLinks` (ordered array — Projects, News & Insights, Resources, etc.) | `shared/components/layout/site-header.tsx` (`companySubLinks`, `capabilitySubLinks`, `productSubLinks`, `navLinksBeforeProducts`/`navLinksAfterProducts`) |
| `globalSettings` | `siteTitle`, `logo`, `favicon`, `defaultSeo` (→ `seo` object), `footerContacts` (array of `contactPerson` — Wan Yang, Xu Liangkui), `generalEmail` (`info@pcenigeria.com`), `socialLinks` (array of `{platform, url}` — flag to client that these are currently placeholder URLs), `footerTagline`/`footerLinks` | `shared/components/layout/site-footer.tsx` |

---

## 4. Data migration (don't ask the client to retype everything)

There is a lot of existing, good content already living in the `*-data.ts` files. Write one-time Node/TS migration scripts (e.g. `scripts/migrate-projects.ts`, `migrate-news.ts`, `migrate-products.ts`, `migrate-capabilities.ts`, `migrate-equipment.ts`) that:
1. Import the existing arrays from `features/*/data/*.ts`.
2. For each item, upload referenced local images from `public/pictures/...` as Sanity assets via `client.assets.upload('image', fs.createReadStream(...))`, capture the returned asset `_id`.
3. `client.create({...})` a document per item with the asset references wired in.

Run these once against the `production` dataset after the schemas are deployed, then verify in Studio before wiring the frontend queries over. This avoids re-keying 7 projects, 4 news articles, 9+ full products (with all their SDS/spec sub-content), 5 equipment categories, and the 4 capability details by hand.

---

## 5. Suggested phased rollout

1. **Schema + Studio scaffolding**: install Sanity, create the project/dataset, build `sanity/schemaTypes/*` for every type above, wire up the grouped/branded desk structure in `sanity.config.ts` (§7.4), deploy Studio at `/studio`.
2. **Collections first** (highest content-management value, most self-contained): `project`, `newsArticle`, `product`, `resourceCategory`, `equipmentCategory`, `capability`. Run the migration scripts. Swap the corresponding frontend components from importing `*-data.ts` to GROQ queries.
3. **Page singletons**: `homePage`, `companyPage`, `capabilitiesPage`, `equipmentPage`, `safetyQualityPage`, `projectsPage`, `productsPage`, `newsInsightsPage`, `resourcesPage`, `contactPage`. Migrate each page's section copy/images into its singleton, wire the components to read from it.
4. **Global**: `navigation`, `globalSettings`. Wire `site-header.tsx` and `site-footer.tsx` to read from these instead of hardcoded arrays.
5. **Polish pass**: preview configs on every schema, image alt validation, webhook + `revalidateTag`/`revalidatePath` wiring end-to-end (§7.6), Studio branding/theme, a short walkthrough or one-pager for the client on how to use it.

---

## 6. Open questions for the client (worth confirming before or during build)

- Should the Studio be public at `pce-psi.vercel.app/studio` (simplest) or on a separate subdomain (`cms.pcenigeria.com`)? Either works with the embedded-Studio approach; a subdomain is just a routing/DNS choice, not a schema one.
- Who on the client's team should get Studio access, and at what role (Editor vs. Administrator)?
- Real social media URLs to replace the current placeholders (`contact-details.tsx` currently links to generic `linkedin.com`, `instagram.com`, etc. with no PCE-specific handle).
- Confirm whether `product.tdsUrl`/`sdsUrl` should become client-uploadable files in the CMS (recommended) or stay as static links the developer manages.

---

## 7. Implementation mechanics (concrete file skeletons)

These are adapted from a working Sanity + Next 16 / React 19 setup on another project, restructured for PCE's schemas and routes. Treat them as a starting skeleton, not a copy-paste-and-done — field names must match whatever the schemas in §3 end up being named exactly.

### 7.1 Directory structure

```
├── .env.local
├── sanity.config.ts
├── sanity.cli.ts
├── app/
│   ├── api/
│   │   └── revalidate/
│   │       └── route.ts              # Webhook endpoint for instant cache updates
│   └── studio/
│       └── [[...tool]]/
│           └── page.tsx              # Embedded Sanity Studio route
├── sanity/
│   ├── components/
│   │   └── LivePreviewIframe.tsx     # Optional: live side-by-side preview
│   ├── lib/
│   │   ├── client.ts                 # Sanity client
│   │   ├── image.ts                  # Sanity image URL builder helper
│   │   └── queries.ts                # Centralized GROQ queries
│   └── schemaTypes/
│       ├── index.ts                  # Schema barrel exporter
│       ├── objects/                  # gallery, galleryItem, statItem, sectionBlock, specRow, ctaButton, seo, contactPerson, blockContent
│       ├── pages/                    # homePage, companyPage, capabilitiesPage, equipmentPage, safetyQualityPage, projectsPage, productsPage, newsInsightsPage, resourcesPage, contactPage
│       ├── collections/              # project, newsArticle, product, capability, equipmentCategory, resourceCategory
│       └── settings/                 # navigation, globalSettings
```

### 7.2 `.env.local`

```env
NEXT_PUBLIC_SANITY_PROJECT_ID="your_project_id_here"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-01-01"

SANITY_API_READ_TOKEN="your_sanity_read_token_here"
SANITY_REVALIDATION_SECRET="your_custom_secure_webhook_secret_here"
```

### 7.3 Worked schema + preview example (`sanity/schemaTypes/collections/project.ts`)

Shows the pattern to repeat across every schema in §3: `defineField`/`defineType`, required validation, a sortable gallery reference, and a `preview` that actually shows something useful instead of "Untitled".

```ts
import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Case Study / Project',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content Sections' },
    { name: 'gallery', title: 'Gallery' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', group: 'overview', validation: (Rule) => Rule.required() }),
    defineField({ name: 'slug', title: 'URL Slug', type: 'slug', group: 'overview', options: { source: 'title', maxLength: 96 }, validation: (Rule) => Rule.required() }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'string', group: 'overview' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'string', group: 'overview' }),
    defineField({ name: 'date', title: 'Completion Date', type: 'string', group: 'overview' }),
    defineField({ name: 'location', title: 'Location', type: 'string', group: 'overview' }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      group: 'overview',
      options: { list: ['Nigeria', 'Thailand', 'China'], layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'isBpds', title: 'BPDS Construction Work', type: 'boolean', group: 'overview', initialValue: false }),
    defineField({ name: 'category', title: 'Category', type: 'string', group: 'overview' }),
    defineField({ name: 'heroImage', title: 'Hero Image', type: 'image', group: 'overview', options: { hotspot: true } }),
    defineField({ name: 'intro', title: 'Intro', type: 'text', group: 'content', rows: 3 }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      group: 'content',
      of: [{ type: 'sectionBlock' }],
      options: { sortable: true },
    }),
    defineField({
      name: 'specs',
      title: 'Specs',
      type: 'array',
      group: 'content',
      of: [{ type: 'specRow' }],
    }),
    defineField({ name: 'bentoImages', title: 'Gallery', type: 'gallery', group: 'gallery' }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'location', media: 'heroImage' },
    prepare: ({ title, subtitle, media }) => ({ title, subtitle, media }),
  },
});
```

### 7.4 `sanity.config.ts` (grouped desk structure + PCE brand theme + Vision-tool restriction)

```ts
import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

// PCE brand palette, from shared/styles/colors.css
const pceTheme = buildLegacyTheme({
  '--black': '#001723',
  '--white': '#FFFFFF',
  '--brand-primary': '#1470AD',
  '--main-navigation-color': '#001723',
  '--main-navigation-color--inverted': '#FFFFFF',
  '--focus-color': '#f4691a',
});

const SINGLETONS = [
  'homePage', 'companyPage', 'capabilitiesPage', 'equipmentPage',
  'safetyQualityPage', 'projectsPage', 'productsPage',
  'newsInsightsPage', 'resourcesPage', 'contactPage',
  'navigation', 'globalSettings',
];

export default defineConfig({
  name: 'default',
  title: 'PCE Nigeria CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  theme: pceTheme,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('PCE Content')
          .items([
            S.listItem().title('Pages').child(
              S.list().title('Pages').items(
                SINGLETONS.filter((t) => t !== 'navigation' && t !== 'globalSettings').map((type) =>
                  S.listItem().title(type).id(type).child(S.document().schemaType(type).documentId(type))
                )
              )
            ),
            S.divider(),
            S.documentTypeListItem('project').title('Case Studies'),
            S.documentTypeListItem('newsArticle').title('News & Insights'),
            S.documentTypeListItem('product').title('Products'),
            S.documentTypeListItem('capability').title('Capabilities'),
            S.documentTypeListItem('equipmentCategory').title('Equipment'),
            S.documentTypeListItem('resourceCategory').title('Resources'),
            S.divider(),
            S.listItem().title('Site Settings').child(
              S.list().title('Site Settings').items([
                S.listItem().title('Navigation').id('navigation').child(S.document().schemaType('navigation').documentId('navigation')),
                S.listItem().title('Global Settings').id('globalSettings').child(S.document().schemaType('globalSettings').documentId('globalSettings')),
              ])
            ),
          ]),
    }),
    visionTool(),
  ],

  // Hide the raw-GROQ Vision tool from non-admin editors
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator');
    return isAdmin ? prev : prev.filter((tool) => tool.name !== 'vision');
  },

  schema: {
    types: schemaTypes,
    // Prevent creating a second copy of any singleton from the global "+ new document" menu
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action && !['duplicate', 'delete'].includes(action))
        : input,
  },
});
```

### 7.5 `sanity.cli.ts`, Studio route, client + image helper

```ts
// sanity.cli.ts
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  },
});
```

```tsx
// app/studio/[[...tool]]/page.tsx
'use client';

import { NextStudio } from 'next-sanity/studio';
import config from '../../../sanity.config';

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

```ts
// sanity/lib/client.ts
import { createClient } from 'next-sanity';

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01',
  useCdn: false, // false = always fresh; flip to true once traffic/caching matters more than instant edits
  token: process.env.SANITY_API_READ_TOKEN,
});
```

```ts
// sanity/lib/image.ts
import createImageUrlBuilder from '@sanity/image-url';
import { client } from './client';

const builder = createImageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
}
```

### 7.6 `sanity/lib/queries.ts` (worked examples — repeat this pattern per collection)

```ts
import { client } from './client';

// All projects, for the /projects country/BPDS tab filters
export async function getAllProjects() {
  const query = `*[_type == "project" && !(_id in path("drafts.**"))] | order(date desc) {
    _id, title, slug, tagline, date, location, country, isBpds, category,
    "heroImage": heroImage.asset->url,
    intro
  }`;
  return client.fetch(query, {}, { next: { tags: ['project'] } });
}

// Single project by slug, for /projects/[slug]
export async function getProjectBySlug(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id, title, slug, subtitle, tagline, date, location, country, isBpds, category,
    "heroImage": heroImage.asset->url,
    intro, sections, specs,
    "bentoImages": bentoImages.items[]{ "src": image.asset->url, title, description }
  }`;
  return client.fetch(query, { slug }, { next: { tags: [`project-${slug}`, 'project'] } });
}

// Home page singleton
export async function getHomePage() {
  const query = `*[_id == "homePage"][0] {
    heroGallery, glanceHeading, glanceStats, capabilitiesIntro,
    "featuredProjects": featuredProjects[]->{ title, slug, tagline, intro, "heroImage": heroImage.asset->url }
  }`;
  return client.fetch(query, {}, { next: { tags: ['homePage'] } });
}
```

Apply the same `_type == "..."`, dereference-with-`->`, and `{next: {tags: [...]}}` pattern for every other schema in §3 (`newsArticle`, `product`, `capability`, `equipmentCategory`, `resourceCategory`, and each page singleton).

### 7.7 `app/api/revalidate/route.ts` (webhook-driven cache invalidation)

```ts
import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.SANITY_REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    const docType = payload?._type;
    const slug = payload?.slug?.current || payload?.slug;

    switch (docType) {
      case 'project':
        revalidateTag('project');
        if (slug) { revalidateTag(`project-${slug}`); revalidatePath(`/projects/${slug}`); }
        revalidatePath('/projects');
        revalidatePath('/'); // home features AKK/OB3 projects
        break;
      case 'newsArticle':
        revalidateTag('newsArticle');
        if (slug) { revalidateTag(`newsArticle-${slug}`); revalidatePath(`/news-insights/${slug}`); }
        revalidatePath('/news-insights');
        break;
      case 'product':
        revalidateTag('product');
        if (slug) { revalidateTag(`product-${slug}`); revalidatePath(`/products/${slug}`); }
        revalidatePath('/products');
        break;
      case 'capability':
        revalidateTag('capability');
        revalidatePath('/capabilities');
        revalidatePath('/'); // home capabilities grid
        break;
      case 'equipmentCategory':
        revalidateTag('equipmentCategory');
        revalidatePath('/equipment-technology');
        break;
      case 'resourceCategory':
        revalidateTag('resourceCategory');
        revalidatePath('/resources');
        break;
      case 'navigation':
      case 'globalSettings':
        // affects header/footer on every page — revalidate broadly
        revalidateTag('navigation');
        revalidateTag('globalSettings');
        revalidatePath('/', 'layout');
        break;
      default:
        // page singletons: homePage, companyPage, capabilitiesPage, equipmentPage,
        // safetyQualityPage, projectsPage, productsPage, newsInsightsPage, resourcesPage, contactPage
        if (docType) {
          revalidateTag(docType);
          revalidatePath('/'); // fallback — narrow this to each singleton's actual route once wired
        }
    }

    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

Set up the webhook in [sanity.io/manage](https://www.sanity.io/manage) → Project → API → Webhooks: URL `https://<your-domain>/api/revalidate?secret=YOUR_REVALIDATION_SECRET`, triggers on Create/Update/Delete.

### 7.8 Optional polish: live preview iframe

Same idea as the reference project's `PoemPreviewIframe` — a Studio-side component that renders the live page next to the editing form so the client can see changes before publishing. Adapt the target URL per document type (e.g. `/projects/${slug}` for a `project` document, `/news-insights/${slug}` for a `newsArticle`). Worth doing for `project`, `newsArticle`, and `product` specifically since those are the detail pages the client will edit most often; skip it for the smaller singletons unless there's time.

### 7.9 Execution checklist for Antigravity

1. `npm install sanity next-sanity @sanity/vision @sanity/ui @sanity/image-url @portabletext/react --legacy-peer-deps`
2. Build out `sanity/schemaTypes/` per §3 (objects → collections → pages → settings, in that order since pages/collections reference the objects), following the pattern in §7.3.
3. Add `sanity.config.ts` and `sanity.cli.ts` (§7.4, §7.5).
4. Mount `app/studio/[[...tool]]/page.tsx` (§7.5).
5. Add `sanity/lib/client.ts`, `image.ts`, `queries.ts` (§7.5, §7.6).
6. Write and run the migration scripts (§4) against the `production` dataset; verify every document in Studio.
7. Swap each frontend component from its `features/*/data/*.ts` import to the corresponding GROQ query, in the phase order from §5.
8. Add `app/api/revalidate/route.ts` (§7.7) and configure the webhook in Sanity Manage.
9. `npx sanity login`, deploy Studio (embedded via the Next app's own deploy, e.g. Vercel — no separate `sanity deploy` needed since it's mounted in-app).
10. Validate: log in as a test Editor, confirm they can add/edit a case study, a news post, a product, and a page section, and see it live on the site within seconds of publishing.
