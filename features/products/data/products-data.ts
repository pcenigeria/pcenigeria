import { ProductDetail } from '../types';

export const PRODUCTS_DATA: ProductDetail[] = [

    {
        id: 'brsbent-sq',
        slug: 'brsbent-sq',
        title: 'BRSBENT SQ',
        subtitle: 'Activated Bentonite',
        eyebrow: 'HDD Drilling Fluid Material',
        description: 'Premium drilling fluid material for HDD, slurry TBM and deep foundation applications',
        image: '/pictures/product-image/bent/cover-photo.jpg',
        heroImage: '/pictures/product-image/bent/cover-photo.jpg',
        galleryImages: [
            '/pictures/product-image/bent/cover-photo.jpg',
            '/pictures/product-image/bent/bent-bag.png',
            '/pictures/product-image/bent/bent-pack.png',
            '/pictures/product-image/bent/bent-stock.png',
            '/pictures/product-image/bent/bent-store.png'
        ],
        quickFacts: ['Highly Thixotropic', 'Marsh Viscosity ≥ 100 sec', 'Available in 25kg–1,400kg', 'Bulk Tanker Available'],
        tdsUrl: '/resources/BRSBENT_SQ_Product_Data_Sheet.pdf',
        sdsUrl: '/resources/BRSBENT_SQ_Safety_Data_Sheet.pdf',
        overviewText: 'BRSBENT SQ is a versatile activated bentonite with strong thixotropic properties, ideal for all freshwater based drilling systems. It suits slurry TBM, deep foundations, and HDD projects, with adjustable rheology for optimal performance in diverse drilling applications.',
        mainFunctions: [
            'Ensures borehole / trench stability',
            'Builds impermeable membrane / filter cake',
            'Promotes smooth circulation',
            'Facilitates efficient separation'
        ],
        features: [
            'For robust drilling fluid systems',
            'Highly thixotropic with enhanced gel strengths',
            'Good interaction with most SM additives',
            'Well-balanced rheology and predictability'
        ],
        howItsUsed: {
            dosage: '40–60 kg/m³ of water',
            mixingSteps: [
                'Check the water quality (pH and EC) and pretreat with pH CONTROL® if needed.',
                'Add the calculated amount of selected BRSBENT® SQ slowly into the mixer.',
                'Mix the slurry intensely for at least 30 minutes.',
                'Hydrate the slurry in the activation tanks with circulation for 4 hours to achieve optimum rheology.'
            ],
            precaution: 'Mix for at least 30 minutes with a high shear mixer; develops optimum rheology within 4 hours hydration time. For more information, contact your representative.'
        },
        supplyDetails: [
            { label: 'Small Bags', value: '25 kg' },
            { label: 'Jumbo Bags', value: '1,000 kg · 1,200 kg · 1,400 kg' },
            { label: 'Bulk Tanker', value: '22 ± 2 MT' }
        ],
        storageInfo: 'Keep the product in its original packaging at normal temperature and protect it from humidity. A loss of rheological and filtrate properties may result from inadequate storage.',
        specTestConditions: 'Tested at 50 g/l · Mixer type GS-3S · Rotation speed 1,100 rpm · Mixing time 5 minutes · Water: tap water · Swelling time: 4 hours.',
        specTables: [
            {
                title: 'Product Specification',
                headers: ['Fluid Property', 'Unit', 'Value'],
                rows: [
                    ['Marsh Viscosity', 'sec', '≥ 100'],
                    ['Filtrate, 30 Minutes', 'ml', '≤ 15'],
                    ['Decantation After 24 Hours', '%', '≤ 0.5'],
                    ['Six-speed Rotational Viscometer', 'mPa·s', '≥ 80']
                ]
            },
            {
                title: 'Physical Properties',
                headers: ['Property', 'Typical Value'],
                rows: [
                    ['Colour', 'Depends on the raw clay'],
                    ['Specific Weight', 'Approx. 2.6 g/cm³'],
                    ['Bulk Density', '900 – 1,100 kg/m³'],
                    ['Swelling Volume, ASTM D5890', '≥ 25 ml / 2 g'],
                    ['WSA (75 μm), API 13B-1', '≤ 1%'],
                    ['Moisture, API 13B-1', '≤ 13%']
                ]
            }
        ],
        safetyAtAGlance: {
            ghsHazard: 'Not classified as a hazardous substance under GHS / OSHA Hazard Communication Standards. The product is a non combustible mineral no fire or dust explosion hazard. In practice, the hazards are: mild dust irritation to respiratory tract, skin and eyes; a slip hazard from spilled or wetted powder, which forms an extremely slippery film; and naturally occurring quartz content (1–2%), so prolonged inhalation of dust should be avoided.',
            ratingSystemName: 'NFPA 704',
            ratings: [
                { label: 'Health', value: '0', color: 'bg-blue-500/10', textColor: 'text-blue-500' },
                { label: 'Flammability', value: '0', color: 'bg-red-500/10', textColor: 'text-red-500' },
                { label: 'Instability', value: '0', color: 'bg-yellow-500/10', textColor: 'text-yellow-500' }
            ],
            ppe: [
                { type: 'Eyes', recommendation: 'Chemical safety goggles (OSHA 29 CFR 1910.133 or EN 166)' },
                { type: 'Skin / hands', recommendation: 'Impervious rubber gloves (nitrile or latex), protective clothing' },
                { type: 'Respiratory', recommendation: 'NIOSH/MSHA-approved dust mask (EN 149 P1/P2) in dusty conditions' },
                { type: 'Footwear', recommendation: 'Safety shoes' }
            ],
            physicalChemical: [
                { property: 'Appearance', value: 'Greyish white free flowing powder' },
                { property: 'Odor / Taste', value: 'Odorless / Tasteless' },
                { property: 'Solubility', value: 'Insoluble in water swells and forms a colloidal suspension' },
                { property: 'Autoignition temperature', value: 'Not applicable does not burn' },
                { property: 'Biodegradability', value: 'Not applicable inorganic mineral' }
            ]
        },
        sdsTitle: 'Safety Data Sheet BRSBENT SQ',
        sdsSections: [
            {
                num: 1,
                title: 'Identification',
                content: 'Product identifier: BRSBENT SQ. Chemical name: Bentonite (sodium montmorillonite clay), HDD drilling grade. Recommended use: Base material of HDD drilling fluids viscosifier and filtration control material for cooling, lubrication, cuttings carrying, and borehole wall protection. Manufacturer/Supplier: Brighter Star Drilling Fluids, www.pcenigeria.com.'
            },
            {
                num: 2,
                title: 'Hazards Identification',
                content: 'Not classified as a hazardous substance under GHS/OSHA Hazard Communication Standards. Minor hazards in practice:\nDust irritation inhalation, skin contact, or eye contact with bentonite dust may cause mild irritation to the respiratory tract, skin, and eyes; ingestion may irritate the digestive tract.\nNon combustible mineral the product is an inorganic clay and does not burn; no fire or dust explosion hazard.\nSlip hazard spilled powder, or powder wetted with water, forms an extremely slippery film on floors and work surfaces.\nQuartz content the product contains 1–2% naturally occurring quartz; avoid prolonged inhalation of dust.'
            },
            {
                num: 3,
                title: 'Composition / Information on Ingredients',
                content: 'Chemical characterization: Naturally occurring mineral (mixture).\n\nMontmorillonite (content 85–90%) CAS No. 1318-93-0\nQuartz (content 1–2%) CAS No. 7631-86-9\nFunctional additives, trade secret (content 6–8%)'
            },
            {
                num: 4,
                title: 'First Aid Measures',
                content: 'Eye contact: Rinse immediately with plenty of clean water for at least 15 minutes, occasionally lifting the upper and lower eyelids. Remove contact lenses if present. Seek medical attention if irritation persists.\nSkin contact: Remove contaminated clothing and shoes. Wash the affected area thoroughly with soap and plenty of water. Launder clothing before reuse. Seek medical advice if irritation develops or persists.\nInhalation: Move the victim to fresh air immediately and keep at rest in a comfortable breathing position. If breathing is difficult, administer oxygen; if not breathing, give artificial respiration. Seek medical attention.\nIngestion: Do NOT induce vomiting. Rinse mouth thoroughly with water. If conscious and alert, drink 2–4 cupfuls of water or milk. Never give anything by mouth to an unconscious person. Seek medical attention.\n\nNote to physician: Treat symptomatically and supportively. No specific antidote is known.'
            },
            {
                num: 5,
                title: 'Fire Fighting Measures',
                content: 'Suitable extinguishing media: The product itself does not burn. Use extinguishing measures appropriate to local circumstances and the surrounding environment (water spray, dry chemical, carbon dioxide, or foam). Unsuitable media: Not applicable non combustible. Autoignition temperature: Not applicable. NFPA rating: Health 0 · Flammability 0 · Instability 0. Hazardous combustion products: None known. Protection of firefighters: Wear self-contained breathing apparatus (SCBA) in pressure-demand mode and full protective gear. Fight fire from upwind. Precaution: Product wetted during fire fighting forms a slippery slurry take care to avoid slip hazards.'
            },
            {
                num: 6,
                title: 'Accidental Release Measures',
                content: 'Isolate the spill area and keep unauthorized personnel away.\nVentilate the area and wear appropriate PPE (dust mask, gloves, goggles, protective clothing).\nAvoid generating dust dry sweeping is not recommended. Use a vacuum with a HEPA filter, or pre-dampen with water before sweeping.\nCollect the material into clean, sealed containers for recycling or disposal.\nPrevent the product from entering drains, sewers, surface water, or groundwater.\nClean the affected surface with water as appropriate caution: wet bentonite forms an extremely slippery film.\nDispose of contaminated material in accordance with local environmental regulations.'
            },
            {
                num: 7,
                title: 'Handling and Storage',
                content: 'Handling: Avoid dust formation at all times and provide adequate local exhaust ventilation where dust may be generated. Do not breathe dust; avoid contact with eyes, skin, and clothing. Handle gently using scoops, funnels, or spoons; avoid shaking or vigorous stirring that disperses dust. Prohibit eating, drinking, and smoking in handling areas; wash hands thoroughly with soap and water after handling. Keep containers tightly closed when not in use. Access limited to trained personnel only.\nStorage: Store in a cool, dry, clean, and well ventilated place away from direct sunlight, at 5–40 °C and relative humidity ≤ 80% (ideally < 50%). Bentonite is hygroscopic moisture ingress causes caking and loss of swelling performance. Keep containers tightly closed; after opening, reseal the inner PE bag immediately. No smoking in storage areas. Stack bags on pallets off the ground and do not stack excessively high. Do not store together with toxic, harmful, or odor emitting substances; keep away from food, feed, and drinking water.\nShelf life: 24 months from the date of manufacture under proper sealed storage conditions.'
            },
            {
                num: 8,
                title: 'Exposure Controls / Personal Protection',
                content: 'Eyes: Chemical safety goggles compliant with OSHA 29 CFR 1910.133 or EN 166; full goggles recommended in dusty environments\nSkin / hands: Impervious rubber gloves (nitrile or latex preferred); protective clothing or aprons; long sleeves\nRespiratory: NIOSH/MSHA-approved dust mask or respirator (EN 149 P1/P2 or equivalent) when dust levels are significant or ventilation is inadequate\nFootwear: Safety shoes\nFacilities: Emergency eyewash fountain and safety shower must be accessible in the immediate work area\n\nHygiene measures: Wash hands thoroughly with soap and water after handling and before eating or drinking. Launder contaminated clothing before reuse.'
            },
            {
                num: 9,
                title: 'Physical and Chemical Properties',
                content: 'Appearance: Greyish white free flowing powder\nOdor: Odorless\nTaste: Tasteless\nSolubility: Insoluble in water swells and forms a colloidal suspension; insoluble in ethanol, ether, acetone, and other organic solvents\nAutoignition temperature: Not applicable the product itself does not burn\nHygroscopicity: Hygroscopic cakes on moisture ingress; swelling performance decreases'
            },
            {
                num: 10,
                title: 'Stability and Reactivity',
                content: 'Chemical stability: Stable under recommended storage conditions. Incompatible materials: No known incompatible materials. Conditions to avoid: Dust formation and moisture ingress. Hazardous decomposition products: None known the product is thermally stable; in the event of fire see Section 5. Hazardous reactions: No known hazardous reactions under normal conditions.'
            },
            {
                num: 11,
                title: 'Toxicological Information',
                content: 'Acute toxicity: Non toxic; not classified. Irritation: Dust may cause mild irritation to the respiratory tract, skin, and eyes; ingestion may irritate the digestive tract. Medical treatment: Treat symptomatically and supportively; no specific antidote is known.'
            },
            {
                num: 12,
                title: 'Ecological Information',
                content: 'Biodegradability: Not applicable inorganic mineral; not biodegradable. Environmental precautions: Prevent the product from entering drains, sewers, surface water, or groundwater; spills must be contained and properly disposed of.'
            },
            {
                num: 13,
                title: 'Disposal Considerations',
                content: 'Dispose of the product and its container in accordance with local, regional, and national regulations.\nUncontaminated residual product may be landfilled where permitted.\nDo NOT discharge bentonite powder or slurry into drains, sewers, or waterways it swells and may block pipework.\nEmpty containers should be cleaned of residual powder before disposal or recycling.'
            },
            {
                num: 14,
                title: 'Transport Information',
                content: 'Not classified as a hazardous substance; not regulated as a dangerous good for transport.'
            },
            {
                num: 15,
                title: 'Regulatory Information',
                content: 'GHS / OSHA HCS: Not classified as a hazardous substance. NFPA 704: Health 0 · Flammability 0 · Instability 0.'
            },
            {
                num: 16,
                title: 'Other Information',
                content: 'Remark: The above safety precautions are compiled from industry standard SDS references for Bentonite. For formal export documentation, regulatory submission, or batch specific compliance, always refer to the official SDS issued by the manufacturer for the exact grade and batch parameters such as montmorillonite content, swelling index, and impurity profile may vary between grades and manufacturers.\nDisclaimer: The information contained in this Safety Data Sheet is provided for reference only and is based on the current state of knowledge. It describes the product with regard to safety requirements and does not guarantee any specific properties. In all cases, the actual conditions of use shall prevail. To the fullest extent permitted by applicable law, Brighter Star Drilling Fluids assumes no responsibility or liability for any results, losses, or damages arising from the use of, or reliance on, this document.'
            }
        ],
        salesContacts: [
            { name: 'Ms. Jannifer', phone: '+234-09136099052', email: 'info@pcenigeria.com' },
            { name: 'Mr. Tom', phone: '+234-07074126596', email: 'wanyang@pcenigeria.com' },
            { name: 'Mr. Frank', phone: '+234-07013732816', email: 'xuliangkui@pcenigeria.com' }
        ]
    },

    {
        id: 'brscmc',
        slug: 'brscmc',
        title: 'BRSCMC',
        subtitle: 'Carboxymethyl Cellulose',
        eyebrow: 'Fluid Loss Control & Viscosifier',
        description: 'High purity sodium carboxymethyl cellulose providing efficient filtration control and rheology enhancement in water based fluids.',
        image: '/pictures/product-image/brscmc-pack.png',
        galleryImages: [
            '/pictures/product-image/brscmc/brscmc.png',
            '/pictures/product-image/brscmc/brscmc-pellets.jpg',
            '/pictures/product-image/brscmc/brscmc-warehouse.jpg',
        ],
        quickFacts: ['High Filtration Control', 'Rapid Dissolution', 'Salt Tolerant', '25kg Multi-Wall Bags'],
        tdsUrl: '/resources/BRSCMC_Technical_Data_Sheet.pdf',
        sdsUrl: '/resources/BRSCMC_Safety_Data_Sheet.pdf',
        alsoKnownAs: 'Carboxymethylcellulose, CMC, Sodium CMC, Cellulose Gum.',
        overviewText: 'BRSCMC is an anionic cellulose ether with a macromolecular structure. It is an odorless, tasteless, and non toxic white or slightly yellowish free flowing powder that dissolves readily in water to form a high viscosity colloidal solution.',
        whatItDoes: 'In drilling fluids, BRSCMC acts as a viscosifier, flow control agent, and filtration reducer. It provides strong cuttings suspension capacity, cleans the borehole, stabilizes the wellbore, protects the drill bit, and forms a thin, low permeability filter cake.',
        supplyDetails: [
            { label: 'Packaging', value: '25 kg triple layer paper sacks with a PE inner liner, or according to customer requirements.' },
            { label: 'Storage', value: 'Store in a cool, dry, and well ventilated place away from direct sunlight and moisture.' },
            { label: 'Shelf Life', value: '24 months from the date of manufacture under proper sealed storage conditions.' }
        ],
        features: [
            'Low dosage with exceptionally high yield',
            'Good salt tolerance & antibacterial resistance',
            'Combines fluid loss reduction with viscosity boost',
            'Strong cuttings suspension & flow control capability',
            'Environmentally friendly, non-toxic & odorless',
            'Good fluidity convenient to mix & handle',
        ],
        applications: [
            { title: 'Non dispersed drilling fluids', desc: 'Carries cuttings, inhibits clay dispersion, stabilizes the wellbore, and increases drilling rate.', icon: '🌊' },
            { title: 'Dispersed drilling fluids', desc: 'Strong solids suspension; ideal for high density fluids; forms a thin, compact mud cake and reduces fluid loss.', icon: '🛡️' },
            { title: 'Calcium treated fluids', desc: 'Excellent calcium resistance; prevents excessive clay flocculation and maintains stable rheology.', icon: '⚖️' },
            { title: 'Salt water & saturated brine fluids', desc: 'Low salt sensitivity; fast rheology adjustment at low dosage; minimizes damage to the pay zone.', icon: '⚙️' },
            { title: 'Potassium based fluids', desc: 'Low sensitivity to potassium, calcium, and magnesium salts; efficiently adjusts rheology and cleans cuttings.', icon: '💪' },
            { title: 'Polymer & low solids fluids', desc: 'Good polymer compatibility; maintains low solids and low clay dispersion; effective filtration control.', icon: '🔬' },
            { title: 'Environmentally sensitive operations', desc: 'Non toxic, odorless, and biodegradable; low fluid maintenance cost; harmless to surrounding flora.', icon: '🌱' },
            { title: 'Completion & packer fluids', desc: 'Improves slurry fluidity with low filtration loss; protects wellbore in clean brine packer systems.', icon: '🛢️' },
            { title: 'Fracturing fluids', desc: 'Builds viscosity quickly, carries proppant into fractures, and reduces fluid loss; residue free.', icon: '⚡' },
            { title: 'Granulated & instant grades', desc: 'Dust free and fast dissolving; rapid dispersion even under rugged field conditions.', icon: '💨' },
        ],
        specTables: [
            {
                title: 'Physical & Chemical Specs',
                headers: ['Property', 'Specification Standard', 'Testing Result / Value'],
                rows: [
                    ['Appearance', 'Visual Inspection', 'White / Yellowish Powder'],
                    ['Purity (CMC Content)', 'GB/T 5005 / API 13A', '≥ 90.0 %'],
                    ['Degree of Substitution (D.S.)', 'ISO 13500', '0.80 0.95'],
                    ['Viscosity (1% Solution, 25 °C)', 'Brookfield LV, 30 rpm', '300 1200 mPa·s'],
                    ['pH Value (1% Solution)', 'pH Meter', '6.5 8.5'],
                    ['Moisture Content', '105 °C Drying Oven', '≤ 10.0 %'],
                ]
            }
        ],
        sdsSections: [
            { num: 1, title: 'Identification', content: 'Product identifier: BRSCMC®. Chemical name: Sodium Carboxymethyl Cellulose (CMC), oil drilling grade. Recommended use: Viscosifier, flow control agent, and filtration reducer for drilling fluids and completion fluids. Manufacturer/Supplier: Brighter Star Drilling Fluids / PCE Nigeria, www.pcenigeria.com.' },
            { num: 2, title: 'Hazards Identification', content: 'Not classified as a hazardous substance under GHS/OSHA Hazard Communication Standards. Practical precautions: Avoid dust inhalation or eye contact (may cause mild irritation). Fine powder dispersed in air may form a combustible dust cloud near ignition sources (autoignition ≈ 370 °C).' },
            { num: 3, title: 'Composition / Information on Ingredients', content: 'Chemical characterization: Substance. Component: Sodium carboxymethyl cellulose (Cellulose Gum), CAS No. 9004-32-4, Content: > 90%.' },
            { num: 4, title: 'First Aid Measures', content: 'Eye contact: Rinse with clean water for 15 minutes; seek medical aid if irritation persists. Skin contact: Wash area thoroughly with soap and water. Inhalation: Move victim to fresh air. Ingestion: Do NOT induce vomiting; rinse mouth with water.' },
            { num: 5, title: 'Fire Fighting Measures', content: 'Extinguishing media: Water spray, dry chemical, carbon dioxide (CO₂), or foam. Autoignition temperature: ≈ 370 °C (dust cloud). NFPA 704 Rating: Health 0, Flammability 1, Instability 0. Protection of firefighters: Wear SCBA and full protective clothing.' },
            { num: 6, title: 'Accidental Release Measures', content: 'Isolate spill area and wear appropriate PPE. Avoid dry sweeping that generates dust; use a HEPA-filtered vacuum or pre-dampen powder with water before collecting into sealed containers. Prevent entry into sewers or waterways.' },
            { num: 7, title: 'Handling and Storage', content: 'Handling: Avoid dust formation and provide local exhaust ventilation. Ground and bond equipment during transfer. Storage: Store in a cool, dry, well ventilated area at 10 30 °C (humidity ≤ 80%). Product is hygroscopic reseal PE inner bag immediately after opening. Shelf life: 24 months.' },
            { num: 8, title: 'Exposure Controls / Personal Protection', content: 'PPE Recommendations Eyes: Chemical safety goggles (EN 166 / OSHA). Hands/Skin: Impervious rubber or nitrile gloves, long sleeves. Respiratory: NIOSH/MSHA approved P1/P2 dust mask in dusty environments. Eyewash station should be accessible.' },
            { num: 9, title: 'Physical and Chemical Properties', content: 'Appearance: White or slightly yellowish free flowing powder or granules. Odor/Taste: Odorless / Tasteless. Solubility: Readily soluble in water (colloidal suspension); insoluble in organic solvents. Autoignition: ≈ 370 °C.' },
            { num: 10, title: 'Stability and Reactivity', content: 'Chemical stability: Stable under recommended storage conditions. Incompatible materials: Strong oxidizing agents, strong acids, and strong alkalis. Hazardous decomposition: Carbon monoxide (CO) and CO₂ on thermal decomposition.' },
            { num: 11, title: 'Toxicological Information', content: 'Acute toxicity: Non toxic; not classified under GHS. Irritation: Airborne dust may cause mild mechanical irritation to eyes and respiratory tract.' },
            { num: 12, title: 'Ecological Information', content: 'Biodegradability: Biodegradable organic polymer. Environmental precautions: Do not discharge concentrated powder or slurry directly into public waterways or drains.' },
            { num: 13, title: 'Disposal Considerations', content: 'Dispose of product and packaging in accordance with local environmental regulations. Uncontaminated product may be landfilled where permitted.' },
            { num: 14, title: 'Transport Information', content: 'Not classified as a dangerous good for transport (DOT / IMO / IATA / ADR non regulated).' },
            { num: 15, title: 'Regulatory Information', content: 'GHS / OSHA HCS Status: Non hazardous. NFPA Rating: Health 0 · Flammability 1 · Instability 0.' },
            { num: 16, title: 'Other Information', content: 'Disclaimer: The information contained in this Safety Data Sheet is based on current technical knowledge for standard oil drilling grade Sodium Carboxymethyl Cellulose. Always consult batch specific certificates of analysis for official compliance.' },
        ],
        sdsTitle: 'Full Safety Data Sheet (GHS 16-Section)',
        safetyAtAGlance: {
            ghsHazard: 'Not classified as a hazardous substance under GHS/OSHA Hazard Communication Standards. Minor hazards: airborne dust may cause mild respiratory or eye irritation. Autoignition temperature ≈ 370 °C.',
            ratingSystemName: 'NFPA 704 Rating',
            ratings: [
                { label: 'Health', value: '0', color: 'bg-blue-600', textColor: 'text-white' },
                { label: 'Flammability', value: '1', color: 'bg-amber-500', textColor: 'text-black' },
                { label: 'Instability', value: '0', color: 'bg-emerald-600', textColor: 'text-white' }
            ]
        },
        salesContacts: [
            { name: 'Ms. Jannifer', phone: '+234-09136099052', email: 'info@pcenigeria.com' },
            { name: 'Mr. Tom', phone: '+234-07074126596', email: 'wanyang@pcenigeria.com' },
            { name: 'Mr. Frank', phone: '+234-07013732816', email: 'xuliangkui@pcenigeria.com' },
        ]
    },

    {
        id: 'brsmmh',
        slug: 'brsmmh',
        title: 'BRSMMH',
        subtitle: 'Positive Electric Adhesive Dry Powder',
        eyebrow: 'HDD Drilling Fluid Additive',
        description: 'Positively charged mixed layered metal hydroxide (MMH) crystal colloid for drilling fluid stabilization',
        image: '/pictures/product-image/brsmmh-pack.png',
        quickFacts: ['Zeta Potential ≥ 35 mV', 'Yield Stress +300%', 'Purely Inorganic', 'Not Regulated as Dangerous Goods'],
        tdsUrl: '/resources/BRSMMH_Product_Data_Sheet.pdf',
        sdsUrl: '/resources/BRSMMH_Safety_Data_Sheet.pdf',
        heroImage: '/pictures/product-image/brsmmh-pack.png',
        galleryImages: [
            '/pictures/product-image/brsmmh/brsmmh-pack.png',
            '/pictures/product-image/brsmmh/brsmmh.png',
            '/pictures/product-image/brsmmh/packaging.png'
        ],
        // technicalImages: [
        //     '/pictures/product-image/brsmmh/brsmmh-pellets.png',
        //     '/pictures/product-image/brsmmh/packaging.png'
        // ],
        overviewText: 'BRSMMH is a positive electric adhesive dry powder a positively charged mixed layered metal hydroxide (MMH) crystal colloid developed by Brighter Star Drilling Fluids together with partner research institutes through extensive laboratory testing and field practice, formulated specifically for HDD applications. The positively charged MMH crystals adsorb onto negatively charged clay and cuttings surfaces, forming a strong composite network structure that delivers unique shear thinning rheology, high yield stress and exceptional suspended cuttings carrying capacity. BRSMMH functions both as a drilling fluid stabilizer and a wellbore stabilizer, and is especially suited to complex formations, hard rock and horizontal wells.',
        whatItDoes: 'BRSMMH is best at increasing the dynamic shear force of drilling fluid, improving the dynamic plastic ratio, and greatly enhancing the carrying capacity. It is particularly suitable for rock formations that are prone to producing large rock debris, which can maximize the carrying of drilling debris, reduce secondary cutting, lower drilling tool wear, and greatly improve drilling efficiency.',
        executiveStandard: 'Q/PSL038-2003',
        mainFunctions: [
            'Increases structural viscosity and yield stress of the drilling fluid',
            'Stabilizes the wellbore and inhibits shale hydration and swelling',
            'Provides exceptionally strong suspended sand / rock cuttings carrying capacity',
            'Delivers shear thinning flow behavior for smooth, efficient circulation',
            'Helps increase drilling rate and reduce overall drilling costs'
        ],
        features: [
            'Purely inorganic, environmentally friendly',
            'Zeta potential ≥ 35 mV, strong clay adhesion',
            'Yield stress improvement rate ≥ 300%',
            'Proven in rock formations and horizontal wells'
        ],
        howItsUsed: {
            suitability: 'BRSMMH is suitable for freshwater based drilling systems in HDD, horizontal wells and complex formations.',
            dosageTable: [
                { use: 'As viscosifier / stabilizer', dosage: '0.5% – 0.8%' },
                { use: 'As shale inhibitor', dosage: '0.5% – 1.0%' }
            ],
            mixingSteps: [
                'Prepare fresh water and check its quality; an untreated bentonite base slurry is preferred. Avoid adding anionic additives (e.g. polyphosphates, lignosulfonates) before BRSMMH, as they weaken the positive charge network.',
                'Pre mix BRSMMH with a small amount of clean water into a uniform slurry.',
                'Add the slurry slowly through the hopper into the circulating tank under continuous agitation.',
                'Circulate fully for 1 2 cycles, then test the rheological parameters (yield stress, gel strength, zeta potential) and fine tune the dosage accordingly.'
            ]
        },
        supplyDetails: [
            { label: 'Packaging', value: 'Triple layer paper sack with PE inner liner (25 kg per bag). Customized packaging on request.' },
            { label: 'Storage', value: 'Store in a cool, dry, clean and well ventilated place at 5-40 °C (do not exceed 40 °C) and relative humidity ≤ 80%. Keep containers tightly closed to prevent moisture ingress; protect from direct sunlight, heat sources and moisture. Do NOT store together with toxic, harmful or polluting substances, or with strong oxidizing agents.' },
            { label: 'Shelf Life', value: '12 months from the date of manufacture under proper sealed storage conditions.' }
        ],
        specTables: [
            {
                title: 'Product Specification',
                headers: ['Item', 'Specification'],
                rows: [
                    ['Appearance', 'White or light brown free flowing powder'],
                    ['Loss on Drying', '≤ 15.0%'],
                    ['Screen Residue (40 mesh)', '≤ 7.0%'],
                    ['Potential (Zeta)', '≥ 35.0 mV'],
                    ['Acid Solubility', '≥ 85.0%'],
                    ['Yield Stress Improvement Rate', '≥ 300.0%']
                ]
            },
            {
                title: 'Physical Properties',
                headers: ['Property', 'Typical Value'],
                rows: [
                    ['Product Type', 'Positively charged mixed-layered metal hydroxide crystal colloid'],
                    ['Physical Form', 'Free flowing dry powder'],
                    ['Colour', 'White to light brown'],
                    ['Charge Character', 'Positively charged (cationic)'],
                    ['Transport Classification', 'Not regulated as dangerous goods']
                ]
            }
        ],
        safetyAtAGlance: {
            hazardClass: 'Not classified as a hazardous chemical according to GB standards. In practice, the hazards are dust related: dust formation may create a potential dust explosion hazard, and the powder may cause mild irritation to eyes, skin, and the respiratory tract.',
            ppe: [
                { type: 'Respiratory', recommendation: 'MSHA-approved respirator or dust mask when handling the powder' },
                { type: 'Hands', recommendation: 'Impervious rubber gloves' },
                { type: 'Eyes', recommendation: 'Tightly fitting safety goggles with side shields (EN 166 / NIOSH compliant)' },
                { type: 'Body', recommendation: 'Long sleeve clothing; a Tyvek full body suit is recommended for heavy exposure' },
                { type: 'Ventilation', recommendation: 'Adequate local exhaust ventilation to prevent dust formation' }
            ]
        },
        sdsSections: [
            {
                num: 1,
                title: 'Identification',
                content: 'Product identifier: BRSMMH. Product type: Positive Electric Adhesive Dry Powder (positively charged mixed-layered metal hydroxide crystal colloid). Executive standard: Q/PSL038-2003. Recommended use: Drilling fluid stabilizer and wellbore stabilizer, especially for complex formations and horizontal wells. Manufacturer/Supplier: Brighter Star Drilling Fluids, www.pcenigeria.com.'
            },
            {
                num: 2,
                title: 'Hazards Identification',
                content: 'Hazard classification: Not classified as a hazardous chemical according to GB standards.\n- Dust formation may create a potential dust explosion hazard.\n- May cause mild irritation to eyes, skin, and respiratory tract.'
            },
            {
                num: 3,
                title: 'Composition / Information on Ingredients',
                content: 'Chemical characterization: Positively charged mixed-layered metal hydroxide (MMH) crystal colloid, supplied as a dry powder.'
            },
            {
                num: 4,
                title: 'First Aid Measures',
                content: 'Eye contact: Flush immediately with plenty of clean water for at least 15 minutes; seek medical attention if irritation persists.\nSkin contact: Wash the affected area with mild soap and water; launder contaminated clothing before reuse.\nInhalation: Move to fresh air; administer oxygen if breathing is difficult; seek medical attention.\nIngestion: Rinse mouth and drink water; do NOT induce vomiting; seek immediate medical attention.'
            },
            {
                num: 5,
                title: 'Fire Fighting Measures',
                content: 'Fire/explosion hazard: Fine dust dispersed in air may form an explosive dust air mixture in the presence of an ignition source. Suitable extinguishing media: Water spray, dry chemical, or carbon dioxide (CO₂). Hazardous combustion products: Thermal decomposition may yield carbon monoxide (CO), carbon dioxide (CO₂), and other hazardous gases. Precautions: Use non-sparking tools and prevent electrostatic discharge during fire response.'
            },
            {
                num: 6,
                title: 'Accidental Release Measures',
                content: '- Ensure adequate ventilation in the spill area.\n- Mechanically pick up the spilled material; avoid dry sweeping to minimize dust generation.\n- Prevent entry into sewers, surface water, or groundwater.\n- Dispose of contaminated material in accordance with local environmental regulations.'
            },
            {
                num: 7,
                title: 'Handling and Storage',
                content: 'Handling: Avoid dust formation; use non-sparking tools and prevent electrostatic discharge. Provide adequate local exhaust ventilation. Wear appropriate personal protective equipment (see Section 8).\nStorage: Store in a cool, dry, clean, and well-ventilated place at 5-40 °C (do not exceed 40 °C) and relative humidity ≤ 80%. Keep containers tightly closed to prevent moisture ingress; protect from direct sunlight, heat sources, and moisture. Do NOT store together with toxic, harmful, or polluting substances, or with strong oxidants.\nShelf life: 12 months from the date of manufacture under proper sealed storage conditions.'
            },
            {
                num: 8,
                title: 'Exposure Controls / Personal Protection',
                content: 'Respiratory: MSHA-approved respirator or dust mask when handling the powder.\nHands: Impervious rubber gloves.\nEyes: Tightly fitting safety goggles with side shields (EN 166 / NIOSH compliant).\nBody: Long sleeve clothing; a Tyvek full body suit is recommended for heavy exposure.\nVentilation: Adequate local exhaust ventilation to prevent dust formation.'
            },
            {
                num: 9,
                title: 'Physical and Chemical Properties',
                content: 'Appearance: White or light brown free flowing powder\nLoss on drying: ≤ 15.0%\nScreen residue (40 mesh): ≤ 7.0%\nPotential: ≥ 35.0 mV\nAcid solubility: ≥ 85.0%\nYield stress improvement rate: ≥ 300.0%'
            },
            {
                num: 10,
                title: 'Stability and Reactivity',
                content: 'Chemical stability: Stable under recommended storage conditions. Conditions to avoid: Dust formation, electrostatic discharge, ignition sources, heat, and moisture. Incompatible materials: Strong oxidants; toxic, harmful, or polluting substances (storage segregation). Hazardous decomposition products: Carbon monoxide (CO), carbon dioxide (CO₂), and other hazardous gases from thermal decomposition.'
            },
            {
                num: 11,
                title: 'Toxicological Information',
                content: 'Acute toxicity: Not classified as a hazardous chemical according to GB standards. Irritation: May cause mild irritation to eyes, skin, and respiratory tract.'
            },
            {
                num: 12,
                title: 'Ecological Information',
                content: 'Environmental precautions: Prevent the product from entering sewers, surface water, or groundwater.'
            },
            {
                num: 13,
                title: 'Disposal Considerations',
                content: '- Dispose of the product and contaminated material in accordance with local, regional, and national environmental regulations.\n- Avoid dust generation during disposal operations.'
            },
            {
                num: 14,
                title: 'Transport Information',
                content: 'Not regulated as dangerous goods for land, sea, or air transport. Protect from rain, moisture, and package damage during transit; use moisture-proof container liners for overseas shipment.'
            },
            {
                num: 15,
                title: 'Regulatory Information',
                content: 'Classification: Not classified as a hazardous chemical according to GB standards. Executive standard: Q/PSL038-2003.'
            },
            {
                num: 16,
                title: 'Other Information',
                content: 'Disclaimer: All data, recommendations, and information contained in this document are provided for reference only. They are derived from laboratory testing and field experience obtained under specific conditions, and actual product performance may vary with formation characteristics, water quality, equipment, and operating practices. Users are advised to verify the suitability of this product through on-site trials and to adjust the dosage according to actual working conditions. In all cases, the actual conditions and results of use shall prevail. To the fullest extent permitted by applicable law, Brighter Star Drilling Fluids makes no warranties, express or implied, regarding the information herein, and assumes no responsibility or liability for any results, losses, or damages arising from the use of, or reliance on, this document.'
            }
        ],
        salesContacts: [
            { name: 'Ms. Jannifer', phone: '+234-09136099052', email: 'info@pcenigeria.com' },
            { name: 'Mr. Tom', phone: '+234-07074126596', email: 'wanyang@pcenigeria.com' },
            { name: 'Mr. Frank', phone: '+234-07013732816', email: 'xuliangkui@pcenigeria.com' }
        ]
    },

    {
        id: 'brsvr',
        slug: 'brsvr',
        title: 'BRSVR',
        subtitle: 'Clay Viscosity Reducer',
        eyebrow: 'HDD Drilling Fluid Additive',
        description: 'Clay Stripper and Clay Dispersing Solution for Drilling Fluids',
        image: '/pictures/product-image/brsvr-pack.png',
        galleryImages: [
            '/pictures/product-image/brsvr-pack.png',
            '/pictures/product-image/brsvr/brsvr.png',
            '/pictures/product-image/brsvr/brsvr-liquid.png',
            '/pictures/product-image/brsvr/brsvr-store.jpg',
        ],
        quickFacts: ['Cuts Torque Up To 90%', 'Liquid Concentrate', 'Non Flammable', 'Not a Regulated Dangerous Good'],
        tdsUrl: '/resources/BRSVR_Technical_Data_Sheet.pdf',
        sdsUrl: '/resources/BRSVR_Safety_Data_Sheet.pdf',
        overviewText: 'BRSVR is a liquid drilling mud additive specially formulated as an engineering mud aid for clayey and highly cohesive clay formations. It is suitable for directional drilling, pipe jacking, shield tunneling, and general drilling operations.',
        whatItDoes: 'Disperses clay and prevents clay from sticking to and blinding the drill bit. Rapidly reduces construction torque in clay formations. Reduces the internal forces of the clay system, improves drilling efficiency, and stabilizes the borehole. Prevents bit balling and pipe sticking.',
        howItsUsed: {
            application: 'Add this product directly into clean water, stir until fully dispersed, and then inject the solution into the clay formation.',
            dosage: 'Add 0.5–2.0 kg of BRSVR per cubic meter of clean water. Use a higher dosage at the beginning of the operation; the dosage may be reduced appropriately once the torque has decreased.',
            precaution: 'If this product accidentally comes into contact with skin or eyes during use, immediately rinse the affected area with plenty of clean water.'
        },
        supplyDetails: [
            { label: 'Packaging', value: '25 kg per plastic drum.' },
            { label: 'Storage', value: 'Store in a cool, well ventilated, and dry place. Avoid prolonged exposure to direct sunlight.' },
            { label: 'Transport', value: 'Not regulated as a dangerous good for transport. Handle packages gently to prevent damage to the containers.' }
        ],
        specTables: [
            {
                title: 'Composition',
                headers: ['Component', 'Content (% by weight)'],
                rows: [
                    ['Styrene acrylic emulsion', '44.16'],
                    ['VAE emulsion', '27.69'],
                    ['Water', '14.05'],
                    ['Sodium persulfate', '5.30'],
                    ['Methyl methacrylate', '4.10'],
                    ['Film forming aid (coalescent)', '2.00'],
                    ['Composite thickener', '1.50'],
                    ['Composite dispersant', '0.30'],
                    ['Composite defoamer', '0.30'],
                    ['Emulsifier', '0.20']
                ]
            },
            {
                title: 'Physical & Chemical Properties',
                headers: ['Property', 'Value'],
                rows: [
                    ['Appearance', 'Viscous liquid'],
                    ['Odor', 'Odorless'],
                    ['Molecular formula', 'Unknown (mixture)'],
                    ['pH', 'Alkaline'],
                    ['Relative density', '1.2–1.4 g/cm³'],
                    ['Upper explosion limit', 'None'],
                    ['Lower explosion limit', 'None'],
                    ['Solubility', 'Readily soluble in water']
                ]
            }
        ],
        safetyAtAGlance: {
            ghsHazard: 'Not classified as a hazardous substance or dangerous good. Not flammable; not explosive. Essentially non hazardous to humans on skin contact, though it can cause some irritation to skin and eyes avoid ingestion and eye contact. Non toxic to aquatic organisms, but may cause long term adverse effects to water bodies if discharged directly.',
            ratingSystemName: '',
            ratings: []
        },
        sdsSections: [
            { num: 1, title: 'Identification', content: 'Product identifier: BRSVR. Trade name: Clay Viscosity Reducer. Recommended use: Viscosity reducing additive for clay based drilling fluids. Manufacturer/Supplier: Brighter Star Drilling Fluids, www.pcenigeria.com.' },
            { num: 2, title: 'Hazards Identification', content: 'Hazard classification: Not classified as a hazardous substance or dangerous good. Routes of entry: May be absorbed into the body by inhalation, ingestion, and skin contact. Health hazards: Contact with this compound is essentially non hazardous to humans. Environmental hazards: Non toxic to aquatic organisms; may cause long term adverse effects to water bodies. Fire/explosion hazard: Not flammable; not explosive.' },
            { num: 3, title: 'Composition / Information on Ingredients', content: 'Chemical characterization: Mixture. Composition: VAE emulsion (27.69%), Styrene acrylic emulsion (44.16%), Methyl methacrylate (4.10%), Composite dispersant (0.30%), Emulsifier (0.20%), Film forming aid (2.00%), Composite defoamer (0.30%), Sodium persulfate (5.30%), Composite thickener (1.50%), Water (14.05%).' },
            { num: 4, title: 'First Aid Measures', content: 'Skin contact: Not hazardous to humans on skin contact. Wash the affected area with clean water and soap. Ingestion: Do NOT drink fat containing beverages such as milk. Seek medical attention immediately. Eye contact: Rinse immediately with plenty of clean water for at least 20–30 minutes. Seek medical attention immediately.' },
            { num: 5, title: 'Fire Fighting Measures', content: 'Hazard characteristics: Not easily ignited by open flame; does not release smoke when heated to its decomposition temperature. Suitable extinguishing media: Class B extinguishing agents (e.g., dry chemical powder, carbon dioxide). Firefighting procedures: Firefighters should wear suitable protective clothing and a fully equipped SCBA.' },
            { num: 6, title: 'Accidental Release Measures', content: 'Emergency procedures: Recover the spilled material. Personal precautions: Emergency responders should wear protective clothing, safety goggles, and a protective mask.' },
            { num: 7, title: 'Handling and Storage', content: 'Handling precautions: Operators must be specially trained and must strictly follow the operating procedures. Wear chemical safety goggles, a protective mask, and dust proof clothing. Load and unload gently to prevent damage to the packaging containers. Storage precautions: Store in a cool, well ventilated, and dry place. Avoid prolonged exposure to direct sunlight.' },
            { num: 8, title: 'Exposure Controls / Personal Protection', content: 'Engineering/process controls: Wash hands and shower after contact with this material or after work. Change wet or contaminated clothing promptly. Do not take work clothing out of the workplace. Hand protection: Wash hands immediately after handling this material. Eye protection: Avoid contact with eyes. Ingestion: This product must not be ingested.' },
            { num: 9, title: 'Physical and Chemical Properties', content: 'Appearance: Viscous liquid. Odor: Odorless. Molecular formula: Unknown. pH: Alkaline. Relative density: 1.2–1.4 g/cm³. Upper explosion limit: None. Lower explosion limit: None. Solubility: Readily soluble in water.' },
            { num: 10, title: 'Stability and Reactivity', content: 'Reactivity: Not reactive. Chemical stability: This compound is stable under normal laboratory conditions. Hazardous polymerization: Will not occur.' },
            { num: 11, title: 'Toxicological Information', content: 'Acute toxicity: None. Carcinogenicity: None. Irritation: Causes some irritation to skin and eyes.' },
            { num: 12, title: 'Ecological Information', content: 'Ecotoxicity: Generally not harmful to the environment; avoid direct discharge into rivers. Bioaccumulative potential: Not determined. Biodegradability: Not determined. Abiotic degradation: Not determined.' },
            { num: 13, title: 'Disposal Considerations', content: 'Waste disposal methods: Do not dispose of residues by landfill or incineration. Consult the environmental protection authorities to determine the appropriate disposal method. Contaminated packaging: Dispose of packaging in accordance with local regulations.' },
            { num: 14, title: 'Transport Information', content: 'This product is not listed in the Regulations on the Transport of Dangerous Goods and is not regulated as a dangerous good for transport.' },
            { num: 15, title: 'Regulatory Information', content: 'The Regulations on the Safety Management of Hazardous Chemicals establish corresponding provisions for the safe production, use, storage, transportation, loading, and unloading of hazardous chemicals.' },
            { num: 16, title: 'Other Information', content: 'Disclaimer: The information contained in this Safety Data Sheet is based on the current state of knowledge and is provided in good faith. It describes the product with regard to safety requirements and does not guarantee any specific properties. The user is responsible for ensuring that the product is used, handled, stored, and disposed of safely and in compliance with all applicable local laws and regulations.' },
        ],
        salesContacts: [
            { name: 'Ms. Jannifer', phone: '+234-09136099052', email: 'info@pcenigeria.com' },
            { name: 'Mr. Tom', phone: '+234-07074126596', email: 'wanyang@pcenigeria.com' },
            { name: 'Mr. Frank', phone: '+234-07013732816', email: 'xuliangkui@pcenigeria.com' }
        ]
    },

    {
        id: 'brsxtg',
        slug: 'brsxtg',
        title: 'BRSXTG',
        subtitle: 'Xanthan Gum',
        eyebrow: 'HDD Drilling Fluid Additive',
        description: 'High Molecular Weight Polysaccharide Viscosifier and Suspending Agent for Water Based Drilling Systems',
        image: '/pictures/product-image/brsxtg-pack.png',
        heroImage: '/pictures/product-image/brsxtg-pack.png',
        galleryImages: [
            '/pictures/product-image/xtg/xtg-packaging.jpg',
            '/pictures/product-image/xtg/brsxtg.png',
            '/pictures/product-image/xtg/xtg-store.jpg'
        ],
        tdsUrl: '/resources/BRSXTG_Technical_Data_Sheet.pdf',
        sdsUrl: '/resources/BRSXTG_Safety_Data_Sheet.pdf',
        quickFacts: ['Soluble in Fresh, Brine & Sea Water', 'Effective at Low Concentrations', 'Stable pH 5.5–8.5', 'High Salinity Formations'],
        overviewText: 'BRSXTG is a high molecular weight polysaccharide produced by controlled fermentation of Xanthomonas campestris. It is an effective viscosifier and suspending agent for all freshwater and brine based drilling systems. It is suitable for slurry TBM, deep foundation, and HDD projects, delivering strong shear thinning rheology for optimal hole cleaning and cuttings suspension.\n\nThe biggest function of BRSXTG is to ensure the stability of drilling fluids used in high salinity areas, especially in marine formations.',
        mainFunctions: [
            'Builds viscosity and gel strength in water based systems',
            'Enhances cuttings carrying and suspending capacity',
            'Provides shear thinning rheology for smooth circulation',
            'Facilitates efficient solids separation at the surface'
        ],
        features: [
            'Cream colored, free flowing powder with a flour like odor',
            'Highly pseudoplastic effective at low concentrations',
            'Soluble in fresh water, brine, and sea water',
            'Stable over a broad pH range (pH 5.5–8.5, 1% solution)'
        ],
        howItsUsed: {
            dosage: '2–5 kg per cubic meter of water, adjusted to the target viscosity.',
            mixingSteps: [
                'Check the water quality (pH and EC) and pretreat if needed.',
                'Add the calculated amount of xanthan gum slowly into the mixer.',
                'Mix the slurry intensely for at least 30 minutes.',
                'Circulate and hydrate the slurry to achieve optimum rheology.'
            ],
            precaution: 'Add the xanthan gum slowly through a venturi hopper and mix with a high shear mixer for at least 30 minutes. Optimum rheology develops after adequate hydration time.'
        },
        supplyDetails: [
            { label: 'Small Bags', value: '25 kg per bag' },
            { label: 'Jumbo Bags', value: 'Available on request' }
        ],
        storageInfo: 'Keep the product in its original, tightly closed packaging in a cool, dry, and well ventilated place; protect from moisture, rain, and direct sunlight. Inadequate storage may result in a loss of rheological properties.',
        specTables: [
            {
                title: 'Technical Specifications',
                headers: ['Property', 'Typical Value'],
                rows: [
                    ['Appearance (sensory test)', 'Off white or light yellow free flowing powder or granules'],
                    ['Shearing ratio', '7.6'],
                    ['Ash content, %', '< 13.0'],
                    ['Pyruvic acid, %', '> 5.0']
                ]
            }
        ],
        safetyAtAGlance: {
            cautionStrip: 'Unlike the other Brighter Star products, BRSXTG will burn (flash point > 93 °C / 200 °F) and, like most dry organic powders, can present a real dust explosion hazard when dispersed in air near an ignition source.',
            ghsHazard: 'Caution may cause skin, eye, and respiratory tract irritation. Not classified as dangerous for transport (TDG/IMO/IATA all non dangerous or not regulated).',
            ratingSystemName: 'NFPA / HMIS Ratings',
            ratings: [
                { label: 'Health', value: 'Slight', color: 'bg-blue-100', textColor: 'text-blue-800' },
                { label: 'Flammability', value: 'Slight', color: 'bg-red-100', textColor: 'text-red-800' },
                { label: 'Instability / Reactivity', value: 'Minimal', color: 'bg-yellow-100', textColor: 'text-yellow-800' }
            ],
            ppe: [
                { type: 'Eyes', recommendation: 'ANSI Z87 approved eye protection; minimum safety glasses with side shields' },
                { type: 'Skin / hands', recommendation: 'Gloves and suitable long sleeved clothing' },
                { type: 'Respiratory', recommendation: 'NIOSH/MSHA approved air purifying respirator (half mask or full face) with dust/mist/fume cartridges' },
                { type: 'Handling', recommendation: 'Dust control and material transport equipment should be explosion relief vented or bonded/grounded' }
            ]
        },
        sdsTitle: 'Safety Data Sheet BRSXTG',
        sdsSections: [
            {
                num: 1,
                title: 'Fire Fighting Measures',
                content: 'Flash point: > 93 °C (200 °F), closed cup. Flammability class: WILL BURN. Flammability limits: No data (lower/upper). Extinguishing media: Small fires carbon dioxide or dry chemical; large fires water or aqueous foam. Special procedures: Firefighters should wear NIOSH/MSHA approved self contained breathing apparatus and full protective clothing. Unusual fire and explosion hazards: The product will burn under fire conditions and, like most dry organic powders, may present a dust explosion hazard when mixed with air in critical proportions near an ignition source. Hazardous decomposition products (under fire conditions): Oxides of carbon.\n\nDust explosivity data:',
                table: {
                    headers: ['Item', 'Value'],
                    rows: [
                        ['Explosibility index', '0.1 – 1 (type of explosion rated MODERATE)'],
                        ['Cloud ignition temperature', '590 °C (1094 °F)'],
                        ['Minimum cloud ignition energy', '> 10 mJ'],
                        ['Maximum explosion pressure', '6.2 bar'],
                        ['Maximum rate of pressure rise', '59 bar/s'],
                        ['Minimum explosion concentration', '0.03 oz/ft³'],
                        ['Minimum ignition energy of dust cloud in air', '> 999 mJ'],
                        ['Minimum autoignition temperature of dust clouds', '400 °C (752 °F)'],
                        ['Hot surface ignition temperature of dust layers', '300 °C (572 °F)'],
                        ['Ignition sensitivity / explosion severity / layer ignition temperature', 'No data']
                    ]
                }
            },
            {
                num: 2,
                title: 'Hazards Identification',
                content: 'Emergency overview: Cream colored, free flowing powder with a flour like odor. Warning statement: Caution! May cause skin, eye, and respiratory tract irritation.\nAcute eye: Slightly irritating. Dust may cause redness and irritation.\nAcute skin: Skin absorption not likely. May cause slight transient irritation.\nAcute inhalation: Dust may cause upper respiratory tract irritation.\nAcute ingestion: Non toxic.\nChronic effects: This product does not contain any ingredient designated by IARC, NTP, ACGIH, or OSHA as a probable or suspected human carcinogen.'
            },
            {
                num: 3,
                title: 'Composition / Information on Ingredients',
                content: 'Chemical characterization: Substance.\n\nComponent: Xanthan gum\nCAS No.: 11138-66-2'
            },
            {
                num: 4,
                title: 'First Aid Measures',
                content: 'Eye contact: Hold eyelids open and flush with a steady, gentle stream of water for at least 15 minutes. Seek medical attention if irritation develops or persists, or if visual changes occur.\nSkin contact: Wash with plenty of soap and water. Seek medical attention if irritation develops or persists.\nInhalation: Remove the victim from the immediate source of exposure and assure that the victim is breathing. If breathing is difficult, administer oxygen if available; if not breathing, administer CPR. Seek medical attention.\nIngestion: Ingestion of the dry powder may cause the material to swell in the throat, possibly causing blockage and choking. If conscious and alert, give 1–2 glasses of water to prevent esophageal obstruction. Never give anything by mouth to an unconscious person. Seek medical attention. Do not leave the victim unattended.\n\nConditions aggravated by exposure: Inhalation of the product may aggravate existing chronic respiratory problems such as asthma, emphysema, or bronchitis. Note to physician: Treat symptomatically; no specific antidote is available.'
            },
            {
                num: 5,
                title: 'Identification',
                content: 'Product identifier: BRSXTG. Chemical name/synonym: Xanthan gum. Recommended use: Viscosifier and suspending agent for freshwater and brine based drilling systems (slurry TBM, deep foundations, HDD). Manufacturer/Supplier: Brighter Star Drilling Fluids, www.pcenigeria.com.'
            },

            {
                num: 6,
                title: 'Accidental Release Measures',
                content: 'CAUTION: Spilled material may become slippery when wet. Do not leave traces of product on floors, ladders, etc. Wear protective gear appropriate for the situation (see Section 8).\nDry material: sweep up and place in an appropriate closed container. Wet material: absorb with an inert absorbent and shovel up into an appropriate closed container.\nSpills should be reported to the competent local environmental authorities where required.'
            },
            {
                num: 7,
                title: 'Handling and Storage',
                content: 'Handling: Avoid breathing dust. This product may present a dust explosion hazard: all dust control equipment and material transport systems should contain explosion relief vents, an explosion suppression system, or an oxygen deficient environment. All conductive elements of the system that contact this material should be electrically bonded and grounded. The powder should not be flowed through non conductive ducts or pipes. Use only appropriately classed electrical equipment.\nStorage: Keep the product in its original, tightly closed packaging in a cool, dry, and well ventilated place; protect from moisture, rain, and direct sunlight. Inadequate storage may result in a loss of rheological properties.'
            },
            {
                num: 8,
                title: 'Exposure Controls / Personal Protection',
                content: 'Exposure guidelines: No exposure limits have been established for this product or any of its ingredients. Engineering controls: Where indicated, use traditional exposure control techniques such as wet processing methods to reduce dust generation. Respiratory protection: NIOSH/MSHA approved equipment selected on actual or potential airborne concentrations under normal conditions an air purifying (half mask/full face) respirator with dust/mist/fume cartridges provides adequate protection. Eye/face protection: ANSI Z87 approved equipment; minimum safety glasses with side shields. Skin protection: Minimize skin contact through gloves and suitable long sleeved clothing. Work practice controls: Do not store, use, or consume foods, beverages, tobacco products, or cosmetics in areas where this material is stored; wash hands and face before eating, drinking, using tobacco, applying cosmetics, or using the toilet; wash exposed skin promptly after accidental contact.'
            },
            {
                num: 9,
                title: 'Physical and Chemical Properties',
                content: '',
                table: {
                    headers: ['Property', 'Value'],
                    rows: [
                        ['Appearance', 'Cream colored, free flowing powder'],
                        ['Odor', 'Flour like odor'],
                        ['pH (1% solution)', '5.5 – 8.5'],
                        ['Water solubility', 'Soluble'],
                        ['Flash point (closed cup)', '> 93 °C (200 °F)'],
                        ['Specific gravity', 'Not available'],
                        ['Melting point / boiling point', 'Not applicable'],
                        ['Vapor pressure / vapor density', 'Not applicable']
                    ]
                }
            },
            {
                num: 10,
                title: 'Stability and Reactivity',
                content: 'Chemical stability: Stable under normal handling and storage conditions as described in Section 7. Conditions to avoid: Dusting conditions, extreme heat, open flames, and sparks. Materials to avoid: Strong oxidizing agents. Hazardous decomposition products: Oxides of carbon (thermal decomposition). Hazardous polymerization: Will not occur.'
            },
            {
                num: 11,
                title: 'Toxicological Information',
                content: 'Acute toxicity (oral, dermal, inhalation): No test data found for the product; ingestion is considered non toxic. Irritation (eye, skin, respiratory): No test data found for the product; dust may cause slight transient irritation (see Section 2). Chronic toxicity/carcinogenicity: This product does not contain any substances considered by OSHA, NTP, IARC, or ACGIH to be "probable" or "suspected" human carcinogens. No additional test data found for the product.'
            },
            {
                num: 12,
                title: 'Ecological Information',
                content: 'Ecotoxicological information: No data found for the product. Chemical fate information: No data found for the product.'
            },
            {
                num: 13,
                title: 'Disposal Considerations',
                content: 'Chemical additions, processing, or otherwise altering this material may make the waste management information presented incomplete or inappropriate consult local regulations, which may be more restrictive than national ones.\nStabilize and solidify this material with compatible binders, then place in a secure landfill.\nAny containers or equipment used should be decontaminated immediately after use.'
            },
            {
                num: 14,
                title: 'Transport Information',
                content: 'TDG status: NON DANGEROUS. IMO status: NOT REGULATED. IATA status: NOT REGULATED. Note: the listed transportation classification does not address regulatory variations due to changes in package size, mode of shipment, or other regulatory descriptors.'
            },
            {
                num: 15,
                title: 'Regulatory Information',
                content: 'Inventory status (Y = all ingredients are on the inventory):\n\nWHMIS classification: NOT CONTROLLED. This product has been classified in accordance with the hazard criteria of the CPR (Controlled Products Regulations), and this SDS contains all the information required by the CPR.',
                table: {
                    headers: ['Inventory', 'Status'],
                    rows: [
                        ['United States (TSCA)', 'Y'],
                        ['Canada (DSL)', 'Y'],
                        ['Europe (EINECS/ELINCS)', 'Y'],
                        ['Australia (AICS)', 'Y'],
                        ['Japan (MITI)', 'Y'],
                        ['South Korea (KECL)', 'Y']
                    ]
                }
            },
            {
                num: 16,
                title: 'Other Information',
                content: 'NFPA ratings: Health Slight; Flammability Slight; Instability Minimal. HMIS ratings: Health Slight; Flammability Slight; Reactivity Minimal.\nAbbreviations: ACGIH American Conference of Governmental Industrial Hygienists; OSHA Occupational Safety and Health Administration; TLV Threshold Limit Value; PEL Permissible Exposure Limit; TWA Time Weighted Average; STEL Short Term Exposure Limit; NTP National Toxicology Program; IARC International Agency for Research on Cancer; ND Not Determined.\nDisclaimer: The information contained herein is given in good faith, but no warranty, expressed or implied, is made. It is provided for reference only, and actual conditions of use shall prevail. To the fullest extent permitted by applicable law, Brighter Star Drilling Fluids assumes no responsibility or liability for any results, losses, or damages arising from the use of, or reliance on, this Safety Data Sheet.'
            }
        ],
        salesContacts: [
            { name: 'Ms. Jannifer', phone: '+234-09136099052', email: 'info@pcenigeria.com' },
            { name: 'Mr. Tom', phone: '+234-07074126596', email: 'wanyang@pcenigeria.com' },
            { name: 'Mr. Frank', phone: '+234-07013732816', email: 'xuliangkui@pcenigeria.com' }
        ]
    }
];

export function getProductBySlug(slug: string): ProductDetail | undefined {
    return PRODUCTS_DATA.find((p) => p.slug === slug);
}
