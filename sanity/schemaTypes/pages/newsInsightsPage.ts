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
      title: 'News Articles Section Intro',
      type: 'introBlock',
      group: 'articles',
      description:
        'Optional short intro (tagline + heading) shown above the News & Insights article grid below. Leave blank to hide it — the articles ' +
        'still display normally either way. To add, edit, or remove an actual article, go to the "News & Insights" articles list instead, not here.',
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
