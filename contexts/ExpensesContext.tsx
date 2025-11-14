import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { trackEvent } from '../services/analyticsService';
import { sendInformalExpenseNotification } from '../services/notificationService';
import { triggerInAppNotificationChecks } from '../services/inAppNotificationService';
import { generateUniqueId } from '../utils';
import { useAuth } from './AuthContext';
import { calculateTreevusForAction, STREAK_BONUS_CONFIG } from '../services/gamificationService';
import { useModal } from './ModalContext';
import { useNotifications } from './NotificationContext';
import { useGoals } from './GoalsContext';
import { useAlert } from './AlertContext';
import { useTribes } from './TribesContext';
import { checkExpenseAgainstPolicies } from '../services/policyService';
import { PolicyViolation } from '../types/policy';

import { CategoriaGasto, TipoComprobante, FwiComponents } from '../types/common';
import { Expense, ExpenseData } from '../types/expense';
import { NotificationType } from '../types/notification';

// This data now serves as a fallback if no archetype is selected or localStorage is cleared.
const initialExpenses: Expense[] = []; 


interface ExpensesContextType {
    expenses: Expense[];
    totalExpenses: number;
    totalAhorroPerdido: number;
    formalityIndex: number;
    formalityIndexByCount: number;
    fwi_v2: number;
    fwi_v2_components: FwiComponents;
    addExpense: (newExpenseData: ExpenseData & { imageUrl?: string }) => Expense;
    updateExpense: (expenseId: string, updatedData: Partial<ExpenseData>) => void;
    deleteExpense: (expenseId: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

// --- Gamification Constants for "Surprise Harvest" ---
const SURPRISE_HARVEST_CHANCE = 0.15; // 15% chance
const SURPRISE_BONUS_MIN = 50;
const SURPRISE_BONUS_MAX = 100;

export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    const { user, updateUserProgress, addTreevus, updateUserStreak } = useAuth();
    const { openModal } = useModal();
    const { addNotification, lastNotificationTimes } = useNotifications();
    const { goals } = useGoals();
    const { setAlert } = useAlert();
    const { updateMissionProgress } = useTribes();

    useEffect(() => {
        try {
            const savedExpenses = localStorage.getItem('treevu-expenses');
            if (savedExpenses) {
                setExpenses(JSON.parse(savedExpenses));
            } else {
                setExpenses(initialExpenses);
            }
        } catch (e) { 
            console.error("Failed to parse expenses from localStorage, loading demo data.", e); 
            setExpenses(initialExpenses);
        }
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            localStorage.setItem('treevu-expenses', JSON.stringify(expenses));
        } catch (e) { console.error("Failed to save expenses to localStorage", e); }
    }, [expenses, isInitialLoad]);

    const totalExpenses = useMemo(() => expenses.reduce((sum, expense) => sum + expense.total, 0), [expenses]);
    const totalAhorroPerdido = useMemo(() => expenses.reduce((sum, expense) => sum + expense.ahorroPerdido, 0), [expenses]);
    const totalFormalExpenses = useMemo(() => expenses.filter(e => e.esFormal).reduce((sum, expense) => sum + expense.total, 0), [expenses]);
    const formalityIndex = useMemo(() => totalExpenses > 0 ? (totalFormalExpenses / totalExpenses) * 100 : 0, [totalFormalExpenses, totalExpenses]);
    const formalityIndexByCount = useMemo(() => {
        if (expenses.length === 0) return 100;
        const formalCount = expenses.filter(e => e.esFormal).length;
        return (formalCount / expenses.length) * 100;
    }, [expenses]);
    
    // FWI 2.0 Calculation
    const { fwi_v2, fwi_v2_components } = useMemo(() => {
        const formalityScore = formalityIndex / 100;

        const leisureSpending = expenses
            .filter(e => e.categoria === CategoriaGasto.Ocio)
            .reduce((sum, e) => sum + e.total, 0);
        
        const essentialSpendingForBalance = expenses
            .filter(e => [CategoriaGasto.Transporte, CategoriaGasto.Alimentacion].includes(e.categoria))
            .reduce((sum, e) => sum + e.total, 0);

        const workLifeBalanceScore = essentialSpendingForBalance > 0 
            ? Math.min(1, (leisureSpending / essentialSpendingForBalance) * 2) 
            : 0.5;

        const selfDevSpending = expenses
            .filter(e => e.categoria === CategoriaGasto.Educacion)
            .reduce((sum, e) => sum + e.total, 0);
        
        const selfDevScore = Math.min(1, selfDevSpending / 100);

        const components: FwiComponents = {
            financialHealth: { name: 'Salud Financiera', value: formalityScore * 100, weight: 0.5 },
            workLifeBalance: { name: 'Balance Vida-Trabajo', value: workLifeBalanceScore * 100, weight: 0.3 },
            selfDevelopment: { name: 'Desarrollo Profesional', value: selfDevScore * 100, weight: 0.2 },
        };

        const score = (formalityScore * components.financialHealth.weight) + 
                      (workLifeBalanceScore * components.workLifeBalance.weight) + 
                      (selfDevScore * components.selfDevelopment.weight);

        return { fwi_v2: score * 100, fwi_v2_components: components };
    }, [expenses, formalityIndex]);

    useEffect(() => {
        if (isInitialLoad) return;
        updateUserProgress({
            expensesCount: expenses.length,
            formalityIndex: fwi_v2,
        });
    }, [expenses.length, fwi_v2, isInitialLoad, updateUserProgress]);
    
    const addExpense = useCallback((newExpenseData: ExpenseData & { imageUrl?: string }) => {
        const isFirstExpense = expenses.length === 0;

        let violations: PolicyViolation[] = [];
        if (user?.hasCorporateCard && newExpenseData.isCorporate) {
            violations = checkExpenseAgainstPolicies(newExpenseData as Expense);
        }

        const newExpense: Expense = {
            id: generateUniqueId(),
            ...newExpenseData,
            violations,
        };
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);

        // --- Telemetry (Result): Track successful action from stimulus ---
        const activeStimulusRaw = sessionStorage.getItem('active_stimulus');
        if (activeStimulusRaw) {
            const activeStimulus = JSON.parse(activeStimulusRaw);
            if (activeStimulus.id === 'bonus_formal_expense' && newExpense.esFormal) {
                trackEvent('stimulus_responded', { 
                    stimulusId: activeStimulus.id,
                    result: 'success',
                    timeToConvert_ms: Date.now() - activeStimulus.shownAt,
                }, user);
                sessionStorage.removeItem('active_stimulus'); // Track only once
            }
        }

        triggerInAppNotificationChecks(updatedExpenses, goals, addNotification, lastNotificationTimes);

        const treevusEarned = calculateTreevusForAction('add_expense', { expense: newExpense });
        let streakBonus = 0;
        let firstExpenseBonus = 0;
        let surpriseBonus = 0;

        if (isFirstExpense) {
            firstExpenseBonus = 75;
        }

        if (newExpense.esFormal && user) {
            if(user.tribeId) {
                updateMissionProgress(user.tribeId, 'formalExpenseCount', 1);
            }
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const todayString = today.toISOString().split('T')[0];
            const yesterdayString = yesterday.toISOString().split('T')[0];
            const lastStreakDate = user.streak?.lastDate || '';
            let newStreakCount = user.streak?.count || 0;

            if (lastStreakDate !== todayString) {
                if (lastStreakDate === yesterdayString) {
                    newStreakCount++;
                } else {
                    newStreakCount = 1;
                }
                updateUserStreak({ count: newStreakCount, lastDate: todayString });
                
                if (newStreakCount >= STREAK_BONUS_CONFIG.MIN_STREAK_FOR_BONUS) {
                    streakBonus = Math.min(
                        STREAK_BONUS_CONFIG.MAX_BONUS,
                        (newStreakCount - 1) * STREAK_BONUS_CONFIG.MULTIPLIER
                    );
                }
            }
            
            // --- Cosecha Sorpresa Logic ---
            if (Math.random() < SURPRISE_HARVEST_CHANCE) {
                surpriseBonus = Math.floor(Math.random() * (SURPRISE_BONUS_MAX - SURPRISE_BONUS_MIN + 1)) + SURPRISE_BONUS_MIN;
            }
        }
        
        const totalTreevus = treevusEarned + streakBonus + firstExpenseBonus + surpriseBonus;
        if (totalTreevus > 0) addTreevus(totalTreevus);

        const infoAction = { text: '¿Qué son?', onClick: () => openModal('treevusInfo') };

        if (violations.length > 0) {
            setAlert({
                message: `<strong>Alerta de Política:</strong> ${violations[0].message}`,
                type: 'warning',
            });
        } else if (surpriseBonus > 0) {
            setAlert({ message: `✨ ¡Cosecha Sorpresa! Ganaste un bono de <strong>+${totalTreevus} treevüs</strong>.`, type: 'success', action: infoAction });
        } else if (isFirstExpense) {
            setAlert({ message: `¡Tu primer brote! Ganaste <strong>+${totalTreevus} treevüs</strong> por tu primer registro.`, type: 'success', action: infoAction });
        } else if (streakBonus > 0) {
            const streakCount = (user?.streak?.count || 0) + 1;
            addNotification({ type: NotificationType.StreakBonus, title: `¡Racha de ${streakCount} días!`, message: `¡Felicidades! Ganaste ${totalTreevus} treevüs de bonificación por tu constancia.` });
            setAlert({ message: `¡Racha de ${streakCount} días! Ganaste <strong>+${totalTreevus} treevüs</strong>.`, type: 'success', action: infoAction });
        } else {
             const message = `${newExpense.mensaje || '¡Gasto guardado!'} (<strong>+${totalTreevus} treevüs</strong> 🌿)`;
             setAlert({ message, type: 'success', action: infoAction });
        }

        if (!newExpense.esFormal && newExpense.ahorroPerdido > 0) {
            sendInformalExpenseNotification(newExpense);
        }
        return newExpense;
    }, [expenses, user, goals, addTreevus, updateUserStreak, setAlert, addNotification, lastNotificationTimes, openModal, updateMissionProgress]);

    const updateExpense = useCallback((expenseId: string, updatedData: Partial<ExpenseData>) => {
        setExpenses(prev => prev.map(expense => expense.id === expenseId ? { ...expense, ...updatedData } : expense));
    }, []);

    const deleteExpense = useCallback((expenseId: string) => {
        setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    }, []);
    
    const value = useMemo(() => ({
        expenses, totalExpenses, totalAhorroPerdido, formalityIndex, formalityIndexByCount,
        fwi_v2, fwi_v2_components,
        addExpense, updateExpense, deleteExpense
    }), [expenses, totalExpenses, totalAhorroPerdido, formalityIndex, formalityIndexByCount, fwi_v2, fwi_v2_components, addExpense, updateExpense, deleteExpense]);

    return (
        <ExpensesContext.Provider value={value}>
            {children}
        </ExpensesContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpensesContext);
    if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpensesProvider');
    }
    return context;
};
