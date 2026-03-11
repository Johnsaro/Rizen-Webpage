import React, { useState, useEffect } from 'react';
import './RizenMarketingVideo.css';

const RizenMarketingVideo: React.FC = () => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 4000), // Boot -> Profile
      setTimeout(() => setStep(2), 8000), // Profile -> Quests
      setTimeout(() => setStep(3), 12000), // Quests -> Combat
      setTimeout(() => setStep(4), 16000), // Combat -> Finale
      setTimeout(() => setStep(0), 22000), // Loop back
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, [step === 0]);

  return (
    <div className="rizen-marketing-video">
      {/* Step 0: Booting */}
      <div className={`video-layer ${step === 0 ? 'active' : ''}`}>
        <div className="boot-text">INITIALIZING RIZEN_MOBILE_PROTOCOL...</div>
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
      </div>

      {/* Step 1: Character Profile */}
      <div className={`video-layer ${step === 1 ? 'active' : ''}`}>
        <div className="boot-text">CHARACTER_SYNC: [OPERATIVE_DATA]</div>
        <div className="app-screen">
          <img src="/assets/builds/rizen-ss1.png" alt="Profile" />
          <div className="scan-line"></div>
        </div>
      </div>

      {/* Step 2: Quest Board */}
      <div className={`video-layer ${step === 2 ? 'active' : ''}`}>
        <div className="boot-text">FETCHING_QUEST_BOARD...</div>
        <div className="app-screen">
          <img src="/assets/builds/rizen-ss2.png" alt="Quests" />
          <div className="scan-line"></div>
        </div>
      </div>

      {/* Step 3: Combat */}
      <div className={`video-layer ${step === 3 ? 'active' : ''}`}>
        <div className="boot-text alert-red">NEURAL_BREACH_DETECTED!</div>
        <div className="app-screen">
          <img src="/assets/builds/rizen-ss3.png" alt="Combat" />
          <div className="scan-line" style={{ background: '#ff0055', boxShadow: '0 0 10px #ff0055' }}></div>
        </div>
      </div>

      {/* Step 4: Finale */}
      <div className={`video-layer ${step === 4 ? 'active' : ''}`}>
        <img src="/assets/builds/rizen-logo.png" alt="Rizen Logo" className="final-logo" />
        <div className="boot-text" style={{ marginTop: '2rem' }}>RIZEN MOBILE PROTOCOL</div>
        <div className="protocol-status">[PROTOCOL_STATUS: ACTIVE]</div>
      </div>

      {/* Cinematic Overlay */}
      <div className="cinematic-overlay"></div>
    </div>
  );
};

export default RizenMarketingVideo;
