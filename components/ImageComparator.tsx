import React, { useState, useRef, useCallback, useEffect } from 'react';

interface ImageComparatorProps {
  originalImage: string;
  enhancedImage: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, enhancedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, []);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  }

  useEffect(() => {
    const handleMouseUp = () => setIsDragging(false);
    
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        handleMove(e.clientX);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        handleMove(e.touches[0].clientX);
      }
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, handleMove]);

  return (
    <div className="w-full max-w-4xl mx-auto my-4 text-center">
        <p className="mb-2 text-gray-400">Drag the slider to compare</p>
        <div 
          ref={containerRef}
          className="relative w-full aspect-video rounded-lg overflow-hidden select-none cursor-ew-resize shadow-lg"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
        <img
            src={enhancedImage}
            alt="Enhanced"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
        />
        <div
            className="absolute inset-0 w-full h-full overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
            <img
            src={originalImage}
            alt="Original"
            className="absolute inset-0 w-full h-full object-contain"
            draggable={false}
            />
        </div>
        <div
            className="absolute top-0 bottom-0 w-1 bg-cyan-400/80 pointer-events-none"
            style={{ left: `calc(${sliderPosition}% - 2px)` }}
        >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-cyan-400/90 border-4 border-gray-900 flex items-center justify-center cursor-ew-resize">
              <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4 4 4m0 6l-4 4-4-4"></path></svg>
            </div>
        </div>
        <div className="absolute top-2 left-2 bg-black/50 px-2 py-1 rounded text-sm font-bold">Original</div>
        <div className="absolute top-2 right-2 bg-black/50 px-2 py-1 rounded text-sm font-bold">Enhanced</div>
        </div>
    </div>
  );
};

export default ImageComparator;