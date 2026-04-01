import { useEffect, useState } from 'react';

interface ScannerOverlayProps {
  onScanComplete: () => void;
}

const SCAN_STAGES = [
  { text: 'ESTABLISHING SECURE LINK...', sub: 'INITIALIZING PROTOCOL' },
  { text: 'ANALYZING BIOMETRICS...', sub: 'VERIFYING IDENTITY MATRIX' },
  { text: 'ACCESS GRANTED', sub: 'WELCOME, CULTIVATOR' },
];

const ScannerOverlay = ({ onScanComplete }: ScannerOverlayProps) => {
  const [scannerFade, setScannerFade] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stage1 = setTimeout(() => setStage(1), 800);
    const stage2 = setTimeout(() => setStage(2), 1600);
    const fadeTimer = setTimeout(() => setScannerFade(true), 2200);
    const removeTimer = setTimeout(() => onScanComplete(), 2800);

    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onScanComplete]);

  const current = SCAN_STAGES[stage];

  return (
    <div className={`scanner-overlay ${scannerFade ? 'fade-out' : ''}`}>
      <div className="scan-grid"></div>
      <div className="scan-line"></div>
      <div className="scan-text-container">
        <div className="scan-text" key={stage} style={{ animation: 'fade-in-up 0.3s ease-out' }}>{current.text}</div>
        <div className="scan-subtext" key={`sub-${stage}`} style={{ animation: 'fade-in-up 0.3s ease-out 0.1s both' }}>{current.sub}</div>
        <div className="scan-progress" style={{ marginTop: '1.5rem', display: 'flex', gap: '6px', justifyContent: 'center' }}>
          {SCAN_STAGES.map((_, i) => (
            <div key={i} style={{
              width: '24px', height: '2px',
              background: i <= stage ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.15)',
              transition: 'background 0.3s ease',
              boxShadow: i <= stage ? '0 0 6px var(--accent-cyan)' : 'none'
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScannerOverlay;
