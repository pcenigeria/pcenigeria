# PCE Nigeria Limited — Web Platform

The official website and Content Management System for **PCE Nigeria Limited (Pipeline Construction & Engineering)** — specializing in Horizontal Directional Drilling (HDD), complex river/road pipeline crossings, pipeline EPC, and advanced 3D pipeline location surveys (BPDS).

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16 (Turbopack, App Router)](https://nextjs.org/)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) + Custom CSS Design Tokens
- **Content Management:** [Sanity CMS (Studio v3)](https://www.sanity.io/) embedded at `/studio`
- **Animations & Interactivity:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [@phosphor-icons/react](https://phosphoricons.com/)

---

## 📁 Architecture & Folder Structure

The project uses a **Feature-Driven Architecture**:

```
├── app/                          # Next.js App Router & Routes
│   ├── capabilities/             # Capabilities page
│   ├── contact/                  # Contact & Inquiry page
│   ├── equipment-technology/     # Equipment & Fleet page
│   ├── news-insights/            # News & Insight articles + [slug]
│   ├── our-company/              # Company profile & history
│   ├── products/                 # Products catalog + [slug]
│   ├── projects/                 # Project Case Studies + [slug]
│   ├── resources/                # Reports & Downloadables
│   ├── safety-quality-responsibility/ # Safety, Quality & Standards
│   ├── studio/[[...tool]]/       # Embedded Sanity Studio
│   └── api/revalidate/           # On-demand Sanity webhook revalidation
├── features/                     # Feature modules (Components, Pages, Types)
│   ├── capabilities/             # HDD, EPC, BPDS & Support components
│   ├── company/                  # Company standards, leadership & scale
│   ├── contact/                  # Contact forms & location cards
│   ├── equipment/                # Equipment fleet catalog & capacity tables
│   ├── home/                     # Hero, overview glance, capability bento, lightbox
│   ├── news-insights/            # Article templates & rich text formatting
│   ├── products/                 # Product detail templates & spec tables
│   ├── projects/                 # Case studies, filters & gallery modals
│   ├── resources/                # Reports & download center
│   └── safety-quality/           # Safety, quality metrics & environmental care
├── sanity/                       # Sanity CMS Configuration & Schemas
│   ├── lib/                      # Client setup, queries & image helpers
│   └── schemaTypes/              # Document types (singletons, collections, objects)
├── shared/                       # Shared components (Header, Footer, UI primitives)
│   ├── components/ui/            # Reusable UI (buttons, text, fade animations)
│   └── styles/                   # Global tokens (typography, colors, theme)
├── scripts/                      # Data migration & seeding utilities
└── public/                       # Static media, icons, and pictures
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js 18.18+ (Node 20+ recommended)
- npm / pnpm / yarn

### 2. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID="bw6b1mhq"
NEXT_PUBLIC_SANITY_DATASET="production"
NEXT_PUBLIC_SANITY_API_VERSION="2025-01-01"
SANITY_API_READ_TOKEN="<your-sanity-read-token>"
SANITY_API_READ_AND_WRITE_TOKEN="<your-sanity-write-token>"
SANITY_REVALIDATION_SECRET="<your-revalidation-secret>"
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🎨 Sanity CMS & Content Management

### Accessing Sanity Studio
The Sanity Studio is embedded directly into the application at:
- **Local:** [http://localhost:3000/studio](http://localhost:3000/studio)
- **Production:** `https://your-domain.com/studio`

### Available Schemas & Content Types:
- **Page Singletons:** Home, Our Company, Capabilities, Projects, Products, Equipment & Technology, Safety & Quality, News & Insights, Resources, Contact Us.
- **Collections:** Project Case Studies (`project`), Products (`product`), News Articles (`newsArticle`), Equipment Categories (`equipmentCategory`), Resource Categories (`resourceCategory`).
- **Global Settings:** Navigation settings (`navigation`), Company global contacts & social links (`globalSettings`).

### Seeding Sanity Content
To seed or populate Sanity CMS with default site content and image assets:
```bash
# Dry run (preview without sending mutations)
node scripts/seed-sanity.mjs --dry-run

# Live run (uploads assets and sets up documents)
node scripts/seed-sanity.mjs
```

---

## ⚡ On-Demand Cache Revalidation

To enable instant live site updates upon publishing in Sanity Studio:
1. Navigate to **Sanity Management** ([sanity.io/manage](https://www.sanity.io/manage)) -> **API** -> **Webhooks**.
2. Create a webhook pointing to:
   ```
   https://your-domain.com/api/revalidate?secret=<SANITY_REVALIDATION_SECRET>
   ```
3. Set triggers on `Create`, `Update`, `Delete` for dataset `production`.

---

## 🚢 Building for Production

```bash
# Build production bundle
npm run build

# Start production server
npm start
```

---

## 📄 License & Proprietary Notice

Copyright © 2026 PCE Nigeria Limited. All rights reserved.
