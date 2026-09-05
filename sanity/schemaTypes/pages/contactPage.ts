import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'contactPage',
  title: 'Contact Us Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'contacts', title: '2. Office Contacts & Personnel' },
    { name: 'form', title: '3. Contact Form Copy' },
    { name: 'seo', title: 'SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Contact PCE Nigeria Limited',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'contactPersons',
      title: 'Key Contact Personnel',
      type: 'array',
      group: 'contacts',
      of: [{ type: 'contactPerson' }],
    }),
    defineField({
      name: 'abujaOffice',
      title: 'Abuja Office Address',
      type: 'text',
      group: 'contacts',
      rows: 2,
      initialValue: 'House 45, Nelson Mandela Street, Asokoro, Abuja, Nigeria',
    }),
    defineField({
      name: 'lagosOffice',
      title: 'Lagos Office Address',
      type: 'text',
      group: 'contacts',
      rows: 2,
      initialValue: 'HyGroup Place 6 Ojulari St, off Kusenla Rd Ikate, Lekki, Lagos',
    }),
    defineField({
      name: 'portHarcourtBase',
      title: 'Port Harcourt Operational Base',
      type: 'text',
      group: 'contacts',
      rows: 2,
      initialValue: 'East-West Road Opp. New Onne Link Rd Ebubu, Eleme, Rivers State',
    }),
    defineField({
      name: 'generalEmail',
      title: 'General Contact Email',
      type: 'string',
      group: 'contacts',
      initialValue: 'info@pcenigeria.com',
    }),
    defineField({
      name: 'formSection',
      title: 'Contact Form Section Block',
      type: 'sectionBlock',
      group: 'form',
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
        title: 'Contact Us Page',
        subtitle: 'Page Singleton • /contact',
      };
    },
  },
});
