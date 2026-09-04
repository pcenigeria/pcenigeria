// Objects
import galleryItem from './objects/galleryItem';
import gallery from './objects/gallery';
import statItem from './objects/statItem';
import sectionBlock from './objects/sectionBlock';
import specRow from './objects/specRow';
import ctaButton from './objects/ctaButton';
import seo from './objects/seo';
import contactPerson from './objects/contactPerson';
import blockContent from './objects/blockContent';

// Collections
import project from './collections/project';
import newsArticle from './collections/newsArticle';
import product from './collections/product';
import capability from './collections/capability';
import equipmentCategory from './collections/equipmentCategory';
import resourceCategory from './collections/resourceCategory';

// Page Singletons
import homePage from './pages/homePage';
import companyPage from './pages/companyPage';
import capabilitiesPage from './pages/capabilitiesPage';
import equipmentPage from './pages/equipmentPage';
import safetyQualityPage from './pages/safetyQualityPage';
import projectsPage from './pages/projectsPage';
import productsPage from './pages/productsPage';
import newsInsightsPage from './pages/newsInsightsPage';
import resourcesPage from './pages/resourcesPage';
import contactPage from './pages/contactPage';

// Global Singletons
import navigation from './settings/navigation';
import globalSettings from './settings/globalSettings';

export const schemaTypes = [
  // Objects
  galleryItem,
  gallery,
  statItem,
  sectionBlock,
  specRow,
  ctaButton,
  seo,
  contactPerson,
  blockContent,

  // Collections
  project,
  newsArticle,
  product,
  capability,
  equipmentCategory,
  resourceCategory,

  // Pages
  homePage,
  companyPage,
  capabilitiesPage,
  equipmentPage,
  safetyQualityPage,
  projectsPage,
  productsPage,
  newsInsightsPage,
  resourcesPage,
  contactPage,

  // Settings
  navigation,
  globalSettings,
];
