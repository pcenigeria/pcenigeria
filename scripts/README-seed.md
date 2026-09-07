# Seeding Sanity with the site's existing content

## What this does

Every page on this site was originally built with real, finished copy and
real photography hardcoded directly into the React components (as
`DEFAULT_*` constants). A Sanity Studio was wired on top later so an editor
*could* override that content, but nobody has ever actually typed anything
into Sanity yet — every relevant Sanity document is empty, and the whole
site is currently running entirely on those hardcoded defaults.

`scripts/seed-sanity.mjs` is a one-time script that copies that
already-live content (text and the ~150 photos already sitting in
`public/pictures/**`) into Sanity as real documents, so it becomes visible
and editable inside Studio going forward — without anyone re-typing it by
hand.

It touches:

- The 10 singleton page documents: `homePage`, `companyPage`,
  `capabilitiesPage`, `projectsPage`, `productsPage`, `newsInsightsPage`,
  `safetyQualityPage`, `contactPage`, `equipmentPage`, `resourcesPage`.
- 5 new `equipmentCategory` documents (one per equipment group shown on
  the live `/equipment-technology` page), which did not exist in Sanity
  before at all.

It does **not** touch `globalSettings`, `navigation`, individual `project`
documents, individual `newsArticle` documents, or individual `product`
documents — those are out of scope for this script.

## This is safe to run — it never overwrites anything a human has typed

- For the 10 singleton pages, the script first runs a `createIfNotExists`
  (only creates the empty document shell if it doesn't already exist), then
  a `patch` using Sanity's `setIfMissing` operation for every field.
  `setIfMissing` only writes a field if that field does **not already
  exist** on the document. So if someone has already gone into Studio and
  typed a real headline, swapped a photo, or filled in any field on any of
  these pages, this script will leave that field completely alone — it
  only backfills whatever is still empty.
- For the 5 new `equipmentCategory` documents, the script uses
  `createIfNotExists` with a stable, predictable `_id` (e.g.
  `equipment-category-major`). If a document with that id already exists
  for any reason, Sanity leaves it completely untouched, no matter what's
  in it.
- Nothing is ever deleted, and no mutation in this script ever uses a plain
  `set` on an existing document.

You can run it as many times as you like — after the first successful run,
later runs are effectively no-ops (everything is already there, so
`setIfMissing`/`createIfNotExists` have nothing left to do).

## One-time setup: the write token

Good news — `.env.local` already has a write-capable token saved as
`SANITY_API_READ_AND_WRITE_TOKEN`. The script reads that automatically, so
in the common case there is nothing to set up here at all.

If that token turns out to be missing, expired, or Viewer-only when you
actually run the script (you'll get a clear permission error from Sanity's
API, not a silent failure), get a fresh one:

1. Go to [sanity.io/manage](https://www.sanity.io/manage) and open this
   project.
2. Go to **API → Tokens → Add API token**.
3. Give it a name (e.g. `seed-script`) and set its permission to
   **Editor** — *not* "Viewer", which cannot write.
4. Copy the token Sanity shows you (you only get to see it once).
5. Open `.env.local` in the project root and add a new line:

   ```
   SANITY_API_WRITE_TOKEN=sk_your_token_here
   ```

   (This name takes priority over `SANITY_API_READ_AND_WRITE_TOKEN` if both
   are set.) Do **not** paste this token anywhere else (chat, PRs, commits,
   Slack, etc.) — treat it like a password. `.env.local` is already
   git-ignored.

## Running it

Run these two commands **in order**, from the project root:

```bash
# 1. Dry run first — prints the entire plan (every document, every field,
#    every image that would be uploaded) with NO network calls at all.
#    Safe to run any number of times; nothing is sent to Sanity.
node scripts/seed-sanity.mjs --dry-run

# 2. Review the printed plan. When it looks right, actually seed Sanity:
node scripts/seed-sanity.mjs
```

The real run will:

1. Upload each local image referenced by the plan to Sanity as an image
   asset (skipping any image it already uploaded in a previous run — see
   caching below).
2. Create/patch the 10 singleton pages.
3. Create the 5 `equipmentCategory` documents.
4. Print a summary of what succeeded and what failed. If something fails
   partway through (e.g. a network hiccup), it's safe to just run
   `node scripts/seed-sanity.mjs` again — already-written data is left
   alone and only what's missing gets filled in.

## Image upload caching

Uploading the same local file twice would waste API calls and create
duplicate assets in your Sanity media library. The script keeps a small
cache file at `scripts/.seed-asset-cache.json` mapping each local image
path to the Sanity asset id it was uploaded as. This file is git-ignored —
it's local bookkeeping, not something that needs to be committed or shared.
If you ever want to force a full re-upload, just delete that file.

## Known gaps — schema fields with no live default content to seed

A few schema fields exist in Studio but have no corresponding `DEFAULT_*`
value anywhere in the current React components (usually because the
component that would read that field either doesn't exist yet or never
reads Sanity data for that particular bit of copy). These are left empty
on purpose — there was nothing "already live" to copy in:

- `homePage.equipmentSection`, `homePage.ctaSection` — no component on the
  home page currently renders either section.
- `capabilitiesPage.fleetSupportSection` — the "How We Work" component on
  this page takes no props and reads no Sanity data at all.
- `contactPage.formSection`, `newsInsightsPage.articlesSection`,
  `productsPage.catalogSection`, `projectsPage.gridSection`,
  `resourcesPage.downloadsSection` — optional intro blocks with no
  `DEFAULT_*` fallback text in their components.
- `safetyQualityPage.safetySection`'s 4 process cards and 2 hardcoded
  images, and `safetyQualityPage.futureSection`'s 2 cards — these render
  unconditionally in their components regardless of Sanity content, so
  there's no field they can be seeded into without changing the
  components themselves.

None of this blocks the seed — it just means those specific spots will
still show their hardcoded fallback text until someone either adds the
missing Sanity wiring in the component or types the content directly into
Studio.
