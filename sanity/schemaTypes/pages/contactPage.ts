import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contact Page',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Hero & Intro', default: true },
    { name: 'details', title: 'Contact Details & Channels' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'officeAddress',
      title: 'Head Office Address',
      type: 'text',
      group: 'details',
      rows: 3,
    }),
    defineField({
      name: 'phoneNumbers',
      title: 'Primary Phone Numbers',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'emailAddresses',
      title: 'Official Email Addresses',
      type: 'array',
      group: 'details',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Channels',
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          title: 'Social Channel',
          fields: [
            defineField({ name: 'platform', title: 'Platform Name', type: 'string' }),
            defineField({ name: 'url', title: 'Profile URL', type: 'url' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Contact Page',
        subtitle: 'Page Singleton • /contact',
      };
    },
  },
});
