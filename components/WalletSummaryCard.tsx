import React from 'react';
// FIX: Updated import from deprecated 'types.ts' to 'types/expense.ts'.
import { type Expense } from '../types/expense';
import { BanknotesIcon, GhostIcon } from './Icons';
import ExportButton from './ExportButton';
import Tooltip from './Tooltip';

interface WalletSummaryCardProps {
    expenses: Expense[];
}

const WalletSummaryCard: React.FC<WalletSummaryCardProps> = ({ expenses }) => {
    const totalSpent = expenses.reduce((sum, expense) => sum + expense.total, 0);
    const totalLostSavings = expenses.reduce((sum, expense) => sum + expense.ahorroPerdido, 0);

    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in">
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-lg font-bold text-on-surface">Resumen de Billetera</h2>
                <ExportButton />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-background p-3 rounded-xl text-center">
                    <BanknotesIcon className="w-8 h-8 text-primary mx-auto mb-1" />
                    <div className="flex items-center justify-center gap-1">
                        <p className="text-xs font-semibold text-on-surface-secondary">Gasto Total</p>
                        <Tooltip id="gasto-total-tooltip" text="Suma de todos los gastos que has registrado en la app desde el inicio. Es tu gasto histórico total." />
                    </div>
                    <p className="text-xl font-bold text-on-surface">
                        S/ {totalSpent.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                </div>
                <div className="bg-background p-3 rounded-xl text-center">
                    <GhostIcon className="w-8 h-8 text-warning mx-auto mb-1" />
                    <div className="flex items-center justify-center gap-1">
                        <p className="text-xs font-semibold text-on-surface-secondary">Botín Fantasma</p>
                        <Tooltip id="ahorro-perdido-tooltip" text="Este es el tesoro que los 'gastos fantasma' (informales) te han quitado. Representa el IGV (aprox. 18%) que no puedes usar a tu favor. ¡Cázalos pidiendo boleta!" />
                    </div>
                    <p className="text-xl font-bold text-warning">
                        S/ {totalLostSavings.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default WalletSummaryCard;
