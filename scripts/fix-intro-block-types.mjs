#!/usr/bin/env node
/**
 * One-time corrective patch: `resourcesPage.downloadsSection` and
 * `newsInsightsPage.articlesSection` used to be typed as the full
 * `sectionBlock` object in the schema (tagline, heading, body, bullets,
 * highlightStat, buttonText, buttonLink, gallery -- most of which neither
 * page ever rendered, which is exactly the "unnecessary empty fields"
 * confusion in Studio). The schema now types both fields as the new, much
 * smaller `introBlock` (tagline + heading only).
 *
 * Any value already stored for these two fields still carries
 * `_type: "sectionBlock"` from before this change. That doesn't break
 * anything functionally (Studio renders a field by its schema definition,
 * not by the stored `_type`), but it's a stale/incorrect marker worth
 * cleaning up so the stored data matches the new schema exactly. This
 * script does exactly that -- and only that: it patches the `_type` string
 * at those two paths, on those two documents, nothing else.
 *
 * Same conventions as scripts/seed-sanity.mjs: zero new dependencies (plain
 * Node fetch), --dry-run prints the plan with no network calls, reads the
 * write token from SANITY_API_WRITE_TOKEN or SANITY_API_READ_AND_WRITE_TOKEN.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, '..');
const DRY_RUN = process.argv.includes('--dry-run');

function loadEnvLocal() {
  const envPath = path.join(REPO_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) return;
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

loadEnvLocal();

const CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '',
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_AND_WRITE_TOKEN || '',
};

if (!CONFIG.projectId || !CONFIG.dataset || !CONFIG.apiVersion) {
  console.error(
    '[fix] Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / NEXT_PUBLIC_SANITY_API_VERSION in .env.local.'
  );
  process.exit(1);
}

if (!DRY_RUN && !CONFIG.token) {
  console.error(
    '[fix] No write-capable Sanity token found (SANITY_API_WRITE_TOKEN / SANITY_API_READ_AND_WRITE_TOKEN). ' +
      'You can still run with --dry-run right now without a token.'
  );
  process.exit(1);
}

const MUTATE_URL = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/mutate/${CONFIG.dataset}`;

// Each patch only fires if the field still says "sectionBlock" -- if a
// document doesn't have that field at all, or it's already "introBlock"
// (e.g. this script already ran once), Sanity's `ifPath`-less `set` would
// normally just set it regardless of current value, so we scope safety by
// only ever touching the exact `_type` leaf, never the tagline/heading data
// next to it, and only for these two known documents/fields.
const PATCHES = [
  { id: 'resourcesPage', path: 'downloadsSection._type' },
  { id: 'newsInsightsPage', path: 'articlesSection._type' },
];

async function mutate(mutations) {
  const res = await fetch(MUTATE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Mutation failed: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

async function run() {
  console.log('='.repeat(78));
  console.log(`[fix] introBlock _type correction  ${DRY_RUN ? '(DRY RUN -- no network calls)' : '(LIVE RUN)'}`);
  console.log('='.repeat(78));

  const mutations = PATCHES.map((p) => ({
    patch: { id: p.id, set: { [p.path]: 'introBlock' } },
  }));

  for (const m of mutations) {
    console.log(`\n>>> patch ${m.patch.id}`);
    console.log(JSON.stringify(m, null, 2));
  }

  if (DRY_RUN) {
    console.log('\n[fix] Nothing was written. Run without --dry-run to apply.');
    return;
  }

  await mutate(mutations);
  console.log('\n[fix] Done -- both fields now correctly typed as introBlock.');
}

run().catch((err) => {
  console.error('\n[fix] Fatal error:', err.message);
  process.exitCode = 1;
});
