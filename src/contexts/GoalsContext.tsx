import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { generateUniqueId } from '@/utils';
import { Goal } from '@/types/goal';
// Remover imports problemáticos temporalmente
// import { useAlert } from './AlertContext';
import { trackEvent } from '@/services/analyticsService.ts';

// --- DEMO DATA ---
const initialGoals: Goal[] = [
    {
        id: 'goal-1',
        name: 'Viaje a Máncora',
        icon: '✈️',
        targetAmount: 3000,
        currentAmount: 2250, // 75%
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        lastContributionDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'goal-2',
        name: 'Nuevo Monitor 4K',
        icon: '💻',
        targetAmount: 2500,
        currentAmount: 750, // 30%
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
        lastContributionDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'goal-4', // New goal
        name: 'Curso de Finanzas',
        icon: '🎓',
        targetAmount: 800,
        currentAmount: 150, // ~19%
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'active',
    },
    {
        id: 'goal-3',
        name: 'Fondo de Emergencia',
        icon: '🛡️',
        targetAmount: 5000,
        currentAmount: 5000, // 100% Completed
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'completed',
        lastContributionDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
    },
];
// --- END DEMO DATA ---

interface GoalsContextType {
    goals: Goal[];
    addGoal: (newGoal: Goal, onSuccess?: () => void) => void;
    deleteGoal: (goalId: string) => void;
    updateGoalContribution: (goalId: string, amount: number, onSuccess?: () => void) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        try {
            const savedGoals = localStorage.getItem('treevu-goals');
            if (savedGoals) {
                setGoals(JSON.parse(savedGoals));
            } else {
                setGoals(initialGoals);
            }
        } catch (e) { 
            console.error("Failed to load goals from localStorage, loading demo data.", e);
            setGoals(initialGoals);
        }
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            localStorage.setItem('treevu-goals', JSON.stringify(goals));
        } catch (e) { console.error("Failed to save goals to localStorage", e); }
    }, [goals, isInitialLoad]);
    
    const addGoal = useCallback((newGoal: Goal, onSuccess?: () => void) => {
        const isFirstGoal = goals.length === 0;
        setGoals(prev => [...prev, newGoal]);
        
        // Ejecutar callback para lógica externa
        if (isFirstGoal && onSuccess) {
            onSuccess();
        }
    }, [goals.length]);

    const deleteGoal = useCallback((goalId: string) => {
        setGoals(prev => prev.map(g => g.id === goalId ? { ...g, status: 'abandoned' } : g));
    }, []);

    const updateGoalContribution = useCallback((goalId: string, amount: number, onSuccess?: () => void) => {
        // --- Telemetry (Result): Track successful action from stimulus ---
        const activeStimulusRaw = sessionStorage.getItem('active_stimulus');
        if (activeStimulusRaw) {
            try {
                const activeStimulus = JSON.parse(activeStimulusRaw);
                if (activeStimulus.id === 'savings_challenge') {
                    // Solo track si no hay problemas de dependencias
                    trackEvent('stimulus_responded', { 
                        stimulusId: activeStimulus.id,
                        result: 'success',
                        timeToConvert_ms: Date.now() - activeStimulus.shownAt,
                        properties: { contributionAmount: amount }
                    }, null); // Pasar null en lugar de user para evitar dependencias
                    sessionStorage.removeItem('active_stimulus');
                }
            } catch (error) {
                console.warn('Could not track stimulus event:', error);
            }
        }
        
        setGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const newAmount = Math.min(g.targetAmount, g.currentAmount + amount);
                const isCompleted = newAmount >= g.targetAmount;
                return {
                    ...g,
                    currentAmount: newAmount,
                    status: isCompleted ? 'completed' : 'active',
                    lastContributionDate: new Date().toISOString(),
                };
            }
            return g;
        }));

        // Ejecutar callback para lógica externa
        if (onSuccess) {
            onSuccess();
        }
    }, []);

    const value = useMemo(() => ({
        goals, addGoal, deleteGoal, updateGoalContribution,
    }), [goals, addGoal, deleteGoal, updateGoalContribution]);

    return (
        <GoalsContext.Provider value={value}>
            {children}
        </GoalsContext.Provider>
    );
};

export const useGoals = () => {
    const context = useContext(GoalsContext);
    if (context === undefined) {
        throw new Error('useGoals must be used within a GoalsProvider');
    }
    return context;
};
