import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resourcesPage',
  title: 'Resources Page',
  type: 'document',
  description: 'Controls the hero banner and optional intro text on the live /resources page. The actual downloadable files and categories are managed separately, in "Resource Category" documents.',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'downloads', title: '2. Downloads Section' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      description: 'The big headline at the top of the /resources page.',
      initialValue: 'Technical Resources, TDS & SDS Data Sheets',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'hero',
      description: 'The paragraph shown just below the headline.',
      rows: 3,
    }),
    defineField({
      name: 'downloadsSection',
      title: 'Resources Downloads Section Block',
      type: 'sectionBlock',
      group: 'downloads',
      description: 'Optional short intro (tagline + heading) shown above the resource category tabs. Leave the fields empty to hide this — the page works fine without it. To add or edit the actual downloadable files, go to "Resource Category" documents instead, not here.',
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
        title: 'Resources Page',
        subtitle: 'Page Singleton • /resources',
      };
    },
  },
});
