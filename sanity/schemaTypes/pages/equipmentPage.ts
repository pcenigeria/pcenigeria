import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'equipmentPage',
  title: 'Equipment & Technology Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Hero & Intro', default: true },
    { name: 'support', title: 'Technical Support' },
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
      name: 'introCopy',
      title: 'Equipment Section Intro Copy',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'supportSection',
      title: 'Technical Support & Maintenance Section',
      type: 'sectionBlock',
      group: 'support',
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
        title: 'Equipment & Technology Page',
        subtitle: 'Page Singleton • /equipment-technology',
      };
    },
  },
});
