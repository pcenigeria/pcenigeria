import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'specRow',
  title: 'Specification Row',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Specification Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'value',
      title: 'Specification Value',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'label',
      subtitle: 'value',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Spec Row',
        subtitle: subtitle || '',
      };
    },
  },
});
