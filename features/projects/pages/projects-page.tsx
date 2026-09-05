import React from 'react';
import { ProjectsHome, FeaturedProjects, WhatWorks } from '../components';
import { ProjectListItem } from '../types/project.types';

interface ProjectsPageProps {
    sanityProjects?: ProjectListItem[];
    sanityPage?: any;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ sanityProjects, sanityPage }) => {
    return (
        <div className="flex flex-col w-full">
            <ProjectsHome sanityPage={sanityPage} />
            <FeaturedProjects sanityProjects={sanityProjects} sanityPage={sanityPage} />
            <WhatWorks sanityPage={sanityPage} />
        </div>
    );
};
