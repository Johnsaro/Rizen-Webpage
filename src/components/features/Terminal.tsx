import { useRef, useEffect, useState } from 'react';
import type { LogEntry } from '../../hooks/useTerminal';
import type { InitiationStep, InitiationQuestion } from '../../hooks/useInitiation';

interface TerminalProps {
  log: LogEntry[];
  inputValue: string;
  setInputValue: (val: string) => void;
  isProcessing: boolean;
  isQiSurging?: boolean;
  onReportTask: (e: React.FormEvent) => void;
  initiationStep: InitiationStep;
  initiationQuestions: InitiationQuestion[];
  onInitiationAnswer: (answer: string) => void;
  isScanned?: boolean;
}

const Terminal = ({
  log,
  inputValue,
  setInputValue,
  isProcessing,
  isQiSurging,
  onReportTask,
  initiationStep,
  initiationQuestions,
  onInitiationAnswer,
  isScanned
}: TerminalProps) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [sessionID] = useState(() => Math.floor(Math.random() * 90000) + 10000);

  const rawQuizQuestion = initiationQuestions.find(q => q.id === initiationStep);
  const isQuestionLogged = rawQuizQuestion ? log.some(entry => entry.text === rawQuizQuestion.text) : false;
  const currentQuizQuestion = isQuestionLogged ? rawQuizQuestion : null;
  const isInitiating = initiationStep !== 'IDLE' && initiationStep !== 'COMPLETE';

  useEffect(() => {
    if (logEndRef.current && logEndRef.current.parentElement) {
      const parent = logEndRef.current.parentElement;
      parent.scrollTo({
        top: parent.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [log]);

  useEffect(() => {
    if (isScanned && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isScanned]);

  // Helper to identify if a system message is a main prompt/question (to make it stand out)
  const isPrompt = (text: string) => {
    return text.includes('?') || text.includes('ACTIVATED') || text.includes('WELCOME');
  };

  return (
    <div className={`guild-master-terminal reveal ${isQiSurging ? 'qi-surge' : ''}`}>
      <div className="terminal-header">
        <div className="terminal-header-left">
          <div className="terminal-signal">
            <span className="pulse-dot"></span>
          </div>
          <span className="terminal-title">SYSTEM_LINK [PID:{sessionID}]</span>
        </div>
        <span className={`terminal-status ${isProcessing ? 'processing' : ''}`}>
          {isProcessing ? 'ANALYZING_PKT...' : 'LINK_ESTABLISHED'}
        </span>
      </div>

      <div className="terminal-log">
        {log.map((entry, i) => {
          const isSystem = entry.sender === 'system';
          const promptClass = isSystem && isPrompt(entry.text) ? 'is-prompt' : '';

          return (
            <div key={i} className={`log-entry ${entry.sender} ${promptClass}`}>
              <div className="log-text">{entry.text}</div>

              {isSystem && entry.rank && (
                <div className="log-rewards">
                  <span className={`mock-rank-${entry.rank.toLowerCase()}`}>{entry.rank}</span>
                  <span className="reward-xp">+{entry.qi} Qi</span>
                </div>
              )}
            </div>
          );
        })}
        <div ref={logEndRef} />
      </div>

      <div className="terminal-footer">
        {currentQuizQuestion ? (
          <div className="terminal-quiz-options">
            {currentQuizQuestion.options.map((opt, i) => (
              <button
                key={i}
                className="quiz-option-btn"
                onClick={() => onInitiationAnswer(opt)}
              >
                <span className="quiz-option-prefix">[{i + 1}]</span>
                <span className="quiz-option-text">{opt}</span>
              </button>
            ))}
          </div>
        ) : isInitiating ? (
          <div className="terminal-input-form" style={{ minHeight: '38px' }} />
        ) : (
          <form className="terminal-input-form" onSubmit={onReportTask}>
            <span className="input-prefix">&gt;</span>
            <input
              ref={inputRef}
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
    </div>
  );
};

export default Terminal;
