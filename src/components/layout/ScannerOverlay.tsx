import { useEffect, useState } from 'react';

interface ScannerOverlayProps {
  onScanComplete: () => void;
}

const ScannerOverlay = ({ onScanComplete }: ScannerOverlayProps) => {
  const [scannerFade, setScannerFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setScannerFade(true);
    }, 600);

    const removeTimer = setTimeout(() => {
      onScanComplete();
    }, 1000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [onScanComplete]);

  return (
    <div className={`scanner-overlay ${scannerFade ? 'fade-out' : ''}`}>
      <div className="scan-grid"></div>
      <div className="scan-line"></div>
      <div className="scan-text-container">
        <div className="scan-text">ANALYZING BIOMETRICS...</div>
        <div className="scan-subtext">AUTHORIZED ACCESS ONLY</div>
      </div>
    </div>
  );
};

export default ScannerOverlay;
