import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'globalSettings',
  title: 'Global Site Settings',
  type: 'document',
  groups: [
    { name: 'general', title: 'General Info', default: true },
    { name: 'contacts', title: 'Footer Contacts' },
    { name: 'social', title: 'Social Media' },
    { name: 'seo', title: 'Default SEO' },
  ],
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Website Main Title',
      type: 'string',
      group: 'general',
      initialValue: 'PCE Nigeria — Power & Construction Engineering',
    }),
    defineField({
      name: 'logo',
      title: 'Company Logo',
      type: 'image',
      group: 'general',
      options: { hotspot: true },
    }),
    defineField({
      name: 'favicon',
      title: 'Site Favicon Icon',
      type: 'image',
      group: 'general',
    }),
    defineField({
      name: 'footerContacts',
      title: 'Footer Contact Representatives',
      type: 'array',
      group: 'contacts',
      of: [{ type: 'contactPerson' }],
      description: 'e.g. Wan Yang (+234 814 990 8888), Xu Liangkui (+234 814 990 6666)',
    }),
    defineField({
      name: 'generalEmail',
      title: 'Official General Inquiries Email',
      type: 'string',
      group: 'contacts',
      initialValue: 'info@pcenigeria.com',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Channels',
      type: 'array',
      group: 'social',
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
      name: 'footerTagline',
      title: 'Footer Tagline / Copyright Copy',
      type: 'string',
      group: 'general',
    }),
    defineField({
      name: 'defaultSeo',
      title: 'Fallback Default SEO Metadata',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Global Site Settings',
        subtitle: 'Site Identity, Footer Contacts & Social Links',
      };
    },
  },
});
