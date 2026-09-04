import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'capability',
  title: 'Capability Page & Card',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content' },
    { name: 'gallery', title: 'Media / Gallery' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'id',
      title: 'Capability Identifier Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
      description: 'e.g. hdd, epc, bpds, support',
    }),
    defineField({
      name: 'number',
      title: 'Display Card Number',
      type: 'string',
      group: 'overview',
      description: 'e.g. "01", "02"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Capability Title',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Card Summary Description',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Card Cover Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),
    defineField({
      name: 'headline',
      title: 'Detailed Page Section Headline',
      type: 'string',
      group: 'content',
    }),
    defineField({
      name: 'subtext',
      title: 'Detailed Page Subtext',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'steps',
      title: 'Process Workflow Steps',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          title: 'Workflow Step',
          fields: [
            defineField({ name: 'number', title: 'Step Number', type: 'string' }),
            defineField({ name: 'title', title: 'Step Title', type: 'string' }),
            defineField({ name: 'description', title: 'Step Description', type: 'text', rows: 2 }),
          ],
        },
      ],
      options: { sortable: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Capability Photo Gallery',
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
      number: 'number',
      title: 'title',
      media: 'image',
    },
    prepare({ number, title, media }) {
      return {
        title: title ? `[${number || '0'}] ${title}` : 'Untitled Capability',
        subtitle: 'Core Capability',
        media,
      };
    },
  },
});
