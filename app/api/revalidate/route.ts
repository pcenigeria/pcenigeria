import { revalidatePath, revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

const triggerRevalidateTag = (tag: string) => {
  try {
    (revalidateTag as any)(tag);
  } catch {
    // Graceful fallback for single-argument signature
  }
};

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    if (secret !== process.env.SANITY_REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret token' }, { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    const docType = payload?._type;
    const slug = payload?.slug?.current || payload?.slug;

    switch (docType) {
      case 'project':
        triggerRevalidateTag('project');
        if (slug) {
          triggerRevalidateTag(`project-${slug}`);
          revalidatePath(`/projects/${slug}`, 'page');
        }
        revalidatePath('/projects', 'page');
        revalidatePath('/', 'page');
        break;
      case 'newsArticle':
        triggerRevalidateTag('newsArticle');
        if (slug) {
          triggerRevalidateTag(`newsArticle-${slug}`);
          revalidatePath(`/news-insights/${slug}`, 'page');
        }
        revalidatePath('/news-insights', 'page');
        break;
      case 'product':
        triggerRevalidateTag('product');
        if (slug) {
          triggerRevalidateTag(`product-${slug}`);
          revalidatePath(`/products/${slug}`, 'page');
        }
        revalidatePath('/products', 'page');
        break;
      case 'capability':
        triggerRevalidateTag('capability');
        revalidatePath('/capabilities', 'page');
        revalidatePath('/', 'page');
        break;
      case 'equipmentCategory':
        triggerRevalidateTag('equipmentCategory');
        revalidatePath('/equipment-technology', 'page');
        break;
      case 'resourceCategory':
        triggerRevalidateTag('resourceCategory');
        revalidatePath('/resources', 'page');
        break;
      case 'navigation':
      case 'globalSettings':
        triggerRevalidateTag('navigation');
        triggerRevalidateTag('globalSettings');
        revalidatePath('/', 'layout');
        break;
      default:
        if (docType) {
          triggerRevalidateTag(docType);
          revalidatePath('/', 'page');
        }
    }

    return NextResponse.json({ revalidated: true, timestamp: Date.now() });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
