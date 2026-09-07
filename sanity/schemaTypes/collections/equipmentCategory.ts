import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'equipmentCategory',
  title: 'Equipment Category',
  type: 'document',
  description:
    'One "Equipment Category" document = one equipment group on the live /equipment page (e.g. "Excavators", "HDD Rigs"). ' +
    'To add a NEW category: create a new "Equipment Category" document. ' +
    'To add a NEW machine to an EXISTING category: open that category below and add an item to "Individual Machinery & Equipment Fleet Items" — do not create a new category document for it.',
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
      description: 'The category name shown on the live /equipment page, e.g. "Excavators" or "HDD Rigs".',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug / Identifier',
      type: 'slug',
      group: 'overview',
      description: 'Auto-generated from the Category Name above — click "Generate" if it\'s empty. Not shown to visitors, just used internally.',
      options: { source: 'name', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Category Tagline / Eyebrow',
      type: 'string',
      group: 'overview',
      description: 'Optional short label shown above the category name on the live page.',
    }),
    defineField({
      name: 'description',
      title: 'Category Description',
      type: 'text',
      group: 'overview',
      description: 'A short paragraph introducing this equipment category on the live page.',
      rows: 3,
    }),
    defineField({
      name: 'subtext',
      title: 'Category Technical Subtext',
      type: 'text',
      group: 'overview',
      description: 'Optional secondary technical text shown alongside the description.',
      rows: 3,
    }),
    defineField({
      name: 'items',
      title: 'Individual Machinery & Equipment Fleet Items',
      type: 'array',
      group: 'content',
      description:
        'Each item here becomes one machine card on the live /equipment page, under this category. Click "Add item" to add a new machine — ' +
        'you do NOT need to create a new "Equipment Category" for this, only for a brand-new category.',
      of: [
        {
          type: 'object',
          title: 'Equipment Fleet Item',
          fields: [
            defineField({ name: 'id', title: 'Item Identifier Slug', type: 'string', description: 'Optional internal identifier. Safe to leave blank — it is not required for the item to display.' }),
            defineField({ name: 'number', title: 'Item Index Number', type: 'string', description: 'Optional display number/index shown next to the item, e.g. "01".' }),
            defineField({ name: 'title', title: 'Equipment Name / Model', type: 'string', description: 'Shown as the card\'s heading on the live page, e.g. "CAT 336 Excavator".', validation: (Rule) => Rule.required() }),
            defineField({ name: 'description', title: 'Tonnage / Specifications Summary', type: 'text', description: 'Short spec line shown on the card, e.g. tonnage, capacity, or key specs.', rows: 2 }),
            defineField({ name: 'image', title: 'Equipment Photo', type: 'image', description: 'Photo shown on the equipment card.', options: { hotspot: true } }),
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
