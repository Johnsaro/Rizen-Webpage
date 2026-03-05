import { useRef, useEffect, useState } from 'react';
import type { LogEntry } from '../../hooks/useTerminal';
import type { InitiationStep, InitiationQuestion } from '../../hooks/useInitiation';

interface TerminalProps {
  log: LogEntry[];
  inputValue: string;
  setInputValue: (val: string) => void;
  isProcessing: boolean;
  onReportTask: (e: React.FormEvent) => void;
  initiationStep: InitiationStep;
  initiationQuestions: InitiationQuestion[];
  onInitiationAnswer: (answer: string) => void;
}

const Terminal = ({
  log,
  inputValue,
  setInputValue,
  isProcessing,
  onReportTask,
  initiationStep,
  initiationQuestions,
  onInitiationAnswer
}: TerminalProps) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const [sessionID] = useState(() => Math.floor(Math.random() * 90000) + 10000);

  const currentQuizQuestion = initiationQuestions.find(q => q.id === initiationStep);

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      const parent = logEndRef.current.parentElement;
      parent.scrollTo({
        top: parent.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [log]);

  return (
    <div className="guild-master-terminal reveal">
      <div className="terminal-header">
        <div className="terminal-header-left">
          <span className="terminal-title">GUILD_MASTER_LINK [PID:{sessionID}]</span>
        </div>
        <span className={`terminal-status ${isProcessing ? 'processing' : ''}`}>
          {isProcessing ? 'ANALYZING_PKT...' : 'LINK_ESTABLISHED'}
        </span>
      </div>
      <div className="terminal-log">
        {log.map((entry, i) => (
          <div key={i} className={`log-entry ${entry.sender}`}>
            {entry.sender === 'system' ? (
              <>
                <span className="log-prefix">&gt; </span>
                <span className="log-text">{entry.text}</span>
                {entry.rank && (
                  <div className="log-rewards">
                    <span className={`mock-rank-${entry.rank.toLowerCase()}`}>{entry.rank}</span>
                    <span className="reward-xp">+{entry.xp} XP</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <span className="log-text">{entry.text}</span>
                <span className="log-prefix"> &lt;</span>
              </>
            )}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>

      {currentQuizQuestion ? (
        <div className="terminal-quiz-options">
          {currentQuizQuestion.options.map((opt, i) => (
            <button
              key={i}
              className="quiz-option-btn"
              onClick={() => onInitiationAnswer(opt)}
            >
              [{i + 1}] {opt}
            </button>
          ))}
        </div>
      ) : (
        <form className="terminal-input-form" onSubmit={onReportTask}>
          <span className="input-prefix">&gt;</span>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="REPORT REAL-WORLD TASK..."
            disabled={isProcessing}
            className="terminal-input"
          />
          <button
            type="submit"
            className="terminal-submit-btn"
            disabled={isProcessing || !inputValue.trim()}
          >
            SEND
          </button>
        </form>
      )}
    </div>
  );
};

export default Terminal;
