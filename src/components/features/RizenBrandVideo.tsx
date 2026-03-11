import React, { useState, useEffect, useCallback } from 'react';
import './RizenBrandVideo.css';

interface Scene {
  id: string;
  duration: number;
}

const SCENES: Scene[] = [
  { id: 'hook', duration: 4500 },
  { id: 'hook2', duration: 3500 },
  { id: 'reveal', duration: 4000 },
  { id: 'classes', duration: 5000 },
  { id: 'quests', duration: 5000 },
  { id: 'combat', duration: 5500 },
  { id: 'arsenal', duration: 5000 },
  { id: 'guild', duration: 4500 },
  { id: 'cta', duration: 5500 },
];

const TOTAL_DURATION = SCENES.reduce((sum, s) => sum + s.duration, 0);

const TypeWriter: React.FC<{ text: string; speed?: number; delay?: number; className?: string }> = ({
  text, speed = 40, delay = 0, className = ''
}) => {
  const [displayed, setDisplayed] = useState('');
  const [started, setStarted] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setStarted(false);
    const startTimer = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(startTimer);
  }, [text, delay]);

  useEffect(() => {
    if (!started) return;
    if (displayed.length >= text.length) return;
    const timer = setTimeout(() => {
      setDisplayed(text.slice(0, displayed.length + 1));
    }, speed);
    return () => clearTimeout(timer);
  }, [displayed, started, text, speed]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && started && <span className="bv-cursor">_</span>}
    </span>
  );
};

const RizenBrandVideo: React.FC = () => {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currentScene = SCENES[sceneIndex];

  const advanceScene = useCallback(() => {
    setSceneIndex((prev) => (prev + 1) % SCENES.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(advanceScene, currentScene.duration);
    return () => clearTimeout(timer);
  }, [sceneIndex, isPaused, currentScene.duration, advanceScene]);

  // Elapsed time tracker for progress bar
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

  // Reset elapsed on loop
  useEffect(() => {
    if (sceneIndex === 0) setElapsed(0);
  }, [sceneIndex]);

  const progressPercent = (elapsed / TOTAL_DURATION) * 100;

  return (
    <div className="bv-container reveal">
      <div className="bv-label">
        <span className="bv-label-dot" />
        BRAND PROTOCOL // RIZEN 2026
      </div>

      <div
        className="bv-frame"
        onClick={() => setIsPaused((p) => !p)}
        title={isPaused ? 'Click to play' : 'Click to pause'}
      >
        {/* Persistent overlays */}
        <div className="bv-scanlines" />
        <div className="bv-vignette" />
        <div className="bv-noise" />

        {/* ── SCENE: HOOK 1 ── */}
        <div className={`bv-scene ${currentScene.id === 'hook' ? 'active' : ''}`}>
          <div className="bv-hook-lines">
            <TypeWriter text="You track your workouts." speed={35} delay={300} className="bv-hook-line" />
            <TypeWriter text="Your calories." speed={35} delay={1200} className="bv-hook-line" />
            <TypeWriter text="Your sleep." speed={35} delay={1800} className="bv-hook-line" />
          </div>
        </div>

        {/* ── SCENE: HOOK 2 ── */}
        <div className={`bv-scene ${currentScene.id === 'hook2' ? 'active' : ''}`}>
          <div className="bv-hook-question">
            <TypeWriter
              text="But who tracks your growth?"
              speed={45}
              delay={200}
              className="bv-hook-big"
            />
          </div>
        </div>

        {/* ── SCENE: REVEAL ── */}
        <div className={`bv-scene ${currentScene.id === 'reveal' ? 'active' : ''}`}>
          <div className="bv-reveal-wrapper">
            <h1 className="bv-logo-text">
              <span className="bv-glitch" data-text="RIZEN">RIZEN</span>
            </h1>
            <div className="bv-tagline">
              <TypeWriter text="Rise or Stagnate." speed={60} delay={800} className="bv-tagline-text" />
            </div>
            <div className="bv-logo-flare" />
          </div>
        </div>

        {/* ── SCENE: CLASSES ── */}
        <div className={`bv-scene ${currentScene.id === 'classes' ? 'active' : ''}`}>
          <div className="bv-scene-header">
            <span className="bv-scene-tag">01</span>
            <TypeWriter text="CHOOSE YOUR DISCIPLINE" speed={30} delay={200} className="bv-scene-title" />
          </div>
          <div className="bv-class-grid">
            {[
              { name: 'SECURITY ANALYST', icon: '🛡', color: '#00D2E0', desc: 'Hunt threats. Break systems. Defend everything.' },
              { name: 'SOFTWARE ENGINEER', icon: '⚙', color: '#BC13FE', desc: 'Architect solutions. Ship products. Scale infinitely.' },
              { name: 'WEB DEVELOPER', icon: '◈', color: '#39FF14', desc: 'Craft interfaces. Build experiences. Own the frontend.' },
              { name: 'GAME DEVELOPER', icon: '▶', color: '#FF6B35', desc: 'Design worlds. Code engines. Create realities.' },
            ].map((cls, i) => (
              <div
                key={cls.name}
                className="bv-class-card"
                style={{
                  '--card-color': cls.color,
                  animationDelay: `${0.3 + i * 0.15}s`,
                } as React.CSSProperties}
              >
                <div className="bv-class-icon">{cls.icon}</div>
                <div className="bv-class-name">{cls.name}</div>
                <div className="bv-class-desc">{cls.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── SCENE: QUESTS ── */}
        <div className={`bv-scene ${currentScene.id === 'quests' ? 'active' : ''}`}>
          <div className="bv-scene-header">
            <span className="bv-scene-tag">02</span>
            <TypeWriter text="REAL MISSIONS. REAL STAKES." speed={30} delay={200} className="bv-scene-title" />
          </div>
          <div className="bv-quest-ranks">
            {['F', 'E', 'D', 'C', 'B', 'A', 'S', 'SS', 'SSS'].map((rank, i) => (
              <div
                key={rank}
                className="bv-rank-badge"
                style={{
                  animationDelay: `${0.4 + i * 0.08}s`,
                  '--rank-intensity': `${(i + 1) / 9}`,
                } as React.CSSProperties}
              >
                {rank}
              </div>
            ))}
          </div>
          <div className="bv-quest-info">
            <div className="bv-quest-line">
              <span className="bv-quest-label">DAILY</span>
              <span className="bv-quest-detail">Refresh every 24h. Miss them, lose momentum.</span>
            </div>
            <div className="bv-quest-line">
              <span className="bv-quest-label">MAIN</span>
              <span className="bv-quest-detail">Long-term objectives. Real proof required.</span>
            </div>
            <div className="bv-quest-line">
              <span className="bv-quest-label">SIDE</span>
              <span className="bv-quest-detail">Optional mastery. Extra XP for the ambitious.</span>
            </div>
          </div>
        </div>

        {/* ── SCENE: COMBAT ── */}
        <div className={`bv-scene ${currentScene.id === 'combat' ? 'active' : ''}`}>
          <div className="bv-scene-header">
            <span className="bv-scene-tag">03</span>
            <TypeWriter text="KNOWLEDGE IS YOUR WEAPON" speed={30} delay={200} className="bv-scene-title" />
          </div>
          <div className="bv-combat-demo">
            <div className="bv-combat-top">
              <div className="bv-combat-entity">
                <span className="bv-entity-name">PROCRASTINATION SPECTER</span>
                <div className="bv-hp-bar">
                  <div className="bv-hp-fill enemy" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
            <div className="bv-combat-question">
              <div className="bv-timer-ring">
                <span>15</span>
              </div>
              <div className="bv-question-text">
                What flag reveals service versions in nmap?
              </div>
              <div className="bv-answer-grid">
                <div className="bv-answer wrong">-sS</div>
                <div className="bv-answer correct">-sV</div>
                <div className="bv-answer wrong">-O</div>
                <div className="bv-answer wrong">-A</div>
              </div>
            </div>
            <div className="bv-combat-bottom">
              <div className="bv-combat-entity">
                <span className="bv-entity-name">YOU // LV.12 OPERATIVE</span>
                <div className="bv-hp-bar">
                  <div className="bv-hp-fill player" style={{ width: '88%' }} />
                </div>
              </div>
            </div>
            <div className="bv-damage-number">-340 HP</div>
          </div>
        </div>

        {/* ── SCENE: ARSENAL ── */}
        <div className={`bv-scene ${currentScene.id === 'arsenal' ? 'active' : ''}`}>
          <div className="bv-scene-header">
            <span className="bv-scene-tag">04</span>
            <TypeWriter text="YOUR SKILLS ARE YOUR ARSENAL" speed={30} delay={200} className="bv-scene-title" />
          </div>
          <div className="bv-arsenal-grid">
            {[
              { name: 'Recon Suite', hint: 'nmap -sV', durability: 87, rarity: 'rare' },
              { name: 'Exploit Framework', hint: 'msfconsole', durability: 62, rarity: 'epic' },
              { name: 'Kernel Probe', hint: 'lsmod | grep', durability: 45, rarity: 'legendary' },
            ].map((weapon, i) => (
              <div
                key={weapon.name}
                className={`bv-weapon-card ${weapon.rarity}`}
                style={{ animationDelay: `${0.3 + i * 0.2}s` } as React.CSSProperties}
              >
                <div className="bv-weapon-name">{weapon.name}</div>
                <div className="bv-weapon-hint">{weapon.hint}</div>
                <div className="bv-durability-bar">
                  <div
                    className="bv-durability-fill"
                    style={{ width: `${weapon.durability}%` }}
                  />
                  <span className="bv-durability-text">{weapon.durability}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="bv-arsenal-warning">
            <TypeWriter
              text="⚠ IDLE FOR 7 DAYS = WEAPON LOCKED. USE IT OR LOSE IT."
              speed={25}
              delay={1500}
              className="bv-warning-text"
            />
          </div>
        </div>

        {/* ── SCENE: GUILD ── */}
        <div className={`bv-scene ${currentScene.id === 'guild' ? 'active' : ''}`}>
          <div className="bv-scene-header">
            <span className="bv-scene-tag">05</span>
            <TypeWriter text="AI-DRIVEN ACCOUNTABILITY" speed={30} delay={200} className="bv-scene-title" />
          </div>
          <div className="bv-terminal">
            <div className="bv-terminal-header">
              <span className="bv-terminal-dot red" />
              <span className="bv-terminal-dot yellow" />
              <span className="bv-terminal-dot green" />
              <span className="bv-terminal-title">GUILD_MASTER_v4.0</span>
            </div>
            <div className="bv-terminal-body">
              <div className="bv-terminal-line">
                <span className="bv-prompt">&gt;</span> submit_quest --type=main --proof=screenshot.png
              </div>
              <div className="bv-terminal-line output">
                <span className="bv-prompt sys">[GM]</span> Analyzing submission...
              </div>
              <div className="bv-terminal-line output success">
                <span className="bv-prompt sys">[GM]</span> QUEST VALIDATED. Rank B confirmed.
              </div>
              <div className="bv-terminal-line output success">
                <span className="bv-prompt sys">[GM]</span> +2,400 XP | +180 Rep awarded.
              </div>
              <div className="bv-terminal-line output warning">
                <span className="bv-prompt sys">[GM]</span> No shortcuts. No excuses. Only proof.
              </div>
            </div>
          </div>
        </div>

        {/* ── SCENE: CTA ── */}
        <div className={`bv-scene ${currentScene.id === 'cta' ? 'active' : ''}`}>
          <div className="bv-cta-wrapper">
            <h1 className="bv-cta-logo">
              <span className="bv-glitch" data-text="RIZEN">RIZEN</span>
            </h1>
            <div className="bv-cta-tagline">RISE OR STAGNATE. THE CHOICE IS YOURS, RECRUIT.</div>
            <div className="bv-cta-ecosystem">
              <span className="bv-eco-item" style={{ color: '#00D2E0' }}>MOBILE</span>
              <span className="bv-eco-divider">//</span>
              <span className="bv-eco-item" style={{ color: '#00D2E0' }}>PULSE</span>
              <span className="bv-eco-divider">//</span>
              <span className="bv-eco-item" style={{ color: '#ff0055' }}>PHANTOM</span>
              <span className="bv-eco-divider">//</span>
              <span className="bv-eco-item" style={{ color: '#39FF14' }}>VAULT</span>
            </div>
            <div className="bv-cta-button-row">
              <div className="bv-cta-btn primary">INITIALIZE PROTOCOL</div>
              <div className="bv-cta-btn secondary">VIEW BUILDS</div>
            </div>
            <div className="bv-cta-year">PROTOCOL ACTIVE // 2026</div>
          </div>
        </div>

        {/* Pause indicator */}
        {isPaused && (
          <div className="bv-pause-indicator">
            <div className="bv-pause-icon">❚❚</div>
            <div className="bv-pause-text">PAUSED</div>
          </div>
        )}

        {/* Scene dots */}
        <div className="bv-scene-dots">
          {SCENES.map((s, i) => (
            <button
              key={s.id}
              className={`bv-dot ${i === sceneIndex ? 'active' : ''} ${i < sceneIndex ? 'passed' : ''}`}
              onClick={(e) => {
                e.stopPropagation();
                setSceneIndex(i);
                setElapsed(SCENES.slice(0, i).reduce((sum, sc) => sum + sc.duration, 0));
              }}
              title={s.id.toUpperCase()}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="bv-progress">
          <div
            className="bv-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default RizenBrandVideo;
