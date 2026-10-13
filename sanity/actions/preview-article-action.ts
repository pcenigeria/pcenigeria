import type { DocumentActionComponent } from 'sanity';

export const PreviewArticleAction: DocumentActionComponent = (props) => {
  const { draft, published } = props;
  const doc = draft || published;
  const slug = (doc as any)?.slug?.current as string | undefined;

  return {
    label: 'Preview Article',
    title: slug
      ? 'Open live preview in draft mode in a new tab'
      : 'Please generate or enter a URL slug first to preview',
    disabled: !slug,
    onHandle: () => {
      if (slug) {
        window.open(`/api/draft-mode/enable?slug=${encodeURIComponent(slug)}`, '_blank');
      }
    },
  };
};
