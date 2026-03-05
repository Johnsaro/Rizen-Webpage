import React, { useState, useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
  setAuthModalOpen: (open: boolean) => void;
  setIsHovering: (hover: boolean) => void;
  currentView: 'home' | 'builds' | 'community';
  setCurrentView: (view: 'home' | 'builds' | 'community') => void;
  isLoggedIn: boolean;
  user: any;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ setAuthModalOpen, setIsHovering, currentView, setCurrentView, isLoggedIn, user, onLogout }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Calculate scroll progress
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };

    // Intersection Observer for active sections
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px', // Trigger when section is in middle-top
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);
    const sections = isLoggedIn
      ? ['dashboard-home', 'dashboard-quests', 'dashboard-arsenal', 'dashboard-combat', 'dashboard-achievements', 'dashboard-leaderboard']
      : ['hero', 'stakes', 'disciplines', 'rankings', 'arsenal', 'manifesto'];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, [isLoggedIn]);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    if (currentView !== 'home') {
      setCurrentView('home');
      // Small delay to allow home view to render before scrolling
      setTimeout(() => {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }
    setMobileMenuOpen(false);
  };

  const handleBuildsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentView('builds');
    setMobileMenuOpen(false);
    window.location.hash = '#/builds';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCommunityClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setCurrentView('community');
    setMobileMenuOpen(false);
    window.location.hash = '#/community';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogoClick = () => {
    setCurrentView('home');
    if (isLoggedIn) {
      setTimeout(() => {
        const targetElement = document.getElementById('dashboard-home');
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onLogout();
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      {/* Scroll Progress Bar */}
      <div className="scroll-progress-container">
        <div
          className="scroll-progress-bar"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      </div>

      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
          RIZEN
        </div>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          {!isLoggedIn && (
            <a
              href="#hero"
              className={`nav-item ${currentView === 'home' && activeSection === 'hero' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'hero')}
            >MISSION</a>
          )}

          <a
            href={isLoggedIn ? "#dashboard-arsenal" : "#arsenal"}
            className={`nav-item ${currentView === 'home' && (activeSection === 'arsenal' || activeSection === 'dashboard-arsenal') ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, isLoggedIn ? 'dashboard-arsenal' : 'arsenal')}
          >ARSENAL</a>

          <a
            href="#/builds"
            className={`nav-item ${currentView === 'builds' ? 'active' : ''}`}
            onClick={handleBuildsClick}
          >BUILDS</a>

          <a
            href="#/community"
            className={`nav-item ${currentView === 'community' ? 'active' : ''}`}
            onClick={handleCommunityClick}
          >COMMUNITY</a>

          <a
            href={isLoggedIn ? "#dashboard-leaderboard" : "#rankings"}
            className={`nav-item ${currentView === 'home' && (activeSection === 'rankings' || activeSection === 'dashboard-leaderboard') ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, isLoggedIn ? 'dashboard-leaderboard' : 'rankings')}
          >LEADERBOARD</a>

          {!isLoggedIn && (
            <a
              href="#manifesto"
              className={`nav-item ${currentView === 'home' && activeSection === 'manifesto' ? 'active' : ''}`}
              onClick={(e) => scrollToSection(e, 'manifesto')}
            >MANIFESTO</a>
          )}

          <div className="nav-actions">
            {!isLoggedIn ? (
              <button
                className="btn-nav-primary"
                onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                INITIALIZE
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.4rem 1rem', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'var(--accent-cyan)', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 0 10px rgba(0, 228, 255, 0.2)' }}>
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="#000" strokeWidth="2" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <span style={{ fontFamily: 'Space Grotesk', fontSize: '0.75rem', letterSpacing: '1px', color: 'var(--text-dim)', opacity: 0.8 }}>
                    OPERATIVE: <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.85rem' }}>{user?.name || 'SHADOW-7'}</span>
                  </span>
                </div>
                <button
                  className="btn-nav-primary"
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', fontSize: '0.75rem', padding: '0.4rem 0.5rem', opacity: 0.6, transition: 'all 0.2s ease' }}
                  onClick={handleLogout}
                  onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-dim)'; e.currentTarget.style.opacity = '0.6'; }}
                >
                  DISCONNECT
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="navbar-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <div className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
