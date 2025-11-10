import React from 'react';
import { useGoals } from '../contexts/GoalsContext';
import { PlusIcon, TrashIcon, BuildingBlocksIcon, InformationCircleIcon } from './Icons';
import { useModal } from '../contexts/ModalContext';

interface GoalsWidgetProps {
    variant?: 'full' | 'compact';
}

const GoalsWidget: React.FC<GoalsWidgetProps> = ({ variant = 'full' }) => {
    const { goals, deleteGoal } = useGoals();
    const { openModal } = useModal();

    const handleAddContribution = (goalId: string) => {
        openModal('addGoalContribution', { goalId });
    };

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
                {goals.map(goal => {
                    const percentage = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
                    const remaining = goal.targetAmount - goal.currentAmount;
                    return (
                        <div key={goal.id} className="bg-background p-3 rounded-xl transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20 focus-within:shadow-lg focus-within:shadow-primary/20">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl">{goal.icon}</span>
                                    <div>
                                        <p className="font-bold text-on-surface">{goal.name}</p>
                                        <p className="text-xs text-on-surface-secondary">
                                            {remaining > 0 ? `Faltan S/ ${remaining.toLocaleString()} para el tesoro` : '¡Tesoro Desbloqueado!'}
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
                                <div className="h-2 w-full bg-active-surface rounded-full">
                                    <div
                                        className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
                                        style={{ width: `${Math.min(100, percentage)}%` }}
                                    ></div>
                                </div>
                            </div>
                            {variant === 'full' && (
                                 <div className="mt-3 text-right">
                                    <button
                                        onClick={() => handleAddContribution(goal.id)}
                                        className="px-3 py-1 text-xs font-bold text-primary bg-primary/20 rounded-full hover:bg-primary/30"
                                    >
                                        + Añadir Fondos
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default GoalsWidget;