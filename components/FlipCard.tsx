
import React, { useState } from 'react';
import { InformationCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  className?: string;
  heightClass?: string;
  themeColor?: 'emerald' | 'blue' | 'purple' | 'accent'; // New prop for theming
}

const FlipCard: React.FC<FlipCardProps> = ({ 
  frontContent, 
  backContent, 
  className = '', 
  heightClass = 'h-48',
  themeColor = 'accent' 
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Map theme colors to tailwind classes
  // Light Mode: darker text, lighter bg
  // Dark Mode: lighter text, darker bg
  const colorClasses = {
    emerald: { 
        text: 'text-emerald-600 dark:text-emerald-400', 
        bg: 'bg-emerald-100 dark:bg-emerald-500/10 hover:bg-emerald-200 dark:hover:bg-emerald-500/20', 
        border: 'border-emerald-200 dark:border-emerald-500/30',
        hoverBorder: 'hover:border-emerald-400 dark:hover:border-emerald-500/50'
    },
    blue: { 
        text: 'text-blue-600 dark:text-blue-400', 
        bg: 'bg-blue-100 dark:bg-blue-500/10 hover:bg-blue-200 dark:hover:bg-blue-500/20', 
        border: 'border-blue-200 dark:border-blue-500/30',
        hoverBorder: 'hover:border-blue-400 dark:hover:border-blue-500/50'
    },
    purple: { 
        text: 'text-purple-600 dark:text-purple-400', 
        bg: 'bg-purple-100 dark:bg-purple-500/10 hover:bg-purple-200 dark:hover:bg-purple-500/20', 
        border: 'border-purple-200 dark:border-purple-500/30',
        hoverBorder: 'hover:border-purple-400 dark:hover:border-purple-500/50'
    },
    accent: { 
        text: 'text-yellow-600 dark:text-accent', 
        bg: 'bg-yellow-100 dark:bg-accent/10 hover:bg-yellow-200 dark:hover:bg-accent/20', 
        border: 'border-yellow-200 dark:border-accent/30',
        hoverBorder: 'hover:border-yellow-400 dark:hover:border-accent/50'
    },
  };

  const theme = colorClasses[themeColor] || colorClasses.accent;

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`relative group perspective-1000 ${heightClass} ${className}`}>
      <div
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
      >
        {/* Front Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div 
            onClick={handleToggle}
            className={`w-full h-full bg-surface border ${theme.border} rounded-2xl p-6 shadow-lg flex flex-col relative overflow-hidden ${theme.hoverBorder} transition-colors cursor-pointer`}
          >
            {/* Info Toggle Button (Visual cue) */}
            <button
              type="button"
              className="absolute top-3 right-3 p-1.5 rounded-full bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors z-20"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </button>
            
            {/* Content */}
            <div className="flex-1 relative z-10 pointer-events-none">
               <div className="pointer-events-auto h-full">
                  {frontContent}
               </div>
            </div>
            
            {/* Decor */}
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gray-100 dark:bg-white/5 rounded-full blur-2xl pointer-events-none"></div>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div 
            onClick={handleToggle}
            className={`w-full h-full bg-gray-50 dark:bg-base border ${theme.border} rounded-2xl p-6 shadow-xl flex flex-col relative overflow-hidden cursor-pointer`}
          >
            {/* Return Toggle Button (Visual cue) */}
            <button
              type="button"
              className={`absolute top-3 right-3 p-1.5 rounded-full ${theme.bg} ${theme.text} transition-colors z-20`}
            >
              <ArrowPathIcon className="w-5 h-5" />
            </button>

            {/* Explanation Content */}
            <div className="flex-1 flex flex-col justify-center items-center text-center relative z-10 pointer-events-none">
              <h4 className={`${theme.text} font-bold text-sm uppercase tracking-wider mb-2`}>Concepto Clave</h4>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                {backContent}
              </div>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-4 opacity-50">(Toca para volver)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
