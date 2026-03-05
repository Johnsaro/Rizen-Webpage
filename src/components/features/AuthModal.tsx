import { useState } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'granted' | 'error'>('idle');

  const handleLogin = () => {
    if (isLoading) return;
    setIsLoading(true);
    setStatus('authenticating');

    // Simulate network request
    setTimeout(() => {
      setStatus('granted');
      setTimeout(() => {
        setIsLoading(false);
        setStatus('idle');
        onClose();
      }, 1000);
    }, 1500);
  };

  return (
    <div className={`auth-overlay ${isOpen ? 'open' : ''}`}>
      <div className="auth-modal">
        <button className="close-modal" aria-label="Close Node Access" onClick={onClose}>
          <span className="close-icon-text">×</span>
        </button>
        <div className="manifesto-glitch auth-title">NODE ACCESS</div>

        <div className="input-group">
          <input type="email" placeholder="OPERATIVE DESIGNATION (EMAIL)" className="auth-input" />
          <div className="input-helper">ENTER REGISTERED OPERATIVE IDENTIFIER</div>
        </div>

        <div className="input-group">
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="DECRYPTION KEY (PASSWORD)"
              className="auth-input"
            />
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                  <line x1="1" y1="1" x2="23" y2="23"></line>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
              )}
            </button>
          </div>
          <div className="input-helper">INPUT AUTHORIZED ACCESS KEY</div>
        </div>

        <button
          className={`auth-btn ${status !== 'idle' ? 'loading' : ''} ${status === 'granted' ? 'success' : ''}`}
          onClick={handleLogin}
          disabled={isLoading}
        >
          {status === 'idle' && 'ESTABLISH CONNECTION'}
          {status === 'authenticating' && 'AUTHENTICATING NODE...'}
          {status === 'granted' && 'ACCESS GRANTED'}
        </button>

        <div className="auth-divider"></div>

        <div className="auth-secondary-link">
          NEW RECRUIT? <span className="auth-link-text" onClick={onClose}>REQUEST INVITATION</span>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
