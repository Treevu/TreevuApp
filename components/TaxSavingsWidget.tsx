import React, { useMemo, useState, useEffect } from 'react';
import { useExpenses } from '../contexts/ExpensesContext';
import { BanknotesIcon } from './Icons';
import { calculateEstimatedTaxReturn, getDeductibleTotals, DEDUCTIBLE_EXPENSE_LIMIT_SOLES } from '../services/taxService';
import Tooltip from './Tooltip';

interface TaxSavingsWidgetProps {
    annualIncome: number | null;
    onSetup: () => void;
}

const TaxSavingsWidget: React.FC<TaxSavingsWidgetProps> = ({ annualIncome, onSetup }) => {
    const { expenses } = useExpenses();
    const [animatedReturn, setAnimatedReturn] = useState(0);
    
    const { formalDeductible, potentialDeductible } = useMemo(() => getDeductibleTotals(expenses), [expenses]);
    
    const estimatedReturn = useMemo(() => {
        if (!annualIncome) return 0;
        return calculateEstimatedTaxReturn(formalDeductible, annualIncome);
    }, [formalDeductible, annualIncome]);

    const potentialReturn = useMemo(() => {
        if (!annualIncome) return 0;
        return calculateEstimatedTaxReturn(potentialDeductible, annualIncome);
    }, [potentialDeductible, annualIncome]);

    const progressPercentage = (formalDeductible / DEDUCTIBLE_EXPENSE_LIMIT_SOLES) * 100;

    useEffect(() => {
        let startTimestamp: number | null = null;
        const duration = 800;
        const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const easedProgress = 1 - Math.pow(1 - progress, 3); // easeOutCubic
            
            setAnimatedReturn(easedProgress * estimatedReturn);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setAnimatedReturn(estimatedReturn);
            }
        };
        requestAnimationFrame(step);
    }, [estimatedReturn]);

    // --- Render Setup View ---
    if (!annualIncome) {
        return (
            <div className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center justify-center min-h-[200px] animate-grow-and-fade-in border border-dashed dark:border-dotted border-active-surface/80 shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <BanknotesIcon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-bold text-lg text-on-surface">Estima tu Ahorro Fiscal</h3>
                <p className="text-sm text-on-surface-secondary mt-1 mb-3 max-w-xs">Indica tu ingreso para estimar el potencial de devolución de SUNAT.</p>
                <button
                    onClick={onSetup}
                    className="bg-primary text-primary-dark font-bold py-2 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm"
                >
                    Configurar Ingreso
                </button>
            </div>
        );
    }
    
    // --- Render Main View ---
    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <BanknotesIcon className="w-6 h-6 mr-2 text-primary"/>
                    Potencial de Ahorro Fiscal
                </h2>
                <Tooltip id="ahorro-fiscal-tooltip" text="Estimación de cuánto dinero podrías recibir como devolución de impuestos de SUNAT al final del año, gracias a tus gastos formales en categorías deducibles." />
            </div>

            <div className="text-center bg-background rounded-xl p-3">
                <span className="text-xs text-on-surface-secondary">Devolución estimada</span>
                <p className="text-3xl font-extrabold text-primary tracking-tighter">
                    S/ {animatedReturn.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
            </div>
            
            <div className="mt-3">
                <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1 font-medium">
                    <span>Progreso a tu tope (3 UIT)</span>
                    <span>{Math.min(100, progressPercentage).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-active-surface rounded-full">
                    <div
                        className="h-2 rounded-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${Math.min(100, progressPercentage)}%` }}
                    ></div>
                </div>
            </div>

            {potentialReturn > 0 && (
                <div className="mt-3 bg-primary/10 rounded-lg p-2 text-center">
                    <p className="text-xs text-primary">
                        <span className="font-bold">+ S/ {potentialReturn.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</span> potenciales perdidos por gastos informales.
                    </p>
                </div>
            )}
        </div>
    );
};

export default TaxSavingsWidget;
