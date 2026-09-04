import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'gallery',
  title: 'Gallery / Mini Slide Set',
  type: 'object',
  fields: [
    defineField({
      name: 'categoryTitle',
      title: 'Gallery Category Title',
      type: 'string',
    }),
    defineField({
      name: 'items',
      title: 'Gallery Items',
      type: 'array',
      of: [{ type: 'galleryItem' }],
      options: { sortable: true },
    }),
  ],
  preview: {
    select: {
      title: 'categoryTitle',
      items: 'items',
    },
    prepare({ title, items }) {
      const count = items ? items.length : 0;
      return {
        title: title || 'Image Gallery',
        subtitle: `${count} item${count === 1 ? '' : 's'}`,
      };
    },
  },
});
