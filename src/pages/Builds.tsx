import React from 'react';
import { builds } from '../data/builds';
import type { Build, BuildDevStatus } from '../data/builds';
import BuildCard from '../components/features/BuildCard';
import StackPipeline from '../components/features/StackPipeline';
import './Builds.css';

interface BuildsProps {
  onViewBuild: (build: Build) => void;
}

const DEV_STATUS_LABEL: Record<BuildDevStatus, { label: string; icon: string }> = {
  live: { label: 'ACTIVE DEV', icon: '\u25B6' },
  maintenance: { label: 'MAINTENANCE', icon: '\u25C6' },
  stable: { label: 'STABLE', icon: '\u25A0' },
  dev: { label: 'IN DEV', icon: '\u25C9' },
};

const Builds: React.FC<BuildsProps> = ({ onViewBuild }) => {
  const flagship = builds.find(b => b.flagship);
  const companions = builds.filter(b => !b.flagship);

  return (
    <div className="builds-page">
      {/* ── HERO ── */}
      <section className="builds-hero">
        <div className="hero-content reveal visible" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="status-tag pulse-border">CULTIVATION LOG</div>
          <h1 className="glitch-title" data-text="BUILDS">BUILDS</h1>
          <p className="hero-description reveal visible">
            Artifacts forged by the Sect. Real cultivation. Real progression.
          </p>
        </div>
      </section>

      {/* ── ECOSYSTEM PULSE STRIP ── */}
      <div className="ecosystem-strip">
        {builds.map((build, i) => {
          const statusCfg = DEV_STATUS_LABEL[build.devStatus];
          return (
            <React.Fragment key={build.id}>
              {i > 0 && (
                <div className="eco-connector">
                  <div className="eco-connector-line" />
                  <div className="eco-connector-packet" />
                </div>
              )}
              <button
                className={`eco-node eco-node--${build.devStatus}`}
                style={{ '--node-rgb': build.accentRgb } as React.CSSProperties}
                onClick={() => onViewBuild(build)}
              >
                <span className={`eco-beacon eco-beacon--${build.devStatus}`} />
                <span className="eco-node-name">{build.title.split(' ')[0]}</span>
                <span className="eco-node-version">{build.version}</span>
                <span className={`eco-node-status eco-node-status--${build.devStatus}`}>
                  {statusCfg.icon} {statusCfg.label}
                </span>
              </button>
            </React.Fragment>
          );
        })}
      </div>

      {/* ── FLAGSHIP BUILD ── */}
      {flagship && (
        <section className="flagship-section">
          <div
            className="flagship-card"
            style={{ '--flag-rgb': flagship.accentRgb } as React.CSSProperties}
            onClick={() => onViewBuild(flagship)}
          >
            {/* Atmospheric glow */}
            <div className="flagship-glow" />

            <div className="flagship-content">
              <div className="flagship-info">
                <div className="flagship-badges">
                  <span className="flagship-mark">FLAGSHIP</span>
                  <span className="flagship-version">{flagship.version}</span>
                  <span className={`flagship-dev-status flagship-dev-status--${flagship.devStatus}`}>
                    <span className="fds-dot" />
                    {DEV_STATUS_LABEL[flagship.devStatus].label}
                  </span>
                </div>

                <h2 className="flagship-title">{flagship.title}</h2>
                <p className="flagship-summary">{flagship.oneLineSummary}</p>

                <StackPipeline tags={flagship.tags} buildTitle={flagship.title} />

                <div className="flagship-actions">
                  <button className="flagship-view-btn" onClick={() => onViewBuild(flagship)}>
                    View Build <span className="btn-arrow">&rarr;</span>
                  </button>
                  {flagship.links.download && (
                    <a
                      href="#"
                      className="flagship-download-btn"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download APK
                    </a>
                  )}
                </div>
              </div>

              <div className="flagship-stats">
                <div className="flagship-stat-grid">
                  <div className="flagship-stat">
                    <span className="fstat-value">{flagship.intel.patchNotes.length}</span>
                    <span className="fstat-label">Releases</span>
                  </div>
                  <div className="flagship-stat">
                    <span className="fstat-value">{flagship.intel.lessons.length}</span>
                    <span className="fstat-label">Intel Gained</span>
                  </div>
                  <div className="flagship-stat">
                    <span className="fstat-value">{flagship.media?.length || 0}</span>
                    <span className="fstat-label">Media</span>
                  </div>
                  <div className="flagship-stat">
                    <span className="fstat-value">{flagship.tags.length}</span>
                    <span className="fstat-label">Stack Layers</span>
                  </div>
                </div>

                <div className="flagship-latest-patch">
                  <span className="flp-label">LATEST</span>
                  <span className="flp-text">{flagship.intel.patchNotes[0]}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── COMPANION BUILDS ── */}
      {companions.length > 0 && (
        <section className="companion-section">
          <div className="companion-header">
            <div className="companion-indicator" />
            <h2 className="companion-title">Companion Builds</h2>
            <span className="companion-desc">Extensions of the Rizen ecosystem</span>
          </div>

          <div className="companion-grid">
            {companions.map((build, index) => (
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
      )}
    </div>
  );
};

export default Builds;
