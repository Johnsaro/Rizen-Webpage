import { useState } from 'react';

interface PhoneMockupProps {
  phoneRef: React.RefObject<HTMLDivElement | null>;
}

const PhoneMockup = ({ phoneRef }: PhoneMockupProps) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="phone-mockup-container reveal" ref={phoneRef}>
      <div className="phone-frame">
        <div className="phone-notch"></div>
        <div className="phone-screen">
          {/* MOCK IN-APP UI */}
          <div className="mock-app-header">
            <div className="mock-avatar"></div>
            <div>
              <div className="mock-title">V0idWalker</div>
              <div className="mock-desc">Lvl 24 · Sec Admin</div>
            </div>
          </div>

          <div className={`mock-screen-content ${activeTab === 0 ? 'active' : ''}`}>
            <div className="mock-xp-bar-container">
              <div className="app-stats">
                <span>XP TO NEXT RANK</span>
                <span>8,450 / 10,000</span>
              </div>
              <div className="mock-xp-bg">
                <div className="mock-xp-fill"></div>
              </div>
            </div>

            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', margin: '20px 0 10px', color: 'var(--text-dim)' }}>ACTIVE PROTOCOLS (QUESTS)</div>

            <div className="mock-quest-card mock-anim-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="mock-title">Morning Routine</span>
                <span className="rank-class">+50 XP</span>
              </div>
              <div className="mock-desc">Stretch, Hydrate, Review Logs</div>
            </div>

            <div className="mock-quest-card mock-anim-2">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="mock-title">Deep Work Phase</span>
                <span className="rank-class">+200 XP</span>
              </div>
              <div className="mock-desc">90 mins uninterrupted coding</div>
              <div className="mock-progress-mini"><div className="mock-progress-fill-mini" style={{ width: '60%' }}></div></div>
            </div>
          </div>

          <div className={`mock-screen-content ${activeTab === 1 ? 'active' : ''}`}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', margin: '0 0 15px', color: 'var(--text-dim)' }}>PERFORMANCE METRICS [v4.2.0]</div>

            <div className="mock-stat-row">
              <div className="mock-stat-header">
                <div className="mock-stat-label">INTELLIGENCE</div>
                <div className="mock-stat-value">85/100</div>
              </div>
              <div className="mock-stat-bar-bg"><div className="mock-stat-bar-fill" style={{ width: '85%', background: 'var(--accent-cyan)' }}></div></div>
            </div>
            <div className="mock-stat-row">
              <div className="mock-stat-header">
                <div className="mock-stat-label">ENDURANCE</div>
                <div className="mock-stat-value">60/100</div>
              </div>
              <div className="mock-stat-bar-bg"><div className="mock-stat-bar-fill" style={{ width: '60%', background: 'var(--accent-emerald)' }}></div></div>
            </div>
            <div className="mock-stat-row">
              <div className="mock-stat-header">
                <div className="mock-stat-label">CONSISTENCY</div>
                <div className="mock-stat-value">92%</div>
              </div>
              <div className="mock-stat-bar-bg"><div className="mock-stat-bar-fill" style={{ width: '92%', background: 'var(--accent-indigo)' }}></div></div>
            </div>

            <div className="mock-radar-placeholder">
              <div className="mock-radar-circle"></div>
              <div className="mock-radar-circle" style={{ width: '60%', height: '60%' }}></div>
              <div className="mock-radar-shape"></div>
            </div>
          </div>

          <div className={`mock-screen-content ${activeTab === 2 ? 'active' : ''}`}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', margin: '0 0 15px', color: 'var(--text-dim)' }}>EQUIPPED ARSENAL</div>

            <div className="mock-quest-card">
              <span className="weapon-tag" style={{ fontSize: '0.6rem', marginBottom: '4px', display: 'block' }}>ACTIVE CAPABILITY</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mock-title">Auto-Recon Script</span>
                <span className="mock-rank-a" style={{ width: '20px', height: '20px', fontSize: '0.6rem' }}>A</span>
              </div>
            </div>

            <div className="mock-quest-card">
              <span className="weapon-tag" style={{ fontSize: '0.6rem', marginBottom: '4px', display: 'block' }}>PASSIVE BUFF</span>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="mock-title">Focus Stim</span>
                <span className="mock-rank-f" style={{ width: '20px', height: '20px', fontSize: '0.6rem', color: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)' }}>+</span>
              </div>
            </div>
          </div>

          <div className={`mock-screen-content ${activeTab === 3 ? 'active' : ''}`}>
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', margin: '0 0 15px', color: 'var(--text-dim)' }}>GUILD COMMS</div>
            <div className="mock-chat-bubble">NeoConstruct: Pushed the new auth zero-day patch.</div>
            <div className="mock-chat-bubble system">GhostWire ranked up to Lvl 42!</div>
            <div className="mock-chat-bubble me">Reviewing PRs now.</div>
          </div>

          <div className="mock-nav-bar">
            {[0, 1, 2, 3].map((tab) => (
              <div
                key={tab}
                className={`mock-nav-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              ></div>
            ))}
          </div>
        </div>
      </div>
      <div className="phone-shadow"></div>
    </div>
  );
};

export default PhoneMockup;
