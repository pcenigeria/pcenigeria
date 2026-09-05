import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'equipmentPage',
  title: 'Equipment & Technology Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'capacity', title: '2. Scale Matters (Capacity Stats)' },
    { name: 'fleet', title: '3. Equipment Fleet Categories' },
    { name: 'support', title: '4. Technical Support Section' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    // --- 1. HERO BANNER ---
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'The Right Equipment Changes What Is Possible.',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext (First Paragraph)',
      type: 'text',
      group: 'hero',
      rows: 3,
      initialValue: 'PCE deploys large-scale HDD rigs, pipe-handling equipment, drilling-fluid systems, guidance technology and supporting plant for demanding pipeline crossings.',
    }),
    defineField({
      name: 'heroSubtext2',
      title: 'Hero Banner Subtext (Second Paragraph)',
      type: 'text',
      group: 'hero',
      rows: 3,
      initialValue: 'Our resources are selected and configured around the route, ground conditions, pipeline and crossing method.',
    }),
    defineField({
      name: 'heroPrimaryBtnText',
      title: 'Primary Button Label',
      type: 'string',
      group: 'hero',
      initialValue: 'Discuss Your Crossing',
    }),
    defineField({
      name: 'heroBullets',
      title: 'Hero Highlight Bullets',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),

    // --- 2. CAPACITY STATS SECTION ---
    defineField({
      name: 'capacitySection',
      title: '"Scale Matters. Control Matters More." Section Block',
      description: 'Heading, body text, and CTA for the capacity/stats section',
      type: 'sectionBlock',
      group: 'capacity',
    }),
    defineField({
      name: 'capacityKeyStats',
      title: 'Capacity Key Stats (Displayed as stat lines)',
      type: 'array',
      group: 'capacity',
      of: [
        {
          type: 'object',
          title: 'Key Stat',
          fields: [
            defineField({ name: 'label', title: 'Stat Value (e.g. "500t")', type: 'string' }),
            defineField({ name: 'description', title: 'Stat Description', type: 'string' }),
          ],
        },
      ],
      options: { sortable: true },
    }),
    defineField({
      name: 'capacityImages',
      title: 'Capacity Section Slideshow Images',
      description: 'Images used in the looping slideshow on this section',
      type: 'array',
      group: 'capacity',
      of: [{ type: 'galleryItem' }],
      options: { sortable: true },
    }),

    // --- 3. EQUIPMENT FLEET ---
    defineField({
      name: 'fleetSection',
      title: 'Equipment Fleet Section Block',
      type: 'sectionBlock',
      group: 'fleet',
    }),

    // --- 4. TECHNICAL SUPPORT SECTION ---
    defineField({
      name: 'supportSection',
      title: 'Technical Support Section Block',
      description: 'Tagline, heading, body text, and support items list',
      type: 'sectionBlock',
      group: 'support',
    }),
    defineField({
      name: 'supportImages',
      title: 'Technical Support Section Slideshow Images',
      description: 'Images for the looping slideshow displayed in the Technical Support section',
      type: 'array',
      group: 'support',
      of: [{ type: 'galleryItem' }],
      options: { sortable: true },
    }),

    // --- SEO METADATA ---
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
