import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'capabilitiesPage',
  title: 'Capabilities Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Page Intro', default: true },
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
      name: 'capabilitiesOrder',
      title: 'Capabilities Cards Display Order',
      type: 'array',
      group: 'overview',
      of: [{ type: 'reference', to: [{ type: 'capability' }] }],
      description: 'Drag and reorder the capabilities as they appear on the page',
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
        title: 'Capabilities Page',
        subtitle: 'Page Singleton • /capabilities',
      };
    },
  },
});
