import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'productsPage',
  title: 'Products Page',
  type: 'document',
  groups: [
    { name: 'hero', title: '1. Hero Banner', default: true },
    { name: 'catalog', title: '2. Drilling Mud Products Catalog' },
    { name: 'about', title: '3. About PCE Products' },
    { name: 'stratum', title: '4. Stratum Engineering Guide' },
    { name: 'matrix', title: '5. Performance Matrix' },
    { name: 'caseStudies', title: '6. HDD Case Studies' },
    { name: 'logistics', title: '7. Stock & Logistics In Nigeria' },
    { name: 'cta', title: '8. Products Technical CTA & Sales Contacts' },
    { name: 'seo', title: '9. SEO Metadata' },
  ],
  fields: [
    defineField({
      name: 'heroHeadline',
      title: 'Hero Banner Headline',
      type: 'string',
      group: 'hero',
      initialValue: 'Specialty Drilling Chemicals & Lantic Bentonite Products',
    }),
    defineField({
      name: 'heroSubtext',
      title: 'Hero Banner Subtext',
      type: 'text',
      group: 'hero',
      rows: 3,
    }),
    defineField({
      name: 'heroBullets',
      title: 'Hero Highlight Bullets',
      type: 'array',
      group: 'hero',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'catalogSection',
      title: 'Products Catalog Section Block',
      type: 'sectionBlock',
      group: 'catalog',
    }),
    defineField({
      name: 'aboutSection',
      title: 'About Products Section',
      type: 'object',
      group: 'about',
      fields: [
        defineField({ name: 'tagline', title: 'Section Tagline / Eyebrow', type: 'string', initialValue: 'About Us' }),
        defineField({ name: 'heading', title: 'Section Heading', type: 'string', initialValue: 'A Team Built on Drilling Fluid Expertise' }),
        defineField({ name: 'body', title: 'Body Text / Paragraphs', type: 'blockContent' }),
        defineField({
          name: 'callout',
          title: 'Quality Control Callout Box',
          type: 'object',
          fields: [
            defineField({ name: 'badge', title: 'Callout Eyebrow / Badge', type: 'string', initialValue: 'Quality Control & Testing' }),
            defineField({ name: 'title', title: 'Callout Title', type: 'string', initialValue: '100% Laboratory Verified Before Delivery' }),
            defineField({ name: 'text', title: 'Callout Text', type: 'text', rows: 3 }),
            defineField({ name: 'footer', title: 'Callout Footer Tag', type: 'string', initialValue: 'ISO-Standard Mud Testing Protocol' }),
          ],
        }),
        defineField({
          name: 'stats',
          title: 'Performance Highlights / Stats Bar',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Stat Item',
              fields: [
                defineField({ name: 'stat', title: 'Metric Value (e.g. 15+, 500+)', type: 'string' }),
                defineField({ name: 'label', title: 'Metric Label (e.g. Years in HDD)', type: 'string' }),
              ],
              preview: {
                select: { title: 'stat', subtitle: 'label' },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'stratumSection',
      title: 'Stratum Engineering Guide Section',
      type: 'object',
      group: 'stratum',
      fields: [
        defineField({ name: 'tagline', title: 'Section Tagline / Eyebrow', type: 'string', initialValue: 'Know the Ground' }),
        defineField({ name: 'heading', title: 'Section Heading', type: 'string', initialValue: 'HDD Challenges & Recommended Mud Systems' }),
        defineField({ name: 'intro', title: 'Section Intro Paragraph', type: 'text', rows: 3 }),
        defineField({ name: 'buttonText', title: 'Action Button Label', type: 'string', initialValue: 'Consult Engineering Team →' }),
        defineField({ name: 'buttonLink', title: 'Action Button Link URL', type: 'string', initialValue: '/contact' }),
        defineField({
          name: 'cards',
          title: 'Formation Challenge Cards (4 Formations)',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Formation Card',
              fields: [
                defineField({ name: 'title', title: 'Formation Title', type: 'string' }),
                defineField({
                  name: 'tags',
                  title: 'Risk / Challenge Tags',
                  type: 'array',
                  of: [{ type: 'string' }],
                }),
                defineField({ name: 'desc', title: 'Challenge Description', type: 'text', rows: 3 }),
                defineField({ name: 'recommended', title: 'Recommended Mud System', type: 'string' }),
                defineField({ name: 'proofPoint', title: 'Field Proof Point', type: 'string' }),
              ],
              preview: {
                select: { title: 'title', subtitle: 'recommended' },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'matrixSection',
      title: 'Performance Matrix Section Block',
      type: 'sectionBlock',
      group: 'matrix',
    }),
    defineField({
      name: 'matrixRows',
      title: 'Performance Comparison Matrix Table Rows',
      type: 'array',
      group: 'matrix',
      of: [
        {
          type: 'object',
          title: 'Matrix Table Row',
          fields: [
            defineField({ name: 'product', title: 'Product Name (e.g. BRSBENT SQ)', type: 'string' }),
            defineField({ name: 'ingredient', title: 'Active Ingredient', type: 'string' }),
            defineField({ name: 'viscosity', title: 'Viscosity (e.g. Excellent, Very good, N/A)', type: 'string' }),
            defineField({ name: 'reduceViscosity', title: 'Reduce Viscosity (e.g. Excellent, N/A)', type: 'string' }),
            defineField({ name: 'dynamicShear', title: 'Dynamic Shear (e.g. Excellent, N/A)', type: 'string' }),
            defineField({ name: 'filtration', title: 'Filtration Control (e.g. Excellent, N/A)', type: 'string' }),
            defineField({ name: 'salinity', title: 'Salinity Resistance (e.g. Excellent, N/A)', type: 'string' }),
            defineField({ name: 'stratum', title: 'Applicable Stratum', type: 'string' }),
            defineField({ name: 'hazard', title: 'Hazard Rating', type: 'string', initialValue: 'None' }),
          ],
          preview: {
            select: { title: 'product', subtitle: 'stratum' },
          },
        },
      ],
    }),
    defineField({
      name: 'caseStudiesSection',
      title: 'HDD Case Studies Section',
      type: 'object',
      group: 'caseStudies',
      fields: [
        defineField({ name: 'tagline', title: 'Section Tagline / Eyebrow', type: 'string', initialValue: 'Proven in the Field' }),
        defineField({ name: 'heading', title: 'Section Heading', type: 'string', initialValue: 'Typical HDD Project Case Studies' }),
        defineField({ name: 'subtext', title: 'Section Subtext', type: 'string', initialValue: 'Validated on large-scale HDD crossings across Nigeria, China, and Thailand.' }),
        defineField({
          name: 'items',
          title: 'Project Case Study Cards',
          type: 'array',
          of: [
            {
              type: 'object',
              title: 'Case Study Card',
              fields: [
                defineField({ name: 'num', title: 'Index Number (e.g. 01, 02)', type: 'string' }),
                defineField({ name: 'title', title: 'Project Title', type: 'string' }),
                defineField({ name: 'country', title: 'Location / Client (e.g. Nigeria · NGIC)', type: 'string' }),
                defineField({ name: 'lengthDia', title: 'Length & Diameter (e.g. 2,000 m × 48″)', type: 'string' }),
                defineField({ name: 'depth', title: 'Depth (e.g. 52 m)', type: 'string' }),
                defineField({ name: 'stratum', title: 'Geological Stratum', type: 'string' }),
                defineField({ name: 'rigs', title: 'Rig Capacity (e.g. 1,200T / 500T)', type: 'string' }),
                defineField({ name: 'products', title: 'Products Used', type: 'string' }),
                defineField({ name: 'desc', title: 'Case Description', type: 'text', rows: 3 }),
              ],
              preview: {
                select: { title: 'title', subtitle: 'country' },
              },
            },
          ],
        }),
      ],
    }),
    defineField({
      name: 'logisticsSection',
      title: 'Stock & Logistics Section Block',
      type: 'sectionBlock',
      group: 'logistics',
    }),
    defineField({
      name: 'ctaSection',
      title: 'Products CTA Section Block',
      type: 'sectionBlock',
      group: 'cta',
    }),
    defineField({
      name: 'salesContacts',
      title: 'Direct Sales & Engineering Contacts',
      type: 'array',
      group: 'cta',
      description: 'Editable sales contacts rendered beneath the CTA quote block on /products.',
      of: [
        {
          type: 'object',
          title: 'Sales Contact',
          fields: [
            defineField({ name: 'name', title: 'Contact Name', type: 'string' }),
            defineField({ name: 'phone', title: 'Phone Number', type: 'string' }),
            defineField({ name: 'email', title: 'Email Address', type: 'string' }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'phone' },
          },
        },
      ],
    }),
    defineField({
      name: 'salesOffices',
      title: 'Regional Office Locations',
      type: 'array',
      group: 'cta',
      description: 'Office addresses rendered in the contact block on /products.',
      of: [
        {
          type: 'object',
          title: 'Office Location',
          fields: [
            defineField({ name: 'location', title: 'Office Title (e.g. Abuja Office, Lagos Office)', type: 'string' }),
            defineField({ name: 'address', title: 'Street Address', type: 'text', rows: 2 }),
          ],
          preview: {
            select: { title: 'location', subtitle: 'address' },
          },
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
        title: 'Products Page',
        subtitle: 'Page Singleton • /products',
      };
    },
  },
});
