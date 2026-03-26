import React, { useEffect, useRef } from 'react';
import type { PlayerNotification } from '../../hooks/usePlayerProfile';
import { useLedgerTerminal } from '../../hooks/useLedgerTerminal';

interface SystemLogProps {
  notifications: PlayerNotification[];
  playerName?: string;
  delay?: number;
}

const SystemLog: React.FC<SystemLogProps> = ({ notifications, playerName = 'francis', delay = 0.7 }) => {
  const {
    history,
    inputValue,
    setInputValue,
    executeCommand,
    handleKeyDown,
    terminalUser
  } = useLedgerTerminal(notifications, playerName);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when history updates
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      executeCommand(inputValue);
      setInputValue('');
    }
  };

  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div 
      className="dash-card system-log-card fade-in-up" 
      style={{ animationDelay: `${delay}s`, marginTop: '1.5rem' }}
      onClick={focusInput}
    >
      <div className="terminal-top-bar">
        <span className="terminal-dot red"></span>
        <span className="terminal-dot yellow"></span>
        <span className="terminal-dot green"></span>
        <span className="terminal-title">{terminalUser}:~</span>
      </div>
      
      <div className="system-log-content" ref={scrollRef}>
        <div className="term-init">
          <span className="term-prompt">{terminalUser}:~$</span> 
          <span className="term-cmd"> ./init_ledger.sh --live-feed</span>
        </div>
        <div className="term-response">
          &gt; INITIATING OPERATIONAL_LEDGER... <br/>
          &gt; ESTABLISHING SECURE CONNECTION... <span className="term-ok">[OK]</span><br/>
          &gt; LIVE_FEED: <span className="term-active">ACTIVE</span>
        </div>
        <div className="term-divider">==================================================</div>

        <div className="log-entries">
          {history.map((entry) => (
            <div key={entry.id} className="log-entry-row">
              {entry.type === 'user' ? (
                <div className="user-cmd-line">
                  <span className="term-prompt">{terminalUser}:~$</span>
                  <span className="term-cmd">{entry.message}</span>
                </div>
              ) : entry.type === 'command_output' ? (
                <div className={`command-output-msg ${entry.style || ''}`}>
                  {entry.message.split('\n').map((line, i) => (
                    <div key={i}>{line}</div>
                  ))}
                </div>
              ) : entry.type === 'system' ? (
                <div className="system-msg">
                  &gt; {entry.message}
                </div>
              ) : (
                <>
                  <span className="log-timestamp">[{entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}]</span>
                  <span className={`log-type ${entry.style || ''}`}>&lt;{entry.label}&gt;</span>
                  <span className="log-msg">{entry.message}</span>
                </>
              )}
            </div>
          ))}
          
          {history.length === 0 && (
            <div className="log-empty-state">
              &gt; AWAITING_NEW_ENTRIES...
            </div>
          )}
        </div>

        <form className="terminal-input-line" onSubmit={handleSubmit}>
          <span className="term-prompt">{terminalUser}:~$</span>
          <input
            ref={inputRef}
            type="text"
            className="terminal-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
            autoComplete="off"
          />
        </form>
      </div>

      <div className="log-scan-line"></div>
      <div className="crt-overlay"></div>
    </div>
  );
};

export default SystemLog;
