import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sectionBlock',
  title: 'Content Section Block',
  type: 'object',
  fields: [
    defineField({
      name: 'tagline',
      title: 'Section Tagline / Eyebrow',
      type: 'string',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingColor',
      title: 'Heading Style Accent',
      type: 'string',
      options: {
        list: [
          { title: 'Standard Navy', value: 'navy' },
          { title: 'Accent Blue', value: 'blue' },
          { title: 'Accent Orange', value: 'orange' },
        ],
      },
    }),
    defineField({
      name: 'body',
      title: 'Body Paragraphs',
      type: 'blockContent',
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet Points',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'highlightStat',
      title: 'Highlight Stat Metric',
      type: 'object',
      fields: [
        defineField({ name: 'value', title: 'Metric Value', type: 'string' }),
        defineField({ name: 'label', title: 'Metric Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'buttonText',
      title: 'Action Button Label',
      type: 'string',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Action Button Link URL',
      type: 'string',
    }),
    defineField({
      name: 'gallery',
      title: 'Section Photo Gallery',
      type: 'gallery',
      description: 'Image gallery items for lightbox / carousel in this section',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'tagline',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Content Section',
        subtitle: subtitle ? `Section • ${subtitle}` : 'Content Block',
      };
    },
  },
});
