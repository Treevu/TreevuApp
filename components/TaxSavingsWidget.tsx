import React, { useMemo, useState, useEffect } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { BanknotesIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';
import { calculateEstimatedTaxReturn, getDeductibleTotals, DEDUCTIBLE_EXPENSE_LIMIT_SOLES } from '../services/taxService';
import Tooltip from './Tooltip';
import { SimpleLineChart } from './TrendAnalysis';

interface TaxSavingsWidgetProps {
    annualIncome: number | null;
    onSetup: () => void;
}

const TaxSavingsWidget: React.FC<TaxSavingsWidgetProps> = ({ annualIncome, onSetup }) => {
    const { state: { expenses } } = useAppContext();
    const [animatedReturn, setAnimatedReturn] = useState(0);
    const [showTrend, setShowTrend] = useState(false);
    
    const { formalDeductible, potentialDeductible } = useMemo(() => getDeductibleTotals(expenses), [expenses]);
    
    const estimatedReturn = useMemo(() => {
        if (!annualIncome) return 0;
        return calculateEstimatedTaxReturn(formalDeductible, annualIncome);
    }, [formalDeductible, annualIncome]);

    const potentialReturn = useMemo(() => {
        if (!annualIncome) return 0;
        return calculateEstimatedTaxReturn(potentialDeductible, annualIncome);
    }, [potentialDeductible, annualIncome]);

    const monthlyDeductibleTrend = useMemo(() => {
        if (!annualIncome) return [];
        const history: { label: string; value: number }[] = [];
        const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const now = new Date();
        let cumulativeDeductible = 0;

        for (let i = 0; i <= now.getMonth(); i++) {
            const year = now.getFullYear();
            const month = i;

            const monthExpenses = expenses.filter(e => {
                const expenseDate = new Date(e.fecha);
                return expenseDate.getFullYear() === year && expenseDate.getMonth() === month;
            });

            const { formalDeductible: monthFormalDeductible } = getDeductibleTotals(monthExpenses);
            cumulativeDeductible += monthFormalDeductible;

            history.push({
                label: monthNames[month],
                value: calculateEstimatedTaxReturn(cumulativeDeductible, annualIncome)
            });
        }
        return history;
    }, [expenses, annualIncome]);

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
                    Tu Ahorro Fiscal
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

            <div className="mt-4 pt-3 border-t border-active-surface/50">
                <button onClick={() => setShowTrend(!showTrend)} className="w-full flex justify-between items-center text-sm font-semibold text-on-surface-secondary hover:text-on-surface">
                    <span>Evolución anual de la devolución</span>
                    {showTrend ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showTrend ? 'max-h-48' : 'max-h-0'}`}>
                    <SimpleLineChart data={monthlyDeductibleTrend} />
                </div>
            </div>
        </div>
    );
};

export default TaxSavingsWidget;