import React from 'react';
import type { Build } from '../../data/builds';
import StackPipeline from './StackPipeline';
import './BuildCard.css';

interface BuildCardProps {
  build: Build;
  onClick: (build: Build) => void;
}

const BuildCard: React.FC<BuildCardProps> = ({ build, onClick }) => {
  return (
    <div className="build-card reveal interactive-card" onClick={() => onClick(build)}>
      <div className="build-card__header">
        <span className={`build-status-badge status-${build.status.toLowerCase()}`}>
          {build.status}
        </span>
        <span className="build-date">{build.created_date}</span>
      </div>

      <div className="build-card__body">
        <h3 className="build-title">
          {build.title}
          {build.systemStatus && (
            <span className={`system-status status-${build.systemStatus}`}>
              <span className="status-dot"></span>
              {build.systemStatus.toUpperCase()}
            </span>
          )}
        </h3>
        <p className="build-description">{build.description}</p>

        <StackPipeline tags={build.tags} buildTitle={build.title} />
      </div>

      <div className="build-card__footer">
        <button className="btn-secondary build-view-btn">
          View Build <span className="btn-arrow">→</span>
        </button>
      </div>
    </div>
  );
};

export default BuildCard;
