import React, { useState, useEffect } from 'react';
import './Navbar.css';

interface NavbarProps {
  setAuthModalOpen: (open: boolean) => void;
  setIsHovering: (hover: boolean) => void;
  currentView: 'home' | 'builds' | 'community';
  setCurrentView: (view: 'home' | 'builds' | 'community') => void;
}

const Navbar: React.FC<NavbarProps> = ({ setAuthModalOpen, setIsHovering, currentView, setCurrentView }) => {
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
    const sections = ['hero', 'stakes', 'disciplines', 'rankings', 'arsenal', 'manifesto'];
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      observer.disconnect();
    };
  }, []);

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
          <a
            href="#hero"
            className={`nav-item ${currentView === 'home' && activeSection === 'hero' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'hero')}
          >MISSION</a>
          <a
            href="#arsenal"
            className={`nav-item ${currentView === 'home' && activeSection === 'arsenal' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'arsenal')}
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
            href="#rankings"
            className={`nav-item ${currentView === 'home' && activeSection === 'rankings' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'rankings')}
          >LEADERBOARD</a>
          <a
            href="#manifesto"
            className={`nav-item ${currentView === 'home' && activeSection === 'manifesto' ? 'active' : ''}`}
            onClick={(e) => scrollToSection(e, 'manifesto')}
          >MANIFESTO</a>
          <div className="nav-actions">
            <button className="btn-nav-primary" onClick={() => { setAuthModalOpen(true); setMobileMenuOpen(false); }} onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>INITIALIZE</button>
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
