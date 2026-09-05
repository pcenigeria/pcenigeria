import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'equipmentPage',
  title: 'Equipment & Technology Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'fleet', title: '2. Our Equipment Fleet' },
    { name: 'support', title: '3. Technical Support & Yard' },
    { name: 'capacity', title: '4. Equipment Capacity Metrics' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Heavy HDD Rigs & Specialist Equipment Fleet in Nigeria',
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
      name: 'fleetSection',
      title: 'Equipment Fleet Section Block',
      type: 'sectionBlock',
      group: 'fleet',
    }),
    defineField({
      name: 'supportSection',
      title: 'Technical Support Section Block',
      type: 'sectionBlock',
      group: 'support',
    }),
    defineField({
      name: 'capacitySection',
      title: 'Capacity Metrics Section Block',
      type: 'sectionBlock',
      group: 'capacity',
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
