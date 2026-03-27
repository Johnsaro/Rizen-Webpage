import React from 'react';
import type { Build } from '../../data/builds';
import RizenMarketingVideo from './RizenMarketingVideo';
import PulseMarketingVideo from './PulseMarketingVideo';
import PhantomMarketingVideo from './PhantomMarketingVideo';
import './BuildDetail.css';

interface BuildDetailProps {
  build: Build;
  onClose: () => void;
}

const BuildDetail: React.FC<BuildDetailProps> = ({ build, onClose }) => {
  return (
    <div className="build-detail-overlay">
      <div className="build-detail-container">
        <button className="build-detail-close" onClick={onClose}>
          <span className="close-icon">×</span>
          <span className="close-text">RETURN_TO_GRID</span>
        </button>

        {/* ZONE 1: PROJECT HEADER */}
        <header className="build-header">
          <div className="build-header__top">
            <h1 className="build-header__title">
              {build.title}
              {build.systemStatus && (
                <span className={`system-status status-${build.systemStatus}`}>
                  <span className="status-dot"></span>
                  {build.systemStatus.toUpperCase()}
                </span>
              )}
            </h1>
            <span className={`build-status-badge status-${build.status.toLowerCase()}`}>
              {build.status}
            </span>
          </div>
          <p className="build-header__summary">{build.oneLineSummary}</p>
          <div className="build-header__meta">
            <span className="meta-label">TECH_STACK:</span>
            {build.tags.map(tag => (
              <span key={tag} className="meta-tag">{tag}</span>
            ))}
          </div>
        </header>

        <div className="build-detail-content">
          {/* ZONE 2: OPERATION BRIEF */}
          <section className="detail-section">
            <h2 className="section-title">OPERATION BRIEF</h2>
            <div className="brief-card">
              <p className="brief-text">{build.intel.brief}</p>

              <div className="intel-grid">
                <div className="intel-column">
                  <h3>PATCH NOTES</h3>
                  <ul>
                    {build.intel.patchNotes.map((note, i) => <li key={i}>{note}</li>)}
                  </ul>
                </div>
                <div className="intel-column">
                  <h3>INTEL GAINED</h3>
                  <ul>
                    {build.intel.lessons.map((lesson, i) => <li key={i}>{lesson}</li>)}
                  </ul>
                </div>
              </div>

              {build.links.download && (
                <div className="brief-download-wrap">
                  <a
                    href={build.links.download}
                    className="apk-download-btn"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="apk-dl-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    <span className="apk-dl-label">
                      <span className="apk-dl-title">DOWNLOAD APK</span>
                      <span className="apk-dl-sub">v2.2.0 · Android</span>
                    </span>
                    <span className="apk-dl-badge">FREE</span>
                  </a>
                </div>
              )}
            </div>
          </section>

          <div className="detail-actions">
            {build.links.demo && (
              <a href={build.links.demo} className="btn-primary" target="_blank" rel="noopener noreferrer">
                OPEN PROJECT
              </a>
            )}
            {build.links.repo && (
              <a href={build.links.repo} className="btn-secondary" target="_blank" rel="noopener noreferrer">
                VIEW REPOSITORY
              </a>
            )}
          </div>

          {/* ZONE 3: PROOF / MEDIA */}
          <section className="detail-section visual-proof-section">
            <h2 className="section-title">VISUAL PROOF</h2>
            <div className="media-gallery">
              {build.media && build.media.length > 0 ? (
                <>
                  {/* Primary Demo Card (First Image or Video) */}
                  <div className={`media-card primary-media-card ${build.media[0].type === 'video' ? 'monitor-frame' : ''}`}>
                    <div className="media-card-inner">
                      {build.media[0].type === 'video' ? (
                        build.media[0].url === 'RIZEN_MOBILE_PROTOCOL_VIDEO' ? (
                          <RizenMarketingVideo />
                        ) : build.media[0].url === 'PULSE_AGENT_PROTOCOL_VIDEO' ? (
                          <PulseMarketingVideo />
                        ) : build.media[0].url === 'PHANTOM_PEEL_PROTOCOL_VIDEO' ? (
                          <PhantomMarketingVideo />
                        ) : (
                          <video autoPlay loop muted playsInline>
                            <source src={build.media[0].url} type="video/mp4" />
                          </video>
                        )
                      ) : (
                        <img src={build.media[0].url} alt={build.media[0].caption} loading="lazy" />
                      )}
                    </div>
                    <div className="media-caption">
                      <span className="caption-icon">⬡</span>
                      {build.media[0].caption}
                    </div>
                  </div>

                  {/* Remaining Images/Videos in Grid */}
                  {build.media.length > 1 && (
                    <div className="media-grid">
                      {build.media.slice(1).map((item, i) => (
                        <div key={i} className={`media-card ${item.type === 'video' ? 'monitor-frame' : ''}`}>
                          <div className="media-card-inner">
                            {item.type === 'video' ? (
                              item.url === 'RIZEN_MOBILE_PROTOCOL_VIDEO' ? (
                                <RizenMarketingVideo />
                              ) : item.url === 'PULSE_AGENT_PROTOCOL_VIDEO' ? (
                                <PulseMarketingVideo />
                              ) : item.url === 'PHANTOM_PEEL_PROTOCOL_VIDEO' ? (
                                <PhantomMarketingVideo />
                              ) : (
                                <video autoPlay loop muted playsInline>
                                  <source src={item.url} type="video/mp4" />
                                </video>
                              )
                            ) : (
                              <img src={item.url} alt={item.caption} loading="lazy" />
                            )}
                          </div>
                          <div className="media-caption">
                            <span className="caption-icon">⬡</span>
                            {item.caption}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="media-placeholder">
                  <div className="placeholder-icon">📷</div>
                  <p>VISUAL_ASSETS_PENDING</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BuildDetail;



