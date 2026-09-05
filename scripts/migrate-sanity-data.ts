import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { PROJECTS_DATA } from '../features/projects/data/projects-data';
import { NEWS_DATA } from '../features/news-insights/data/news-data';
import { PRODUCTS_DATA } from '../features/products/data/products-data';
import { CAPABILITIES_CARDS, CAPABILITIES_DETAILS } from '../features/capabilities/data/capabilities-data';

// Automatically load .env.local if present
const envPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  for (const line of envConfig.split('\n')) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const keyName = match[1];
      let value = match[2] || '';
      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
      if (!process.env[keyName]) {
        process.env[keyName] = value;
      }
    }
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || projectId === 'your_sanity_project_id_here' || !token) {
  console.log('----------------------------------------------------');
  console.log('⚠️ Sanity credentials not detected in environment.');
  console.log('Ensure NEXT_PUBLIC_SANITY_PROJECT_ID & SANITY_API_READ_TOKEN are set in .env.local');
  console.log('----------------------------------------------------');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

function genKey(prefix = 'k'): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

function makeBlockContent(input: string | string[]): any[] {
  if (!input) return [];
  const paragraphs = Array.isArray(input) ? input : input.split('\n\n');
  return paragraphs.filter(Boolean).map((p) => ({
    _key: genKey('blk'),
    _type: 'block',
    style: 'normal',
    children: [
      {
        _key: genKey('span'),
        _type: 'span',
        text: p.trim(),
        marks: [],
      },
    ],
    markDefs: [],
  }));
}

async function saveDoc(doc: any) {
  console.log(`Publishing singleton document: ${doc._id}...`);
  // Sanity's delete mutation is idempotent (a no-op if the draft doesn't exist), so the
  // publish + draft-overlay-clear can go in one transaction instead of two round trips.
  await client
    .transaction()
    .createOrReplace(doc)
    .delete(`drafts.${doc._id}`)
    .commit();
}

const imageAssetCache = new Map<string, any>();
async function uploadLocalImage(relativePath?: string): Promise<any> {
  if (!relativePath || !relativePath.startsWith('/')) return null;
  if (imageAssetCache.has(relativePath)) {
    return imageAssetCache.get(relativePath);
  }
  const fullPath = path.join(process.cwd(), 'public', relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return null;
  }
  try {
    console.log(`Uploading asset: ${relativePath}...`);
    const stream = fs.createReadStream(fullPath);
    const asset = await client.assets.upload('image', stream, {
      filename: path.basename(fullPath),
    });
    const result = {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
    imageAssetCache.set(relativePath, result);
    return result;
  } catch (err) {
    console.error(`Failed to upload ${relativePath}:`, err);
    return null;
  }
}

const fileAssetCache = new Map<string, any>();
async function uploadLocalFile(relativePath?: string): Promise<any> {
  if (!relativePath || !relativePath.startsWith('/')) return null;
  if (fileAssetCache.has(relativePath)) {
    return fileAssetCache.get(relativePath);
  }
  const fullPath = path.join(process.cwd(), 'public', relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`File not found: ${fullPath}`);
    return null;
  }
  try {
    console.log(`Uploading file asset: ${relativePath}...`);
    const stream = fs.createReadStream(fullPath);
    const asset = await client.assets.upload('file', stream, {
      filename: path.basename(fullPath),
    });
    const result = {
      _type: 'file',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
    fileAssetCache.set(relativePath, result);
    return result;
  } catch (err) {
    console.error(`Failed to upload file ${relativePath}:`, err);
    return null;
  }
}

async function migrateProjects() {
  console.log('\n--- Migrating Projects / Case Studies ---');
  const projectsList = Object.values(PROJECTS_DATA);
  for (const proj of projectsList) {
    const heroImageAsset = await uploadLocalImage(proj.heroImage);
    const bentoItems = [];
    if (proj.bentoImages && Array.isArray(proj.bentoImages)) {
      for (const itemSrc of proj.bentoImages) {
        const itemImg = await uploadLocalImage(itemSrc);
        if (itemImg) {
          bentoItems.push({
            _key: genKey('bento'),
            _type: 'galleryItem',
            image: itemImg,
            title: proj.title,
          });
        }
      }
    }

    const doc = {
      _type: 'project',
      _id: `project-${proj.slug}`,
      title: proj.title,
      slug: { _type: 'slug', current: proj.slug },
      subtitle: proj.subtitle || '',
      tagline: proj.tagline || '',
      date: proj.date || '',
      location: proj.location || '',
      country: proj.location?.toLowerCase().includes('thailand')
        ? 'Thailand'
        : proj.location?.toLowerCase().includes('china')
        ? 'China'
        : 'Nigeria',
      category: proj.category || 'HDD',
      heroImage: heroImageAsset,
      intro: proj.intro || '',
      specs: proj.specs?.map((spec: any) => ({
        _key: genKey('spec'),
        _type: 'specRow',
        label: spec.label || '',
        value: spec.value || '',
      })),
      sections: proj.sections?.map((sec: any) => ({
        _key: genKey('sec'),
        _type: 'sectionBlock',
        tagline: sec.tagline || '',
        heading: sec.heading || '',
        headingColor: sec.headingColor || 'navy',
        body: makeBlockContent(sec.body || sec.heading || ''),
        bullets: sec.bullets || [],
        highlightStat: sec.highlightStat
          ? {
              value: sec.highlightStat.value || '',
              label: sec.highlightStat.label || '',
            }
          : undefined,
      })),
      bentoImages: bentoItems.length > 0 ? {
        _type: 'gallery',
        categoryTitle: 'Project Gallery',
        items: bentoItems,
      } : undefined,
    };

    await saveDoc(doc);
  }
}

async function migrateNews() {
  console.log('\n--- Migrating News & Insights Articles ---');
  const articlesList = Object.values(NEWS_DATA);
  for (const article of articlesList) {
    const heroImageAsset = await uploadLocalImage(article.heroImage);

    const bentoItems = [];
    if (article.bentoImages && Array.isArray(article.bentoImages)) {
      for (const bImg of article.bentoImages) {
        const itemImg = await uploadLocalImage(bImg);
        if (itemImg) {
          bentoItems.push({
            _key: genKey('bento'),
            _type: 'galleryItem',
            image: itemImg,
            title: article.title,
          });
        }
      }
    }

    const doc = {
      _type: 'newsArticle',
      _id: `news-${article.slug}`,
      title: article.title,
      slug: { _type: 'slug', current: article.slug },
      category: article.category || 'News',
      date: article.date || '',
      readTime: article.readTime || '',
      author: article.author || 'PCE Media Team',
      heroImage: heroImageAsset,
      intro: article.intro || '',
      sections: article.sections?.map((sec: any) => ({
        _key: genKey('sec'),
        _type: 'sectionBlock',
        tagline: sec.tagline || '',
        heading: sec.heading || '',
        headingColor: sec.headingColor || 'navy',
        body: makeBlockContent(sec.body || sec.heading || ''),
        bullets: sec.bullets || [],
        highlightStat: sec.highlightStat
          ? {
              value: sec.highlightStat.value || '',
              label: sec.highlightStat.label || '',
            }
          : undefined,
      })),
      bentoImages: bentoItems.length > 0 ? {
        _type: 'gallery',
        categoryTitle: 'Article Gallery',
        items: bentoItems,
      } : undefined,
    };

    await saveDoc(doc);
  }
}

async function migrateProducts() {
  console.log('\n--- Migrating Products ---');
  for (const prod of PRODUCTS_DATA) {
    const primaryImg = await uploadLocalImage(prod.image);
    const secondaryImg = await uploadLocalImage(prod.secondaryImage);
    const heroImg = await uploadLocalImage(prod.heroImage);
    const tdsAsset = prod.tdsUrl ? await uploadLocalFile(prod.tdsUrl) : null;
    const sdsAsset = prod.sdsUrl ? await uploadLocalFile(prod.sdsUrl) : null;

    const galleryItems = [];
    if (prod.galleryImages && Array.isArray(prod.galleryImages)) {
      for (const gImg of prod.galleryImages) {
        const itemImg = await uploadLocalImage(gImg);
        if (itemImg) {
          galleryItems.push({
            _key: genKey('gallery'),
            _type: 'galleryItem',
            image: itemImg,
            title: prod.title,
          });
        }
      }
    }

    const technicalItems = [];
    if (prod.technicalImages && Array.isArray(prod.technicalImages)) {
      for (const tImg of prod.technicalImages) {
        const itemImg = await uploadLocalImage(tImg);
        if (itemImg) {
          technicalItems.push({
            _key: genKey('tech'),
            _type: 'galleryItem',
            image: itemImg,
            title: prod.title,
          });
        }
      }
    }

    const doc = {
      _type: 'product',
      _id: `product-${prod.slug}`,
      title: prod.title,
      slug: { _type: 'slug', current: prod.slug },
      subtitle: prod.subtitle || '',
      eyebrow: prod.eyebrow || '',
      description: prod.description || '',
      overviewText: prod.overviewText || '',
      whatItDoes: prod.whatItDoes || '',
      alsoKnownAs: Array.isArray(prod.alsoKnownAs)
        ? prod.alsoKnownAs
        : typeof prod.alsoKnownAs === 'string'
        ? [prod.alsoKnownAs]
        : [],
      image: primaryImg,
      secondaryImage: secondaryImg,
      heroImage: heroImg,
      intro: prod.intro || '',
      executiveStandard: prod.executiveStandard || '',
      mainFunctions: prod.mainFunctions || [],
      features: prod.features || [],
      applications: prod.applications?.map((app: any) => ({
        _key: genKey('app'),
        title: app.title || '',
        desc: app.desc || '',
        icon: app.icon || '',
      })),
      specRows: prod.specs?.map((spec: any) => ({
        _key: genKey('spec'),
        _type: 'specRow',
        label: spec.label || '',
        value: spec.value || '',
      })),
      specTables: prod.specTables?.map((tbl: any) => ({
        _key: genKey('tbl'),
        title: tbl.title || '',
        headers: tbl.headers || [],
        rows: tbl.rows?.map((r: string[]) => ({
          _key: genKey('row'),
          cells: r,
        })) || [],
      })),
      howItsUsed: prod.howItsUsed ? {
        description: prod.howItsUsed.suitability || prod.howItsUsed.application || (prod.howItsUsed.mixingSteps ? prod.howItsUsed.mixingSteps.join(' ') : ''),
        recommendedDosage: prod.howItsUsed.dosage || '',
        mixingInstructions: Array.isArray(prod.howItsUsed.mixingSteps)
          ? prod.howItsUsed.mixingSteps.join('\n')
          : (prod.howItsUsed.precaution || ''),
      } : undefined,
      tdsFile: tdsAsset,
      sdsFile: sdsAsset,
      sections: prod.sections?.map((sec: any) => ({
        _key: genKey('sec'),
        _type: 'sectionBlock',
        tagline: sec.tagline || '',
        heading: sec.heading || '',
        headingColor: sec.headingColor || 'navy',
        body: makeBlockContent(sec.body || sec.heading || ''),
        bullets: sec.bullets || [],
      })),
      safetyAtAGlance: prod.safetyAtAGlance ? {
        hazardRating: prod.safetyAtAGlance.ghsHazard || prod.safetyAtAGlance.hazardClass || '',
        handlingPrecautions: prod.safetyAtAGlance.cautionStrip || (prod.safetyAtAGlance.ppe ? prod.safetyAtAGlance.ppe.map((p: any) => `${p.type}: ${p.recommendation}`).join('; ') : ''),
        recommendedPpe: prod.safetyAtAGlance.ppe ? prod.safetyAtAGlance.ppe.map((p: any) => `${p.type}: ${p.recommendation}`) : [],
      } : undefined,
      storageInfo: prod.storageInfo || '',
      sdsSections: prod.sdsSections?.map((s: any) => ({
        _key: genKey('sds'),
        sectionNumber: String(s.num || s.sectionNumber || ''),
        title: s.title || '',
        content: s.content || '',
      })),
      supplyDetails: prod.supplyDetails ? {
        packaging: prod.supplyDetails.find((d: any) => d.label?.toLowerCase().includes('pack') || d.label?.toLowerCase().includes('bag') || d.label?.toLowerCase().includes('small'))?.value || (Array.isArray(prod.supplyDetails) ? prod.supplyDetails[0]?.value : ''),
        minimumOrder: prod.supplyDetails.find((d: any) => d.label?.toLowerCase().includes('minimum') || d.label?.toLowerCase().includes('tanker'))?.value || '',
        leadTime: prod.supplyDetails.find((d: any) => d.label?.toLowerCase().includes('lead') || d.label?.toLowerCase().includes('shelf'))?.value || '',
        logisticsHubs: prod.supplyDetails.filter((d: any) => d.label?.toLowerCase().includes('hub') || d.label?.toLowerCase().includes('storage')).map((d: any) => `${d.label}: ${d.value}`),
      } : undefined,
      salesContacts: prod.salesContacts?.map((c: any) => ({
        _key: genKey('contact'),
        _type: 'contactPerson',
        name: c.name || '',
        phone: c.phone || '',
        email: c.email || '',
      })),
      galleryImages: galleryItems.length > 0 ? {
        _type: 'gallery',
        categoryTitle: 'Product Photo Gallery',
        items: galleryItems,
      } : undefined,
      technicalImages: technicalItems.length > 0 ? {
        _type: 'gallery',
        categoryTitle: 'Technical Diagrams',
        items: technicalItems,
      } : undefined,
    };

    await saveDoc(doc);
  }
}

async function migrateCapabilities() {
  console.log('\n--- Migrating Capabilities ---');

  const capabilityGalleriesData: Record<string, { categoryTitle: string; items: Array<{ src: string; title: string }> }> = {
    hdd: {
      categoryTitle: "Horizontal Directional Drilling (HDD) Capability",
      items: [
        { src: "/pictures/hero-slider/drilling-rig-cover-photo.jpg", title: "1200t / 500t Heavy HDD Drilling Rig System" },
        { src: "/pictures/home-page/ob3-cover-photo.jpg", title: "OB3 River Niger HDD Crossing Project" },
        { src: "/pictures/hero-slider/hdd-02.jpg", title: "River Niger HDD Crossing Site" },
        { src: "/pictures/hero-slider/offshore-hdd-project.jpg", title: "Offshore HDD Project Site Infrastructure" },
        { src: "/pictures/home-page/akk-02.jpg", title: "AKK River Niger HDD Crossing Project" },
        { src: "/pictures/home-page/raoyang-river-hdd.jpg", title: "Raoyang River 2,293m HDD Crossing" }
      ]
    },
    epc: {
      categoryTitle: "52km Pipeline EPC Construction",
      items: [
        { src: "/pictures/hero-slider/pipeline-epc-cover-photo.JPG", title: "52km Pipeline EPC Construction Site" },
        { src: "/pictures/home-page/epc-work-02.jpg", title: "52km Pipeline EPC Operations & Pipe Bending" },
        { src: "/pictures/home-page/epc-work-03.jpg", title: "Pipeline Trenching, Alignment & Stringing" },
        { src: "/pictures/home-page/epc-work-04.jpg", title: "Pipeline Field Operations & Welding" }
      ]
    },
    bpds: {
      categoryTitle: "New Pipeline Location Survey Technique - BPDS",
      items: [
        { src: "/pictures/hero-slider/bpds-cover-photo.png", title: "BPDS 3D Pipeline Location & Depth Survey" },
        { src: "/pictures/hero-slider/bpds-03.png", title: "BPDS Signal Transmitter & Cable Connection" },
        { src: "/pictures/hero-slider/bpds-04.png", title: "Buried Pipeline Sensor Receiver System" },
        { src: "/pictures/hero-slider/bpds-05.png", title: "3D Coordinate & Magnetic Data Processing" },
        { src: "/pictures/hero-slider/bpds-06.png", title: "River Crossing Pipeline Burial Depth Mapping" }
      ]
    },
    support: {
      categoryTitle: "PCE Equipment Yard & Technical Fleet",
      items: [
        { src: "/pictures/equipment/main-equipments-cover-photo.jpg", title: "PCE Main Equipment Yard (Aerial View)" },
        { src: "/pictures/home-page/equipment-02.jpg", title: "Heavy HDD Rigs & Fleet Inventory" },
        { src: "/pictures/home-page/equipment-03.jpg", title: "High-Pressure Mud Pumps & Circulation Units" },
        { src: "/pictures/home-page/equipment-04.jpg", title: "Mud Recycling Systems & Solids Control" },
        { src: "/pictures/home-page/equipment-05.jpg", title: "Specialist HDD Drilling Tools & Reamers" },
        { src: "/pictures/home-page/equipment-06.jpg", title: "Field Excavators & Support Machinery" },
        { src: "/pictures/home-page/equipment-07.jpg", title: "Continuous Electronic Tracking & Guidance Systems" },
        { src: "/pictures/home-page/equipment-08.jpg", title: "PCE Heavy Equipment Maintenance & Logistics Yard" }
      ]
    }
  };

  for (const card of CAPABILITIES_CARDS) {
    const detail = CAPABILITIES_DETAILS[card.id];
    const cardImg = await uploadLocalImage(card.image);

    const galData = capabilityGalleriesData[card.id];
    const galItems = [];
    if (galData?.items) {
      for (const item of galData.items) {
        const img = await uploadLocalImage(item.src);
        if (img) {
          galItems.push({
            _key: genKey('gal'),
            _type: 'galleryItem',
            image: img,
            title: item.title,
          });
        }
      }
    }

    const doc = {
      _type: 'capability',
      _id: `capability-${card.id}`,
      id: { _type: 'slug', current: card.id },
      number: card.number,
      title: card.title,
      description: card.description,
      image: cardImg,
      headline: detail?.headline || '',
      subtext: detail?.subtext || '',
      steps: detail?.steps || [],
      gallery: {
        _type: 'gallery',
        categoryTitle: galData?.categoryTitle || card.title,
        items: galItems,
      },
    };

    await saveDoc(doc);
  }
}

async function migratePageSingletons() {
  console.log('\n--- Migrating Page Singletons & Global Settings ---');

  // Common hero slideshow images
  const heroSlidePaths = [
    { src: "/pictures/hero-slider/ob3-construction-team.jpg", title: "OB3 River Niger HDD Crossing Completion Team" },
    { src: "/pictures/hero-slider/akk-cover-photo.jpg", title: "AKK Pipeline Crossing Project" },
    { src: "/pictures/hero-slider/drilling-rig-cover-photo.jpg", title: "Heavy HDD Rig Land-to-Sea Crossing" },
    { src: "/pictures/hero-slider/drilling-rig-03.jpg", title: "HDD Drilling Rig Operations & High-Pressure Mud Line" },
    { src: "/pictures/hero-slider/offshore-hdd-project.jpg", title: "Offshore HDD Project Operations" },
  ];

  const heroItems = [];
  for (const slide of heroSlidePaths) {
    const img = await uploadLocalImage(slide.src);
    if (img) {
      heroItems.push({
        _key: genKey('hero-slide'),
        _type: 'galleryItem',
        image: img,
        title: slide.title,
      });
    }
  }

  // Build overview galleries with uploaded image assets
  const overviewGalleriesData = [
    {
      categoryTitle: "PCE Construction Teams & Field Engineers",
      items: [
        { src: "/pictures/hero-slider/ob3-02-team.jpg", title: "OB3 HDD River Niger Crossing Construction Team" },
        { src: "/pictures/home-page/engineering-teams-new.jpg", title: "PCE Nigeria Engineering & Construction Specialist Team" },
        { src: "/pictures/hero-slider/construction-team-02.jpg", title: "PCE Field Construction Team on Site" },
        { src: "/pictures/hero-slider/ob3-construction-team.jpg", title: "OB3 Project Construction Team Celebration" },
        { src: "/pictures/hero-slider/team-in-suits.jpg", title: "PCE Executive & Management Team" },
      ]
    },
    {
      categoryTitle: "Nigeria-based HDD Rigs & Pipe-Handling Capability",
      items: [
        { src: "/pictures/hero-slider/drilling-rig-cover-photo.jpg", title: "1200t / 500t Heavy HDD Drilling Rig System" },
        { src: "/pictures/hero-slider/drilling-rig-03.jpg", title: "HDD Drilling Rig Operations & High-Pressure Mud Line" },
        { src: "/pictures/hero-slider/side-bomb.jpg", title: "Heavy Pipe-Handling Machine & Boom Capability" },
        { src: "/pictures/hero-slider/excavator.jpg", title: "Heavy Excavator Fleet & Pipeline Field Support" },
        { src: "/pictures/hero-slider/air-compression.jpg", title: "High-Pressure Air Compressor System & Site Equipment" },
      ]
    },
    {
      categoryTitle: "PCE Equipment & Materials Yard in Nigeria",
      items: [
        { src: "/pictures/equipment/main-equipments-cover-photo.jpg", title: "PCE Main Equipment & Materials Yard (Aerial View)" },
        { src: "/pictures/equipment/equipment-02.png", title: "Equipment & Materials Stock in Nigeria Yard" },
        { src: "/pictures/product-image/CMC.jpg", title: "BRSCMC Drilling Fluid Product Supply" },
        { src: "/pictures/product-image/Bentonite.png", title: "BRSBENT High-Yield Bentonite Product Supply" },
        { src: "/pictures/equipment/equipment-05.png", title: "Pipeline Supplies & Materials Stockpile" },
      ]
    }
  ];

  const glanceStatsPopulated = [];
  // These EXACTLY match the stats array in features/home/components/overview.tsx
  const statDefs = [
    { number: '150+', label: 'People across five specialist construction teams', coverPath: '/pictures/hero-slider/ob3-02-team.jpg', galIdx: 0 },
    { number: '1200t/500t/500t', label: 'Nigeria-based HDD rig and pipe-handling capability', coverPath: '/pictures/hero-slider/drilling-rig-cover-photo.jpg', galIdx: 1 },
    { number: '', label: 'Equipment & Materials in Nigeria', coverPath: '/pictures/equipment/main-equipments-cover-photo.jpg', galIdx: 2 },
  ];

  for (const def of statDefs) {
    const coverImg = await uploadLocalImage(def.coverPath);
    const galData = overviewGalleriesData[def.galIdx];
    const galItems = [];
    for (const item of galData.items) {
      const imgAsset = await uploadLocalImage(item.src);
      if (imgAsset) {
        galItems.push({
          _key: genKey('galitem'),
          _type: 'galleryItem',
          image: imgAsset,
          title: item.title,
        });
      }
    }
    glanceStatsPopulated.push({
      _key: genKey('stat'),
      _type: 'statItem',
      number: def.number,
      label: def.label,
      ...(coverImg ? { image: coverImg } : {}),
      gallery: {
        _type: 'gallery',
        categoryTitle: galData.categoryTitle,
        items: galItems,
      },
    });
  }

  // 1. Home Page Singleton
  const homeDoc = {
    _type: 'homePage',
    _id: 'homePage',
    heroTagline: 'HDD & PIPELINE EPC CONTRACTOR',
    heroHeadline: 'HDD Crossing.\nEPC for Pipeline.',
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
    heroSlides: {
      _type: 'gallery',
      categoryTitle: 'Home Hero Slideshow',
      items: heroItems,
    },
    glanceTagline: 'PCE AT A GLANCE',
    glanceHeading: 'Specialist People. Field-ready Resources in Nigeria. Proven Capability.',
    glanceBody: 'PCE combines heavy HDD rigs, specialized mud recycling systems, and experienced field personnel for high-stakes pipeline installations.',
    glanceStats: glanceStatsPopulated,
    capabilitiesSection: {
      _type: 'sectionBlock',
      tagline: 'OUR CAPABILITIES',
      heading: 'Four Capabilities. One Project Objective.',
      headingColor: 'orange',
      body: makeBlockContent('Integrated HDD engineering, 52km pipeline EPC construction, BPDS subsurface detection, and specialist equipment technical support.'),
      bullets: [
        'Horizontal Directional Drilling (HDD) up to 48-inch pipeline diameter',
        '52km Pipeline EPC turnkey construction',
        '3D Buried Pipeline Detection System (BPDS)',
        'Equipment yard & technical fleet in Nigeria',
      ],
      buttonText: 'Explore Our Capabilities',
      buttonLink: '/capabilities',
    },
    featuredSection: {
      _type: 'sectionBlock',
      tagline: 'FEATURED CASE STUDIES',
      heading: 'Landmark Crossings & Major Infrastructure Delivery',
      headingColor: 'navy',
      body: makeBlockContent('PCE has successfully executed West Africa\'s most challenging trenchless river crossings, including the 48-inch AKK River Niger crossing and the 48-inch OB3 River Niger crossing.'),
      buttonText: 'View All Projects',
      buttonLink: '/projects',
    },
    featuredProjects: [
      { _key: genKey('ref'), _type: 'reference', _ref: 'project-akk-river-niger' },
      { _key: genKey('ref'), _type: 'reference', _ref: 'project-ob3-river-niger' },
    ],
    equipmentSection: {
      _type: 'sectionBlock',
      tagline: 'EQUIPMENT & TECHNOLOGY FLEET',
      heading: 'Nigeria-based 1200t & 500t HDD Rigs and Support Fleet',
      headingColor: 'navy',
      body: makeBlockContent('Our equipment inventory in Nigeria includes heavy-duty drilling rigs, high-pressure mud pumps, closed-loop mud recycling plants, and electronic steering tool guidance systems.'),
      buttonText: 'Explore Equipment Fleet',
      buttonLink: '/equipment-technology',
    },
    ctaSection: {
      _type: 'sectionBlock',
      tagline: 'START A PROJECT',
      heading: 'Have a complex crossing or pipeline requirement?',
      headingColor: 'orange',
      body: makeBlockContent('Share the route, constraint, and project objective. Early-stage enquiries are welcome—we will help identify the technical information needed to move forward.'),
      buttonText: 'Start a Project Enquiry',
      buttonLink: '/contact',
    },
    seo: {
      _type: 'seo',
      metaTitle: 'PCE Nigeria — Power & Construction Engineering',
      metaDescription: 'West Africa premier trenchless HDD river crossing contractor, pipeline EPC builder, and drilling fluids supplier.',
    },
  };
  await saveDoc(homeDoc);

  // 2. Company Page Singleton
  // Upload company page images
  const companyOb3Img = await uploadLocalImage('/pictures/company/ob3-wilding-main-pipeline.jpg');
  const companySpecEngImg = await uploadLocalImage('/pictures/company/specialist-enginering.jpg');
  const companyEpcImg = await uploadLocalImage('/pictures/company/integrated-pipeline-epc.jpg');
  const companyGlobalImg = await uploadLocalImage('/pictures/company/global-resources.jpg');
  const companyStdImg = await uploadLocalImage('/pictures/company/standards.jpg');
  const companyExpImg = await uploadLocalImage('/pictures/company/experience.jpg');
  const companySpecPipe1Img = await uploadLocalImage('/pictures/company/specialist-pipe.jpg');
  const companySpecPipe2Img = await uploadLocalImage('/pictures/company/specialist-pipe-2.jpg');

  const companyDoc = {
    _type: 'companyPage',
    _id: 'companyPage',
    // Matches features/company/components/company-hero.tsx
    heroHeadline: 'Built for complex pipeline delivery.',
    heroSubtext: 'PCE Nigeria provides integrated pipeline construction and EPC services, with specialist capability in Horizontal Directional Drilling.',
    heroSubtext2: 'From early assessment and engineering through construction, pre-commissioning and commissioning, we bring technical expertise and field resources together around demanding pipeline projects.',
    heroPrimaryBtnText: 'Explore Capabilities',
    heroPrimaryBtnLink: '/capabilities',
    // Matches features/company/components/who-we-are.tsx
    whoWeAreSection: {
      _type: 'sectionBlock',
      tagline: 'Who We Are',
      heading: 'Specialist capability for demanding pipeline HDD Crossing and EPC work.',
      headingColor: 'navy',
      body: makeBlockContent(
        'Complex crossings leave little room for disconnected delivery.\n\nPCE combines pipeline engineering and construction, specialist HDD capability, deep-pipeline location technology and technical resources to support projects from assessment through execution.\n\nOur approach is guided by safety, quality, efficiency and integrity.'
      ),
      buttonText: 'Explore Our Projects',
      buttonLink: '/projects',
    },
    whoWeAreImages: [
      ...(companySpecPipe2Img ? [{ _key: genKey('img'), _type: 'object', image: companySpecPipe2Img, caption: 'Specialist Pipe - Bottom Left' }] : []),
      ...(companySpecPipe1Img ? [{ _key: genKey('img'), _type: 'object', image: companySpecPipe1Img, caption: 'Specialist Pipe - Top Right' }] : []),
    ],
    // Matches features/company/components/overview-capabilities.tsx
    overviewCapabilitiesSection: {
      _type: 'sectionBlock',
      tagline: 'Our Capabilities',
      heading: 'Local delivery capability. Specialist international experience.',
      headingColor: 'navy',
      body: makeBlockContent(
        'PCE Nigeria works in consortium with Lantic on specialist HDD and pipeline delivery, bringing together local operating knowledge, engineering expertise, equipment resources and international project experience.'
      ),
      buttonText: 'See How We Work',
      buttonLink: '/capabilities',
    },
    // Matches bento grid cards in overview-capabilities.tsx
    deliveryBentoCards: [
      {
        _key: genKey('bento'),
        title: 'Local Operating Knowledge',
        description: 'Project experience and field resources supporting execution in Nigeria.',
        image: companyOb3Img,
      },
      {
        _key: genKey('bento'),
        title: 'Specialist HDD Engineering',
        description: 'Precision directional drilling for complex riverbed, roadway, and shoreline crossings.',
        image: companySpecEngImg,
      },
      {
        _key: genKey('bento'),
        title: 'Integrated Pipeline EPC',
        description: 'End-to-end execution covering engineering, pipeline fabrication, pre-commissioning, and testing.',
        image: companyEpcImg,
      },
      {
        _key: genKey('bento'),
        title: 'Global Consortium Resources',
        description: 'Combined equipment fleets, materials logistics, and international project support through the Lantic partnership.',
        image: companyGlobalImg,
      },
    ],
    // Matches features/company/components/experience.tsx
    experienceSection: {
      _type: 'sectionBlock',
      tagline: 'Experience',
      heading: 'Local execution backed by international project experience.',
      headingColor: 'navy',
      body: makeBlockContent(
        "PCE's project record brings together complex pipeline and HDD experience in Nigeria and international markets.\n\nFrom major River Niger crossings in Nigeria to pipeline and HDD projects in Thailand and China, that experience informs how we approach difficult geology, critical infrastructure and demanding execution requirements."
      ),
      buttonText: 'Explore Our Projects',
      buttonLink: '/projects',
    },
    // Matches features/company/components/our-direction.tsx
    visionMissionSection: {
      _type: 'sectionBlock',
      tagline: 'Our Direction',
      heading: 'Engineering excellence with a clear ambition.',
      headingColor: 'navy',
      body: makeBlockContent(
        'Our Vision: To become a globally recognised leader in HDD and pipeline EPC, known for engineering excellence, safe delivery and sustainable practice.\n\nOur Mission: To provide dependable engineering and construction solutions that exceed client expectations through innovation, efficiency and integrity.'
      ),
    },
    // Matches features/company/components/people-scale.tsx
    peopleScaleSection: {
      _type: 'sectionBlock',
      tagline: 'People & Scale',
      heading: 'The capability starts with the people behind it.',
      headingColor: 'inverse',
      body: makeBlockContent('Specialist expertise, international management experience and field capacity support PCE\'s pipeline and HDD delivery.'),
    },
    peopleScaleStats: [
      { _key: genKey('stat'), _type: 'statItem', number: '150+', label: 'People across five construction teams' },
      { _key: genKey('stat'), _type: 'statItem', number: '8', label: 'HDD experts' },
      { _key: genKey('stat'), _type: 'statItem', number: '20+', label: 'International management personnel' },
      { _key: genKey('stat'), _type: 'statItem', number: '10+', label: 'Technicians' },
      { _key: genKey('stat'), _type: 'statItem', number: '24+', label: 'Operations staff' },
    ],
    // Matches features/company/components/standards.tsx
    standardsSection: {
      _type: 'sectionBlock',
      tagline: 'Standards & Responsibility',
      heading: 'Delivery guided by safety, quality and responsibility.',
      headingColor: 'navy',
      body: makeBlockContent(
        "PCE's registrations, certifications and operating standards support compliant execution across the project lifecycle.\n\nOur approach places safety, environmental care and social responsibility alongside technical performance and delivery."
      ),
      buttonText: 'Explore Safety & Quality',
      buttonLink: '/safety-quality-responsibility',
    },
    standardsImage: companyStdImg,
    experienceImage: companyExpImg,
    seo: {
      _type: 'seo',
      metaTitle: 'Our Company — PCE Nigeria',
      metaDescription: 'Learn about PCE Nigeria, our 20+ years of trenchless engineering history, leadership, and heavy HDD fleet.',
    },
  };
  await saveDoc(companyDoc);

  // 3. Capabilities Page Singleton
  // Matches features/capabilities/components/capabilities-hero.tsx and core-capabilities.tsx
  const capabilitiesDoc = {
    _type: 'capabilitiesPage',
    _id: 'capabilitiesPage',
    heroHeadline: 'Integrated capability for complex pipeline delivery.',
    heroSubtext: 'PCE combines specialist HDD, pipeline EPC, deep-pipeline location technology and technical resources around demanding pipeline projects.',
    heroSubtext2: 'From early assessment and engineering through construction, testing and commissioning, our capabilities are built around the requirements of the route, the crossing and the line.',
    coreCapabilitiesSection: {
      _type: 'sectionBlock',
      tagline: 'OUR CAPABILITIES',
      heading: 'Four Capabilities. One Project Objective.',
      headingColor: 'orange',
      body: makeBlockContent('PCE delivers complex pipeline and HDD crossing projects through four integrated capabilities, each supported by specialist engineering, technology and field resources.'),
    },
    capabilitiesOrder: [
      { _key: genKey('capref'), _type: 'reference', _ref: 'capability-hdd' },
      { _key: genKey('capref'), _type: 'reference', _ref: 'capability-epc' },
      { _key: genKey('capref'), _type: 'reference', _ref: 'capability-bpds' },
      { _key: genKey('capref'), _type: 'reference', _ref: 'capability-support' },
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Engineering Capabilities — PCE Nigeria',
      metaDescription: 'Trenchless HDD river crossings, deep pipeline EPC, BPDS subsurface detection, and technical support.',
    },
  };
  await saveDoc(capabilitiesDoc);


  // 4. Equipment Page Singleton
  // Upload equipment capacity section images
  const eqCapImg1 = await uploadLocalImage('/pictures/equipment/86c3ba14ac08b1e273a3104b60a24efc.jpg');
  const eqCapImg2 = await uploadLocalImage('/pictures/equipment/8e21cc64655f27a26e938c224b26b924.jpg');
  const eqCapImg3 = await uploadLocalImage('/pictures/equipment/908122977b82673480d072587ad56daf.jpg');
  const eqSupportImg1 = await uploadLocalImage('/pictures/equipment/91903d3f483647597b5364f08e4e7007.jpg');
  const eqSupportImg2 = await uploadLocalImage('/pictures/equipment/e4718ab6567102f62eba9b2f0406e17f.jpg');
  const eqSupportImg3 = await uploadLocalImage('/pictures/home-page/equipment-08.jpg');

  const equipmentDoc = {
    _type: 'equipmentPage',
    _id: 'equipmentPage',
    // Matches features/equipment/components/et-hero.tsx
    heroHeadline: 'The Right Equipment Changes What Is Possible.',
    heroSubtext: 'PCE deploys large-scale HDD rigs, pipe-handling equipment, drilling-fluid systems, guidance technology and supporting plant for demanding pipeline crossings.',
    heroSubtext2: 'Our resources are selected and configured around the route, ground conditions, pipeline and crossing method.',
    heroPrimaryBtnText: 'Discuss Your Crossing',
    // Matches features/equipment/components/equipment-capacity.tsx
    capacitySection: {
      _type: 'sectionBlock',
      tagline: 'Equipment Capacity',
      heading: 'Scale matters. Control matters more.',
      headingColor: 'navy',
      body: makeBlockContent('Large equipment creates capacity. Disciplined engineering, guidance, drilling-fluid management and field coordination turn that capacity into a successful crossing.'),
      buttonText: 'Explore Our HDD Capability',
      buttonLink: '/capabilities',
    },
    capacityKeyStats: [
      { _key: genKey('ks'), label: '500t', description: 'HDD rig capacity' },
      { _key: genKey('ks'), label: '500t', description: 'Pipe-handling capacity' },
      { _key: genKey('ks'), label: '3', description: 'ParaTrack 2 systems' },
      { _key: genKey('ks'), label: '3', description: 'F5 walkover systems' },
    ],
    capacityImages: [
      ...(eqCapImg1 ? [{ _key: genKey('ceq'), _type: 'galleryItem', image: eqCapImg1, title: 'HDD Rig Fleet 1' }] : []),
      ...(eqCapImg2 ? [{ _key: genKey('ceq'), _type: 'galleryItem', image: eqCapImg2, title: 'HDD Rig Fleet 2' }] : []),
      ...(eqCapImg3 ? [{ _key: genKey('ceq'), _type: 'galleryItem', image: eqCapImg3, title: 'HDD Rig Fleet 3' }] : []),
    ],
    // Matches features/equipment/components/support.tsx
    supportSection: {
      _type: 'sectionBlock',
      tagline: 'TECHNICAL SUPPORT',
      heading: 'Equipment backed by HDD expertise.',
      headingColor: 'navy',
      body: makeBlockContent(
        'The value of specialist equipment depends on how it is selected, configured and used. Support is aligned with project requirements, equipment configuration and availability.\n\nPCE supports HDD requirements with:'
      ),
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
      ...(eqSupportImg1 ? [{ _key: genKey('si'), _type: 'galleryItem', image: eqSupportImg1, title: 'Equipment Support 1' }] : []),
      ...(eqSupportImg2 ? [{ _key: genKey('si'), _type: 'galleryItem', image: eqSupportImg2, title: 'Equipment Support 2' }] : []),
      ...(eqSupportImg3 ? [{ _key: genKey('si'), _type: 'galleryItem', image: eqSupportImg3, title: 'Equipment Support 3' }] : []),
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Equipment & Rig Fleet — PCE Nigeria',
      metaDescription: '500t and 1200t heavy HDD drilling rigs, mud recycling systems, and electronic tracking fleet.',
    },
  };
  await saveDoc(equipmentDoc);

  // 5. Safety Quality Page Singleton
  // Matches features/safety-quality/components/safety-hero.tsx
  const safetyDoc = {
    _type: 'safetyQualityPage',
    _id: 'safetyQualityPage',
    heroHeadline: 'Dependable execution begins with clear standards.',
    heroSubtext: 'Safety, quality, efficiency and integrity guide PCE from early assessment through construction, testing and commissioning. Responsible delivery means protecting people, maintaining technical standards and considering the environments and communities around the work.',
    // Matches features/safety-quality/components/safety.tsx
    safetySection: {
      _type: 'sectionBlock',
      tagline: 'Safety',
      heading: 'Protecting people through every stage of delivery.',
      headingColor: 'navy',
      body: makeBlockContent(
        'Complex pipeline work brings people, heavy equipment, technical interfaces and changing field conditions together. PCE places safety across the project lifecycle—from assessment and engineering through mobilisation, construction, testing and commissioning.\n\nSafety is treated as part of how the work is planned and delivered—not as a separate activity at the end.'
      ),
      bullets: [
        'Understand the Work — Consider project conditions, technical requirements and potential field risks before execution.',
        'Prepare for Execution — Align personnel, equipment and site requirements with the planned work.',
        'Maintain Field Awareness — Respond to changing site conditions and information as execution progresses.',
        'Complete with Control — Carry safety and technical requirements through testing, completion and handover.',
      ],
    },
    // Matches features/safety-quality/components/quality.tsx
    qualitySection: {
      _type: 'sectionBlock',
      tagline: 'QUALITY',
      heading: 'Quality from engineering through testing and handover.',
      headingColor: 'navy',
      body: makeBlockContent(
        'PCE applies quality control across the full project lifecycle — from engineering development through pipeline fabrication, construction, testing and commissioning.'
      ),
      bullets: [
        'Engineering — Develop the technical basis, method and execution requirements.',
        'Fabrication — Prepare pipeline components and assemblies according to project requirements.',
        'Welding & NDT — Execute welding and non-destructive testing as part of pipeline construction.',
        'Hydrotesting — Test completed pipeline sections as required before operation.',
        'Coating — Protect pipeline surfaces and completed work according to project requirements.',
        'Pre-Commissioning & Commissioning — Verify and prepare completed systems for handover and operation.',
      ],
    },
    // Matches features/safety-quality/components/certification.tsx
    certificationSection: {
      _type: 'sectionBlock',
      tagline: 'STANDARDS & CERTIFICATION',
      heading: 'Supporting compliant project delivery.',
      headingColor: 'navy',
      body: makeBlockContent(
        "PCE's registrations and certifications support execution across the project lifecycle.\n\nStandards & Certifications: NMDPRA | ISO | Technical Certification\n\nSpecific certification details and applicable project documentation should be confirmed with PCE as part of the qualification or project-enquiry process."
      ),
    },
    // Matches features/safety-quality/components/environmental-care.tsx
    environmentalSection: {
      _type: 'sectionBlock',
      tagline: 'ENVIRONMENTAL CARE',
      heading: 'Protecting sensitive river basins and coastal ecosystems.',
      headingColor: 'navy',
      body: makeBlockContent(
        'We prioritize environmental preservation by deploying closed-loop mud recycling plants that reclaim up to 95% of drilling fluid, preventing slurry discharge into rivers and wetlands.\n\nFollowing drilling completion, our teams execute comprehensive site restoration and environmental remediation.'
      ),
      bullets: [
        'Closed-loop slurry recycling to prevent drilling fluid discharge into rivers',
        'Eco-friendly biodegradable drilling fluid additives',
        'Complete land restoration and post-drilling site cleanup',
      ],
    },
    seo: {
      _type: 'seo',
      metaTitle: 'Safety, Quality & Responsibility — PCE Nigeria',
      metaDescription: 'HSE safety standards, ISO quality compliance, and environmental protection practices at PCE Nigeria.',
    },
  };
  await saveDoc(safetyDoc);


  // 6. Projects Page Singleton
  const routeImg1 = await uploadLocalImage('/pictures/hero-slider/akk-cover-photo.jpg');
  const routeImg2 = await uploadLocalImage('/pictures/hero-slider/offshore-hdd-project.jpg');
  const routeImg3 = await uploadLocalImage('/pictures/hero-slider/drilling-rig-03.jpg');

  const projectsDoc = {
    _type: 'projectsPage',
    _id: 'projectsPage',
    introHeadline: 'Featured HDD & Pipeline Projects',
    introSubtext: 'Explore our completed river crossings, offshore landfalls, and major pipeline EPC construction projects across Nigeria, Thailand, and China.',
    heroSlides: {
      _type: 'gallery',
      categoryTitle: 'Featured Projects Gallery',
      items: heroItems,
    },
    routeCards: [
      {
        _key: genKey('route'),
        title: 'Major River Crossings',
        description: 'Trenchless installation under wide rivers like River Niger and Escravos River with pullback forces up to 1,200 tons.',
        image: routeImg1,
      },
      {
        _key: genKey('route'),
        title: 'Wetland & Swamp Terrain',
        description: 'Specialized amphibious drilling equipment and mud recycling barges engineered for mangrove swamps.',
        image: routeImg2,
      },
      {
        _key: genKey('route'),
        title: 'Hard Rock & Mixed Geology',
        description: 'High-torque mud motors, roller cone hole openers, and high-pressure mud pumps for deep granite formations.',
        image: routeImg3,
      },
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Projects & Case Studies — PCE Nigeria',
      metaDescription: 'Discover our HDD river crossings, offshore landfalls, and pipeline EPC projects across Africa and Asia.',
    },
  };
  await saveDoc(projectsDoc);

  // 7. Products Page Singleton
  const productsDoc = {
    _type: 'productsPage',
    _id: 'productsPage',
    heroHeadline: 'Brighter Star Drilling Fluids & Mud Additives',
    heroSubtext: 'High-performance viscosifiers, fluid loss control polymers, and shale stabilizers formulated for HDD and deep drilling applications.',
    aboutSection: {
      _type: 'sectionBlock',
      tagline: 'DRILLING FLUIDS PORTFOLIO',
      heading: 'Engineered mud chemicals for unstable soil and rock formations.',
      headingColor: 'navy',
      body: makeBlockContent(
        'Brighter Star drilling fluid additives are custom-formulated to meet the demands of deep horizontal directional drilling. From high-yield API bentonite to specialized biopolymers, our products optimize hole stability and fluid loss control.'
      ),
      bullets: [
        'BRSBENT SQ high-yield API activated bentonite',
        'BRSCMC fluid loss control polymer for filtration reduction',
        'BRSMMH mixed metal hydroxide for high-shear rheology',
        'BRSVR viscosifier & BRSXTG xanthan gum biopolymer',
      ],
    },
    logisticsSection: {
      _type: 'sectionBlock',
      tagline: 'STOCK & LOGISTICS',
      heading: 'Strategic warehouses in Port Harcourt and Lagos for rapid site delivery.',
      headingColor: 'navy',
      body: makeBlockContent(
        'PCE maintains large chemical stock buffers in Port Harcourt and Lagos to support rapid field deployment across West Africa. Our technical mud engineers provide on-site mud testing and rheology optimization.'
      ),
      bullets: [
        'Sufficient stock reserves maintained in Nigeria for instant field delivery',
        'Moisture-proof multi-wall bags and palletized packaging',
        '24/7 technical field support and mud testing laboratory',
      ],
    },
    seo: {
      _type: 'seo',
      metaTitle: 'Drilling Fluids & Products — PCE Nigeria',
      metaDescription: 'Brighter Star premium drilling mud chemicals, bentonite, CMC, and polymer additives.',
    },
  };
  await saveDoc(productsDoc);

  // 8. News & Insights Page Singleton
  const newsDoc = {
    _type: 'newsInsightsPage',
    _id: 'newsInsightsPage',
    heroHeadline: 'News & Technical Insights',
    heroSubtext: 'Latest announcements, project completion milestones, and technical articles from PCE Engineering.',
    seo: {
      _type: 'seo',
      metaTitle: 'News & Technical Insights — PCE Nigeria',
      metaDescription: 'Latest news, project milestones, and technical articles from PCE Nigeria.',
    },
  };
  await saveDoc(newsDoc);

  // 9. Resources Page Singleton
  const resourcesDoc = {
    _type: 'resourcesPage',
    _id: 'resourcesPage',
    heroHeadline: 'Resources & Downloads',
    heroSubtext: 'Download corporate profiles, technical specification sheets (TDS), safety data sheets (SDS), and product manuals.',
    seo: {
      _type: 'seo',
      metaTitle: 'Resources & Downloads — PCE Nigeria',
      metaDescription: 'Download technical data sheets, safety data sheets, product manuals, and corporate brochures.',
    },
  };
  await saveDoc(resourcesDoc);

  // 10. Contact Page Singleton (Updated with Wan Yang & Xu Liangkui numbers)
  const contactDoc = {
    _type: 'contactPage',
    _id: 'contactPage',
    heroHeadline: 'Get in Touch with Our Engineering Team',
    heroSubtext: 'Contact PCE Nigeria for project inquiries, technical consultations, or mud chemical orders.',
    officeAddress: 'Port Harcourt & Lagos Offices, Nigeria',
    phoneNumbers: ['+234 707 412 6596', '+234 701 373 2816'],
    emailAddresses: ['info@pcenigeria.com', 'wanyang@pcenigeria.com', 'xuliangkui@pcenigeria.com'],
    socialLinks: [
      { _key: genKey('soc'), platform: 'LinkedIn', url: 'https://linkedin.com/company/pcenigeria' },
      { _key: genKey('soc'), platform: 'Twitter', url: 'https://twitter.com/pcenigeria' },
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Contact Us — PCE Nigeria',
      metaDescription: 'Get in touch with PCE Nigeria for HDD engineering projects, technical support, and product inquiries.',
    },
  };
  await saveDoc(contactDoc);

  // 11. Navigation Singleton
  const navDoc = {
    _type: 'navigation',
    _id: 'navigation',
    mainLinks: [
      { _key: genKey('nav'), title: 'Home', href: '/' },
      { _key: genKey('nav'), title: 'Our Company', href: '/our-company' },
      { _key: genKey('nav'), title: 'Capabilities', href: '/capabilities' },
      { _key: genKey('nav'), title: 'Equipment & Technology', href: '/equipment-technology' },
      { _key: genKey('nav'), title: 'Safety & Quality', href: '/safety-quality-responsibility' },
      { _key: genKey('nav'), title: 'Projects', href: '/projects' },
      { _key: genKey('nav'), title: 'Products', href: '/products' },
      { _key: genKey('nav'), title: 'News & Insights', href: '/news-insights' },
      { _key: genKey('nav'), title: 'Resources', href: '/resources' },
      { _key: genKey('nav'), title: 'Contact', href: '/contact' },
    ],
    companyMenu: [
      { _key: genKey('cnav'), title: 'Overview', href: '/our-company', description: 'Learn about PCE Nigeria and our history' },
      { _key: genKey('cnav'), title: 'Safety & Quality', href: '/safety-quality-responsibility', description: 'Zero-harm HSE and ISO quality commitment' },
      { _key: genKey('cnav'), title: 'Equipment & Technology', href: '/equipment-technology', description: 'Our heavy HDD rig fleet and guidance systems' },
    ],
    capabilitiesMenu: [
      { _key: genKey('capnav'), title: 'HDD River Crossings', href: '/capabilities#hdd', description: 'Trenchless drilling across major rivers' },
      { _key: genKey('capnav'), title: 'Deep Pipeline EPC', href: '/capabilities#epc', description: 'Full pipeline engineering, procurement & construction' },
      { _key: genKey('capnav'), title: 'BPDS Subsurface Detection', href: '/capabilities#bpds', description: 'Subsurface pipeline path detection' },
      { _key: genKey('capnav'), title: 'Technical Support', href: '/capabilities#support', description: 'Rig maintenance & field technical services' },
    ],
    productsMenu: [
      { _key: genKey('pnav'), title: 'Products Overview', subtitle: 'Drilling Mud Portfolio', href: '/products', description: 'Brighter Star Drilling Fluids' },
      { _key: genKey('pnav'), title: 'BRSBENT SQ', subtitle: 'Activated Bentonite', href: '/products/brsbent-sq', description: 'High-yield API grade bentonite' },
      { _key: genKey('pnav'), title: 'BRSCMC', subtitle: 'Carboxymethyl Cellulose', href: '/products/brscmc', description: 'Fluid loss control polymer' },
      { _key: genKey('pnav'), title: 'BRSMMH', subtitle: 'Mixed Metal Hydroxide', href: '/products/brsmmh', description: 'Inorganic rheology modifier' },
      { _key: genKey('pnav'), title: 'BRSVR', subtitle: 'Viscosifier Polymer', href: '/products/brsvr', description: 'High-viscosity polymer' },
      { _key: genKey('pnav'), title: 'BRSXTG', subtitle: 'Xanthan Gum', href: '/products/brsxtg', description: 'Premium biopolymer viscosifier' },
    ],
  };
  await saveDoc(navDoc);

  // 12. Global Settings Singleton
  const settingsDoc = {
    _type: 'globalSettings',
    _id: 'globalSettings',
    siteTitle: 'PCE Nigeria — Power & Construction Engineering',
    generalEmail: 'info@pcenigeria.com',
    footerContacts: [
      { _key: genKey('fc'), name: 'Wan Yang', phone: '+234 707 412 6596', email: 'wanyang@pcenigeria.com' },
      { _key: genKey('fc'), name: 'Xu Liangkui', phone: '+234 701 373 2816', email: 'xuliangkui@pcenigeria.com' },
    ],
    socialLinks: [
      { _key: genKey('soc'), platform: 'LinkedIn', url: 'https://linkedin.com/company/pcenigeria' },
      { _key: genKey('soc'), platform: 'Twitter', url: 'https://twitter.com/pcenigeria' },
    ],
    footerTagline: '© 2026 PCE Nigeria Ltd. All Rights Reserved. Heavy HDD & Pipeline Engineering.',
    defaultSeo: {
      _type: 'seo',
      metaTitle: 'PCE Nigeria — Power & Construction Engineering',
      metaDescription: 'West Africa premier trenchless HDD river crossing contractor, pipeline EPC builder, and drilling fluids supplier.',
    },
  };
  await saveDoc(settingsDoc);
}

async function migrateResourceCategories() {
  console.log('\n--- Migrating Resource Categories ---');

  const categoriesData = [
    {
      _id: 'resource-category-company',
      label: 'Company Profile & Manuals',
      slug: 'company',
      items: [
        {
          title: '2026 PCE Corporate Profile',
          relativePath: '/resources/01-PROFILE_PCE Nigeria LTD_2026-compressed.pdf',
          description: 'Comprehensive company profile detailing PCE Nigeria engineering operations, HDD capabilities, equipment fleet, and project track record.',
        },
        {
          title: 'Brighter Star Drilling Fluids Product Manual',
          relativePath: '/resources/Brighter_Star_Drilling_Fluids_Product_Manual_EN.pdf',
          description: 'Complete product catalog and technical application manual for Brighter Star drilling fluids, bentonites, and biopolymers.',
        },
      ],
    },
    {
      _id: 'resource-category-tds',
      label: 'Technical Data Sheets (TDS)',
      slug: 'tds',
      items: [
        {
          title: 'BRSBENT SQ Technical Data Sheet (TDS)',
          relativePath: '/resources/BRSBENT_SQ_Product_Data_Sheet.pdf',
          description: 'Technical specifications, physical properties, performance characteristics, and dosage instructions for BRSBENT SQ high-yield bentonite.',
        },
        {
          title: 'BRSCMC Technical Data Sheet (TDS)',
          relativePath: '/resources/BRSCMC_Technical_Data_Sheet.pdf',
          description: 'Technical specifications for BRSCMC carboxymethyl cellulose fluid loss control polymer.',
        },
        {
          title: 'BRSMMH Product Data Sheet (TDS)',
          relativePath: '/resources/BRSMMH_Product_Data_Sheet.pdf',
          description: 'Technical data sheet for BRSMMH mixed metal hydroxide inorganic rheology modifier.',
        },
        {
          title: 'BRSVR Technical Data Sheet (TDS)',
          relativePath: '/resources/BRSVR_Technical_Data_Sheet.pdf',
          description: 'Technical specifications for BRSVR high-viscosity viscosifier polymer.',
        },
        {
          title: 'BRSXTG Technical Data Sheet (TDS)',
          relativePath: '/resources/BRSXTG_Technical_Data_Sheet.pdf',
          description: 'Technical data sheet for BRSXTG premium xanthan gum biopolymer.',
        },
      ],
    },
    {
      _id: 'resource-category-sds',
      label: 'Safety Data Sheets (SDS)',
      slug: 'sds',
      items: [
        {
          title: 'BRSBENT SQ Safety Data Sheet (SDS)',
          relativePath: '/resources/BRSBENT_SQ_Safety_Data_Sheet.pdf',
          description: 'Safety data sheet containing hazard identification, first aid measures, storage, and handling guidelines for BRSBENT SQ.',
        },
        {
          title: 'BRSCMC Safety Data Sheet (SDS)',
          relativePath: '/resources/BRSCMC_Safety_Data_Sheet.pdf',
          description: 'Safety data sheet containing hazard identification and handling instructions for BRSCMC.',
        },
        {
          title: 'BRSMMH Safety Data Sheet (SDS)',
          relativePath: '/resources/BRSMMH_Safety_Data_Sheet.pdf',
          description: 'Safety data sheet for BRSMMH mixed metal hydroxide.',
        },
        {
          title: 'BRSVR Safety Data Sheet (SDS)',
          relativePath: '/resources/BRSVR_Safety_Data_Sheet.pdf',
          description: 'Safety data sheet for BRSVR viscosifier polymer.',
        },
        {
          title: 'BRSXTG Safety Data Sheet (SDS)',
          relativePath: '/resources/BRSXTG_Safety_Data_Sheet.pdf',
          description: 'Safety data sheet for BRSXTG xanthan gum biopolymer.',
        },
      ],
    },
  ];

  for (const cat of categoriesData) {
    const items = [];
    for (const item of cat.items) {
      const fileAsset = await uploadLocalFile(item.relativePath);
      items.push({
        _key: genKey('item'),
        title: item.title,
        description: item.description,
        ...(fileAsset ? { file: fileAsset } : {}),
      });
    }

    const doc = {
      _type: 'resourceCategory',
      _id: cat._id,
      label: cat.label,
      slug: { _type: 'slug', current: cat.slug },
      items,
      seo: {
        _type: 'seo',
        metaTitle: `${cat.label} — PCE Nigeria Resources`,
        metaDescription: `Download ${cat.label} from PCE Nigeria.`,
      },
    };

    await saveDoc(doc);
  }
}

async function migrateEquipmentCategories() {
  console.log('\n--- Migrating Equipment Categories ---');

  const categories = [
    {
      _id: 'equipment-category-major',
      name: 'Major HDD equipment',
      slug: 'major',
      tagline: 'DRILL & HANDLE',
      description: 'Drilling and pipe-handling capacity for demanding crossings.',
      items: [
        {
          id: 'xcmg-500',
          number: '01',
          title: 'XCMG 500-ton HDD Rig',
          description: 'High-capacity HDD equipment for demanding crossing requirements.',
          imagePath: '/pictures/equipment/009061ab6e7649c67058fc722baea717.jpg',
        },
        {
          id: 'gd-5000',
          number: '02',
          title: 'GD-5000L HDD Rig',
          description: 'Large-scale drilling capacity for specialist HDD operations.',
          imagePath: '/pictures/equipment/gd-5000.jpg',
        },
        {
          id: 'gd-12000',
          number: '03',
          title: 'GD-12000L HDD Rig',
          description: 'Heavy-duty drilling capacity for major HDD installations.',
          imagePath: '/pictures/equipment/xcmg-500.jpg',
        },
        {
          id: 'pipe-handle',
          number: '04',
          title: '500-ton Pipe-Handling Machine',
          description: 'Pipe-handling capacity to support controlled pipeline movement during installation and pullback.',
          imagePath: '/pictures/home-page/pipe-handling-capacity.jpg',
        },
      ],
    },
    {
      _id: 'equipment-category-fluid',
      name: 'Drilling-Fluid Systems',
      slug: 'fluid',
      tagline: 'MIX & CIRCULATE',
      description: 'Manage the fluid. Protect the bore.',
      subtext: 'Drilling-fluid performance is a critical part of HDD execution. PCE maintains mud systems, pumps, tanks and specialist materials to support drilling, bore preparation and pullback operations.',
      items: [
        {
          id: 'triplex-pump',
          number: '01',
          title: '4 Mud Systems',
          description: 'High-capacity mud mixing and agitation units.',
          imagePath: '/pictures/home-page/equipment-03.jpg',
        },
        {
          id: 'mixing-plant',
          number: '02',
          title: '6 Mud-Pump Sets',
          description: 'High-pressure triplex mud pumps for continuous fluid circulation.',
          imagePath: '/pictures/equipment/equipment-03.png',
        },
        {
          id: 'recycler',
          number: '03',
          title: '16 Mud Tanks',
          description: 'Closed-loop solids control and mud recycling tanks.',
          imagePath: '/pictures/home-page/equipment-04.jpg',
        },
        {
          id: 'storage-tanks',
          number: '04',
          title: '2000+ Bentonite Resources',
          description: 'High-yield API bentonite and polymer reserves on site.',
          imagePath: '/pictures/equipment/389706f272e7f4d1bcf7d0d033cbbbde.jpg',
        },
      ],
    },
    {
      _id: 'equipment-category-bore',
      name: 'Drilling & Bore-Preparation Tools',
      slug: 'bore',
      tagline: 'REAM & TOOL',
      description: 'Build the bore for the pipeline that follows.',
      subtext: 'PCE HDD resources include the drilling and bore-preparation tools required across pilot drilling, reaming and pullback.',
      items: [
        {
          id: 'rock-reamer',
          number: '01',
          title: 'Reamers',
          description: 'Tools configured for progressive bore enlargement according to pipeline and ground requirements.',
          imagePath: '/pictures/home-page/equipment-05.jpg',
        },
        {
          id: 'drill-pipes',
          number: '02',
          title: 'Drilling Rods',
          description: '7km+ of high-torque S135 drilling rods supporting HDD operations.',
          imagePath: '/pictures/equipment/equipment-05.png',
        },
        {
          id: 'mud-motor',
          number: '03',
          title: 'Drill Bits & Mud Motors',
          description: 'Specialist rock bits and downhole mud motors across hard rock formations.',
          imagePath: '/pictures/hero-slider/air-compression.jpg',
        },
        {
          id: 'barrel-reamer',
          number: '04',
          title: 'Ramming Hammer',
          description: 'Pneumatic pipe ramming hammer for auxiliary casing installation.',
          imagePath: '/pictures/home-page/horizontal-drilling-new.jpg',
        },
      ],
    },
    {
      _id: 'equipment-category-pipe',
      name: 'Pipe Movement & Support',
      slug: 'pipe',
      tagline: 'PULL & ROLL',
      description: 'Control the pipeline through pullback.',
      subtext: 'Pipeline installation requires coordinated handling and support as the prepared pipe string moves toward and through the bore.',
      items: [
        {
          id: 'roller-cradles',
          number: '01',
          title: '100+ Pipeline Rollers',
          description: 'Heavy-duty roller cradles reducing friction during pipe insertion.',
          imagePath: '/pictures/equipment/e0dba7ab00c50a9163fa9f704bcc28dd.jpg',
        },
        {
          id: 'breakout-jaws',
          number: '02',
          title: '2 Side Booms',
          description: 'High-capacity Caterpillar sidebooms for heavy pipe string positioning.',
          imagePath: '/pictures/hero-slider/side-bomb.jpg',
        },
        {
          id: 'sidebooms',
          number: '03',
          title: '5 Excavators',
          description: 'Heavy track excavators for earthworks and trench prep.',
          imagePath: '/pictures/home-page/equipment-06.jpg',
        },
        {
          id: 'pull-heads',
          number: '04',
          title: 'One 500-ton pipe-handling machine',
          description: 'Synchronized push-pull machine assisting long-distance pullbacks.',
          imagePath: '/pictures/home-page/pipe-handling-capacity.jpg',
        },
      ],
    },
    {
      _id: 'equipment-category-guidance',
      name: 'Guidance Technology',
      slug: 'guidance',
      tagline: 'TRACK & ALIGN',
      description: 'Precision beneath the surface.',
      subtext: 'Controlled HDD execution depends on knowing where the bore is—and keeping it aligned with the engineered path.',
      items: [
        {
          id: 'guidance-walkover',
          number: '01',
          title: '3 ParaTrack 2 systems',
          description: 'Magnetic steering guidance tool for complex river crossings.',
          imagePath: '/pictures/home-page/equipment-07.jpg',
        },
        {
          id: 'guidance-gyro',
          number: '02',
          title: '3 F5 walkover systems',
          description: 'Digital walkover guidance systems for shallow and medium depth bores.',
          imagePath: '/pictures/hero-slider/bpds-cover-photo.png',
        },
      ],
    },
  ];

  for (const cat of categories) {
    const items = [];
    for (const item of cat.items) {
      const imgAsset = await uploadLocalImage(item.imagePath);
      items.push({
        _key: genKey('eqitem'),
        id: item.id,
        number: item.number,
        title: item.title,
        description: item.description,
        ...(imgAsset ? { image: imgAsset } : {}),
      });
    }

    const doc = {
      _type: 'equipmentCategory',
      _id: cat._id,
      name: cat.name,
      slug: { _type: 'slug', current: cat.slug },
      tagline: cat.tagline,
      description: cat.description,
      subtext: cat.subtext || '',
      items,
      seo: {
        _type: 'seo',
        metaTitle: `${cat.name} — PCE Nigeria Equipment`,
        metaDescription: cat.description,
      },
    };

    await saveDoc(doc);
  }
}

async function runMigration() {
  try {
    await migrateProjects();
    await migrateNews();
    await migrateProducts();
    await migrateCapabilities();
    await migratePageSingletons();
    await migrateResourceCategories();
    await migrateEquipmentCategories();
    console.log('\n✅ Full migration completed successfully! Clean published singletons with drafts purged.');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
  }
}

runMigration();


