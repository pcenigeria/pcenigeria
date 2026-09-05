import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'grid', title: '2. Projects Grid Section' },
    { name: 'featured', title: '3. Featured Project Spotlight' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Landmark HDD Crossings & Pipeline EPC Projects',
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
      name: 'gridSection',
      title: 'Projects Grid Section Block',
      type: 'sectionBlock',
      group: 'grid',
    }),
    defineField({
      name: 'featuredSection',
      title: 'Featured Project Section Block',
      type: 'sectionBlock',
      group: 'featured',
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
        title: 'Projects Page',
        subtitle: 'Page Singleton • /projects',
      };
    },
  },
});
