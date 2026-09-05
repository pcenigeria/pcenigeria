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

function makeBlockContent(text: string) {
  if (!text) return [];
  const paragraphs = text.split('\n\n');
  return paragraphs.map((p) => ({
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
  // 1. Create/Replace official published document
  await client.createOrReplace(doc);

  // 2. Delete any existing draft document overlay so Sanity Studio forces sync with published state
  try {
    await client.delete(`drafts.${doc._id}`);
    console.log(`Deleted draft overlay for: drafts.${doc._id}`);
  } catch (e) {
    // ignore if draft doesn't exist
  }
}

async function uploadLocalImage(relativePath?: string): Promise<any> {
  if (!relativePath || !relativePath.startsWith('/')) return null;
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
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
  } catch (err) {
    console.error(`Failed to upload ${relativePath}:`, err);
    return null;
  }
}

async function uploadLocalFile(relativePath?: string): Promise<any> {
  if (!relativePath || !relativePath.startsWith('/')) return null;
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
    return {
      _type: 'file',
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
    };
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
      sections: proj.sections?.map((sec: any) => ({
        _key: genKey('sec'),
        _type: 'sectionBlock',
        tagline: sec.tagline || '',
        heading: sec.heading || '',
        headingColor: sec.headingColor || 'navy',
        body: makeBlockContent(sec.heading || ''),
        bullets: sec.bullets || [],
      })),
      bentoImages: {
        _type: 'gallery',
        categoryTitle: 'Project Gallery',
        items: bentoItems,
      },
    };

    await saveDoc(doc);
  }
}

async function migrateNews() {
  console.log('\n--- Migrating News & Insights Articles ---');
  const articlesList = Object.values(NEWS_DATA);
  for (const article of articlesList) {
    const heroImageAsset = await uploadLocalImage(article.heroImage);

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
      executiveStandard: prod.executiveStandard || '',
      mainFunctions: prod.mainFunctions || [],
      features: prod.features || [],
    };

    await saveDoc(doc);
  }
}

async function migrateCapabilities() {
  console.log('\n--- Migrating Capabilities ---');
  for (const card of CAPABILITIES_CARDS) {
    const detail = CAPABILITIES_DETAILS[card.id];
    const cardImg = await uploadLocalImage(card.image);

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
    glanceStats: [
      { _key: genKey('stat'), _type: 'statItem', number: '150+', label: 'People across five specialist construction teams' },
      { _key: genKey('stat'), _type: 'statItem', number: '1200t/500t/500t', label: 'Nigeria-based HDD rig and pipe-handling capability' },
      { _key: genKey('stat'), _type: 'statItem', number: '20+ Years', label: 'Continuous trenchless operations & project excellence' },
    ],
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
  const bentoImg1 = await uploadLocalImage('/pictures/hero-slider/drilling-rig-cover-photo.jpg');
  const bentoImg2 = await uploadLocalImage('/pictures/hero-slider/drilling-rig-03.jpg');
  const bentoImg3 = await uploadLocalImage('/pictures/hero-slider/ob3-construction-team.jpg');

  const companyDoc = {
    _type: 'companyPage',
    _id: 'companyPage',
    heroHeadline: 'Engineering excellence beneath difficult crossings.',
    heroSubtext: 'PCE combines heavy HDD rigs, specialized mud recycling systems, and experienced field personnel for high-stakes pipeline installations.',
    whoWeAreSection: {
      _type: 'sectionBlock',
      tagline: 'WHO WE ARE',
      heading: 'Leading trenchless crossing contractor in West Africa.',
      headingColor: 'navy',
      body: makeBlockContent(
        'PCE combines heavy HDD rigs, specialized mud recycling systems, and experienced field personnel for high-stakes pipeline installations.\n\nWith over 20 years of continuous trenchless operations across Nigeria and international projects, we deliver complex river crossings and sea landfalls safely and on schedule.'
      ),
      bullets: [
        'Over 20 years of continuous trenchless drilling experience',
        'Fleet of 500-ton and 1200-ton heavy HDD rigs',
        'Proven track record across River Niger, wetland, and coastal environments',
      ],
    },
    deliveryBentoCards: [
      {
        _key: genKey('bento'),
        title: 'Heavy HDD Rig Fleet',
        description: 'Pullback capacities up to 1,200 tons for large-diameter oil and gas pipelines.',
        image: bentoImg1,
      },
      {
        _key: genKey('bento'),
        title: 'Mud Recycling & Solids Control',
        description: 'High-volume closed-loop slurry recovery systems minimizing environmental impact.',
        image: bentoImg2,
      },
      {
        _key: genKey('bento'),
        title: 'Experienced Drilling Team',
        description: 'Over two decades of river crossings, sea landfalls, and hard rock directional drilling.',
        image: bentoImg3,
      },
    ],
    visionMissionSection: {
      _type: 'sectionBlock',
      tagline: 'OUR VISION & MISSION',
      heading: 'Delivering world-class trenchless solutions with safety and precision.',
      headingColor: 'navy',
      body: makeBlockContent(
        "Our mission is to expand West Africa's energy infrastructure through sustainable engineering, cutting-edge directional drilling, and zero-harm environmental stewardship.\n\nWe strive to set the industry standard for pipeline integrity, technical excellence, and workforce safety."
      ),
      bullets: [
        'Zero-harm safety policy across all operations',
        'Executing complex river & sea landfalls on schedule',
        'Pioneering heavy HDD equipment and closed-loop mud recycling in Africa',
      ],
    },
    peopleScaleStats: [
      { _key: genKey('stat'), _type: 'statItem', number: '200+', label: 'Engineers & HDD Specialists' },
      { _key: genKey('stat'), _type: 'statItem', number: '30+', label: 'Major River Crossings Completed' },
      { _key: genKey('stat'), _type: 'statItem', number: '100%', label: 'Project Success & Safety Record' },
    ],
    seo: {
      _type: 'seo',
      metaTitle: 'Our Company — PCE Nigeria',
      metaDescription: 'Learn about PCE Nigeria, our 20+ years of trenchless engineering history, leadership, and heavy HDD fleet.',
    },
  };
  await saveDoc(companyDoc);

  // 3. Capabilities Page Singleton
  const capabilitiesDoc = {
    _type: 'capabilitiesPage',
    _id: 'capabilitiesPage',
    heroHeadline: 'Our Core Engineering Capabilities',
    heroSubtext: 'Comprehensive trenchless drilling, pipeline EPC construction, BPDS subsurface detection, and equipment technical support.',
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
  const equipmentDoc = {
    _type: 'equipmentPage',
    _id: 'equipmentPage',
    heroHeadline: 'Equipment & Rig Fleet',
    heroSubtext: 'Heavy-duty HDD drilling rigs, high-volume mud circulation systems, and continuous electronic tracking equipment.',
    introCopy: 'PCE operates a fleet of heavy HDD rigs up to 1,200 tons pullback capacity, supported by mud recycling plants and guidance technology.',
    supportSection: {
      _type: 'sectionBlock',
      tagline: 'TECHNICAL SUPPORT & MAINTENANCE',
      heading: 'Full lifecycle rig maintenance, mud system calibration, and spare parts supply.',
      headingColor: 'navy',
      body: makeBlockContent(
        'PCE provides end-to-end technical support for directional drilling equipment, including mud pump overhauls, hydraulic system diagnostics, and guidance system calibration.\n\nOur dedicated engineering workshops in Port Harcourt maintain extensive inventories of genuine OEM spare parts for rapid field deployment.'
      ),
      bullets: [
        'On-site field engineers and hydraulic technicians available 24/7',
        'Comprehensive spare parts inventory maintained in Nigeria',
        'Custom rig refurbishment, mud pump overhaul, and guidance system calibration',
      ],
    },
    seo: {
      _type: 'seo',
      metaTitle: 'Equipment & Rig Fleet — PCE Nigeria',
      metaDescription: '500t and 1200t heavy HDD drilling rigs, mud recycling systems, and electronic tracking fleet.',
    },
  };
  await saveDoc(equipmentDoc);

  // 5. Safety Quality Page Singleton
  const safetyDoc = {
    _type: 'safetyQualityPage',
    _id: 'safetyQualityPage',
    heroHeadline: 'Safety, Quality & Responsibility',
    heroSubtext: 'Zero-harm policy, strict quality control procedures, ISO-compliant operations, and environmental protection standards.',
    safetySection: {
      _type: 'sectionBlock',
      tagline: 'SAFETY & HSE',
      heading: 'Uncompromising HSE standards across all drilling and field sites.',
      headingColor: 'navy',
      body: makeBlockContent(
        'Safety is embedded in every phase of our operations. From daily toolbox talks to comprehensive job hazard analyses, PCE ensures a secure work environment for all personnel and host communities.\n\nOur field crews undergo rigorous safety training and adhere strictly to international offshore and onshore drilling protocols.'
      ),
      bullets: [
        'Daily toolbox safety talks and job hazard analysis (JHA)',
        'Personal Protective Equipment (PPE) compliance and certified rigging gear',
        'Spill response containment and emergency action protocols',
      ],
    },
    qualitySection: {
      _type: 'sectionBlock',
      tagline: 'QUALITY CONTROL',
      heading: 'Rigorous engineering quality assurance and pipeline integrity testing.',
      headingColor: 'navy',
      body: makeBlockContent(
        'Quality control at PCE follows strict ISO 9001 standards. We perform non-destructive testing, ultrasonic weld inspections, and continuous mud property monitoring to guarantee pipeline structural integrity.\n\nEvery drill pipe, high-pressure hose, and reamer is tracked and inspected before site mobilization.'
      ),
      bullets: [
        'Ultrasonic weld testing, magnetic particle inspection, and hydro-testing',
        'Real-time mud viscosity and mud weight monitoring',
        'Complete material certification and drill pipe traceability',
      ],
    },
    certificationsSection: {
      _type: 'sectionBlock',
      tagline: 'CERTIFICATIONS & COMPLIANCE',
      heading: 'Certified compliance with international energy and environmental standards.',
      headingColor: 'navy',
      body: makeBlockContent(
        'PCE operates in full compliance with Nigerian and international regulatory frameworks. We maintain active registrations with NIPEX, NUPRC (DPR), and NCDMB, upholding strict Nigerian Content standards.\n\nOur integrated management system aligns with ISO 9001, ISO 14001, and ISO 45001 standards.'
      ),
      bullets: [
        'NIPEX registered oilfield service contractor',
        'ISO 9001, ISO 14001, and ISO 45001 compliant operating management system',
        'Full DPR (NUPRC) and NCDMB regulatory permits',
      ],
    },
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
          imagePath: '/pictures/home-page/equipment-02.jpg',
        },
        {
          id: 'gd-12000',
          number: '03',
          title: 'GD-12000L HDD Rig',
          description: 'Heavy-duty drilling capacity for major HDD installations.',
          imagePath: '/pictures/hero-slider/drilling-rig-cover-photo.jpg',
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


