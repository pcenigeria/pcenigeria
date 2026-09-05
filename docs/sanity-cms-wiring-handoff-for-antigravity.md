# Sanity CMS Wiring — Handoff to Antigravity

**Context:** Claude Code just finished wiring every page/route of the PCE Nigeria site to actually
read from Sanity (previously 13 of 15 routes rendered from hardcoded TypeScript and ignored the
CMS entirely, per `docs/pce-cms-review-and-agent-plan.md` — that file, on the user's Desktop, not
in this repo, is the original problem report; read it first if available for full background).

**Status when this was written:** All wiring is implemented, TypeScript compiles clean
(`npx tsc --noEmit`), and `npm run build` succeeds — every dynamic route statically generates from
real live Sanity data (7 projects, 5 products, 4 news articles, matching the dataset exactly). A
dev server was running on **port 3901** (not 3000 — an unrelated, much older `next-server`
process was already occupying 3000; do not kill it without checking with the user first, it may be
another tool's server). `.claude/launch.json` was created pointing at port 3901 for browser-preview
tooling.

**Nothing has been committed.** `git status` shows everything below as uncommitted working-tree
changes on `main`. Review and commit (or continue iterating) as appropriate.

---

## 1. What was done, file by file

### Phase 0 — Query layer (`sanity/lib/queries.ts`)
- Added 6 previously-missing singleton page queries: `getCapabilitiesPage`, `getProjectsPage`,
  `getProductsPage`, `getNewsInsightsPage`, `getSafetyQualityPage`, `getContactPage`.
- Fixed `getHomePage()` (was projecting fields that don't exist on the schema — silently returned
  near-empty data before).
- Fixed `getEquipmentPage()` (was only projecting 4 of ~13 fields).
- Added real field projections to `getGlobalSettings()`/`getNavigationSettings()` (were bare
  `[0]` fetches with unresolved image asset refs).
- Added reusable GROQ projection fragments at the top of the file (`SECTION_BLOCK_FIELDS`,
  `GALLERY_FIELDS`, `GALLERY_ITEMS_ARRAY_FIELDS`, `STAT_ITEM_FIELDS`, `SEO_FIELDS`) — reuse these
  for any new query rather than re-deriving the projection shape.

### Every page singleton + collection wired
Following the pre-existing working pattern in `app/equipment-technology/page.tsx` /
`features/equipment/*` and `app/resources/page.tsx` / `features/resources/*` (route = async
server component fetching via `sanity/lib/queries.ts`, feature page component takes
`sanityPage?`/`sanityX?` props, each child section keeps its old hardcoded content as a
`DEFAULT_*` fallback and merges in Sanity data when present):

| Route | Feature dir | Status |
|---|---|---|
| `/` | `features/home` | Wired. Hero now uses `heroSlides` gallery (the photo-slideshow gap the client flagged) instead of one static image. |
| `/our-company` | `features/company` | Wired, all 7 sections. |
| `/capabilities` | `features/capabilities` | Wired incl. `capability` collection cards + drawer + per-capability lightbox galleries. |
| `/projects` + `/projects/[slug]` | `features/projects` | Wired, `generateStaticParams` now pulls real slugs from Sanity. |
| `/products` + `/products/[slug]` | `features/products` | Wired, same pattern. See §3 for a real content gap found here. |
| `/news-insights` + `/news-insights/[slug]` | `features/news-insights` | Wired, same pattern. |
| `/safety-quality-responsibility` | `features/safety-quality` | Wired, cleanest 1:1 field mapping of all pages. |
| `/contact` | `features/contact` | Wired. |
| Header/footer (`shared/components/layout/*`) | — | Wired: nav menus, logo, footer contacts/addresses/general email now Sanity-driven. See §2 for a bug that was found and fixed here, and §4 for a schema addition made. |

Each of the above followed a specific agent brief; the agents' own detailed "what I deliberately
left unwired and why" notes are the best source of field-level nuance (e.g. `HowWeWork` on the
Capabilities page has no schema-backed equivalent for its 5 fixed bento steps, so it's still
hardcoded; several portable-text `body` fields were wired via `@portabletext/react`, some weren't
where there was no clear UI slot). Read the relevant component's `DEFAULT_*` constant and its
surrounding comment if you need to know exactly what's wired vs. not for a given section — this
doc doesn't re-derive every one of those per-field decisions.

### Two real bugs found and fixed during verification (not pre-planned, discovered while testing)

1. **Pre-existing build-breaking bug, unrelated to this wiring work**:
   `features/home/components/featured-project.tsx` imported `@phosphor-icons/react` (which calls
   `React.createContext` at module scope) without a `'use client'` directive. Under React 19 /
   Next 16, a Server Component's module graph doesn't have `createContext` available, so
   `npm run build` failed entirely on `/` with `TypeError: e.createContext is not a function`.
   This bug existed in the original `git show HEAD:features/home/components/featured-project.tsx`
   — i.e. it predates this session. **Fixed** by adding `'use client'` to the top of that file.
   If Antigravity encounters a similar `createContext is not a function` build error elsewhere,
   check for a Server Component importing `@phosphor-icons/react` (or any other context-using
   client library) without `'use client'`.

2. **Header duplication bug, introduced by this session's own header-wiring work**, found and
   fixed: the live `navigation` document's `mainLinks` field (seeded before this session, for a
   different, simpler header design) holds the *entire* flat site nav (10 items: Home, Our
   Company, Capabilities, Equipment & Technology, Safety & Quality, Projects, Products, News &
   Insights, Resources, Contact) — not just the 3 "extra" links (Projects/News/Resources) the new
   header code expected that field to hold. Since `companyMenu`/`capabilitiesMenu` already render
   their own dropdowns, this caused every dropdown-covered page to appear twice in the header.
   **Fixed** in `shared/components/layout/site-header.tsx` by filtering `mainLinks` against a
   `coveredHrefs` set (home/contact/capabilities/products/company-submenu/capability-submenu
   hrefs) before rendering, and by making the Products mega-menu's fallback insertion point smarter
   (inserts right after a `/projects` entry if present, rather than always at the very end). This
   is a defensive code fix, not a data mutation — the live `navigation` document itself was not
   touched. **No other Sanity documents were modified by this session** (no write-capable Sanity
   token was available in `.env.local` — only `SANITY_API_READ_TOKEN`).

---

## 2. Verified working (browser-tested against the live dev server on port 3901)

- Home page: hero slideshow (5 real slides from `heroSlides`), "PCE at a Glance" stats (real
  numbers/galleries), header nav (single row, correct order, no duplication after the fix above),
  footer (real office addresses/contacts, sensible fallback for the still-unseeded `footerLinks`
  field, correctly renders zero social icons since `globalSettings.socialLinks` is empty rather
  than showing fake placeholders).
- `/capabilities`: 4 real capability cards, drawer opens with real headline/subtext/steps per
  capability (tested 2 of 4 directly).
- `/projects` list (7 real projects) and `/projects/akk-river-niger` detail page, including
  correct "next project" footer link computed from the real project list.
- `/products/brsbent-sq` detail page renders with no console errors, but see the content gap in
  §3 below — most of its deeper sections are empty because the underlying Sanity document lacks
  that data, not because of a code bug.
- `/news-insights/akk-river-niger-hdd-crossing-completion-milestone` renders, no errors — again
  see §3, this article's `sections` field is empty in Sanity.
- `/our-company`, `/safety-quality-responsibility`, `/contact`: all render with no console
  errors and reasonable content length.
- Not re-verified in-browser this session (should have carried over correctly since untouched):
  `/equipment-technology`, `/resources` — these were already working before this session and
  nothing in this session touched their code paths except the `getEquipmentPage()` projection fix
  in Phase 0, which only *adds* previously-missing fields, so it should be strictly additive.

---

## 3. IMPORTANT — real content gaps found in the live Sanity dataset (not a code problem)

This is the most important thing to hand off. While verifying, direct GROQ queries against the
live dataset (via `SANITY_API_READ_TOKEN` in `.env.local`) showed that although every collection
has the right *number* of documents (confirmed earlier: 7 projects, 5 products, 4 news articles,
etc.), many documents are missing their **deep/body content** — the fields that hold the bulk of
what a visitor actually reads:

- **All 5 products** (`brsbent-sq`, `brscmc`, `brsmmh`, `brsvr`, `brsxtg`): `applications`,
  `specTables`, `sdsSections`, `safetyAtAGlance`, `supplyDetails`, `salesContacts`, `specRows`,
  and gallery images (`galleryImages`/`technicalImages`) are **all empty** on every single
  product document. Only the shallow fields (title, subtitle, description, overviewText,
  mainFunctions, features) are populated.
- **All 4 news articles**: `sections` and `bentoImages` are empty on every article. Only the
  intro/summary fields are populated.
- **5 of 7 projects** (`five-parallel-crossings`, `pipeline-epc-thailand`,
  `raoyang-river-crossing`, `two-major-gas-crossings`, `zhanjiang-crossing`) have **zero**
  `sections` — only the original two flagship projects (`akk-river-niger`, `ob3-river-niger`,
  the two that existed in the very first version of the static site) have their 3-section body
  content populated.

**Why this matters:** the frontend wiring is correct and degrades gracefully (no crashes, no
blank pages — it just renders less than the old static site did for anything except the two
original flagship projects). But once this goes live, most product/article/project detail pages
will look noticeably thinner than they did on the old hardcoded static site, because that static
site's rich content (still sitting in `features/products/data/products-data.ts`,
`features/news-insights/data/news-data.ts`, `features/projects/data/projects-data.ts`,
`features/capabilities/data/capabilities-data.ts` — **none of these were deleted**, precisely
because `scripts/migrate-sanity-data.ts` still imports them and because they're now the only
remaining source for this missing content) was never fully migrated into Sanity.

**Recommended next step:** extend `scripts/migrate-sanity-data.ts` (grep it for `applications`,
`specTables`, `sdsSections`, etc. — none of those field names currently appear in it at all,
confirming it never attempted this deeper migration) to patch the existing Sanity documents with
this content from the static files, then run it with a **write-capable** Sanity API token (the
current `.env.local` only has `SANITY_API_READ_TOKEN`; check sanity.io/manage for this project,
ID `bw6b1mhq`, dataset `production`, for a token with write permission, or generate one). This is
a content backfill, not a schema change — the schema fields already exist and are correctly
queried/rendered, they're just empty in the dataset today.

**Already done, this session, to make that eventual backfill run faster** (the migration was not
actually run — these are tooling improvements only, no data was written):
- `tsx` is now an explicit devDependency (`npm install -D tsx`) instead of being resolved fresh
  via `npx` every run — confirmed `npx tsx --version` now returns in well under a second.
- `package.json` has a `"migrate": "tsx scripts/migrate-sanity-data.ts"` script — run via
  `npm run migrate`.
- `saveDoc()` in `scripts/migrate-sanity-data.ts` was changed from two sequential requests per
  document (`client.createOrReplace(doc)` then a separate `client.delete(drafts.<id>)` in a
  try/catch) to a single `client.transaction().createOrReplace(doc).delete(...).commit()` call —
  halves the network round-trips per document. `tsc --noEmit` confirms this still typechecks
  against the installed `@sanity/client` version. If Antigravity restructures the migrate*()
  functions further to batch *multiple* documents into one transaction (the bigger win once this
  script is extended to backfill dozens of documents), verify Sanity's per-transaction mutation
  limits before batching very large collections.

Do **not** delete the four static data files above until this backfill is done — they're the only
remaining source of this content.

---

## 4. Schema changes made (additive only, nothing removed/renamed)

- `sanity/schemaTypes/settings/navigation.ts`: added `homeLink` (object: title/href), `contactCta`
  (object: text/href), `footerLinks` (array of {title,href}), and an `insertProductsMenuAfter`
  boolean on each `mainLinks` item.
- `sanity/schemaTypes/settings/globalSettings.ts`: added `footerHeading`, `footerCtaText`,
  `footerCtaLink` (all strings).
- None of these new fields have been populated in the live dataset yet (no write token was
  available) — every consumer falls back safely to a hardcoded default when they're empty, so
  this is non-breaking, but an editor could fill these in via Studio for full control (e.g. tick
  `insertProductsMenuAfter` on the "Projects" `mainLinks` item to get pixel-perfect control over
  where the Products mega-menu sits, instead of relying on the code's positional fallback).

---

## 5. Known deliberate gaps (by design, not oversights)

- `HowWeWork` (Capabilities page) — 5 fixed bento process-steps, no schema array backs them,
  left fully hardcoded.
- `HddCaseStudies` (Products page) — no matching `productsPage` section, left hardcoded.
- Various decorative/background images across Company/Safety pages — left hardcoded since
  `sectionBlock.gallery` would need the same lightbox machinery built for the home page
  (`OverviewLightboxModal`), which was judged out of scope for a content-wiring pass.
- `homePage.equipmentSection` and `homePage.ctaSection` schema fields are fetched by
  `getHomePage()` but currently unused — the Home page's 4 current components (`HomeHero`,
  `Overview`, `FeaturedProject`, `Capabilities`) have no UI slot for them. Either add new sections
  to the Home page consuming these, or ignore them (they exist because the original schema-review
  commits anticipated a slightly different Home page layout).
- Two placeholder-but-dead-code social link arrays exist: `features/contact/components/contact-details.tsx`
  has a hardcoded `socials` array (LinkedIn/Instagram/Facebook/YouTube, all generic root-domain
  URLs) that is **not actually rendered anywhere in that component's JSX** — this is pre-existing
  dead code, not something this session added or needs to fix, just noting it in case it's ever
  revived (the real, live social links now flow through `globalSettings.socialLinks` into the
  footer instead).
- `features/capabilities/data/capabilities-data.ts` and the other 3 static data files mentioned
  in §3 are intentionally still on disk — see §3, do not delete until the content backfill happens.

---

## 6. Verification commands for Antigravity to re-run after any further changes

```bash
npx tsc --noEmit
npm run build
npx eslint . --quiet   # baseline before this session was 78 problems; this session added ~61 more
                        # `no-explicit-any` errors, all consistent with the pre-existing convention
                        # in the already-working equipment/resources reference pattern — not a new
                        # category of problem, just more of the same pattern in more files.
```

For a visual check, `.claude/launch.json` in this repo starts the dev server on port 3901 (port
3000 was occupied by an unrelated older process when this session ran — check again, it may be
free now). Compare a page in Studio (`/studio`) against its live route after editing+publishing a
field to confirm the revalidation webhook (`app/api/revalidate/route.ts`, untouched this session,
already correctly configured) delivers the update within seconds.

---

## 7. Reference documents

- `pce-cms-review-and-agent-plan.md` (user's Desktop, not in this repo) — the original problem
  report this session was responding to.
- `/Users/user/.claude/plans/federated-munching-metcalfe.md` — the approved implementation plan
  this session executed against (on the machine Claude Code ran on, not in this repo).
- `docs/sanity-cms-scope-for-antigravity.md` (in this repo) — the original 5-phase scope doc that
  the review doc above was itself following up on.
