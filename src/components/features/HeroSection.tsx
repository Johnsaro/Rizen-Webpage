/* 
 * Owner: Alex | Last updated by: Gemini, 2026-03-14 
 */
import { useEffect, useState, useRef } from 'react'
import Terminal from './Terminal'
import PhoneMockup from './PhoneMockup'
import ScannerOverlay from '../layout/ScannerOverlay'
import ParticlesBackground from '../layout/ParticlesBackground'

interface HeroSectionProps {
  onInitiateDiscovery: () => void;
  onViewSect: () => void;
  systemLog: any[];
  inputValue: string;
  setInputValue: (val: string) => void;
  isProcessing: boolean;
  isQiSurging?: boolean;
  handleReportTask: (task: string) => void;
  step: string;
  questions: any[];
  onInitiationAnswer: (answer: string) => void;
}

const HeroSection = ({
  onInitiateDiscovery,
  onViewSect,
  systemLog,
  inputValue,
  setInputValue,
  isProcessing,
  isQiSurging,
  handleReportTask,
  step,
  questions,
  onInitiationAnswer
}: HeroSectionProps) => {
  const [scanned, setScanned] = useState(false);
  const [typedText, setTypedText] = useState("");
  const phoneRef = useRef<HTMLDivElement>(null);
  const fullText = "Rise or Stagnate. The choice is yours, Cultivator.";

  // 1. SCAN COMPLETION
  const onScanComplete = () => {
    setScanned(true);
  };

  // 2. TYPING ANIMATION
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

  // 3. 3D TILT EFFECT & SCROLL REVEAL
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

    if (scanned) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [scanned]);

  return (
    <>
      <ParticlesBackground />
      {!scanned && <ScannerOverlay onScanComplete={onScanComplete} />}
      
      <section className="hero" id="hero">
        <div className="hero-content reveal visible">
          <h1 className="glitch-title" data-text="RIZEN">RIZEN</h1>
          <div className="status-tag">CULTIVATION SYSTEM ONLINE</div>
          <p className="hero-subtitle-typed">{typedText}<span className="cursor">|</span></p>
          
          <Terminal
            log={systemLog}
            inputValue={inputValue}
            setInputValue={setInputValue}
            isProcessing={isProcessing}
            isQiSurging={isQiSurging}
            onReportTask={handleReportTask}
            initiationStep={step}
            initiationQuestions={questions}
            onInitiationAnswer={onInitiationAnswer}
            isScanned={scanned}
          />

          <p className="hero-description reveal visible">
            Stop playing games that don't matter. Turn your real life into a cultivation system.
          </p>
          <div className="cta-group reveal visible">
            <button className="btn-primary" onClick={onInitiateDiscovery}>Choose Your Dao Path</button>
            <button className="btn-secondary" onClick={onViewSect}>View The Sect</button>
          </div>
          <a
            className="hero-apk-link reveal visible"
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
        </div>

        <div className="reveal visible">
          <PhoneMockup phoneRef={phoneRef} />
        </div>
      </section>
    </>
  );
};

export default HeroSection;
