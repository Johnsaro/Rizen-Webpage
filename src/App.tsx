import { useEffect, useState, useRef, useCallback } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AnnouncementBar from './components/AnnouncementBar'
import ScannerOverlay from './components/layout/ScannerOverlay'
import ParticlesBackground from './components/layout/ParticlesBackground'
import Terminal from './components/features/Terminal'
import CombatSimulator from './components/features/CombatSimulator'
import PhoneMockup from './components/features/PhoneMockup'
import AuthModal from './components/features/AuthModal'
import VaultReader from './components/features/VaultReader'
import BuildDetail from './components/features/BuildDetail'
import SystemArchitecture from './components/features/SystemArchitecture'
import AgentNetwork from './components/features/AgentNetwork'
import Builds from './pages/Builds'
import Community from './pages/Community'
import CommunityEvent from './pages/CommunityEvent'
import { useCombatSim } from './hooks/useCombatSim'
import { useTerminal } from './hooks/useTerminal'
import { useInitiation } from './hooks/useInitiation'
import { vaultContent } from './data/vaultContent'
import type { VaultItem } from './data/vaultContent'
import { builds } from './data/builds'
import type { Build } from './data/builds'
import { demoPlayer } from './data/demoPlayer'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  const [scanned, setScanned] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [activeDiscipline, setActiveDiscipline] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedVaultItem, setSelectedVaultItem] = useState<VaultItem | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'builds' | 'community' | 'community-event'>('home');
  const [communitySubView, setCommunitySubView] = useState<'hub' | 'docs' | 'events' | 'blog' | 'discord'>('hub');
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const fullText = "Rise or Stagnate. The choice is yours, Recruit.";

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('home');
  };

  // Simple Hash-based Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/builds/')) {
        const buildId = hash.replace('#/builds/', '');
        const found = builds.find(b => b.id === buildId);
        if (found) {
          setCurrentView('builds');
          setSelectedBuild(found);
        }
      } else if (hash === '#/builds') {
        setCurrentView('builds');
        setSelectedBuild(null);
      } else if (hash.startsWith('#/community/') || hash.startsWith('#/blog/')) {
        let subId = '';
        if (hash.startsWith('#/blog/')) {
          subId = 'blog';
        } else {
          subId = hash.replace('#/community/', '');
        }

        if (subId === 'event') {
          setCurrentView('community-event' as unknown as 'home' | 'builds' | 'community');
        } else {
          setCurrentView('community');
          if (subId.startsWith('docs')) {
            setCommunitySubView('docs');
          } else if (subId.startsWith('events')) {
            setCommunitySubView('events');
          } else if (subId.startsWith('blog')) {
            setCommunitySubView('blog');
          } else if (subId.startsWith('discord')) {
            setCommunitySubView('discord');
          } else {
            setCommunitySubView('hub');
          }
        }
      } else if (hash === '#/community' || hash === '#/blog') {
        setCurrentView('community');
        setCommunitySubView('hub');
        setSelectedBuild(null);
      } else {
        setCurrentView('home');
        setSelectedBuild(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const openBuildDetail = (build: Build) => {
    window.location.hash = `#/builds/${build.id}`;
  };

  const closeBuildDetail = () => {
    window.location.hash = `#/builds`;
  };



  const {
    combatState,
    playerHP,
    monsterHP,
    currentQuestionIndex,
    combatMessage,
    isCombatAnimating,
    shakeTarget,
    combatQuestions,
    startCombat,
    handleCombatAnswer
  } = useCombatSim();

  const {
    guildMasterLog,
    setGuildMasterLog,
    inputValue,
    setInputValue,
    isProcessing,
    handleReportTask
  } = useTerminal();

  const {
    step,
    questions,
    assignedClass,
    startInitiation,
    handleAnswer
  } = useInitiation();

  const onScanComplete = useCallback(() => {
    setScanned(true);
  }, []);

  const onInitiationAnswer = useCallback((answer: string) => {
    setGuildMasterLog(prev => [...prev, { sender: 'user', text: answer }]);
    handleAnswer(answer);
  }, [handleAnswer, setGuildMasterLog]);

  const initiateDiscovery = () => {
    startInitiation();
    setGuildMasterLog([{ sender: 'system', text: 'INITIATING CLASS DISCOVERY PROTOCOL...' }]);
  };

  // 1. TYPING ANIMATION
  useEffect(() => {
    if (scanned) {
      let i = 0;
      const interval = setInterval(() => {
        setTypedText(fullText.slice(0, i));
        i++;
        if (i > fullText.length) clearInterval(interval);
      }, 50);
      return () => clearInterval(interval);
    }
  }, [scanned]);

  // Handle Quiz Progression in Terminal
  useEffect(() => {
    if (step === 'Q1' && guildMasterLog.length === 1) {
      setGuildMasterLog(prev => [...prev, { sender: 'system', text: "INITIATION PROTOCOL ACTIVATED. IDENTIFY YOUR STRENGTHS." }]);
    }

    const currentQ = questions.find(q => q.id === step);
    if (currentQ) {
      setTimeout(() => {
        setGuildMasterLog(prev => [...prev, { sender: 'system', text: currentQ.text }]);
      }, 600);
    }

    if (step === 'COMPLETE' && assignedClass) {
      setTimeout(() => {
        setGuildMasterLog(prev => [...prev, {
          sender: 'system',
          text: `INITIATION COMPLETE. CLASS ASSIGNED: ${assignedClass}. WELCOME TO THE GUILD.`
        }]);
      }, 600);
    }
  }, [step, assignedClass, questions, guildMasterLog.length, setGuildMasterLog]);

  // 2. 3D TILT EFFECT & SCROLL REVEAL
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX - innerWidth / 2) / 25;
      const y = (clientY - innerHeight / 2) / 25;
      phoneRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    if (scanned) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scanned, currentView, isLoggedIn]);

  const upcomingBuild = builds.find(b => b.status === 'Upcoming') || builds[0];

  return (
    <div className="portal">
      <AnnouncementBar
        label="UPCOMING"
        message={upcomingBuild.title}
        ctaText="Check It Out"
        ctaLink={`#/builds/${upcomingBuild.id}`}
      />

      <Navbar
        setAuthModalOpen={setAuthModalOpen}
        setIsHovering={() => { }}
        currentView={currentView}
        setCurrentView={setCurrentView}
        isLoggedIn={isLoggedIn}
        user={demoPlayer}
        onLogout={handleLogout}
      />
      <ParticlesBackground />

      {!scanned && <ScannerOverlay onScanComplete={onScanComplete} />}

      {isLoggedIn && currentView === 'home' ? (
        <Dashboard user={demoPlayer} />
      ) : currentView === 'home' ? (
        <>
          {/* 1. HERO SECTION */}
          <section className="hero" id="hero">
            <div className="hero-content reveal">
              <div className="status-tag pulse-border">GUILD PROTOCOL v2.0</div>
              <h1 className="glitch-title" data-text="RIZEN">RIZEN</h1>
              <p className="hero-subtitle-typed">{typedText}<span className="cursor">|</span></p>
              <p className="hero-description reveal">
                Stop playing games that don't matter. Turn your actual career and health into a high-stakes RPG.
              </p>
              <div className="cta-group reveal">
                <button className="btn-primary" onClick={initiateDiscovery}>Claim Your Class</button>
                <button className="btn-secondary" onClick={() => setCurrentView('builds')}>View The Board</button>
              </div>

              <Terminal
                log={guildMasterLog}
                inputValue={inputValue}
                setInputValue={setInputValue}
                isProcessing={isProcessing}
                onReportTask={handleReportTask}
                initiationStep={step}
                initiationQuestions={questions}
                onInitiationAnswer={onInitiationAnswer}
              />
            </div>

            <PhoneMockup phoneRef={phoneRef} />
          </section>

          {/* SYSTEM ARCHITECTURE */}
          <div style={{ padding: '4rem 0' }}>
            <SystemArchitecture />
          </div>

          {/* AGENT NETWORK */}
          <div style={{ paddingBottom: '4rem' }}>
            <AgentNetwork />
          </div>

          {/* INFINITE MARQUEE SEPARATOR */}
          <div className="marquee-container">
            <div className="marquee-content">
              <span>// RANK UP // GET SHREDDED // MASTER SKILLS // SECURE SYSTEMS </span>
              <span>// RANK UP // GET SHREDDED // MASTER SKILLS // SECURE SYSTEMS </span>
            </div>
          </div>

          {/* 2. THE STAKES */}
          <section className="section-padding threat-bg" id="stakes" >
            <div className="centered-header reveal">
              <h2 className="title-large">STAGNATION IS THE ENEMY</h2>
              <p className="p-large">Inactivity is tracked. Procrastination is punished. Growth is rewarded.</p>
            </div>

            <div className="threat-visual-grid">
              <div className="threat-visual-card reveal tilt-card">
                <div className="drain-animation" style={{ marginBottom: '1rem' }}>
                  <div className="stat-minus">INT -15</div>
                  <div className="stat-minus">XP -400</div>
                </div>
                <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>THE TIME WRAITH</h3>
                <p>Ignore your goals, and the Wraith spawns to drain your progress until you defeat it.</p>
              </div>
              <div className="threat-visual-card reveal tilt-card">
                <div className="glitch-icon pulse-red">💀</div>
                <h3 style={{ color: 'var(--accent-crimson)', marginBottom: '1rem' }}>REAL PENALTIES</h3>
                <p>Fail your real-world goals? Your in-game loadout breaks. Repair requires actual mastery.</p>
              </div>
            </div>
          </section >

          {/* 3. CLASS STAGGERED GRID */}
          <section className="section-padding" id="disciplines">
            <div className="centered-header reveal">
              <h2 className="title-large">CHOOSE YOUR DISCIPLINE</h2>
              <p className="p-large" style={{ marginTop: '1rem' }}>Select a path to view its starting stats and loadout.</p>
            </div>
            <div className="stagger-grid">
              {[
                { name: 'SECURITY', roles: ['Red Team', 'Sec Admin', 'Cloud Sec'], desc: 'Master offensive and defensive security. Identify vulnerabilities.', icon: '🛡️' },
                { name: 'SOFTWARE ENG', roles: ['Backend', 'Systems', 'Architecture'], desc: 'Architect scalable systems. Build the backbone of the digital world.', icon: '⚙️' },
                { name: 'WEB DEV', roles: ['Frontend', 'Fullstack', 'UI/UX'], desc: 'Craft intuitive user interfaces. Bridge the gap between human and machine.', icon: '🌐' },
                { name: 'GAME DEV', roles: ['Engine', 'Tech Art', 'Gameplay'], desc: 'Build worlds. Manipulate physics and logic to create experiences.', icon: '🎮' }
              ].map((cls, i) => (
                <div
                  key={cls.name}
                  className={`class-card-modern reveal ${activeDiscipline === cls.name ? 'active' : ''}`}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                  onClick={() => setActiveDiscipline(cls.name)}
                >
                  <div className="card-glimmer"></div>
                  <span className="class-icon">{cls.icon}</span>
                  <h3 style={{ letterSpacing: '2px', fontSize: '1.5rem', margin: '0' }}>{cls.name}</h3>
                  <div className="class-roles">
                    {cls.roles.map(role => <span key={role} className="class-role-tag">{role}</span>)}
                  </div>
                  <p className="class-desc">{cls.desc}</p>
                  <div className="class-dots" style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '1.5rem' }}>
                    <span style={{ width: '8px', height: '8px', background: activeDiscipline === cls.name ? 'var(--accent-cyan)' : 'var(--text-dim)', borderRadius: '50%', transition: 'background 0.3s' }}></span>
                    <span style={{ width: '8px', height: '8px', background: activeDiscipline === cls.name ? 'var(--text-main)' : 'rgba(255,255,255,0.1)', borderRadius: '50%', transition: 'background 0.3s' }}></span>
                    <span style={{ width: '8px', height: '8px', background: activeDiscipline === cls.name ? 'var(--accent-crimson)' : 'var(--text-dim)', borderRadius: '50%', transition: 'background 0.3s' }}></span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* COMBAT SIMULATOR */}
          <section className="section-padding threat-bg" id="combat">
            <div className="centered-header reveal">
              <h2 className="title-large">PROVE YOUR SKILL</h2>
              <p className="p-large" style={{ marginTop: '1rem' }}>Rizen is not a passive tracker. To progress, you must master real-world knowledge. Face the Time Wraith in a Tier 1 engagement.</p>
            </div>
            <CombatSimulator
              state={combatState}
              playerHP={playerHP}
              monsterHP={monsterHP}
              currentQuestionIndex={currentQuestionIndex}
              message={combatMessage}
              isAnimating={isCombatAnimating}
              shakeTarget={shakeTarget}
              questions={combatQuestions}
              onStart={startCombat}
              onAnswer={handleCombatAnswer}
            />
          </section>

          {/* RANKINGS SECTION */}
          <section className="section-padding" id="rankings" >
            <div className="centered-header reveal">
              <h2 className="title-large">GLOBAL LEADERBOARD</h2>
              <p className="p-large">The elite who refuse to stagnate. Updated in real-time.</p>
            </div>
            <div className="rankings-container reveal">
              <div className="ranking-row header">
                <div>#</div>
                <div>OPERATIVE</div>
                <div>CLASS</div>
                <div style={{ textAlign: 'center' }}>VLD_RATE</div>
                <div style={{ textAlign: 'right' }}>REP_TOTAL</div>
              </div>
              {[
                { rank: 1, user: 'V0idWalker', level: 'S', class: 'Sec Admin', vld: '98.2%', rep: '94,200', active: true },
                { rank: 2, user: 'NeoConstruct', level: 'S', class: 'Software Eng', vld: '96.5%', rep: '89,450' },
                { rank: 3, user: 'GhostWire', level: 'A', class: 'Red Team', vld: '94.1%', rep: '82,100' },
                { rank: 4, user: 'CypherPunk', level: 'A', class: 'Web Dev', vld: '91.8%', rep: '77,800' },
                { rank: 54, user: 'You (Recruit)', level: 'F', class: 'Unassigned', vld: '12.4%', rep: '1,240', me: true }
              ].map((op) => (
                <div key={op.rank} className={`ranking-row ${op.rank <= 3 ? 'rank-top' : ''}`} style={op.me ? { background: 'rgba(255, 255, 255, 0.05)' } : {}}>
                  <div className="rank-num">{op.rank}</div>
                  <div className="rank-user">
                    <span className={`mock-rank-${op.level.toLowerCase()}`}>{op.level}</span>
                    {op.user}
                  </div>
                  <div><span className="rank-class" style={op.me ? { borderColor: 'var(--text-dim)', color: 'var(--text-dim)' } : {}}>{op.class}</span></div>
                  <div style={{ textAlign: 'center', fontFamily: 'Fira Code', fontSize: '0.85rem' }}>{op.vld}</div>
                  <div className="rank-rep" style={{ textAlign: 'right', color: op.active ? 'var(--accent-cyan)' : 'inherit' }}>{op.rep}</div>
                </div>
              ))}
            </div>
          </section >

          {/* ARSENAL BENTO */}
          <section className="section-padding" id="arsenal" >
            <div className="centered-header reveal" style={{ marginBottom: '4rem' }}>
              <h2 className="title-large" style={{ fontSize: '3rem' }}>THE GUILD ARSENAL</h2>
              <p className="p-large" style={{ marginTop: '1rem' }}>Unlock specialized tools, scripts, and buffs by completing real-world milestones.</p>
            </div>
            <div className="arsenal-bento">
              <div
                className="bento-item reveal large-arsenal tilt-card interactive-card"
                onClick={() => setSelectedVaultItem(vaultContent['recon-script'])}
              >
                <div className="weapon-tag">ACTIVE CAPABILITY // RANK A</div>
                <h3 style={{ fontSize: '1.8rem', margin: '0' }}>AUTO-RECON SCRIPT</h3>
                <div className="skill-code-box">
                  <div className="code-header"><span></span><span></span><span></span></div>
                  <code>./recon -t 10.10.10.x --fast-scan</code>
                </div>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-dim)' }}>Reduces the time spent on initial enumeration by 40%. Click to decrypt intel.</p>
              </div>
              <div
                className="bento-item reveal small-arsenal tilt-card interactive-card"
                style={{ transitionDelay: '0.2s' }}
                onClick={() => setSelectedVaultItem(vaultContent['focus-stim'])}
              >
                <div className="weapon-tag" style={{ color: 'var(--text-dim)' }}>PASSIVE BUFF</div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0' }}>FOCUS STIM</h3>
                <p style={{ color: 'var(--text-dim)' }}>Grants +25% XP multiplier for 2 hours when activated.</p>
                <div style={{ marginTop: '1rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}><div style={{ height: '100%', width: '40%', background: 'var(--accent-cyan)' }}></div></div>
              </div>
              <div className="bento-item reveal small-arsenal tilt-card" style={{ transitionDelay: '0.3s' }}>
                <div className="weapon-tag" style={{ color: 'var(--text-dim)' }}>COSMETIC</div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0' }}>NEON CLOAK</h3>
                <p style={{ color: 'var(--text-dim)' }}>A guild badge of honor. Unlocked after completing the "Night Owl" streak.</p>
                <div style={{ marginTop: '1rem', fontSize: '2rem', textAlign: 'center' }}>🥷</div>
              </div>
              <div
                className="bento-item reveal large-arsenal tilt-card interactive-card"
                style={{ transitionDelay: '0.4s' }}
                onClick={() => setSelectedVaultItem(vaultContent['kernel-tamperer'])}
              >
                <div className="weapon-tag">SPECIALIZATION // RANK S</div>
                <h3 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0' }}>THE KERNEL TAMPERER</h3>
                <p style={{ color: 'var(--text-dim)' }}>Unlock advanced OS exploitation paths. This is a Tier 3 Class upgrade, requiring mastery of Assembly and C fundamentals.</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <span className="mock-rank-s" style={{ width: 'auto', padding: '0.5rem 1rem' }}>SYS-ADMIN DEFEATED</span>
                  <span className="mock-rank-a" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--text-dim)' }}>MEMORY MASTER [LOCKED]</span>
                </div>
              </div>
            </div>
          </section >

          {/* MANIFESTO SECTION */}
          <section className="section-padding" id="manifesto">
            <div className="centered-header reveal">
              <h2 className="title-large">THE GUILD PROTOCOL</h2>
            </div>
            <div className="manifesto-box reveal">
              <div className="manifesto-glitch">01. STAGNATION IS DEATH.</div>
              <div className="manifesto-text">We do not accept the default path. We recognize that without active progression, skills atrophy and potential decays. The Guild demands forward momentum.</div>
              <div className="manifesto-glitch">02. XP IS EARNED, NOT GIVEN.</div>
              <div className="manifesto-text">Every line of code, every workout, every vulnerability patched contributes to your overall operative rank. Everything is tracked. Everything matters.</div>
              <div className="manifesto-glitch">03. COLLECTIVE ASCENSION.</div>
              <div className="manifesto-text">We share tactics, scripts, and strategies. We compete on the leaderboards to push each other further. A rising tide lifts all operatives.</div>
            </div>
          </section>

          {/* FINAL CALL */}
          <section className="final-cta reveal" >
            <div className="cta-content">
              <h2 className="title-large" style={{ marginBottom: '1rem' }}>THE GUILD IS WAITING</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', marginBottom: '3rem', fontFamily: 'Space Grotesk' }}>Your first quest begins at 08:00 AM. Will you be there?</p>
              <button className="btn-primary large-btn" onClick={initiateDiscovery}>Initialize Onboarding</button>
            </div>
          </section >
        </>
      ) : currentView === 'community-event' ? (
        <CommunityEvent />
      ) : currentView === 'community' ? (
        <Community subView={communitySubView} />
      ) : (
        <Builds onViewBuild={openBuildDetail} />
      )}

      {selectedBuild && (
        <BuildDetail build={selectedBuild} onClose={closeBuildDetail} />
      )}

      <footer className="portal-footer">
        <div className="footer-logo">RIZEN</div>
        <div className="guild-status">
          <span className="dot pulse"></span> SYSTEMS NOMINAL // GUILD OPEN
        </div>
        <div className="footer-online-status">
          <div className="radar-circle"></div>
          <span className="online-number">1,204</span>
          <span className="online-label">OPERATIVES ONLINE</span>
        </div>
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
      <VaultReader item={selectedVaultItem} onClose={() => setSelectedVaultItem(null)} />
    </div >
  )
}

export default App
