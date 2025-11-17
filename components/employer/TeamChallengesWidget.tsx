import React, { useState } from 'react';
import { SparklesIcon, GiftIcon, PlusIcon, FlagIcon, ChevronDownIcon, UsersIcon, ArrowTrendingUpIcon } from '../Icons';
import Tooltip from '../Tooltip';
import { type Challenge } from '../../types/employer';
import { getAIChallengeSuggestion } from '../../services/ai/employerService';
import { calculateKpisForSegment, MOCK_EMPLOYEES } from '../../services/employerDataService';
import StatusTag from '../StatusTag';

interface TeamChallengesWidgetProps {
    data: any;
    challenges: Challenge[];
    onOpenCreateChallengeModal: (suggestion?: Omit<Challenge, 'id'>) => void;
}

const ChallengeCard: React.FC<{
    challenge: Challenge;
    isExpanded: boolean;
    onToggle: () => void;
}> = ({ challenge, isExpanded, onToggle }) => {
    // --- Accurate KPI Calculation for each challenge ---
    const challengeSegment = challenge.department === 'all'
        ? MOCK_EMPLOYEES
        : MOCK_EMPLOYEES.filter(e => e.department === challenge.department);
    
    const kpis = calculateKpisForSegment(challengeSegment);
    const currentValue = kpis[challenge.targetMetric];
    // --- End of accurate calculation ---

    const progress = Math.min((currentValue / challenge.targetValue) * 100, 100);
    const isCompleted = progress >= 100;

    // --- MOCK DATA FOR ENHANCED METRICS ---
    const baselineValue = challenge.targetValue * (0.6 + Math.random() * 0.15); // Simulate a starting point
    const lift = currentValue - baselineValue;
    const participationRate = 60 + Math.random() * 35; // Simulate participation
    const projection = currentValue * 1.15; // Simple projection
    const isOnTrack = projection > challenge.targetValue;
    
    const getStatus = () => {
        if (isCompleted) return { text: 'Completada', color: 'text-primary', bg: 'bg-primary/20' };
        if (isOnTrack) return { text: 'En rumbo', color: 'text-green-400', bg: 'bg-green-400/20' };
        return { text: 'En riesgo', isWarning: true };
    };
    const status = getStatus();

    return (
        <div className="bg-background rounded-xl">
            <button
                onClick={onToggle}
                className="w-full text-left p-3 flex items-center gap-3"
                aria-expanded={isExpanded}
            >
                <div className="flex-1 space-y-2">
                    <div className="font-bold text-sm text-on-surface flex items-center gap-2">
                        <span>{challenge.title}</span>
                        {status.isWarning ? (
                            <StatusTag>En riesgo</StatusTag>
                        ) : (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${status.bg} ${status.color}`}>{status.text}</span>
                        )}
                    </div>
                    <div className="h-2 w-full bg-active-surface rounded-full">
                        <div
                            className={`h-2 rounded-full transition-all duration-500 ease-out ${isCompleted ? 'bg-primary' : 'bg-accent'}`}
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
                <ChevronDownIcon className={`w-6 h-6 text-on-surface-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isExpanded ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <div className="px-3 pb-3 space-y-3">
                        <p className="text-xs text-on-surface-secondary">{challenge.description}</p>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-center">
                            <div className="bg-surface/50 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-on-surface-secondary flex items-center justify-center gap-1"><ArrowTrendingUpIcon className="w-4 h-4"/> Mejora del KPI</p>
                                <p className={`text-xl font-bold ${lift > 0 ? 'text-green-400' : 'text-danger'}`}>{lift > 0 ? '+' : ''}{lift.toFixed(1)} pts</p>
                            </div>
                            <div className="bg-surface/50 p-2 rounded-lg">
                                <p className="text-xs font-semibold text-on-surface-secondary flex items-center justify-center gap-1"><UsersIcon className="w-4 h-4"/> Tasa de Participación</p>
                                <p className="text-xl font-bold text-primary">{participationRate.toFixed(0)}%</p>
                            </div>
                            <div className="bg-surface/50 p-2 rounded-lg col-span-2 sm:col-span-1">
                                <p className="text-xs font-semibold text-on-surface-secondary">Proyección</p>
                                <p className={`text-xl font-bold ${isOnTrack ? 'text-on-surface' : 'text-yellow-400'}`}>{projection.toFixed(0)} / {challenge.targetValue}</p>
                            </div>
                        </div>

                        <div className="text-xs flex items-center gap-1.5 text-yellow-300 bg-surface/50 p-2 rounded-lg">
                            <GiftIcon className="w-3.5 h-3.5 flex-shrink-0" />
                            <div>
                                <span className="font-semibold">Incentivo:</span>
                                <span>{challenge.reward}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};


const TeamChallengesWidget: React.FC<TeamChallengesWidgetProps> = ({ data, challenges, onOpenCreateChallengeModal }) => {
    const [isSuggesting, setIsSuggesting] = useState(false);
    const [expandedChallengeId, setExpandedChallengeId] = useState<string | null>(challenges.length > 0 ? challenges[0].id : null);

    const handleToggle = (id: string) => {
        setExpandedChallengeId(prevId => (prevId === id ? null : id));
    };

    const handleSuggestChallenge = async () => {
        setIsSuggesting(true);
        try {
            const suggestion = await getAIChallengeSuggestion(data);
            if (suggestion) {
                onOpenCreateChallengeModal(suggestion);
            } else {
                alert("No se pudo generar una sugerencia en este momento.");
            }
        } catch (error) {
            console.error(error);
            alert("Ocurrió un error al contactar a la IA.");
        } finally {
            setIsSuggesting(false);
        }
    };

    const handleLaunchChallenge = () => {
        onOpenCreateChallengeModal();
    };

    return (
        <div className="bg-surface rounded-2xl p-5 relative h-full flex flex-col">
            <div className="absolute top-4 right-4">
                <Tooltip id="team-challenges-tooltip" text="Fomenta la colaboración y el bienestar con desafíos de equipo. Establece metas y ofrece recompensas para aumentar el engagement." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <FlagIcon className="w-6 h-6 mr-2 text-primary" />
                Iniciativas de Equipo
            </h3>
            
            <div className="flex-1 space-y-3">
                {challenges.map(challenge => (
                    <ChallengeCard
                        key={challenge.id}
                        challenge={challenge}
                        isExpanded={expandedChallengeId === challenge.id}
                        onToggle={() => handleToggle(challenge.id)}
                    />
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-active-surface/50 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button
                    onClick={handleSuggestChallenge}
                    disabled={isSuggesting}
                    className="w-full bg-primary/20 text-primary font-bold py-2.5 rounded-xl hover:bg-primary/30 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-wait"
                 >
                    {isSuggesting ? (
                        <>
                            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                            <span>Analizando...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5 mr-2" />
                            Sugerir Iniciativa con IA
                        </>
                    )}
                </button>
                 <button
                    onClick={handleLaunchChallenge}
                    className="w-full bg-active-surface text-on-surface font-bold py-2.5 rounded-xl hover:bg-background transition-colors flex items-center justify-center"
                 >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Crear Iniciativa Manual
                </button>
            </div>
        </div>
    );
};

export default TeamChallengesWidget;