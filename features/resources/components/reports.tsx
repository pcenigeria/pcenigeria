'use client';

import React, { useState } from 'react';
import { DownloadSimple } from '@phosphor-icons/react';
import { StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

export interface SanityResourceItem {
    _key?: string;
    title: string;
    description?: string;
    downloadUrl?: string;
    fileUrl?: string;
}

export interface SanityResourceCategory {
    _id: string;
    label: string;
    slug?: string;
    items?: SanityResourceItem[];
}

export interface ReportsProps {
    sanityCategories?: SanityResourceCategory[];
}

interface ReportItem {
    id: string;
    title: string;
    downloadUrl: string;
    categoryTag?: string;
}

interface ReportCategory {
    id: string;
    label: string;
    items: ReportItem[];
}

const ALL_REAL_RESOURCES: ReportItem[] = [
    { id: 'profile-2026', title: '2026 PCE Corporate Profile', downloadUrl: '/resources/01-PROFILE_PCE Nigeria LTD_2026-compressed.pdf', categoryTag: 'Company Profile' },
    { id: 'product-manual-en', title: 'Brighter Star Drilling Fluids Product Manual', downloadUrl: '/resources/Brighter_Star_Drilling_Fluids_Product_Manual_EN.pdf', categoryTag: 'Product Manual' },
    { id: 'bent-tds', title: 'BRSBENT SQ Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSBENT_SQ_Product_Data_Sheet.pdf', categoryTag: 'TDS' },
    { id: 'cmc-tds', title: 'BRSCMC Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSCMC_Technical_Data_Sheet.pdf', categoryTag: 'TDS' },
    { id: 'mmh-tds', title: 'BRSMMH Product Data Sheet (TDS)', downloadUrl: '/resources/BRSMMH_Product_Data_Sheet.pdf', categoryTag: 'TDS' },
    { id: 'vr-tds', title: 'BRSVR Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSVR_Technical_Data_Sheet.pdf', categoryTag: 'TDS' },
    { id: 'xtg-tds', title: 'BRSXTG Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSXTG_Technical_Data_Sheet.pdf', categoryTag: 'TDS' },
    { id: 'bent-sds', title: 'BRSBENT SQ Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSBENT_SQ_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
    { id: 'cmc-sds', title: 'BRSCMC Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSCMC_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
    { id: 'mmh-sds', title: 'BRSMMH Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSMMH_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
    { id: 'vr-sds', title: 'BRSVR Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSVR_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
    { id: 'xtg-sds', title: 'BRSXTG Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSXTG_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
];

const reportCategories: ReportCategory[] = [
    {
        id: 'all',
        label: 'All Resources',
        items: ALL_REAL_RESOURCES,
    },
    {
        id: 'company',
        label: 'Company Profile & Manuals',
        items: [
            { id: 'profile-2026', title: '2026 PCE Corporate Profile', downloadUrl: '/resources/01-PROFILE_PCE Nigeria LTD_2026-compressed.pdf', categoryTag: 'Company Profile' },
            { id: 'product-manual-en', title: 'Brighter Star Drilling Fluids Product Manual', downloadUrl: '/resources/Brighter_Star_Drilling_Fluids_Product_Manual_EN.pdf', categoryTag: 'Product Manual' },
        ],
    },
    {
        id: 'tds',
        label: 'Technical Data Sheets (TDS)',
        items: [
            { id: 'bent-tds', title: 'BRSBENT SQ Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSBENT_SQ_Product_Data_Sheet.pdf', categoryTag: 'TDS' },
            { id: 'cmc-tds', title: 'BRSCMC Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSCMC_Technical_Data_Sheet.pdf', categoryTag: 'TDS' },
            { id: 'mmh-tds', title: 'BRSMMH Product Data Sheet (TDS)', downloadUrl: '/resources/BRSMMH_Product_Data_Sheet.pdf', categoryTag: 'TDS' },
            { id: 'vr-tds', title: 'BRSVR Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSVR_Technical_Data_Sheet.pdf', categoryTag: 'TDS' },
            { id: 'xtg-tds', title: 'BRSXTG Technical Data Sheet (TDS)', downloadUrl: '/resources/BRSXTG_Technical_Data_Sheet.pdf', categoryTag: 'TDS' },
        ],
    },
    {
        id: 'sds',
        label: 'Safety Data Sheets (SDS)',
        items: [
            { id: 'bent-sds', title: 'BRSBENT SQ Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSBENT_SQ_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
            { id: 'cmc-sds', title: 'BRSCMC Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSCMC_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
            { id: 'mmh-sds', title: 'BRSMMH Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSMMH_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
            { id: 'vr-sds', title: 'BRSVR Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSVR_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
            { id: 'xtg-sds', title: 'BRSXTG Safety Data Sheet (SDS)', downloadUrl: '/resources/BRSXTG_Safety_Data_Sheet.pdf', categoryTag: 'SDS' },
        ],
    },
];

export const Reports: React.FC<ReportsProps> = ({ sanityCategories }) => {
    const [activeTabId, setActiveTabId] = useState<string>('all');

    const categoriesToDisplay: ReportCategory[] = React.useMemo(() => {
        if (!sanityCategories || sanityCategories.length === 0) {
            return reportCategories;
        }

        const formattedCategories: ReportCategory[] = sanityCategories.map((cat) => {
            const catSlug = cat.slug || cat._id;
            let defaultTag = cat.label;
            if (cat.label.includes('Technical Data Sheets') || cat.label.toLowerCase().includes('tds')) {
                defaultTag = 'TDS';
            } else if (cat.label.includes('Safety Data Sheets') || cat.label.toLowerCase().includes('sds')) {
                defaultTag = 'SDS';
            } else if (cat.label.includes('Company Profile') || cat.label.toLowerCase().includes('manual')) {
                defaultTag = 'Company Profile';
            }

            const formattedItems: ReportItem[] = (cat.items || []).map((item, idx) => {
                let fallbackUrl = item.downloadUrl || item.fileUrl || '';
                if (!fallbackUrl) {
                    const match = ALL_REAL_RESOURCES.find(
                        (r) => r.title.toLowerCase() === item.title.toLowerCase()
                    );
                    if (match) fallbackUrl = match.downloadUrl;
                }

                return {
                    id: item._key || `${catSlug}-${idx}`,
                    title: item.title,
                    downloadUrl: fallbackUrl,
                    categoryTag: defaultTag,
                };
            });

            return {
                id: catSlug,
                label: cat.label,
                items: formattedItems,
            };
        });

        const allItems = formattedCategories.flatMap((c) => c.items);
        const allCategory: ReportCategory = {
            id: 'all',
            label: 'All Resources',
            items: allItems,
        };

        return [allCategory, ...formattedCategories];
    }, [sanityCategories]);

    const activeCategory = categoriesToDisplay.find((cat) => cat.id === activeTabId) || categoriesToDisplay[0];

    return (
        <section className="w-full section py-16 lg:py-24 bg-white">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                
                {/* Left Sidebar / Top Category Navigation */}
                <div className="lg:col-span-3 flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible border-b lg:border-b-0 lg:border-r border-black/10 gap-2 lg:gap-1 relative pb-2 lg:pb-0 whitespace-nowrap scrollbar-none">
                    {categoriesToDisplay.map((category) => {
                        const isActive = category.id === activeTabId;
                        return (
                            <button
                                key={category.id}
                                onClick={() => setActiveTabId(category.id)}
                                className={`relative text-left py-3.5 px-4 font-semibold text-sm lg:text-base transition-all duration-200 flex items-center justify-between cursor-pointer ${
                                    isActive
                                        ? 'text-[var(--color-primary)] font-bold bg-[var(--color-primary)]/5 lg:bg-transparent rounded-lg lg:rounded-none'
                                        : 'text-[var(--color-ink-muted-48)] hover:text-[var(--color-primary)]'
                                }`}
                            >
                                <span className="pr-2 lg:pr-4">{category.label}</span>
                                {isActive && (
                                    <span className="absolute left-0 right-0 -bottom-[1px] h-[3px] w-full lg:w-[3px] lg:top-0 lg:bottom-0 lg:left-auto lg:-right-[1.5px] lg:h-auto bg-[var(--color-primary)] rounded-full z-10" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Right Content Cards Grid */}
                <div className="lg:col-span-9">
                    <StaggerContainer key={activeTabId} className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                        {activeCategory.items.map((item) => (
                            <StaggerItem key={item.id}>
                                <a
                                    href={item.downloadUrl}
                                    download
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="relative bg-[#052237] text-white rounded-2xl p-6 lg:p-7 h-[300px] flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer no-underline block border border-white/5 hover:border-[var(--color-accent)]/40"
                                >
                                    {/* Decorative Pattern Background */}
                                    <div className="absolute inset-0 opacity-15 pointer-events-none bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px]" />

                                    {/* Category Tag & Title */}
                                    <div className="flex flex-col gap-3 relative z-10">
                                        {item.categoryTag && (
                                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[var(--color-accent)]">
                                                {item.categoryTag}
                                            </span>
                                        )}
                                        <h3 className="!text-[20px] lg:!text-[22px] font-extrabold text-white leading-snug">
                                            {item.title}
                                        </h3>
                                    </div>

                                    {/* Bottom Download Bar */}
                                    <div className="flex items-center justify-between relative z-10 pt-4 border-t border-white/10">
                                        <span className="text-[var(--color-accent)] font-bold text-sm tracking-wide group-hover:underline">
                                            Download PDF
                                        </span>
                                        <div className="text-[var(--color-accent)] group-hover:scale-110 transition-transform">
                                            <DownloadSimple size={22} weight="bold" />
                                        </div>
                                    </div>
                                </a>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>

            </div>
        </section>
    );
};

export default Reports;

