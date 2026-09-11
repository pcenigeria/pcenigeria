import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '..');

const envPath = path.join(REPO_ROOT, '.env.local');
const env = {};
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx !== -1) {
      env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
}

const projectId = env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = env.NEXT_PUBLIC_SANITY_API_VERSION;

async function check() {
  const query = `{
    "capabilities": *[_id == "capabilitiesPage"][0] {
      "hasHowWeWork": defined(howWeWorkSection),
      "stepsCount": count(howWeWorkSection.steps)
    },
    "projects": *[_id == "projectsPage"][0] {
      "slidesCount": count(heroSlides),
      "tabsCount": count(filterTabs),
      "cardsCount": count(whatWorksCards),
      "hasGridSection": defined(gridSection)
    },
    "products": *[_id == "productsPage"][0] {
      "hasAbout": defined(aboutSection),
      "aboutStatsCount": count(aboutSection.stats),
      "hasStratum": defined(stratumSection),
      "stratumCardsCount": count(stratumSection.cards),
      "matrixRowsCount": count(matrixRows),
      "caseStudiesCount": count(caseStudiesSection.items),
      "contactsCount": count(salesContacts),
      "officesCount": count(salesOffices)
    }
  }`;

  const res = await fetch(`https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`);
  const data = await res.json();
  console.log('Sanity Verification Results:\n', JSON.stringify(data.result, null, 2));
}

check().catch(console.error);
