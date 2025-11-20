
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
    success: 'text-emerald-600 dark:text-emerald-400',
    warning: 'text-yellow-600 dark:text-yellow-400',
    danger: 'text-red-600 dark:text-red-400',
    neutral: 'text-gray-900 dark:text-white'
  };

  const trendColor = trend && trend > 0 ? 'text-emerald-600 dark:text-emerald-400' : trend && trend < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400';
  
  // Typography Scale
  const valueSize = size === 'lg' ? 'text-5xl' : size === 'md' ? 'text-3xl' : 'text-xl';

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-2 mb-1">
        {icon && <span className={colors[variant]}>{icon}</span>}
        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</span>
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
export const SkeletonLoader: React.FC<{ className?: string, type?: 'text' | 'block' | 'circle' }> = ({ className = '', type = 'block' }) => {
  const baseClass = "bg-gray-200 dark:bg-gray-700/50 animate-pulse rounded";
  const typeClass = type === 'circle' ? 'rounded-full' : type === 'text' ? 'h-3 rounded' : 'h-full rounded-lg';
  
  return (
    <div className={`${baseClass} ${typeClass} ${className} animate-shimmer`}></div>
  );
};

// --- EMPTY STATE ---
interface EmptyStateProps {
  icon: React.ElementType;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, actionLabel, onAction }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed border-gray-300 dark:border-white/5 rounded-2xl bg-gray-50 dark:bg-white/5">
      <div className="bg-gray-200 dark:bg-black/30 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-500" />
      </div>
      <h4 className="text-gray-900 dark:text-white font-bold mb-2">{title}</h4>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">{description}</p>
      {actionLabel && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-white hover:bg-gray-100 dark:bg-white/10 dark:hover:bg-white/20 text-gray-900 dark:text-white border border-gray-200 dark:border-transparent text-xs font-bold rounded-lg transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
