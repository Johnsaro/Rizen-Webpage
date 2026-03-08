import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: () => void;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'granted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    class: 'Security Analyst'
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    setIsLoading(true);
    setStatus('authenticating');
    setErrorMessage('');

    try {
      let result;
      if (mode === 'login') {
        result = await signIn(formData.email, formData.password);
      } else {
        result = await signUp(formData.email, formData.password, { 
          full_name: formData.name,
          class: formData.class 
        });
      }

      if (result.error) {
        throw result.error;
      }

      setStatus('granted');
      
      // Success delay for animation
      setTimeout(() => {
        setIsLoading(false);
        setStatus('idle');
        if (onLoginSuccess) {
          onLoginSuccess();
        }
        onClose();
        // Reset form to login state when closed automatically
        setTimeout(() => setMode('login'), 300);
      }, 1000);

    } catch (err: any) {
      console.error('Auth error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Authentication Failed');
      setIsLoading(false);
      
      // Reset status to idle after a few seconds so user can try again
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrorMessage('');
    setStatus('idle');
  };

  return (
    <div className={`auth-overlay ${isOpen ? 'open' : ''}`}>
      <div className="auth-modal">
        <button className="close-modal" aria-label="Close Node Access" onClick={onClose}>
          <span className="close-icon-text">×</span>
        </button>
        <div className="manifesto-glitch auth-title">
          {mode === 'login' ? 'NODE ACCESS' : 'REQUEST INVITATION'}
        </div>

        <form onSubmit={handleAuth} style={{ width: '100%' }}>
          {mode === 'register' && (
            <div className="input-group">
              <input
                type="text"
                required
                placeholder="DISPLAY NAME"
                className="auth-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="input-helper">ENTER PUBLIC HANDLE</div>
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              required
              placeholder="OPERATIVE DESIGNATION (EMAIL)"
              className="auth-input"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <div className="input-helper">ENTER REGISTERED OPERATIVE IDENTIFIER</div>
          </div>

          <div className="input-group">
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="DECRYPTION KEY (PASSWORD)"
                className="auth-input"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

          {mode === 'register' && (
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <select
                className="auth-input"
                style={{ appearance: 'none', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer' }}
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              >
                <option value="Security Analyst">Security Analyst</option>
                <option value="Software Engineer">Software Engineer</option>
                <option value="Web Developer">Web Developer</option>
                <option value="Game Developer">Game Developer</option>
              </select>
              <div className="input-helper">INITIAL DISCIPLINE PREFERENCE</div>
            </div>
          )}

          {errorMessage && (
            <div className="auth-error-message" style={{ color: 'var(--accent-crimson)', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'Fira Code' }}>
              ERROR: {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className={`auth-btn ${status !== 'idle' ? 'loading' : ''} ${status === 'granted' ? 'success' : ''} ${status === 'error' ? 'error' : ''}`}
            disabled={isLoading}
            style={status === 'error' ? { backgroundColor: 'var(--accent-crimson)', color: '#fff' } : {}}
          >
            {status === 'idle' && (mode === 'login' ? 'ESTABLISH CONNECTION' : 'REQUEST ACCESS')}
            {status === 'authenticating' && 'AUTHENTICATING NODE...'}
            {status === 'granted' && 'ACCESS GRANTED'}
            {status === 'error' && 'CONNECTION FAILED'}
          </button>
        </form>

        <div className="auth-divider"></div>

        <div className="auth-secondary-link">
          {mode === 'login' ? (
            <>NEW RECRUIT? <span className="auth-link-text" onClick={toggleMode}>REQUEST INVITATION</span></>
          ) : (
            <>ALREADY REGISTERED? <span className="auth-link-text" onClick={toggleMode}>RETURN TO LOGIN</span></>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;

