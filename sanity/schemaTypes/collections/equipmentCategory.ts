import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'equipmentCategory',
  title: 'Equipment Category',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content' },
    { name: 'gallery', title: 'Media / Gallery' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Equipment Category Name',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug / Identifier',
      type: 'slug',
      group: 'overview',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Category Tagline / Eyebrow',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'subtext',
      title: 'Category Technical Subtext',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'items',
      title: 'Individual Machinery & Equipment Fleet Items',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'object',
          title: 'Equipment Fleet Item',
          fields: [
            defineField({ name: 'id', title: 'Item Identifier Slug', type: 'string' }),
            defineField({ name: 'number', title: 'Item Index Number', type: 'string' }),
            defineField({ name: 'title', title: 'Equipment Name / Model', type: 'string', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Tonnage / Specifications Summary', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Equipment Photo', type: 'image', options: { hotspot: true } }),
          ],
          preview: {
            select: { title: 'title', subtitle: 'description', media: 'image' },
            prepare({ title, subtitle, media }) {
              return { title: title || 'Equipment Item', subtitle: subtitle || '', media };
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
      title: 'name',
      subtitle: 'tagline',
      items: 'items',
    },
    prepare({ title, subtitle, items }) {
      const count = items ? items.length : 0;
      return {
        title: title || 'Equipment Category',
        subtitle: subtitle ? `Equipment • ${subtitle} (${count} items)` : `Equipment • ${count} items`,
      };
    },
  },
});
