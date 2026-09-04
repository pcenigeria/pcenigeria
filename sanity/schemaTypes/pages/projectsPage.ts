import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'projectsPage',
  title: 'Projects Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Hero & Intro', default: true },
    { name: 'routes', title: 'Route Execution Cards' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Projects Hero Slideshow Gallery',
      type: 'gallery',
      group: 'overview',
    }),
    defineField({
      name: 'introHeadline',
      title: 'Projects Intro Headline',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'introSubtext',
      title: 'Projects Intro Subtext',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'routeCards',
      title: 'Difficult Routes Execution Method Cards',
      type: 'array',
      group: 'routes',
      of: [
        {
          type: 'object',
          title: 'Route Card',
          fields: [
            defineField({ name: 'title', title: 'Route Title', type: 'string' }),
            defineField({ name: 'description', title: 'Route Description', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Route Image', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
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
