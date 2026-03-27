/* 
 * Owner: Alex | Last updated by: Gemini, 2026-03-19 
 */
import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import AnnouncementBar from './components/AnnouncementBar'
import HeroSection from './components/features/HeroSection'
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
import type { PlayerProfile } from './hooks/usePlayerProfile'
import { useTerminal } from './hooks/useTerminal'
import { useInitiation } from './hooks/useInitiation'
import { vaultContent } from './data/vaultContent'
import type { VaultItem } from './data/vaultContent'
import { builds } from './data/builds'
import type { Build } from './data/builds'
import Dashboard from './components/dashboard/Dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'

import CommandCenter from './pages/CommandCenter'

const DEFAULT_OPERATIVE: Partial<PlayerProfile> = {
  name: 'CULTIVATOR',
  main_path: 'Shadow Arts',
  level: 1,
  qi: 0,
  spirit_stones: 0,
  dao_heart_streak: 0,
  hp: 100,
  max_hp: 100,
};

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
    return {
      id: user?.id || 'usr_new_cultivator',
      name: profile?.name || user?.user_metadata?.full_name || user?.email?.split('@')[0].toUpperCase() || DEFAULT_OPERATIVE.name,
      class: profile?.main_path || user?.user_metadata?.class || DEFAULT_OPERATIVE.main_path,
      level: profile?.level || DEFAULT_OPERATIVE.level,
      stats: {
        hp: {
          current: profile?.hp || DEFAULT_OPERATIVE.hp,
          max: profile?.max_hp || DEFAULT_OPERATIVE.max_hp
        },
        xp: {
          current: profile?.qi || 0,
          max: 1000 // Hardcoded max for demo visualization
        },
        rep: profile?.spirit_stones || 0,
        streak: profile?.dao_heart_streak || 0,
        classXP: profile?.path_qi || {}
      }
    };
  }, [user, profile]);

  const [activeDiscipline, setActiveDiscipline] = useState<string | null>(null);
  const [revealedCards, setRevealedCards] = useState<Set<string>>(new Set());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [selectedVaultItem, setSelectedVaultItem] = useState<VaultItem | null>(null);
  const [currentView, setCurrentView] = useState<'home' | 'dashboard' | 'builds' | 'community' | 'community-event' | 'admin-console' | 'command-center'>('home');
  const [communitySubView, setCommunitySubView] = useState<'hub' | 'docs' | 'events' | 'blog' | 'discord' | 'roadmap'>('hub');
  const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
  const [activeSection, setActiveSection] = useState('hero');

  // Centralized Navigation Logic (Task #4)
  const navigateTo = useCallback((hash: string) => {
    // If it's an internal section scroll AND we are already on home
    if (hash.startsWith('#') && !hash.startsWith('#/') && currentView === 'home') {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        // Still update hash for consistency
        window.location.hash = hash;
        return;
      }
    }

    // Otherwise update hash for the router to handle view switching
    if (window.location.hash !== hash) {
      window.location.hash = hash;
    }
  }, [currentView]);
const handleLoginSuccess = () => {
  setAuthModalOpen(false);
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Admin routing fork after login success (Task #1)
  if (isAdmin) {
    navigateTo('#/command-center');
  } else {
    navigateTo('#/dashboard');
  }
};

const handleLogout = () => {
  signOut();
  setCurrentView('home');
  navigateTo('#/');
};
  // Simple Hash-based Router
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#/';
      
      // Fix state pollution (W03)
      if (hash === '#/dashboard') {
        if (!isLoggedIn) {
          navigateTo('#/');
          return;
        }
        setCurrentView('dashboard');
      } else if (hash === '#/admin/bounty-console' || hash.startsWith('#/command-center')) {
        if (!isLoggedIn || !isAdmin) {
          navigateTo('#/');
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
          } else if (subId.startsWith('roadmap')) {
            setCommunitySubView('roadmap');
          } else {
            setCommunitySubView('hub');
          }
        }
      } else if (hash === '#/community' || hash === '#/blog') {
        setCurrentView('community');
        setCommunitySubView('hub');
        setSelectedBuild(null);
      } else {
        // Catch-all: treat any other hash (including section hashes) as Home View
        setCurrentView('home');
        setSelectedBuild(null);
        
        // If it's a section hash, scroll to it after render
        if (hash.startsWith('#') && !hash.startsWith('#/')) {
          setTimeout(() => {
            const element = document.querySelector(hash);
            if (element) {
              element.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [isLoggedIn, isAdmin, navigateTo]);

  // Auto-redirect logged-in users based on role (Task #1)
  // Also catches the race condition where handleLoginSuccess routes admin to dashboard
  // before profile has loaded with is_admin flag
  useEffect(() => {
    if (!isLoggedIn || !profile) return;

    if (isAdmin && currentView === 'dashboard') {
      navigateTo('#/command-center');
    } else if (currentView === 'home') {
      navigateTo(isAdmin ? '#/command-center' : '#/dashboard');
    }
  }, [isLoggedIn, isAdmin, profile, currentView, navigateTo]);

  const openBuildDetail = (build: Build) => {
    navigateTo(`#/builds/${build.id}`);
  };

  const closeBuildDetail = () => {
    navigateTo(`#/builds`);
  };

  const {
    systemLog,
    setSystemLog,
    inputValue,
    setInputValue,
    isProcessing,
    isQiSurging,
    handleReportTask
  } = useTerminal();

  // Ensure window starts at top on view change or refresh (Task #4)
  useEffect(() => {
    // Disable browser's automatic scroll restoration immediately
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // For longer pages like the dashboard, a double-check helps if content renders staggard
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    
    return () => clearTimeout(timer);
  }, [currentView, authLoading]);

  // Dynamic Browser Tab Titles (Task #1)
  useEffect(() => {
    document.title = "RIZEN // Rise or Stagnate";
  }, []);

  const {
    step,
    questions,
    assignedClass,
    startInitiation,
    handleAnswer
  } = useInitiation();

  const onInitiationAnswer = useCallback((answer: string) => {
    setSystemLog(prev => [...prev, { sender: 'user', text: answer }]);
    handleAnswer(answer);
  }, [handleAnswer, setSystemLog]);

  const initiateDiscovery = () => {
    startInitiation();
    setSystemLog([{ sender: 'system', text: 'INITIATING DAO PATH DISCOVERY...' }]);
  };

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
          const completionText = `BINDING COMPLETE. DAO PATH SEALED: ${assignedClass}. THE SYSTEM AWAITS YOUR SOUL. REVEAL YOUR IDENTIFIER TO INITIALIZE.`;
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

  // Auto-open AuthModal when initiation is complete (Task #2)
  useEffect(() => {
    if (step === 'COMPLETE' && assignedClass) {
      const timer = setTimeout(() => {
        setSystemLog(prev => [...prev, { 
          sender: 'system', 
          text: 'ESTABLISHING SECURE UPLINK... PREPARING SOUL BINDING PROTOCOL.' 
        }]);
        setAuthModalOpen(true);
      }, 2000); // 2s delay to let user read the sealed path message
      return () => clearTimeout(timer);
    }
  }, [step, assignedClass, setSystemLog]);

  // 2. SCROLL REVEAL OBSERVER
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    // Small timeout to ensure DOM is ready after conditional renders (Task #3 optimization)
    const timer = setTimeout(() => {
      observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            const cardName = el.dataset.daoCard;
            if (cardName) {
              setRevealedCards(prev => {
                if (prev.has(cardName)) return prev;
                const next = new Set(prev);
                next.add(cardName);
                return next;
              });
            } else {
              requestAnimationFrame(() => {
                entry.target.classList.add('visible');
              });
            }
          }
        });
      }, { threshold: 0.1 });

      const elements = document.querySelectorAll('.reveal');
      elements.forEach(el => observer!.observe(el));
    }, 500);

    return () => {
      clearTimeout(timer);
      observer?.disconnect();
    };
  }, [currentView, isLoggedIn, authLoading]);

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
      {currentView !== 'command-center' && (
        <AnnouncementBar
          label="LATEST RELEASE"
          message={`${rizenMobile.title} v2.2.0 is now Live`}
          ctaText="View Intel"
          ctaLink={`#/builds/${rizenMobile.id}`}
        />
      )}

      {currentView !== 'command-center' && (
        <Navbar
          setAuthModalOpen={setAuthModalOpen}
          setIsHovering={() => { }}
          currentView={currentView}
          setCurrentView={setCurrentView as any}
          isLoggedIn={isLoggedIn}
          user={operativeData}
          onLogout={handleLogout}
          navigateTo={navigateTo}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
      )}

      {currentView === 'command-center' ? (
        <ProtectedRoute requireAdmin>
          <CommandCenter />
        </ProtectedRoute>
      ) : currentView === 'dashboard' ? (
        <ProtectedRoute>
          <div style={{ paddingTop: '5rem' }}>
            <Dashboard 
              user={operativeData} 
              isPreview={false} 
            />
          </div>
        </ProtectedRoute>
      ) : currentView === 'home' ? (
        <>
          <HeroSection 
            onInitiateDiscovery={initiateDiscovery}
            onViewSect={() => navigateTo('#/builds')}
            systemLog={systemLog}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isProcessing={isProcessing}
            isQiSurging={isQiSurging}
            handleReportTask={handleReportTask}
            step={step}
            questions={questions}
            onInitiationAnswer={onInitiationAnswer}
          />

          {/* DASHBOARD (Ghost Mode if not logged in) */}
          <div id="dashboard-section" className="reveal">
            <Dashboard 
              user={operativeData} 
              isPreview={!isLoggedIn} 
              onInteract={() => setAuthModalOpen(true)} 
            />
          </div>

          <div className="reveal">
            <RizenBrandVideo />
          </div>

          {/* SYSTEM ARCHITECTURE */}
          <div style={{ padding: '4rem 0' }} className="reveal">
            <SystemArchitecture />
          </div>

          {/* AGENT NETWORK */}
          <div style={{ paddingBottom: '4rem' }} className="reveal">
            <AgentNetwork />
          </div>

          {/* INFINITE MARQUEE SEPARATOR */}
          <div className="marquee-container reveal">
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
                  data-dao-card={cls.name}
                  className={`class-card-modern reveal ${revealedCards.has(cls.name) ? 'visible' : ''} ${activeDiscipline === cls.name ? 'active' : ''}`}
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
        onClose={() => {
          setAuthModalOpen(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        initialClass={assignedClass || undefined}
      />
      <VaultReader item={selectedVaultItem} onClose={() => setSelectedVaultItem(null)} />
    </div >
  )
}

export default App
