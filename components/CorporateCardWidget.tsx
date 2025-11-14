import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import { useModal } from '../contexts/ModalContext';
import ExpenseCardUltraCompact from './ExpenseCardUltraCompact';
import { CreditCardIcon, PlusIcon } from './Icons';

const CorporateCardWidget: React.FC = () => {
    const { state: { expenses }, deleteExpense } = useAppContext();
    const { openModal } = useModal();
    
    const corporateExpenses = expenses.filter(e => e.isCorporate).slice(0, 3);

    const handleRegister = () => {
        openModal('addExpense', { 
            // Pre-fill the modal for a corporate expense
            initialExpenseData: { isCorporate: true } 
        });
    };

    const handleConfirmDelete = (expenseId: string) => {
        deleteExpense(expenseId);
        openModal(null);
    };

    const openConfirmDeleteModal = (expenseId: string) => {
        openModal('confirmDelete', { onConfirm: () => handleConfirmDelete(expenseId) });
    };

    const handleEditExpense = (expenseId: string) => {
        const expense = expenses.find(e => e.id === expenseId);
        if (expense) {
            openModal('addExpense', { expenseToEdit: expense });
        }
    };
    
    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <CreditCardIcon className="w-6 h-6 mr-2 text-primary"/>
                    Mi Tarjeta Corporativa
                </h2>
                <button
                    onClick={handleRegister}
                    className="flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
                >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Registrar
                </button>
            </div>
            
            {corporateExpenses.length > 0 ? (
                <div className="space-y-1.5">
                    {corporateExpenses.map((expense, index) => (
                        <ExpenseCardUltraCompact
                            key={expense.id}
                            expense={expense}
                            onDelete={openConfirmDeleteModal}
                            onEdit={handleEditExpense}
                            isExpanded={false}
                            onToggle={() => {}} // No expansion needed for this compact view
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 px-4 bg-background rounded-xl">
                    <p className="text-sm text-on-surface-secondary">
                        Aún no has registrado gastos corporativos. ¡Usa el botón "Registrar" para empezar!
                    </p>
                </div>
            )}
        </div>
    );
};

export default CorporateCardWidget;