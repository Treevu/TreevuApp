
import React from 'react';
import { MOCK_CHALLENGES, MOCK_EMPLOYEES, calculateKpisForSegment } from '../services/employerDataService';
import { UsersIcon, GiftIcon, SparklesIcon, CheckBadgeIcon, RocketLaunchIcon } from '@/components/ui/Icons';
// FIX: Updated import from deprecated 'types.ts' to 'types/employer.ts'.
import { type Challenge } from '@/types/employer';

const getChallengeProgress = (challenge: Challenge) => {
    const segment = challenge.department === 'all'
        ? MOCK_EMPLOYEES
        : MOCK_EMPLOYEES.filter(e => e.department === challenge.department);
    
    if (segment.length === 0) {
        return { currentValue: 0, progress: 0 };
    }
    
    const kpis = calculateKpisForSegment(segment);
    const currentValue = kpis[challenge.targetMetric];
    const progress = Math.min((currentValue / challenge.targetValue) * 100, 100);
    
    return { currentValue, progress };
};

const ChallengeCard: React.FC<{ challenge: Challenge }> = ({ challenge }) => {
    const { currentValue, progress } = getChallengeProgress(challenge);
    const isCompleted = progress >= 100;
    
    const metricLabel = challenge.targetMetric === 'formalityScore' 
        ? 'Índice de Formalidad' 
        : 'Índice de Bienestar (FWI)';
    
    return (
        <div className={`bg-surface p-4 rounded-2xl border transition-all duration-300 ${isCompleted ? 'border-primary shadow-lg shadow-primary/10' : 'border-active-surface/50'}`}>
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted ? 'bg-primary/20' : 'bg-active-surface'}`}>
                    {isCompleted ? <CheckBadgeIcon className="w-8 h-8 text-primary" /> : <RocketLaunchIcon className="w-7 h-7 text-primary" />}
                </div>
                <div>
                    <p className={`font-bold text-on-surface ${isCompleted ? 'text-primary' : ''}`}>Misión: {challenge.title}</p>
                    <p className="text-xs text-on-surface-secondary mt-1">{challenge.description}</p>
                </div>
            </div>

            <div className="mt-4">
                <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1">
                    <span>{metricLabel}: <span className="font-bold text-on-surface">{currentValue.toFixed(0)} / {challenge.targetValue}</span></span>
                    <span className={`font-bold ${isCompleted ? 'text-primary' : 'text-on-surface'}`}>{progress.toFixed(0)}%</span>
                </div>
                <div className="h-2.5 w-full bg-active-surface rounded-full">
                    <div
                        className={`h-2.5 rounded-full transition-all duration-500 ease-out ${isCompleted ? 'bg-primary' : 'bg-accent'}`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            </div>
            
            <div className="mt-3 text-xs flex items-center gap-1.5 text-yellow-300 bg-background p-2 rounded-lg">
                <GiftIcon className="w-4 h-4 flex-shrink-0" />
                <div>
                    <span className="font-semibold">Botín de la Misión:</span>
                    <span className="ml-1">{challenge.reward}</span>
                </div>
            </div>
        </div>
    );
};

const ChallengesView: React.FC = () => {
    return (
        <div className="space-y-4 animate-grow-and-fade-in">
             <div className="bg-surface rounded-2xl p-4">
                <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center">
                    <RocketLaunchIcon className="w-6 h-6 mr-2 text-primary"/>
                    Expediciones Galácticas
                </h2>
                <p className="text-sm text-on-surface-secondary">
                    ¡Colabora con tu tripulación para completar misiones y obtener botín galáctico! Tu participación es clave para el éxito de la misión.
                </p>
            </div>
            <div className="space-y-3">
                {MOCK_CHALLENGES.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
            </div>
        </div>
    );
};

export default ChallengesView;
