import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

// Load .env.local
const envPath = path.join(REPO_ROOT, '.env.local');
if (fs.existsSync(envPath)) {
  const raw = fs.readFileSync(envPath, 'utf8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
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

const CONFIG = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_AND_WRITE_TOKEN,
};

if (!CONFIG.token) {
  console.error('No write token found.');
  process.exit(1);
}

const CACHE_PATH = path.join(__dirname, '.seed-asset-cache.json');
const cache = fs.existsSync(CACHE_PATH) ? JSON.parse(fs.readFileSync(CACHE_PATH, 'utf8')) : {};

const ASSET_UPLOAD_URL = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/assets/images/${CONFIG.dataset}`;
const MUTATE_URL = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/mutate/${CONFIG.dataset}`;

const MIME_BY_EXT = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

async function uploadImage(localRelPath) {
  if (cache[localRelPath]) {
    return cache[localRelPath];
  }
  const cleanPath = localRelPath.startsWith('/') ? localRelPath.slice(1) : localRelPath;
  const fullPath = path.join(REPO_ROOT, 'public', cleanPath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`File not found: ${fullPath}`);
  }
  const ext = path.extname(fullPath).toLowerCase();
  const mime = MIME_BY_EXT[ext] || 'image/jpeg';
  const fileBuffer = fs.readFileSync(fullPath);
  const filename = path.basename(fullPath);

  const url = `${ASSET_UPLOAD_URL}?filename=${encodeURIComponent(filename)}`;
  console.log(`Uploading ${localRelPath}...`);
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONFIG.token}`,
      'Content-Type': mime,
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Upload failed for ${localRelPath} (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const assetId = data.document._id;
  cache[localRelPath] = assetId;
  fs.writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2) + '\n');
  return assetId;
}

function randKey() {
  return Math.random().toString(36).slice(2, 10);
}

async function run() {
  console.log('Seeding projectsPage fields...');

  // 1. Hero Slides
  const HERO_SLIDES_SRC = [
    { src: "/pictures/hero-slider/drilling-rig-cover-photo.jpg", alt: "HDD On-Site Drilling Rig System" },
    { src: "/pictures/hero-slider/highlight.jpg", alt: "Heavy HDD Drilling Rig Positioning on Site" },
    { src: "/pictures/hero-slider/drilling-rig-03.jpg", alt: "HDD Rig Operations & High-Pressure Mud Line" },
    { src: "/pictures/hero-slider/ob3-construction-team.jpg", alt: "OB3 River Niger Crossing Field Site" },
    { src: "/pictures/hero-slider/akk-cover-photo.jpg", alt: "AKK Pipeline Crossing Construction Site" },
    { src: "/pictures/hero-slider/pipeline-epc-cover-photo.JPG", alt: "52km Pipeline EPC Construction Site" },
    { src: "/pictures/hero-slider/team-in-suits.jpg", alt: "PCE Executive & Management Team" },
  ];

  const heroSlides = [];
  for (const slide of HERO_SLIDES_SRC) {
    const assetId = await uploadImage(slide.src);
    heroSlides.push({
      _key: randKey(),
      _type: 'object',
      alt: slide.alt,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
    });
  }

  // 2. Filter Tabs
  const filterTabs = [
    {
      _key: randKey(),
      _type: 'object',
      id: "all",
      name: "All",
      description: "All Featured Projects Across All Regions",
      subtext: "Explore landmark HDD and pipeline EPC projects delivered across Nigeria, Thailand, and China."
    },
    {
      _key: randKey(),
      _type: 'object',
      id: "nigeria",
      name: "Nigeria",
      description: "Serving Nigeria's national gas masterplan and swamp production grids.",
      subtext: "Delivering critical river crossings and shoreline pipeline installations under difficult tropical delta geology."
    },
    {
      _key: randKey(),
      _type: 'object',
      id: "thailand",
      name: "Thailand",
      description: "Major gas crossings and pipeline EPC in Thailand.",
      subtext: "Delivering long-distance HDD crossings and comprehensive pipeline construction across complex regional terrain."
    },
    {
      _key: randKey(),
      _type: 'object',
      id: "china",
      name: "China",
      description: "Major river crossings and complex geological drilling in China.",
      subtext: "PCE's extensive track record includes large-diameter river crossings across challenging rock, gravel and silt strata."
    },
    {
      _key: randKey(),
      _type: 'object',
      id: "bpds",
      name: "BPDS Construction Work",
      description: "Deeply Buried Pipeline Detection & Construction Support.",
      subtext: "Case studies and project records for BPDS pipeline location and specialized construction work are currently being prepared."
    }
  ];

  // 3. Grid Section & What Works Cards
  const gridSection = {
    _type: 'sectionBlock',
    tagline: 'WHAT CONNECTS THE WORK',
    heading: 'Different routes. The same engineering discipline.',
  };

  const WHAT_WORKS_SRC = [
    {
      title: "Specialist Engineering",
      label: "Crossing methods shaped around pipeline requirements, geology and route constraints.",
      image: "/pictures/company/specialist-enginering.jpg"
    },
    {
      title: "Appropriate Equipment",
      label: "Rig, guidance, drilling-fluid and support systems configured around the technical demands of the work.",
      image: "/pictures/equipment/main-equipments-cover-photo.jpg"
    },
    {
      title: "Coordinated Execution",
      label: "Engineering, equipment, field operations, safety and quality brought together around the crossing.",
      image: "/pictures/hero-slider/ob3-construction-team.jpg"
    },
    {
      title: "Experience Carried Forward",
      label: "Lessons from complex projects informing engineering and execution decisions on the next route.",
      image: "/pictures/capabilities/handover.jpg"
    }
  ];

  const whatWorksCards = [];
  for (const card of WHAT_WORKS_SRC) {
    const assetId = await uploadImage(card.image);
    whatWorksCards.push({
      _key: randKey(),
      _type: 'object',
      title: card.title,
      label: card.label,
      image: {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      },
    });
  }

  // Mutate Sanity
  const mutations = [
    {
      patch: {
        id: 'projectsPage',
        set: {
          heroSlides,
          filterTabs,
          gridSection,
          whatWorksCards,
        },
      },
    },
  ];

  console.log('Sending patch to Sanity projectsPage...');
  const res = await fetch(MUTATE_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Sanity patch failed (${res.status}): ${errText}`);
  }

  console.log('Successfully seeded projectsPage with heroSlides, filterTabs, gridSection, and whatWorksCards!');
}

run().catch((err) => {
  console.error('Error seeding projectsPage:', err);
  process.exit(1);
});
