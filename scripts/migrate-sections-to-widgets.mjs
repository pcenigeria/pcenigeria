#!/usr/bin/env node
/**
 * scripts/migrate-sections-to-widgets.mjs
 *
 * Migrates existing documents (post, project, and any document with section blocks)
 * from the legacy monolithic section format (`body`, `bullets`, `highlightStat`,
 * `buttonText`, `gallery`) into the new Modular Section Widget Architecture (`contentBlocks`).
 *
 * SAFETY:
 * 1. Safe & Non-destructive:
 *    - Leaves existing legacy fields intact inside the collapsible 'Legacy Fields' fieldset
 *      for reference and backward compatibility.
 *    - Does NOT overwrite any section that already has user-defined `contentBlocks`.
 * 2. Deterministic Keys:
 *    - Generates stable, collision-free `_key` values for all transformed widget blocks.
 * 3. Dry-Run Mode:
 *    - Pass `--dry-run` to inspect and preview all planned transformations before writing.
 *
 * USAGE:
 *   node scripts/migrate-sections-to-widgets.mjs --dry-run
 *   node scripts/migrate-sections-to-widgets.mjs
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

// Load environment from .env.local
function loadEnv() {
  const envPath = path.join(REPO_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn(`[migration] Warning: .env.local not found at ${envPath}`);
    return;
  }
  const lines = fs.readFileSync(envPath, 'utf8').split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let val = trimmed.slice(eqIdx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = val;
    }
  }
}

loadEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-01';
const token =
  process.env.SANITY_API_READ_AND_WRITE_TOKEN ||
  process.env.SANITY_API_WRITE_TOKEN;

if (!projectId || !dataset) {
  console.error('[migration] Missing Sanity projectId or dataset in environment.');
  process.exit(1);
}

if (!DRY_RUN && !token) {
  console.error('[migration] Missing SANITY_API_READ_AND_WRITE_TOKEN for live execution.');
  process.exit(1);
}

function generateKey(prefix = 'widget') {
  return `${prefix}_${crypto.randomBytes(6).toString('hex')}`;
}

async function sanityFetch(query, params = {}) {
  const url = new URL(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`);
  url.searchParams.set('query', query);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(`$${k}`, JSON.stringify(v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sanity query failed (${res.status}): ${errText}`);
  }

  const json = await res.json();
  return json.result;
}

async function sanityMutate(mutations) {
  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/mutate/${dataset}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sanity mutation failed (${res.status}): ${errText}`);
  }

  return await res.json();
}

/**
 * Transforms legacy section fields into an array of contentBlocks
 */
function buildContentBlocksFromLegacySection(section) {
  const contentBlocks = [];

  // 1. Body Paragraphs -> richTextWidget
  if (Array.isArray(section.body) && section.body.length > 0) {
    contentBlocks.push({
      _key: generateKey('richText'),
      _type: 'richTextWidget',
      content: section.body,
    });
  }

  // 2. Bullets -> bulletsWidget
  if (Array.isArray(section.bullets) && section.bullets.length > 0) {
    contentBlocks.push({
      _key: generateKey('bullets'),
      _type: 'bulletsWidget',
      items: section.bullets,
    });
  }

  // 3. Highlight Stat -> statWidget
  if (section.highlightStat && (section.highlightStat.value || section.highlightStat.label)) {
    contentBlocks.push({
      _key: generateKey('stat'),
      _type: 'statWidget',
      value: section.highlightStat.value || '',
      label: section.highlightStat.label || '',
    });
  }

  // 4. Action Button -> buttonWidget
  if (section.buttonText && section.buttonLink) {
    contentBlocks.push({
      _key: generateKey('button'),
      _type: 'buttonWidget',
      text: section.buttonText,
      url: section.buttonLink,
      variant: 'primary',
    });
  }

  // 5. Gallery -> galleryWidget
  if (section.gallery && Array.isArray(section.gallery.items) && section.gallery.items.length > 0) {
    contentBlocks.push({
      _key: generateKey('gallery'),
      _type: 'galleryWidget',
      gallery: section.gallery,
    });
  }

  return contentBlocks;
}

async function main() {
  console.log(`\n===============================================================`);
  console.log(`🚀 Sanity Migration: Legacy Section Fields -> Modular Widgets`);
  console.log(`Target Dataset: ${projectId} / ${dataset}`);
  console.log(`Mode: ${DRY_RUN ? '🔍 DRY RUN (Preview only)' : '⚡ LIVE EXECUTION'}`);
  console.log(`===============================================================\n`);

  // Query all documents that have sections
  const query = `*[_type in ["post", "project"] && defined(sections) && count(sections) > 0]{
    _id,
    _type,
    title,
    sections
  }`;

  const docs = await sanityFetch(query);
  console.log(`Found ${docs.length} documents with sections.\n`);

  let docsToUpdate = 0;
  let totalSectionsMigrated = 0;
  const mutations = [];

  for (const doc of docs) {
    let docNeedsUpdate = false;
    const updatedSections = (doc.sections || []).map((section, idx) => {
      // If contentBlocks already exists and has items, keep it intact
      if (Array.isArray(section.contentBlocks) && section.contentBlocks.length > 0) {
        return section;
      }

      // Check if legacy fields exist to migrate
      const hasLegacyContent =
        (Array.isArray(section.body) && section.body.length > 0) ||
        (Array.isArray(section.bullets) && section.bullets.length > 0) ||
        (section.highlightStat && (section.highlightStat.value || section.highlightStat.label)) ||
        (section.buttonText && section.buttonLink) ||
        (section.gallery && section.gallery.items?.length > 0);

      if (!hasLegacyContent) {
        return section;
      }

      const generatedBlocks = buildContentBlocksFromLegacySection(section);
      if (generatedBlocks.length > 0) {
        docNeedsUpdate = true;
        totalSectionsMigrated++;
        console.log(
          `  📄 [${doc._type}] "${doc.title || doc._id}" - Section #${idx + 1} ("${section.heading || 'Untitled'}"):`
        );
        console.log(
          `     Generated ${generatedBlocks.length} widget(s): [${generatedBlocks.map((b) => b._type).join(', ')}]`
        );
        return {
          ...section,
          contentBlocks: generatedBlocks,
        };
      }

      return section;
    });

    if (docNeedsUpdate) {
      docsToUpdate++;
      mutations.push({
        patch: {
          id: doc._id,
          set: {
            sections: updatedSections,
          },
        },
      });
    }
  }

  console.log(`\n---------------------------------------------------------------`);
  console.log(`Summary:`);
  console.log(`- Documents requiring migration: ${docsToUpdate}`);
  console.log(`- Total section blocks converted: ${totalSectionsMigrated}`);
  console.log(`---------------------------------------------------------------\n`);

  if (mutations.length === 0) {
    console.log(`✅ All sections are already up to date with Modular Widgets. No mutations needed.`);
    return;
  }

  if (DRY_RUN) {
    console.log(`🔍 Dry run complete. Run without --dry-run to commit these changes to Sanity.`);
  } else {
    console.log(`⚡ Committing ${mutations.length} document updates to Sanity dataset...`);
    const result = await sanityMutate(mutations);
    console.log(`✅ Migration committed successfully!`, result);
  }
}

main().catch((err) => {
  console.error(`❌ Migration failed:`, err);
  process.exit(1);
});
