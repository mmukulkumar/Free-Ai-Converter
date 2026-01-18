import React, { useEffect, useRef } from 'react';
import anime from 'animejs';

interface AnimatedTitleProps {
  text: string;
  className?: string; // Applied to the individual text characters
  containerClass?: string; // Applied to the wrapper
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text, className = '', containerClass = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up any running animations on these targets
    anime.remove(containerRef.current.querySelectorAll('.letter-mover'));

    const timeline = anime.timeline({
      loop: true,
    });

    // Implementation of: 
    // chars: { wrap: 'clip', clone: 'bottom' },
    // y: '-100%', loop: true, loopDelay: 350, duration: 750, ease: 'inOut(2)', stagger(150, { from: 'center' })
    timeline.add({
      targets: containerRef.current.querySelectorAll('.letter-mover'),
      translateY: ['0%', '-100%'],
      duration: 750,
      easing: 'easeInOutQuad', // Matches 'inOut(2)'
      delay: anime.stagger(150, { from: 'center' }),
      endDelay: 2000 // Wait a bit before looping again for readability
    });

    return () => {
      timeline.pause();
    };
  }, [text]);

  return (
    <div ref={containerRef} className={`inline-flex items-center ${containerClass}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span key={i} className="relative inline-flex flex-col h-[1.1em] overflow-hidden leading-none">
           <span className="letter-mover block">
              <span className={`block h-[1.1em] ${className}`}>{char === ' ' ? '\u00A0' : char}</span>
              <span className={`block h-[1.1em] absolute top-full left-0 ${className}`}>{char === ' ' ? '\u00A0' : char}</span>
           </span>
        </span>
      ))}
    </div>
  );
};

export default AnimatedTitle;