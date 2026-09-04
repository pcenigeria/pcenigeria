import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'ctaButton',
  title: 'Call to Action Button',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Button Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'href',
      title: 'Link URL / Path',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary Orange Button', value: 'primary' },
          { title: 'Secondary Blue Button', value: 'secondary' },
          { title: 'Tertiary Outline Button', value: 'tertiary' },
        ],
      },
      initialValue: 'primary',
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'href',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'CTA Button',
        subtitle: subtitle ? `Link: ${subtitle}` : '',
      };
    },
  },
});
