import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'downloads', title: '2. Downloads Section' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Technical Resources, TDS & SDS Data Sheets',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'downloadsSection',
      title: 'Resources Downloads Section Block',
      type: 'sectionBlock',
      group: 'downloads',
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
        title: 'Resources Page',
        subtitle: 'Page Singleton • /resources',
      };
    },
  },
});
