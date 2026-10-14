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

export interface RichTextWidget {
    _key?: string;
    _type: 'richTextWidget';
    content?: any;
}

export interface MediaEmbedWidget {
    _key?: string;
    _type: 'mediaEmbedWidget';
    url?: string;
    caption?: string;
    aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
}

export interface BulletsWidget {
    _key?: string;
    _type: 'bulletsWidget';
    items?: string[];
}

export interface StatWidget {
    _key?: string;
    _type: 'statWidget';
    value?: string;
    label?: string;
}

export interface QuoteWidget {
    _key?: string;
    _type: 'quoteWidget';
    quote?: string;
    author?: string;
    role?: string;
}

export interface GalleryWidget {
    _key?: string;
    _type: 'galleryWidget';
    gallery?: {
        categoryTitle?: string;
        items?: SanityNewsGalleryItem[];
    };
}

export interface ButtonWidget {
    _key?: string;
    _type: 'buttonWidget';
    text?: string;
    url?: string;
    variant?: 'primary' | 'orange' | 'outline';
}

export type SectionContentWidget =
    | RichTextWidget
    | MediaEmbedWidget
    | BulletsWidget
    | StatWidget
    | QuoteWidget
    | GalleryWidget
    | ButtonWidget;

export interface SanityNewsSection {
    tagline?: string;
    heading?: string;
    headingColor?: string;
    contentBlocks?: SectionContentWidget[];
    // Legacy fields (kept for backward compatibility)
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

