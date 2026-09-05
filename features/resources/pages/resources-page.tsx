'use client';

import React from 'react';
import { ResourcesHero, Reports } from '../components';

interface ResourcesPageProps {
  sanityCategories?: any[];
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ sanityCategories }) => {
  return (
    <div className="flex flex-col w-full bg-[var(--color-canvas-tint)] min-h-screen">
      <ResourcesHero />
      <Reports sanityCategories={sanityCategories} />
    </div>
  );
};

export default ResourcesPage;

