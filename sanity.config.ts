import { defineConfig, buildLegacyTheme } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';

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

const PAGE_SINGLETON_MAP: { id: string; title: string }[] = [
  { id: 'homePage', title: 'Home' },
  { id: 'companyPage', title: 'Our Company' },
  { id: 'capabilitiesPage', title: 'Capabilities' },
  { id: 'equipmentPage', title: 'Equipment & Technology' },
  { id: 'safetyQualityPage', title: 'Safety Quality & Responsibility' },
  { id: 'projectsPage', title: 'Projects' },
  { id: 'productsPage', title: 'Products' },
  { id: 'newsInsightsPage', title: 'News & Insights' },
  { id: 'resourcesPage', title: 'Resources' },
  { id: 'contactPage', title: 'Contact' },
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
              .child(
                S.list()
                  .title('Pages')
                  .items(
                    PAGE_SINGLETON_MAP.map((page) =>
                      S.listItem()
                        .title(page.title)
                        .id(page.id)
                        .child(S.document().schemaType(page.id).documentId(page.id))
                    )
                  )
              ),
            S.divider(),

            // Content Collections (Matching Site Sections)
            S.documentTypeListItem('project').title('Projects (Case Studies)'),
            S.documentTypeListItem('newsArticle').title('News & Insights'),
            S.documentTypeListItem('product').title('Products'),
            S.documentTypeListItem('capability').title('Capabilities'),
            S.documentTypeListItem('equipmentCategory').title('Equipment'),
            S.documentTypeListItem('resourceCategory').title('Resources'),

            S.divider(),

            // Site Settings & Global Navigation
            S.listItem()
              .title('Site Settings')
              .child(
                S.list()
                  .title('Site Settings')
                  .items([
                    S.listItem()
                      .title('Navigation Menus')
                      .id('navigation')
                      .child(S.document().schemaType('navigation').documentId('navigation')),
                    S.listItem()
                      .title('Global Site Settings')
                      .id('globalSettings')
                      .child(S.document().schemaType('globalSettings').documentId('globalSettings')),
                  ])
              ),
          ]),
    }),
    visionTool(),
  ],

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
    actions: (input, context) =>
      SINGLETONS.includes(context.schemaType)
        ? input.filter(({ action }) => action && !['duplicate', 'delete'].includes(action))
        : input,
  },
});
