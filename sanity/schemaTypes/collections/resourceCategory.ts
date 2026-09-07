import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'resourceCategory',
  title: 'Resource Category',
  type: 'document',
  description:
    'One "Resource Category" document = one tab on the live /resources page (e.g. "Technical Data Sheets (TDS)"). ' +
    'To add a NEW category/tab: create a new "Resource Category" document. ' +
    'To add a NEW file to an EXISTING category: open that category below and add an item to "Downloadable Resources & Documents" — do not create a new category document for it.',
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
      description:
        'The text shown on the filter tab at the top of the live /resources page, e.g. "Technical Data Sheets (TDS)". Keep it short — it has to fit as a tab.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Category Slug',
      type: 'slug',
      group: 'overview',
      description: 'Auto-generated from the Category Label above — click "Generate" if it\'s empty. Not shown to visitors, just used internally.',
      options: { source: 'label', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Downloadable Resources & Documents',
      type: 'array',
      group: 'content',
      description:
        'Each item here becomes one downloadable card on the live /resources page, under this category\'s tab. Click "Add item" below to upload a new document — you do NOT need to create a new "Resource Category" for this, only for a brand-new tab.',
      of: [
        {
          type: 'object',
          title: 'Resource Item',
          fields: [
            defineField({
              name: 'title',
              title: 'Document / Report Title',
              type: 'string',
              description: 'Shown as the card\'s heading on the live page, e.g. "BRSBENT SQ Technical Data Sheet (TDS)".',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'file',
              title: 'Downloadable PDF / Attachment',
              type: 'file',
              description: 'The actual file visitors download when they click "Download PDF" on the live site. Accepts PDF, Word or PowerPoint files.',
              options: { accept: '.pdf,.doc,.docx,.ppt,.pptx' },
            }),
            defineField({
              name: 'description',
              title: 'Brief Summary',
              type: 'text',
              description: 'Optional short description. Currently not shown on the live resource cards, but kept for future use — safe to leave blank.',
              rows: 2,
            }),
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
