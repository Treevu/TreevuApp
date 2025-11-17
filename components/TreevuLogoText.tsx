import React from 'react';

interface TreevuLogoTextProps {
  className?: string;
  isTreevus?: boolean;
  middleColorClass?: string;
}

const TreevuLogoText: React.FC<TreevuLogoTextProps> = ({ className, isTreevus = false, middleColorClass }) => {
  
  // Use the theme's primary color for high contrast and consistency, removing the multi-color gradient.
  // The middleColorClass prop is kept for specific overrides where needed (e.g., StatusCard).
  const textClasses = middleColorClass
    ? middleColorClass
    : 'text-primary';

  return (
    <span className={`font-black ${textClasses} ${className}`}>
      treevü{isTreevus ? 's' : ''}
    </span>
  );
};

export default TreevuLogoText;