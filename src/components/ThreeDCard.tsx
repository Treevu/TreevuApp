import React, { useRef, useState } from 'react';

interface Props {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const ThreeDCard: React.FC<Props> = ({ children, onClick, className = '' }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Increased rotation range for more dramatic 3D effect (was 12)
    const rotateX = ((y - centerY) / centerY) * -20; 
    const rotateY = ((x - centerX) / centerX) * 20;

    setRotation({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => setIsHovering(true);
  
  const handleMouseLeave = () => {
    setIsHovering(false);
    setRotation({ x: 0, y: 0 }); // Reset to flat
  };

  return (
    <div 
      className={`relative w-full h-72 perspective-1000 cursor-pointer ${className}`}
      style={{ perspective: '1500px' }}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div 
        ref={cardRef}
        className={`w-full h-full bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl shadow-2xl p-6 flex flex-col items-center justify-center text-center will-change-transform ${
          isHovering ? 'transition-none' : 'transition-transform duration-500 ease-out'
        }`}
        style={{ 
          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) scale3d(${isHovering ? 1.05 : 1}, ${isHovering ? 1.05 : 1}, 1)`,
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Content gets pushed forward for depth */}
        <div style={{ transform: 'translateZ(60px)' }} className="pointer-events-none flex flex-col items-center transition-transform duration-200">
          {children}
        </div>
        
        {/* Dynamic lighting/glare effect */}
        <div 
          className="absolute inset-0 pointer-events-none rounded-2xl mix-blend-overlay"
          style={{
            background: `radial-gradient(circle at ${50 + (rotation.y * 2.5)}% ${50 + (rotation.x * -2.5)}%, rgba(255,255,255,0.3), transparent 50%)`,
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.2s ease'
          }}
        />
      </div>
    </div>
  );
};

export default ThreeDCard;