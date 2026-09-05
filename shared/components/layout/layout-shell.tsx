'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export interface NavLink {
  title?: string;
  href?: string;
}

export interface NavDropdownLink extends NavLink {
  description?: string;
}

export interface ProductMenuLink extends NavDropdownLink {
  subtitle?: string;
  image?: string;
}

export interface MainNavLink extends NavLink {
  insertProductsMenuAfter?: boolean;
}

export interface NavigationSettings {
  companyMenu?: NavDropdownLink[];
  capabilitiesMenu?: NavDropdownLink[];
  productsMenu?: ProductMenuLink[];
  mainLinks?: MainNavLink[];
  homeLink?: { title?: string; href?: string };
  contactCta?: { text?: string; href?: string };
  footerLinks?: NavLink[];
}

export interface ContactPerson {
  name?: string;
  phone?: string;
  email?: string;
}

export interface SocialLink {
  platform?: string;
  url?: string;
}

export interface GlobalSettings {
  siteTitle?: string;
  logo?: string;
  favicon?: string;
  footerContacts?: ContactPerson[];
  generalEmail?: string;
  socialLinks?: SocialLink[];
  footerTagline?: string;
  footerHeading?: string;
  footerCtaText?: string;
  footerCtaLink?: string;
}

export interface ContactPageSettings {
  heroHeadline?: string;
  heroSubtext?: string;
  contactPersons?: ContactPerson[];
  abujaOffice?: string;
  lagosOffice?: string;
  portHarcourtBase?: string;
  generalEmail?: string;
}

interface LayoutShellProps {
  children: React.ReactNode;
  navigation?: NavigationSettings | null;
  globalSettings?: GlobalSettings | null;
  contactPage?: ContactPageSettings | null;
}

export function LayoutShell({ children, navigation, globalSettings, contactPage }: LayoutShellProps) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  if (isStudio) {
    return <div className="w-full min-h-screen bg-white text-black">{children}</div>;
  }

  return (
    <>
      <SiteHeader navigation={navigation} globalSettings={globalSettings} />
      <main className="flex-1 flex flex-col">{children}</main>
      <SiteFooter navigation={navigation} globalSettings={globalSettings} contactPage={contactPage} />
    </>
  );
}
