
import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

const GridLoader: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const dots = containerRef.current.querySelectorAll('.dot');
    
    // Clean up previous animations
    anime.remove(dots);

    const options = {
      grid: [13, 13],
      from: 'center' as const,
    };

    const timeline = anime.timeline({
      loop: true,
      direction: 'alternate',
    });

    timeline.add({
      targets: dots,
      scale: anime.stagger([0.8, 1.25], options), // Scale from small to large from center
      opacity: anime.stagger([0.5, 1], options),
      easing: 'easeInOutQuad',
      delay: anime.stagger(50, options), // 50ms delay between each dot for ripple effect
      duration: 800
    });

    return () => {
      timeline.pause();
    };
  }, []);

  // 13x13 = 169 dots
  return (
    <div 
        ref={containerRef} 
        className="grid gap-[2px] mx-auto" 
        style={{ gridTemplateColumns: 'repeat(13, 1fr)', width: 'fit-content' }}
        aria-label="Loading"
    >
      {Array.from({ length: 169 }).map((_, i) => (
        <div key={i} className="dot w-[3px] h-[3px] bg-current rounded-full" />
      ))}
    </div>
  );
};

export default GridLoader;
