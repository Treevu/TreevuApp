import React, { forwardRef, useMemo } from 'react';
import { levelData } from '@/services/gamificationService.ts';
import { useModal } from '@/hooks/useZustandCompat';
import { TreevuLevel } from '@/types/common';
import { BroteIcon, PlantonIcon, ArbustoIcon, RobleIcon, BosqueIcon } from '@/components/ui/Icons';

interface GamificationBarProps {
    onOpen: () => void;
}

const levelIconComponents: Record<TreevuLevel, React.FC<{className?: string}>> = {
    [TreevuLevel.Brote]: BroteIcon,
    [TreevuLevel.Plantón]: PlantonIcon,
    [TreevuLevel.Arbusto]: ArbustoIcon,
    [TreevuLevel.Roble]: RobleIcon,
    [TreevuLevel.Bosque]: BosqueIcon,
};


const GamificationBar = forwardRef<HTMLButtonElement, GamificationBarProps>(({ onOpen }, ref) => {
    // Usuario estático
    const user = {
        level: 3 as TreevuLevel,
        progress: {
            expensesCount: 25,
            formalityIndex: 0.7
        },
        treevus: 2500
    };
    const { openModal } = useModal();

    if (!user) return null;

    const currentLevelData = levelData[user.level];
    const nextLevelData = currentLevelData.nextLevel ? levelData[currentLevelData.nextLevel] : null;
    
    const CurrentLevelIcon = levelIconComponents[user.level];
    const NextLevelIcon = nextLevelData ? levelIconComponents[nextLevelData.level] : null;


    let overallProgress = 100;

    if (nextLevelData) {
        const progressItems = (Object.keys(nextLevelData.goals) as Array<keyof typeof nextLevelData.goals>)
            .map(key => {
                const targetValue = nextLevelData.goals[key];
                if (!targetValue) return 0;
                const currentValue = user.progress[key] || 0;
                return Math.min((currentValue / targetValue) * 100, 100);
            });
        
        overallProgress = progressItems.length > 0
            ? progressItems.reduce((acc, item) => acc + item, 0) / progressItems.length
            : 100;
    }
    
    const percentageText = `${overallProgress.toFixed(0)}%`;

    return (
        <button
            ref={ref}
            onClick={onOpen}
            className="w-full bg-surface rounded-2xl p-3 flex flex-col text-left animate-fade-in-down focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary transition-all duration-200 ease-in-out hover:bg-active-surface hover:scale-[1.02] active:scale-[0.99]"
            aria-label={`Progreso al nivel ${nextLevelData?.name || 'Máximo'}. Nivel actual: ${currentLevelData.name}`}
        >
            {/* Top Row: Labels and Names - Only show if there's a next level */}
            {nextLevelData && (
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                    <div>
                        <p className="font-bold text-on-surface-secondary uppercase tracking-wider">Nivel Actual</p>
                        <p className="font-bold text-on-surface">{currentLevelData.name}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-bold text-on-surface-secondary uppercase tracking-wider">Siguiente Nivel</p>
                        <p className="font-bold text-on-surface">{nextLevelData.name}</p>
                    </div>
                </div>
            )}
            
            {/* Main Progress Display */}
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full flex items-center justify-center bg-active-surface/50 flex-shrink-0 relative text-on-surface">
                    <CurrentLevelIcon className="w-8 h-8" />
                 </div>
                <div className="flex-grow h-5 bg-active-surface rounded-full relative overflow-hidden progress-bar-bg-textured shadow-inner">
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out bg-primary progress-bar-neon"
                        style={{ width: `${overallProgress}%` }}
                    />
                    {nextLevelData && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span 
                                className="text-xs font-bold text-white transition-opacity duration-500"
                                style={{ 
                                    textShadow: '0 1px 2px rgba(0,0,0,0.6)',
                                    opacity: overallProgress > 15 ? 1 : 0
                                }}
                            >
                                {percentageText}
                            </span>
                        </div>
                    )}
                </div>
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-active-surface/50 flex-shrink-0 relative text-primary">
                    {NextLevelIcon ? (
                        <NextLevelIcon className="w-9 h-9 animate-goal-pulse"/>
                    ) : (
                         <span className="text-3xl" role="img" aria-label="Nivel máximo">🏆</span>
                    )}
                </div>
            </div>
             {/* Detailed Progress Numbers */}
            {nextLevelData && Object.keys(nextLevelData.goals).length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-4">
                    {nextLevelData.goals.expensesCount != null && (
                        <div className="text-center">
                            <p className="text-xs text-on-surface-secondary">Gastos Registrados</p>
                            <p className="font-bold text-lg text-on-surface">
                                {user.progress.expensesCount || 0} / {nextLevelData.goals.expensesCount}
                            </p>
                        </div>
                    )}
                    {nextLevelData.goals.formalityIndex != null && (
                        <div className="text-center">
                            <p className="text-xs text-on-surface-secondary">Índice de Formalidad</p>
                            <p className="font-bold text-lg text-on-surface">
                                {(user.progress.formalityIndex || 0).toFixed(0)}%
                            </p>
                        </div>
                    )}
                </div>
            )}
            
            {/* Text for Max Level */}
            {!nextLevelData && (
                 <div className="text-center mt-2">
                    <p className="font-bold text-on-surface">{currentLevelData.name}</p>
                    <p className="text-xs text-on-surface-secondary">¡Felicidades, has completado tu senda financiera!</p>
                    {user.level === TreevuLevel.Bosque && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // prevent onOpen from firing
                                openModal('prestige');
                            }}
                            className="mt-2 text-sm font-bold text-yellow-400 bg-yellow-400/20 px-3 py-1 rounded-full"
                        >
                            Forjar Leyenda 🏆
                        </button>
                    )}
                </div>
            )}
        </button>
    );
});

export default GamificationBar;