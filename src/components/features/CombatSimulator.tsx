
import type { CombatState } from '../../hooks/useCombatSim';
import './CombatSimulator.css';

interface CombatSimulatorProps {
  state: CombatState;
  playerHP: number;
  monsterHP: number;
  currentQuestionIndex: number;
  message: string;
  isAnimating: boolean;
  shakeTarget: 'player' | 'monster' | null;
  questions: { q: string, options: string[], answer: string }[];
  onStart: () => void;
  onAnswer: (option: string) => void;
}

const CombatSimulator = ({
  state,
  playerHP,
  monsterHP,
  currentQuestionIndex,
  message,
  isAnimating,
  shakeTarget,
  questions,
  onStart,
  onAnswer
}: CombatSimulatorProps) => {
  return (
    <div className="verification-interface reveal">
      {state === 'idle' && (
        <div className="verification-idle">
          <div className="protocol-icon pulse-cyan">
            <svg viewBox="0 0 24 24" width="48" height="48" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3 className="protocol-title">SKILL_VERIFICATION_REQUIRED</h3>
          <p className="protocol-desc">
            To authorize level progression, you must neutralize the <span className="text-accent-cyan">Stagnation Anomaly</span> through technical validation.
          </p>
          <button className="btn-protocol-primary" onClick={onStart}>INITIALIZE_ENGAGEMENT</button>
        </div>
      )}

      {state === 'active' && (
        <div className="engagement-arena">
          <div className="engagement-header">
            <div className="engagement-status">
              <span className="status-label">ENGAGEMENT_LOG:</span>
              <span className="status-value">{message}</span>
            </div>
          </div>

          <div className="engagement-grid">
            {/* Operative Stats */}
            <div className={`engagement-card operative-card ${shakeTarget === 'player' ? 'shake-intense' : ''}`}>
              <div className="card-header">
                <span className="card-tag">CULTIVATOR_INTEGRITY</span>
                <span className="card-percent">{playerHP}%</span>
              </div>
              <div className="integrity-bar">
                <div
                  className="integrity-fill"
                  style={{ width: `${playerHP}%`, background: playerHP > 35 ? '#00f3ff' : '#ff0055' }}
                ></div>
              </div>
              <div className="operative-meta">
                <div className="meta-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div className="meta-label">CULTIVATOR_STATUS: ACTIVE</div>
              </div>
            </div>

            <div className="engagement-vs-divider">
              <div className="vs-line"></div>
              <span className="vs-text">VS</span>
              <div className="vs-line"></div>
            </div>

            {/* Anomaly Stats */}
            <div className={`engagement-card anomaly-card ${shakeTarget === 'monster' ? 'shake-intense' : ''}`}>
              <div className="card-header">
                <span className="card-tag">ANOMALY_DENSITY</span>
                <span className="card-percent">{monsterHP}%</span>
              </div>
              <div className="integrity-bar">
                <div
                  className="integrity-fill"
                  style={{ width: `${monsterHP}%`, background: '#ff0055' }}
                ></div>
              </div>
              <div className="operative-meta meta-red">
                <div className="meta-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    <line x1="12" y1="9" x2="12" y2="13"></line>
                    <line x1="12" y1="17" x2="12.01" y2="17"></line>
                  </svg>
                </div>
                <div className="meta-label">STAGNATION_DETECTED</div>
              </div>
            </div>
          </div>

          <div className="validation-terminal">
            <div className="terminal-prompt">
              <span className="prompt-prefix">QUERY_INPUT:</span>
              <h4 className="prompt-text">{questions[currentQuestionIndex].q}</h4>
            </div>
            <div className="validation-options">
              {questions[currentQuestionIndex].options.map((option: string, i: number) => (
                <button
                  key={i}
                  className="validation-option-btn"
                  onClick={() => onAnswer(option)}
                  disabled={isAnimating}
                >
                  <span className="option-index">[{i + 1}]</span>
                  <span className="option-text">{option}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(state === 'victory' || state === 'defeat') && (
        <div className="engagement-result">
          <div className={`result-icon ${state === 'victory' ? 'result-success' : 'result-failure'}`}>
            {state === 'victory' ? (
              <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="64" height="64" stroke="currentColor" strokeWidth="1.5" fill="none">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
          </div>
          <h3 className={`result-title ${state === 'victory' ? 'text-emerald' : 'text-red'}`}>
            {state === 'victory' ? 'ENGAGEMENT_SUCCESSFUL' : 'ENGAGEMENT_FAILED'}
          </h3>
          <p className="result-desc">{message}</p>
          <div className="result-actions">
            <button className="btn-protocol-secondary" onClick={onStart}>RE-INITIALIZE_LINK</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombatSimulator;
