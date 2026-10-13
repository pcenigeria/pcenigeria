export interface NewsSection {
    tagline?: string;
    heading: string;
    headingColor?: string;
    body?: string[];
    bullets?: string[];
    highlightStat?: {
        value: string;
        label: string;
    };
}

export interface SeoFields {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    ogImage?: string;
    canonicalUrl?: string;
}

export interface NewsArticleDetail {
    id: string;
    slug: string;
    title: string;
    category: 'News' | 'Insights';
    date: string;
    readTime?: string;
    author?: string;
    heroImage?: string;
    intro?: string;
    sections?: NewsSection[];
    bentoImages?: string[];
    specs?: {
        label: string;
        value: string;
    }[];
    seo?: SeoFields;
    _updatedAt?: string;
}

export interface NewsArticleSummary {
    _id: string;
    title: string;
    slug: string;
    category: 'News' | 'Insights';
    date?: string;
    readTime?: string;
    author?: string;
    heroImage?: string;
    intro?: string;
    _updatedAt?: string;
}

export interface SanityNewsBentoImage {
    src: string;
    title?: string;
    description?: string;
}

export interface SanityNewsGalleryItem {
    src: string;
    title?: string;
    description?: string;
}

export interface SanityNewsSection {
    tagline?: string;
    heading?: string;
    headingColor?: string;
    body?: any;
    bullets?: string[];
    highlightStat?: {
        value: string;
        label: string;
    };
    buttonText?: string;
    buttonLink?: string;
    gallery?: {
        categoryTitle?: string;
        items?: SanityNewsGalleryItem[];
    };
}

export interface SanityNewsArticleDetail {
    _id: string;
    _updatedAt?: string;
    title: string;
    slug: string;
    category: 'News' | 'Insights';
    date?: string;
    readTime?: string;
    author?: string;
    heroImage?: string;
    intro?: string;
    sections?: SanityNewsSection[];
    bentoImages?: SanityNewsBentoImage[];
    seo?: SeoFields;
}

