import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'grid', title: '2. Projects Grid Section' },
    { name: 'featured', title: '3. Featured Project Spotlight' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Landmark HDD Crossings & Pipeline EPC Projects',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'heroBullets',
      title: 'Hero Highlight Bullets',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero Carousel Slides (7 Photos)',
      type: 'array',
      group: 'hero',
      of: [
        {
          type: 'object',
          title: 'Hero Slide',
          fields: [
            defineField({ name: 'image', title: 'Slide Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'alt', title: 'Image Alt Text', type: 'string' }),
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Slide', media };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'gridSection',
      title: 'Projects Grid Section Block',
      type: 'sectionBlock',
      group: 'grid',
    }),
    defineField({
      name: 'filterTabs',
      title: 'Country / Category Filter Tabs',
      type: 'array',
      group: 'grid',
      of: [
        {
          type: 'object',
          title: 'Filter Tab',
          fields: [
            defineField({ name: 'id', title: 'Tab ID (e.g. all, nigeria, thailand, china, bpds)', type: 'string' }),
            defineField({ name: 'name', title: 'Tab Label', type: 'string' }),
            defineField({ name: 'description', title: 'Tab Headline / Description', type: 'string' }),
            defineField({ name: 'subtext', title: 'Tab Subtext', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'description' },
          },
        },
      ],
    }),
    defineField({
      name: 'whatWorksCards',
      title: '"What Connects the Work" Cards (4 Cards)',
      type: 'array',
      group: 'grid',
      of: [
        {
          type: 'object',
          title: 'Card Item',
          fields: [
            defineField({ name: 'title', title: 'Card Title', type: 'string' }),
            defineField({ name: 'label', title: 'Card Description', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true } }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'label', media: 'image' },
          },
        },
      ],
    }),
    defineField({
      name: 'featuredSection',
      title: 'Featured Project Section Block',
      type: 'sectionBlock',
      group: 'featured',
    }),
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Projects Page',
        subtitle: 'Page Singleton • /projects',
      };
    },
  },
});
