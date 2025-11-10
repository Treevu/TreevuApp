
import React, { useMemo, useState } from 'react';
import ExpenseCardUltraCompact from './ExpenseCardUltraCompact';
import { useAppContext } from '../contexts/AppContext';
import { XMarkIcon, SeedlingIcon } from './Icons';
import Logo from './Logo';

import { CategoriaGasto } from '../types/common';
import { Expense } from '../types/expense';

const formatDateGroup = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const todayString = today.toISOString().split('T')[0];
    const yesterdayString = yesterday.toISOString().split('T')[0];

    if (dateString === todayString) return 'Hoy';
    if (dateString === yesterdayString) return 'Ayer';
    
    // Shortened format: "jueves, 25 de jul."
    return new Intl.DateTimeFormat('es-PE', { weekday: 'long', day: 'numeric', month: 'short' }).format(date);
};

const groupTransactionsByDate = (transactions: Expense[]) => {
    return transactions.reduce((acc, transaction) => {
        const dateKey = transaction.fecha;
        if (!acc[dateKey]) {
            acc[dateKey] = [];
        }
        acc[dateKey].push(transaction);
        return acc;
    }, {} as Record<string, Expense[]>);
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
    const [expandedCardIds, setExpandedCardIds] = useState<Set<string>>(new Set());

    const toggleCardExpansion = (expenseId: string) => {
        setExpandedCardIds(prevIds => {
            const newIds = new Set(prevIds);
            if (newIds.has(expenseId)) {
                newIds.delete(expenseId);
            } else {
                newIds.add(expenseId);
            }
            return newIds;
        });
    };

    const groupedTransactions = useMemo(() => {
        const sorted = [...expenses].sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
        return groupTransactionsByDate(sorted);
    }, [expenses]);
    
    const sortedDateGroups = useMemo(() => {
        return Object.keys(groupedTransactions).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    }, [groupedTransactions]);
    
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
                        Aún no has registrado ningún gasto. Ve a la pestaña 'Inicio' para empezar tu expedición.
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
                <div className="space-y-3">
                    {sortedDateGroups.map(dateKey => (
                        <div key={dateKey}>
                            <h2 className="text-xs font-bold text-on-surface-secondary uppercase tracking-wider py-1.5">
                                {formatDateGroup(dateKey)}
                            </h2>
                            <div className="space-y-1.5">
                                {groupedTransactions[dateKey].map((expense, index) => (
                                    <ExpenseCardUltraCompact
                                        key={expense.id}
                                        expense={expense}
                                        onDelete={onDelete}
                                        onEdit={onEdit}
                                        isExpanded={expandedCardIds.has(expense.id)}
                                        onToggle={() => toggleCardExpansion(expense.id)}
                                        index={index}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </>
    );
});

export default TransactionList;
