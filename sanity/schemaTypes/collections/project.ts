import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'project',
  title: 'Case Study / Project',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content' },
    { name: 'gallery', title: 'Media / Gallery' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Project Subtitle / Headline',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'tagline',
      title: 'Project Tagline',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'date',
      title: 'Completion Date / Year',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'location',
      title: 'Project Location',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'country',
      title: 'Country Filter Tab',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: 'Nigeria', value: 'Nigeria' },
          { title: 'Thailand', value: 'Thailand' },
          { title: 'China', value: 'China' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isBpds',
      title: 'BPDS Construction Work Tab',
      type: 'boolean',
      group: 'overview',
      initialValue: false,
      description: 'Check to include in the BPDS Construction Work tab',
    }),
    defineField({
      name: 'category',
      title: 'Project Service Category',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'heroImage',
      title: 'Main Hero Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Project Introduction',
      type: 'text',
      group: 'content',
      rows: 4,
    }),
    defineField({
      name: 'sections',
      title: 'Content Section Blocks',
      type: 'array',
      group: 'content',
      of: [{ type: 'sectionBlock' }],
      options: { sortable: true },
    }),
    defineField({
      name: 'specs',
      title: 'Technical Specifications List',
      type: 'array',
      group: 'content',
      of: [{ type: 'specRow' }],
    }),
    defineField({
      name: 'bentoImages',
      title: 'Project Photo Bento Gallery',
      type: 'gallery',
      group: 'gallery',
    }),
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      location: 'location',
      country: 'country',
      media: 'heroImage',
    },
    prepare({ title, location, country, media }) {
      const locationText = [location, country].filter(Boolean).join(', ');
      return {
        title: title || 'Untitled Project',
        subtitle: locationText ? `Case Study • ${locationText}` : 'Case Study',
        media,
      };
    },
  },
});
