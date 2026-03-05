import type { CombatState } from '../../hooks/useCombatSim';

interface CombatSimulatorProps {
  state: CombatState;
  playerHP: number;
  monsterHP: number;
  currentQuestionIndex: number;
  message: string;
  isAnimating: boolean;
  shakeTarget: 'player' | 'monster' | null;
  questions: any[];
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
    <div className="glass-card reveal" style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
      {state === 'idle' && (
        <div className="combat-idle">
          <div className="glitch-icon" style={{ fontSize: '4rem', marginBottom: '2rem' }}>👻</div>
          <h3>THREAT DETECTED: LEVEL 1 TIME WRAITH</h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>Defeat the anomaly by answering technical questions correctly.</p>
          <button className="btn-primary" onClick={onStart}>INITIALIZE SIMULATION</button>
        </div>
      )}

      {state === 'active' && (
        <div className="combat-arena">
          <div className="combat-status-bar">
            <span>{message}</span>
          </div>

          <div className="combat-fighters">
            {/* Player Side */}
            <div className={`combat-fighter ${shakeTarget === 'player' ? 'shake' : ''}`}>
              <div className="fighter-name">RECRUIT (YOU)</div>
              <div className="health-bar-container">
                <div 
                  className="health-bar-fill" 
                  style={{ 
                    width: `${playerHP}%`, 
                    background: playerHP > 35 ? 'var(--accent-emerald)' : 'var(--accent-crimson)' 
                  }}
                ></div>
              </div>
              <div className="fighter-avatar pulse-border">🥷</div>
            </div>

            <div className="combat-vs">VS</div>

            {/* Monster Side */}
            <div className={`combat-fighter ${shakeTarget === 'monster' ? 'shake' : ''}`}>
              <div className="fighter-name" style={{ color: 'var(--accent-crimson)' }}>TIME WRAITH</div>
              <div className="health-bar-container">
                <div 
                  className="health-bar-fill" 
                  style={{ 
                    width: `${monsterHP}%`, 
                    background: monsterHP > 35 ? 'var(--accent-crimson)' : 'darkred' 
                  }}
                ></div>
              </div>
              <div className="fighter-avatar monster-glitch">👻</div>
            </div>
          </div>

          <div className="combat-question-box">
            <h4>{questions[currentQuestionIndex].q}</h4>
            <div className="combat-options">
              {questions[currentQuestionIndex].options.map((option: string, i: number) => (
                <button
                  key={i}
                  className="combat-option-btn"
                  onClick={() => onAnswer(option)}
                  disabled={isAnimating}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {(state === 'victory' || state === 'defeat') && (
        <div className="combat-result">
          <div className="glitch-icon" style={{ fontSize: '4rem', marginBottom: '2rem' }}>
            {state === 'victory' ? '🏆' : '💀'}
          </div>
          <h3 style={{ color: state === 'victory' ? 'var(--accent-emerald)' : 'var(--accent-crimson)' }}>
            {state === 'victory' ? 'VICTORY' : 'DEFEAT'}
          </h3>
          <p style={{ color: 'var(--text-dim)', marginBottom: '2rem' }}>{message}</p>
          <button className="btn-secondary" onClick={onStart}>RETRY SIMULATION</button>
        </div>
      )}
    </div>
  );
};

export default CombatSimulator;
