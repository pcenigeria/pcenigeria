import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Hero & Intro', default: true },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'overview',
      rows: 3,
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
