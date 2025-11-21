import React from 'react';

interface TreevuLogoTextProps {
  className?: string;
  isTreevus?: boolean;
  colorClass?: string;
}

const TreevuLogoText: React.FC<TreevuLogoTextProps> = ({ className, isTreevus = false, colorClass = 'text-on-surface' }) => {
  return (
    <span className={className}>
      <span className={`text-primary ${colorClass}`}>treevü{isTreevus ? 's' : ''}</span>
      {/* <span className="text-danger">r</span>
      <span className={middleColorClass}>ee</span>
      <span className="text-danger">v</span>
      <span className="text-primary">ü</span> */}
    </span>
  );
};

export default TreevuLogoText;
