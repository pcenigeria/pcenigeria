import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactPerson',
  title: 'Contact Person',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'Contact Representative',
        subtitle: subtitle || '',
      };
    },
  },
});
