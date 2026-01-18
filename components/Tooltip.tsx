import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const targetRef = useRef<HTMLDivElement>(null);

  const updateCoords = () => {
    if (targetRef.current) {
      const rect = targetRef.current.getBoundingClientRect();
      setCoords({
        top: rect.top - 8, // 8px spacing above element
        left: rect.left + rect.width / 2
      });
    }
  };

  const handleMouseEnter = () => {
    updateCoords();
    setIsVisible(true);
  };

  const handleScroll = () => {
    if (isVisible) updateCoords();
  };

  useEffect(() => {
    if (isVisible) {
      window.addEventListener('scroll', handleScroll, true);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isVisible]);

  return (
    <>
      <div 
        ref={targetRef}
        className="inline-flex"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && createPortal(
        <div 
          className="fixed px-3 py-1.5 bg-gray-800 text-white text-xs font-medium rounded shadow-xl whitespace-nowrap z-[9999] pointer-events-none transform -translate-x-1/2 -translate-y-full animate-fade-in"
          style={{ top: coords.top, left: coords.left }}
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
        </div>,
        document.body
      )}
    </>
  );
};

export default Tooltip;