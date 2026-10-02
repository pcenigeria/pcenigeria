import { HomeHero, Overview, FeaturedProject, Capabilities } from "../components";

interface HomePageProps {
    sanityPage?: any;
    sanityCapabilities?: any[];
}

export function HomePage({ sanityPage, sanityCapabilities }: HomePageProps) {
    return (
        <div className="flex flex-col w-full">
            <HomeHero sanityPage={sanityPage} />
            <Overview sanityPage={sanityPage} />
            <FeaturedProject sanityPage={sanityPage} />
            <Capabilities sanityPage={sanityPage} sanityCapabilities={sanityCapabilities} />
        </div>
    );
}
