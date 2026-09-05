import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'newsInsightsPage',
  title: 'News & Insights Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'articles', title: '2. News Articles Section' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'News, Project Reports & Technical Insights',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'articlesSection',
      title: 'News Articles Section Block',
      type: 'sectionBlock',
      group: 'articles',
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
        title: 'News & Insights Page',
        subtitle: 'Page Singleton • /news-insights',
      };
    },
  },
});
