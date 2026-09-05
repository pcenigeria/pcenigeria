import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'capabilitiesPage',
  title: 'Capabilities Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'core', title: '2. Core Capabilities Section' },
    { name: 'fleet', title: '3. Technical Fleet & Support' },
    { name: 'safety', title: '4. Safety & Standards' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Comprehensive Pipeline EPC & HDD Capabilities',
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
      name: 'coreCapabilitiesSection',
      title: 'Core Capabilities Section Block',
      type: 'sectionBlock',
      group: 'core',
    }),
    defineField({
      name: 'fleetSupportSection',
      title: 'Technical Fleet & Support Section Block',
      type: 'sectionBlock',
      group: 'fleet',
    }),
    defineField({
      name: 'safetySection',
      title: 'Safety & Standards Section Block',
      type: 'sectionBlock',
      group: 'safety',
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
