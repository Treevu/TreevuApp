import React, { useState, useEffect } from 'react';
import { PencilIcon, BanknotesIcon } from '@/components/ui/Icons';
import { useAppContext } from '@/contexts/AppContext';
import { useModal } from '@/contexts/ModalContext';
import Tooltip from '@/components/ui/Tooltip.tsx';

const BudgetTracker: React.FC = () => {
    const { state: appState } = useAppContext();
    const { expenses, budget } = appState;
    const { openModal } = useModal();
    const [flashKey, setFlashKey] = useState(0);
    
    // This calculation now lives inside the component, as it's directly tied to its state.
    const expensesThisMonth = expenses.filter(e => {
        const expenseDate = new Date(e.fecha);
        const today = new Date();
        return expenseDate.getFullYear() === today.getFullYear() && expenseDate.getMonth() === today.getMonth();
    });
    const totalSpentThisMonth = expensesThisMonth.reduce((sum, e) => sum + e.total, 0);

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
    
    return (
        <div className="bg-surface rounded-2xl p-4 mb-4 animate-grow-and-fade-in shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-on-surface">Tu Presupuesto</h2>
                    <Tooltip id="presupuesto-tooltip" text="Compara tus gastos del mes actual con el límite que estableciste. Es tu brújula para saber si vas por buen camino con tu plan." />
                </div>
                 <button
                    onClick={() => openModal('setBudget')}
                    className="flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                    aria-label="Editar presupuesto"
                >
                    <PencilIcon className="w-4 h-4 mr-1" />
                    Editar
                </button>
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
                </div>
                <div className="flex justify-between text-on-surface-secondary">
                    <span className="font-extrabold tracking-tight text-on-surface">S/ {totalSpentThisMonth.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                    <span className="font-semibold">S/ {budget.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                </div>
            </div>
        </div>
    );
};

export default BudgetTracker;
