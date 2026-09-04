import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'newsArticle',
  title: 'News & Insights Article',
  type: 'document',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content' },
    { name: 'gallery', title: 'Media / Gallery' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Article Title',
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
      name: 'category',
      title: 'Article Category',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          { title: 'News', value: 'News' },
          { title: 'Insights', value: 'Insights' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publication Date',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'readTime',
      title: 'Estimated Read Time',
      type: 'string',
      group: 'overview',
      description: 'e.g. "5 min read"',
    }),
    defineField({
      name: 'author',
      title: 'Article Author',
      type: 'string',
      group: 'overview',
    }),
    defineField({
      name: 'heroImage',
      title: 'Main Article Cover Image',
      type: 'image',
      group: 'overview',
      options: { hotspot: true },
    }),
    defineField({
      name: 'intro',
      title: 'Article Executive Summary / Intro',
      type: 'text',
      group: 'content',
      rows: 3,
    }),
    defineField({
      name: 'sections',
      title: 'Article Content Sections',
      type: 'array',
      group: 'content',
      of: [{ type: 'sectionBlock' }],
      options: { sortable: true },
    }),
    defineField({
      name: 'bentoImages',
      title: 'Article Photo Gallery',
      type: 'gallery',
      group: 'gallery',
    }),
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
      category: 'category',
      date: 'date',
      media: 'heroImage',
    },
    prepare({ title, category, date, media }) {
      const metaText = [category, date].filter(Boolean).join(' • ');
      return {
        title: title || 'Untitled Article',
        subtitle: metaText ? `News & Insights • ${metaText}` : 'News & Insights Article',
        media,
      };
    },
  },
});
