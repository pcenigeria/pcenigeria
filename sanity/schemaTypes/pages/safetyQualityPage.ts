import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'safetyQualityPage',
  title: 'Safety Quality & Responsibility Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Hero & Overview', default: true },
    { name: 'safety', title: 'Safety Section' },
    { name: 'quality', title: 'Quality Section' },
    { name: 'certification', title: 'Certifications' },
    { name: 'environment', title: 'Environmental Care' },
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
      name: 'safetySection',
      title: 'HSE & Safety Standards Block',
      type: 'sectionBlock',
      group: 'safety',
    }),
    defineField({
      name: 'qualitySection',
      title: 'Quality Control Standards Block',
      type: 'sectionBlock',
      group: 'quality',
    }),
    defineField({
      name: 'certificationsSection',
      title: 'Certifications & Compliance Block',
      type: 'sectionBlock',
      group: 'certification',
    }),
    defineField({
      name: 'environmentalSection',
      title: 'Environmental Care & Sustainability Block',
      type: 'sectionBlock',
      group: 'environment',
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
        title: 'Safety Quality & Responsibility Page',
        subtitle: 'Page Singleton • /safety-quality-responsibility',
      };
    },
  },
});
