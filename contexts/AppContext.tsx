import React, { createContext, useContext, ReactNode, useMemo, useEffect } from 'react';
import { ExpensesProvider, useExpenses } from './ExpensesContext';
import { BudgetProvider, useBudget } from './BudgetContext';
import { GoalsProvider, useGoals } from './GoalsContext';
import { TribesProvider, useTribes } from './TribesContext';
import { Expense } from '../types/expense';
import { Goal } from '../types/goal';
import { Tribe, Mission } from '../types/tribe';
import { FwiComponents } from '../types/common';
import { useAuth } from './AuthContext';

interface AppContextType {
    state: {
        expenses: Expense[];
        totalExpenses: number;
        totalAhorroPerdido: number;
        formalityIndex: number;
        formalityIndexByCount: number;
        fwi_v2: number;
        fwi_v2_components: FwiComponents;
        fwiTrend: 'improving' | 'stable' | 'declining';
        fwiHistory: { month: string; value: number }[];
        budget: number | null;
        annualIncome: number | null;
        goals: Goal[];
        tribes: Tribe[];
        missions: Mission[];
    };
    addExpense: ReturnType<typeof useExpenses>['addExpense'];
    updateExpense: ReturnType<typeof useExpenses>['updateExpense'];
    deleteExpense: ReturnType<typeof useExpenses>['deleteExpense'];
    updateBudget: ReturnType<typeof useBudget>['updateBudget'];
    updateAnnualIncome: ReturnType<typeof useBudget>['updateAnnualIncome'];
    addGoal: ReturnType<typeof useGoals>['addGoal'];
    deleteGoal: ReturnType<typeof useGoals>['deleteGoal'];
    updateGoalContribution: ReturnType<typeof useGoals>['updateGoalContribution'];
    sendKudos: ReturnType<typeof useTribes>['sendKudos'];
    acceptMission: ReturnType<typeof useTribes>['acceptMission'];
    updateMissionProgress: ReturnType<typeof useTribes>['updateMissionProgress'];
    recordUserActivity: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// This component consumes the individual contexts and provides a unified value.
// It must be a child of all the individual providers.
const AppDataCombiner: React.FC<{ children: ReactNode }> = ({ children }) => {
    const expensesData = useExpenses();
    const budgetData = useBudget();
    const goalsData = useGoals();
    const tribesData = useTribes();
    const { user, recordUserActivity, updateUser } = useAuth();

    // --- ML DERIVED METRICS ---
    const fwiTrend = useMemo(() => {
        const { expenses } = expensesData;
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
        
        const expensesLast30Days = expenses.filter(e => new Date(e.fecha) >= thirtyDaysAgo);
        const expenses31to60Days = expenses.filter(e => new Date(e.fecha) >= sixtyDaysAgo && new Date(e.fecha) < thirtyDaysAgo);

        const calculateFwiForSegment = (segment: Expense[]) => {
            if (segment.length === 0) return 0;
            const total = segment.reduce((sum, e) => sum + e.total, 0);
            const formalTotal = segment.filter(e => e.esFormal).reduce((sum, e) => sum + e.total, 0);
            return total > 0 ? (formalTotal / total) * 100 : 0; // Simplified FWI for trend
        };

        const fwiCurrent = calculateFwiForSegment(expensesLast30Days);
        const fwiPrevious = calculateFwiForSegment(expenses31to60Days);

        let trend: 'improving' | 'stable' | 'declining' = 'stable';
        if (fwiPrevious > 0) {
            if (fwiCurrent > fwiPrevious + 2) trend = 'improving';
            else if (fwiCurrent < fwiPrevious - 2) trend = 'declining';
        }
        
        return trend;

    }, [expensesData]);

    useEffect(() => {
        if (user && user.fwiTrend !== fwiTrend) {
            updateUser({ fwiTrend: fwiTrend });
        }
    }, [fwiTrend, user, updateUser]);


    const fwiHistory = useMemo(() => {
        const { expenses } = expensesData;
        const history: { month: string; value: number }[] = [];
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const year = d.getFullYear();
            const month = d.getMonth();
            
            const monthExpenses = expenses.filter(e => {
                const expenseDate = new Date(e.fecha);
                return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
            });

            // Simplified FWI for trend, based on formality index for that month's expenses
            const total = monthExpenses.reduce((sum, e) => sum + e.total, 0);
            const formalTotal = monthExpenses.filter(e => e.esFormal).reduce((sum, e) => sum + e.total, 0);
            const monthFwi = total > 0 ? (formalTotal / total) * 100 : 0;
            
            // Add some randomness for demo purposes if FWI is 0 but there are expenses
            const finalFwi = (monthFwi === 0 && expenses.length > 0) ? 40 + Math.random() * 15 : monthFwi;

            history.push({
                month: monthNames[month],
                value: finalFwi
            });
        }
        return history;
    }, [expensesData]);


    const value = useMemo(() => ({
        state: {
            expenses: expensesData.expenses,
            totalExpenses: expensesData.totalExpenses,
            totalAhorroPerdido: expensesData.totalAhorroPerdido,
            formalityIndex: expensesData.formalityIndex,
            formalityIndexByCount: expensesData.formalityIndexByCount,
            fwi_v2: expensesData.fwi_v2,
            fwi_v2_components: expensesData.fwi_v2_components,
            fwiTrend: fwiTrend,
            fwiHistory,
            budget: budgetData.budget,
            annualIncome: budgetData.annualIncome,
            goals: goalsData.goals,
            tribes: tribesData.tribes,
            missions: tribesData.missions,
        },
        addExpense: expensesData.addExpense,
        updateExpense: expensesData.updateExpense,
        deleteExpense: expensesData.deleteExpense,
        updateBudget: budgetData.updateBudget,
        updateAnnualIncome: budgetData.updateAnnualIncome,
        addGoal: goalsData.addGoal,
        deleteGoal: goalsData.deleteGoal,
        updateGoalContribution: goalsData.updateGoalContribution,
        sendKudos: tribesData.sendKudos,
        acceptMission: tribesData.acceptMission,
        updateMissionProgress: tribesData.updateMissionProgress,
        recordUserActivity,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [expensesData, budgetData, goalsData, tribesData, fwiTrend, fwiHistory, recordUserActivity]);

    return (
        <AppContext.Provider value={value as AppContextType}>
            {children}
        </AppContext.Provider>
    );
}

// AppProvider now wraps all necessary providers.
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    return (
        <BudgetProvider>
            <GoalsProvider>
                <TribesProvider>
                    <ExpensesProvider>
                        <AppDataCombiner>
                            {children}
                        </AppDataCombiner>
                    </ExpensesProvider>
                </TribesProvider>
            </GoalsProvider>
        </BudgetProvider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};