import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  groups: [
    { name: 'hero', title: 'Hero Slideshow', default: true },
    { name: 'glance', title: 'PCE at a Glance' },
    { name: 'featured', title: 'Featured Projects Picks' },
    { name: 'capabilities', title: 'Capabilities Intro' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroSlides',
      title: 'Hero Slideshow Gallery',
      type: 'gallery',
      group: 'hero',
      description: 'Images and headlines rendered in the home hero slider',
    }),
    defineField({
      name: 'glanceHeading',
      title: '"PCE at a Glance" Heading',
      type: 'string',
      group: 'glance',
    }),
    defineField({
      name: 'glanceStats',
      title: '"PCE at a Glance" Key Metrics',
      type: 'array',
      group: 'glance',
      of: [{ type: 'statItem' }],
      options: { sortable: true },
    }),
    defineField({
      name: 'featuredProjects',
      title: 'Featured Case Studies Picks',
      type: 'array',
      group: 'featured',
      of: [{ type: 'reference', to: [{ type: 'project' }] }],
      description: 'Selected case studies highlighted on the home page',
    }),
    defineField({
      name: 'capabilitiesIntro',
      title: 'Capabilities Section Intro Text',
      type: 'text',
      group: 'capabilities',
      rows: 3,
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
        title: 'Home Page',
        subtitle: 'Page Singleton • /',
      };
    },
  },
});
