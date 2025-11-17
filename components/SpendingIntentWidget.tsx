import React, { useMemo } from 'react';
import { type Expense } from '../types/expense';
import { ReceiptPercentIcon, LightBulbIcon } from './Icons';
import Tooltip from './Tooltip';

interface SpendingIntentWidgetProps {
    expenses: Expense[];
}

const SpendingIntentWidget: React.FC<SpendingIntentWidgetProps> = ({ expenses }) => {
    const intentData = useMemo(() => {
        const totals = expenses.reduce((acc, expense) => {
            if (expense.intent === 'essential') {
                acc.essential += expense.total;
            } else if (expense.intent === 'desired') {
                acc.desired += expense.total;
            }
            return acc;
        }, { essential: 0, desired: 0 });

        const totalSpent = totals.essential + totals.desired;
        if (totalSpent === 0) {
            return {
                essential: 0,
                desired: 0,
                totalSpent: 0,
                essentialPercent: 0,
                desiredPercent: 0,
            };
        }

        const essentialPercent = (totals.essential / totalSpent) * 100;
        const desiredPercent = (totals.desired / totalSpent) * 100;

        return {
            ...totals,
            totalSpent,
            essentialPercent,
            desiredPercent,
        };
    }, [expenses]);

    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <ReceiptPercentIcon className="w-6 h-6 mr-2 text-primary"/>
                    Intención de Gasto
                </h2>
                <Tooltip id="spending-intent-tooltip" text="Analiza la proporción de tu dinero que se va a gastos esenciales (necesidades) vs. gastos deseados (gustos). Es clave para optimizar tu presupuesto." />
            </div>
            
            <div className="flex w-full h-3 rounded-full overflow-hidden bg-active-surface shadow-inner">
                <div style={{ width: `${intentData.essentialPercent}%` }} className="bg-primary transition-all duration-500 ease-out" title={`Esencial: ${intentData.essentialPercent.toFixed(1)}%`}></div>
                <div style={{ width: `${intentData.desiredPercent}%` }} className="bg-accent transition-all duration-500 ease-out" title={`Deseado: ${intentData.desiredPercent.toFixed(1)}%`}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3 flex-grow">
                <div className="text-center bg-background p-2 rounded-lg flex flex-col justify-center">
                    <div className="flex items-center justify-center text-sm font-semibold">
                        <div className="w-2 h-2 rounded-full bg-primary mr-2"></div>
                        Esencial
                    </div>
                    <p className="font-bold text-lg text-on-surface mt-1">S/ {intentData.essential.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="text-center bg-background p-2 rounded-lg flex flex-col justify-center">
                    <div className="flex items-center justify-center text-sm font-semibold">
                        <div className="w-2 h-2 rounded-full bg-accent mr-2"></div>
                        Deseado
                    </div>
                    <p className="font-bold text-lg text-on-surface mt-1">S/ {intentData.desired.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
                </div>
            </div>
        </div>
    );
};

export default SpendingIntentWidget;