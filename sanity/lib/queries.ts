import { client } from './client';

// =========================================
// REUSABLE PROJECTION FRAGMENTS
// =========================================

// For fields of type `gallery` (has categoryTitle + items[] of galleryItem)
const GALLERY_FIELDS = `{
  categoryTitle,
  "items": items[]{ "src": image.asset->url, title, description }
}`;

// For fields that are a bare array of `galleryItem` (no categoryTitle wrapper)
const GALLERY_ITEMS_ARRAY_FIELDS = `[]{ "src": image.asset->url, title, description }`;

// For fields of type `sectionBlock`
const SECTION_BLOCK_FIELDS = `{
  tagline,
  heading,
  headingColor,
  body,
  bullets,
  highlightStat,
  buttonText,
  buttonLink,
  "gallery": gallery${GALLERY_FIELDS}
}`;

// For fields of type `statItem`
const STAT_ITEM_FIELDS = `{
  number,
  label,
  "image": image.asset->url,
  "gallery": gallery${GALLERY_FIELDS}
}`;

// For fields of type `seo`
const SEO_FIELDS = `{
  metaTitle,
  metaDescription,
  "ogImage": ogImage.asset->url
}`;

// =========================================
// PROJECTS (CASE STUDIES)
// =========================================

export async function getAllProjects() {
  const query = `*[_type == "project" && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    tagline,
    date,
    location,
    country,
    isBpds,
    category,
    "heroImage": heroImage.asset->url,
    intro
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['project'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getAllProjects):', err);
    return [];
  }
}

export async function getProjectBySlug(slug: string) {
  const query = `*[_type == "project" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    tagline,
    date,
    location,
    country,
    isBpds,
    category,
    "heroImage": heroImage.asset->url,
    intro,
    sections,
    specs,
    "bentoImages": bentoImages.items[]{
      "src": image.asset->url,
      title,
      description
    }
  }`;
  try {
    return await client.fetch(query, { slug }, { next: { tags: [`project-${slug}`, 'project'] } });
  } catch (err) {
    console.warn(`Sanity fetch error (getProjectBySlug: ${slug}):`, err);
    return null;
  }
}

// =========================================
// NEWS & INSIGHTS
// =========================================

export async function getAllNewsArticles() {
  const query = `*[_type == "newsArticle" && !(_id in path("drafts.**"))] | order(date desc) {
    _id,
    title,
    "slug": slug.current,
    category,
    date,
    readTime,
    author,
    "heroImage": heroImage.asset->url,
    intro
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['newsArticle'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getAllNewsArticles):', err);
    return [];
  }
}

export async function getNewsArticleBySlug(slug: string) {
  const query = `*[_type == "newsArticle" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    category,
    date,
    readTime,
    author,
    "heroImage": heroImage.asset->url,
    intro,
    sections,
    "bentoImages": bentoImages.items[]{
      "src": image.asset->url,
      title,
      description
    }
  }`;
  try {
    return await client.fetch(query, { slug }, { next: { tags: [`newsArticle-${slug}`, 'newsArticle'] } });
  } catch (err) {
    console.warn(`Sanity fetch error (getNewsArticleBySlug: ${slug}):`, err);
    return null;
  }
}

// =========================================
// PRODUCTS
// =========================================

export async function getAllProducts() {
  const query = `*[_type == "product" && !(_id in path("drafts.**"))] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    eyebrow,
    description,
    "image": image.asset->url,
    "secondaryImage": secondaryImage.asset->url,
    "heroImage": heroImage.asset->url
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['product'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getAllProducts):', err);
    return [];
  }
}

export async function getProductBySlug(slug: string) {
  const query = `*[_type == "product" && slug.current == $slug && !(_id in path("drafts.**"))][0] {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    eyebrow,
    description,
    overviewText,
    whatItDoes,
    alsoKnownAs,
    "image": image.asset->url,
    "secondaryImage": secondaryImage.asset->url,
    "heroImage": heroImage.asset->url,
    intro,
    executiveStandard,
    mainFunctions,
    features,
    applications,
    specRows,
    specTables,
    howItsUsed,
    "tdsUrl": tdsFile.asset->url,
    "sdsUrl": sdsFile.asset->url,
    safetyAtAGlance,
    storageInfo,
    sdsSections,
    supplyDetails,
    salesContacts,
    "galleryImages": galleryImages.items[]{ "src": image.asset->url, title, description },
    "technicalImages": technicalImages.items[]{ "src": image.asset->url, title, description }
  }`;
  try {
    return await client.fetch(query, { slug }, { next: { tags: [`product-${slug}`, 'product'] } });
  } catch (err) {
    console.warn(`Sanity fetch error (getProductBySlug: ${slug}):`, err);
    return null;
  }
}

// =========================================
// CAPABILITIES
// =========================================

export async function getAllCapabilities() {
  const query = `*[_type == "capability" && !(_id in path("drafts.**"))] | order(number asc) {
    _id,
    "id": id.current,
    number,
    title,
    description,
    headline,
    subtext,
    "image": image.asset->url,
    steps,
    "gallery": gallery.items[]{ "src": image.asset->url, title, description }
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['capability'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getAllCapabilities):', err);
    return [];
  }
}

// =========================================
// EQUIPMENT
// =========================================

export async function getAllEquipmentCategories() {
  const query = `*[_type == "equipmentCategory" && !(_id in path("drafts.**"))] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    tagline,
    description,
    subtext,
    items[]{
      id,
      number,
      title,
      description,
      "image": image.asset->url
    }
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['equipmentCategory'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getAllEquipmentCategories):', err);
    return [];
  }
}

export async function getEquipmentPage() {
  const query = `*[_id == "equipmentPage"][0] {
    heroHeadline,
    heroSubtext,
    heroSubtext2,
    heroPrimaryBtnText,
    heroBullets,
    "heroImage": heroImage.asset->url,
    capacitySection${SECTION_BLOCK_FIELDS},
    capacityKeyStats[]{ label, description },
    "capacityImages": capacityImages${GALLERY_ITEMS_ARRAY_FIELDS},
    fleetSection${SECTION_BLOCK_FIELDS},
    supportSection${SECTION_BLOCK_FIELDS},
    "supportImages": supportImages${GALLERY_ITEMS_ARRAY_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['equipmentPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getEquipmentPage):', err);
    return null;
  }
}


// =========================================

// RESOURCES
// =========================================

export async function getAllResourceCategories() {
  const query = `*[_type == "resourceCategory" && !(_id in path("drafts.**"))] | order(_createdAt asc) {
    _id,
    label,
    "slug": slug.current,
    items[]{
      _key,
      title,
      description,
      "downloadUrl": file.asset->url,
      "fileUrl": file.asset->url
    }
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['resourceCategory'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getAllResourceCategories):', err);
    return [];
  }
}


// =========================================
// SINGLETON PAGES
// =========================================

export async function getHomePage() {
  const query = `*[_id == "homePage"][0] {
    heroTagline,
    heroHeadline,
    heroBullets,
    heroPrimaryBtnText,
    heroPrimaryBtnLink,
    heroSecondaryBtnText,
    heroSecondaryBtnLink,
    "heroSlides": heroSlides${GALLERY_FIELDS},
    glanceTagline,
    glanceHeading,
    glanceBody,
    glanceStats[]${STAT_ITEM_FIELDS},
    capabilitiesSection${SECTION_BLOCK_FIELDS},
    featuredSection${SECTION_BLOCK_FIELDS},
    "featuredProjects": featuredProjects[]->{
      title,
      "slug": slug.current,
      tagline,
      intro,
      "heroImage": heroImage.asset->url
    },
    equipmentSection${SECTION_BLOCK_FIELDS},
    ctaSection${SECTION_BLOCK_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['homePage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getHomePage):', err);
    return null;
  }
}

export async function getCompanyPage() {
  const query = `*[_id == "companyPage"][0] {
    heroHeadline,
    heroSubtext,
    heroSubtext2,
    heroPrimaryBtnText,
    heroPrimaryBtnLink,
    "heroImage": heroImage.asset->url,
    whoWeAreSection${SECTION_BLOCK_FIELDS},
    whoWeAreImages[]{ "image": image.asset->url, caption },
    overviewCapabilitiesSection${SECTION_BLOCK_FIELDS},
    deliveryBentoCards[]{ title, description, "image": image.asset->url },
    experienceSection${SECTION_BLOCK_FIELDS},
    "experienceImage": experienceImage.asset->url,
    visionMissionSection${SECTION_BLOCK_FIELDS},
    peopleScaleSection${SECTION_BLOCK_FIELDS},
    peopleScaleStats[]${STAT_ITEM_FIELDS},
    standardsSection${SECTION_BLOCK_FIELDS},
    "standardsImage": standardsImage.asset->url,
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['companyPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getCompanyPage):', err);
    return null;
  }
}

export async function getCapabilitiesPage() {
  const query = `*[_id == "capabilitiesPage"][0] {
    heroHeadline,
    heroSubtext,
    heroSubtext2,
    "heroImage": heroImage.asset->url,
    heroBullets,
    coreCapabilitiesSection${SECTION_BLOCK_FIELDS},
    approachSection${SECTION_BLOCK_FIELDS},
    fleetSupportSection${SECTION_BLOCK_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['capabilitiesPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getCapabilitiesPage):', err);
    return null;
  }
}

export async function getProjectsPage() {
  const query = `*[_id == "projectsPage"][0] {
    heroHeadline,
    heroSubtext,
    heroBullets,
    gridSection${SECTION_BLOCK_FIELDS},
    featuredSection${SECTION_BLOCK_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['projectsPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getProjectsPage):', err);
    return null;
  }
}

export async function getProductsPage() {
  const query = `*[_id == "productsPage"][0] {
    heroHeadline,
    heroSubtext,
    heroBullets,
    catalogSection${SECTION_BLOCK_FIELDS},
    logisticsSection${SECTION_BLOCK_FIELDS},
    matrixSection${SECTION_BLOCK_FIELDS},
    ctaSection${SECTION_BLOCK_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['productsPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getProductsPage):', err);
    return null;
  }
}

export async function getNewsInsightsPage() {
  const query = `*[_id == "newsInsightsPage"][0] {
    heroHeadline,
    heroSubtext,
    articlesSection${SECTION_BLOCK_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['newsInsightsPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getNewsInsightsPage):', err);
    return null;
  }
}

export async function getSafetyQualityPage() {
  const query = `*[_id == "safetyQualityPage"][0] {
    heroHeadline,
    heroSubtext,
    "heroImage": heroImage.asset->url,
    safetySection${SECTION_BLOCK_FIELDS},
    qualitySection${SECTION_BLOCK_FIELDS},
    environmentalSection${SECTION_BLOCK_FIELDS},
    certificationSection${SECTION_BLOCK_FIELDS},
    futureSection${SECTION_BLOCK_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['safetyQualityPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getSafetyQualityPage):', err);
    return null;
  }
}

export async function getContactPage() {
  const query = `*[_id == "contactPage"][0] {
    heroHeadline,
    heroSubtext,
    contactPersons[]{ name, phone, email },
    abujaOffice,
    lagosOffice,
    portHarcourtBase,
    generalEmail,
    formSection${SECTION_BLOCK_FIELDS},
    seo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['contactPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getContactPage):', err);
    return null;
  }
}

export async function getGlobalSettings() {
  const query = `*[_id == "globalSettings"][0] {
    siteTitle,
    "logo": logo.asset->url,
    "favicon": favicon.asset->url,
    footerContacts[]{ name, phone, email },
    generalEmail,
    socialLinks[]{ platform, url },
    footerTagline,
    footerHeading,
    footerCtaText,
    footerCtaLink,
    defaultSeo${SEO_FIELDS}
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['globalSettings'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getGlobalSettings):', err);
    return null;
  }
}

export async function getNavigationSettings() {
  const query = `*[_id == "navigation"][0] {
    companyMenu[]{ title, href, description },
    capabilitiesMenu[]{ title, href, description },
    productsMenu[]{ title, subtitle, href, description, "image": image.asset->url },
    mainLinks[]{ title, href, insertProductsMenuAfter },
    homeLink{ title, href },
    contactCta{ text, href },
    footerLinks[]{ title, href }
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['navigation'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getNavigationSettings):', err);
    return null;
  }
}
