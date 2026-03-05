import { useRef } from 'react';

const ParticlesBackground = () => {
  const particleContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="particles-container" ref={particleContainerRef}>
      {[...Array(30)].map((_, i) => (
        <div 
          key={i} 
          className="particle" 
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${5 + Math.random() * 10}s`
          }}
        ></div>
      ))}
    </div>
  );
};

export default ParticlesBackground;
