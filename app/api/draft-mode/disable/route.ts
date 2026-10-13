import { draftMode } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const redirectUrl = searchParams.get('redirect') || '/news-insights';

  // Disable Next.js Draft Mode
  const draft = await draftMode();
  draft.disable();

  redirect(redirectUrl);
}
