import { defineField, defineType } from 'sanity';

export default defineType({
  name: 'newsArticle',
  title: 'News & Insights Article',
  type: 'document',
  description:
    'One article shown on the live /news-insights page and its own article page. Fill in "Overview" first, ' +
    'then add the body of the article under "Content". Leaving "Content Sections" empty means the article page ' +
    'will show only the hero image and intro summary, with no body content below it.',
  groups: [
    { name: 'overview', title: 'Overview', default: true },
    { name: 'content', title: 'Content' },
    { name: 'gallery', title: 'Media / Gallery' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Article Title', type: 'string', group: 'overview', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'overview',
      description: 'Auto-generated from the Article Title above — click "Generate" if it\'s empty. This becomes the article\'s web address, e.g. /news-insights/your-slug-here.',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category', title: 'Article Category', type: 'string', group: 'overview',
      description: 'Determines which filter tab ("News" or "Insights") this article appears under on the /news-insights list page.',
      options: { list: [{ title: 'News', value: 'News' }, { title: 'Insights', value: 'Insights' }], layout: 'radio' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'date', title: 'Publication Date', type: 'string', group: 'overview', description: 'Shown on the article card and at the top of the article page, e.g. "March 2025". Free text — not a calendar picker.' }),
    defineField({ name: 'readTime', title: 'Estimated Read Time', type: 'string', group: 'overview', description: 'e.g. "5 min read"' }),
    defineField({ name: 'author', title: 'Article Author', type: 'string', group: 'overview', description: 'Optional. Shown on the article page if filled in.' }),
    defineField({
      name: 'heroImage',
      title: 'Main Article Cover Image',
      type: 'image',
      group: 'overview',
      description: 'The large image shown at the top of the article page and as the thumbnail on the /news-insights list page. This is different from the "Article Photo Gallery" below.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'intro',
      title: 'Article Executive Summary / Intro',
      type: 'text',
      group: 'content',
      description: 'A short summary shown in two places: as the preview text on the article card on the /news-insights list page, and as the opening paragraph at the top of the article itself, above the content sections below.',
      rows: 3,
    }),
    defineField({
      name: 'sections',
      title: 'Article Content Sections',
      type: 'array',
      group: 'content',
      description:
        'The main body of the article, broken into sections. Each section renders on the page in the order listed here — drag to reorder. ' +
        'Click "Add item" to add a new section; each one is optional and can have its own heading, body text, bullet points, a highlight stat, and photos. ' +
        'If this list is empty, the article page will only show the hero image and intro summary above, with nothing below.',
      of: [{ type: 'sectionBlock' }],
      options: { sortable: true },
    }),
    defineField({
      name: 'bentoImages',
      title: 'Article Photo Gallery',
      type: 'gallery',
      group: 'gallery',
      description:
        'A grid of photos shown together on the article page, separate from the "Main Article Cover Image" above and separate from any photo dropped inline inside a section\'s Body Paragraphs. ' +
        'Use this for a batch of related project/site photos for this article. Leave empty if you have no extra photos to show.',
    }),
    defineField({ name: 'seo', title: 'Search Engine Optimization', type: 'seo', group: 'seo' }),
  ],
  preview: {
    select: { title: 'title', category: 'category', date: 'date', media: 'heroImage' },
    prepare({ title, category, date, media }) {
      const metaText = [category, date].filter(Boolean).join(' • ');
      return { title: title || 'Untitled Article', subtitle: metaText ? `News & Insights • ${metaText}` : 'News & Insights Article', media };
    },
  },
});
