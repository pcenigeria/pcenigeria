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

async function runMigration() {
  try {
    await migrateProjects();
    await migrateNews();
    await migrateProducts();
    await migrateCapabilities();
    console.log('\n✅ Migration completed successfully!');
  } catch (err) {
    console.error('\n❌ Migration failed:', err);
  }
}

runMigration();
