

import React, { useState, useMemo, useEffect } from 'react';
import TransactionList from '@/features/expenses/TransactionList.tsx';
import { useModal } from '@/hooks/useZustandCompat';
import { type Expense } from '@/types/expense';
import { type CategoriaGasto } from '@/types/common';
import SubNavBar from '@/components/layout/SubNavBar.tsx';
import { MagnifyingGlassIcon, XMarkIcon, ChartPieIcon, PlusIcon } from '@/components/ui/Icons';
import AnalysisView from '@/features/analytics/AnalysisView.tsx';
// import CategoryAnalysis from '@/features/expenses/CategoryAnalysis.tsx';
// import MerchantAnalysis from './MerchantAnalysis';

interface WalletViewProps {
    expenses: Expense[];
    onDelete: (id: string) => void;
    onEdit: (id: string) => void;
    categoryFilter: CategoriaGasto | null;
    onClearFilter: () => void;
}

const WalletView: React.FC<WalletViewProps> = ({
    expenses,
    onDelete,
    onEdit,
    categoryFilter,
    onClearFilter,
}) => {
    const { openModal } = useModal();
    const [activeSubTab, setActiveSubTab] = useState<'transactions' | 'analysis'>('transactions');
    const [searchQuery, setSearchQuery] = useState('');

    const filteredExpenses = useMemo(() => {
        let filtered = expenses;
        const lowercasedQuery = searchQuery.toLowerCase().trim();

        if (lowercasedQuery) {
            filtered = filtered.filter(expense =>
                expense.razonSocial.toLowerCase().includes(lowercasedQuery) ||
                expense.categoria.toLowerCase().includes(lowercasedQuery) ||
                expense.total.toString().includes(lowercasedQuery)
            );
        }

        if (categoryFilter) {
            filtered = filtered.filter(expense => expense.categoria === categoryFilter);
            // If filtering by category, switch to transactions tab to show results
            if (activeSubTab !== 'transactions') {
                setActiveSubTab('transactions');
            }
        }

        return filtered;
    }, [expenses, searchQuery, categoryFilter, activeSubTab]);
    
    useEffect(() => {
        if (activeSubTab !== 'transactions') {
            setSearchQuery('');
            onClearFilter();
        }
    }, [activeSubTab, onClearFilter]);
    
    const mainSubTabs = [
        { id: 'transactions' as const, label: 'Movimientos', Icon: MagnifyingGlassIcon },
        { id: 'analysis' as const, label: 'Análisis', Icon: ChartPieIcon }
    ];
    
    return (
        <div className="animate-fade-in">
            <SubNavBar 
                tabs={mainSubTabs} 
                activeTab={activeSubTab} 
                onTabClick={(tab) => setActiveSubTab(tab)} 
            />

            {activeSubTab === 'analysis' && (
                <AnalysisView />
            )}

            {activeSubTab === 'transactions' && (
                <div className="animate-fade-in space-y-4">
                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                            <MagnifyingGlassIcon className="h-5 w-5 text-on-surface-secondary" />
                        </div>
                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Buscar por comercio, categoría, monto..."
                            className="block w-full rounded-xl border-transparent bg-surface py-3 pl-11 pr-10 text-on-surface placeholder:text-on-surface-secondary focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary"
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery('')}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 group"
                                aria-label="Limpiar búsqueda"
                            >
                                <XMarkIcon className="h-5 w-5 text-on-surface-secondary group-hover:text-on-surface transition-colors" />
                            </button>
                        )}
                    </div>
                    <TransactionList
                        expenses={filteredExpenses}
                        searchQuery={searchQuery}
                        onDelete={onDelete}
                        onEdit={onEdit}
                        categoryFilter={categoryFilter}
                        onClearFilter={onClearFilter}
                    />
                    <button
                        onClick={() => openModal('addExpense')}
                        className="fixed bottom-24 right-6 w-16 h-16 bg-primary text-primary-dark rounded-full shadow-lg flex items-center justify-center transform hover:scale-110 transition-transform duration-200 ease-in-out z-30"
                        aria-label="Añadir nuevo registro"
                    >
                        <PlusIcon className="w-8 h-8" />
                    </button>
                </div>
            )}
        </div>
    );
};

export default WalletView;