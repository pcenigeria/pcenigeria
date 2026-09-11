#!/usr/bin/env node
/**
 * scripts/seed-sanity.mjs
 *
 * One-time seed script that pushes the site's already-live, hardcoded
 * DEFAULT_* copy and the real photography already sitting in public/pictures
 * into Sanity as real, editable documents.
 *
 * WHY THIS EXISTS
 * Every page on this site was built with real copy + real photos hardcoded
 * directly into React components (a `sanityField || DEFAULT_X` fallback
 * pattern). A Sanity Studio was wired on top later, but nobody has ever
 * typed anything into it, so every Sanity document is currently empty and
 * the whole site runs entirely on those hardcoded defaults. This script
 * copies that already-live content into Sanity so it becomes visible and
 * editable in Studio, without anyone re-typing it by hand.
 *
 * SAFETY
 * - Singleton page documents (homePage, companyPage, ...) are touched with
 *   `createIfNotExists` (only creates the doc shell if missing) followed by
 *   a `patch` that uses `setIfMissing` for every field. `setIfMissing` only
 *   writes a field if the document does not already have it, so if a human
 *   has already typed real content into Studio for a page, none of that
 *   content is touched or overwritten by this script.
 * - New collection documents (equipmentCategory, one per equipment group)
 *   are created with `createIfNotExists` using a stable, deterministic
 *   `_id`. If a document with that id already exists (regardless of its
 *   content) Sanity leaves it completely alone.
 * - Nothing is ever deleted and no existing field is ever overwritten.
 *
 * USAGE
 *   node scripts/seed-sanity.mjs --dry-run   # print the full plan, no network calls
 *   node scripts/seed-sanity.mjs             # actually write to Sanity
 *
 * See scripts/README-seed.md for the write-token setup you need before
 * running this for real.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const DRY_RUN = process.argv.includes('--dry-run');

// ---------------------------------------------------------------------------
// Tiny .env.local loader (no `dotenv` dependency, per project constraints).
// Real environment variables already set in the shell always win.
// ---------------------------------------------------------------------------
function loadEnvLocal() {
  const envPath = path.join(REPO_ROOT, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.warn(`[seed] Warning: no .env.local found at ${envPath}`);
    return;
  }
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    // Strip a single layer of surrounding quotes, if present.
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) {
      process.env[key] = value;
    }
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
    '[seed] Missing NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / ' +
      'NEXT_PUBLIC_SANITY_API_VERSION. These are read from .env.local (or the real ' +
      'environment) and are required even for --dry-run so the printed plan reflects ' +
      'reality.'
  );
  process.exit(1);
}

if (!DRY_RUN && !CONFIG.token) {
  console.error(
    '[seed] No write-capable Sanity token found.\n' +
      '       Looked for SANITY_API_WRITE_TOKEN and SANITY_API_READ_AND_WRITE_TOKEN in\n' +
      '       .env.local -- neither is set. Add a token with WRITE access (an "Editor"\n' +
      '       token from sanity.io/manage -> your project -> API -> Tokens) as either\n' +
      '       name in .env.local, e.g.:\n\n' +
      '           SANITY_API_WRITE_TOKEN=sk...\n\n' +
      '       then re-run. See scripts/README-seed.md for the full walkthrough.\n' +
      '       (You can still run with --dry-run right now without a token.)'
  );
  process.exit(1);
}

const MUTATE_URL = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/mutate/${CONFIG.dataset}`;
const ASSET_UPLOAD_URL = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/assets/images/${CONFIG.dataset}`;

// ---------------------------------------------------------------------------
// Small helpers
// ---------------------------------------------------------------------------

function randKey() {
  return Math.random().toString(36).slice(2, 10);
}

/** Converts one paragraph string, or an array of paragraph strings, into an
 * array of Portable Text block objects for a `blockContent` field. */
function toPortableText(paragraphs) {
  const list = Array.isArray(paragraphs) ? paragraphs : [paragraphs];
  return list
    .filter((p) => typeof p === 'string' && p.trim().length > 0)
    .map((text) => ({
      _type: 'block',
      _key: randKey(),
      style: 'normal',
      children: [
        {
          _type: 'span',
          _key: randKey(),
          text,
          marks: [],
        },
      ],
      markDefs: [],
    }));
}

/** Sentinel placeholder for "this field should become an uploaded Sanity
 * image asset reference, sourced from this local public/ path". Resolved
 * to a real {_type:'image', asset:{...}} object right before mutations are
 * sent (or printed as a readable tag in --dry-run). */
function IMG(publicPath) {
  return { __img: publicPath };
}

function isImgPlaceholder(node) {
  return !!node && typeof node === 'object' && typeof node.__img === 'string' && Object.keys(node).length === 1;
}

/** Walks an arbitrary plan value (objects/arrays) and collects every unique
 * local image path referenced via IMG(). */
function collectImagePaths(node, set) {
  if (!node || typeof node !== 'object') return;
  if (isImgPlaceholder(node)) {
    set.add(node.__img);
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) collectImagePaths(item, set);
    return;
  }
  for (const key of Object.keys(node)) collectImagePaths(node[key], set);
}

/** Deep-clones a plan value, replacing every IMG() placeholder with a real
 * Sanity image field using the resolved asset id from `pathToAssetId`. */
function resolveImages(node, pathToAssetId) {
  if (!node || typeof node !== 'object') return node;
  if (isImgPlaceholder(node)) {
    const assetId = pathToAssetId.get(node.__img);
    if (!assetId) {
      throw new Error(`No uploaded asset id found for image path "${node.__img}" -- this is a bug in the seed script.`);
    }
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
    };
  }
  if (Array.isArray(node)) {
    return node.map((item) => resolveImages(item, pathToAssetId));
  }
  const out = {};
  for (const key of Object.keys(node)) {
    out[key] = resolveImages(node[key], pathToAssetId);
  }
  return out;
}

/** Renders a plan value to a human-readable JSON string for --dry-run,
 * printing IMG() placeholders as a readable tag instead of raw JSON. */
function planToPrintableString(node) {
  const replacer = (_key, value) => {
    if (isImgPlaceholder(value)) {
      return `<<IMAGE: ${value.__img}>>`;
    }
    return value;
  };
  return JSON.stringify(node, replacer, 2).replace(/"<<IMAGE: (.*?)>>"/g, '<< uploaded image asset for $1 >>');
}

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function mimeForPath(p) {
  const ext = path.extname(p).toLowerCase();
  return MIME_BY_EXT[ext] || 'application/octet-stream';
}

// ---------------------------------------------------------------------------
// Asset upload cache (local file path -> uploaded Sanity asset _id), so
// re-running the script after fixing a typo doesn't re-upload images and
// create duplicate Sanity assets.
// ---------------------------------------------------------------------------
const CACHE_PATH = path.join(__dirname, '.seed-asset-cache.json');

function loadCache() {
  if (!fs.existsSync(CACHE_PATH)) return {};
  try {
    return JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8'));
  } catch {
    console.warn(`[seed] Warning: could not parse ${CACHE_PATH}, starting with an empty cache.`);
    return {};
  }
}

function saveCache(cache) {
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n', 'utf8');
}

// =============================================================================
// CONTENT PLAN
//
// Everything below is copied verbatim (or lightly normalized -- e.g. JSX
// stripped to plain text, paragraph arrays converted to Portable Text) from
// the DEFAULT_* constants in the corresponding React components. See the
// component file named in each comment for the source of truth.
// =============================================================================

// --- homePage ---------------------------------------------------------------
// Sources: features/home/components/home-hero.tsx, overview.tsx,
// featured-project.tsx, capabilities.tsx
const HOME_HERO_SLIDES = [
  { src: '/pictures/hero-slider/ob3-construction-team.jpg', alt: 'OB3 River Niger HDD Crossing Completion Team' },
  { src: '/pictures/hero-slider/akk-cover-photo.jpg', alt: 'AKK Pipeline Crossing Project' },
  { src: '/pictures/hero-slider/drilling-rig-cover-photo.jpg', alt: 'Heavy HDD Rig Land-to-Sea Crossing' },
  { src: '/pictures/hero-slider/drilling-rig-03.jpg', alt: 'HDD Drilling Rig Operations & High-Pressure Mud Line' },
  { src: '/pictures/hero-slider/offshore-hdd-project.jpg', alt: 'Offshore HDD Project Operations' },
  { src: '/pictures/hero-slider/highlight.jpg', alt: 'HDD Site Setup & Fluid Equipment Inventory' },
  { src: '/pictures/hero-slider/pipeline-epc-cover-photo.JPG', alt: '52km Pipeline EPC Construction Site' },
  { src: '/pictures/hero-slider/ob3-cover-photo.jpg', alt: 'OB3 River Niger Crossing Site' },
  { src: '/pictures/hero-slider/on-river.jpg', alt: 'Trenchless HDD River Crossing' },
  { src: '/pictures/hero-slider/warehouse-story-yard.jpg', alt: 'PCE Warehouse & Materials Yard' },
];

const HOME_OVERVIEW_GALLERIES = {
  teams: {
    categoryTitle: 'PCE Construction Teams & Field Engineers',
    items: [
      { src: '/pictures/hero-slider/ob3-02-team.jpg', title: 'OB3 HDD River Niger Crossing Construction Team' },
      { src: '/pictures/home-page/engineering-teams-new.jpg', title: 'PCE Nigeria Engineering & Construction Specialist Team' },
      { src: '/pictures/hero-slider/construction-team-02.jpg', title: 'PCE Field Construction Team on Site' },
      { src: '/pictures/hero-slider/ob3-construction-team.jpg', title: 'OB3 Project Construction Team Celebration' },
      { src: '/pictures/hero-slider/team-in-suits.jpg', title: 'PCE Executive & Management Team' },
    ],
  },
  rigs: {
    categoryTitle: 'Nigeria-based HDD Rigs & Pipe-Handling Capability',
    items: [
      { src: '/pictures/hero-slider/drilling-rig-cover-photo.jpg', title: '1200t / 500t Heavy HDD Drilling Rig System' },
      { src: '/pictures/hero-slider/drilling-rig-03.jpg', title: 'HDD Drilling Rig Operations & High-Pressure Mud Line' },
      { src: '/pictures/hero-slider/side-bomb.jpg', title: 'Heavy Pipe-Handling Machine & Boom Capability' },
      { src: '/pictures/hero-slider/excavator.jpg', title: 'Heavy Excavator Fleet & Pipeline Field Support' },
      { src: '/pictures/hero-slider/air-compression.jpg', title: 'High-Pressure Air Compressor System & Site Equipment' },
    ],
  },
  equipment: {
    categoryTitle: 'PCE Equipment & Materials Yard in Nigeria',
    items: [
      { src: '/pictures/equipment/main-equipments-cover-photo.jpg', title: 'PCE Main Equipment & Materials Yard (Aerial View)' },
      { src: '/pictures/equipment/equipment-02.png', title: 'Equipment & Materials Stock in Nigeria Yard' },
      { src: '/pictures/product-image/CMC.jpg', title: 'BRSCMC Drilling Fluid Product Supply' },
      { src: '/pictures/product-image/Bentonite.png', title: 'BRSBENT High-Yield Bentonite Product Supply' },
      { src: '/pictures/equipment/equipment-05.png', title: 'Pipeline Supplies & Materials Stockpile' },
    ],
  },
};

function gallery(categoryTitle, items) {
  return {
    _type: 'gallery',
    ...(categoryTitle ? { categoryTitle } : {}),
    items: items.map((it) => ({
      _key: randKey(),
      _type: 'galleryItem',
      image: IMG(it.src),
      ...(it.title ? { title: it.title } : {}),
    })),
  };
}

const homePageFields = {
  heroTagline: 'HDD & PIPELINE EPC CONTRACTOR',
  heroHeadline: 'HDD Crossing. EPC for Pipeline.',
  heroBullets: [
    'Excellent HDD construction capability',
    'Professional HDD drilling fluid scheme design and product supply capability',
    'Comprehensive pipeline EPC construction capability',
    'Deep buried pipeline detection capability',
  ],
  heroPrimaryBtnText: 'Explore Our Capabilities',
  heroPrimaryBtnLink: '/capabilities',
  heroSecondaryBtnText: 'Start a Project',
  heroSecondaryBtnLink: '/contact',
  heroSlides: gallery(undefined, HOME_HERO_SLIDES),
  glanceTagline: 'PCE AT A GLANCE',
  glanceHeading: 'Specialist People. Field-ready Resources in Nigeria. Proven Capability.',
  glanceStats: [
    {
      _key: randKey(),
      _type: 'statItem',
      number: '150+',
      label: 'People across five specialist construction teams',
      image: IMG('/pictures/hero-slider/ob3-02-team.jpg'),
      gallery: gallery(HOME_OVERVIEW_GALLERIES.teams.categoryTitle, HOME_OVERVIEW_GALLERIES.teams.items),
    },
    {
      _key: randKey(),
      _type: 'statItem',
      number: '1200t/500t/500t',
      label: 'Nigeria-based HDD rig and pipe-handling capability',
      image: IMG('/pictures/hero-slider/drilling-rig-cover-photo.jpg'),
      gallery: gallery(HOME_OVERVIEW_GALLERIES.rigs.categoryTitle, HOME_OVERVIEW_GALLERIES.rigs.items),
    },
    {
      _key: randKey(),
      _type: 'statItem',
      number: '',
      label: 'Equipment & Materials in Nigeria',
      image: IMG('/pictures/equipment/main-equipments-cover-photo.jpg'),
      gallery: gallery(HOME_OVERVIEW_GALLERIES.equipment.categoryTitle, HOME_OVERVIEW_GALLERIES.equipment.items),
    },
  ],
  capabilitiesSection: {
    _type: 'sectionBlock',
    tagline: 'OUR CAPABILITIES',
    heading: 'Connected capability across the pipeline crossing lifecycle.',
    body: toPortableText(
      "From understanding the route to engineering the crossing and delivering the line, PCE combines four specialist capabilities around complex pipeline projects."
    ),
  },
  featuredSection: {
    _type: 'sectionBlock',
    tagline: 'FEATURED PROJECTS • OB3 & AKK RIVER NIGER HDD CROSSINGS',
    heading: 'Across the River Niger. 2 km beneath a critical crossing.',
  },
  // NOTE: homePage schema also defines `equipmentSection` and `ctaSection`
  // (groups 5 & 6), but features/home/pages/home-page.tsx does not render
  // any component that reads either field -- there is no live default
  // content anywhere for them, so nothing is seeded here. See README notes.
};

// --- companyPage -------------------------------------------------------------
// Sources: features/company/components/company-hero.tsx, who-we-are.tsx,
// overview-capabilities.tsx, experience.tsx, our-direction.tsx,
// people-scale.tsx, standards.tsx
const companyPageFields = {
  heroHeadline: 'Built for complex pipeline delivery.',
  heroImage: IMG('/pictures/company/company-hero.jpg'),
  heroSubtext: 'PCE Nigeria provides integrated pipeline construction and EPC services, with specialist capability in Horizontal Directional Drilling.',
  heroSubtext2: 'From early assessment and engineering through construction, pre-commissioning and commissioning, we bring technical expertise and field resources together around demanding pipeline projects.',
  heroPrimaryBtnText: 'Explore Capabilities',
  heroPrimaryBtnLink: '/capabilities',
  whoWeAreSection: {
    _type: 'sectionBlock',
    tagline: 'Who We Are',
    heading: 'Specialist capability for demanding pipeline HDD Crossing and EPC work.',
    body: toPortableText([
      'PCE combines pipeline engineering and construction, specialist HDD capability, deep-pipeline location technology and technical resources to support projects from assessment through execution.',
      'Our approach is guided by safety, quality, efficiency and integrity.',
    ]),
    buttonText: 'Explore Our Projects',
    buttonLink: '/projects',
  },
  whoWeAreImages: [
    { _key: randKey(), image: IMG('/pictures/company/specialist-pipe-2.jpg') },
    { _key: randKey(), image: IMG('/pictures/company/specialist-pipe.jpg') },
  ],
  overviewCapabilitiesSection: {
    _type: 'sectionBlock',
    heading: 'Local delivery capability. Specialist international experience.',
    body: toPortableText(
      'PCE Nigeria works in consortium with Lantic on specialist HDD and pipeline delivery, bringing together local operating knowledge, engineering expertise, equipment resources and international project experience.'
    ),
    buttonText: 'See How We Work',
    buttonLink: '/capabilities',
  },
  deliveryBentoCards: [
    { _key: randKey(), title: 'Local Operating Knowledge', description: 'Project experience and field resources supporting execution in Nigeria.', image: IMG('/pictures/company/ob3-wilding-main-pipeline.jpg') },
    { _key: randKey(), title: 'Specialist HDD Engineering', description: 'Precision directional drilling for complex riverbed, roadway, and shoreline crossings.', image: IMG('/pictures/company/specialist-enginering.jpg') },
    { _key: randKey(), title: 'Integrated Pipeline EPC', description: 'End-to-end execution covering engineering, pipeline fabrication, pre-commissioning, and testing.', image: IMG('/pictures/company/integrated-pipeline-epc.jpg') },
    { _key: randKey(), title: 'Global Consortium Resources', description: 'Combined equipment fleets, materials logistics, and international project support through the Lantic partnership.', image: IMG('/pictures/company/global-resources.jpg') },
  ],
  experienceSection: {
    _type: 'sectionBlock',
    tagline: 'Experience',
    heading: 'Local execution backed by international project experience.',
    body: toPortableText([
      "PCE's project record brings together complex pipeline and HDD experience in Nigeria and international markets.",
      'From major River Niger crossings in Nigeria to pipeline and HDD projects in Thailand and China, that experience informs how we approach difficult geology, critical infrastructure and demanding execution requirements.',
    ]),
    buttonText: 'Explore Our Projects',
    buttonLink: '/projects',
  },
  experienceImage: IMG('/pictures/company/experience.jpg'),
  visionMissionSection: {
    _type: 'sectionBlock',
    tagline: 'Our Direction',
    heading: 'Engineering excellence with a clear ambition.',
    bullets: [
      'To become a globally recognised leader in HDD and pipeline EPC, known for engineering excellence, safe delivery and sustainable practice.',
      'To provide dependable engineering and construction solutions that exceed client expectations through innovation, efficiency and integrity.',
    ],
  },
  peopleScaleSection: {
    _type: 'sectionBlock',
    tagline: 'People & Scale',
    heading: 'The capability starts with the people behind it.',
    body: toPortableText("Specialist expertise, international management experience and field capacity support PCE's pipeline and HDD delivery."),
  },
  peopleScaleStats: [
    { _key: randKey(), _type: 'statItem', number: '150+', label: 'People across five construction teams' },
    { _key: randKey(), _type: 'statItem', number: '8', label: 'HDD experts' },
    { _key: randKey(), _type: 'statItem', number: '20+', label: 'International management personnel' },
    { _key: randKey(), _type: 'statItem', number: '10+', label: 'Technicians' },
    { _key: randKey(), _type: 'statItem', number: '24+', label: 'Operations staff' },
  ],
  standardsSection: {
    _type: 'sectionBlock',
    tagline: 'Standards & Responsibility',
    heading: 'Delivery guided by safety, quality and responsibility.',
    body: toPortableText([
      "PCE's registrations, certifications and operating standards support compliant execution across the project lifecycle.",
      'Our approach places safety, environmental care and social responsibility alongside technical performance and delivery.',
    ]),
    bullets: ['NMDPRA', 'ISO', 'Technical Certification'],
    buttonText: 'Explore Safety & Quality',
    buttonLink: '/safety-quality-responsibility',
  },
  standardsImage: IMG('/pictures/company/standards.jpg'),
};

// --- capabilitiesPage --------------------------------------------------------
// Sources: features/capabilities/components/capabilities-hero.tsx,
// core-capabilities.tsx, our-approach.tsx
const capabilitiesPageFields = {
  heroHeadline: 'Integrated capability for complex pipeline delivery.',
  heroSubtext: 'PCE combines specialist HDD, pipeline EPC, deep-pipeline location technology and technical resources around demanding pipeline projects.',
  heroSubtext2: 'From early assessment and engineering through construction, testing and commissioning, our capabilities are built around the requirements of the route, the crossing and the line.',
  heroImage: IMG('/pictures/capabilities/hero-image.jpg'),
  coreCapabilitiesSection: {
    _type: 'sectionBlock',
    tagline: 'OUR CAPABILITIES',
    heading: 'Four Capabilities. One Project Objective.',
  },
  approachSection: {
    _type: 'sectionBlock',
    tagline: 'Our Approach',
    heading: 'The route, the crossing and the line considered together.',
    body: toPortableText(
      "Complex pipeline projects rarely depend on one discipline. Ground conditions affect engineering. Engineering determines equipment. Equipment affects execution. And every stage must work within the project's safety, quality and programme requirements. PCE brings these considerations together from assessment through delivery."
    ),
    buttonText: 'Explore Our Projects',
    buttonLink: '/projects',
    gallery: {
      _type: 'gallery',
      items: [{ _key: randKey(), _type: 'galleryItem', image: IMG('/pictures/company/pipeline.jpg') }],
    },
  },
  // NOTE: capabilitiesPage schema also defines `fleetSupportSection`
  // (group 4, "Technical Fleet & Support"), but
  // features/capabilities/pages/capabilities-page.tsx renders <HowWeWork />
  // with no props at all -- it has no `section` prop and reads no Sanity
  // data. There is no live default content for this field, so it is left
  // unseeded. See README notes.
};

// --- contactPage ---------------------------------------------------------
// Sources: features/contact/pages/contact-page.tsx,
// features/contact/components/contact-details.tsx
const contactPageFields = {
  heroHeadline: 'Start with what you know.',
  heroSubtext:
    'You do not need a complete technical scope before speaking with PCE. Whether the project is at an early assessment stage or already moving toward execution, share the information currently available and our team can help identify what is needed next.',
  contactPersons: [
    { _key: randKey(), _type: 'contactPerson', name: 'Wan Yang', phone: '+234 707 412 6596', email: 'wanyang@pcenigeria.com' },
    { _key: randKey(), _type: 'contactPerson', name: 'Xu Liangkui', phone: '+234 701 373 2816', email: 'xuliangkui@pcenigeria.com' },
  ],
  abujaOffice: 'House 45, Nelson Mandela Street, Asokoro, Abuja, Nigeria',
  lagosOffice: 'HyGroup Place 6 Ojulari Street, off Kusenla Road Ikate, Elegushi, Lekki, Lagos',
  portHarcourtBase: 'East–West Road Opposite New Onne Link Road Ebubu, Eleme, Rivers State',
  generalEmail: 'info@pcenigeria.com',
  // NOTE: `formSection` has no corresponding DEFAULT_* content in any
  // component that was inspected -- left unseeded.
};

// --- equipmentPage + equipmentCategory collection ---------------------------
// Sources: features/equipment/components/et-hero.tsx, support.tsx,
// our-equipments.tsx
const equipmentPageFields = {
  heroHeadline: 'The Right Equipment Changes What Is Possible.',
  heroSubtext: 'PCE deploys large-scale HDD rigs, pipe-handling equipment, drilling-fluid systems, guidance technology and supporting plant for demanding pipeline crossings.',
  heroSubtext2: 'Our resources are selected and configured around the route, ground conditions, pipeline and crossing method.',
  heroPrimaryBtnText: 'Discuss Your Crossing',
  heroImage: IMG('/pictures/equipment/main-equipments-cover-photo.jpg'),
  fleetSection: {
    _type: 'sectionBlock',
    tagline: 'OUR EQUIPMENT',
    heading: 'Large-scale Equipment Configured For Demanding Crossings.',
    body: toPortableText(
      'Successful HDD execution depends on more than rig capacity. It requires the right combination of drilling power, guidance, fluid management, bore-preparation tools and pipe-handling resources. PCE brings these systems together around the requirements of the crossing.'
    ),
  },
  supportSection: {
    _type: 'sectionBlock',
    tagline: 'TECHNICAL SUPPORT',
    heading: 'Equipment backed by HDD expertise.',
    body: toPortableText([
      'The value of specialist equipment depends on how it is selected, configured and used. Support is aligned with project requirements, equipment configuration and availability.',
      'PCE supports HDD requirements with:',
    ]),
    bullets: [
      'Crossing proposals and technical planning',
      'Equipment configuration support',
      'HDD rigs, pumps and recycling systems',
      'Reamers, drill bits and mud motors',
      'Bentonite and specialist additives',
      'Technical execution guidance',
    ],
  },
  supportImages: [
    { _key: randKey(), _type: 'galleryItem', image: IMG('/pictures/equipment/91903d3f483647597b5364f08e4e7007.jpg') },
    { _key: randKey(), _type: 'galleryItem', image: IMG('/pictures/equipment/e4718ab6567102f62eba9b2f0406e17f.jpg') },
    { _key: randKey(), _type: 'galleryItem', image: IMG('/pictures/home-page/equipment-08.jpg') },
  ],
};

// DEFAULT_CATEGORIES from features/equipment/components/our-equipments.tsx.
// Each becomes one brand-new `equipmentCategory` document (createIfNotExists
// with a full body, per the "new collection document" rule -- these did not
// exist as Sanity documents before, there's nothing to patch).
const EQUIPMENT_CATEGORIES = [
  {
    id: 'major',
    name: 'Major HDD equipment',
    tagline: 'DRILL & HANDLE',
    description: 'Drilling and pipe-handling capacity for demanding crossings.',
    items: [
      { id: 'xcmg-500', number: '01', title: 'XCMG 500-ton HDD Rig', description: 'High-capacity HDD equipment for demanding crossing requirements.', image: '/pictures/equipment/xcmg-500.jpg' },
      { id: 'gd-5000', number: '02', title: 'GD-5000L HDD Rig', description: 'Large-scale drilling capacity for specialist HDD operations.', image: '/pictures/equipment/gd-5000.jpg' },
      { id: 'gd-12000', number: '03', title: 'GD-12000L HDD Rig', description: 'Heavy-duty drilling capacity for major HDD installations.', image: '/pictures/equipment/gd-12000l-hdd-rig.jpg' },
      { id: 'pipe-handle', number: '04', title: '500-ton Pipe-Handling Machine', description: 'Pipe-handling capacity to support controlled pipeline movement during installation and pullback.', image: '/pictures/home-page/pipe-handling-capacity.jpg' },
    ],
  },
  {
    id: 'fluid',
    name: 'Drilling-Fluid Systems',
    tagline: 'MIX & CIRCULATE',
    description: 'Manage the fluid. Protect the bore.',
    subtext: 'Drilling-fluid performance is a critical part of HDD execution. PCE maintains mud systems, pumps, tanks and specialist materials to support drilling, bore preparation and pullback operations.',
    items: [
      { id: 'triplex-pump', number: '01', title: '4 Mud Systems', description: 'High-capacity mud mixing and agitation units.', image: '/pictures/home-page/equipment-03.jpg' },
      { id: 'mixing-plant', number: '02', title: '6 Mud-Pump Sets', description: 'High-pressure triplex mud pumps for continuous fluid circulation.', image: '/pictures/equipment/equipment-03.png' },
      { id: 'recycler', number: '03', title: '16 Mud Tanks', description: 'Closed-loop solids control and mud recycling tanks.', image: '/pictures/home-page/equipment-04.jpg' },
      { id: 'storage-tanks', number: '04', title: '2000+ Bentonite Resources', description: 'High-yield API bentonite and polymer reserves on site.', image: '/pictures/equipment/389706f272e7f4d1bcf7d0d033cbbbde.jpg' },
    ],
  },
  {
    id: 'bore',
    name: 'Drilling & Bore-Preparation Tools',
    tagline: 'REAM & TOOL',
    description: 'Build the bore for the pipeline that follows.',
    subtext: "PCE's HDD resources include the drilling and bore-preparation tools required across pilot drilling, reaming and pullback.",
    items: [
      { id: 'rock-reamer', number: '01', title: 'Reamers', description: 'Tools configured for progressive bore enlargement according to pipeline and ground requirements.', image: '/pictures/home-page/equipment-05.jpg' },
      { id: 'drill-pipes', number: '02', title: 'Drilling Rods', description: '7km+ of drilling rods supporting HDD operations.', image: '/pictures/equipment/equipment-05.png' },
      { id: 'mud-motor', number: '03', title: 'Drill Bits & Mud Motors', description: 'Specialist tools supporting drilling across project-specific ground conditions.', image: '/pictures/hero-slider/air-compression.jpg' },
      { id: 'barrel-reamer', number: '04', title: 'Ramming Hammer', description: 'Additional support for demanding pipeline installation requirements.', image: '/pictures/home-page/horizontal-drilling-new.jpg' },
    ],
  },
  {
    id: 'pipe',
    name: 'Pipe Movement & Support',
    tagline: 'PULL & ROLL',
    description: 'Control the pipeline through pullback.',
    subtext: 'Pipeline installation requires coordinated handling and support as the prepared pipe string moves toward and through the bore.',
    items: [
      { id: 'roller-cradles', number: '01', title: '100+ Pipeline Rollers', description: 'Heavy-duty roller cradles reducing friction during pipe insertion.', image: '/pictures/equipment/e0dba7ab00c50a9163fa9f704bcc28dd.jpg' },
      { id: 'breakout-jaws', number: '02', title: '2 Side Booms', description: 'High-capacity Caterpillar sidebooms for heavy pipe string positioning.', image: '/pictures/hero-slider/side-bomb.jpg' },
      { id: 'sidebooms', number: '03', title: '5 Excavators', description: 'Heavy track excavators for earthworks and trench prep.', image: '/pictures/home-page/equipment-06.jpg' },
      { id: 'pull-heads', number: '04', title: 'One 500-ton pipe-handling machine', description: 'Synchronized push-pull machine assisting long-distance pullbacks.', image: '/pictures/home-page/pipe-handling-capacity.jpg' },
    ],
  },
  {
    id: 'guidance',
    name: 'Guidance Technology',
    tagline: 'TRACK & ALIGN',
    description: 'Precision beneath the surface.',
    subtext: 'Controlled HDD execution depends on knowing where the bore is—and keeping it aligned with the engineered path.',
    items: [
      { id: 'guidance-walkover', number: '01', title: '3 ParaTrack 2 systems', description: 'Magnetic steering guidance tool for complex river crossings.', image: '/pictures/home-page/equipment-07.jpg' },
      { id: 'guidance-gyro', number: '02', title: '3 F5 walkover systems', description: 'Digital walkover guidance systems for shallow and medium depth bores.', image: '/pictures/hero-slider/bpds-cover-photo.png' },
    ],
  },
];

function buildEquipmentCategoryDoc(cat) {
  return {
    _id: `equipment-category-${cat.id}`,
    _type: 'equipmentCategory',
    name: cat.name,
    slug: { _type: 'slug', current: cat.id },
    tagline: cat.tagline,
    description: cat.description,
    ...(cat.subtext ? { subtext: cat.subtext } : {}),
    items: cat.items.map((item) => ({
      _key: randKey(),
      _type: 'object',
      id: item.id,
      number: item.number,
      title: item.title,
      description: item.description,
      image: IMG(item.image),
    })),
  };
}

// --- newsInsightsPage --------------------------------------------------------
// Source: features/news-insights/components/news-hero.tsx
const newsInsightsPageFields = {
  heroHeadline: 'Engineering updates, case studies & Industry news.',
  heroSubtext: "Stay informed with PCE Nigeria's latest HDD operational milestones, pipeline EPC innovations, technical articles, and regulatory sector insights.",
  // NOTE: `articlesSection` has no DEFAULT_* content in news-cards.tsx --
  // it's rendered only when tagline/heading are present, with no fallback
  // text. Left unseeded.
};

// --- productsPage -------------------------------------------------------------
// Sources: features/products/components/products-hero.tsx,
// stock-logistics.tsx, performance-matrix.tsx, products-cta.tsx
const productsPageFields = {
  // NOTE: products-hero.tsx's own DEFAULT_HEADLINE / DEFAULT_SUBTEXT differ
  // from productsPage.ts's schema `initialValue` text -- the component
  // default (what's actually live on the page) is used here, per the task
  // instructions that DEFAULT_* component constants are the source of truth.
  heroHeadline: 'Brighter Star Drilling Fluids',
  heroSubtext: 'Engineered for HDD · Made for Results',
  heroBullets: ['Competitive Pricing', 'Guaranteed Quality', 'Ample Stock', 'The First Choice for HDD'],
  // NOTE: `catalogSection` has no DEFAULT_* tagline/heading in
  // product-cards-grid.tsx (only individual `product` documents, which are
  // out of scope) -- left unseeded.
  logisticsSection: {
    _type: 'sectionBlock',
    heading: 'Ample Standing Stock in Nigeria',
    body: toPortableText(
      'Brighter Star maintains a large standing inventory of drilling fluid materials inside Nigeria. Whatever your programme — bentonite, CMC, MMH, clay viscosity reducer or xanthan gum — the products you need are already in-country, palletised and ready for immediate dispatch.'
    ),
  },
  matrixSection: {
    _type: 'sectionBlock',
    tagline: 'Performance Matrix',
    heading: 'Technical Specification & Performance Comparison',
    body: toPortableText('Compare physical properties, rheology modifications, filtration control, and environmental ratings across the five Brighter Star products:'),
  },
  ctaSection: {
    _type: 'sectionBlock',
    tagline: 'Brighter Star Drilling Fluids',
    heading: 'When the ground gets difficult, choose the products that have already crossed it.',
    bullets: ['Competitive Pricing', 'Guaranteed Quality', 'Ample Stock', 'The First Choice for HDD'],
    buttonText: 'Contact Us / Request a Quote',
    buttonLink: '/contact',
  },
};

// --- projectsPage --------------------------------------------------------
// Sources: features/projects/components/projects-home.tsx, featured-projects.tsx
const projectsPageFields = {
  heroHeadline: 'Complex Crossings. Delivered.',
  heroSubtext:
    "From the River Niger to major international HDD and pipeline projects, PCE's record spans difficult geology, large-diameter pipelines and technically demanding routes. Explore selected projects and the engineering behind them.",
  // NOTE: `heroBullets` and `gridSection` have no DEFAULT_* content in any
  // component that was inspected -- left unseeded.
  featuredSection: {
    _type: 'sectionBlock',
    tagline: 'FEATURED PROJECTS',
    heading: 'Difficult Routes Demand More Than Standard Execution.',
    body: toPortableText(
      'Our project record combines specialist engineering, high-capacity equipment, field experience and technical methods shaped around the conditions of each crossing.'
    ),
  },
};

// --- resourcesPage -------------------------------------------------------
// Source: features/resources/components/resources-hero.tsx
// (Already seeded manually earlier -- included here too since setIfMissing
// makes re-running this harmless and it keeps the script self-contained.)
const resourcesPageFields = {
  heroHeadline: 'Technical materials, datasheets & company literature.',
  heroSubtext: "Access PCE Nigeria's technical specifications, HDD equipment capability brochures, QHSE frameworks, and downloadable project case studies.",
  // NOTE: `downloadsSection` is explicitly documented in its own schema
  // description as optional intro copy with no default -- left unseeded.
};

// --- safetyQualityPage -----------------------------------------------------
// Sources: features/safety-quality/components/safety-hero.tsx, safety.tsx,
// quality.tsx, environmental-care.tsx, certification.tsx, our-future.tsx
const SAFETY_QUALITY_STATS = [
  { title: 'Engineering', description: 'Develop the technical basis, method and execution requirements.' },
  { title: 'Fabrication', description: 'Prepare pipeline components and assemblies according to project requirements.' },
  { title: 'Welding & NDT', description: 'Execute welding and non-destructive testing as part of pipeline construction.' },
  { title: 'Hydrotesting', description: 'Test completed pipeline sections as required before operation.' },
  { title: 'Coating', description: 'Protect pipeline surfaces and completed work according to project requirements.' },
  { title: 'Pre-Commissioning & Commissioning', description: 'Verify and prepare completed systems for handover and operation.' },
];

const safetyQualityPageFields = {
  heroHeadline: 'Dependable execution begins with clear standards.',
  heroImage: IMG('/pictures/safety/safety-hero.jpg'),
  heroSubtext:
    'Safety, quality, efficiency and integrity guide PCE from early assessment through construction, testing and commissioning. Responsible delivery means protecting people, maintaining technical standards and considering the environments and communities around the work.',
  safetySection: {
    _type: 'sectionBlock',
    tagline: 'Safety',
    heading: 'Protecting people through every stage of delivery.',
    body: toPortableText([
      'Complex pipeline work brings people, heavy equipment, technical interfaces and changing field conditions together. PCE places safety across the project lifecycle—from assessment and engineering through mobilisation, construction, testing and commissioning.',
      'Safety is treated as part of how the work is planned and delivered—not as a separate activity at the end.',
    ]),
    // NOTE: safety.tsx's DEFAULT_STATS (the 4 "Understand/Prepare/Maintain/
    // Complete" cards) and its two hardcoded showcase images
    // (/pictures/safety/projection-one.jpg, protection-two.jpg) are not
    // bound to any sectionBlock field in the component -- they render
    // unconditionally regardless of Sanity data, so there is nothing to
    // seed them into. Left unseeded.
  },
  qualitySection: {
    _type: 'sectionBlock',
    tagline: 'QUALITY',
    heading: 'Quality from engineering through testing and handover.',
    body: toPortableText(
      "Pipeline integrity depends on the quality of decisions and workmanship throughout the project lifecycle. PCE's delivery scope incorporates the technical activities required to construct, test and prepare pipeline systems for operation."
    ),
    buttonText: 'EXPLORE PIPELINE EPC',
    buttonLink: '/capabilities',
    // quality.tsx's getStats() reads `section.bullets` and parses
    // "Title — Description" pairs back into the same 6 stat cards when
    // `section.stats` isn't present, so encoding DEFAULT_STATS as bullets
    // here keeps the live page's 2x3 grid intact once wired to Sanity.
    bullets: SAFETY_QUALITY_STATS.map((s) => `${s.title} — ${s.description}`),
  },
  environmentalSection: {
    _type: 'sectionBlock',
    tagline: 'Environmental Care',
    heading: 'Progress beneath the surface. Less disturbance above it.',
    body: toPortableText([
      'Horizontal Directional Drilling allows pipelines to cross beneath rivers, roads and other obstacles without continuous open-cut excavation across the crossing route. For suitable projects, this can reduce direct surface disturbance while enabling the required pipeline connection',
      "Environmental considerations form part of PCE's wider commitment to responsible project delivery.",
    ]),
    buttonText: 'Explore HDD Capability',
    buttonLink: '/capabilities',
  },
  certificationSection: {
    _type: 'sectionBlock',
    tagline: 'STANDARDS & CERTIFICATION',
    heading: 'Supporting compliant project delivery.',
    body: toPortableText([
      "PCE's registrations and certifications support execution across the project lifecycle.",
      'Specific certification details and applicable project documentation should be confirmed with PCE as part of the qualification or project-enquiry process.',
    ]),
    bullets: ['NMDPRA', 'ISO', 'Technical Certification'],
  },
  futureSection: {
    _type: 'sectionBlock',
    heading: 'Sustainable Impact Beyond the Project',
    // NOTE: our-future.tsx's DEFAULT_CARDS (Responsibility / Future
    // Direction) render unconditionally and are never read from
    // `section` at all -- nothing to seed them into. Left unseeded.
  },
};

// =============================================================================
// SINGLETON REGISTRY
// =============================================================================
const SINGLETONS = [
  { id: 'homePage', type: 'homePage', fields: homePageFields },
  { id: 'companyPage', type: 'companyPage', fields: companyPageFields },
  { id: 'capabilitiesPage', type: 'capabilitiesPage', fields: capabilitiesPageFields },
  { id: 'projectsPage', type: 'projectsPage', fields: projectsPageFields },
  { id: 'productsPage', type: 'productsPage', fields: productsPageFields },
  { id: 'newsInsightsPage', type: 'newsInsightsPage', fields: newsInsightsPageFields },
  { id: 'safetyQualityPage', type: 'safetyQualityPage', fields: safetyQualityPageFields },
  { id: 'contactPage', type: 'contactPage', fields: contactPageFields },
  { id: 'equipmentPage', type: 'equipmentPage', fields: equipmentPageFields },
  { id: 'resourcesPage', type: 'resourcesPage', fields: resourcesPageFields },
];

const EQUIPMENT_CATEGORY_DOCS = EQUIPMENT_CATEGORIES.map(buildEquipmentCategoryDoc);

// =============================================================================
// EXECUTION
// =============================================================================

async function uploadImage(publicPath, cache) {
  if (cache[publicPath]) {
    return { assetId: cache[publicPath], cached: true };
  }
  const absPath = path.join(REPO_ROOT, 'public', publicPath.replace(/^\//, ''));
  if (!fs.existsSync(absPath)) {
    throw new Error(`Local image file not found: ${absPath} (referenced as "${publicPath}")`);
  }
  const bytes = fs.readFileSync(absPath);
  const res = await fetch(ASSET_UPLOAD_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONFIG.token}`,
      'Content-Type': mimeForPath(absPath),
    },
    body: bytes,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Image upload failed for ${publicPath}: ${res.status} ${res.statusText} ${text}`);
  }
  const json = await res.json();
  const assetId = json?.document?._id;
  if (!assetId) {
    throw new Error(`Image upload for ${publicPath} did not return an asset id. Response: ${JSON.stringify(json)}`);
  }
  cache[publicPath] = assetId;
  saveCache(cache);
  return { assetId, cached: false };
}

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
  console.log(`[seed] PCE Nigeria -> Sanity content seed  ${DRY_RUN ? '(DRY RUN -- no network calls)' : '(LIVE RUN)'}`);
  console.log('='.repeat(78));
  console.log(`[seed] project: ${CONFIG.projectId || '<unset>'}  dataset: ${CONFIG.dataset || '<unset>'}  apiVersion: ${CONFIG.apiVersion || '<unset>'}`);
  console.log(`[seed] mutate endpoint: ${MUTATE_URL}`);
  console.log(`[seed] asset upload endpoint: ${ASSET_UPLOAD_URL}`);
  console.log('');

  // Collect every unique image path referenced across the whole plan.
  const imagePaths = new Set();
  for (const s of SINGLETONS) collectImagePaths(s.fields, imagePaths);
  for (const d of EQUIPMENT_CATEGORY_DOCS) collectImagePaths(d, imagePaths);
  const sortedImagePaths = [...imagePaths].sort();

  const cache = loadCache();

  console.log('-'.repeat(78));
  console.log(`[seed] IMAGES (${sortedImagePaths.length} unique local files referenced)`);
  console.log('-'.repeat(78));

  const pathToAssetId = new Map();

  if (DRY_RUN) {
    for (const p of sortedImagePaths) {
      const absPath = path.join(REPO_ROOT, 'public', p.replace(/^\//, ''));
      const exists = fs.existsSync(absPath);
      const status = cache[p] ? `already cached -> asset ${cache[p]}` : 'would upload';
      const missing = exists ? '' : '  !! LOCAL FILE MISSING !!';
      console.log(`  ${p}  [${status}]${missing}`);
      // For a readable dry-run plan, pretend we resolved it either to the
      // cached id or to a placeholder describing the pending upload.
      pathToAssetId.set(p, cache[p] || `<pending upload of ${p}>`);
    }
  } else {
    for (const p of sortedImagePaths) {
      try {
        const { assetId, cached } = await uploadImage(p, cache);
        pathToAssetId.set(p, assetId);
        console.log(`  ${cached ? '[cached]  ' : '[uploaded]'} ${p} -> ${assetId}`);
      } catch (err) {
        console.error(`  [FAILED]  ${p}: ${err.message}`);
        throw err;
      }
    }
  }

  console.log('');
  console.log('-'.repeat(78));
  console.log(`[seed] SINGLETON PAGES (${SINGLETONS.length})`);
  console.log('-'.repeat(78));

  const results = { singletonsOk: 0, singletonsFailed: 0, categoriesOk: 0, categoriesFailed: 0 };

  for (const singleton of SINGLETONS) {
    const createMutation = { createIfNotExists: { _id: singleton.id, _type: singleton.type } };
    const patchMutation = {
      patch: {
        id: singleton.id,
        setIfMissing: singleton.fields,
      },
    };

    if (DRY_RUN) {
      console.log(`\n>>> ${singleton.type}  (_id: "${singleton.id}")`);
      console.log(planToPrintableString(createMutation));
      console.log(planToPrintableString(resolveImages(patchMutation, pathToAssetId)));
      results.singletonsOk++;
      continue;
    }

    try {
      const resolvedPatch = resolveImages(patchMutation, pathToAssetId);
      await mutate([createMutation, resolvedPatch]);
      console.log(`  [OK] ${singleton.type} (${singleton.id})`);
      results.singletonsOk++;
    } catch (err) {
      console.error(`  [FAILED] ${singleton.type} (${singleton.id}): ${err.message}`);
      results.singletonsFailed++;
    }
  }

  console.log('');
  console.log('-'.repeat(78));
  console.log(`[seed] EQUIPMENT CATEGORY DOCUMENTS (${EQUIPMENT_CATEGORY_DOCS.length} new collection documents)`);
  console.log('-'.repeat(78));

  for (const doc of EQUIPMENT_CATEGORY_DOCS) {
    const createMutation = { createIfNotExists: doc };

    if (DRY_RUN) {
      console.log(`\n>>> equipmentCategory  (_id: "${doc._id}")`);
      console.log(planToPrintableString(resolveImages(createMutation, pathToAssetId)));
      results.categoriesOk++;
      continue;
    }

    try {
      const resolved = resolveImages(createMutation, pathToAssetId);
      await mutate([resolved]);
      console.log(`  [OK] equipmentCategory (${doc._id})`);
      results.categoriesOk++;
    } catch (err) {
      console.error(`  [FAILED] equipmentCategory (${doc._id}): ${err.message}`);
      results.categoriesFailed++;
    }
  }

  console.log('');
  console.log('='.repeat(78));
  console.log('[seed] SUMMARY');
  console.log('='.repeat(78));
  console.log(`  Mode: ${DRY_RUN ? 'DRY RUN (nothing was sent to Sanity)' : 'LIVE'}`);
  console.log(`  Unique images referenced: ${sortedImagePaths.length}`);
  console.log(`  Singleton pages planned/${DRY_RUN ? 'printed' : 'processed'}: ${SINGLETONS.length} (ok: ${results.singletonsOk}, failed: ${results.singletonsFailed})`);
  console.log(`    -> ${SINGLETONS.map((s) => s.id).join(', ')}`);
  console.log(`  New equipmentCategory documents planned/${DRY_RUN ? 'printed' : 'processed'}: ${EQUIPMENT_CATEGORY_DOCS.length} (ok: ${results.categoriesOk}, failed: ${results.categoriesFailed})`);
  console.log(`    -> ${EQUIPMENT_CATEGORY_DOCS.map((d) => d._id).join(', ')}`);
  if (DRY_RUN) {
    console.log('');
    console.log('  Nothing was written. Review the plan above, then run:');
    console.log('    node scripts/seed-sanity.mjs');
    console.log('  to actually seed Sanity.');
  }

  if (!DRY_RUN && (results.singletonsFailed > 0 || results.categoriesFailed > 0)) {
    process.exitCode = 1;
  }
}

run().catch((err) => {
  console.error('\n[seed] Fatal error:', err.message);
  process.exitCode = 1;
});
