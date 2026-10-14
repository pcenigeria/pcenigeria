import { defineField, defineType, defineArrayMember } from 'sanity';
import {
  FileText,
  Video,
  List,
  BarChart3,
  Quote,
  Images,
  MousePointerClick,
  Layers,
} from 'lucide-react';
import { SmartBulletsInput } from '../../components/smart-bullets-input';

export default defineType({
  name: 'sectionBlock',
  title: 'Content Section Block',
  type: 'object',
  icon: Layers,
  description:
    'A content section with a heading and your custom choice of content widgets (Paragraphs, Media Embeds, Bullets, Stats, Quotes, Galleries, etc.).',
  fieldsets: [
    {
      name: 'legacy',
      title: 'Legacy Fields (Previous Monolithic Format)',
      options: { collapsible: true, collapsed: true },
    },
  ],
  fields: [
    defineField({
      name: 'tagline',
      title: 'Section Tagline / Eyebrow',
      type: 'string',
      description: 'Optional small uppercase category or topic label above the heading, e.g. "ENGINEERING METHODOLOGY".',
    }),
    defineField({
      name: 'heading',
      title: 'Section Heading',
      type: 'string',
      description: 'The main H2 heading for this section.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'headingColor',
      title: 'Heading Style Accent',
      type: 'string',
      description: 'Accent color for the heading text.',
      options: {
        list: [
          { title: 'Standard Navy', value: 'navy' },
          { title: 'Accent Blue', value: 'blue' },
          { title: 'Accent Orange', value: 'orange' },
        ],
      },
    }),
    defineField({
      name: 'contentBlocks',
      title: 'Content Widgets',
      type: 'array',
      description:
        'Click "Add item" to insert only the widgets you want in this section. Drag to reorder widgets freely.',
      of: [
        defineArrayMember({
          name: 'richTextWidget',
          title: 'Paragraph / Rich Text',
          type: 'object',
          icon: FileText,
          fields: [
            defineField({
              name: 'content',
              title: 'Text Content',
              type: 'blockContent',
              description: 'Body paragraphs with formatting, bullet lists, links, or inline images.',
            }),
          ],
          preview: {
            select: { content: 'content' },
            prepare({ content }) {
              const firstBlock = Array.isArray(content)
                ? content.find((b: any) => b._type === 'block')
                : null;
              const text =
                firstBlock?.children?.map((c: any) => c.text).join('') || 'Empty paragraph';
              return {
                title: text.length > 55 ? `${text.slice(0, 55)}...` : text,
                subtitle: 'Paragraph / Rich Text',
                media: FileText,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'mediaEmbedWidget',
          title: 'Media Embed (YouTube / Vimeo / Social)',
          type: 'object',
          icon: Video,
          fields: [
            defineField({
              name: 'url',
              title: 'Media URL',
              type: 'url',
              description: 'Paste a link to YouTube (standard or Shorts), Vimeo, X (Twitter), LinkedIn, or other media.',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Caption / Label',
              type: 'string',
              description: 'Optional caption or description shown beneath the media player.',
            }),
            defineField({
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'string',
              initialValue: '16:9',
              options: {
                list: [
                  { title: '16:9 (Standard Video / YouTube)', value: '16:9' },
                  { title: '4:3 (Classic Video)', value: '4:3' },
                  { title: '1:1 (Square / Social)', value: '1:1' },
                  { title: '9:16 (Vertical / Shorts / Reels)', value: '9:16' },
                ],
              },
            }),
          ],
          preview: {
            select: { url: 'url', caption: 'caption' },
            prepare({ url, caption }) {
              return {
                title: caption || url || 'Media Embed',
                subtitle: url ? `Embed • ${url}` : 'Media Embed',
                media: Video,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'bulletsWidget',
          title: 'Bullet Points List',
          type: 'object',
          icon: List,
          fields: [
            defineField({
              name: 'items',
              title: 'Bullet Points',
              type: 'array',
              of: [{ type: 'string' }],
              components: {
                input: SmartBulletsInput,
              },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { items: 'items' },
            prepare({ items }) {
              const count = items?.length || 0;
              const first = items?.[0] || 'Empty list';
              return {
                title: `${count} Bullet Point${count === 1 ? '' : 's'}`,
                subtitle: first.length > 50 ? `${first.slice(0, 50)}...` : first,
                media: List,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'statWidget',
          title: 'Highlight Stat Metric',
          type: 'object',
          icon: BarChart3,
          fields: [
            defineField({
              name: 'value',
              title: 'Metric Value (e.g. 1,200t, 48-Inch, 2,293m)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Metric Label / Description (e.g. Rig Pullback Capacity)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { value: 'value', label: 'label' },
            prepare({ value, label }) {
              return {
                title: value ? `${value} — ${label || ''}` : 'Highlight Stat',
                subtitle: 'Metric Callout',
                media: BarChart3,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'quoteWidget',
          title: 'Quote / Key Takeaway',
          type: 'object',
          icon: Quote,
          fields: [
            defineField({
              name: 'quote',
              title: 'Quote or Key Takeaway Text',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'author',
              title: 'Quoted Person / Source',
              type: 'string',
            }),
            defineField({
              name: 'role',
              title: 'Role / Designation (e.g. Senior HDD Engineer)',
              type: 'string',
            }),
          ],
          preview: {
            select: { quote: 'quote', author: 'author' },
            prepare({ quote, author }) {
              return {
                title: quote ? `"${quote.slice(0, 45)}..."` : 'Quote Callout',
                subtitle: author ? `Quote • ${author}` : 'Quote Callout',
                media: Quote,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'galleryWidget',
          title: 'Photo Gallery Grid',
          type: 'object',
          icon: Images,
          fields: [
            defineField({
              name: 'gallery',
              title: 'Section Photos',
              type: 'gallery',
            }),
          ],
          preview: {
            select: { gallery: 'gallery' },
            prepare({ gallery }) {
              const count = gallery?.items?.length || 0;
              return {
                title: `${count} Photo${count === 1 ? '' : 's'} Gallery`,
                subtitle: 'Photo Gallery Grid',
                media: Images,
              };
            },
          },
        }),
        defineArrayMember({
          name: 'buttonWidget',
          title: 'Action Button / Link',
          type: 'object',
          icon: MousePointerClick,
          fields: [
            defineField({
              name: 'text',
              title: 'Button Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'Link URL (e.g. /capabilities or /contact)',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'variant',
              title: 'Button Style',
              type: 'string',
              initialValue: 'primary',
              options: {
                list: [
                  { title: 'Primary Brand Blue', value: 'primary' },
                  { title: 'Accent Orange', value: 'orange' },
                  { title: 'Outline Navy', value: 'outline' },
                ],
              },
            }),
          ],
          preview: {
            select: { text: 'text', url: 'url' },
            prepare({ text, url }) {
              return {
                title: text || 'Action Button',
                subtitle: url ? `Button • ${url}` : 'Action Button',
                media: MousePointerClick,
              };
            },
          },
        }),
      ],
    }),
    // Legacy fields preserved under collapsible fieldset
    defineField({
      name: 'body',
      title: 'Body Paragraphs (Legacy)',
      type: 'blockContent',
      fieldset: 'legacy',
    }),
    defineField({
      name: 'bullets',
      title: 'Bullet Points (Legacy)',
      type: 'array',
      of: [{ type: 'string' }],
      components: {
        input: SmartBulletsInput,
      },
      fieldset: 'legacy',
    }),
    defineField({
      name: 'highlightStat',
      title: 'Highlight Stat Metric (Legacy)',
      type: 'object',
      fieldset: 'legacy',
      fields: [
        defineField({ name: 'value', title: 'Metric Value', type: 'string' }),
        defineField({ name: 'label', title: 'Metric Label', type: 'string' }),
      ],
    }),
    defineField({
      name: 'buttonText',
      title: 'Action Button Label (Legacy)',
      type: 'string',
      fieldset: 'legacy',
    }),
    defineField({
      name: 'buttonLink',
      title: 'Action Button Link URL (Legacy)',
      type: 'string',
      fieldset: 'legacy',
    }),
    defineField({
      name: 'gallery',
      title: 'Section Photo Gallery (Legacy)',
      type: 'gallery',
      fieldset: 'legacy',
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
