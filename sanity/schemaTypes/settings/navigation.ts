import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'navigation',
  title: 'Navigation Menus',
  type: 'document',
  groups: [
    { name: 'header', title: 'Header Menus', default: true },
    { name: 'footer', title: 'Footer Links' },
  ],
  fields: [
    defineField({
      name: 'companyMenu',
      title: 'Our Company Dropdown Links',
      type: 'array',
      group: 'header',
      of: [
        {
          type: 'object',
          title: 'Nav Link',
          fields: [
            defineField({ name: 'title', title: 'Link Title', type: 'string' }),
            defineField({ name: 'href', title: 'Target Path', type: 'string' }),
            defineField({ name: 'description', title: 'Short Description', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'capabilitiesMenu',
      title: 'Capabilities Dropdown Links',
      type: 'array',
      group: 'header',
      of: [
        {
          type: 'object',
          title: 'Nav Link',
          fields: [
            defineField({ name: 'title', title: 'Link Title', type: 'string' }),
            defineField({ name: 'href', title: 'Target Path', type: 'string' }),
            defineField({ name: 'description', title: 'Short Description', type: 'string' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'productsMenu',
      title: 'Products Mega-Menu Links',
      type: 'array',
      group: 'header',
      of: [
        {
          type: 'object',
          title: 'Product Link',
          fields: [
            defineField({ name: 'title', title: 'Product Title', type: 'string' }),
            defineField({ name: 'subtitle', title: 'Product Subtitle', type: 'string' }),
            defineField({ name: 'href', title: 'Target Path', type: 'string' }),
            defineField({ name: 'description', title: 'Short Summary', type: 'text', rows: 2 }),
            defineField({ name: 'image', title: 'Thumbnail Image', type: 'image', options: { hotspot: true } }),
          ],
        },
      ],
    }),
    defineField({
      name: 'mainLinks',
      title: 'Main Navigation Bar Links',
      type: 'array',
      group: 'header',
      of: [
        {
          type: 'object',
          title: 'Nav Item',
          fields: [
            defineField({ name: 'title', title: 'Menu Title', type: 'string' }),
            defineField({ name: 'href', title: 'Target Path', type: 'string' }),
            defineField({
              name: 'insertProductsMenuAfter',
              title: 'Insert Products Mega-Menu After This Link',
              type: 'boolean',
            }),
          ],
        },
      ],
    }),
    defineField({
      name: 'homeLink',
      title: 'Home Link',
      type: 'object',
      group: 'header',
      fields: [
        defineField({ name: 'title', title: 'Link Title', type: 'string', initialValue: 'Home' }),
        defineField({ name: 'href', title: 'Target Path', type: 'string', initialValue: '/' }),
      ],
    }),
    defineField({
      name: 'contactCta',
      title: 'Header Contact CTA Button',
      type: 'object',
      group: 'header',
      fields: [
        defineField({ name: 'text', title: 'Button Text', type: 'string', initialValue: 'Contact Us' }),
        defineField({ name: 'href', title: 'Target Path', type: 'string', initialValue: '/contact' }),
      ],
    }),
    defineField({
      name: 'footerLinks',
      title: 'Footer Quick Links',
      type: 'array',
      group: 'footer',
      of: [
        {
          type: 'object',
          title: 'Footer Link',
          fields: [
            defineField({ name: 'title', title: 'Link Title', type: 'string' }),
            defineField({ name: 'href', title: 'Target Path', type: 'string' }),
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Navigation Menus',
        subtitle: 'Global Header & Dropdown Settings',
      };
    },
  },
});
