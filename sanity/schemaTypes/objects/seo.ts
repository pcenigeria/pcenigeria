import { defineField, defineType } from 'sanity';
import { Search } from 'lucide-react';

export default defineType({
  name: 'seo',
  title: 'Search Engine Optimization (SEO)',
  type: 'object',
  icon: Search,
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title tag for search engines & social cards. Ideal length: 50–60 characters.',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Page description displayed in search results. Ideal length: 140–155 characters.',
    }),
    defineField({
      name: 'keywords',
      title: 'Focus Keywords',
      type: 'string',
      description: 'Comma-separated target keywords, e.g. "HDD Nigeria, River Niger crossing, trenchless drilling".',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (OpenGraph)',
      type: 'image',
      options: { hotspot: true },
      description: 'Preview thumbnail when link is shared on LinkedIn/Twitter/WhatsApp. Ideal size: 1200×630px.',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL Override',
      type: 'url',
      description: 'Only set this if this content is a copy of another URL (to avoid duplicate content penalties). Leave blank in all other cases.',
    }),
  ],
});
