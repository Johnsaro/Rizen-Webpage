/* 
 * Owner: Alex | Last updated by: Gemini, 2026-03-14 
 */
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  initialClass?: string;
}

const AuthModal = ({ isOpen, onClose, onLoginSuccess, initialClass }: AuthModalProps) => {
  const { signIn, signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'granted' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    class: initialClass || 'Shadow Arts'
  });

  // Handle initialClass or isTrialRewardMode changes when modal is opened
  useEffect(() => {
    if (isOpen) {
      if (initialClass) {
        setMode('register');
        setFormData(prev => ({
          ...prev,
          class: initialClass
        }));
      }
    }
  }, [isOpen, initialClass]);

  // Clear timeouts on unmount (W09)
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Reset form when modal opens/closes (W17)
  useEffect(() => {
    if (!isOpen) {
      if (status !== 'granted') {
        setFormData({
          name: '',
          email: '',
          password: '',
          class: initialClass || 'Shadow Arts'
        });
        setErrorMessage('');
        setStatus('idle');
      }
    }
  }, [isOpen, status, initialClass]);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password: string) => {
    // Min 8 chars, at least 1 number or special char (W08)
    const hasMinLength = password.length >= 8;
    const hasSpecialOrNum = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasMinLength && hasSpecialOrNum;
  };

  const getPasswordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 25;
    return strength;
  };

  const sanitizeInput = (text: string) => {
    // Strip HTML/script tags (W02)
    return text.replace(/<[^>]*>?/gm, '').trim();
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    const sanitizedName = sanitizeInput(formData.name);
    
    // Client-side validation
    if (mode === 'register') {
      if (!sanitizedName) {
        setErrorMessage('DISPLAY NAME IS REQUIRED');
        return;
      }
      if (sanitizedName.length > 50) {
        setErrorMessage('DISPLAY NAME MUST BE UNDER 50 CHARACTERS');
        return;
      }
    }

    if (!validateEmail(formData.email)) {
      setErrorMessage('INVALID EMAIL FORMAT');
      return;
    }

    if (mode === 'register' && !validatePassword(formData.password)) {
      setErrorMessage('PASSWORD MUST BE AT LEAST 8 CHARACTERS WITH 1 NUMBER OR SPECIAL CHAR');
      return;
    }
    
    setIsLoading(true);
    setStatus('authenticating');
    setErrorMessage('');

    try {
      if (mode === 'login') {
        const result = await signIn(formData.email, formData.password);
        if (result.error) throw result.error;
      } else {
        const result = await signUp(formData.email, formData.password, {
          full_name: sanitizedName,
          class: formData.class,
          origin_platform: 'browser'
        });
        if (result.error) throw result.error;

        // V2 uses sect names directly as path names — no mapping needed
        const resolvedPath = formData.class || 'Formation Master';

        // Create profile row so dashboard + Flutter app see real data immediately
        if (result.user) {
          console.log('[AuthModal] Creating profile for new user:', {
            user_id: result.user.id,
            name: sanitizedName,
            sect: formData.class,
            main_path: resolvedPath,
          });

          const { error: profileError } = await supabase.from('profiles').upsert({
            user_id: result.user.id,
            name: sanitizedName,
            main_path: resolvedPath,
            side_path: 'Shadow Arts',
            sect: formData.class,
            level: 1,
            qi: 0,
            spirit_stones: 0,
            path_qi: {},
            path_level: {},
            inventory: {},
            dao_heart_streak: 0,
            talismans: 0,
            title: '',
            hp: 100,
            max_hp: 100,
            equipped_weapon: '',
            active_pills: {},
            achievements: {},
            featured_achievement: '',
            trials_completed: 0,
            monsters_killed: 0,
            equipped_cosmetics: {},
            onboarding_complete: false,
            origin_platform: 'browser',
            updated_at: new Date().toISOString(),
          }, { onConflict: 'user_id' });

          if (profileError) {
            console.error('[AuthModal] Profile creation FAILED:', profileError);
          } else {
            console.log('[AuthModal] Profile created successfully');
          }
        } else {
          console.warn('[AuthModal] signUp succeeded but no user object returned');
        }
      }

      setStatus('granted');
      
      // Success delay for animation
      timeoutRef.current = setTimeout(() => {
        setIsLoading(false);
        setStatus('idle');
        
        // Clear form on success (W17)
        setFormData({
          name: '',
          email: '',
          password: '',
          class: 'Shadow Arts'
        });

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
      timeoutRef.current = setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setErrorMessage('');
    setStatus('idle');
  };

  const strength = getPasswordStrength(formData.password);

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
                maxLength={50}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <div className="input-helper">ENTER PUBLIC HANDLE (MAX 50 CHARS)</div>
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
            
            {mode === 'register' && formData.password && (
              <div className="password-strength-meter" style={{ height: '2px', background: 'rgba(255,255,255,0.1)', marginTop: '4px', position: 'relative' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${strength}%`, 
                  background: strength < 50 ? 'var(--accent-crimson)' : strength < 100 ? 'var(--accent-yellow)' : 'var(--accent-cyan)',
                  transition: 'all 0.3s ease'
                }} />
              </div>
            )}
            
            <div className="input-helper">
              {mode === 'register' ? 'MIN 8 CHARS + NUMBER/SPECIAL' : 'INPUT AUTHORIZED ACCESS KEY'}
            </div>
          </div>

          {mode === 'register' && (
            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <select
                className="auth-input"
                style={{ appearance: 'none', backgroundColor: 'rgba(0,0,0,0.5)', cursor: 'pointer' }}
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
              >
                <option value="Shadow Arts">Shadow Arts</option>
                <option value="Formation Master">Formation Master</option>
                <option value="Artifact Refiner">Artifact Refiner</option>
                <option value="Realm Architect">Realm Architect</option>
                <option value="Body Cultivator">Body Cultivator</option>
                <option value="Scripture Keeper">Scripture Keeper</option>
                <option value="Inscription Master">Inscription Master</option>
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

