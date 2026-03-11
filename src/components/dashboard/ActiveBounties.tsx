import React from 'react';
import type { BountySubmission } from '../../hooks/usePlayerProfile';

interface ActiveBountiesProps {
  bounties: BountySubmission[];
  delay?: number;
}

const ActiveBounties: React.FC<ActiveBountiesProps> = ({ bounties, delay = 0.25 }) => {
  if (bounties.length === 0) return null;

  return (
    <div className="dash-card bounties-card fade-in-up" style={{ animationDelay: `${delay}s`, marginTop: '1rem' }}>
      <div className="card-header">
        <h3 className="card-title">ACTIVE_INTEL_MISSIONS</h3>
        <div className="header-status">{bounties.length} PENDING</div>
      </div>

      <div className="bounty-mission-list">
        {bounties.slice(0, 3).map((bounty) => (
          <div key={bounty.id} className="bounty-mission-item">
            <div className="bounty-mission-info">
              <div className="bounty-mission-title">{bounty.title}</div>
              <div className="bounty-mission-meta">
                <span className={`severity-dot ${bounty.severity.toLowerCase()}`}></span>
                {bounty.severity.toUpperCase()} · {new Date(bounty.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className={`bounty-status-tag status-${bounty.status.toLowerCase()}`}>
              {bounty.status.toUpperCase()}
            </div>
          </div>
        ))}
        {bounties.length > 3 && (
          <div className="bounty-more-link" onClick={() => window.location.hash = '#/community/events/bug-bounty-v1'}>
            + {bounties.length - 3} MORE REPORTS IN PROGRESS
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveBounties;
