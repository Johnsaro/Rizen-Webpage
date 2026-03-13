import React from 'react';
import { builds } from '../data/builds';
import type { Build } from '../data/builds';
import BuildCard from '../components/features/BuildCard';
import './Builds.css';

interface BuildsProps {
  onViewBuild: (build: Build) => void;
}

const Builds: React.FC<BuildsProps> = ({ onViewBuild }) => {
  const statusPriority: Record<string, number> = {
    'Live': 1,
    'Beta': 2,
    'Upcoming': 3,
    'WIP': 4,
    'Archived': 5
  };

  const sortedBuilds = [...builds].sort((a, b) => {
    return (statusPriority[a.status] || 99) - (statusPriority[b.status] || 99);
  });

  return (
    <div className="builds-page">
      {/* 1. HERO SECTION */}
      <section className="builds-hero">
        <div className="hero-content reveal visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="status-tag pulse-border">CULTIVATION LOG</div>
          <h1 className="glitch-title" data-text="BUILDS">BUILDS</h1>
          <p className="hero-description reveal visible">
            Artifacts forged by the Sect. Real cultivation. Real progression.
          </p>
        </div>
      </section>

      {/* 2. BUILDS GRID SECTION */}
      <section className="section-padding">
        <div className="builds-grid">
          {sortedBuilds.map((build, index) => (
            <div
              key={build.id}
              className="reveal visible"
              style={{ transitionDelay: `${index * 0.1}s` }}
            >
              <BuildCard build={build} onClick={onViewBuild} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Builds;
