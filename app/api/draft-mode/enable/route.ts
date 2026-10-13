import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  // Enable Next.js Draft Mode
  const draft = await draftMode();
  draft.enable();

  if (slug) {
    redirect(`/news-insights/${encodeURIComponent(slug)}`);
  }

  redirect('/news-insights');
}
