'use client';

import React from 'react';
import { ResourcesHero, Reports } from '../components';

interface ResourcesPageProps {
  sanityCategories?: any[];
  sanityPage?: any;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ sanityCategories, sanityPage }) => {
  return (
    <div className="flex flex-col w-full bg-[var(--color-canvas-tint)] min-h-screen">
      <ResourcesHero sanityPage={sanityPage} />
      <Reports sanityCategories={sanityCategories} section={sanityPage?.downloadsSection} />
    </div>
  );
};

export default ResourcesPage;
