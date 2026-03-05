import { useRef, useState } from 'react';

const ParticlesBackground = () => {
  const particleContainerRef = useRef<HTMLDivElement>(null);

  // Initialize random values once on mount to avoid impure function calls during render
  const [particles] = useState(() =>
    [...Array(30)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 5}s`,
      animationDuration: `${5 + Math.random() * 10}s`
    }))
  );

  return (
    <div className="particles-container" ref={particleContainerRef}>
      {particles.map((style, i) => (
        <div
          key={i}
          className="particle"
          style={style}
        ></div>
      ))}
    </div>
  );
};

export default ParticlesBackground;
