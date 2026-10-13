import React from 'react';
import { notFound } from 'next/navigation';
import { ProductDetailPage, PRODUCTS_DATA } from '@/features/products';
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

    // Sanity's simple 'specRows' (Property Specifications List, {label, value} pairs) maps
    // directly onto the local ProductDetail.specs shape.
    const specs = Array.isArray(p.specRows)
        ? p.specRows
              .map((r: any) => ({ label: r?.label, value: r?.value }))
              .filter((r: any) => r.label || r.value)
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
        specs,
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
    const sanityProduct = await getSanityProductBySlug(slug);
    const staticFallback = PRODUCTS_DATA.find((p) => p.slug === slug);
    const title = sanityProduct?.title || staticFallback?.title;
    const subtitle = sanityProduct?.subtitle || staticFallback?.subtitle;
    const description = sanityProduct?.description || staticFallback?.description || '';
    if (!title) return {};

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';
    const canonicalUrl = `${siteUrl}/products/${slug}`;
    const pageTitle = subtitle ? `${title} (${subtitle}) | PCE Nigeria Products` : `${title} | PCE Nigeria Products`;

    const rawImage = sanityProduct?.heroImage || sanityProduct?.image || staticFallback?.heroImage || staticFallback?.image;
    const ogImageUrl = rawImage
        ? rawImage.startsWith('http')
            ? rawImage
            : `${siteUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
        : `${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`;

    return {
        title: pageTitle,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: pageTitle,
            description,
            url: canonicalUrl,
            siteName: 'PCE Nigeria Limited',
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description,
            images: [ogImageUrl],
        },
    };
}

export default async function Page({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const sanityProduct = await getSanityProductBySlug(slug);
    const staticFallback = PRODUCTS_DATA.find((p) => p.slug === slug);

    if (!sanityProduct && !staticFallback) {
        notFound();
    }

    const mapped = sanityProduct ? mapSanityProductToDetail(sanityProduct) : null;

    const product: ProductDetail = {
        ...(staticFallback || {}),
        ...(mapped || {}),
        title: mapped?.title || staticFallback?.title || '',
        slug: mapped?.slug || staticFallback?.slug || slug,
        id: mapped?.id || staticFallback?.id || slug,
        subtitle: mapped?.subtitle || staticFallback?.subtitle,
        eyebrow: mapped?.eyebrow || staticFallback?.eyebrow,
        description: mapped?.description || staticFallback?.description || '',
        overviewText: mapped?.overviewText || staticFallback?.overviewText,
        whatItDoes: mapped?.whatItDoes || staticFallback?.whatItDoes,
        executiveStandard: mapped?.executiveStandard || staticFallback?.executiveStandard,
        image: mapped?.image || staticFallback?.image,
        secondaryImage: mapped?.secondaryImage || staticFallback?.secondaryImage,
        heroImage: mapped?.heroImage || staticFallback?.heroImage,
        tdsUrl: mapped?.tdsUrl || staticFallback?.tdsUrl,
        sdsUrl: mapped?.sdsUrl || staticFallback?.sdsUrl,
        alsoKnownAs: mapped?.alsoKnownAs || staticFallback?.alsoKnownAs,
        mainFunctions: (mapped?.mainFunctions && mapped.mainFunctions.length > 0) ? mapped.mainFunctions : staticFallback?.mainFunctions,
        features: (mapped?.features && mapped.features.length > 0) ? mapped.features : staticFallback?.features,
        applications: (mapped?.applications && mapped.applications.length > 0) ? mapped.applications : staticFallback?.applications,
        specs: (mapped?.specs && mapped.specs.length > 0) ? mapped.specs : staticFallback?.specs,
        specTables: (mapped?.specTables && mapped.specTables.length > 0) ? mapped.specTables : staticFallback?.specTables,
        howItsUsed: mapped?.howItsUsed || staticFallback?.howItsUsed,
        supplyDetails: (mapped?.supplyDetails && mapped.supplyDetails.length > 0) ? mapped.supplyDetails : staticFallback?.supplyDetails,
        storageInfo: mapped?.storageInfo || staticFallback?.storageInfo,
        sdsSections: (mapped?.sdsSections && mapped.sdsSections.length > 0) ? mapped.sdsSections : staticFallback?.sdsSections,
        safetyAtAGlance: mapped?.safetyAtAGlance || staticFallback?.safetyAtAGlance,
        salesContacts: (mapped?.salesContacts && mapped.salesContacts.length > 0) ? mapped.salesContacts : staticFallback?.salesContacts,
        galleryImages: (mapped?.galleryImages && mapped.galleryImages.length > 0) ? mapped.galleryImages : staticFallback?.galleryImages,
        technicalImages: (mapped?.technicalImages && mapped.technicalImages.length > 0) ? mapped.technicalImages : staticFallback?.technicalImages,
    };

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';
    const canonicalUrl = `${siteUrl}/products/${slug}`;
    const rawImage = product.heroImage || product.image;
    const ogImageUrl = rawImage
        ? rawImage.startsWith('http')
            ? rawImage
            : `${siteUrl}${rawImage.startsWith('/') ? '' : '/'}${rawImage}`
        : `${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`;

    const productJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Product',
                '@id': `${canonicalUrl}#product`,
                'name': product.subtitle ? `${product.title} - ${product.subtitle}` : product.title,
                'description': product.description || product.overviewText || '',
                'image': ogImageUrl,
                'brand': {
                    '@type': 'Brand',
                    'name': 'Lantic / PCE Nigeria',
                },
                'manufacturer': {
                    '@type': 'Organization',
                    '@id': `${siteUrl}/#organization`,
                    'name': 'PCE Nigeria Limited',
                },
                'category': 'Drilling Fluids & Chemical Products',
                'url': canonicalUrl,
            },
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': siteUrl,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Products',
                        'item': `${siteUrl}/products`,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': product.title,
                        'item': canonicalUrl,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
            />
            <ProductDetailPage product={product} />
        </>
    );
}
