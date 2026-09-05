import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'safetyQualityPage',
  title: 'Safety, Quality & Responsibility Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'safety', title: '2. Safety & Health Commitment' },
    { name: 'quality', title: '3. Quality Control Policy' },
    { name: 'environmental', title: '4. Environmental Care' },
    { name: 'certifications', title: '5. ISO Certifications' },
    { name: 'future', title: '6. Our Future & Responsibility' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Safety, Quality & Corporate Responsibility',
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
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'safetySection',
      title: 'Safety Commitment Section Block',
      type: 'sectionBlock',
      group: 'safety',
    }),
    defineField({
      name: 'qualitySection',
      title: 'Quality Policy Section Block',
      type: 'sectionBlock',
      group: 'quality',
    }),
    defineField({
      name: 'environmentalSection',
      title: 'Environmental Care Section Block',
      type: 'sectionBlock',
      group: 'environmental',
    }),
    defineField({
      name: 'certificationSection',
      title: 'Certifications Section Block',
      type: 'sectionBlock',
      group: 'certifications',
    }),
    defineField({
      name: 'futureSection',
      title: 'Our Future Section Block',
      type: 'sectionBlock',
      group: 'future',
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
