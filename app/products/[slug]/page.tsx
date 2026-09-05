import React from 'react';
import { notFound } from 'next/navigation';
import { ProductDetailPage } from '@/features/products';
import type { ProductDetail } from '@/features/products';
import { getProductBySlug as getSanityProductBySlug, getAllProducts } from '@/sanity/lib/queries';

type PageProps = {
    params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
    const products = await getAllProducts();
    return products.map((product: any) => ({
        slug: product.slug,
    }));
}

async function resolveSlug(params: PageProps['params']): Promise<string> {
    if (params && typeof (params as any).then === 'function') {
        const resolved = await params;
        return resolved.slug;
    }
    return (params as { slug: string }).slug;
}

function mapSanityProductToDetail(p: any): ProductDetail {
    const galleryImages = Array.isArray(p.galleryImages)
        ? p.galleryImages.map((g: any) => g?.src).filter(Boolean)
        : undefined;

    const technicalImages = Array.isArray(p.technicalImages)
        ? p.technicalImages.map((g: any) => g?.src).filter(Boolean)
        : undefined;

    const specTables = Array.isArray(p.specTables)
        ? p.specTables.map((t: any) => ({
              title: t.title,
              headers: t.headers || [],
              rows: Array.isArray(t.rows) ? t.rows.map((r: any) => r?.cells || []) : [],
          }))
        : undefined;

    // Sanity's `howItsUsed` object ({description, recommendedDosage, mixingInstructions}) does not
    // match the local ProductDetail shape ({application, dosage, suitability, dosageTable,
    // mixingSteps, precaution}). Mapped onto the closest equivalents below; `application`,
    // `dosageTable` and `precaution` have no Sanity source and are left undefined.
    const howItsUsed = p.howItsUsed
        ? {
              suitability: p.howItsUsed.description || undefined,
              dosage: p.howItsUsed.recommendedDosage || undefined,
              mixingSteps: p.howItsUsed.mixingInstructions
                  ? p.howItsUsed.mixingInstructions.split('\n').map((s: string) => s.trim()).filter(Boolean)
                  : undefined,
          }
        : undefined;

    // Sanity's `supplyDetails` is a single object ({packaging, minimumOrder, leadTime,
    // logisticsHubs}) while the local type expects a {label, value}[] list — flatten it here.
    const supplyDetails = p.supplyDetails
        ? ([
              p.supplyDetails.packaging && { label: 'Packaging', value: p.supplyDetails.packaging },
              p.supplyDetails.minimumOrder && { label: 'Minimum Order', value: p.supplyDetails.minimumOrder },
              p.supplyDetails.leadTime && { label: 'Lead Time', value: p.supplyDetails.leadTime },
              Array.isArray(p.supplyDetails.logisticsHubs) && p.supplyDetails.logisticsHubs.length > 0
                  ? { label: 'Logistics Hubs', value: p.supplyDetails.logisticsHubs.join(', ') }
                  : null,
          ].filter(Boolean) as { label: string; value: string }[])
        : undefined;

    const sdsSections = Array.isArray(p.sdsSections)
        ? p.sdsSections.map((s: any, idx: number) => ({
              num: parseInt(s.sectionNumber, 10) || idx + 1,
              title: s.title,
              content: s.content,
          }))
        : undefined;

    // Sanity's `safetyAtAGlance` ({hazardRating, handlingPrecautions, recommendedPpe: string[]})
    // is far simpler than the local shape (ghsHazard/hazardClass, ratings[], ppe:[{type,recommendation}],
    // physicalChemical[]). Only ghsHazard, cautionStrip and a best-effort ppe list are populated;
    // ratings/hazardClass/physicalChemical have no Sanity source.
    const safetyAtAGlance = p.safetyAtAGlance
        ? {
              cautionStrip: p.safetyAtAGlance.handlingPrecautions || undefined,
              ghsHazard: p.safetyAtAGlance.hazardRating || undefined,
              ppe: Array.isArray(p.safetyAtAGlance.recommendedPpe) && p.safetyAtAGlance.recommendedPpe.length > 0
                  ? p.safetyAtAGlance.recommendedPpe.map((item: string, idx: number) => ({
                        type: `PPE Item ${idx + 1}`,
                        recommendation: item,
                    }))
                  : undefined,
          }
        : undefined;

    return {
        id: p._id,
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        eyebrow: p.eyebrow,
        description: p.description,
        image: p.image,
        secondaryImage: p.secondaryImage,
        heroImage: p.heroImage,
        tdsUrl: p.tdsUrl,
        sdsUrl: p.sdsUrl,
        alsoKnownAs: Array.isArray(p.alsoKnownAs) ? p.alsoKnownAs.join(', ') : p.alsoKnownAs,
        overviewText: p.overviewText,
        whatItDoes: p.whatItDoes,
        executiveStandard: p.executiveStandard,
        mainFunctions: p.mainFunctions,
        features: p.features,
        applications: p.applications,
        specTables,
        howItsUsed,
        supplyDetails,
        storageInfo: p.storageInfo,
        sdsSections,
        safetyAtAGlance,
        salesContacts: p.salesContacts,
        galleryImages,
        technicalImages,
    };
}

export async function generateMetadata({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const product = await getSanityProductBySlug(slug);
    if (!product) return {};
    return {
        title: `${product.title} | PCE Nigeria Products`,
        description: product.description,
    };
}

export default async function Page({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const sanityProduct = await getSanityProductBySlug(slug);

    if (!sanityProduct) {
        notFound();
    }

    const product = mapSanityProductToDetail(sanityProduct);

    return <ProductDetailPage product={product} />;
}
