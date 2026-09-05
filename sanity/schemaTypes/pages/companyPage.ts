import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'companyPage',
  title: 'Our Company Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'whoWeAre', title: '2. Who We Are Section' },
    { name: 'overviewCaps', title: '3. Capabilities Bento Grid' },
    { name: 'experience', title: '4. Experience Section' },
    { name: 'direction', title: '5. Our Direction (Vision & Mission)' },
    { name: 'people', title: '6. People & Scale Stats' },
    { name: 'standards', title: '7. Standards & Responsibility' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // --- 1. HERO BANNER ---
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Built for complex pipeline delivery.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext (First Paragraph)',
      type: 'text',
      group: 'hero',
      rows: 3,
      initialValue: 'PCE Nigeria provides integrated pipeline construction and EPC services, with specialist capability in Horizontal Directional Drilling.',
    }),
    defineField({
      name: 'heroSubtext2',
      title: 'Hero Banner Subtext (Second Paragraph)',
      type: 'text',
      group: 'hero',
      rows: 3,
      initialValue: 'From early assessment and engineering through construction, pre-commissioning and commissioning, we bring technical expertise and field resources together around demanding pipeline projects.',
    }),
    defineField({
      name: 'heroPrimaryBtnText',
      title: 'Primary Button Label',
      type: 'string',
      group: 'hero',
      initialValue: 'Explore Capabilities',
    }),
    defineField({
      name: 'heroPrimaryBtnLink',
      title: 'Primary Button URL',
      type: 'string',
      group: 'hero',
      initialValue: '/capabilities',
    }),

    // --- 2. WHO WE ARE ---
    defineField({
      name: 'whoWeAreSection',
      title: '"Who We Are" Content Section',
      description: 'Tagline, heading, and body text for the Who We Are section',
      type: 'sectionBlock',
      group: 'whoWeAre',
    }),
    defineField({
      name: 'whoWeAreImages',
      title: '"Who We Are" Section Images',
      description: 'Two images displayed in the Who We Are section (bottom-left and top-right)',
      type: 'array',
      group: 'whoWeAre',
      of: [
        {
          type: 'object',
          title: 'Section Image',
          fields: [
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'caption', title: 'Caption / Position Note', type: 'string' }),
          ],
        },
      ],
    }),

    // --- 3. CAPABILITIES BENTO GRID ---
    defineField({
      name: 'overviewCapabilitiesSection',
      title: 'Local Delivery Capabilities Section Block',
      description: 'Heading, subtext, and CTA for the capabilities overview section',
      type: 'sectionBlock',
      group: 'overviewCaps',
    }),
    defineField({
      name: 'deliveryBentoCards',
      title: 'Local Delivery Capability Cards (4 Bento Cards)',
      type: 'array',
      group: 'overviewCaps',
      of: [
        {
          type: 'object',
          title: 'Delivery Card',
          fields: [
            defineField({ name: 'title', title: 'Card Title', type: 'string' }),
            defineField({ name: 'description', title: 'Card Description', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Card Background Image', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
    }),

    // --- 4. EXPERIENCE SECTION ---
    defineField({
      name: 'experienceSection',
      title: 'Experience Section Block',
      description: 'Tagline, heading, body text, and CTA for the Experience section',
      type: 'sectionBlock',
      group: 'experience',
    }),
    defineField({
      name: 'experienceImage',
      title: 'Experience Section Image',
      type: 'image',
      group: 'experience',
      options: { hotspot: true },
    }),

    // --- 5. VISION & MISSION (OUR DIRECTION) ---
    defineField({
      name: 'visionMissionSection',
      title: '"Our Direction" — Vision & Mission Section Block',
      description: 'Heading and body text for the animated timeline Vision/Mission section',
      type: 'sectionBlock',
      group: 'direction',
    }),

    // --- 6. PEOPLE & SCALE ---
    defineField({
      name: 'peopleScaleSection',
      title: 'People & Scale Section Intro',
      description: 'Tagline, heading, and introductory text for the People & Scale section',
      type: 'sectionBlock',
      group: 'people',
    }),
    defineField({
      name: 'peopleScaleStats',
      title: 'People & Scale Key Metrics (Numbers)',
      type: 'array',
      group: 'people',
      of: [{ type: 'statItem' }],
      options: { sortable: true },
    }),

    // --- 7. STANDARDS & RESPONSIBILITY ---
    defineField({
      name: 'standardsSection',
      title: 'Standards & Responsibility Section Block',
      description: 'Tagline, heading, body text and CTA for the Standards section',
      type: 'sectionBlock',
      group: 'standards',
    }),
    defineField({
      name: 'standardsImage',
      title: 'Standards Section Image',
      type: 'image',
      group: 'standards',
      options: { hotspot: true },
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
        title: 'Our Company Page',
        subtitle: 'Page Singleton • /our-company',
      };
    },
  },
});
