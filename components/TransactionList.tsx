

import React, { useMemo, useState } from 'react';
import ExpenseCardUltraCompact from './ExpenseCardUltraCompact';
import { useAppContext } from '../contexts/AppContext';
import { XMarkIcon, ChevronDownIcon } from './Icons';

import { CategoriaGasto } from '../types/common';
import { Expense } from '../types/expense';

const groupExpensesByPeriod = (expenses: Expense[]) => {
    const groups: Record<string, Expense[]> = {
        "Hoy": [],
        "Ayer": [],
        "Última Semana": [],
        "Último Mes": [],
        "Más Antiguos": [],
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30);

    const sortedExpenses = [...expenses].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());

    for (const expense of sortedExpenses) {
        const expenseDate = new Date(expense.fecha + 'T00:00:00');
        expenseDate.setHours(0, 0, 0, 0);
        const time = expenseDate.getTime();

        if (time === today.getTime()) {
            groups["Hoy"].push(expense);
        } else if (time === yesterday.getTime()) {
            groups["Ayer"].push(expense);
        } else if (time > weekAgo.getTime()) {
            groups["Última Semana"].push(expense);
        } else if (time > monthAgo.getTime()) {
            groups["Último Mes"].push(expense);
        } else {
            groups["Más Antiguos"].push(expense);
        }
    }
    return groups;
};


interface TransactionListProps {
    expenses: Expense[];
    searchQuery: string;
    onDelete: (expenseId: string) => void;
    onEdit: (expenseId: string) => void;
    categoryFilter: CategoriaGasto | null;
    onClearFilter: () => void;
}

const TransactionList: React.FC<TransactionListProps> = React.memo(({ expenses, searchQuery, onDelete, onEdit, categoryFilter, onClearFilter }) => {
    const { state: { expenses: allExpenses } } = useAppContext();
    const [expandedGroup, setExpandedGroup] = useState<string | null>('Hoy');
    const [expandedCardId, setExpandedCardId] = useState<string | null>(null);

    const groupedTransactions = useMemo(() => {
        return groupExpensesByPeriod(expenses);
    }, [expenses]);
    
    const groupOrder = ["Hoy", "Ayer", "Última Semana", "Último Mes", "Más Antiguos"];
    
    const renderEmptyState = () => {
        if (searchQuery || categoryFilter) {
            return (
                <div className="text-center py-8 bg-surface rounded-2xl shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
                    <p className="text-base font-semibold">Sin Resultados</p>
                    <p className="text-on-surface-secondary mt-1 text-sm">
                        No encontramos nada para tu filtro. ¡Prueba con otra pista para encontrar tu tesoro!
                    </p>
                </div>
            );
        }
        if (allExpenses.length === 0) {
             return (
                <div className="text-center py-12 px-4 bg-surface rounded-2xl animate-grow-and-fade-in shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
                    <p className="text-on-surface-secondary">
                        Aún no has registrado ningún hallazgo. Ve a la pestaña 'Inicio' para empezar tu expedición.
                    </p>
                </div>
            );
        }
        return null;
    };
    
    return (
        <>
            {categoryFilter && (
                <div className="bg-surface p-3 rounded-2xl mb-3 animate-grow-and-fade-in">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-on-surface-secondary">Filtrando por: <span className="font-bold text-on-surface">{categoryFilter}</span></p>
                        <button onClick={onClearFilter} className="text-primary hover:opacity-80 flex items-center text-xs font-semibold transition-opacity">
                            <XMarkIcon className="w-4 h-4 mr-1"/>
                            Limpiar filtro
                        </button>
                    </div>
                </div>
            )}
            
            {expenses.length === 0 ? (
                renderEmptyState()
            ) : (
                <div className="space-y-2">
                    {groupOrder.map(groupName => {
                        const groupExpenses = groupedTransactions[groupName];
                        if (!groupExpenses || groupExpenses.length === 0) return null;

                        const isExpanded = expandedGroup === groupName;
                        const total = groupExpenses.reduce((sum, exp) => sum + exp.total, 0);

                        return (
                            <div key={groupName} className="bg-surface rounded-2xl overflow-hidden transition-all duration-300 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
                                <button
                                    onClick={() => setExpandedGroup(isExpanded ? null : groupName)}
                                    className="w-full p-4 flex justify-between items-center text-left"
                                    aria-expanded={isExpanded}
                                >
                                    <div className="flex-1">
                                        <h2 className="font-bold text-on-surface">{groupName}</h2>
                                        <p className="text-xs text-on-surface-secondary">{groupExpenses.length} {groupExpenses.length === 1 ? 'movimiento' : 'movimientos'}</p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-on-surface">S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span>
                                        <ChevronDownIcon className={`w-6 h-6 text-on-surface-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                <div
                                    className="transition-all duration-500 ease-in-out"
                                    style={{ maxHeight: isExpanded ? '2000px' : '0px' }}
                                >
                                    <div className="px-4 pb-4 pt-0 space-y-1.5 border-t border-active-surface/50">
                                        <div className="pt-2">
                                        {groupExpenses.map((expense, index) => (
                                            <ExpenseCardUltraCompact
                                                key={expense.id}
                                                expense={expense}
                                                onDelete={onDelete}
                                                onEdit={onEdit}
                                                isExpanded={expense.id === expandedCardId}
                                                onToggle={() => setExpandedCardId(prev => (prev === expense.id ? null : expense.id))}
                                                index={index}
                                            />
                                        ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    );
});

export default TransactionList;