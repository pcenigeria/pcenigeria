import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'introBlock',
  title: 'Simple Intro (Tagline + Heading)',
  type: 'object',
  description:
    'A small optional intro shown above a list of items on the page (e.g. above the resource category tabs, or above the news article grid). ' +
    'Both fields are optional — leave them blank and the intro simply will not show; the list below it still displays normally either way.',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Tagline / Eyebrow',
      type: 'string',
      description: 'Small label shown above the heading, e.g. "DOWNLOAD LIBRARY".',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Short heading shown below the tagline.',
    }),
  ],
  preview: {
    select: { title: 'heading', subtitle: 'tagline' },
    prepare({ title, subtitle }) {
      return { title: title || 'Simple Intro', subtitle: subtitle || '' };
    },
  },
});
