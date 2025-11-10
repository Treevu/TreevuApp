import React, { useMemo } from 'react';
// FIX: Updated import from deprecated 'types.ts'.
import { type Expense } from '../types/expense';
import ModalWrapper from './ModalWrapper';
import { BanknotesIcon, ShoppingBagIcon, ReceiptPercentIcon, GhostIcon, ShieldCheckIcon } from './Icons';

interface MerchantDetailModalProps {
    merchantName: string;
    expenses: Expense[];
    onClose: () => void;
}

const MerchantDetailModal: React.FC<MerchantDetailModalProps> = ({ merchantName, expenses, onClose }) => {
    
    const {
        merchantExpenses,
        totalSpent,
        transactionCount,
        averageSpend,
        formalityRate,
        totalLostSavings
    } = useMemo(() => {
        const filtered = expenses.filter(e => e.razonSocial.trim() === merchantName);
        const total = filtered.reduce((sum, exp) => sum + exp.total, 0);
        const count = filtered.length;
        const avg = count > 0 ? total / count : 0;
        const formalCount = filtered.filter(e => e.esFormal).length;
        const formality = count > 0 ? (formalCount / count) * 100 : 0;
        const lostSavings = filtered.reduce((sum, e) => sum + e.ahorroPerdido, 0);

        return {
            merchantExpenses: filtered.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()),
            totalSpent: total,
            transactionCount: count,
            averageSpend: avg,
            formalityRate: formality,
            totalLostSavings: lostSavings
        };
    }, [expenses, merchantName]);

    const formatDate = (dateString: string) => {
        try {
            const date = new Date(dateString + 'T00:00:00');
            return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <ModalWrapper title={merchantName} onClose={onClose}>
             <div className="-mt-5">
                <div className="grid grid-cols-2 gap-3 mb-4 text-center">
                    <div className="bg-background p-3 rounded-xl">
                        <BanknotesIcon className="w-6 h-6 text-primary mx-auto mb-1" />
                        <p className="text-xs text-on-surface-secondary">Gasto Total</p>
                        <p className="text-lg font-bold text-on-surface">S/ {totalSpent.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="bg-background p-3 rounded-xl">
                        <ShoppingBagIcon className="w-6 h-6 text-primary mx-auto mb-1" />
                        <p className="text-xs text-on-surface-secondary">Nº de Visitas</p>
                        <p className="text-lg font-bold text-on-surface">{transactionCount}</p>
                    </div>
                    <div className="bg-background p-3 rounded-xl">
                        <ReceiptPercentIcon className="w-6 h-6 text-primary mx-auto mb-1" />
                        <p className="text-xs text-on-surface-secondary">Gasto Promedio</p>
                        <p className="text-lg font-bold text-on-surface">S/ {averageSpend.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className={`bg-background p-3 rounded-xl ${totalLostSavings > 0 ? 'border border-dashed border-warning' : ''}`}>
                        <GhostIcon className={`w-6 h-6 mx-auto mb-1 ${totalLostSavings > 0 ? 'text-warning' : 'text-primary'}`} />
                        <p className="text-xs text-on-surface-secondary">Ahorro Perdido</p>
                        <p className={`text-lg font-bold ${totalLostSavings > 0 ? 'text-warning' : 'text-on-surface'}`}>S/ {totalLostSavings.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                    </div>
                </div>
                
                <div className="bg-background p-3 rounded-xl">
                    <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1">
                        <span className="font-semibold flex items-center gap-1.5"><ShieldCheckIcon className="w-4 h-4 text-primary"/> Índice de Formalidad</span>
                        <span className="font-bold text-primary">{formalityRate.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-active-surface rounded-full">
                        <div className="h-2 rounded-full bg-primary" style={{ width: `${formalityRate}%` }}></div>
                    </div>
                </div>

                <div className="mt-6">
                    <h4 className="text-sm font-bold text-on-surface-secondary mb-2">Historial de Hallazgos</h4>
                    {merchantExpenses.length > 0 ? (
                        <ul className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar pr-2">
                            {merchantExpenses.map(expense => (
                                <li key={expense.id} className="flex justify-between items-center bg-background p-2.5 rounded-lg">
                                    <span className="text-sm font-medium text-on-surface-secondary">{formatDate(expense.fecha)}</span>
                                    <span className="font-bold text-on-surface text-sm">
                                        S/ {expense.total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-center text-on-surface-secondary py-8">No se encontraron gastos para este comercio.</p>
                    )}
                </div>
                <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end">
                    <button 
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 transition-opacity"
                    >
                        Cerrar
                    </button>
                </div>
             </div>
        </ModalWrapper>
    );
};

export default MerchantDetailModal;