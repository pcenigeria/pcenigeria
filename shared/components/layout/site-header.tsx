'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { NavigationSettings, GlobalSettings, MainNavLink } from './layout-shell';

const DEFAULT_LOGO_SRC = '/logo/PCE Logo.svg';

const DEFAULT_HOME_LINK = { title: 'Home', href: '/' };

const DEFAULT_CONTACT_CTA = { text: 'Contact Us', href: '/contact' };

const DEFAULT_COMPANY_SUB_LINKS = [
    {
        title: 'About PCE',
        href: '/our-company',
        description: 'Learn about our corporate background, leadership, track record, and company overview.',
    },
    {
        title: 'Equipment & Technology',
        href: '/equipment-technology',
        description: 'Advanced 250-ton HDD rigs, mud recycling units, and specialized trenchless gear.',
    },
    {
        title: 'Safety & Quality',
        href: '/safety-quality-responsibility',
        description: 'ISO-certified QHSE frameworks, zero-incidents policy, and environmental stewardship.',
    },
];

const DEFAULT_CAPABILITY_SUB_LINKS = [
    {
        title: 'Horizontal Directional Drilling',
        href: '/capabilities#hdd',
        description: 'Specialist HDD engineering for river, road, coastal and complex-ground crossings.',
    },
    {
        title: 'Pipeline EPC',
        href: '/capabilities#epc',
        description: 'Comprehensive engineering, procurement, construction, welding, and commissioning.',
    },
    {
        title: 'BPDS Pipeline Location',
        href: '/capabilities#bpds',
        description: '3D location and depth measurement for deeply buried steel pipelines.',
    },
    {
        title: 'Equipment & Technical Support',
        href: '/capabilities#support',
        description: 'High-tonnage rigs, pumps, recycling systems, tooling and technical expertise.',
    },
];

const DEFAULT_PRODUCT_SUB_LINKS = [
    {
        title: 'Products Overview',
        subtitle: 'Explore All Products',
        href: '/products',
        description: 'Explore full product catalog & specifications.',
        image: '/pictures/product-image/bent/cover-photo.jpg',
    },
    {
        title: 'BRSBENT SQ',
        subtitle: 'Activated Bentonite',
        href: '/products/brsbent-sq',
        description: 'Premium bentonite for HDD, slurry TBM & deep foundations.',
        image: '/pictures/product-image/bent/cover-photo.jpg',
    },
    {
        title: 'BRSCMC',
        subtitle: 'Carboxymethyl Cellulose',
        href: '/products/brscmc',
        description: 'High-purity fluid loss control & rheology modifier.',
        image: '/pictures/product-image/brscmc-pack.png',
    },
    {
        title: 'BRSMMH',
        subtitle: 'Mixed Metal Hydroxide',
        href: '/products/brsmmh',
        description: 'Inorganic viscosifier for high yield point drilling fluids.',
        image: '/pictures/product-image/brsmmh-pack.png',
    },
    {
        title: 'BRSVR',
        subtitle: 'Clay Viscosity Reducer',
        href: '/products/brsvr',
        description: 'Clay stripper & clay dispersing solution for drilling fluids.',
        image: '/pictures/product-image/brsvr-pack.png',
    },
    {
        title: 'BRSXTG',
        subtitle: 'Xanthan Gum',
        href: '/products/brsxtg',
        description: 'High-molecular-weight biopolymer for shear-thinning viscosity.',
        image: '/pictures/product-image/brsxtg-pack.png',
    },
];

const DEFAULT_MAIN_LINKS: MainNavLink[] = [
    { title: 'Projects', href: '/projects', insertProductsMenuAfter: true },
    { title: 'News & Insights', href: '/news-insights' },
    { title: 'Resources', href: '/resources' },
];

type MainNavEntry = { type: 'link'; link: MainNavLink } | { type: 'products' };

function buildMainNavEntries(mainLinks: MainNavLink[]): MainNavEntry[] {
    const entries: MainNavEntry[] = [];
    let inserted = false;
    mainLinks.forEach((link) => {
        entries.push({ type: 'link', link });
        if (link.insertProductsMenuAfter) {
            entries.push({ type: 'products' });
            inserted = true;
        }
    });
    if (!inserted) {
        const projectsIndex = entries.findIndex((entry) => entry.type === 'link' && entry.link.href === '/projects');
        if (projectsIndex !== -1) {
            entries.splice(projectsIndex + 1, 0, { type: 'products' });
        } else {
            entries.push({ type: 'products' });
        }
    }
    return entries;
}

interface SiteHeaderProps {
    navigation?: NavigationSettings | null;
    globalSettings?: GlobalSettings | null;
}

export const SiteHeader = ({ navigation, globalSettings }: SiteHeaderProps) => {
    const pathname = usePathname();
    const [isCompanyMenuOpen, setIsCompanyMenuOpen] = useState(false);
    const [isCapabilitiesMenuOpen, setIsCapabilitiesMenuOpen] = useState(false);
    const [isProductsMenuOpen, setIsProductsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCompanyOpen, setIsMobileCompanyOpen] = useState(false);
    const [isMobileCapabilitiesOpen, setIsMobileCapabilitiesOpen] = useState(false);
    const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);

    const companySubLinks = navigation?.companyMenu?.length ? navigation.companyMenu : DEFAULT_COMPANY_SUB_LINKS;
    const capabilitySubLinks = navigation?.capabilitiesMenu?.length
        ? navigation.capabilitiesMenu
        : DEFAULT_CAPABILITY_SUB_LINKS;
    const rawProductSubLinks = navigation?.productsMenu?.length ? navigation.productsMenu : DEFAULT_PRODUCT_SUB_LINKS;
    const productSubLinks = rawProductSubLinks.map((p, idx) => {
        const fallback = DEFAULT_PRODUCT_SUB_LINKS.find((def) => def.href === p.href) || DEFAULT_PRODUCT_SUB_LINKS[idx] || DEFAULT_PRODUCT_SUB_LINKS[0];
        return {
            ...p,
            image: p.image || fallback.image,
        };
    });
    const homeLink = navigation?.homeLink?.href ? navigation.homeLink : DEFAULT_HOME_LINK;
    const contactCta = navigation?.contactCta?.href ? navigation.contactCta : DEFAULT_CONTACT_CTA;
    const logoSrc = globalSettings?.logo || DEFAULT_LOGO_SRC;

    // The "Our Company"/"Capabilities"/"Products" dropdowns and the Home link/Contact CTA each
    // render their own dedicated nav element, so a `mainLinks` entry pointing at a page already
    // covered by one of those (e.g. an editor listing "Our Company" itself) would otherwise show twice.
    const rawMainLinks = navigation?.mainLinks?.length ? navigation.mainLinks : DEFAULT_MAIN_LINKS;
    const coveredHrefs = new Set([
        homeLink.href,
        contactCta.href,
        '/capabilities',
        '/products',
        ...companySubLinks.map((link) => link.href),
        ...capabilitySubLinks.map((link) => link.href),
    ]);
    const mainLinks = rawMainLinks.filter((link) => !coveredHrefs.has(link.href));
    const mainNavEntries = buildMainNavEntries(mainLinks);

    const [hoveredProductImage, setHoveredProductImage] = useState(
        productSubLinks[0]?.image || DEFAULT_PRODUCT_SUB_LINKS[0].image
    );

    const isCompanyActive =
        pathname === '/our-company' ||
        pathname === '/equipment-technology' ||
        pathname === '/safety-quality-responsibility';

    const isCapabilitiesActive = pathname === '/capabilities';

    const isProductsActive = pathname === '/products' || pathname.startsWith('/products/');

    const ProductsMegaMenuTrigger = (
        <div
            className="relative"
            onMouseEnter={() => setIsProductsMenuOpen(true)}
            onMouseLeave={() => setIsProductsMenuOpen(false)}
        >
            <button
                onClick={() => setIsProductsMenuOpen(!isProductsMenuOpen)}
                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-7 no-underline ${
                    isProductsActive || isProductsMenuOpen
                        ? 'text-[var(--color-primary)] font-bold'
                        : 'text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)]'
                }`}
            >
                <span>Products</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                        isProductsMenuOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-black/40'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Products Mega Menu Dropdown */}
            {isProductsMenuOpen && (
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-[100%] bg-white rounded-2xl shadow-xl border border-black/10 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-300 w-[720px] grid grid-cols-12 gap-6"
                >
                    {/* Left Column: Products List (Single Vertical List) */}
                    <div className="col-span-7 flex flex-col justify-between pr-2 border-r border-black/5">
                        <div className="flex flex-col gap-2.5">
                            <div className="flex items-center justify-between px-1">
                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                                    Drilling Chemicals
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                {productSubLinks.map((product, idx) => (
                                    <Link
                                        key={product.href}
                                        href={product.href || '#'}
                                        onClick={() => setIsProductsMenuOpen(false)}
                                        onMouseEnter={() => setHoveredProductImage(product.image || DEFAULT_PRODUCT_SUB_LINKS[0].image)}
                                        className={`group p-2 rounded-xl transition-colors no-underline flex items-center gap-3 ${
                                            idx === 0
                                                ? 'bg-[#052237]/5 hover:bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/15'
                                                : 'hover:bg-[#052237]/5'
                                        }`}
                                    >
                                        {/* Product Thumbnail */}
                                        <div className="w-9 h-9 shrink-0 rounded-lg overflow-hidden bg-white border border-black/10 flex items-center justify-center">
                                            <img
                                                src={product.image || DEFAULT_PRODUCT_SUB_LINKS[idx]?.image || DEFAULT_PRODUCT_SUB_LINKS[0].image}
                                                alt={product.title}
                                                className="w-full h-full object-contain p-0.5"
                                                onError={(e) => {
                                                    const fallback = DEFAULT_PRODUCT_SUB_LINKS.find((def) => def.href === product.href) || DEFAULT_PRODUCT_SUB_LINKS[idx] || DEFAULT_PRODUCT_SUB_LINKS[0];
                                                    if (fallback?.image && e.currentTarget.src !== fallback.image) {
                                                        e.currentTarget.src = fallback.image;
                                                    }
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <div className={`text-sm font-bold transition-colors ${idx === 0 ? 'text-[var(--color-primary)]' : 'text-[#052237] group-hover:text-[var(--color-primary)]'}`}>
                                                {product.title}
                                            </div>
                                            <div className="text-xs text-[var(--color-ink-muted-48)] leading-snug line-clamp-1">
                                                {product.subtitle}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Bounded Image Showcase Panel */}
                    <div className="col-span-5 flex items-center justify-center">
                        <div className="w-full h-full min-h-[300px] rounded-xl overflow-hidden shadow-sm bg-[#f2f4f7] border border-black/5 flex items-center justify-center p-4">
                            <img
                                src={hoveredProductImage || DEFAULT_PRODUCT_SUB_LINKS[0].image}
                                alt="Featured Product"
                                className="max-w-full max-h-full object-contain transition-all duration-300 rounded-lg"
                                onError={(e) => {
                                    if (e.currentTarget.src !== DEFAULT_PRODUCT_SUB_LINKS[0].image) {
                                        e.currentTarget.src = DEFAULT_PRODUCT_SUB_LINKS[0].image;
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <header className="sticky top-0 z-50 w-full bg-white border-b border-black/10 backdrop-blur-md h-[80px] flex items-center justify-center shadow-sm">
            <div className="w-full px-[var(--section-pad-x)] flex items-center justify-between gap-8">

                {/* Left Area: Logo + Nav Links */}
                <div className="flex items-center gap-8 lg:gap-10">
                    {/* Brand / Logo */}
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2.5 no-underline group shrink-0"
                    >
                        <img
                            src={logoSrc}
                            alt="PCE Nigeria Logo"
                            className="h-8 w-auto object-contain"
                        />
                    </Link>

                    {/* Desktop Nav Links */}
                    <nav className="hidden lg:flex items-center gap-7">
                        {/* Home Link */}
                        <Link
                            href={homeLink.href || '/'}
                            className={`text-sm font-semibold transition-colors no-underline ${
                                pathname === (homeLink.href || '/')
                                    ? 'text-[var(--color-primary)] font-bold'
                                    : 'text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)]'
                            }`}
                        >
                            {homeLink.title || 'Home'}
                        </Link>

                        {/* Our Company Dropdown Trigger */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsCompanyMenuOpen(true)}
                            onMouseLeave={() => setIsCompanyMenuOpen(false)}
                        >
                            <button
                                onClick={() => setIsCompanyMenuOpen(!isCompanyMenuOpen)}
                                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-7 no-underline ${
                                    isCompanyActive || isCompanyMenuOpen
                                        ? 'text-[var(--color-primary)] font-bold'
                                        : 'text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)]'
                                }`}
                            >
                                <span>Our Company</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isCompanyMenuOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-black/40'
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Kalstore-style Mega Menu Dropdown */}
                            {isCompanyMenuOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-[100%] w-[680px] bg-white rounded-2xl shadow-xl border border-black/10 p-6 grid grid-cols-12 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Left Links Column */}
                                    <div className="col-span-6 flex flex-col justify-between pr-2 border-r border-black/5">
                                        <div className="flex flex-col gap-4">
                                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)] px-2.5">
                                                Company Overview
                                            </span>
                                            <div className="flex flex-col gap-2">
                                                {companySubLinks.map((subLink) => (
                                                    <Link
                                                        key={subLink.href}
                                                        href={subLink.href || '#'}
                                                        onClick={() => setIsCompanyMenuOpen(false)}
                                                        className="group p-2.5 rounded-xl hover:bg-[#052237]/5 transition-colors no-underline block"
                                                    >
                                                        <div className="text-base font-bold text-[#052237] group-hover:text-[var(--color-primary)] transition-colors">
                                                            {subLink.title}
                                                        </div>
                                                        <div className="text-xs text-[var(--color-ink-muted-48)] mt-0.5 leading-normal">
                                                            {subLink.description}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Image Showcase Panel */}
                                    <div className="col-span-6">
                                        <div className="relative block h-full min-h-[220px] rounded-xl overflow-hidden shadow-sm">
                                            <img
                                                src="/pictures/company/company-hero.jpg"
                                                alt="PCE Corporate & Equipment Operations"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Capabilities Dropdown Trigger */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsCapabilitiesMenuOpen(true)}
                            onMouseLeave={() => setIsCapabilitiesMenuOpen(false)}
                        >
                            <button
                                onClick={() => setIsCapabilitiesMenuOpen(!isCapabilitiesMenuOpen)}
                                className={`flex items-center gap-1.5 text-sm font-semibold transition-colors py-7 no-underline ${
                                    isCapabilitiesActive || isCapabilitiesMenuOpen
                                        ? 'text-[var(--color-primary)] font-bold'
                                        : 'text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)]'
                                }`}
                            >
                                <span>Capabilities</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${
                                        isCapabilitiesMenuOpen ? 'rotate-180 text-[var(--color-primary)]' : 'text-black/40'
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Capabilities Mega Menu Dropdown */}
                            {isCapabilitiesMenuOpen && (
                                <div className="absolute left-1/2 -translate-x-1/2 top-[100%] w-[720px] bg-white rounded-2xl shadow-xl border border-black/10 p-6 grid grid-cols-12 gap-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* Left Links Column */}
                                    <div className="col-span-7 flex flex-col justify-between pr-2 border-r border-black/5">
                                        <div className="flex flex-col gap-4">
                                            <div className="flex items-center justify-between px-2.5">
                                                <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                                                    Core Capabilities
                                                </span>
                                                <Link
                                                    href="/capabilities"
                                                    onClick={() => setIsCapabilitiesMenuOpen(false)}
                                                    className="text-xs font-bold text-[var(--color-primary)] hover:underline no-underline"
                                                >
                                                    View All Overview →
                                                </Link>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                {capabilitySubLinks.map((subLink) => (
                                                    <Link
                                                        key={subLink.href}
                                                        href={subLink.href || '#'}
                                                        onClick={() => setIsCapabilitiesMenuOpen(false)}
                                                        className="group p-2 rounded-xl hover:bg-[#052237]/5 transition-colors no-underline block"
                                                    >
                                                        <div className="text-sm font-bold text-[#052237] group-hover:text-[var(--color-primary)] transition-colors">
                                                            {subLink.title}
                                                        </div>
                                                        <div className="text-xs text-[var(--color-ink-muted-48)] mt-0.5 leading-normal">
                                                            {subLink.description}
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Image Showcase Panel */}
                                    <div className="col-span-5">
                                        <div className="relative block h-full min-h-[220px] rounded-xl overflow-hidden shadow-sm">
                                            <img
                                                src="/pictures/home-page/horizontal-drilling-new.jpg"
                                                alt="PCE Core Capabilities"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Main Links (Sanity-driven), with Products Mega-Menu inserted at its marked position */}
                        {mainNavEntries.map((entry, idx) =>
                            entry.type === 'products' ? (
                                <React.Fragment key="products-menu">{ProductsMegaMenuTrigger}</React.Fragment>
                            ) : (
                                (() => {
                                    const link = entry.link;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href || `main-link-${idx}`}
                                            href={link.href || '#'}
                                            className={`text-sm font-semibold transition-colors no-underline ${
                                                isActive
                                                    ? 'text-[var(--color-primary)] font-bold'
                                                    : 'text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)]'
                                            }`}
                                        >
                                            {link.title}
                                        </Link>
                                    );
                                })()
                            )
                        )}
                    </nav>
                </div>

                {/* Right Area: Desktop CTA & Mobile Hamburger Trigger */}
                <div className="flex items-center gap-4 shrink-0">
                    {/* Desktop Contact Us Button */}
                    <Link
                        href={contactCta.href || '/contact'}
                        className="hidden lg:inline-flex px-5 py-2.5 rounded-xl bg-[#052237] text-white hover:bg-[var(--color-accent)] hover:text-[#052237] text-sm font-bold transition-all shadow-sm no-underline whitespace-nowrap"
                    >
                        {contactCta.text || 'Contact Us'}
                    </Link>

                    {/* Mobile Hamburger Trigger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="lg:hidden p-2 rounded-lg bg-black/5 text-[var(--color-primary)] hover:bg-black/10 transition-colors"
                        aria-label="Toggle Menu"
                    >
                        {isMobileMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        )}
                    </button>
                </div>

            </div>

            {/* Mobile Navigation Drawer */}
            {isMobileMenuOpen && (
                <div className="fixed left-0 right-0 top-[80px] h-[calc(100vh-80px)] bg-white z-[9999] p-6 flex flex-col justify-between overflow-y-auto lg:hidden animate-in fade-in slide-in-from-top-2 duration-200 border-t border-black/10">
                    <div className="flex flex-col gap-5">
                        {/* Mobile Home Link */}
                        <Link
                            href={homeLink.href || '/'}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-lg font-bold text-[#052237] no-underline border-b border-black/5 pb-3"
                        >
                            {homeLink.title || 'Home'}
                        </Link>

                        {/* Mobile Our Company Dropdown Accordion */}
                        <div className="border-b border-black/5 pb-3">
                            <button
                                onClick={() => setIsMobileCompanyOpen(!isMobileCompanyOpen)}
                                className="w-full flex items-center justify-between text-lg font-bold text-[#052237] no-underline py-0.5"
                            >
                                <span>Our Company</span>
                                <svg
                                    className={`w-5 h-5 text-black/40 transition-transform duration-200 ${
                                        isMobileCompanyOpen ? 'rotate-180 text-[var(--color-primary)]' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isMobileCompanyOpen && (
                                <div className="flex flex-col gap-2 pt-3 pl-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                    {companySubLinks.map((sub) => (
                                        <Link
                                            key={sub.href}
                                            href={sub.href || '#'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-base font-semibold text-[#052237]/80 hover:text-[var(--color-primary)] no-underline py-1.5"
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Mobile Capabilities Dropdown Accordion */}
                        <div className="border-b border-black/5 pb-3">
                            <button
                                onClick={() => setIsMobileCapabilitiesOpen(!isMobileCapabilitiesOpen)}
                                className="w-full flex items-center justify-between text-lg font-bold text-[#052237] no-underline py-0.5"
                            >
                                <span>Capabilities</span>
                                <svg
                                    className={`w-5 h-5 text-black/40 transition-transform duration-200 ${
                                        isMobileCapabilitiesOpen ? 'rotate-180 text-[var(--color-primary)]' : ''
                                    }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {isMobileCapabilitiesOpen && (
                                <div className="flex flex-col gap-2 pt-3 pl-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                    <Link
                                        href="/capabilities"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-base font-bold text-[var(--color-primary)] hover:underline no-underline py-1.5"
                                    >
                                        Capabilities Overview →
                                    </Link>
                                    {capabilitySubLinks.map((sub) => (
                                        <Link
                                            key={sub.href}
                                            href={sub.href || '#'}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="text-base font-semibold text-[#052237]/80 hover:text-[var(--color-primary)] no-underline py-1.5"
                                        >
                                            {sub.title}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Main Links (Sanity-driven), with Products accordion inserted at its marked position */}
                        {mainNavEntries.map((entry, idx) =>
                            entry.type === 'products' ? (
                                <div key="mobile-products-menu" className="border-b border-black/5 pb-3">
                                    <button
                                        onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                                        className="w-full flex items-center justify-between text-lg font-bold text-[#052237] no-underline py-0.5"
                                    >
                                        <span>Products</span>
                                        <svg
                                            className={`w-5 h-5 text-black/40 transition-transform duration-200 ${
                                                isMobileProductsOpen ? 'rotate-180 text-[var(--color-primary)]' : ''
                                            }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>

                                    {isMobileProductsOpen && (
                                        <div className="flex flex-col gap-2 pt-3 pl-3 animate-in fade-in slide-in-from-top-1 duration-150">
                                            <Link
                                                href="/products"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-base font-bold text-[var(--color-primary)] hover:underline no-underline py-1.5"
                                            >
                                                All Products Overview →
                                            </Link>
                                            {productSubLinks.map((product) => (
                                                <Link
                                                    key={product.href}
                                                    href={product.href || '#'}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="text-base font-semibold text-[#052237]/80 hover:text-[var(--color-primary)] no-underline py-1.5"
                                                >
                                                    {product.title} <span className="text-xs text-[var(--color-ink-muted-48)]">({product.subtitle})</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <Link
                                    key={entry.link.href || `mobile-main-link-${idx}`}
                                    href={entry.link.href || '#'}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="text-lg font-bold text-[#052237] no-underline border-b border-black/5 pb-3"
                                >
                                    {entry.link.title}
                                </Link>
                            )
                        )}
                    </div>

                    {/* Mobile Contact Us CTA Button at bottom */}
                    <div className="pt-6 pb-4">
                        <Link
                            href={contactCta.href || '/contact'}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="w-full py-3.5 rounded-xl bg-[#052237] text-white text-center font-bold text-base transition-all shadow-md no-underline block"
                        >
                            {contactCta.text || 'Contact Us'}
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
};

export default SiteHeader;
