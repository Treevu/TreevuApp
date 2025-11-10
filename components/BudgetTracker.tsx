


import React, { useState, useEffect } from 'react';
import { PencilIcon, LightBulbIcon, BanknotesIcon } from './Icons';
// FIX: Updated import from deprecated 'geminiService.ts' to 'services/ai/employeeService.ts'.
import { getAIBudgetProjection } from '../services/ai/employeeService';
import { useAppContext } from '../contexts/AppContext';
import { useModal } from '../contexts/ModalContext';
import Tooltip from './Tooltip';

const BudgetTracker: React.FC = () => {
    const { state: appState } = useAppContext();
    const { expenses, budget } = appState;
    const { openModal } = useModal();
    const [projection, setProjection] = useState<{ projectedSpending: number; insight: string; } | null>(null);
    const [isLoadingProjection, setIsLoadingProjection] = useState(false);
    const [flashKey, setFlashKey] = useState(0);
    
    // This calculation now lives inside the component, as it's directly tied to its state.
    const expensesThisMonth = expenses.filter(e => {
        const expenseDate = new Date(e.fecha);
        const today = new Date();
        return expenseDate.getFullYear() === today.getFullYear() && expenseDate.getMonth() === today.getMonth();
    });
    const totalSpentThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.total, 0);


    useEffect(() => {
        const fetchProjection = async () => {
            if (budget && budget > 0 && expenses.length > 2) {
                setIsLoadingProjection(true);
                try {
                    const result = await getAIBudgetProjection(expenses, budget);
                    setProjection(result);
                } catch (e) { console.error("Failed to fetch AI projection:", e); }
                finally { setIsLoadingProjection(false); }
            } else {
                setProjection(null);
            }
        };

        const timeoutId = setTimeout(fetchProjection, 500);
        return () => clearTimeout(timeoutId);
    }, [expenses, budget]);

    useEffect(() => {
        // This key change will force React to re-render the span, re-triggering the CSS animation
        setFlashKey(prev => prev + 1);
    }, [totalSpentThisMonth]); // Trigger flash whenever this month's total changes

    if (budget === null || budget <= 0) {
        return (
            <div className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center justify-center min-h-[200px] animate-grow-and-fade-in border border-dashed dark:border-dotted border-active-surface/80 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <BanknotesIcon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-on-surface">Tu Presupuesto</h3>
                <p className="text-sm text-on-surface-secondary mt-1 mb-3 max-w-xs">Establece un límite para empezar a monitorear tus gastos.</p>
                <button
                    onClick={() => openModal('setBudget')}
                    className="bg-primary text-primary-dark font-bold py-2 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center"
                >
                    <PencilIcon className="w-4 h-4 mr-1.5" />
                    Establecer Presupuesto
                </button>
            </div>
        )
    }

    const percentage = budget > 0 ? (totalSpentThisMonth / budget) * 100 : 0;
    const remaining = budget - totalSpentThisMonth;
    const progressBarColor = percentage >= 100 ? 'bg-danger' : percentage > 80 ? 'bg-warning' : 'bg-emerald-500';
    const projectionPercentage = projection ? (projection.projectedSpending / budget) * 100 : null;
    
    const getProjectionStatusStyle = () => {
        if (!projectionPercentage) return { text: 'text-on-surface-secondary', bg: 'bg-on-surface-secondary' };
        if (projectionPercentage > 100) return { text: 'text-danger', bg: 'bg-danger' };
        if (projectionPercentage > 90) return { text: 'text-warning', bg: 'bg-warning' };
        return { text: 'text-emerald-500', bg: 'bg-emerald-500' };
    };
    
    const projectionStyle = getProjectionStatusStyle();

    return (
        <div className="bg-surface rounded-2xl p-4 mb-4 animate-grow-and-fade-in shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-on-surface">Tu Presupuesto</h2>
                    <Tooltip id="presupuesto-tooltip" text="Compara tus gastos del mes actual con el límite que estableciste. Es tu brújula para saber si vas por buen camino con tu plan." />
                </div>
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-on-surface-secondary">
                    <span>Gastado ({percentage.toFixed(0)}%)</span>
                     <span
                        key={flashKey} 
                        className={`font-bold transition-colors duration-300 ${remaining < 0 ? 'text-danger' : ''} ${flashKey > 1 ? 'animate-value-flash' : ''}`}
                     >
                        {remaining < 0 ? 'Excedido: ' : 'Restante: '}S/ {Math.abs(remaining).toLocaleString('es-PE', { minimumFractionDigits: 2})}
                    </span>
                </div>
                 <div className="relative w-full bg-active-surface rounded-full h-2.5">
                    <div
                        className={`${progressBarColor} h-2.5 rounded-full transition-all duration-500 ease-out`}
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                    {projectionPercentage !== null && !isLoadingProjection && (
                        <div 
                            className={`absolute top-[-2px] h-3.5 w-1 rounded-full ${projectionStyle.bg} transition-all duration-500 ease-out`}
                            title={`Proyección: S/ ${projection.projectedSpending.toLocaleString('es-PE', { minimumFractionDigits: 2})}`}
                            style={{ left: `clamp(0.5%, ${projectionPercentage}%, 99.5%)`, transform: 'translateX(-50%)' }}
                        />
                    )}
                </div>
                <div className="flex justify-between text-on-surface-secondary">
                    <span className="font-extrabold tracking-tight text-on-surface">S/ {totalSpentThisMonth.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    <span className="font-semibold">S/ {budget.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>

                 {isLoadingProjection && (
                    <div className="mt-4 p-3 bg-background/50 rounded-lg animate-pulse">
                        <div className="h-3 w-1/3 bg-active-surface rounded-sm mb-2"></div>
                        <div className="h-2 w-full bg-active-surface rounded-sm"></div>
                    </div>
                )}
                {projection && !isLoadingProjection && (
                    <div className="mt-3 p-3 bg-background/50 rounded-lg flex items-start space-x-2.5 animate-grow-and-fade-in" style={{animationDelay: '100ms'}}>
                        <LightBulbIcon className={`w-5 h-5 ${projectionStyle.text} flex-shrink-0 mt-0.5`} />
                        <div>
                            <p className={`text-sm font-semibold ${projectionStyle.text}`}>Análisis IA</p>
                            <p className="text-sm text-on-surface-secondary leading-tight">{projection.insight}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BudgetTracker;