import React, { useState, useEffect } from 'react';
import './PulseMarketingVideo.css';

const PulseMarketingVideo: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % totalSteps);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pulse-marketing-video">
      <div className="pulse-data-overlay"></div>

      {/* Step 0: The Identity */}
      <div className={`pulse-layer ${step === 0 ? 'active' : ''}`}>
        <img src="/assets/builds/bot_agent-removebg-preview.png" alt="Pulse Agent" className="pulse-agent-mascot" loading="lazy" />
        <h2 className="pulse-agent-title">PULSE AGENT</h2>
        <p className="pulse-agent-tagline">Autonomous Desktop Guardian</p>
      </div>

      {/* Step 1: The Rizen Connection */}
      <div className={`pulse-layer ${step === 1 ? 'active' : ''}`}>
        <div className="pulse-feature-card">
          <div className="pulse-feature-icon">🛡️</div>
          <h3 className="pulse-feature-name">RIZEN AGENT CORE</h3>
          <p className="pulse-feature-desc">
            An extension of the Rizen Mobile Protocol for desktop environments. Monitors operative health and productivity in real-time.
          </p>
        </div>
      </div>

      {/* Step 2: Dashboard Preview */}
      <div className={`pulse-layer ${step === 2 ? 'active' : ''}`}>
        <h3 className="pulse-agent-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>PULSE HUB: LIVE ANALYTICS</h3>
        <div className="pulse-agent-preview">
          <img src="/assets/builds/pulse-app-dashboard.png" alt="Pulse Dashboard" loading="lazy" />
        </div>
      </div>

      {/* Step 3: Enforcement Logic */}
      <div className={`pulse-layer ${step === 3 ? 'active' : ''}`}>
        <div className="pulse-feature-card">
          <div className="pulse-feature-icon">⚡</div>
          <h3 className="pulse-feature-name">SILENT ENFORCEMENT</h3>
          <p className="pulse-feature-desc">
            Autonomous activity tracking, focus preservation, and adaptive break management. The ultimate desktop productivity companion.
          </p>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.5 }}>
          v2.0 // DEPLOYED & OPERATIONAL
        </div>
      </div>

      <div className="pulse-status-indicator">
        <div className="pulse-status-dot"></div>
        <span>AGENT_ONLINE</span>
      </div>
    </div>
  );
};

export default PulseMarketingVideo;
