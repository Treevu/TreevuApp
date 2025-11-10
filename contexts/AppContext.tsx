
import React, { createContext, useContext, ReactNode, useMemo } from 'react';
import { ExpensesProvider, useExpenses } from './ExpensesContext';
import { BudgetProvider, useBudget } from './BudgetContext';
import { GoalsProvider, useGoals } from './GoalsContext';
import { TribesProvider, useTribes } from './TribesContext';
import { Expense } from '../types/expense';
import { Goal } from '../types/goal';
import { Tribe, Mission } from '../types/tribe';
import { FwiComponents } from '../types/common';

interface AppContextType {
    state: {
        expenses: Expense[];
        totalExpenses: number;
        totalAhorroPerdido: number;
        formalityIndex: number;
        formalityIndexByCount: number;
        fwi_v2: number;
        fwi_v2_components: FwiComponents;
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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// This component consumes the individual contexts and provides a unified value.
// It must be a child of all the individual providers.
const AppDataCombiner: React.FC<{ children: ReactNode }> = ({ children }) => {
    const expensesData = useExpenses();
    const budgetData = useBudget();
    const goalsData = useGoals();
    const tribesData = useTribes();

    const value = useMemo(() => ({
        state: {
            expenses: expensesData.expenses,
            totalExpenses: expensesData.totalExpenses,
            totalAhorroPerdido: expensesData.totalAhorroPerdido,
            formalityIndex: expensesData.formalityIndex,
            formalityIndexByCount: expensesData.formalityIndexByCount,
            fwi_v2: expensesData.fwi_v2,
            fwi_v2_components: expensesData.fwi_v2_components,
            budget: budgetData.budget,
            annualIncome: budgetData.annualIncome,
            goals: goalsData.goals,
            tribes: tribesData.tribes,
            missions: tribesData.missions,
        },
        ...expensesData,
        ...budgetData,
        ...goalsData,
        ...tribesData,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), [expensesData, budgetData, goalsData, tribesData]);

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