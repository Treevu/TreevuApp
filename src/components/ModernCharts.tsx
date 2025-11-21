
import React, { useEffect, useState } from 'react';

interface AreaChartProps {
  data: number[];
  color?: string; // Tailwind color class like 'text-emerald-400'
  gradientColor?: string; // Hex code for gradient like '#34D399'
  height?: number;
}

export const StreamlinedAreaChart: React.FC<AreaChartProps> = ({ 
  data, 
  color = "text-emerald-400", 
  gradientColor = "#34D399",
  height = 60 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (data.length < 2) return null;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 100; // SVG coordinate space

  // Normalize points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((d - min) / range) * (height * 0.8) - (height * 0.1); // Padding
    return { x, y };
  });

  // Create Path Command
  const linePath = `M ${points.map(p => `${p.x},${p.y}`).join(' L ')}`;
  const areaPath = `${linePath} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="w-full overflow-hidden" style={{ height: `${height}px` }}>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${gradientColor}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={gradientColor} stopOpacity="0.4" />
            <stop offset="100%" stopColor={gradientColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Area Fill - Animates Opacity */}
        <path
          d={areaPath}
          fill={`url(#gradient-${gradientColor})`}
          className={`transition-opacity duration-1000 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Line Stroke - Animates Draw */}
        <path
          d={linePath}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${color} transition-all duration-1000 ease-out`}
          style={{
            strokeDasharray: isVisible ? 200 : 0, // Hacky draw animation
            strokeDashoffset: 0,
            opacity: isVisible ? 1 : 0
          }}
        />
      </svg>
    </div>
  );
};
