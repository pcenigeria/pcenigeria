import { client } from './client';

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
    glanceHeading,
    glanceStats,
    capabilitiesIntro,
    "heroSlides": heroSlides.items[]{ "src": image.asset->url, title, description },
    "featuredProjects": featuredProjects[]->{
      title,
      "slug": slug.current,
      tagline,
      intro,
      "heroImage": heroImage.asset->url
    }
  }`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['homePage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getHomePage):', err);
    return null;
  }
}

export async function getCompanyPage() {
  const query = `*[_id == "companyPage"][0]`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['companyPage'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getCompanyPage):', err);
    return null;
  }
}

export async function getGlobalSettings() {
  const query = `*[_id == "globalSettings"][0]`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['globalSettings'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getGlobalSettings):', err);
    return null;
  }
}

export async function getNavigationSettings() {
  const query = `*[_id == "navigation"][0]`;
  try {
    return await client.fetch(query, {}, { next: { tags: ['navigation'] } });
  } catch (err) {
    console.warn('Sanity fetch error (getNavigationSettings):', err);
    return null;
  }
}
