import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import {
  Layers,
  FolderKanban,
  Newspaper,
  Package,
  Wrench,
  Truck,
  FileDown,
  Settings,
  Compass,
  Sliders,
  Home,
  Building2,
  Cpu,
  ShieldCheck,
  Mail,
  Eye,
} from 'lucide-react';
import { schemaTypes } from './sanity/schemaTypes';
import { ArticlePreviewPane } from './sanity/components/article-preview-pane';
import { PreviewArticleAction } from './sanity/actions/preview-article-action';

// PCE brand palette from shared/styles/colors.css
const pceTheme = buildLegacyTheme({
  '--black': '#001723',
  '--white': '#FFFFFF',
  '--brand-primary': '#1470AD',
  '--main-navigation-color': '#001723',
  '--main-navigation-color--inverted': '#FFFFFF',
  '--focus-color': '#f4691a',
});

const SINGLETONS = [
  'homePage',
  'companyPage',
  'capabilitiesPage',
  'equipmentPage',
  'safetyQualityPage',
  'projectsPage',
  'productsPage',
  'newsInsightsPage',
  'resourcesPage',
  'contactPage',
  'navigation',
  'globalSettings',
];

const PAGE_SINGLETON_MAP: { id: string; title: string; icon: any }[] = [
  { id: 'homePage', title: 'Home', icon: Home },
  { id: 'companyPage', title: 'Our Company', icon: Building2 },
  { id: 'capabilitiesPage', title: 'Capabilities', icon: Cpu },
  { id: 'equipmentPage', title: 'Equipment & Technology', icon: Truck },
  { id: 'safetyQualityPage', title: 'Safety Quality & Responsibility', icon: ShieldCheck },
  { id: 'projectsPage', title: 'Projects', icon: FolderKanban },
  { id: 'productsPage', title: 'Products', icon: Package },
  { id: 'newsInsightsPage', title: 'News & Insights', icon: Newspaper },
  { id: 'resourcesPage', title: 'Resources', icon: FileDown },
  { id: 'contactPage', title: 'Contact', icon: Mail },
];

export default defineConfig({
  name: 'default',
  title: 'PCE Nigeria Content Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  basePath: '/studio',
  theme: pceTheme,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('PCE Content & Navigation')
          .items([
            // Live Site Pages Group
            S.listItem()
              .title('Pages')
              .icon(Layers)
              .child(
                S.list()
                  .title('Pages')
                  .items(
                    PAGE_SINGLETON_MAP.map((page) => {
                      // Projects, Products, Resources, and News & Insights each have
                      // real content that lives in separate collections. Nest those collections
                      // right here so editors land on them without having to search through the root sidebar.
                      if (page.id === 'projectsPage') {
                        return S.listItem()
                          .title(page.title)
                          .id(page.id)
                          .icon(page.icon)
                          .child(
                            S.list()
                              .title('Projects Page')
                              .items([
                                S.listItem()
                                  .title('Page Settings (Hero & Intro)')
                                  .id('projectsPageSettings')
                                  .icon(page.icon)
                                  .child(S.document().schemaType('projectsPage').documentId('projectsPage')),
                                S.divider(),
                                S.documentTypeListItem('project').title(
                                  'Project Case Studies (add/edit projects here)'
                                ).icon(page.icon),
                              ])
                          );
                      }
                      if (page.id === 'productsPage') {
                        return S.listItem()
                          .title(page.title)
                          .id(page.id)
                          .icon(page.icon)
                          .child(
                            S.list()
                              .title('Products Page')
                              .items([
                                S.listItem()
                                  .title('Page Settings (Hero & Intro)')
                                  .id('productsPageSettings')
                                  .icon(page.icon)
                                  .child(S.document().schemaType('productsPage').documentId('productsPage')),
                                S.divider(),
                                S.documentTypeListItem('product').title(
                                  'Products (add/edit products here)'
                                ).icon(page.icon),
                              ])
                          );
                      }
                      if (page.id === 'resourcesPage') {
                        return S.listItem()
                          .title(page.title)
                          .id(page.id)
                          .icon(page.icon)
                          .child(
                            S.list()
                              .title('Resources Page')
                              .items([
                                S.listItem()
                                  .title('Page Settings (Hero & Intro)')
                                  .id('resourcesPageSettings')
                                  .icon(page.icon)
                                  .child(S.document().schemaType('resourcesPage').documentId('resourcesPage')),
                                S.divider(),
                                S.documentTypeListItem('resourceCategory').title(
                                  'Resource Categories (add/edit downloadable files here)'
                                ).icon(page.icon),
                              ])
                          );
                      }
                      if (page.id === 'newsInsightsPage') {
                        return S.listItem()
                          .title(page.title)
                          .id(page.id)
                          .icon(page.icon)
                          .child(
                            S.list()
                              .title('News & Insights Page')
                              .items([
                                S.listItem()
                                  .title('Page Settings (Hero & Intro)')
                                  .id('newsInsightsPageSettings')
                                  .icon(page.icon)
                                  .child(S.document().schemaType('newsInsightsPage').documentId('newsInsightsPage')),
                                S.divider(),
                                S.documentTypeListItem('newsArticle').title(
                                  'News & Insights Articles (add/edit articles here)'
                                ).icon(page.icon),
                              ])
                          );
                      }
                      return S.listItem()
                        .title(page.title)
                        .id(page.id)
                        .icon(page.icon)
                        .child(S.document().schemaType(page.id).documentId(page.id));
                    })
                  )
              ),
            S.divider(),

            // Content Collections (Matching Site Sections)
            S.documentTypeListItem('project').title('Projects (Case Studies)').icon(FolderKanban),
            S.documentTypeListItem('newsArticle').title('News & Insights').icon(Newspaper),
            S.documentTypeListItem('product').title('Products').icon(Package),
            S.documentTypeListItem('capability').title('Capabilities').icon(Wrench),
            S.documentTypeListItem('equipmentCategory').title('Equipment').icon(Truck),
            S.documentTypeListItem('resourceCategory').title('Resources').icon(FileDown),

            S.divider(),

            // Site Settings & Global Navigation
            S.listItem()
              .title('Site Settings')
              .icon(Settings)
              .child(
                S.list()
                  .title('Site Settings')
                  .items([
                    S.listItem()
                      .title('Navigation Menus')
                      .id('navigation')
                      .icon(Compass)
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                    S.listItem()
                      .title('Global Site Settings')
                      .id('globalSettings')
                      .icon(Sliders)
                      .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
                  ])
              ),
          ]),
      defaultDocumentNode: (S, { schemaType }) => {
        if (schemaType === 'newsArticle') {
          return S.document().views([
            S.view.form(),
            S.view.component(ArticlePreviewPane).title('Live Preview').icon(Eye),
          ]);
        }
        return S.document().views([S.view.form()]);
      },
    }),
    visionTool(),
  ],

  // Enable native scheduled publishing in Sanity Studio
  scheduledDrafts: {
    enabled: true,
  },

  // Restrict raw GROQ query Vision tool to Administrator role
  tools: (prev, { currentUser }) => {
    const isAdmin = currentUser?.roles.some((role) => role.name === 'administrator');
    return isAdmin ? prev : prev.filter((tool) => tool.name !== 'vision');
  },

  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (input, context) => {
      let actions = SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action && !['duplicate', 'delete'].includes(action))
        : input;

      if (context.schemaType === 'newsArticle') {
        actions = [...actions, PreviewArticleAction];
      }

      return actions;
    },
  },
});
