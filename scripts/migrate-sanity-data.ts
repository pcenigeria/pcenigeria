import fs from 'fs';
import path from 'path';
import { createClient } from '@sanity/client';
import { PROJECTS_DATA } from '../features/projects/data/projects-data';
import { NEWS_DATA } from '../features/news-insights/data/news-data';
import { PRODUCTS_DATA } from '../features/products/data/products-data';
import { CAPABILITIES_CARDS, CAPABILITIES_DETAILS } from '../features/capabilities/data/capabilities-data';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_READ_TOKEN;

if (!projectId || projectId === 'your_sanity_project_id_here' || !token) {
  console.log('----------------------------------------------------');
  console.log('⚠️ Sanity credentials not detected in .env.local.');
  console.log('To run this migration against a live Sanity dataset:');
  console.log('1. Set NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local');
  console.log('2. Set SANITY_API_READ_TOKEN (with write permissions) in .env.local');
  console.log('----------------------------------------------------');
  process.exit(0);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-01-01',
  token,
  useCdn: false,
});

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
        _type: 'sectionBlock',
        tagline: sec.tagline || '',
        heading: sec.heading || '',
        headingColor: sec.headingColor || 'navy',
        bullets: sec.bullets || [],
      })),
      bentoImages: {
        _type: 'gallery',
        categoryTitle: 'Project Gallery',
        items: bentoItems,
      },
    };

    console.log(`Creating project document: ${proj.title}...`);
    await client.createOrReplace(doc);
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

    console.log(`Creating news article document: ${article.title}...`);
    await client.createOrReplace(doc);
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

    console.log(`Creating product document: ${prod.title}...`);
    await client.createOrReplace(doc);
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

    console.log(`Creating capability document: ${card.title}...`);
    await client.createOrReplace(doc);
  }
}

async function migratePageSingletons() {
  console.log('\n--- Migrating Page Singletons & Global Settings ---');

  // 1. Home Page Singleton
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
        _type: 'galleryItem',
        image: img,
        title: slide.title,
      });
    }
  }

  const homeDoc = {
    _type: 'homePage',
    _id: 'homePage',
    glanceHeading: 'PCE AT A GLANCE',
    glanceStats: [
      { _type: 'statItem', number: '1200t/500t/500t', label: 'Maximum Rig Pullback Force' },
      { _type: 'statItem', number: '48 inches', label: 'Largest Pipeline Diameter' },
      { _type: 'statItem', number: '4,060 metres', label: 'Longest Single HDD Length' },
    ],
    capabilitiesIntro: 'Integrated HDD engineering, pipeline EPC, deep pipeline detection, and specialist technical support.',
    heroSlides: {
      _type: 'gallery',
      categoryTitle: 'Home Hero Slideshow',
      items: heroItems,
    },
    featuredProjects: [
      { _type: 'reference', _ref: 'project-akk-river-niger' },
      { _type: 'reference', _ref: 'project-ob3-river-niger' },
    ],
  };
  console.log('Creating homePage singleton...');
  await client.createOrReplace(homeDoc);

  // 2. Company Page Singleton
  const companyDoc = {
    _type: 'companyPage',
    _id: 'companyPage',
    heroHeadline: 'Engineering excellence beneath difficult crossings.',
    heroSubtext: 'PCE combines heavy HDD rigs, specialized mud recycling systems, and experienced field personnel for high-stakes pipeline installations.',
    whoWeAreSection: {
      _type: 'sectionBlock',
      tagline: 'WHO WE ARE',
      heading: 'Leading trenchless crossing contractor in West Africa.',
      bullets: [
        'Over 20 years of continuous trenchless drilling experience',
        'Fleet of 500-ton and 1200-ton heavy HDD rigs',
        'Proven track record across River Niger, wetland, and coastal environments',
      ],
    },
    peopleScaleStats: [
      { _type: 'statItem', number: '200+', label: 'Engineers & HDD Specialists' },
      { _type: 'statItem', number: '30+', label: 'Major River Crossings Completed' },
      { _type: 'statItem', number: '100%', label: 'Project Success & Safety Record' },
    ],
  };
  console.log('Creating companyPage singleton...');
  await client.createOrReplace(companyDoc);

  // 3. Capabilities Page Singleton
  const capabilitiesDoc = {
    _type: 'capabilitiesPage',
    _id: 'capabilitiesPage',
    heroHeadline: 'Our Core Engineering Capabilities',
    heroSubtext: 'Comprehensive trenchless drilling, pipeline EPC construction, BPDS subsurface detection, and equipment technical support.',
    capabilitiesOrder: [
      { _type: 'reference', _ref: 'capability-hdd' },
      { _type: 'reference', _ref: 'capability-epc' },
      { _type: 'reference', _ref: 'capability-bpds' },
      { _type: 'reference', _ref: 'capability-support' },
    ],
  };
  console.log('Creating capabilitiesPage singleton...');
  await client.createOrReplace(capabilitiesDoc);

  // 4. Equipment Page Singleton
  const equipmentDoc = {
    _type: 'equipmentPage',
    _id: 'equipmentPage',
    heroHeadline: 'Equipment & Rig Fleet',
    heroSubtext: 'Heavy-duty HDD drilling rigs, high-volume mud circulation systems, and continuous electronic tracking equipment.',
    introCopy: 'PCE operates a fleet of heavy HDD rigs up to 1,200 tons pullback capacity, supported by mud recycling plants and guidance technology.',
  };
  console.log('Creating equipmentPage singleton...');
  await client.createOrReplace(equipmentDoc);

  // 5. Safety Quality Page Singleton
  const safetyDoc = {
    _type: 'safetyQualityPage',
    _id: 'safetyQualityPage',
    heroHeadline: 'Safety, Quality & Responsibility',
    heroSubtext: 'Zero-harm policy, strict quality control procedures, ISO-compliant operations, and environmental protection standards.',
  };
  console.log('Creating safetyQualityPage singleton...');
  await client.createOrReplace(safetyDoc);

  // 6. Projects Page Singleton
  const projectsDoc = {
    _type: 'projectsPage',
    _id: 'projectsPage',
    introHeadline: 'Featured HDD & Pipeline Projects',
    introSubtext: 'Explore our completed river crossings, offshore landfalls, and major pipeline EPC construction projects across Nigeria, Thailand, and China.',
  };
  console.log('Creating projectsPage singleton...');
  await client.createOrReplace(projectsDoc);

  // 7. Products Page Singleton
  const productsDoc = {
    _type: 'productsPage',
    _id: 'productsPage',
    heroHeadline: 'Brighter Star Drilling Fluids & Mud Additives',
    heroSubtext: 'High-performance viscosifiers, fluid loss control polymers, and shale stabilizers formulated for HDD and deep drilling applications.',
  };
  console.log('Creating productsPage singleton...');
  await client.createOrReplace(productsDoc);

  // 8. News & Insights Page Singleton
  const newsDoc = {
    _type: 'newsInsightsPage',
    _id: 'newsInsightsPage',
    heroHeadline: 'News & Technical Insights',
    heroSubtext: 'Latest announcements, project completion milestones, and technical articles from PCE Engineering.',
  };
  console.log('Creating newsInsightsPage singleton...');
  await client.createOrReplace(newsDoc);

  // 9. Resources Page Singleton
  const resourcesDoc = {
    _type: 'resourcesPage',
    _id: 'resourcesPage',
    heroHeadline: 'Resources & Downloads',
    heroSubtext: 'Download corporate profiles, technical specification sheets, and project brochures.',
  };
  console.log('Creating resourcesPage singleton...');
  await client.createOrReplace(resourcesDoc);

  // 10. Contact Page Singleton
  const contactDoc = {
    _type: 'contactPage',
    _id: 'contactPage',
    heroHeadline: 'Get in Touch with Our Engineering Team',
    heroSubtext: 'Contact PCE Nigeria for project inquiries, technical consultations, or mud chemical orders.',
    officeAddress: 'Port Harcourt & Lagos Offices, Nigeria',
    phoneNumbers: ['+234 814 990 8888', '+234 814 990 6666'],
    emailAddresses: ['info@pcenigeria.com', 'wanyang@pcenigeria.com', 'xuliangkui@pcenigeria.com'],
  };
  console.log('Creating contactPage singleton...');
  await client.createOrReplace(contactDoc);

  // 11. Navigation Singleton
  const navDoc = {
    _type: 'navigation',
    _id: 'navigation',
    mainLinks: [
      { title: 'Home', href: '/' },
      { title: 'Our Company', href: '/our-company' },
      { title: 'Capabilities', href: '/capabilities' },
      { title: 'Equipment & Technology', href: '/equipment-technology' },
      { title: 'Safety & Quality', href: '/safety-quality-responsibility' },
      { title: 'Projects', href: '/projects' },
      { title: 'Products', href: '/products' },
      { title: 'News & Insights', href: '/news-insights' },
      { title: 'Resources', href: '/resources' },
      { title: 'Contact', href: '/contact' },
    ],
  };
  console.log('Creating navigation singleton...');
  await client.createOrReplace(navDoc);

  // 12. Global Settings Singleton
  const settingsDoc = {
    _type: 'globalSettings',
    _id: 'globalSettings',
    siteTitle: 'PCE Nigeria — Power & Construction Engineering',
    generalEmail: 'info@pcenigeria.com',
    footerContacts: [
      { name: 'Wan Yang', phone: '+234 814 990 8888', email: 'wanyang@pcenigeria.com' },
      { name: 'Xu Liangkui', phone: '+234 814 990 6666', email: 'xuliangkui@pcenigeria.com' },
    ],
  };
  console.log('Creating globalSettings singleton...');
  await client.createOrReplace(settingsDoc);
}

async function runMigration() {
  try {
    await migrateProjects();
    await migrateNews();
    await migrateProducts();
    await migrateCapabilities();
    await migratePageSingletons();
    console.log('\n✅ Full migration completed successfully! All singletons and collections populated.');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
  }
}

runMigration();
