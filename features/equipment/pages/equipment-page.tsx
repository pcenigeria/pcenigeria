import { ETHero, OurEquipments, Support } from '../components';

interface EquipmentPageProps {
  sanityCategories?: any[];
  sanityPage?: any;
}

export const EquipmentPage: React.FC<EquipmentPageProps> = ({ sanityCategories, sanityPage }) => {
    return (
        <div className="flex flex-col w-full">
            <ETHero sanityPage={sanityPage} />
            <OurEquipments sanityCategories={sanityCategories} />
            <Support sanityPage={sanityPage} />
        </div>
    );
};

export default EquipmentPage;
