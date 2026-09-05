'use client';

import React from 'react';
import Link from 'next/link';
import {
    LinkedinLogo,
    InstagramLogo,
    FacebookLogo,
    YoutubeLogo,
    XLogo,
    TiktokLogo,
    WhatsappLogo,
    GlobeSimple,
    type IconProps,
} from '@phosphor-icons/react';
import type { NavigationSettings, GlobalSettings, ContactPageSettings, NavLink, ContactPerson } from './layout-shell';

const DEFAULT_LOGO_SRC = '/logo/PCE Logo.svg';

const DEFAULT_FOOTER_HEADING = 'Have a complex crossing or pipeline requirement?';
const DEFAULT_FOOTER_SUBTEXT =
    "Share the route, constraint and project objective. Early-stage enquiries are welcome—we'll help identify the technical information needed to move forward.";
const DEFAULT_FOOTER_CTA_TEXT = 'Start a Project Enquiry';
const DEFAULT_FOOTER_CTA_LINK = '/contact';

const DEFAULT_FOOTER_LINKS: NavLink[] = [
    { title: 'About Us', href: '/our-company' },
    { title: 'Capabilities', href: '/capabilities' },
    { title: 'Equipment & Tech', href: '/equipment-technology' },
    { title: 'Safety & Quality', href: '/safety-quality-responsibility' },
    { title: 'Resources', href: '/resources' },
    { title: 'Contact', href: '/contact' },
];

const DEFAULT_ABUJA_OFFICE = 'House 45, Nelson Mandela Street, Asokoro, Abuja, Nigeria';
const DEFAULT_LAGOS_OFFICE = 'HyGroup Place 6 Ojulari St, off Kusenla Rd Ikate, Lekki, Lagos';
const DEFAULT_PORT_HARCOURT_BASE = 'East–West Road Opp. New Onne Link Rd Ebubu, Eleme, Rivers State';

const DEFAULT_FOOTER_CONTACTS: ContactPerson[] = [
    { name: 'Wan Yang', phone: '+234 707 412 6596', email: 'wanyang@pcenigeria.com' },
    { name: 'Xu Liangkui', phone: '+234 701 373 2816', email: 'xuliangkui@pcenigeria.com' },
];

const DEFAULT_GENERAL_EMAIL = 'info@pcenigeria.com';

function toTelHref(phone: string) {
    return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

function getSocialIcon(platform?: string): React.ComponentType<IconProps> {
    const key = (platform || '').toLowerCase();
    if (key.includes('linkedin')) return LinkedinLogo;
    if (key.includes('instagram')) return InstagramLogo;
    if (key.includes('facebook')) return FacebookLogo;
    if (key.includes('youtube')) return YoutubeLogo;
    if (key.includes('twitter') || key === 'x') return XLogo;
    if (key.includes('tiktok')) return TiktokLogo;
    if (key.includes('whatsapp')) return WhatsappLogo;
    return GlobeSimple;
}

interface SiteFooterProps {
    navigation?: NavigationSettings | null;
    globalSettings?: GlobalSettings | null;
    contactPage?: ContactPageSettings | null;
}

export const SiteFooter = ({ navigation, globalSettings, contactPage }: SiteFooterProps) => {
    const logoSrc = globalSettings?.logo || DEFAULT_LOGO_SRC;
    const footerHeading = globalSettings?.footerHeading || DEFAULT_FOOTER_HEADING;
    const footerCtaText = globalSettings?.footerCtaText || DEFAULT_FOOTER_CTA_TEXT;
    const footerCtaLink = globalSettings?.footerCtaLink || DEFAULT_FOOTER_CTA_LINK;
    const footerLinks = navigation?.footerLinks?.length ? navigation.footerLinks : DEFAULT_FOOTER_LINKS;
    const abujaOffice = contactPage?.abujaOffice || DEFAULT_ABUJA_OFFICE;
    const lagosOffice = contactPage?.lagosOffice || DEFAULT_LAGOS_OFFICE;
    const portHarcourtBase = contactPage?.portHarcourtBase || DEFAULT_PORT_HARCOURT_BASE;
    const footerContacts = globalSettings?.footerContacts?.length ? globalSettings.footerContacts : DEFAULT_FOOTER_CONTACTS;
    const generalEmail = globalSettings?.generalEmail || contactPage?.generalEmail || DEFAULT_GENERAL_EMAIL;
    const socialLinks = globalSettings?.socialLinks?.filter((social) => social?.url) || [];

    return (
        <footer className="w-full bg-[#010e19] text-white pt-16 lg:pt-20 pb-12 px-[var(--section-pad-x)] border-t border-white/10">
            <div className="w-full flex flex-col gap-12 lg:gap-14">

                {/* 1. Top Section: Logo */}
                <div className="w-full">
                    <Link href="/" className="inline-block no-underline">
                        <img
                            src={logoSrc}
                            alt="PCE Nigeria Logo"
                            className="h-14 lg:h-16 w-auto object-contain brightness-0 invert"
                        />
                    </Link>
                </div>

                {/* 2. Main Row: [Heading + Subtext + CTA Button] | [Quick Links] | [Contact Info] */}
                <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-16">

                    {/* Left Column: Heading, Subtext & Button (Under Logo) */}
                    <div className="max-w-[500px] flex flex-col gap-5">
                        <h3 className="!text-[28px] font-bold !text-white tracking-tight leading-snug">
                            {footerHeading}
                        </h3>
                        <p className="!text-white/80 text-sm lg:text-base leading-relaxed">
                            {DEFAULT_FOOTER_SUBTEXT}
                        </p>
                        <div className="pt-2">
                            <Link
                                href={footerCtaLink}
                                className="px-5 py-2.5 rounded-xl bg-[var(--color-accent)] text-[#052237] hover:bg-white hover:text-[#052237] text-sm font-bold transition-all shadow-sm no-underline whitespace-nowrap inline-flex items-center gap-2"
                            >
                                <span>{footerCtaText}</span>
                                <span>→</span>
                            </Link>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col gap-4">
                        <p className="!text-[16px] font-bold uppercase tracking-wider !text-white m-0">
                            QUICK LINKS
                        </p>
                        <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
                            {footerLinks.map((link, idx) => (
                                <li key={link.href || `footer-link-${idx}`}>
                                    <Link
                                        href={link.href || '#'}
                                        className="!text-white/85 hover:!text-[var(--color-accent)] !text-[16px] transition-colors no-underline"
                                    >
                                        {link.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Addresses */}
                    <div className="flex flex-col gap-4 max-w-[320px]">
                        <p className="!text-[16px] font-bold uppercase tracking-wider !text-white m-0">
                            ADDRESSES
                        </p>
                        <div className="flex flex-col gap-3">
                            <div>
                                <span className="!text-[12px] font-bold tracking-wider text-[var(--color-accent)] uppercase block mb-0.5">
                                    Abuja (Head Office)
                                </span>
                                <p className="!text-white/85 !text-[14px] leading-snug m-0">
                                    {abujaOffice}
                                </p>
                            </div>
                            <div>
                                <span className="!text-[12px] font-bold tracking-wider text-[var(--color-accent)] uppercase block mb-0.5">
                                    Lagos Office
                                </span>
                                <p className="!text-white/85 !text-[14px] leading-snug m-0">
                                    {lagosOffice}
                                </p>
                            </div>
                            <div>
                                <span className="!text-[12px] font-bold tracking-wider text-[var(--color-accent)] uppercase block mb-0.5">
                                    Port Harcourt Base
                                </span>
                                <p className="!text-white/85 !text-[14px] leading-snug m-0">
                                    {portHarcourtBase}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="flex flex-col gap-4">
                        <p className="!text-[16px] font-bold uppercase tracking-wider !text-white m-0">
                            CONTACT
                        </p>
                        <div className="flex flex-col gap-3 !text-[16px]">
                            {footerContacts.map((contact, idx) => (
                                <div key={contact.email || `footer-contact-${idx}`} className="flex flex-col gap-0.5">
                                    {contact.name && (
                                        <span className="!text-white/60 text-xs uppercase tracking-wider font-semibold">
                                            {contact.name}
                                        </span>
                                    )}
                                    {contact.phone && (
                                        <a
                                            href={toTelHref(contact.phone)}
                                            className="!text-white font-semibold hover:text-[var(--color-accent)] transition-colors no-underline"
                                        >
                                            {contact.phone}
                                        </a>
                                    )}
                                    {contact.email && (
                                        <a
                                            href={`mailto:${contact.email}`}
                                            className="!text-[var(--color-accent)] font-medium hover:underline no-underline"
                                        >
                                            {contact.email}
                                        </a>
                                    )}
                                </div>
                            ))}
                            <a href={`mailto:${generalEmail}`} className="!text-[var(--color-accent)] font-medium hover:underline no-underline">
                                {generalEmail}
                            </a>
                        </div>

                        {/* Social Links */}
                        {socialLinks.length > 0 && (
                            <div className="flex items-center gap-3 pt-1">
                                {socialLinks.map((social, idx) => {
                                    const Icon = getSocialIcon(social.platform);
                                    return (
                                        <a
                                            key={social.url || `social-${idx}`}
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={social.platform || 'Social link'}
                                            className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[var(--color-accent)] hover:text-[#052237] transition-colors"
                                        >
                                            <Icon size={18} weight="fill" />
                                        </a>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                </div>

                {/* 3. Bottom Divider & Copyright Row */}
                <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs !text-white">
                    <p className="!text-white">© {new Date().getFullYear()} PCE Nigeria Limited. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <Link href="/privacy" className="hover:text-[var(--color-accent)] transition-colors no-underline !text-white">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-[var(--color-accent)] transition-colors no-underline !text-white">
                            Terms of Service
                        </Link>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default SiteFooter;
