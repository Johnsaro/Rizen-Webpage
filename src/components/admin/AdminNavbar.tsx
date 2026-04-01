import React, { useState } from 'react';
import '../Navbar.css';

interface AdminNavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  adminName: string;
  onLogout: () => void;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ currentTab, setCurrentTab, adminName, onLogout }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleTab = (tab: string) => {
    setCurrentTab(tab);
    setMobileOpen(false);
  };

  return (
    <nav className="navbar scrolled admin-navbar" style={{ top: 0 }}>
      <div className="navbar-container">
        <div className="navbar-logo" style={{ color: 'var(--accent-crimson)' }}>
          RIZEN <span style={{ fontSize: '0.6rem', verticalAlign: 'middle', opacity: 0.6, marginLeft: '0.5rem', letterSpacing: '2px' }}>COMMAND_CENTER</span>
        </div>

        <div className={`navbar-links ${mobileOpen ? 'active' : ''}`} style={{ position: 'relative', top: 'auto', left: 'auto', right: 'auto', width: 'auto', height: 'auto', background: 'transparent', backdropFilter: 'none', transform: 'none', opacity: 1, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: '0.5rem', padding: 0 }}>
          <button
            className={`nav-item ${currentTab === 'overview' ? 'active' : ''}`}
            onClick={() => handleTab('overview')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >OVERVIEW</button>

          <button
            className={`nav-item ${currentTab === 'bounty' ? 'active' : ''}`}
            onClick={() => handleTab('bounty')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >BUG BOUNTY</button>

          <button
            className={`nav-item ${currentTab === 'users' ? 'active' : ''}`}
            onClick={() => handleTab('users')}
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >USERS</button>

          <div className="nav-actions">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div className="admin-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(244, 63, 94, 0.05)', padding: '0.4rem 0.75rem', borderRadius: '100px', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-crimson)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 10px rgba(244, 63, 94, 0.4)', flexShrink: 0 }}>
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="#fff" strokeWidth="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                </div>
                <span className="admin-name-text" style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', letterSpacing: '1px', color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>{adminName.toUpperCase()}</span>
                </span>
              </div>
              <button
                className="btn-nav-primary"
                style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', color: 'var(--accent-crimson)', whiteSpace: 'nowrap' }}
                onClick={onLogout}
              >
                DISCONNECT
              </button>
            </div>
          </div>
        </div>

        {/* Mobile hamburger for admin */}
        <button
          className="navbar-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
          aria-label="Toggle Admin Menu"
          aria-expanded={mobileOpen}
        >
          <div className={`hamburger ${mobileOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
