import React from 'react';

const GridLoader: React.FC = () => {
  // 13x13 = 169 dots
  return (
    <div 
        className="grid gap-[2px] mx-auto" 
        style={{ gridTemplateColumns: 'repeat(13, 1fr)', width: 'fit-content' }}
        aria-label="Loading"
    >
      {Array.from({ length: 169 }).map((_, i) => (
        <div 
            key={i} 
            className="w-[3px] h-[3px] bg-current rounded-full animate-pulse" 
            style={{ animationDelay: `${(i % 13) * 50}ms` }}
        />
      ))}
    </div>
  );
};

export default GridLoader;
