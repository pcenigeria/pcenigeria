import React from 'react';
import { CompanyHero, WhoWeAre, OverviewCapabilities, OurDirection, Experience, PeopleScale, Standards } from '../components';

interface CompanyPageProps {
    sanityPage?: any;
}

export const CompanyPage: React.FC<CompanyPageProps> = ({ sanityPage }) => {
    return (
        <div className="flex flex-col w-full">
            <CompanyHero
                heroHeadline={sanityPage?.heroHeadline}
                heroSubtext={sanityPage?.heroSubtext}
                heroSubtext2={sanityPage?.heroSubtext2}
                heroPrimaryBtnText={sanityPage?.heroPrimaryBtnText}
                heroPrimaryBtnLink={sanityPage?.heroPrimaryBtnLink}
                heroImage={sanityPage?.heroImage}
            />
            <WhoWeAre section={sanityPage?.whoWeAreSection} images={sanityPage?.whoWeAreImages} />
            <OverviewCapabilities section={sanityPage?.overviewCapabilitiesSection} cards={sanityPage?.deliveryBentoCards} />
            <OurDirection section={sanityPage?.visionMissionSection} />
            <Experience section={sanityPage?.experienceSection} image={sanityPage?.experienceImage} />
            <PeopleScale section={sanityPage?.peopleScaleSection} stats={sanityPage?.peopleScaleStats} />
            <Standards section={sanityPage?.standardsSection} image={sanityPage?.standardsImage} />
        </div>
    );
};
