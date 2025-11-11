import React, { useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { trackEvent } from '@/services/analyticsService.ts';
import { SparklesIcon, RocketLaunchIcon } from '@/components/ui/Icons';
import { useModal } from '@/contexts/ModalContext';
import { useAppContext } from '@/contexts/AppContext';
import { Goal } from '@/types/goal';

const STIMULI = {
    savings_challenge: {
        id: 'savings_challenge',
        Icon: RocketLaunchIcon,
        title: 'Reto de Ahorro Rápido',
        description: '¡Estás cerca de tu meta! Aporta un extra ahora y acelera tu conquista.',
        cta: 'Aportar al Proyecto',
        action: (openModal: Function, goals: Goal[]) => {
            if (goals.length > 0) {
                // Prioriza la meta más avanzada
                const sortedGoals = [...goals].sort((a,b) => (b.currentAmount / b.targetAmount) - (a.currentAmount / a.targetAmount));
                openModal('addGoalContribution', { goalId: sortedGoals[0].id })
            }
        }
    },
    bonus_formal_expense: {
        id: 'bonus_formal_expense',
        Icon: SparklesIcon,
        title: 'Bono de Treevüs Activo',
        description: '¡Doble cosecha! Gana el doble de Treevüs por cada gasto formal que registres hoy.',
        cta: 'Registrar Hallazgo Formal',
        action: (openModal: Function) => openModal('addExpense')
    }
};

const ActionableInsightCard: React.FC = () => {
    const { user } = useAuth();
    const { openModal } = useModal();
    const { state: { goals } } = useAppContext();
    const hasGoals = goals && goals.length > 0;

    // 1. "Bandit Humano": Segmentación simple para A/B test manual.
    const stimulus = useMemo(() => {
        if (!user) return null;
        const group = user.id.charCodeAt(user.id.length - 1) % 2;
        
        // Si el usuario pertenece al grupo del reto de ahorro pero no tiene metas,
        // le mostramos el otro estímulo como fallback.
        if (group === 0 && hasGoals) {
            return STIMULI.savings_challenge;
        }
        return STIMULI.bonus_formal_expense;
    }, [user, hasGoals]);

    // 2. Telemetría (Acción): Registrar que el estímulo fue mostrado.
    useEffect(() => {
        if (stimulus && user) {
            trackEvent('stimulus_shown', { stimulusId: stimulus.id, stimulusTitle: stimulus.title }, user);
            // Guardar el estímulo en la sesión para poder rastrear la conversión.
            sessionStorage.setItem('active_stimulus', JSON.stringify({ id: stimulus.id, shownAt: Date.now() }));
        }
    }, [stimulus, user]);
    
    if (!stimulus) {
        return null;
    }
    
    const { Icon, title, description, cta, action } = stimulus;

    return (
        <div className="bg-surface rounded-2xl p-4 border-2 border-dashed border-primary animate-grow-and-fade-in">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h3 className="font-bold text-base text-on-surface">{title}</h3>
                    <p className="text-sm text-on-surface-secondary mt-1">{description}</p>
                </div>
            </div>
            <button
                onClick={() => action(openModal, goals)}
                className="w-full mt-4 bg-primary text-primary-dark font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
                {cta}
            </button>
        </div>
    );
};

export default ActionableInsightCard;
