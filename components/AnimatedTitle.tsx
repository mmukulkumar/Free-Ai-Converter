import React from 'react';

interface AnimatedTitleProps {
  text: string;
  className?: string; // Applied to the individual text characters
  containerClass?: string; // Applied to the wrapper
}

const AnimatedTitle: React.FC<AnimatedTitleProps> = ({ text, className = '', containerClass = '' }) => {
  return (
    <div className={`inline-flex items-center ${containerClass}`} aria-label={text}>
      {text.split('').map((char, i) => (
        <span 
            key={i} 
            className={`inline-block hover:-translate-y-1 transition-transform duration-300 ${className}`}
            style={{ transitionDelay: `${i * 50}ms` }}
        >
            {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </div>
  );
};

export default AnimatedTitle;