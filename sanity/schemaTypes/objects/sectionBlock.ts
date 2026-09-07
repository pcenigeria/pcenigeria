import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'sectionBlock',
  title: 'Content Section Block',
  type: 'object',
  description:
    'A reusable content block used across many pages. All fields below are optional — leave any of them blank and that part of the page simply won\'t show, ' +
    'the page won\'t break. Tip: "Body Paragraphs" and "Section Photo Gallery" are two separate, independent ways to add photos — you can use either, both, or neither.',
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
      description:
        'The main written content for this section. You can drop a photo directly into the middle of this text using the image button in the toolbar — it will show inline, right where you place it, with an optional caption.',
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
      description:
        'A separate set of photos for this section, shown together as a small grid below the body text — different from an image dropped inside "Body Paragraphs" above. Use this for a batch of related photos rather than one image placed in a specific spot in the text.',
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
