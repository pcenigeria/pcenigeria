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

const MUTATE_URL = `https://${CONFIG.projectId}.api.sanity.io/v${CONFIG.apiVersion}/data/mutate/${CONFIG.dataset}`;

function randKey() {
  return Math.random().toString(36).slice(2, 10);
}

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

async function run() {
  console.log('Seeding productsPage fields...');

  // 1. About Section
  const aboutSection = {
    tagline: 'About Us',
    heading: 'A Team Built on Drilling Fluid Expertise',
    body: toPortableText([
      'Our team brings more than fifteen years of hands-on HDD construction experience. Across Nigeria, China, Thailand, Pakistan and Bangladesh, we have completed over 500 horizontal directional drilling crossings totalling more than 300 kilometres — through silt, clay, sand, gravel, cobble and hard rock, with pipe diameters ranging from 6 inches all the way up to 56 inches.',
      'Year after year on the job site taught us one lesson above all: the correct use of drilling fluid is the foundation of every successful HDD crossing. That is why we moved from using drilling fluids to engineering them. Drawing on our field record, we developed a complete family of HDD drilling fluid materials — bentonite, CMC, viscosity reducers, MMH and xanthan gum — each one formulated to solve the problems we know best.',
    ]),
    callout: {
      badge: 'Quality Control & Testing',
      title: '100% Laboratory Verified Before Delivery',
      text: 'Every batch of Brighter Star products is verified in our own laboratory before it ever reaches a job site: viscosity profiles, fluid loss, carrying capacity and salt resistance are all measured on standard mud-testing equipment.',
      footer: 'ISO-Standard Mud Testing Protocol',
    },
    stats: [
      { _key: randKey(), stat: '15+', label: 'Years in HDD' },
      { _key: randKey(), stat: '500+', label: 'HDD Crossings' },
      { _key: randKey(), stat: '300+', label: 'Kilometres Drilled' },
      { _key: randKey(), stat: '5', label: 'Countries Served' },
      { _key: randKey(), stat: '6″–56″', label: 'Pipe Diameters' },
    ],
  };

  // 2. Stratum Guide Section
  const stratumSection = {
    tagline: 'Know the Ground',
    heading: 'HDD Challenges & Recommended Mud Systems',
    intro: 'Each formation puts its own demands on the drilling fluid. The Brighter Star product family — BRSBENT SQ, BRSCMC, BRSMMH, BRSVR and BRSXTG — was engineered specifically against these four challenge profiles to ensure bore stability and success.',
    buttonText: 'Consult Engineering Team →',
    buttonLink: '/contact',
    cards: [
      {
        _key: randKey(),
        title: 'Clay Formations',
        tags: ['High Viscosity', 'High Torque', 'Pipe Balling', 'Frac-Out Risk'],
        desc: 'Clay swells and sticks to the drill string and reamer, driving torque up sharply and choking the annulus. Without control, mud pressure builds until it breaks out.',
        recommended: 'BRSBENT SQ + BRSVR',
        proofPoint: 'BRSVR disperses clay and cuts torque over 90% in field records.',
      },
      {
        _key: randKey(),
        title: 'Sandy Formations',
        tags: ['Unconsolidated', 'Borehole Collapse', 'Pipe Sticking', 'Frac-Out Risk'],
        desc: 'Sand offers no natural stability: the borehole wall caves in easily, cuttings settle fast, and the drill string can be buried. Requires a tough, low-loss filter cake.',
        recommended: 'BRSBENT SQ + BRSCMC',
        proofPoint: 'Our most-used combination, from the Niger River to the Min Jiang River.',
      },
      {
        _key: randKey(),
        title: 'Rock Formations',
        tags: ['Poor Transport', 'Secondary Grinding', 'Severe Tool Wear', 'Low ROP'],
        desc: 'Rock cuttings are heavy and angular. If mud cannot carry them out, they are ground a second time at the bit — wearing out tooling and slowing ROP.',
        recommended: 'BRSBENT SQ + BRSMMH',
        proofPoint: 'BRSMMH boosts carrying capacity on long rock crossings such as Zhanjiang.',
      },
      {
        _key: randKey(),
        title: 'Marine Sedimentary',
        tags: ['System Failure', 'Salt Contamination', 'Pipe Sticking'],
        desc: 'Salt water and high-salinity formations flocculate ordinary bentonite muds, destroying viscosity and filtration control precisely where the crossing is hardest.',
        recommended: 'BRSBENT SQ + BRSXTG',
        proofPoint: 'BRSXTG keeps mud system stable for the full duration of offshore drives.',
      },
    ],
  };

  // 3. Performance Matrix Rows
  const matrixRows = [
    {
      _key: randKey(),
      product: 'BRSBENT SQ',
      ingredient: 'Premium bentonite',
      viscosity: 'Excellent',
      reduceViscosity: 'N/A',
      dynamicShear: 'Excellent',
      filtration: 'Excellent',
      salinity: 'N/A',
      stratum: 'All strata',
      hazard: 'None',
    },
    {
      _key: randKey(),
      product: 'BRSCMC',
      ingredient: 'Sodium carboxymethyl cellulose',
      viscosity: 'Very good',
      reduceViscosity: 'N/A',
      dynamicShear: 'Very good',
      filtration: 'Excellent',
      salinity: 'N/A',
      stratum: 'Sand / Gravel / Rock',
      hazard: 'None',
    },
    {
      _key: randKey(),
      product: 'BRSMMH',
      ingredient: 'Positive electric adhesive dry powder',
      viscosity: 'Very good',
      reduceViscosity: 'N/A',
      dynamicShear: 'Excellent',
      filtration: 'N/A',
      salinity: 'N/A',
      stratum: 'Rock Formations',
      hazard: 'None',
    },
    {
      _key: randKey(),
      product: 'BRSVR',
      ingredient: 'Clay viscosity reducer',
      viscosity: 'N/A',
      reduceViscosity: 'Excellent',
      dynamicShear: 'N/A',
      filtration: 'N/A',
      salinity: 'N/A',
      stratum: 'Clay Formations',
      hazard: 'None',
    },
    {
      _key: randKey(),
      product: 'BRSXTG',
      ingredient: 'Xanthan gum',
      viscosity: 'Good',
      reduceViscosity: 'N/A',
      dynamicShear: 'Good',
      filtration: 'Good',
      salinity: 'Excellent',
      stratum: 'High-Salinity Formations',
      hazard: 'None',
    },
  ];

  // 4. Case Studies Section
  const caseStudiesSection = {
    tagline: 'Proven in the Field',
    heading: 'Typical HDD Project Case Studies',
    subtext: 'Validated on large-scale HDD crossings across Nigeria, China, and Thailand.',
    items: [
      {
        _key: randKey(),
        num: '01',
        title: 'OB3 RNC HDD Project',
        country: 'Nigeria · NGIC',
        lengthDia: '2,000 m × 48″',
        depth: '52 m',
        stratum: 'Sand / gravel',
        rigs: '1,200T / 500T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 2 km crossing of the Niger River at 52 m depth through complex sand and gravel strata — the largest-scale HDD project in Nigeria.',
      },
      {
        _key: randKey(),
        num: '02',
        title: 'AKK Niger River HDD Project',
        country: 'Nigeria · NGIC',
        lengthDia: '1,565 m × 40″',
        depth: '16 m',
        stratum: 'Sand / gravel / rock',
        rigs: '1,200T / 350T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 1,565 m crossing of the Niger River through complex sand, gravel and rock on the strategic AKK gas pipeline project.',
      },
      {
        _key: randKey(),
        num: '03',
        title: 'Fuzhou River HDD Crossing',
        country: 'China · SWG',
        lengthDia: '2,100 m × 40″',
        depth: '35 m',
        stratum: 'Sand / gravel',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 2.1 km EPC crossing of the Min Jiang River at 35 m depth — a showcase of filtration control and borehole stability.',
      },
      {
        _key: randKey(),
        num: '04',
        title: 'Zhanjiang Offshore HDD Crossing',
        country: 'China · CNOOC',
        lengthDia: '2,200 m × 5 × 20″',
        depth: '42 m',
        stratum: 'Rock / sand (marine)',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSMMH + BRSXTG',
        desc: 'Five parallel 2.2 km onshore-to-offshore crossings through marine sedimentary rock and sand. BRSMMH lifted rock cuttings while BRSXTG prevented salt flocculation.',
      },
      {
        _key: randKey(),
        num: '05',
        title: 'Raoyang River HDD Crossing',
        country: 'China · CNPC',
        lengthDia: '2,293 m × 48″',
        depth: '27.5 m',
        stratum: 'Sand / gravel / rock',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 2.3 km, 48-inch crossing of the Raoyang River through sand, gravel and rock — among the largest HDD crossings in China.',
      },
      {
        _key: randKey(),
        num: '06',
        title: 'Tianjin LNG HDD Crossing',
        country: 'China · CNPC',
        lengthDia: '655 / 750 / 860 m × 56″',
        depth: '30 m',
        stratum: 'Sand with clay',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSCMC / BRSVR',
        desc: 'Three river crossings with 56-inch pipe — the largest pipe-size HDD crossing in China — through sand with clay at 30 m depth.',
      },
      {
        _key: randKey(),
        num: '07',
        title: '5TP-1 36″ Branch HDD Crossing',
        country: 'Thailand · PTT',
        lengthDia: '1,700 m × 36″',
        depth: '20 m',
        stratum: 'High-viscosity clay',
        rigs: '600T',
        products: 'BRSBENT SQ + BRSVR',
        desc: 'The longest large-diameter HDD in Thailand through high-viscosity clay. BRSVR kept clay dispersed and torque low across the full drive.',
      },
      {
        _key: randKey(),
        num: '08',
        title: '5TP-1 HDD1 Gulf Crossing',
        country: 'Thailand · PTT',
        lengthDia: '1,400 m × 42″',
        depth: '20 m',
        stratum: 'Sand / granite rock',
        rigs: '600T',
        products: 'BRSBENT SQ + BRSMMH',
        desc: 'The largest-scale HDD in Thailand — 1.4 km through sand and granite rock. BRSMMH provided the carrying capacity needed to lift granite cuttings.',
      },
    ],
  };

  // 5. Sales Contacts & Offices
  const salesContacts = [
    { _key: randKey(), name: 'Ms. Jannifer', phone: '+234-09136099052', email: 'info@pcenigeria.com' },
    { _key: randKey(), name: 'Mr. Tom', phone: '+234-07074126596', email: 'wanyang@pcenigeria.com' },
    { _key: randKey(), name: 'Mr. Frank', phone: '+234-07013732816', email: 'xuliangkui@pcenigeria.com' },
  ];

  const salesOffices = [
    { _key: randKey(), location: 'Abuja Office', address: 'House 45, Nelson Mandela Street, Asokoro, Abuja, Nigeria' },
    { _key: randKey(), location: 'Lagos Office', address: 'HyGroup Place, 6 Ojulari Street, Off Kusenla Road, Ikate, Elegushi, Lekki, Lagos' },
  ];

  // Mutate Sanity
  const mutations = [
    {
      patch: {
        id: 'productsPage',
        set: {
          aboutSection,
          stratumSection,
          matrixRows,
          caseStudiesSection,
          salesContacts,
          salesOffices,
        },
      },
    },
  ];

  console.log('Sending patch to Sanity productsPage...');
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

  console.log('Successfully seeded productsPage with all sections and contacts!');
}

run().catch((err) => {
  console.error('Error seeding productsPage:', err);
  process.exit(1);
});
