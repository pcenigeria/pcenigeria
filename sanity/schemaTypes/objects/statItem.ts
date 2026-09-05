import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'statItem',
  title: 'Stat / Key Metric',
  type: 'object',
  fields: [
    defineField({
      name: 'number',
      title: 'Stat Number / Value',
      type: 'string',
      description: 'e.g. "1200t", "100%", "25+"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'label',
      title: 'Stat Label',
      type: 'string',
      description: 'e.g. "Rig Push Capacity", "Safety Record"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Icon / Background Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'gallery',
      title: 'Modal Lightbox Photo Gallery',
      type: 'gallery',
      description: 'Photos displayed when clicking this card gallery badge',
    }),
  ],
  preview: {
    select: {
      title: 'number',
      subtitle: 'label',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ? `Stat: ${title}` : 'Stat Item',
        subtitle: subtitle || '',
        media,
      };
    },
  },
});
