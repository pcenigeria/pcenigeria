import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Hero & Overview', default: true },
    { name: 'logistics', title: 'Stock & Logistics' },
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
      name: 'aboutSection',
      title: 'Products Portfolio Overview Block',
      type: 'sectionBlock',
      group: 'overview',
    }),
    defineField({
      name: 'logisticsSection',
      title: 'Stock & Logistics Capability Block',
      type: 'sectionBlock',
      group: 'logistics',
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
        title: 'Products Page',
        subtitle: 'Page Singleton • /products',
      };
    },
  },
});
