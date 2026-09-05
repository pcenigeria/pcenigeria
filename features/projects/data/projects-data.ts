import { ProjectDetail } from '../types/project.types';

export const PROJECTS_DATA: Record<string, ProjectDetail> = {
    "akk-river-niger": {
        id: "akk-river-niger",
        slug: "akk-river-niger",
        title: "AKK River Niger Crossing.",
        subtitle: "Specialist HDD Engineering and Execution beneath the River Niger Corridor",
        tagline: "1.565 KM BENEATH THE RIVER NIGER",
        date: "AUGUST 2024",
        location: "Kogi State, Nigeria",
        category: "HDD RIVER CROSSING",
        heroImage: "/pictures/case-study/akk/akk-bento-1.jpg",
        bentoImages: [
            "/pictures/case-study/akk/akk-bento-1.jpg",
            "/pictures/case-study/akk/akk-bento-2.jpg",
            "/pictures/case-study/akk/akk-bento-3.jpg",
            "/pictures/case-study/akk/akk-bento-4.jpg",
            "/pictures/case-study/akk/akk-bento-5.jpg"
        ],
        intro: "PCE completed the specialist HDD crossing for the 40-inch AKK gas pipeline beneath the River Niger through mixed sand, gravel and rock strata.",
        specs: [
            { label: "Pipeline Diameter", value: "40 inches" },
            { label: "HDD Length", value: "1,565 metres" },
            { label: "Crossing Depth", value: "16 metres" },
            { label: "Completed", value: "26th July, 2025" }
        ],
        sections: [
            {
                tagline: "THE CHALLENGE",
                heading: "A project-critical crossing that remained incomplete.",
                headingColor: "text-[var(--color-ink-muted-48)]",
                body: [
                    "The River Niger crossing formed part of the Ajaokuta–Kaduna–Kano section of the Trans Nigeria Gas Pipeline.",
                    "After previous specialist HDD attempts had not completed the crossing, the unfinished section continued to affect connection and commissioning of the wider project.",
                    "PCE was appointed to execute the crossing package."
                ]
            },
            {
                tagline: "THE ENGINEERING RESPONSE",
                heading: "An HDD method shaped around mixed geology.",
                headingColor: "text-[var(--color-ink-muted-48)]",
                body: [
                    "The crossing required a technical response to sand, gravel and rock across a 1.565 km alignment.",
                    "PCE's execution approach included:"
                ],
                bullets: [
                    "Dual-rig intersecting technology for the pilot hole",
                    "Dual-rig synchronous operation during reaming",
                    "A self-developed drilling-fluid formula",
                    "High-capacity HDD equipment",
                    "Specialist guidance and coordinated operations across the crossing"
                ]
            },
            {
                tagline: "THE RESULT",
                heading: "The AKK River Niger crossing: completed.",
                headingColor: "text-[var(--color-ink-muted-48)]",
                body: [
                    "PCE successfully installed the 40-inch AKK gas pipeline beneath the River Niger using specialist HDD.",
                    "The crossing began on 25 March 2025 and was completed on 26 July 2025."
                ],
                highlightStat: {
                    value: "1.56 km",
                    label: "Completed crossing"
                }
            }
        ]
    },
    "ob3-river-niger": {
        id: "ob3-river-niger",
        slug: "ob3-river-niger",
        title: "OB3 River Niger Crossing.",
        subtitle: "HDD Crossing for the OB3 Gas Pipeline between Rivers and Delta States",
        tagline: "2 KM BENEATH THE RIVER NIGER",
        date: "APRIL 2026",
        location: "Ndoni, Rivers State / Aboh, Delta State, Nigeria",
        category: "HDD RIVER CROSSING",
        heroImage: "/pictures/case-study/ob3/ob3-bento-1.jpg",
        bentoImages: [
            "/pictures/case-study/ob3/ob3-bento-1.jpg",
            "/pictures/case-study/ob3/ob3-bento-2.jpg",
            "/pictures/case-study/ob3/ob3-bento-3.jpg",
            "/pictures/case-study/ob3/ob3-bento-4.jpg",
            "/pictures/case-study/ob3/ob3-bento-5.jpg"
        ],
        intro: "PCE executed the River Niger HDD crossing on the OB3 Gas Pipeline between Ndoni in Rivers State and Aboh in Delta State. The crossing combined a 48-inch pipeline, approximately 2 km of HDD and complex sand, gravel and rock strata.",
        specs: [
            { label: "Pipeline Diameter", value: "48 inches" },
            { label: "Crossing Length", value: "2,000 metres" },
            { label: "Crossing Depth", value: "52 metres" },
            { label: "Completed", value: "28 April 2026" }
        ],
        sections: [
            {
                tagline: "THE CHALLENGE",
                heading: "A critical bottleneck on a 130 km gas pipeline.",
                headingColor: "text-[var(--color-ink-muted-48)]",
                body: [
                    "The wider OB3 project comprises a 48/36-inch, 130 km trunk gas pipeline from Obiafu/Obrikom in Rivers State to the Oben node at Ijomi, Oghara, Delta State.",
                    "Its River Niger HDD crossing had remained incomplete following previous specialist attempts, delaying connection and commissioning of the wider project.",
                    "Following PCE's performance on the AKK River Niger crossing, NGIC entrusted PCE with the OB3 crossing package."
                ],
                highlightStat: {
                    value: "2 Bcf/d",
                    label: "Facility capacity of the wider OB3 project"
                }
            },
            {
                tagline: "THE ENGINEERING RESPONSE",
                heading: "Dual-rig execution for complex geology.",
                headingColor: "text-[var(--color-ink-muted-48)]",
                body: [
                    "PCE's crossing method included:",
                    "The project utilised the GS-12000L with 1,000+ tonnes pulling capability and the GD-5000L with 500 tonnes pulling capability."
                ],
                bullets: [
                    "Dual-rig intersecting pilot-hole technology",
                    "Dual-rig synchronous reaming",
                    "A self-developed drilling-fluid formula",
                    "High-capacity HDD equipment",
                    "Specialist guidance and field coordination"
                ]
            },
            {
                tagline: "THE RESULT",
                heading: "The OB3 River Niger crossing: completed.",
                headingColor: "text-[var(--color-ink-muted-48)]",
                body: [
                    "PCE completed the 2,000-metre, 48-inch HDD crossing between KP15 and KP17, from Ndoni in Rivers State to Aboh in Delta State.",
                    "Work began on 6 October 2025 and was completed on 28 April 2026."
                ],
                highlightStat: {
                    value: "2,000 m",
                    label: "Completed crossing"
                }
            }
        ]
    },
    "two-major-gas-crossings": {
        id: "two-major-gas-crossings",
        slug: "two-major-gas-crossings",
        title: "Two major gas crossings.",
        subtitle: "Thailand · Bang Pakong",
        tagline: "THAILAND · BANG PAKONG",
        date: "MAY 2025",
        location: "Bang Pakong, Thailand",
        category: "INTERNATIONAL HDD",
        heroImage: "/pictures/home-page/pipeline-new.jpg",
        intro: "Two steel gas-pipeline crossings through clay and sand.",
        specs: [
            { label: "Crossing One", value: "1,150 m" },
            { label: "Crossing Two", value: "1,100 m" },
            { label: "Pipeline Diameter", value: "36 in" },
            { label: "Maximum Pullback", value: "600 t" },
            { label: "Execution Period", value: "August 2024 – May 2025" }
        ]
    },
    "five-parallel-crossings": {
        id: "five-parallel-crossings",
        slug: "five-parallel-crossings",
        title: "Five parallel offshore crossings.",
        subtitle: "Guangdong, China",
        tagline: "GUANGDONG, CHINA",
        date: "APRIL 2024",
        location: "Guangdong, China",
        category: "PARALLEL HDD",
        heroImage: "/pictures/case-study/zhanjiang-offshore/cover-photo.jpg",
        bentoImages: [
            "/pictures/case-study/zhanjiang-offshore/cover-photo.jpg"
        ],
        intro: "Five parallel HDD crossings for steel gas pipelines through clay, sand and rock.",
        specs: [
            { label: "Parallel Crossings", value: "5 × 2,100 m" },
            { label: "Pipeline Size", value: "20 in" },
            { label: "Execution Period", value: "October 2023 – April 2024" }
        ]
    },
    "raoyang-river-crossing": {
        id: "raoyang-river-crossing",
        slug: "raoyang-river-crossing",
        title: "2,293 metres across the river.",
        subtitle: "Raoyang River, China",
        tagline: "RAOYANG RIVER, CHINA",
        date: "NOVEMBER 2022",
        location: "Raoyang River, China",
        category: "LARGE DIAMETER HDD",
        heroImage: "/pictures/case-study/raoyang-river/cover-photo.jpg",
        bentoImages: [
            "/pictures/case-study/raoyang-river/cover-photo.jpg",
            "/pictures/case-study/raoyang-river/raoyang-river-china-02.jpg",
            "/pictures/case-study/raoyang-river/raoyang-river-china-03.jpg",
            "/pictures/case-study/raoyang-river/raoyang-river-china-04.jpg"
        ],
        intro: "A large-diameter gas-pipeline crossing through sand and gravel strata.",
        specs: [
            { label: "Crossing Length", value: "2,293 m" },
            { label: "Pipeline Diameter", value: "48 in" },
            { label: "Depth", value: "30 m" },
            { label: "Execution Period", value: "June – November 2022" }
        ]
    },
    "zhanjiang-crossing": {
        id: "zhanjiang-crossing",
        slug: "zhanjiang-crossing",
        title: "4,060 metres through gravel and sand.",
        subtitle: "Zhanjiang, China",
        tagline: "ZHANJIANG, CHINA",
        date: "2019",
        location: "Zhanjiang, China",
        category: "INTERSECTING HDD",
        heroImage: "/pictures/case-study/guangong-china/cover-photo.jpg",
        bentoImages: [
            "/pictures/case-study/guangong-china/cover-photo.jpg",
            "/pictures/case-study/zhanjiang-offshore/02.jpg",
            "/pictures/case-study/zhanjiang-offshore/03.jpg",
            "/pictures/case-study/zhanjiang-offshore/04.jpg"
        ],
        intro: "A long-distance intersecting HDD crossing executed using 600-ton and 500-ton rigs.",
        specs: [
            { label: "Crossing Length", value: "4,060 m" },
            { label: "Maximum Rig Pullback", value: "600 t" },
            { label: "Execution Period", value: "2018 – 2019" }
        ]
    },
    "pipeline-epc-thailand": {
        id: "pipeline-epc-thailand",
        slug: "pipeline-epc-thailand",
        title: "52 km of pipeline EPC.",
        subtitle: "Thailand · SRB–NBPT Link Line",
        tagline: "THAILAND · SRB–NBPT LINK LINE",
        date: "2026",
        location: "Saraburi to Ang Thong, Thailand",
        category: "PIPELINE EPC",
        heroImage: "/pictures/company/company-hero.jpg",
        intro: "Pipeline EPC from Saraburi to Ang Thong Province, including extensive continuous HDD.",
        specs: [
            { label: "Pipeline Length", value: "52 km" },
            { label: "Oil Pipeline", value: "12 in" },
            { label: "Continuous HDD", value: "30+ km" },
            { label: "Execution Period", value: "2024 – 2026" }
        ]
    }
};

export const getProjectBySlug = (slug: string): ProjectDetail => {
    return PROJECTS_DATA[slug] || PROJECTS_DATA["akk-river-niger"];
};
