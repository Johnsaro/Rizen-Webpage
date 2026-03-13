import React from 'react';

interface BannedScreenProps {
  status: 'banned' | 'suspended';
  reason?: string;
  until?: string;
  onLogout: () => void;
}

const BannedScreen: React.FC<BannedScreenProps> = ({ status, reason, until, onLogout }) => {
  const isBanned = status === 'banned';
  
  return (
    <div className="abc-gate" style={{ background: '#050505' }}>
      <div className="glitch-text" data-text={isBanned ? "ACCESS REVOKED" : "TEMPORARILY LOCKED OUT"} style={{ color: 'var(--accent-crimson)', fontSize: '3rem' }}>
        {isBanned ? "ACCESS REVOKED" : "TEMPORARILY LOCKED OUT"}
      </div>
      
      <div className="status-tag" style={{ background: 'rgba(244, 63, 94, 0.1)', color: 'var(--accent-crimson)', border: '1px solid var(--accent-crimson)', padding: '0.5rem 1.5rem', marginTop: '2rem' }}>
        ACCOUNT_STATUS: {status.toUpperCase()}
      </div>

      <div className="manifesto-box" style={{ maxWidth: '600px', marginTop: '3rem', borderLeft: '2px solid var(--accent-crimson)' }}>
        <div className="manifesto-glitch" style={{ color: 'var(--accent-crimson)' }}>INTEL_REPORT</div>
        <div className="manifesto-text" style={{ color: '#fff', opacity: 0.9 }}>
          Your operative credentials have been flagged for system violations.
          {reason && (
            <div style={{ marginTop: '1.5rem' }}>
              <span style={{ color: 'var(--accent-crimson)', fontWeight: 'bold' }}>REASON:</span> {reason}
            </div>
          )}
          {!isBanned && until && (
            <div style={{ marginTop: '1rem' }}>
              <span style={{ color: 'var(--accent-amber)', fontWeight: 'bold' }}>LOCKOUT_RECOVERY:</span> {new Date(until).toLocaleString()}
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem' }}>
        <button className="terminal-button" onClick={onLogout} style={{ border: '1px solid var(--accent-crimson)', color: 'var(--accent-crimson)' }}>
          DISCONNECT_FROM_CORE
        </button>
        <button className="terminal-button" onClick={() => window.location.reload()}>
          RE-VERIFY_INTEGRITY
        </button>
      </div>

      <div className="log-scan-line" style={{ background: 'var(--accent-crimson)', boxShadow: '0 0 10px var(--accent-crimson)' }}></div>
    </div>
  );
};

export default BannedScreen;
