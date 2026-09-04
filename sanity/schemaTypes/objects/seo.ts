import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'seo',
  title: 'Search Engine Optimization (SEO)',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      description: 'Title tag for search engines & social cards',
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      description: 'Page description displayed in search results',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image (OpenGraph)',
      type: 'image',
      options: { hotspot: true },
      description: 'Preview thumbnail when link is shared on LinkedIn/Twitter/WhatsApp',
    }),
  ],
});
