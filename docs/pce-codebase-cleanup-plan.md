# PCE Nigeria — Codebase & CMS Cleanup Plan

**Reviewed:** `Projects/pce` at commit `0f7c0a4` ("fix(safety-quality): fix overlapping text..."), September 7, 2026
**Context:** Since the last CMS review, the wiring work from `sanity-cms-scope-for-antigravity.md` and `pce-cms-review-and-agent-plan.md` has largely been executed — commit `d4d4302` ("wire every page and collection to Sanity, fixing the CMS/live-site disconnect") and the migration/fix commits after it. **Every route now reads from Sanity.** That's the good news, and it changes what "cleanup" means here.

What's left is exactly the mess that kind of migration always leaves behind: the pre-migration static files that nothing reads anymore, one leftover component from a section that was cut, one CMS field that's fetched but silently dropped, two internal dev-only pages nobody meant to ship live, and the one piece of the original CMS scope that's still genuinely disconnected (site nav and footer). This doc lists exactly what to remove, what to fix, and in what order — written for your dev agent to execute directly, following the same format as the prior two scope docs.

**Decisions already made (from our conversation) — this plan reflects them:**

1. Nav & footer: **wire them now** (finish the last disconnected piece, don't just document it).
2. `/design-system` and `/docs`: **keep the routes, block search indexing** (not a deletion).
3. Old pre-migration data files + the one-time migration script: **delete outright** (git history keeps them if ever needed).

---

## 1. Confirmed dead code — safe to delete outright

| Item                                                                                                     | What it is                                                                                                                                                                                      | Evidence                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `features/equipment/components/equipment-capacity.tsx` (exports `OurCapabilities` / `EquipmentCapacity`) | The "Scale matters. Control matters more." section, removed from the live page in commit `840a689` ("remove equipment capacity section")                                                        | `features/equipment/pages/equipment-page.tsx` only renders `ETHero`, `OurEquipments`, `Support` — this component isn't imported there anymore. It's still barrel-exported from `features/equipment/components/index.ts` (`export * from './equipment-capacity'`), which is exactly why it doesn't show up as "obviously unused" in a normal file search — the export is alive even though nothing renders it. Delete the file and remove that one `export *` line from the barrel. |
| `features/news-insights/data/news-data.ts`                                                               | Pre-migration static news content                                                                                                                                                               | Only importer left in the whole repo is `scripts/migrate-sanity-data.ts`. `app/news-insights/page.tsx` and `[slug]/page.tsx` both read from `sanity/lib/queries` now.                                                                                                                                                                                                                                                                                                              |
| `features/products/data/products-data.ts`                                                                | Pre-migration static product content (69KB — the single biggest dead file in the repo)                                                                                                          | Same — only `scripts/migrate-sanity-data.ts` still imports it.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `features/projects/data/projects-data.ts`                                                                | Pre-migration static project/case-study content                                                                                                                                                 | Same — only `scripts/migrate-sanity-data.ts` still imports it.                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `scripts/migrate-sanity-data.ts`                                                                         | The one-time migration script that moved the three files above (plus capabilities) into Sanity                                                                                                  | Its job is done — the dataset is populated and every page reads from it. Also remove the `"migrate": "tsx scripts/migrate-sanity-data.ts"` line from `package.json`'s `scripts` block, since it'll reference a deleted file otherwise.                                                                                                                                                                                                                                             |
| `resource/design-sys.tsx` (168KB) and `resource/documentation_code.html`                                 | Untracked-looking scratch files that are actually **committed to git**, sitting at the repo root in a folder called `resource` (singular — distinct from the real `features/resources` feature) | Not imported by anything in `app/`, `features/`, or `shared/` — not part of the Next.js build at all. Looks like a leftover reference/scratch dump from earlier design-system work.                                                                                                                                                                                                                                                                                                |
| `ts_errors.log`                                                                                          | Empty (0 lines), committed to git at the repo root                                                                                                                                              | Not read by any script or config; looks like a stray artifact from a past `tsc` run that got committed by accident.                                                                                                                                                                                                                                                                                                                                                                |

**⚠️ One important exception — do NOT delete this one:** `features/capabilities/data/capabilities-data.ts` looks like the same kind of pre-migration file as the three above, but it is **not** dead. It's still actively imported as a live fallback in two components:

- `features/capabilities/components/capability-drawer.tsx` (`DEFAULT_CAPABILITIES_DETAILS`)
- `features/capabilities/components/core-capabilities.tsx` (`DEFAULT_CAPABILITIES_CARDS`)

This is a deliberate defensive pattern (render the hardcoded default if the Sanity fetch returns empty), not leftover cruft. Leave it in place — only remove its import from `scripts/migrate-sanity-data.ts` when that script is deleted.

## 2. Content that's editable in Sanity Studio but never appears on the live site

This is the direct fix for the actual problem you described — content sitting in the CMS that looks live-editable but has zero effect on the site.

### `product.specRows` — fetched, then silently dropped

`sanity/schemaTypes/collections/product.ts` defines two separate spec fields: `specRows` ("Property Specifications List", a simple label/value list) and `specTables` ("Complex Technical Specification Tables"). `sanity/lib/queries.ts`'s `getProductBySlug()` fetches both. But `app/products/[slug]/page.tsx`'s `mapSanityProductToDetail()` — the function that converts the Sanity response into what the product page actually renders — only maps `specTables` through. `specRows` is fetched from the API and then never referenced again; it's simply discarded.

**Practical effect:** if an editor fills in "Property Specifications List" on a product in Studio, publishes it, and checks the live product page, nothing shows up. This is precisely the kind of silent mismatch you flagged.

**Fix (pick one):**

- **Wire it in** (recommended if any products actually use this field) — add a `specs` (or similarly named) prop to `ProductDetailPage`/`ProductDetailTemplate` that renders `specRows` as a simple label/value list, the way `specRow` objects are rendered elsewhere in the schema (e.g. on `project`).
- **Remove the field** if `specTables` alone always covers what the client needs — delete `specRows` from `product.ts`, remove it from the `getProductBySlug` GROQ projection, and check in Studio whether any existing product documents have data in that field before removing it (so no one's real content quietly vanishes).

Either way, don't leave it as-is — right now it's an actively misleading field in the Studio.

### `navigation` and `globalSettings` — the last unwired piece

Per your decision, this gets wired now rather than just documented. Confirmed still true as of this commit: neither `shared/components/layout/site-header.tsx` nor `shared/components/layout/site-footer.tsx` has any Sanity import. Nav links, the "Our Company"/"Capabilities"/"Products" dropdown contents, footer contact names/numbers, the general email, and the social media links are all still hardcoded in those two component files, even though `sanity/schemaTypes/settings/navigation.ts` and `globalSettings.ts` are fully built and `getNavigationSettings()`/`getGlobalSettings()` already exist in `sanity/lib/queries.ts`.

**Steps:**

1. Convert `app/layout.tsx` (or wherever `SiteHeader`/`SiteFooter` are currently rendered) to fetch both singletons server-side and pass them down as props — same pattern as every other page in this codebase now uses.
2. Update `site-header.tsx` to read nav links/dropdown contents from the `navigation` prop instead of its hardcoded arrays (`companySubLinks`, `capabilitySubLinks`, `productSubLinks`, `navLinksBeforeProducts`/`navLinksAfterProducts`), falling back to the current hardcoded values if the Sanity doc is empty (same defensive pattern used elsewhere).
3. Update `site-footer.tsx` to read contacts/email/social links from the `globalSettings` prop the same way.
4. While doing this, get the client's **real** social media handles — `features/contact/components/contact-details.tsx` currently links to bare `linkedin.com`/`instagram.com`/`facebook.com` with no company-specific path, flagged as an open item since the very first scope doc and still unresolved.
5. Confirm `app/api/revalidate/route.ts`'s existing `navigation`/`globalSettings` case (`revalidatePath('/', 'layout')`) actually fires when either singleton is published, so nav/footer edits show up sitewide within seconds like everything else.

## 3. Internal dev pages shipped to production

`/design-system` and `/docs` are both live, public routes at `pcenigeria.com/design-system` and `pcenigeria.com/docs`. Neither is linked from `site-header.tsx`, `site-footer.tsx`, or anywhere else in the real site — they're pure internal tooling that happens to be publicly reachable and currently crawlable (nothing in `robots.ts` or per-page metadata excludes them).

Per your decision, keep both routes but stop them from being indexed:

- Add `export const metadata = { robots: { index: false, follow: false } }` to `app/design-system/page.tsx` and `app/docs/page.tsx`.
- Add `/design-system` and `/docs` to the `disallow` list in `app/robots.ts` alongside the existing `/studio/` and `/api/` entries.

One nuance worth flagging separately from the routing decision: `app/design-system/page.tsx` is **already disabled** — it currently renders a plain "Design System (Temporarily Disabled)" placeholder with the real import commented out:

```tsx
// import DesignPage from "@/features/design-system/pages/design-page";
```

That means the entire `features/design-system/` folder — 196KB across ~20 files (`design-showcase.tsx`, and 15 separate `*-showcase.tsx` files for buttons, cards, colors, typography, etc.) — is dead code right now regardless of what happens to the route. Since the page isn't rendering any of it, this is a good candidate to delete outright even while keeping the placeholder route + noindex tag. If there's a chance you'll want the component showcase back later, say so and I'll suggest archiving it instead of deleting it — otherwise it's 196KB of unused code sitting behind a commented-out import.

`/docs` (`features/docs/`, 48KB) is fully live and rendering — just noindex it per your decision, no code changes needed there beyond the metadata/robots additions above.

## 4. Suggested order of operations for the agent

1. **Delete the confirmed dead code** (§1) — lowest risk, no behavior change on the live site since none of it renders today. Run `npm run build` afterward to confirm nothing still references the deleted files (TypeScript will catch any missed import immediately).
2. **Resolve `product.specRows`** (§2) — either wire it in or remove it from the schema; check existing product documents in Studio first either way.
3. **Wire navigation + globalSettings** (§2) — the header/footer change, done carefully since it touches every page. Test nav dropdowns and footer content on every page type afterward.
4. **Noindex `/design-system` and `/docs`, delete the unused design-system component code** (§3).
5. **Rebuild and do a full click-through**: every nav link, every dropdown, the footer, and one page of each type (home, a project, a product, a news article, resources, contact) — confirm nothing broke and nothing regressed.

## 5. What I did _not_ touch or recommend touching

- `public/pictures/**` — a quick pass found roughly 155 image files against ~123 distinct paths referenced directly in code, but many pages now pull images from Sanity's CDN instead of local paths, and some local paths are still built dynamically (template literals), which a static search can miss and would falsely flag as "unused." This needs a more careful pass than fits here — happy to do it as a dedicated follow-up if you want the storage cleaned up too, since getting it wrong means deleting a photo that's actually still shown somewhere.
- `sanity/schemaTypes/collections/project.ts` — checked closely since the old projects tab structure (`nigeria`/`international`) was replaced with `country`/`isBpds`/`category`; the schema is already clean, no legacy fields left over here.
- `features/home/components/overview.tsx` and `homePage.glanceStats` — checked closely since the "PCE at a glance" stat cards were consolidated from 4 to 3 per earlier client feedback; confirmed this is correctly wired end-to-end (the component maps whatever's in the Sanity array), so there's no ghost stat data sitting unused here.

---

_Compiled from a direct read of `sanity/`, `app/`, `features/`, and `shared/` in `Projects/pce` at commit `0f7c0a4`, cross-checked with `git log` for what's changed since the last review and `madge --orphans` for an independent pass at unreferenced files._
