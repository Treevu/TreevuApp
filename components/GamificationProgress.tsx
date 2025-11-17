import React from 'react';
// FIX: Updated imports from deprecated 'types.ts' to use new domain-specific type files.
import { User } from '../types/user';
import { TreevuLevel } from '../types/common';
import { CheckIcon } from './Icons';
import { levelData } from '../services/gamificationService';

interface GamificationProgressProps {
    user: User;
}

const GamificationProgress: React.FC<GamificationProgressProps> = ({ user }) => {
    const currentLevelData = levelData[user.level];
    const nextLevelData = currentLevelData.nextLevel ? levelData[currentLevelData.nextLevel] : null;

    if (!currentLevelData) return null;

    const progressItems = nextLevelData 
        ? (Object.keys(nextLevelData.goals) as Array<keyof User['progress']>)
            .map((key) => {
                const targetValue = nextLevelData.goals[key];
                if (targetValue === undefined) return null;

                const currentValue = user.progress[key] || 0;
                const isComplete = currentValue >= targetValue;
                const progressPercentage = Math.min((currentValue / targetValue) * 100, 100);
                
                let text = '';
                if (key === 'expensesCount') text = `Registra ${targetValue} hallazgos (${currentValue}/${targetValue})`;
                if (key === 'formalityIndex') text = `Alcanza ${targetValue}% de formalidad (${currentValue.toFixed(0)}%/${targetValue}%)`;

                return { key, text, isComplete, progressPercentage };
            })
            .filter(item => item !== null) as { key: string; text: string; isComplete: boolean; progressPercentage: number }[]
        : [];

    const overallProgress = progressItems.length > 0
        ? progressItems.reduce((acc, item) => acc + item.progressPercentage, 0) / progressItems.length
        : 100;

    return (
        <div className="bg-background rounded-2xl p-4 w-full">
            <div className="flex items-center space-x-3">
                <span className="text-4xl">{currentLevelData.icon}</span>
                <div>
                    <p className="text-sm text-on-surface-secondary">Tu Nivel Actual</p>
                    <h3 className="text-lg font-bold text-primary">{currentLevelData.name}</h3>
                </div>
            </div>
            
            {nextLevelData && (
                 <div className="mt-4">
                    <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1">
                        <span>Progreso a <span className="font-bold">{nextLevelData.name}</span></span>
                        <span>{overallProgress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-active-surface rounded-full">
                        <div
                            className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
                            style={{ width: `${overallProgress}%` }}
                        ></div>
                    </div>
                </div>
            )}
            
            {progressItems.length > 0 && (
                <div className="mt-4 space-y-2">
                    {progressItems.map(item => (
                        <div key={item.key} className="flex items-center text-sm">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${item.isComplete ? 'bg-primary' : 'border-2 border-active-surface'}`}>
                                {item.isComplete && <CheckIcon className="w-3 h-3 text-primary-dark" />}
                            </div>
                            <span className={item.isComplete ? 'text-on-surface-secondary line-through' : 'text-on-surface'}>
                                {item.text}
                            </span>
                        </div>
                    ))}
                </div>
            )}
            
            {user.level === TreevuLevel.Bosque && (
                 <p className="mt-4 text-center text-warning font-semibold">¡Felicidades! Has alcanzado el máximo nivel de maestría financiera en <span><span className="text-primary">t</span><span className="text-danger">r</span><span className="text-on-surface">ee</span><span className="text-danger">v</span><span className="text-primary">ü</span></span>.</p>
            )}
        </div>
    );
};

export default GamificationProgress;