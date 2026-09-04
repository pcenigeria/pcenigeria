import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'companyPage',
  title: 'Our Company Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Hero & Intro', default: true },
    { name: 'bento', title: 'Local Delivery Bento Cards' },
    { name: 'direction', title: 'Vision & Mission' },
    { name: 'people', title: 'People & Scale Stats' },
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
      name: 'whoWeAreSection',
      title: '"Who We Are" Content Section',
      type: 'sectionBlock',
      group: 'overview',
    }),
    defineField({
      name: 'deliveryBentoCards',
      title: 'Local Delivery Capability Cards',
      type: 'array',
      group: 'bento',
      of: [
        {
          type: 'object',
          title: 'Delivery Card',
          fields: [
            defineField({ name: 'title', title: 'Card Title', type: 'string' }),
            defineField({ name: 'description', title: 'Card Description', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Card Image', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
    }),
    defineField({
      name: 'visionMissionSection',
      title: 'Vision & Mission Direction Copy',
      type: 'sectionBlock',
      group: 'direction',
    }),
    defineField({
      name: 'peopleScaleStats',
      title: 'People & Scale Key Metrics',
      type: 'array',
      group: 'people',
      of: [{ type: 'statItem' }],
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
        title: 'Our Company Page',
        subtitle: 'Page Singleton • /our-company',
      };
    },
  },
});
