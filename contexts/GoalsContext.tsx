
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { generateUniqueId } from '../utils';
import { Goal } from '../types/goal';
import { useAuth } from './AuthContext';
import { useAlert } from './AlertContext';

// --- DEMO DATA ---
const initialGoals: Goal[] = [
    {
        id: 'goal-1',
        name: 'Viaje a Máncora',
        icon: '✈️',
        targetAmount: 3000,
        currentAmount: 2250, // 75%
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'goal-2',
        name: 'Nuevo Monitor 4K',
        icon: '💻',
        targetAmount: 2500,
        currentAmount: 750, // 30%
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'goal-4', // New goal
        name: 'Curso de Finanzas',
        icon: '🎓',
        targetAmount: 800,
        currentAmount: 150, // ~19%
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'goal-3',
        name: 'Fondo de Emergencia',
        icon: '🛡️',
        targetAmount: 5000,
        currentAmount: 5000, // 100% Completed
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    },
];
// --- END DEMO DATA ---

interface GoalsContextType {
    goals: Goal[];
    addGoal: (newGoal: Omit<Goal, 'id' | 'currentAmount' | 'createdAt'>) => void;
    deleteGoal: (goalId: string) => void;
    updateGoalContribution: (goalId: string, amount: number) => void;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

export const GoalsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [goals, setGoals] = useState<Goal[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const { addTreevus } = useAuth();
    const { setAlert } = useAlert();

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
    
    const addGoal = useCallback((goalData: Omit<Goal, 'id' | 'currentAmount' | 'createdAt'>) => {
        if (goals.length === 0) {
            addTreevus(25);
            setAlert({
                message: '¡Primer tesoro marcado! Has ganado <strong>+25 treevüs</strong> 🌿',
                type: 'success'
            });
        }
        const newGoal: Goal = {
            id: generateUniqueId(),
            currentAmount: 0,
            createdAt: new Date().toISOString(),
            ...goalData
        };
        setGoals(prev => [...prev, newGoal]);
    }, [goals, addTreevus, setAlert]);

    const deleteGoal = useCallback((goalId: string) => {
        setGoals(prev => prev.filter(g => g.id !== goalId));
    }, []);

    const updateGoalContribution = useCallback((goalId: string, amount: number) => {
        setGoals(prev => prev.map(g =>
            g.id === goalId
                ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
                : g
        ));
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
