import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'capabilitiesPage',
  title: 'Capabilities Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'core', title: '2. Our Capabilities (4 Cards)' },
    { name: 'approach', title: '3. How We Work / Our Approach' },
    { name: 'fleet', title: '4. Technical Fleet & Support' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    // --- 1. HERO BANNER ---
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      description: 'Shown as the large hero headline. Use markdown-style for accent: highlight with [accent text] notation',
      initialValue: 'Integrated capability for complex pipeline delivery.',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext (First Paragraph)',
      type: 'text',
      group: 'hero',
      rows: 3,
      initialValue: 'PCE combines specialist HDD, pipeline EPC, deep-pipeline location technology and technical resources around demanding pipeline projects.',
    }),
    defineField({
      name: 'heroSubtext2',
      title: 'Hero Banner Subtext (Second Paragraph)',
      type: 'text',
      group: 'hero',
      rows: 3,
      initialValue: 'From early assessment and engineering through construction, testing and commissioning, our capabilities are built around the requirements of the route, the crossing and the line.',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Background Image',
      type: 'image',
      group: 'hero',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroBullets',
      title: 'Hero Highlight Bullets',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
    }),

    // --- 2. CORE CAPABILITIES SECTION ---
    defineField({
      name: 'coreCapabilitiesSection',
      title: '"Four Capabilities. One Project Objective." Section Block',
      description: 'Tagline, heading, and body text for the four-capability cards section',
      type: 'sectionBlock',
      group: 'core',
    }),

    // --- 3. HOW WE WORK / OUR APPROACH ---
    defineField({
      name: 'approachSection',
      title: '"How We Work / Our Approach" Section Block',
      description: 'Tagline, heading, body text and CTA for the approach section',
      type: 'sectionBlock',
      group: 'approach',
    }),

    // --- 4. FLEET & SUPPORT ---
    defineField({
      name: 'fleetSupportSection',
      title: 'Technical Fleet & Support Section Block',
      type: 'sectionBlock',
      group: 'fleet',
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
        title: 'Capabilities Page',
        subtitle: 'Page Singleton • /capabilities',
      };
    },
  },
});
