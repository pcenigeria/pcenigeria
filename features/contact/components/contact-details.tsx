"use client";

import React, { useState } from "react";
import { LinkedinLogo, FacebookLogo, InstagramLogo, YoutubeLogo } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function ContactDetails() {
  const [hoveredSocial, setHoveredSocial] = useState<number | null>(null);

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
          <div className="flex flex-col gap-1 p-5 rounded-xl bg-black/[0.02] border border-black/5">
            <span className="font-bold text-lg text-[var(--color-ink)]">
              Wan Yang
            </span>
            <a
              href="tel:+2347074126596"
              className="text-base font-semibold text-[var(--color-accent)] hover:underline no-underline"
            >
              +234 707 412 6596
            </a>
            <a
              href="mailto:wanyang@pcenigeria.com"
              className="text-sm text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)] transition-colors no-underline"
            >
              wanyang@pcenigeria.com
            </a>
          </div>

          <div className="flex flex-col gap-1 p-5 rounded-xl bg-black/[0.02] border border-black/5">
            <span className="font-bold text-lg text-[var(--color-ink)]">
              Xu Liangkui
            </span>
            <a
              href="tel:+2347013732816"
              className="text-base font-semibold text-[var(--color-accent)] hover:underline no-underline"
            >
              +234 701 373 2816
            </a>
            <a
              href="mailto:xuliangkui@pcenigeria.com"
              className="text-sm text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)] transition-colors no-underline"
            >
              xuliangkui@pcenigeria.com
            </a>
          </div>
        </div>
      </motion.div>

      {/* General Inquiries */}
      <motion.div variants={itemVariants} className="flex flex-col gap-2">
        <h3 className="font-semibold !text-[24px] lg:!text-[28px] text-[var(--color-primary)] uppercase tracking-wider">
          GENERAL INQUIRIES
        </h3>
        <a
          href="mailto:info@pcenigeria.com"
          className="text-lg lg:text-xl text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors w-fit font-medium no-underline"
        >
          info@pcenigeria.com
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
                House 45, Nelson Mandela Street, Asokoro, Abuja, Nigeria
              </p>
            </div>

            {/* 2. Lagos Office */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold !text-[14px] tracking-wider text-[var(--color-accent)] uppercase">
                Lagos
              </span>
              <p className="!text-[20px] text-[var(--color-ink)] leading-relaxed">
                HyGroup Place 6 Ojulari Street, off Kusenla Road Ikate, Elegushi, Lekki, Lagos
              </p>
            </div>

            {/* 3. Port Harcourt Operations Base */}
            <div className="flex flex-col gap-1">
              <span className="font-semibold !text-[14px] tracking-wider text-[var(--color-accent)] uppercase">
                Port Harcourt Operations Base
              </span>
              <p className="!text-[20px] text-[var(--color-ink)] leading-relaxed">
                East–West Road Opposite New Onne Link Road Ebubu, Eleme, Rivers State
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default ContactDetails;
