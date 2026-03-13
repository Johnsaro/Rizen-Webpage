import React from 'react';
import '../Navbar.css';

interface AdminNavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  adminName: string;
  onLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ currentTab, setCurrentTab, adminName, onLogout }) => {
  return (
    <nav className="navbar scrolled admin-navbar">
      <div className="navbar-container">
        <div className="navbar-logo" style={{ color: 'var(--accent-crimson)' }}>
          RIZEN <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', opacity: 0.6, marginLeft: '0.5rem', letterSpacing: '2px' }}>COMMAND_CENTER</span>
        </div>

        <div className="navbar-links active">
          <button 
            className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`}
            onClick={() => setCurrentTab('overview')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >OVERVIEW</button>

          <button 
            className={`nav-item ${currentTab === 'bounty' ? 'active' : ''}`}
            onClick={() => setCurrentTab('bounty')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >BUG BOUNTY</button>

          <button 
            className={`nav-item ${currentTab === 'users' ? 'active' : ''}`}
            onClick={() => setCurrentTab('users')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >USER MANAGEMENT</button>

          <div className="nav-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.05)', padding: '0.4rem 1rem', borderRadius: '100px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-crimson)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)' }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="#fff" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)' }}>
                  ADMIN: <span style={{ color: '#fff', fontWeight: 600 }}>{adminName.toUpperCase()}</span>
                </span>
              </div>
              <button
                className="btn-nav-primary"
                style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-crimson)' }}
                onClick={onLogout}
              >
                DISCONNECT
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
