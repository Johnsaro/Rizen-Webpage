import { useState, useEffect } from 'react';
import type { VaultItem } from '../../data/vaultContent';

interface VaultReaderProps {
  item: VaultItem | null;
  onClose: () => void;
}

const VaultReader = ({ item, onClose }: VaultReaderProps) => {
  const [decrypting, setDecrypting] = useState(true);

  useEffect(() => {
    let timer1: number;
    let timer2: number;

    if (item) {
      // Defer state update to avoid 'set-state-in-effect' warning
      timer1 = setTimeout(() => setDecrypting(true), 0);
      timer2 = setTimeout(() => setDecrypting(false), 800);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [item]);

  if (!item) return null;

  return (
    <div className={`vault-overlay ${item ? 'open' : ''}`}>
      <div className="vault-modal">
        <div className="vault-header">
          <div className="vault-title-group">
            <span className="vault-label">GUILD_INTEL_VAULT</span>
            <h2 className="vault-item-name">{item.name}</h2>
          </div>
          <button className="close-vault" onClick={onClose}>&times; CLOSE_LINK</button>
        </div>

        <div className="vault-content-grid">
          {/* Sidebar Specs */}
          <div className="vault-sidebar">
            <div className="spec-item">
              <span className="spec-label">INTEL_RANK</span>
              <span className={`mock-rank-${item.rank.toLowerCase()}`}>{item.rank}</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">OBJECT_TYPE</span>
              <span className="spec-value">{item.type}</span>
            </div>
            {item.technicalSpecs.map((spec, i) => (
              <div key={i} className="spec-item">
                <span className="spec-label">{spec.label}</span>
                <span className="spec-value">{spec.value}</span>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="vault-main">
            {decrypting ? (
              <div className="decryption-sequence">
                <div className="scrambling-text">DECRYPTING_DATA_BLOB...</div>
                <div className="vault-progress-bg">
                  <div className="vault-progress-fill"></div>
                </div>
              </div>
            ) : (
              <div className="intel-reveal animate-fade-in">
                <h3 className="intel-title">{item.content.title}</h3>
                <p className="intel-description">{item.content.description}</p>

                {item.content.codeBlock && (
                  <div className="intel-code-block">
                    <div className="code-header"><span>EXEC_TERMINAL</span></div>
                    <pre><code>{item.content.codeBlock}</code></pre>
                  </div>
                )}

                {item.content.dataPoints && (
                  <div className="intel-data-grid">
                    {item.content.dataPoints.map((point, i) => (
                      <div key={i} className="data-point-row">
                        <span className="data-prefix"># {i + 1}</span>
                        <span className="data-text">{point}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="vault-footer-actions">
                  <button className="btn-secondary small-btn">DOWNLOAD_INTEL (PDF)</button>
                  <button className="btn-primary small-btn">INITIATE_UPGRADE</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultReader;
