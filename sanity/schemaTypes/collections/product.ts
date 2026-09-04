import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'product',
  title: 'Product Detail',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'specs', title: 'Technical Specs & SDS' },
    { name: 'safety', title: 'Safety Data' },
    { name: 'supply', title: 'Supply & Contacts' },
    { name: 'gallery', title: 'Media / Gallery' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // Overview Tab
    defineField({
      name: 'title',
      title: 'Product Name',
      type: 'string',
      group: 'overview',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'overview',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Product Subtitle',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'eyebrow',
      title: 'Product Category Eyebrow / Tagline',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'alsoKnownAs',
      title: 'Also Known As (Aliases / Synonyms)',
      type: 'array',
      group: 'overview',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'description',
      title: 'Product Short Summary',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'overviewText',
      title: 'Product Detailed Overview Text',
      type: 'text',
      group: 'overview',
      rows: 4,
    }),
    defineField({
      name: 'whatItDoes',
      title: 'What It Does / Core Function Summary',
      type: 'text',
      group: 'overview',
      rows: 3,
    }),
    defineField({
      name: 'image',
      title: 'Primary Product Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),
    defineField({
      name: 'secondaryImage',
      title: 'Secondary Product Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),
    defineField({
      name: 'heroImage',
      title: 'Product Page Hero Banner Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),

    // Technical Specs & SDS Tab
    defineField({
      name: 'intro',
      title: 'Technical Section Introduction',
      type: 'text',
      group: 'specs',
      rows: 3,
    }),
    defineField({
      name: 'executiveStandard',
      title: 'Executive Quality Standard',
      type: 'string',
      group: 'specs',
      description: 'e.g. "Q/PCE 001-2024 / API Standard"',
    }),
    defineField({
      name: 'mainFunctions',
      title: 'Main Functions List',
      type: 'array',
      group: 'specs',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'features',
      title: 'Key Product Features',
      type: 'array',
      group: 'specs',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'applications',
      title: 'Application Areas & Uses',
      type: 'array',
      group: 'specs',
      of: [
        {
          type: 'object',
          title: 'Application Item',
          fields: [
            defineField({ name: 'title', title: 'Application Title', type: 'string' }),
            defineField({ name: 'desc', title: 'Application Description', type: 'text', rows: 2 }),
            defineField({ name: 'icon', title: 'Icon Identifier', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'specRows',
      title: 'Property Specifications List',
      type: 'array',
      group: 'specs',
      of: [{ type: 'specRow' }],
    }),
    defineField({
      name: 'specTables',
      title: 'Complex Technical Specification Tables',
      type: 'array',
      group: 'specs',
      of: [
        {
          type: 'object',
          title: 'Spec Table',
          fields: [
            defineField({ name: 'title', title: 'Table Title', type: 'string' }),
            defineField({ name: 'headers', title: 'Table Column Headers', type: 'array', of: [{ type: 'string' }] }),
            defineField({
              name: 'rows',
              title: 'Table Data Rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  title: 'Row',
                  fields: [
                    defineField({ name: 'cells', title: 'Row Cell Values', type: 'array', of: [{ type: 'string' }] }),
                  ],
                },
              ],
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'howItsUsed',
      title: 'How It Is Used & Dosage Guidelines',
      type: 'object',
      group: 'specs',
      fields: [
        defineField({ name: 'description', title: 'Usage Description', type: 'text', rows: 3 }),
        defineField({ name: 'recommendedDosage', title: 'Recommended Dosage', type: 'string' }),
        defineField({ name: 'mixingInstructions', title: 'Mixing & Addition Method', type: 'text', rows: 3 }),
      ],
    }),
    defineField({
      name: 'tdsFile',
      title: 'Technical Data Sheet (TDS PDF File)',
      type: 'file',
      group: 'specs',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'sdsFile',
      title: 'Safety Data Sheet (SDS PDF File)',
      type: 'file',
      group: 'specs',
      options: { accept: '.pdf' },
    }),
    defineField({
      name: 'sections',
      title: 'Additional Content Sections',
      type: 'array',
      group: 'specs',
      of: [{ type: 'sectionBlock' }],
    }),

    // Safety Data Tab
    defineField({
      name: 'safetyAtAGlance',
      title: 'Safety at a Glance Metrics',
      type: 'object',
      group: 'safety',
      fields: [
        defineField({ name: 'hazardRating', title: 'Hazard Rating Summary', type: 'string' }),
        defineField({ name: 'handlingPrecautions', title: 'Handling Precautions Summary', type: 'text', rows: 3 }),
        defineField({ name: 'recommendedPpe', title: 'Recommended PPE Items', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({
      name: 'storageInfo',
      title: 'Storage & Handling Instructions',
      type: 'text',
      group: 'safety',
      rows: 4,
    }),
    defineField({
      name: 'sdsSections',
      title: 'Full SDS Regulatory Sections',
      type: 'array',
      group: 'safety',
      of: [
        {
          type: 'object',
          title: 'SDS Section',
          fields: [
            defineField({ name: 'sectionNumber', title: 'Section Number', type: 'string' }),
            defineField({ name: 'title', title: 'Section Title', type: 'string' }),
            defineField({ name: 'content', title: 'Section Content Text', type: 'text', rows: 3 }),
          ],
        },
      ],
    }),

    // Supply & Contacts Tab
    defineField({
      name: 'supplyDetails',
      title: 'Packaging & Supply Chain Details',
      type: 'object',
      group: 'supply',
      fields: [
        defineField({ name: 'packaging', title: 'Packaging Options', type: 'string' }),
        defineField({ name: 'minimumOrder', title: 'Minimum Order Quantity', type: 'string' }),
        defineField({ name: 'leadTime', title: 'Typical Delivery Lead Time', type: 'string' }),
        defineField({ name: 'logisticsHubs', title: 'Logistics / Stock Hub Locations', type: 'array', of: [{ type: 'string' }] }),
      ],
    }),
    defineField({
      name: 'salesContacts',
      title: 'Product Sales Contact Representatives',
      type: 'array',
      group: 'supply',
      of: [{ type: 'contactPerson' }],
    }),

    // Media & Gallery Tab
    defineField({
      name: 'galleryImages',
      title: 'Product Photo Gallery',
      type: 'gallery',
      group: 'gallery',
    }),
    defineField({
      name: 'technicalImages',
      title: 'Technical Diagrams & Performance Charts',
      type: 'gallery',
      group: 'gallery',
    }),

    // SEO Tab
    defineField({
      name: 'seo',
      title: 'Search Engine Optimization',
      type: 'seo',
      group: 'seo',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'eyebrow',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Untitled Product',
        subtitle: subtitle ? `Product • ${subtitle}` : 'Product Detail',
        media,
      };
    },
  },
});
