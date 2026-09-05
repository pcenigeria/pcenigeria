import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'catalog', title: '2. Drilling Mud Products Catalog' },
    { name: 'logistics', title: '3. Stock & Logistics In Nigeria' },
    { name: 'matrix', title: '4. Performance Matrix' },
    { name: 'cta', title: '5. Products Technical CTA' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Specialty Drilling Chemicals & Lantic Bentonite Products',
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
      name: 'catalogSection',
      title: 'Products Catalog Section Block',
      type: 'sectionBlock',
      group: 'catalog',
    }),
    defineField({
      name: 'logisticsSection',
      title: 'Stock & Logistics Section Block',
      type: 'sectionBlock',
      group: 'logistics',
    }),
    defineField({
      name: 'matrixSection',
      title: 'Performance Matrix Section Block',
      type: 'sectionBlock',
      group: 'matrix',
    }),
    defineField({
      name: 'ctaSection',
      title: 'Products CTA Section Block',
      type: 'sectionBlock',
      group: 'cta',
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
