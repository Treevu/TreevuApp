import React from 'react';
import { ArrowTrendingUpIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';

// --- SCORE BADGE ---
// Unifies the display of KPIs with visual hierarchy and semantic color
interface ScoreBadgeProps {
  label: string;
  value: string | number;
  trend?: number; // Percentage trend (+/-)
  variant?: 'success' | 'warning' | 'danger' | 'neutral';
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ 
  label, 
  value, 
  trend, 
  variant = 'neutral', 
  icon,
  size = 'md'
}) => {
  // Semantic Colors
  const colors = {
    success: 'text-emerald-400',
    warning: 'text-yellow-400',
    danger: 'text-red-400',
    neutral: 'text-white'
  };

  const trendColor = trend && trend > 0 ? 'text-emerald-400' : trend && trend < 0 ? 'text-red-400' : 'text-gray-400';
  
  // Typography Scale
  const valueSize = size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-3xl' : 'text-xl';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className={colors[variant]}>{icon}</span>}
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</span>
      </div>
      
      <div className={`font-bold ${valueSize} ${colors[variant]} tracking-tight`}>
        {value}
      </div>

      {trend !== undefined && (
        <div className={`flex items-center gap-1 mt-1 text-[10px] font-bold ${trendColor}`}>
          <ArrowTrendingUpIcon className={`w-3 h-3 ${trend < 0 ? 'rotate-180' : ''}`} />
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
  );
};

// --- SKELETON LOADER ---
// Reduces perceived latency during async operations
export const SkeletonLoader: React.FC<{ className?: string, type?: 'text' | 'block' | 'circle' }> = ({ className = '', type = 'block' }) => {
  const baseClass = "bg-gray-700/50 animate-pulse rounded";
  const typeClass = type === 'circle' ? 'rounded-full' : type === 'text' ? 'h-3 rounded' : 'h-full rounded-lg';
  
  return (
    <div className={`${baseClass} ${typeClass} ${className} animate-shimmer`}></div>
  );
};

// --- EMPTY STATE ---
// Friendly guidance when no data is available
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/5">
      <div className="bg-black/30 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h4 className="text-white font-bold mb-2">{title}</h4>
      <p className="text-sm text-gray-400 mb-6 max-w-xs mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
