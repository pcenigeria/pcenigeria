import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Section & Slideshow', default: true },
    { name: 'glance', title: '2. PCE at a Glance (Overview)' },
    { name: 'capabilities', title: '3. Core Capabilities Intro' },
    { name: 'featured', title: '4. Featured Projects (OB3 & AKK)' },
    { name: 'equipment', title: '5. Equipment & Fleet Intro' },
    { name: 'cta', title: '6. Bottom Contact CTA' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    // --- 1. HERO SECTION ---
    defineField({
      name: 'heroTagline',
      title: 'Hero Tagline / Eyebrow',
      type: 'string',
      group: 'hero',
      initialValue: 'HDD & PIPELINE EPC CONTRACTOR',
    }),
    defineField({
      name: 'heroHeadline',
      title: 'Hero Main Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'HDD Crossing. EPC for Pipeline.',
    }),
    defineField({
      name: 'heroBullets',
      title: 'Hero Bullet Points',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
      description: 'Key highlight bullets shown under the hero headline',
      initialValue: [
        'Excellent HDD construction capability',
        'Professional HDD drilling fluid scheme design and product supply capability',
        'Comprehensive pipeline EPC construction capability',
        'Deep buried pipeline detection capability',
      ],
    }),
    defineField({
      name: 'heroPrimaryBtnText',
      title: 'Primary Button Label',
      type: 'string',
      group: 'hero',
      initialValue: 'Explore Our Capabilities',
    }),
    defineField({
      name: 'heroPrimaryBtnLink',
      title: 'Primary Button URL Link',
      type: 'string',
      group: 'hero',
      initialValue: '/capabilities',
    }),
    defineField({
      name: 'heroSecondaryBtnText',
      title: 'Secondary Button Label',
      type: 'string',
      group: 'hero',
      initialValue: 'Start a Project',
    }),
    defineField({
      name: 'heroSecondaryBtnLink',
      title: 'Secondary Button URL Link',
      type: 'string',
      group: 'hero',
      initialValue: '/contact',
    }),
    defineField({
      name: 'heroSlides',
      title: 'Hero Background Slideshow Gallery',
      type: 'gallery',
      group: 'hero',
      description: 'Images and headlines rendered in the dynamic hero slider',
    }),

    // --- 2. PCE AT A GLANCE OVERVIEW ---
    defineField({
      name: 'glanceTagline',
      title: '"PCE at a Glance" Tagline',
      type: 'string',
      group: 'glance',
      initialValue: 'PCE AT A GLANCE',
    }),
    defineField({
      name: 'glanceHeading',
      title: '"PCE at a Glance" Heading',
      type: 'string',
      group: 'glance',
      initialValue: 'Specialist People. Field-ready Resources in Nigeria. Proven Capability.',
    }),
    defineField({
      name: 'glanceBody',
      title: '"PCE at a Glance" Paragraph Body',
      type: 'text',
      group: 'glance',
      rows: 3,
    }),
    defineField({
      name: 'glanceStats',
      title: '"PCE at a Glance" Key Metrics & Cards',
      type: 'array',
      group: 'glance',
      of: [{ type: 'statItem' }],
      options: { sortable: true },
    }),

    // --- 3. CAPABILITIES SECTION ---
    defineField({
      name: 'capabilitiesSection',
      title: 'Core Capabilities Section Block',
      type: 'sectionBlock',
      group: 'capabilities',
    }),

    // --- 4. FEATURED PROJECTS SECTION ---
    defineField({
      name: 'featuredSection',
      title: 'Featured Projects Section Block',
      type: 'sectionBlock',
      group: 'featured',
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Case Studies Picks',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Selected case studies highlighted on the home page',
    }),

    // --- 5. EQUIPMENT SECTION ---
    defineField({
      name: 'equipmentSection',
      title: 'Equipment Fleet Section Block',
      type: 'sectionBlock',
      group: 'equipment',
    }),

    // --- 6. BOTTOM CONTACT CTA SECTION ---
    defineField({
      name: 'ctaSection',
      title: 'Bottom Call-to-Action Section Block',
      type: 'sectionBlock',
      group: 'cta',
    }),

    // --- 7. SEO METADATA ---
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
        title: 'Home Page',
        subtitle: 'Page Singleton • /',
      };
    },
  },
});
