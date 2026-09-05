export interface ProjectSection {
    tagline?: string;
    heading: string;
    headingColor?: string;
    body?: any;
    bullets?: string[];
    highlightStat?: {
        value: string;
        label: string;
    };
    buttonText?: string;
    buttonLink?: string;
    gallery?: any;
}

export interface ProjectDetail {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    tagline?: string;
    date?: string;
    location?: string;
    country?: string;
    isBpds?: boolean;
    category?: string;
    heroImage?: string;
    intro?: string;
    sections?: ProjectSection[];
    bentoImages?: string[];
    specs?: {
        label: string;
        value: string;
    }[];
}

export interface ProjectListItem {
    _id: string;
    title: string;
    slug: string;
    subtitle?: string;
    tagline?: string;
    date?: string;
    location?: string;
    country?: string;
    isBpds?: boolean;
    category?: string;
    heroImage?: string;
    intro?: string;
}
