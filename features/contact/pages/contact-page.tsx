import React from 'react';
import { Text } from '@/shared/components/ui/text';
import { ContactDetails, ContactForm } from '../components';

const DEFAULT_HERO_HEADLINE = 'Start with what you know.';
const DEFAULT_HERO_SUBTEXT =
    'You do not need a complete technical scope before speaking with PCE. Whether the project is at an early assessment stage or already moving toward execution, share the information currently available and our team can help identify what is needed next.';

interface ContactPageProps {
    sanityPage?: any;
}

export const ContactPage: React.FC<ContactPageProps> = ({ sanityPage }) => {
    const heroHeadline = sanityPage?.heroHeadline || DEFAULT_HERO_HEADLINE;
    const heroSubtext = sanityPage?.heroSubtext || DEFAULT_HERO_SUBTEXT;

    return (
        <div className="flex flex-col w-full bg-[var(--color-canvas-tint)]">

            {/* Contact Hero Header */}
            <section className="w-full section bg-[#052237] text-white pt-16 pb-20">

                {/* Tagline */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                    <span className="text-sm uppercase tracking-wider text-[var(--color-canvas-tint)] font-semibold">
                        Get In Touch
                    </span>
                </div>

                {/* 2-Column Grid: Heading Left, Subtext Right (Both aligned to bottom) */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">

                    {/* Left Column: Headline */}
                    <div className="lg:col-span-6">
                        <Text variant="display-lg" as="h1" intent="default" className="!font-extrabold leading-tight !text-white">
                            {heroHeadline}
                        </Text>
                    </div>

                    {/* Right Column: Subtext */}
                    <div className="lg:col-span-6 max-w-[540px] ml-auto">
                        <p className="!text-[16px] md:!text-[20px] !text-white leading-relaxed">
                            {heroSubtext}
                        </p>
                    </div>

                </div>
            </section>

            {/* Main Contact Form & Details Section */}
            <section className="w-full section py-16 lg:py-24">
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">

                    {/* Contact Form (First on Mobile, Right on Desktop) */}
                    <div className="lg:col-span-7 order-1 lg:order-2">
                        <ContactForm />
                    </div>

                    {/* Contact Details (Second on Mobile, Left on Desktop) */}
                    <div className="lg:col-span-5 order-2 lg:order-1">
                        <ContactDetails sanityPage={sanityPage} />
                    </div>

                </div>
            </section>

        </div>
    );
};
