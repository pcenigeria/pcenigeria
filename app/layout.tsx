import React, { Suspense } from "react";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SiteHeader, SiteFooter } from "../shared/components/layout";
import { SmoothScrollProvider } from "../shared/components/smooth-scroll/smooth-scroll-provider";
import { PageTransitionContent } from "../shared/components/ui/page-transition";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600", "700", "800"],
  variable: "--font-montserrat-raw",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.pcenigeria.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PCE Nigeria | HDD, Pipeline EPC & Drilling Fluid Specialists",
    template: "%s | PCE Nigeria Limited",
  },
  description:
    "PCE Nigeria Limited delivers world-class Horizontal Directional Drilling (HDD), major oil & gas pipeline EPC (AKK & OB3 projects), Lantic Bentonite, high-performance drilling fluid additives, and 3D Buried Pipeline Detection Systems (BPDS).",
  keywords: [
    "HDD",
    "Horizontal Directional Drilling",
    "AKK",
    "AKK Gas Pipeline",
    "OB3",
    "OB3 Gas Pipeline",
    "pcenigeria",
    "pcenigeria.com",
    "PCE Nigeria Limited",
    "Lantic",
    "Lantic Bentonite",
    "Bentonite",
    "drilling fluid",
    "drilling mud",
    "BRSBENT SQ",
    "BRSCMC",
    "BRSMMH",
    "BRSVR",
    "BRSXTG",
    "Pipeline EPC",
    "Buried Pipeline Detection System",
    "BPDS",
    "River Niger HDD Crossing",
    "Oil and Gas Pipeline Infrastructure Nigeria",
    "Trenchless River Crossing Nigeria",
  ],
  authors: [{ name: "PCE Nigeria Limited", url: siteUrl }],
  creator: "PCE Nigeria Limited",
  publisher: "PCE Nigeria Limited",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: "PCE Nigeria | HDD, Pipeline EPC & Drilling Fluid Specialists",
    description:
      "Premier EPC contractor for Horizontal Directional Drilling (HDD), major gas pipeline crossings (AKK & OB3), Lantic Bentonite, and drilling fluid solutions.",
    url: siteUrl,
    siteName: "PCE Nigeria Limited",
    images: [
      {
        url: `${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`,
        width: 1200,
        height: 630,
        alt: "PCE Nigeria Heavy HDD Drilling Rig System",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PCE Nigeria | HDD, Pipeline EPC & Drilling Fluid Specialists",
    description:
      "PCE Nigeria delivers Horizontal Directional Drilling (HDD), AKK & OB3 pipeline crossings, Lantic Bentonite, and drilling mud chemicals.",
    images: [`${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/logo/PCE Logo Icon.svg",
    shortcut: "/logo/PCE Logo Icon.svg",
    apple: "/logo/PCE Logo Icon.svg",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      "name": "PCE Nigeria Limited",
      "alternateName": ["PCE Nigeria", "pcenigeria", "Lantic Nigeria"],
      "url": siteUrl,
      "logo": `${siteUrl}/logo/PCE Logo Icon.svg`,
      "description":
        "Specialist engineering contractor for Horizontal Directional Drilling (HDD), major oil & gas pipeline EPC, Lantic Bentonite, drilling fluids, and BPDS detection systems.",
      "contactPoint": [
        {
          "@type": "ContactPoint",
          "telephone": "+234 707 412 6596",
          "contactType": "sales",
          "email": "wanyang@pcenigeria.com",
          "areaServed": "NG",
          "availableLanguage": ["English", "Chinese"],
        },
        {
          "@type": "ContactPoint",
          "telephone": "+234 701 373 2816",
          "contactType": "customer service",
          "email": "xuliangkui@pcenigeria.com",
          "areaServed": "NG",
          "availableLanguage": ["English", "Chinese"],
        },
      ],
      "sameAs": [
        "https://www.pcenigeria.com",
      ],
    },
    {
      "@type": "EngineeringService",
      "@id": `${siteUrl}/#service`,
      "name": "Horizontal Directional Drilling (HDD) & Pipeline EPC Services",
      "provider": {
        "@id": `${siteUrl}/#organization`,
      },
      "areaServed": {
        "@type": "Country",
        "name": "Nigeria",
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "PCE Services & Products Catalog",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Horizontal Directional Drilling (HDD)",
              "description": "Trenchless river and road crossings using 1200t and 500t HDD drilling rigs.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pipeline EPC Construction (52km Project, AKK & OB3 Crossings)",
              "description": "Full EPC delivery for oil and gas pipelines across Nigeria.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "BRSBENT SQ (Lantic Bentonite)",
              "description": "API 13A activated sodium bentonite for drilling fluids.",
            },
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Product",
              "name": "Drilling Fluid Chemicals (BRSCMC, BRSMMH, BRSVR, BRSXTG)",
              "description": "High-performance drilling mud polymers, viscosifiers, and clay reducers.",
            },
          },
        ],
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${montserrat.variable} flex flex-col min-h-screen`}>
        <SmoothScrollProvider>
          <Suspense fallback={null}>
            <PageTransitionContent />
          </Suspense>
          <SiteHeader />
          <main className="flex-1 flex flex-col">{children}</main>
          <SiteFooter />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
