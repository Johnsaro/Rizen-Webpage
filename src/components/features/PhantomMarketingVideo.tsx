import React, { useState, useEffect } from 'react';
import './PhantomMarketingVideo.css';

const PhantomMarketingVideo: React.FC = () => {
  const [step, setStep] = useState(0);
  const totalSteps = 4;

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % totalSteps);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="phantom-marketing-video">
      <div className="phantom-grid-overlay"></div>
      <div className="phantom-scanner-line"></div>

      {/* Step 0: The Product Name */}
      <div className={`phantom-layer ${step === 0 ? 'active' : ''}`}>
        <h2 className="phantom-title">PHANTOM PEEL</h2>
        <p className="phantom-tagline">Kernel Forensics Interface</p>
      </div>

      {/* Step 1: The Purpose */}
      <div className={`phantom-layer ${step === 1 ? 'active' : ''}`}>
        <div className="phantom-info-box">
          <div className="phantom-info-title">
            <span style={{ color: '#ff0055' }}>[01]</span> DEEP KERNEL ANALYSIS
          </div>
          <p className="phantom-info-desc">
            Autonomous identification of driver artifacts, hardware identity mismatches, and spoofer traces. Built for high-integrity security validation.
          </p>
        </div>
      </div>

      {/* Step 2: The Interface */}
      <div className={`phantom-layer ${step === 2 ? 'active' : ''}`}>
        <div className="phantom-preview-frame">
          <img src="/assets/builds/Phantom_peel.png" alt="Phantom Peel Interface" />
        </div>
        <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.8rem', letterSpacing: '0.2rem' }}>
          SYSTEM_SCAN_IN_PROGRESS
        </p>
      </div>

      {/* Step 3: The Connection */}
      <div className={`phantom-layer ${step === 3 ? 'active' : ''}`}>
        <div className="phantom-info-box">
          <div className="phantom-info-title">
            <span style={{ color: '#ff0055' }}>[02]</span> RIZEN SECURITY SUB-PRODUCT
          </div>
          <p className="phantom-info-desc">
            A specialized forensics utility within the Rizen ecosystem, ensuring system baseline integrity for high-stakes operative environments.
          </p>
        </div>
        <div style={{ marginTop: '2rem', fontSize: '0.8rem', opacity: 0.4 }}>
          v1.1 // STABLE_DISTRIBUTION
        </div>
      </div>
    </div>
  );
};

export default PhantomMarketingVideo;
