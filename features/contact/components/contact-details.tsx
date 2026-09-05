"use client";

import React, { useState } from "react";
import { LinkedinLogo, FacebookLogo, InstagramLogo, YoutubeLogo } from "@phosphor-icons/react";
import { motion } from "framer-motion";

const DEFAULT_CONTACT_PERSONS = [
  { name: "Wan Yang", phone: "+234 707 412 6596", email: "wanyang@pcenigeria.com" },
  { name: "Xu Liangkui", phone: "+234 701 373 2816", email: "xuliangkui@pcenigeria.com" },
];

const DEFAULT_GENERAL_EMAIL = "info@pcenigeria.com";

const DEFAULT_ABUJA_OFFICE = "House 45, Nelson Mandela Street, Asokoro, Abuja, Nigeria";
const DEFAULT_LAGOS_OFFICE = "HyGroup Place 6 Ojulari Street, off Kusenla Road Ikate, Elegushi, Lekki, Lagos";
const DEFAULT_PORT_HARCOURT_BASE = "East–West Road Opposite New Onne Link Road Ebubu, Eleme, Rivers State";

interface ContactDetailsProps {
  sanityPage?: any;
}

export function ContactDetails({ sanityPage }: ContactDetailsProps) {
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

  const contactPersons =
    sanityPage?.contactPersons && sanityPage.contactPersons.length > 0
      ? sanityPage.contactPersons
      : DEFAULT_CONTACT_PERSONS;
  const generalEmail = sanityPage?.generalEmail || DEFAULT_GENERAL_EMAIL;
  const abujaOffice = sanityPage?.abujaOffice || DEFAULT_ABUJA_OFFICE;
  const lagosOffice = sanityPage?.lagosOffice || DEFAULT_LAGOS_OFFICE;
  const portHarcourtBase = sanityPage?.portHarcourtBase || DEFAULT_PORT_HARCOURT_BASE;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
  };

  const socials = [
    { Icon: LinkedinLogo, href: "https://www.linkedin.com" },
    { Icon: InstagramLogo, href: "https://www.instagram.com" },
    { Icon: FacebookLogo, href: "https://www.facebook.com" },
    { Icon: YoutubeLogo, href: "https://www.youtube.com" },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-10 lg:gap-12"
      data-name="ContactDetails"
    >
      {/* Key Contacts */}
      <motion.div variants={itemVariants} className="flex flex-col gap-4">
        <h3 className="font-semibold !text-[24px] lg:!text-[28px] text-[var(--color-primary)] uppercase tracking-wider">
          KEY CONTACTS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {contactPersons.map((person: { name: string; phone: string; email: string }) => (
            <div
              key={person.email || person.name}
              className="flex flex-col gap-1 p-5 rounded-xl bg-black/[0.02] border border-black/5"
            >
              <span className="font-bold text-lg text-[var(--color-ink)]">
                {person.name}
              </span>
              <a
                href={`tel:${person.phone.replace(/\s+/g, "")}`}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline no-underline"
              >
                {person.phone}
              </a>
              <a
                href={`mailto:${person.email}`}
                className="text-sm text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)] transition-colors no-underline"
              >
                {person.email}
              </a>
            </div>
          ))}
        </div>
      </motion.div>

      {/* General Inquiries */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h3 className="font-semibold !text-[24px] lg:!text-[28px] text-[var(--color-primary)] uppercase tracking-wider">
          GENERAL INQUIRIES
        </h3>
        <a
          href={`mailto:${generalEmail}`}
          className="text-lg lg:text-xl text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors w-fit font-medium no-underline"
        >
          {generalEmail}
        </a>
      </motion.div>

      {/* Addresses */}
      <motion.div variants={itemVariants} className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold !text-[24px] lg:!text-[28px] text-[var(--color-primary)] uppercase tracking-wider">
            ADDRESS
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {/* 1. Abuja - Head Office */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold !text-[14px] tracking-wider text-[var(--color-accent)] uppercase">
                Abuja - Head Office
              </span>
              <p className="!text-[20px] text-[var(--color-ink)] leading-relaxed">
                {abujaOffice}
              </p>
            </div>

            {/* 2. Lagos Office */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold !text-[14px] tracking-wider text-[var(--color-accent)] uppercase">
                Lagos
              </span>
              <p className="!text-[20px] text-[var(--color-ink)] leading-relaxed">
                {lagosOffice}
              </p>
            </div>

            {/* 3. Port Harcourt Operations Base */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold !text-[14px] tracking-wider text-[var(--color-accent)] uppercase">
                Port Harcourt Operations Base
              </span>
              <p className="!text-[20px] text-[var(--color-ink)] leading-relaxed">
                {portHarcourtBase}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ContactDetails;
