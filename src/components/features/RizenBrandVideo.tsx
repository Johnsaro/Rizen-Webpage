import React, { useState, useEffect, useCallback } from 'react';
import './RizenBrandVideo.css';

interface Scene {
  id: string;
  duration: number;
}

const SCENES: Scene[] = [
  { id: 'problem', duration: 5500 },
  { id: 'flip', duration: 5500 },
  { id: 'how', duration: 6500 },
  { id: 'system', duration: 6000 },
  { id: 'close', duration: 6500 },
];

const TOTAL_DURATION = SCENES.reduce((sum, s) => sum + s.duration, 0);

/**
 * Enhanced TypeWriter with flicker effect and custom cursor
 */
const TypeWriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string }> = ({
  text, speed = 40, delay = 0, className = ''
}) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed]);

  return (
    <span className={`${className} ${!started ? 'bv-hidden' : ''}`}>
      {displayed}
      {displayed.length < text.length && started && <span className="bv-cursor">█</span>}
    </span>
  );
};

/**
 * FadeIn with direction and scale support
 */
const FadeIn: React.FC<{ 
  delay: number; 
  children: React.ReactNode; 
  className?: string;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
}> = ({
  delay, children, className = '', direction = 'up'
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`bv-fade bv-fade-${direction} ${visible ? 'visible' : ''} ${className}`}>
      {children}
    </div>
  );
};

const RizenBrandVideo: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [key, setKey] = useState(0);

  const currentScene = SCENES[sceneIndex];

  const advanceScene = useCallback(() => {
    setSceneIndex((prev) => {
      const next = (prev + 1) % SCENES.length;
      if (next === 0) setKey((k) => k + 1);
      return next;
    });
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(advanceScene, currentScene.duration);
    return () => clearTimeout(timer);
  }, [sceneIndex, isPaused, currentScene.duration, advanceScene]);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const next = prev + 50;
        if (next >= TOTAL_DURATION) return 0;
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused]);

  const progressPercent = (elapsed / TOTAL_DURATION) * 100;

  return (
    <div className="bv-container reveal">
      <div className="bv-header">
        <div className="bv-label">
          <span className="bv-label-dot" />
          RIZEN // OPERATIONAL_CORE_V2.0
        </div>
        <div className="bv-timestamp">
          {new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>

      <div
        className="bv-frame"
        onClick={() => setIsPaused((p) => !p)}
        key={key}
      >
        {/* ATMOSPHERICS */}
        <div className="bv-vignette" />
        <div className="bv-grain" />
        <div className="bv-scanline" />
        <div className="bv-chromatic" />
        <div className="bv-grid-bg" />

        {/* ── SCENE 1: THE PROBLEM ── */}
        <div className={`bv-scene bv-scene-problem ${currentScene.id === 'problem' ? 'active' : ''}`}>
          {currentScene.id === 'problem' && (
            <div className="bv-problem-content" key="problem-content">
              <FadeIn delay={400} direction="left" key="p1">
                <div className="bv-strike-line">Another to-do list app.</div>
              </FadeIn>
              <FadeIn delay={1600} direction="right" key="p2">
                <div className="bv-strike-line">Another streak broken.</div>
              </FadeIn>
              <FadeIn delay={2800} direction="left" key="p3">
                <div className="bv-strike-line">Another system that doesn't stick.</div>
              </FadeIn>
              <FadeIn delay={4200} direction="none" className="bv-problem-question-wrap" key="p4">
                <div className="bv-problem-question">Sound familiar?</div>
                <div className="bv-glitch-echo">Sound familiar?</div>
              </FadeIn>
            </div>
          )}
        </div>

        {/* ── SCENE 2: THE FLIP ── */}
        <div className={`bv-scene bv-scene-flip ${currentScene.id === 'flip' ? 'active' : ''}`}>
          {currentScene.id === 'flip' && (
            <div className="bv-flip-content" key="flip-content">
              <div className="bv-flip-hook">
                <TypeWriter 
                  key="tw-flip"
                  text="What if your goals fought back?" 
                  speed={30} 
                  delay={500} 
                  className="bv-flip-text" 
                />
              </div>
              
              <FadeIn delay={2600} direction="up" className="bv-stats-container" key="f-stats">
                <div className="bv-flip-bars">
                  {[
                    { label: 'HP', class: 'hp', val: '72%' },
                    { label: 'XP', class: 'xp', val: '45%' },
                    { label: 'LVL', class: 'lvl', val: '12' }
                  ].map((bar, i) => (
                    <div key={bar.label} className="bv-bar-row" style={{ animationDelay: `${i * 0.1}s` }}>
                      <span className="bv-bar-label">{bar.label}</span>
                      <div className="bv-bar-track">
                        <div className={`bv-bar-fill ${bar.class}`} />
                        <div className="bv-bar-glow" />
                      </div>
                      <span className="bv-bar-value">{bar.val}</span>
                    </div>
                  ))}
                </div>
              </FadeIn>

              <FadeIn delay={4200} direction="none" key="f-sub">
                <div className="bv-flip-sub">
                  <span className="bv-bracket">[</span>
                  NOT A GIMMICK. A REAL RPG SYSTEM MAPPED TO YOUR LIFE.
                  <span className="bv-bracket">]</span>
                </div>
              </FadeIn>
            </div>
          )}
        </div>

        {/* ── SCENE 3: HOW IT WORKS ── */}
        <div className={`bv-scene bv-scene-how ${currentScene.id === 'how' ? 'active' : ''}`}>
          {currentScene.id === 'how' && (
            <div className="bv-how-content-wrapper" key="how-content">
              <div className="bv-scene-tag">PROTOCOL_OVERVIEW</div>
              <div className="bv-how-steps">
                <FadeIn delay={400} direction="up" className="bv-step" key="h1">
                  <div className="bv-step-card">
                    <div className="bv-step-num">01</div>
                    <div className="bv-step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 6v6l4 2" />
                      </svg>
                    </div>
                    <div className="bv-step-title">Set real goals</div>
                    <div className="bv-step-desc">Habits, projects, tasks.</div>
                  </div>
                </FadeIn>

                <div className="bv-connector-wrap">
                  <div className="bv-connector-line">
                    <div className="bv-connector-pulse" style={{ animationDelay: '1.2s' }} />
                  </div>
                </div>

                <FadeIn delay={1800} direction="up" className="bv-step" key="h2">
                  <div className="bv-step-card active">
                    <div className="bv-step-num">02</div>
                    <div className="bv-step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <path d="M8 13h8M8 17h8" />
                      </svg>
                    </div>
                    <div className="bv-step-title">They become quests</div>
                    <div className="bv-step-desc">AI-generated RPG trials.</div>
                  </div>
                </FadeIn>

                <div className="bv-connector-wrap">
                  <div className="bv-connector-line">
                    <div className="bv-connector-pulse" style={{ animationDelay: '2.6s' }} />
                  </div>
                </div>

                <FadeIn delay={3200} direction="up" className="bv-step" key="h3">
                  <div className="bv-step-card">
                    <div className="bv-step-num">03</div>
                    <div className="bv-step-icon">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                      </svg>
                    </div>
                    <div className="bv-step-title">Win in combat</div>
                    <div className="bv-step-desc">Level up through action.</div>
                  </div>
                </FadeIn>
              </div>
            </div>
          )}
        </div>

        {/* ── SCENE 4: THE SYSTEM ── */}
        <div className={`bv-scene bv-scene-system ${currentScene.id === 'system' ? 'active' : ''}`}>
          {currentScene.id === 'system' && (
            <div className="bv-system-content-wrapper" key="system-content">
              <FadeIn delay={300} direction="down" key="s-header">
                <div className="bv-sys-header">
                  <h2 className="bv-sys-title">INTEGRATED ECOSYSTEM</h2>
                  <div className="bv-sys-subtitle">COORDINATED_SYSTEM_SYNC</div>
                </div>
              </FadeIn>

              <div className="bv-sys-map">
                <div className="bv-map-lines">
                   <svg className="bv-map-svg" viewBox="0 0 800 200">
                     <path d="M200 100 H600" className="bv-map-path" />
                     <circle cx="200" cy="100" r="4" className="bv-map-node-dot" />
                     <circle cx="400" cy="100" r="4" className="bv-map-node-dot" />
                     <circle cx="600" cy="100" r="4" className="bv-map-node-dot" />
                   </svg>
                </div>

                <div className="bv-sys-nodes">
                  <FadeIn delay={800} direction="none" className="bv-node-box-wrap" key="s1">
                    <div className="bv-node-box primary">
                      <div className="bv-node-status live">LIVE</div>
                      <div className="bv-node-name">RIZEN MOBILE</div>
                      <div className="bv-node-role">CORE ENGINE</div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={1600} direction="none" className="bv-node-box-wrap" key="s2">
                    <div className="bv-node-box">
                      <div className="bv-node-status live">LIVE</div>
                      <div className="bv-node-name">PULSE AGENT</div>
                      <div className="bv-node-role">DESKTOP GUARD</div>
                    </div>
                  </FadeIn>

                  <FadeIn delay={2400} direction="none" className="bv-node-box-wrap" key="s3">
                    <div className="bv-node-box">
                      <div className="bv-node-status live">LIVE</div>
                      <div className="bv-node-name">PHANTOM PEEL</div>
                      <div className="bv-node-role">FORENSICS</div>
                    </div>
                  </FadeIn>
                </div>
              </div>

              <FadeIn delay={4000} direction="up" key="s-footer">
                <div className="bv-sys-footer">
                  <span className="bv-footer-line" />
                  ONE ECOSYSTEM. ALL LIVE. ALL CONNECTED.
                  <span className="bv-footer-line" />
                </div>
              </FadeIn>
            </div>
          )}
        </div>

        {/* ── SCENE 5: CLOSE ── */}
        <div className={`bv-scene bv-scene-close ${currentScene.id === 'close' ? 'active' : ''}`}>
          {currentScene.id === 'close' && (
            <div className="bv-close-content" key="close-content">
              <FadeIn delay={600} direction="none" className="bv-logo-wrap" key="c1">
                <h1 className="bv-logo-main">RIZEN</h1>
                <div className="bv-logo-shimmer" />
              </FadeIn>
              
              <FadeIn delay={2000} direction="none" key="c2">
                <div className="bv-close-divider-container">
                  <div className="bv-divider-glow" />
                  <div className="bv-divider-line" />
                </div>
              </FadeIn>

              <FadeIn delay={2800} direction="up" key="c3">
                <div className="bv-close-tagline">YOUR LIFE. YOUR BOSS FIGHT.</div>
              </FadeIn>
              
              <FadeIn delay={4200} direction="up" className="bv-close-meta" key="c4">
                <div className="bv-meta-item">EST. 2026</div>
                <div className="bv-meta-sep" />
                <div className="bv-meta-item highlight">DISCIPLINE, ENGINEERED</div>
              </FadeIn>
            </div>
          )}
        </div>

        {/* HUD & OVERLAYS */}
        <div className="bv-hud-left">
          {SCENES.map((s, i) => (
            <div key={s.id} className={`bv-hud-dot ${i === sceneIndex ? 'active' : ''}`}>
              <span className="bv-hud-num">0{i + 1}</span>
            </div>
          ))}
        </div>

        <div className="bv-progress-container">
          <div className="bv-progress-fill" style={{ width: `${progressPercent}%` }} />
        </div>

        {isPaused && (
          <div className="bv-pause-overlay">
            <div className="bv-pause-box">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
              <span>SYSTEM_PAUSED</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RizenBrandVideo;
