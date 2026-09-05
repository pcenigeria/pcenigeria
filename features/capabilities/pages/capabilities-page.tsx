import { CapabilitiesHero, OurApproach, CoreCapabilities, HowWeWork } from '../components';

interface CapabilitiesPageProps {
    sanityCapabilities?: any[];
    sanityPage?: any;
}

export const CapabilitiesPage: React.FC<CapabilitiesPageProps> = ({ sanityCapabilities, sanityPage }) => {
    return (
        <div className="flex flex-col w-full">
            <CapabilitiesHero sanityPage={sanityPage} />
            <OurApproach sanityPage={sanityPage} />
            <CoreCapabilities sanityCapabilities={sanityCapabilities} sanityPage={sanityPage} />
            <HowWeWork />
        </div>
    );
};

export default CapabilitiesPage;
