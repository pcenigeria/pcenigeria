# PCE Nigeria — CMS Editorial SEO Guide & Content Stylebook
> **Standard Operating Procedure (SOP) for Publishing Articles & Insights on `pcenigeria.com` via Sanity CMS**

---

## 1. Executive Summary & Ranking Objective

Every article published under **News & Insights** (`/news-insights`) serves two high-value business goals:
1. **Google & Search Engine Visibility**: Rank for high-intent keywords searched by oil & gas operators (NNPC, IOCs, EPC conglomerates, pipeline engineers) looking for HDD contracting, pipeline construction, and drilling mud chemicals in Nigeria.
2. **AI & LLM Citation (AEO - Answer Engine Optimization)**: Provide clear, authoritative technical data that ChatGPT, Perplexity, Claude, and Google AI Overviews cite when answering questions about trenchless pipeline engineering in West Africa.

---

## 2. Sanity Studio: Field-by-Field Publishing Checklist

When creating a new document under **News & Insights Articles** in Sanity Studio, follow this exact workflow:

### A. Title (`title`)
- **Length**: 50–65 characters.
- **Rule**: Must contain the target keyword naturally near the front.
- **Formula**: `[Action / Topic] + [Target Keyword] + [Context/Outcome]`
- **Examples**:
  - ❌ *Project Update March 2025*
  - ✅ *AKK River Niger HDD Crossing: 48-Inch Pipeline Engineering Report*
  - ❌ *Bentonite Information*
  - ✅ *Lantic BRSBENT SQ: Activated Sodium Bentonite Guide for HDD in Nigeria*

### B. Slug (`slug`)
- **Rule**: All lowercase, words separated by hyphens (`-`). Never use underscores, uppercase letters, or dates unless it is an annual report.
- **Formula**: `[primary-keyword]-[sub-topic]`
- **Examples**:
  - ❌ `post-1` or `March_Update`
  - ✅ `akk-river-niger-hdd-crossing`
  - ✅ `bentonite-drilling-fluid-guide-hdd-nigeria`
  - ✅ `cmc-vs-xanthan-gum-hdd-drilling-mud`

### C. Category (`category`)
Choose between:
- **News**: Milestones, project mobilizations, contract awards, company announcements.
- **Insights**: Technical whitepapers, engineering guides, product comparisons, fluid rheology tutorials, industry analyses.

### D. Publication Date (`date`)
- Set the true release date. This populates the `publishedTime` OpenGraph tag, RSS `<pubDate>`, and Google `BlogPosting` JSON-LD schema.

### E. Author (`author`)
- **Default**: `PCE Technical Team` or `PCE Engineering Department`
- **Specific**: e.g., `Wan Yang (Senior HDD Project Lead)` or `Drilling Fluids Laboratory`
- *Why it matters*: Enhances Google's **E-E-A-T** (Experience, Expertise, Authoritativeness, Trustworthiness) score.

### F. Read Time (`readTime`)
- Example: `5 min read` or `8 min read`.

### G. Hero Image (`heroImage`)
- **Dimensions**: 1200 × 630 px minimum (16:9 aspect ratio).
- **Format**: High-quality JPG or WebP (under 300 KB).
- **Rule**: Must be a real jobsite photo (rig, pipeline, crew, mud laboratory, River Niger) rather than generic corporate clip art.
- **Alt Text**: Descriptive of the action and location (e.g., *"1200t HDD drilling rig operating on the banks of River Niger for the AKK pipeline crossing"*).

### H. Intro / Summary Excerpt (`intro`)
- **Length**: 140–160 characters.
- **Rule**: This serves as the meta description fallback and RSS feed snippet if no SEO override is provided.
- **Formula**: `[Direct answer / hook] + [Key technical scope] + [Value proposition].`
- **Example**: *"Explore how PCE Nigeria completed the 48-inch AKK River Niger HDD crossing using a 1,200-tonne rig and advanced ParaTrack guidance in challenging alluvial strata."*

### I. SEO Tab Fields (`seo`)
*Never skip the SEO tab!*

| Sanity Field | Specification | Example |
|--------------|---------------|---------|
| **Meta Title** | 50–60 characters; keyword-rich. | `AKK River Niger HDD Crossing Case Study \| PCE Nigeria` |
| **Meta Description** | 150–160 characters; actionable with target keyword. | `Technical case study of PCE Nigeria's 48-inch AKK Gas Pipeline River Niger HDD crossing. Pullback forces, geology, and drilling fluid solutions.` |
| **Focus Keywords** | 3–6 comma-separated targeted phrases. | `AKK pipeline HDD, River Niger crossing, HDD contractor Nigeria, 48 inch pipeline crossing` |
| **OG Image** | Optional 1200×630 custom social share card. | Image with title overlay or project banner. |
| **Canonical URL Override** | Leave empty unless syndicating content originally published on an external website. | `(leave blank)` |

---

## 3. Article Content Sections & Dynamic Widgets

Articles are structured into clear sections. Each section starts with a **Section Heading** (and optional Tagline/Eyebrow), followed by your custom choice of **Content Widgets**. 

Instead of filling out a rigid monolithic form, authors click **"Add item"** under **Content Widgets** and pick only what they need:

| Widget Name | Purpose & Use Case | Key Fields |
|-------------|--------------------|------------|
| **Paragraph / Rich Text** | Formatted body paragraphs, bold/italic accents, internal links, and inline photos. | `content` (Rich text editor) |
| **Media Embed** | Responsive YouTube video, Vimeo, X (Twitter) post, or LinkedIn embed. | `url`, `caption` (optional), `aspectRatio` (16:9, 4:3, 1:1, 9:16) |
| **Bullet Points List** | Clean key takeaways, technical parameters, or numbered lists. | `items` (Array of text lines) |
| **Highlight Stat Metric** | Large visual callout number (e.g. `1,200t`, `48"`, `2,293m`). | `value` (metric number), `label` (metric description) |
| **Quote / Key Takeaway** | Highlighted executive quote or engineering takeaway. | `quote`, `author`, `role` |
| **Photo Gallery Grid** | Small responsive grid of jobsite photos for this specific section. | `gallery` (Batch of uploaded photos) |
| **Action Button / Link** | Direct call-to-action button linking to capabilities, products, or contact. | `text`, `url`, `variant` (Blue, Orange, Outline) |

> [!TIP]
> **Flexible Widget Reordering**: You can insert multiple widgets in whatever order tells the best story! For example:
> *Intro Paragraph* -> *YouTube Video Embed* -> *Key Takeaways Bullets* -> *Call to Action Button*.

---

## 4. Article Body Formatting & Structure

### Heading Hierarchy
- **H1**: Handled automatically by the page template using the document `title`. **Do not insert H1 inside the body content.**
- **H2**: Primary sections (e.g., *"Geological Challenges at the River Niger"*, *"Drilling Fluid Rheology Strategy"*).
- **H3**: Sub-points, equipment specs, or step-by-step methodologies.

### Direct-Answer Paragraphs (for AI Overviews & Featured Snippets)
Search engines and LLMs pull answers from concise summary paragraphs immediately following a question heading.
- **Example H2**: `What is the Maximum Pullback Capacity of PCE Nigeria's HDD Rigs?`
- **Immediate Answer**: `PCE Nigeria operates heavy-duty HDD drill rigs with pullback capacities of up to 1,200 tonnes and 500 tonnes, enabling large-diameter pipeline crossings up to 48 inches across major waterways in West Africa.`

### Mandatory Internal Linking Rules
Every article **must contain at least 2–3 links** pointing to core business pages:
1. **When mentioning HDD, EPC, or pipeline detection**:
   - Link to `[Capabilities](/capabilities)`
2. **When mentioning bentonite, mud additives, or polymers**:
   - Link to `[Products Catalog](/products)` or specific products like `[BRSBENT SQ](/products/brsbent-sq)` and `[BRSXTG](/products/brsxtg)`
3. **When referencing completed works**:
   - Link to `[Projects](/projects)` or specific projects like `[AKK River Niger Project](/projects/akk-river-niger)`
4. **Call to Action (CTA)**:
   - End every technical article with a link to `[Contact PCE Nigeria](/contact)` for project feasibility studies and quotes.

### Automatic Link Coloring & Customization Options
When highlighting any text in Sanity's Rich Text Editor and clicking the Link icon:
- **Automatic Brand Blue**: Embedded links automatically render in PCE's primary action blue (`#1470AD`) with an underline and smooth hover transition.
- **Link Color Radio Picker**: You can optionally switch individual links to:
  - **Brand Action Blue (Default)**: `#1470AD`
  - **Accent Orange**: `#f4691a` (Great for high-priority CTAs and contact links)
  - **Deep Navy / Ink**: `#001723` (Discreet inline citations)
  - **Inherit Text Color**: Underline only, matching the surrounding paragraph color
- **Relative URLs Supported**: You can type clean relative internal links like `/capabilities`, `/contact`, or `/projects/akk-river-niger` without needing full domain URLs.
- **Open in New Window / Tab**: Toggle on for external reference links outside pcenigeria.com.

---

## 4. The 10 Launch Articles: Keyword-Mapped Blueprints

### Article 1: Case Study (High Intent)
- **Title**: *AKK River Niger HDD Crossing: Engineering the 48-Inch Landmark Pipeline*
- **Slug**: `akk-river-niger-hdd-crossing`
- **Category**: `Insights`
- **Primary Keyword**: `AKK pipeline Nigeria HDD`
- **Secondary Keywords**: `River Niger pipeline crossing, 48 inch HDD Nigeria, Ajaokuta Kaduna Kano pipeline`
- **Key Sections**:
  1. Overview of the AKK Gas Pipeline Project & River Niger Crossing Scope
  2. Subsurface Geology: Managing Gravel, Sand & Riverbed Current
  3. 1,200-Tonne Rig Deployment & Drill Rig Anchoring
  4. ParaTrack 2 Steering & Continuous Pilot Hole Accuracy
  5. Pullback Execution & Pipe String Handling
  6. Implications for Nigeria's Gas Master Plan

### Article 2: Case Study
- **Title**: *OB3 River Niger HDD Crossing: Overcoming Technical Challenges in Swamp Terrain*
- **Slug**: `ob3-river-niger-hdd-crossing-case-study`
- **Category**: `Insights`
- **Primary Keyword**: `OB3 HDD Nigeria`
- **Secondary Keywords**: `OB3 pipeline project, Obiafu Obrikom Oben pipeline, trenchless river crossing Nigeria`
- **Key Sections**:
  1. Background: The Strategic Role of the OB3 Pipeline in Nigeria's Gas Transmission
  2. Technical Challenges: Water Depth, Swamp Marsh, and Pullback Loads
  3. High-Density Bentonite Slurry Formulations for Borehole Stability
  4. Final Pull-In & Hydrotesting Results

### Article 3: Educational / Top-of-Funnel
- **Title**: *What is Horizontal Directional Drilling (HDD)? The Complete Trenchless Guide for Nigeria*
- **Slug**: `horizontal-directional-drilling-hdd-nigeria-guide`
- **Category**: `Insights`
- **Primary Keyword**: `Horizontal Directional Drilling Nigeria`
- **Secondary Keywords**: `HDD contractor Nigeria, trenchless pipeline installation Nigeria, HDD crossing process`
- **Key Sections**:
  1. What is HDD and Why is it Essential in Nigeria's Sensitive Ecosystems?
  2. The 3 Phases of HDD: Pilot Hole, Reaming Passes, and Pipe Pullback
  3. Comparing Open-Cut Trenches vs. Trenchless HDD for Waterways & Highways
  4. Equipment Overview: Rigs, Mud Pumps, Reamers, and Guidance Tools
  5. Selecting an HDD Contractor in Nigeria: Core Requirements

### Article 4: Product / Commercial Whitepaper
- **Title**: *Lantic BRSBENT SQ: The Activated Sodium Bentonite Standard for Heavy HDD in Nigeria*
- **Slug**: `lantic-brsbent-sq-activated-bentonite-hdd-guide`
- **Category**: `Insights`
- **Primary Keyword**: `bentonite HDD Nigeria`
- **Secondary Keywords**: `activated sodium bentonite, API 13A bentonite Nigeria, HDD drilling mud chemicals`
- **Key Sections**:
  1. The Role of Bentonite in Hole Stability & Cuttings Transport
  2. Why Activated Sodium Bentonite Outperforms Calcium Bentonite in River Crossings
  3. Technical Specifications of BRSBENT SQ (Viscosity, Yield Point, Fluid Loss)
  4. Recommended Mixing Procedures and Water Chemistry Considerations
  5. Local Stock and Supply Logistics Across Nigeria

### Article 5: Technical Comparison
- **Title**: *Carboxymethyl Cellulose (CMC) vs. Xanthan Gum: Optimizing HDD Drilling Fluids*
- **Slug**: `cmc-vs-xanthan-gum-hdd-drilling-fluids`
- **Category**: `Insights`
- **Primary Keyword**: `HDD drilling fluid additives`
- **Secondary Keywords**: `BRSCMC, BRSXTG, fluid loss control Nigeria, biopolymer viscosifier`
- **Key Sections**:
  1. Why Additives are Needed Beyond Pure Bentonite in Complex Strata
  2. What is BRSCMC? Fluid Loss Reduction and Filter Cake Integrity
  3. What is BRSXTG (Xanthan Gum)? Low-Shear Rate Viscosity & Hole Cleaning
  4. Direct Comparison Matrix: CMC vs. Xanthan Gum
  5. Synergy Formulation: When to Combine Both in Deep River Crossings

### Article 6: Technology Feature
- **Title**: *Buried Pipeline Detection System (BPDS): Preventing Catastrophic Strikes in Riverbeds*
- **Slug**: `buried-pipeline-detection-system-bpds-nigeria`
- **Category**: `Insights`
- **Primary Keyword**: `buried pipeline detection Nigeria`
- **Secondary Keywords**: `BPDS pipeline detection, 3D underground pipeline mapping, pipeline strike prevention`
- **Key Sections**:
  1. The Danger of Unknown Crossings in River Niger and Niger Delta Waterways
  2. Limitations of Conventional Sub-Bottom Profilers and Magnetometers
  3. How PCE's 3D Electromagnetic BPDS Operates
  4. Case Application: Mapping Legacy Pipelines Prior to AKK and OB3 Drilling

### Article 7: EPC Construction
- **Title**: *52km Pipeline EPC in Swamp Terrain: Logistics, Right-of-Way & Trenching in Nigeria*
- **Slug**: `52km-pipeline-epc-swamp-terrain-nigeria`
- **Category**: `Insights`
- **Primary Keyword**: `pipeline EPC Nigeria`
- **Secondary Keywords**: `swamp pipeline construction, pipeline EPC contractor Nigeria, gas pipeline construction`
- **Key Sections**:
  1. Project Scope & Terrain Analysis in Nigerian Swamp Right-of-Way
  2. Earthworks, Sheet Piling, and Dewatering Strategies
  3. Pipeline Stringing, Tie-Ins, and Field Joint Coating
  4. Environmental Mitigation and Community Liaison Success

### Article 8: Technical Quality / Standards
- **Title**: *Pipeline Welding & NDT Quality Standards: How PCE Nigeria Ensures Zero-Defect Crossings*
- **Slug**: `pipeline-welding-ndt-standards-nigeria`
- **Category**: `Insights`
- **Primary Keyword**: `pipeline NDT Nigeria`
- **Secondary Keywords**: `pipeline welding standards, API 1104 welding Nigeria, radiographic pipeline testing`
- **Key Sections**:
  1. The Critical Nature of Weld Integrity During High-Tension Pullback
  2. Applicable Standards: API 1104, ASME B31.8, and ISO 13847
  3. NDT Methods: Radiography (RT), Ultrasonic Testing (UT/PAUT), and Magnetic Particle
  4. Pre-Pullback Hydrotesting Protocols

### Article 9: Global Engineering Milestone
- **Title**: *Raoyang River 2,293-Meter HDD Crossing: Lessons from an Ultra-Long-Distance Pullback*
- **Slug**: `raoyang-river-2293m-hdd-crossing-case-study`
- **Category**: `Insights`
- **Primary Keyword**: `long distance HDD record`
- **Secondary Keywords**: `2000m HDD crossing, record pipeline crossing, ultra-long directional drilling`
- **Key Sections**:
  1. Project Background and 2,293m Length Challenges
  2. Dual-Rig Intersect Method: How Guidance Systems Met Mid-Crossing
  3. Friction Reduction Strategies & Ballast Control During Pullback
  4. How This Engineering Experience Directly Transfers to Nigeria's Major Crossings

### Article 10: Buyer's Guide / Decision Maker Resource
- **Title**: *Choosing a Trenchless Pipeline Contractor in Nigeria: 7 Critical Technical Criteria*
- **Slug**: `choosing-trenchless-hdd-contractor-nigeria`
- **Category**: `Insights`
- **Primary Keyword**: `trenchless contractor Nigeria`
- **Secondary Keywords**: `how to choose HDD contractor, pipeline crossing contractor qualification, oil gas contractor Nigeria`
- **Key Sections**:
  1. Rig Capacity vs. Pipe Diameter: Why Rig Margin Matters
  2. In-House Drilling Fluid Engineering vs. Commodity Sourcing
  3. Guidance Systems: Walkover vs. Gyro / Steering Tool Accuracy
  4. Track Record with NNPC, NLNG, and IOC Tier-1 Specifications
  5. Local Content Compliance and Community Relations Track Record
  6. Evaluation Scorecard Template for Engineering Project Managers

---

## 5. Pre-Publish Quality Audit Checklist

---

## 5. Live Preview Feature for Authors

Authors can preview unpublished drafts before publishing to verify layout, photos, and formatting across devices:

### Option A: In-Studio Live Preview Tab (Side-by-Side)
1. Open any article under **News & Insights** in Sanity Studio.
2. At the top of the editor pane, click the **"Live Preview"** tab beside the "Content" tab.
3. Switch between **Desktop (🖥️)**, **Tablet (💻)**, and **Mobile (📱)** viewport modes to verify responsive readability.
4. Click **🔄 Refresh** anytime you edit text in the form.

### Option B: Open Full-Page Preview in a New Browser Tab
1. In the bottom action bar of the article (next to the green "Publish" button), click the **"Preview Article"** button.
2. This activates **Next.js Draft Mode** and opens the article in a full new window.
3. While in Draft Mode:
   - A sticky **"Draft Preview"** banner appears at the top.
   - Unpublished text and newly uploaded photos are visible immediately.
   - Search crawlers are automatically instructed not to index the preview URL (`robots: noindex, nofollow`).
4. When finished, click **"Exit Preview ✕"** on the banner to return to standard view.

---

## 6. Pre-Publish Quality Audit Checklist

Before clicking **Publish** on any article in Sanity Studio, verify:
- [ ] **Title**: Contains the primary keyword, under 65 characters.
- [ ] **Slug**: Clean, lowercase, hyphenated, contains primary keyword.
- [ ] **Category**: Set to `News` or `Insights`.
- [ ] **Date**: Accurate publication timestamp.
- [ ] **Author**: Attributed to `PCE Technical Team` or specific engineer.
- [ ] **Hero Image**: 1200×630px WebP/JPG with descriptive alt text.
- [ ] **Intro**: 140–160 character summary that delivers direct value.
- [ ] **Headings**: H2 and H3 only (no duplicate H1).
- [ ] **Internal Links**: At least 2 links to `/capabilities`, `/products/*`, `/projects/*`, or `/contact`.
- [ ] **SEO Tab**: Meta Title, Meta Description, and Focus Keywords completely populated.
- [ ] **Live Preview**: Checked layout on both Desktop and Mobile viewports.

