import React from 'react';
import { SafetyHero, Safety, Quality, EnvironmentalCare, OurFuture, Certification } from '../components';

interface SafetyPageProps {
    sanityPage?: any;
}

export const SafetyPage: React.FC<SafetyPageProps> = ({ sanityPage }) => {
    return (
        <div className="flex flex-col w-full bg-[var(--color-canvas)]">
            <SafetyHero sanityPage={sanityPage} />
            <Safety section={sanityPage?.safetySection} />
            <Quality section={sanityPage?.qualitySection} />
            <EnvironmentalCare section={sanityPage?.environmentalSection} />
            <OurFuture section={sanityPage?.futureSection} />
            <Certification section={sanityPage?.certificationSection} />
        </div>
    );
};
