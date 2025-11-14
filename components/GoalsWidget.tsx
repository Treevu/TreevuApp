import React, { useMemo, useEffect, useRef } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { PlusIcon, TrashIcon, BuildingBlocksIcon, InformationCircleIcon, TrophyIcon } from './Icons';
import { useModal } from '../contexts/ModalContext';
import { useAuth } from '../contexts/AuthContext';

interface GoalsWidgetProps {
    variant?: 'full' | 'compact';
}

const GoalsWidget: React.FC<GoalsWidgetProps> = ({ variant = 'full' }) => {
    const { state: { goals }, deleteGoal } = useAppContext();
    const { openModal } = useModal();
    const { user } = useAuth();

    const handleAddContribution = (goalId: string) => {
        openModal('addGoalContribution', { goalId });
    };

    // Sort goals to show completed ones first, then by progress
    const sortedGoals = [...goals].sort((a, b) => {
        const aCompleted = a.currentAmount >= a.targetAmount;
        const bCompleted = b.currentAmount >= b.targetAmount;

        if (aCompleted && !bCompleted) return -1; // a (completed) comes first
        if (!aCompleted && bCompleted) return 1;  // b (completed) comes first
        
        // If both are incomplete, sort by progress percentage descending
        if (!aCompleted && !bCompleted) {
             const aProgress = a.targetAmount > 0 ? a.currentAmount / a.targetAmount : 0;
             const bProgress = b.targetAmount > 0 ? b.currentAmount / b.targetAmount : 0;
             if (aProgress !== bProgress) return bProgress - aProgress;
        }

        // Fallback to creation date if progress is the same or both are completed
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    // --- IMPLEMENTACIÓN: Logro Compartible (Meta Cumplida) ---
    const completedGoalsCount = useMemo(() => goals.filter(g => g.status === 'completed' || (g.targetAmount > 0 && g.currentAmount >= g.targetAmount)).length, [goals]);
    const prevCompletedGoalsCountRef = useRef(completedGoalsCount);

    useEffect(() => {
        if (user && completedGoalsCount > prevCompletedGoalsCountRef.current) {
            const newlyCompletedGoal = goals.find(g => (g.status === 'completed' || g.currentAmount >= g.targetAmount));
            if (newlyCompletedGoal) {
                 openModal('achievementShare', {
                    title: '¡Proyecto Conquistado!',
                    subtitle: `Has alcanzado la meta de "${newlyCompletedGoal.name}"`,
                    userName: user.name,
                    userPicture: user.picture,
                });
            }
        }
        prevCompletedGoalsCountRef.current = completedGoalsCount;
    }, [completedGoalsCount, openModal, user, goals]);
    // --- FIN IMPLEMENTACIÓN ---

    if (goals.length === 0) {
        if (variant === 'full') {
            return (
                <div className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center justify-center animate-grow-and-fade-in border border-dashed dark:border-dotted border-active-surface/80 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
                    <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                        <BuildingBlocksIcon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-lg text-on-surface">Marca tu Primer Tesoro</h3>
                    <p className="text-sm text-on-surface-secondary mt-1 mb-3 max-w-xs">Dale un propósito a tu ahorro. Cada proyecto es un tesoro esperando ser descubierto en tu mapa.</p>
                    <button
                        onClick={() => openModal('setGoal')}
                        className="bg-primary text-primary-dark font-bold py-2 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center"
                    >
                        <PlusIcon className="w-5 h-5 mr-1.5" />
                        Crear Proyecto
                    </button>
                </div>
            );
        }
        // Compact empty state
        return (
             <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in" style={{ animationDelay: '100ms' }}>
                <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                    <BuildingBlocksIcon className="w-6 h-6 mr-2 text-primary" />
                    Avance de Proyectos
                </h2>
                <div className="text-center py-4">
                    <p className="text-sm text-on-surface-secondary">
                        Aún no tienes proyectos de ahorro. Ve a 'Inicio' para crear tu primero.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-on-surface flex items-center">
                        <BuildingBlocksIcon className="w-6 h-6 mr-2 text-primary"/>
                        {variant === 'full' ? 'Mis Proyectos de Conquista' : 'Avance de Proyectos'}
                    </h2>
                    {variant === 'full' && (
                        <div className="tooltip-container">
                            <button className="text-on-surface-secondary hover:text-on-surface" aria-label="Más información sobre los proyectos de ahorro">
                                <InformationCircleIcon className="w-5 h-5" />
                            </button>
                            <div className="tooltip-box" role="tooltip">
                                Define tus grandes metas como 'Proyectos de Conquista'. Registra lo que 'inviertes' en ellos para ver cómo te acercas a tu tesoro. (No mueve dinero real).
                            </div>
                        </div>
                    )}
                </div>
                {variant === 'full' && (
                    <button
                        onClick={() => openModal('setGoal')}
                        className="text-primary hover:opacity-80 flex items-center text-sm font-semibold transition-opacity"
                    >
                        <PlusIcon className="w-4 h-4 mr-1" />
                        Nuevo
                    </button>
                )}
            </div>
            <div className="space-y-4">
                {sortedGoals.map(goal => {
                    const isCompleted = goal.currentAmount >= goal.targetAmount;
                    const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                    
                    return (
                        <div key={goal.id} className={`bg-background p-3 rounded-xl transition-all duration-300 ${isCompleted ? 'border border-dashed border-primary shadow-lg shadow-primary/10' : 'hover:shadow-lg hover:shadow-primary/20 focus-within:shadow-lg focus-within:shadow-primary/20'}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{goal.icon}</span>
                                    <div>
                                        <p className="font-bold text-on-surface">{goal.name}</p>
                                        <p className="text-xs text-on-surface-secondary">
                                            {isCompleted ? '¡Tesoro Conquistado!' : `Faltan S/ ${(goal.targetAmount - goal.currentAmount).toLocaleString()} para el tesoro`}
                                        </p>
                                    </div>
                                </div>
                                {variant === 'full' && (
                                    <button onClick={() => deleteGoal(goal.id)} className="text-on-surface-secondary hover:text-danger transition-colors" aria-label={`Eliminar proyecto ${goal.name}`}>
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                             <div className="mt-2">
                                <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1 font-medium">
                                    <span>S/ {goal.currentAmount.toLocaleString()}</span>
                                    <span>S/ {goal.targetAmount.toLocaleString()}</span>
                                </div>
                                <div className="h-2 w-full bg-active-surface rounded-full progress-bar-bg-textured">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ease-out ${isCompleted ? 'bg-gradient-to-r from-primary to-emerald-400 progress-bar-neon' : 'bg-primary'}`}
                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                    ></div>
                                </div>
                            </div>
                            {variant === 'full' && (
                                isCompleted ? (
                                    <div className="mt-3 text-center p-2 bg-primary/10 rounded-lg animate-fade-in">
                                        <p className="font-bold text-primary flex items-center justify-center gap-2">
                                            <TrophyIcon className="w-5 h-5" title="Trofeo" /> ¡Misión Cumplida!
                                        </p>
                                        <p className="text-xs text-on-surface-secondary mt-1">¡Felicidades! Usa esta motivación para tus otros proyectos.</p>
                                    </div>
                                ) : (
                                    <div className="mt-3 text-right">
                                        <button
                                            onClick={() => handleAddContribution(goal.id)}
                                            className="px-3 py-1 text-xs font-bold text-primary bg-primary/20 rounded-full hover:bg-primary/30"
                                        >
                                            + Añadir Fondos
                                        </button>
                                    </div>
                                )
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalsWidget;
