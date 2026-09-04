import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resourceCategory',
  title: 'Resource Category',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'label',
      title: 'Category Label',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Category Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'label', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Downloadable Resources & Documents',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          title: 'Resource Item',
          fields: [
            defineField({ name: 'title', title: 'Document / Report Title', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'file', title: 'Downloadable PDF / Attachment', type: 'file', options: { accept: '.pdf,.doc,.docx,.ppt,.pptx' } }),
            defineField({ name: 'description', title: 'Brief Summary', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'title' },
            prepare({ title }) {
              return { title: title || 'Resource Item', subtitle: 'Downloadable Document' };
            },
          },
        },
      ],
      options: { sortable: true },
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
      title: 'label',
      items: 'items',
    },
    prepare({ title, items }) {
      const count = items ? items.length : 0;
      return {
        title: title || 'Resource Category',
        subtitle: `Resources • ${count} file${count === 1 ? '' : 's'}`,
      };
    },
  },
});
