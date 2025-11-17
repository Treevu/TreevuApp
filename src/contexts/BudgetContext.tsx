import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';

interface BudgetContextType {
    budget: number | null;
    annualIncome: number | null;
    updateBudget: (newBudget: number) => void;
    updateAnnualIncome: (newIncome: number) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

export const BudgetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // Set initial state for a rich demo experience
    const [budget, setBudget] = useState<number | null>(3500);
    const [annualIncome, setAnnualIncome] = useState<number | null>(80000);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        try {
            const savedBudget = localStorage.getItem('treevu-budget');
            if (savedBudget) {
                setBudget(parseFloat(savedBudget));
            }
            
            const savedIncome = localStorage.getItem('treevu-annualIncome');
            if (savedIncome) {
                setAnnualIncome(parseFloat(savedIncome));
            }
        } catch (e) {
            console.error("Failed to parse budget/income from localStorage", e);
        }
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            if (budget !== null) {
                localStorage.setItem('treevu-budget', budget.toString());
            } else {
                localStorage.removeItem('treevu-budget');
            }
            if (annualIncome !== null) {
                localStorage.setItem('treevu-annualIncome', annualIncome.toString());
            } else {
                localStorage.removeItem('treevu-annualIncome');
            }
        } catch (e) {
            console.error("Failed to save budget/income to localStorage", e);
        }
    }, [budget, annualIncome, isInitialLoad]);

    const updateBudget = useCallback((newBudget: number) => {
        setBudget(newBudget);
        
        // Simplified alert logic without useAlert
        setTimeout(() => {
            try {
                // Mock alert for budget establishment
                if ((budget === null || budget <= 0) && newBudget > 0) {
                    console.log('setAlert called with:', {
                        message: '¡Presupuesto establecido! Has ganado <strong>+25 treevüs</strong> 🌿',
                        type: 'success'
                    });
                }
            } catch (error) {
                console.warn('Could not execute alert logic:', error);
            }
        }, 0);
    }, [budget]);

    const updateAnnualIncome = useCallback((newIncome: number) => setAnnualIncome(newIncome), []);

    const value = useMemo(() => ({
        budget,
        annualIncome,
        updateBudget,
        updateAnnualIncome,
    }), [budget, annualIncome, updateBudget, updateAnnualIncome]);

    return (
        <BudgetContext.Provider value={value}>
            {children}
        </BudgetContext.Provider>
    );
};

export const useBudget = () => {
    const context = useContext(BudgetContext);
    if (context === undefined) {
        throw new Error('useBudget must be used within a BudgetProvider');
    }
    return context;
};
