import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
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
import RizenBrandVideo from './components/features/RizenBrandVideo'
import Builds from './pages/Builds'
import Community from './pages/Community'
import CommunityEvent from './pages/CommunityEvent'
import AdminBountyConsole from './pages/AdminBountyConsole'
import { useAuth } from './context/AuthContext'
import { usePlayerProfile } from './hooks/usePlayerProfile'
import { useCombatSim } from './hooks/useCombatSim'
import { useTerminal } from './hooks/useTerminal'
import { useInitiation } from './hooks/useInitiation'
import { vaultContent } from './data/vaultContent'
import type { VaultItem } from './data/vaultContent'
import { builds } from './data/builds'
import type { Build } from './data/builds'
import { demoPlayer } from './data/demoPlayer'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'

import CommandCenter from './pages/CommandCenter'

const DAO_PATHS = [
  { name: 'SHADOW ARTS', roles: ['Red Team', 'Sec Admin', 'Cloud Sec'], desc: 'Master the unseen. Infiltrate barriers. Find every weakness.', icon: '🛡️' },
  { name: 'FORMATION MASTER', roles: ['Backend', 'Systems', 'Architecture'], desc: 'Build the arrays and frameworks that hold worlds together.', icon: '⚙️' },
  { name: 'ARTIFACT REFINER', roles: ['Frontend', 'Fullstack', 'UI/UX'], desc: 'Craft powerful tools carried by millions.', icon: '🌐' },
  { name: 'REALM ARCHITECT', roles: ['Engine', 'Tech Art', 'Gameplay'], desc: 'Create entire worlds. Define their rules.', icon: '🎮' },
  { name: 'BODY CULTIVATOR', roles: ['Fitness', 'Athletics', 'Health'], desc: 'Refine the physical vessel through relentless training.', icon: '💪' },
  { name: 'SCRIPTURE KEEPER', roles: ['Academics', 'Study', 'Research'], desc: 'Absorb knowledge. Seek to comprehend the Dao.', icon: '📖' },
  { name: 'INSCRIPTION MASTER', roles: ['Creative', 'Art', 'Music'], desc: 'Channel Qi into art, runes, sound, and creation.', icon: '🎨' }
];

function App() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile } = usePlayerProfile();
  const isLoggedIn = !!user;
  const isAdmin = profile?.is_admin === true;

  // Derive operative data from Supabase user metadata or fallback to level 1 defaults (W04)
  const operativeData = useMemo(() => {
    if (!user) return demoPlayer;

    return {
      ...demoPlayer,
      id: user.id,
      name: profile?.name || user.user_metadata?.full_name || user.email?.split('@')[0].toUpperCase() || 'CULTIVATOR',
      class: profile?.main_class || user.user_metadata?.class || 'Shadow Arts',
      level: profile?.level || 1,
      stats: {
        ...demoPlayer.stats,
        hp: {
          current: profile?.hp || demoPlayer.stats.hp.current,
          max: profile?.max_hp || demoPlayer.stats.hp.max
        },
        rep: profile?.rep || 0,
        streak: profile?.streak || 0
      }
    };
  }, [user, profile]);

  const [scanned, setScanned] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [activeDiscipline, setActiveDiscipline] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedVaultItem, setSelectedVaultItem] = useState<VaultItem | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'builds' | 'community' | 'community-event' | 'admin-console' | 'command-center'>('home');
  const [communitySubView, setCommunitySubView] = useState<'hub' | 'docs' | 'events' | 'blog' | 'discord'>('hub');
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const fullText = "Rise or Stagnate. The choice is yours, Cultivator.";

  const handleLoginSuccess = () => {
    setAuthModalOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Admin routing fork after login success (Task #1)
    if (isAdmin) {
      window.location.hash = '#/command-center';
    }
  };

  const handleLogout = () => {
    signOut();
    setCurrentView('home');
    window.location.hash = '#/'; // Reset hash on logout
  };

  // Simple Hash-based Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      // Fix state pollution (W03)
      if (hash === '#/admin/bounty-console' || hash.startsWith('#/command-center')) {
        if (!isLoggedIn) {
          window.location.hash = '#/';
          setCurrentView('home');
          return;
        }
        if (!isAdmin) {
          window.location.hash = '#/';
          setCurrentView('home');
          return;
        }
        setCurrentView('command-center');
      } else if (hash.startsWith('#/builds/')) {
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
          setCurrentView('community-event' as any);
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
  }, [isLoggedIn, isAdmin]); // Re-run when login state or admin status changes

  // Auto-redirect admin on home view (Task #1)
  useEffect(() => {
    if (isLoggedIn && isAdmin && currentView === 'home') {
      window.location.hash = '#/command-center';
    }
  }, [isLoggedIn, isAdmin, currentView]);

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
    systemLog,
    setSystemLog,
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
    setSystemLog(prev => [...prev, { sender: 'user', text: answer }]);
    handleAnswer(answer);
  }, [handleAnswer, setSystemLog]);

  const initiateDiscovery = () => {
    startInitiation();
    setSystemLog([{ sender: 'system', text: 'INITIATING DAO PATH DISCOVERY...' }]);
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

  // Global Auth Trigger
  useEffect(() => {
    const handleOpenAuth = () => setAuthModalOpen(true);
    window.addEventListener('open-auth-modal', handleOpenAuth);
    return () => window.removeEventListener('open-auth-modal', handleOpenAuth);
  }, []);

  // Handle Quiz Progression in Terminal
  useEffect(() => {
    if (step === 'IDLE') return;

    if (step === 'Q1') {
      setSystemLog(prev => {
        const hasIntro = prev.some(l => l.text.includes("IDENTIFY YOUR STRENGTHS"));
        if (!hasIntro) {
          return [...prev, { sender: 'system', text: "THE SYSTEM AWAKENS. IDENTIFY YOUR STRENGTHS, CULTIVATOR." }];
        }
        return prev;
      });
    }

    const currentQ = questions.find(q => q.id === step);
    if (currentQ) {
      const timer = setTimeout(() => {
        setSystemLog(prev => {
          const hasQ = prev.some(l => l.text === currentQ.text);
          if (hasQ) return prev;
          return [...prev, { sender: 'system', text: currentQ.text }];
        });
      }, 600);
      return () => clearTimeout(timer);
    }

    if (step === 'COMPLETE' && assignedClass) {
      const timer = setTimeout(() => {
        setSystemLog(prev => {
          const completionText = `BINDING COMPLETE. DAO PATH SEALED: ${assignedClass}. WELCOME TO THE SECT.`;
          const hasComplete = prev.some(l => l.text === completionText);
          if (hasComplete) return prev;
          return [...prev, {
            sender: 'system',
            text: completionText,
            rank: assignedClass.includes('RANK A') ? 'A' : assignedClass.includes('RANK B') ? 'B' : 'F',
            qi: 150
          }];
        });
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [step, assignedClass, questions, setSystemLog]);

  // 2. 3D TILT EFFECT & SCROLL REVEAL
  useEffect(() => {
    let rafId: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (!phoneRef.current) return;
      
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        const x = (clientX - innerWidth / 2) / 25;
        const y = (clientY - innerHeight / 2) / 25;
        if (phoneRef.current) {
          phoneRef.current.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        }
      });
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
  }, [scanned, currentView, isLoggedIn, activeDiscipline]); // Added activeDiscipline

  const rizenMobile = builds.find(b => b.id === 'rizen-mobile') || builds[0];

  // Loading spinner while auth initializes (W16)
  if (authLoading) {
    return (
      <div className="portal-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-glitch" data-text="INITIALIZING COORD-NET LINK...">INITIALIZING COORD-NET LINK...</div>
      </div>
    );
  }

  return (
    <div className="portal">
      <AnnouncementBar
        label="LATEST RELEASE"
        message={`${rizenMobile.title} v1.0.0 is now Live`}
        ctaText="View Intel"
        ctaLink={`#/builds/${rizenMobile.id}`}
      />

      {currentView !== 'command-center' && (
        <Navbar
          setAuthModalOpen={setAuthModalOpen}
          setIsHovering={() => { }}
          currentView={currentView}
          setCurrentView={setCurrentView as any}
          isLoggedIn={isLoggedIn}
          user={operativeData}
          onLogout={handleLogout}
        />
      )}
      <ParticlesBackground />

      {!scanned && <ScannerOverlay onScanComplete={onScanComplete} />}

      {isLoggedIn && !isAdmin && currentView === 'home' ? (
        <ProtectedRoute>
          <Dashboard user={operativeData} />
        </ProtectedRoute>
      ) : currentView === 'command-center' ? (
        <ProtectedRoute requireAdmin>
          <CommandCenter />
        </ProtectedRoute>
      ) : currentView === 'home' ? (
        <>
          {/* 1. HERO SECTION */}
          <section className="hero" id="hero">
            <div className="hero-content reveal">
              <h1 className="glitch-title" data-text="RIZEN">RIZEN</h1>
              <div className="status-tag">CULTIVATION SYSTEM ONLINE</div>
              <p className="hero-subtitle-typed">{typedText}<span className="cursor">|</span></p>
              <p className="hero-description reveal">
                Stop playing games that don't matter. Turn your real life into a cultivation system.
              </p>
              <div className="cta-group reveal">
                <button className="btn-primary" onClick={initiateDiscovery}>Choose Your Dao Path</button>
                <button className="btn-secondary" onClick={() => setCurrentView('builds')}>View The Sect</button>
              </div>
              <a
                className="hero-apk-link reveal"
                href="https://drive.google.com/uc?export=download&id=1ZDqUhyvSqRQK1M9MC2p4l-DVlC7siOMf"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Get the App
                <span className="hero-apk-chip">APK · Android</span>
              </a>

              <Terminal
                log={systemLog}
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

          <RizenBrandVideo />

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
          <section className="section-padding" id="stakes" >
            <div className="centered-header reveal">
              <span className="status-tag">TRIBULATION_SYSTEM</span>
              <h2 className="title-large">HEAVENLY TRIBULATION</h2>
              <p className="p-large">Rizen ensures consistency through a high-integrity enforcement engine. Stagnation is not just ignored—it is flagged.</p>
            </div>

            <div className="threat-visual-grid">
              <div className="threat-visual-card reveal tilt-card">
                <div className="operative-meta" style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>
                  <div className="meta-icon">
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                    </svg>
                  </div>
                  <div className="meta-label" style={{ fontSize: '1rem' }}>QI_DEVIATION_DETECTION</div>
                </div>
                <h3 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>DAO HEART MONITORING</h3>
                <p>The protocol tracks your baseline activity. Significant drops in performance trigger a Qi Deviation, requiring immediate validation.</p>
              </div>
              <div className="threat-visual-card reveal tilt-card">
                <div className="operative-meta meta-red" style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>
                  <div className="meta-icon">
                    <svg viewBox="0 0 24 24" width="32" height="32" stroke="currentColor" strokeWidth="2" fill="none">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                    </svg>
                  </div>
                  <div className="meta-label" style={{ fontSize: '1rem' }}>CULTIVATION DECAY</div>
                </div>
                <h3 style={{ color: 'var(--accent-crimson)', marginBottom: '1rem' }}>SPIRITUAL ARTIFACT DEGRADATION</h3>
                <p>Failure to cultivate results in Qi Deviation. Your spiritual artifacts lose energy. The System does not forgive stagnation.</p>
              </div>
            </div>
          </section >

          {/* 3. CLASS STAGGERED GRID */}
          <section className="section-padding" id="disciplines">
            <div className="centered-header reveal">
              <h2 className="title-large">CHOOSE YOUR DAO PATH</h2>
              <p className="p-large" style={{ marginTop: '1rem' }}>Select a path to view its starting stats and loadout.</p>
            </div>
            <div className="stagger-grid">
              {DAO_PATHS.map((cls, i) => (
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
                  
                  {activeDiscipline === cls.name ? (
                    <button 
                      className="btn-primary" 
                      style={{ 
                        marginTop: '1.5rem', 
                        width: '100%', 
                        fontSize: '0.8rem', 
                        padding: '0.6rem 1rem',
                        animation: 'fade-in-up 0.3s forwards'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setAuthModalOpen(true);
                      }}
                    >
                      SELECT THIS PATH
                    </button>
                  ) : (
                    <div className="class-dots" style={{ display: 'flex', justifyContent: 'center', gap: '5px', marginTop: '1.5rem' }}>
                      <span style={{ width: '8px', height: '8px', background: 'var(--text-dim)', borderRadius: '50%', opacity: 0.3 }}></span>
                      <span style={{ width: '8px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }}></span>
                      <span style={{ width: '8px', height: '8px', background: 'var(--text-dim)', borderRadius: '50%', opacity: 0.3 }}></span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* COMBAT SIMULATOR */}
          <section className="section-padding threat-bg" id="combat">
            <div className="centered-header reveal">
              <span className="status-tag">TRIBULATION_CHAMBER</span>
              <h2 className="title-large">ENLIGHTENMENT TRIAL</h2>
              <p className="p-large" style={{ marginTop: '1rem' }}>Rizen is not a passive tracker. To authorize level progression, you must survive the Heavenly Tribulation through proven comprehension.</p>
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

          {/* PERSONAL RECORDS SECTION */}
          <section className="section-padding" id="records" >
            <div className="centered-header reveal">
              <h2 className="title-large">PERSONAL RECORDS</h2>
              <p className="p-large">Your only rival is yesterday's version of yourself. Track your evolution.</p>
            </div>
            <div className="rankings-container reveal" style={{ border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(2, 6, 23, 0.4)' }}>
              <div className="ranking-row header">
                <div>TYPE</div>
                <div>METRIC</div>
                <div>PEAK CULTIVATION</div>
                <div style={{ textAlign: 'center' }}>TREND</div>
                <div style={{ textAlign: 'right' }}>DATE</div>
              </div>
              {[
                { type: 'STRENGTH', metric: 'Daily Spirit Stones', best: '1,240 SS', trend: '▲ +15%', date: '2026-03-08' },
                { type: 'DAO HEART', metric: 'Longest Streak', best: '12 Days', trend: '🔥', date: '2026-03-05' },
                { type: 'COMPREHENSION', metric: 'Quests/Day', best: '7 Quests', trend: '▲ +2', date: '2026-03-05' },
                { type: 'VITALITY', metric: 'Sleep Quality', best: '94%', trend: '▲ +4%', date: '2026-03-10' },
                { type: 'SPIRITUAL SENSE', metric: 'Recall Accuracy', best: '98%', trend: '▲ +2%', date: '2026-03-11' }
              ].map((rec, i) => (
                <div key={i} className="ranking-row">
                  <div className="rank-num">{rec.type}</div>
                  <div className="rank-user" style={{ color: 'var(--text-primary)' }}>
                    {rec.metric}
                  </div>
                  <div><span className="rank-class" style={{ fontSize: '0.85rem', padding: '0.3rem 0.8rem' }}>{rec.best}</span></div>
                  <div style={{ textAlign: 'center', fontFamily: 'Fira Code', fontWeight: 600, fontSize: '0.9rem', color: 'var(--accent-emerald)' }}>{rec.trend}</div>
                  <div className="rank-rep" style={{ textAlign: 'right', opacity: 0.6, fontSize: '0.85rem' }}>{rec.date}</div>
                </div>
              ))}
            </div>
          </section >

          {/* ARSENAL BENTO */}
          <section className="section-padding" id="arsenal" >
            <div className="centered-header reveal" style={{ marginBottom: '4rem' }}>
              <span className="status-tag">RESOURCE_REPOSITORY</span>
              <h2 className="title-large" style={{ fontSize: '3rem' }}>SPIRITUAL ARTIFACTS</h2>
              <p className="p-large" style={{ marginTop: '1rem' }}>Access specialized toolsets and performance enhancers by validating technical milestones.</p>
            </div>
            <div className="arsenal-bento">
              <div
                className="bento-item reveal large-arsenal tilt-card interactive-card"
                onClick={() => setSelectedVaultItem(vaultContent['recon-script'])}
              >
                <div className="weapon-tag">ACTIVE_ARTIFACT // RANK A</div>
                <h3 style={{ fontSize: '1.8rem', margin: '0' }}>RECON_SUITE v4.2</h3>
                <div className="skill-code-box">
                  <div className="code-header"><span></span><span></span><span></span></div>
                  <code>./recon --target secure.protocol.internal --deep-scan</code>
                </div>
                <p style={{ marginTop: '1.5rem', color: 'var(--text-dim)' }}>Optimizes initial enumeration workflows. Decrypt intel to view full documentation.</p>
              </div>
              <div
                className="bento-item reveal small-arsenal tilt-card interactive-card"
                style={{ transitionDelay: '0.2s' }}
                onClick={() => setSelectedVaultItem(vaultContent['focus-stim'])}
              >
                <div className="weapon-tag" style={{ color: 'var(--text-dim)' }}>CULTIVATION_PILL</div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0' }}>FOCUS_ENHANCER</h3>
                <p style={{ color: 'var(--text-dim)' }}>Accelerates Qi absorption rate by 25% during closed-door cultivation sessions.</p>
                <div style={{ marginTop: '1rem', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}><div style={{ height: '100%', width: '40%', background: 'var(--accent-cyan)' }}></div></div>
              </div>
              <div className="bento-item reveal small-arsenal tilt-card" style={{ transitionDelay: '0.3s' }}>
                <div className="weapon-tag" style={{ color: 'var(--text-dim)' }}>HEAVENLY_MERIT</div>
                <h3 style={{ fontSize: '1.3rem', margin: '0 0 1rem 0' }}>ELITE_BADGE</h3>
                <p style={{ color: 'var(--text-dim)' }}>Visual validation of consecutive milestone completion. Reserved for cultivators of unwavering Dao Heart.</p>
                <div style={{ marginTop: '1rem', fontSize: '2rem', textAlign: 'center' }}>🛡️</div>
              </div>
              <div
                className="bento-item reveal large-arsenal tilt-card interactive-card"
                style={{ transitionDelay: '0.4s' }}
                onClick={() => setSelectedVaultItem(vaultContent['kernel-tamperer'])}
              >
                <div className="weapon-tag">DAO_KEY // RANK S</div>
                <h3 style={{ fontSize: '1.8rem', margin: '0 0 1rem 0' }}>KERNEL_INTEGRITY_TOOL</h3>
                <p style={{ color: 'var(--text-dim)' }}>Unlocks deep-system forensics and optimization paths. Requires Tier 3 proficiency in low-level architecture.</p>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                  <span className="mock-rank-s" style={{ width: 'auto', padding: '0.5rem 1rem' }}>VALIDATED</span>
                  <span className="mock-rank-a" style={{ width: 'auto', padding: '0.5rem 1rem', background: 'transparent', color: 'var(--text-dim)', border: '1px solid var(--text-dim)' }}>ARCHITECTURE_PENDING</span>
                </div>
              </div>
            </div>
          </section >

          {/* MANIFESTO SECTION */}
          <section className="section-padding" id="manifesto">
            <div className="centered-header reveal">
              <span className="status-tag">CORE_PRINCIPLES</span>
              <h2 className="title-large">THE CULTIVATOR'S DAO</h2>
            </div>
            <div className="manifesto-box reveal">
              <div className="manifesto-glitch">01. CONTINUOUS ASCENSION</div>
              <div className="manifesto-text">Stagnation is the silent failure of potential. We commit to a path of daily, incremental growth, ensuring our technical and physical baselines are always moving upward.</div>
              <div className="manifesto-glitch">02. THE SYSTEM SEES ALL</div>
              <div className="manifesto-text">Every action is a data point. The System tracks, analyzes, and judges your cultivation. Subjective effort means nothing — only proven mastery.</div>
              <div className="manifesto-glitch">03. SECT WISDOM</div>
              <div className="manifesto-text">We are cultivators on parallel paths. We share insights, refine techniques, and leverage collective comprehension to ascend.</div>
            </div>
          </section>

          {/* FINAL CALL */}
          <section className="final-cta reveal" >
            <div className="cta-content">
              <span className="status-tag">SYSTEM_READY</span>
              <h2 className="title-large" style={{ marginBottom: '1rem' }}>INITIALIZE YOUR ASCENSION</h2>
              <p style={{ fontSize: '1.2rem', color: 'var(--accent-cyan)', marginBottom: '3rem', fontFamily: 'Space Grotesk' }}>The Rizen protocol is operational. Will you begin your cultivation?</p>
              <button className="btn-primary large-btn" onClick={() => setAuthModalOpen(true)}>Bind The System</button>
            </div>
          </section >
        </>
      ) : currentView === 'admin-console' ? (
        <ProtectedRoute requireAdmin>
          <AdminBountyConsole />
        </ProtectedRoute>
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
          <span className="dot pulse"></span> SYSTEMS NOMINAL // SECT OPEN
        </div>
        <div className="footer-online-status">
          <div className="radar-circle"></div>
          <span className="online-number">1,204</span>
          <span className="online-label">CULTIVATORS ONLINE</span>
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
