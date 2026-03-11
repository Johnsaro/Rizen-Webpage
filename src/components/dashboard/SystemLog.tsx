import React from 'react';
import type { PlayerNotification } from '../../hooks/usePlayerProfile';

interface SystemLogProps {
  notifications: PlayerNotification[];
  delay?: number;
}

const SystemLog: React.FC<SystemLogProps> = ({ notifications, delay = 0.7 }) => {
  return (
    <div className="dash-card system-log-card fade-in-up" style={{ animationDelay: `${delay}s`, marginTop: '1.5rem' }}>
      <div className="card-header">
        <h3 className="card-title">OPERATIONAL_LEDGER</h3>
        <div className="header-status">LIVE_FEED</div>
      </div>
      
      <div className="system-log-content">
        {notifications.length === 0 ? (
          <div className="log-empty-state">
            <span className="log-cursor">&gt;</span> NO_NEW_ENTRIES_FOUND...
          </div>
        ) : (
          <div className="log-entries">
            {notifications.map((notif, i) => (
              <div key={notif.id} className="log-entry-row" style={{ animationDelay: `${delay + 0.1 + (i * 0.05)}s` }}>
                <span className="log-timestamp">[{new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}]</span>
                <span className={`log-type type-${notif.type.toLowerCase()}`}>{notif.type.toUpperCase()}</span>
                <span className="log-msg">{notif.message}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="log-footer">
        <div className="log-scan-line"></div>
        <span className="log-path">C:\RIZEN\CORE\LOGS\SYSTEM.LOG</span>
      </div>
    </div>
  );
};

export default SystemLog;
