import React, { useState, useEffect, useMemo } from 'react';
import { PencilIcon, BanknotesIcon, ChevronDownIcon, ChevronUpIcon, SparklesIcon, CheckIcon } from './Icons';
import { useAppContext } from '../contexts/AppContext';
import { useModal } from '../contexts/ModalContext';
import Tooltip from './Tooltip';
import { StackedBarChart, StackedChartDataPoint } from './TrendAnalysis';
// FIX: Changed import from non-existent 'getAI7DaySpendingAnalysis' to 'getAIWeeklySummary'.
import { getAIWeeklySummary } from '../services/ai/employeeService';
import { Expense } from '../types/expense';
import { CategoriaGasto } from '../types/common';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../types/user';

const AIWeeklyAnalysis: React.FC<{ expenses: Expense[]; user: User | null }> = ({ expenses, user }) => {
    const [analysis, setAnalysis] = useState<{ title: string; analysis: string[] } | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAnalysis = async () => {
            if (expenses.length === 0 || !user) {
                setIsLoading(false);
                setAnalysis(null);
                return;
            }
            setIsLoading(true);
            try {
                const resultString = await getAIWeeklySummary(user, expenses);
                if (resultString) {
                    // FIX: Parse the string response from the AI into the expected object structure.
                    const sentences = resultString.match(/[^.!?]+[.!?]+/g) || [resultString];
                    const title = sentences.length > 0 ? sentences[0].trim() : 'Análisis Semanal';
                    const analysisPoints = sentences.length > 1 ? sentences.slice(1).map(s => s.trim()) : [];
                    setAnalysis({ title, analysis: analysisPoints });
                } else {
                    setAnalysis(null);
                }
            } catch (error) {
                console.error("Error fetching or parsing AI analysis:", error);
                setAnalysis(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAnalysis();
    }, [expenses, user]);

    if (isLoading) {
        return (
            <div className="bg-background p-3 rounded-xl animate-pulse">
                <div className="h-4 w-1/2 bg-active-surface rounded mb-3"></div>
                <div className="space-y-2">
                    <div className="h-3 w-full bg-active-surface rounded"></div>
                    <div className="h-3 w-5/6 bg-active-surface rounded"></div>
                </div>
            </div>
        );
    }

    if (!analysis || analysis.analysis.length === 0) {
        return null; // Don't show anything if no analysis could be generated
    }

    return (
        <div className="bg-background p-3 rounded-xl animate-fade-in">
            <h4 className="font-bold text-on-surface text-sm mb-2 flex items-center gap-2">
                <SparklesIcon className="w-5 h-5 text-primary" />
                {analysis.title}
            </h4>
            <ul className="space-y-1.5 text-xs text-on-surface-secondary">
                {analysis.analysis.map((point, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <CheckIcon className="w-3.5 h-3.5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{point}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const BudgetTracker: React.FC = () => {
    const { state: appState } = useAppContext();
    const { expenses, budget } = appState;
    const { openModal } = useModal();
    // FIX: Get user from AuthContext to pass to the AI service.
    const { user } = useAuth();
    const [flashKey, setFlashKey] = useState(0);
    const [showTrend, setShowTrend] = useState(false);
    
    const expensesThisMonth = useMemo(() => expenses.filter(e => {
        const expenseDate = new Date(e.fecha);
        const today = new Date();
        return expenseDate.getFullYear() === today.getFullYear() && expenseDate.getMonth() === today.getMonth();
    }), [expenses]);

    const totalSpentThisMonth = useMemo(() => expensesThisMonth.reduce((sum, e) => sum + e.total, 0), [expensesThisMonth]);

    const last7DaysExpenses = useMemo(() => {
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 6);
        sevenDaysAgo.setHours(0, 0, 0, 0);
        
        return expenses.filter(e => new Date(e.fecha) >= sevenDaysAgo);
    }, [expenses]);

    const dailyData = useMemo((): StackedChartDataPoint[] => {
        const today = new Date();
        const daysToShow = 7;
        const result: StackedChartDataPoint[] = [];

        for (let i = daysToShow - 1; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            const expensesForDay = expenses.filter(e => e.fecha === dateString);
            
            const categories = expensesForDay.reduce((acc, e) => {
                acc[e.categoria] = (acc[e.categoria] || 0) + e.total;
                return acc;
            }, {} as { [key in CategoriaGasto]?: number });

            result.push({
                label: date.toLocaleDateString('es-PE', { weekday: 'short' }).charAt(0).toUpperCase(),
                total: expensesForDay.reduce((sum, e) => sum + e.total, 0),
                categories,
            });
        }
        return result;
    }, [expenses]);

    useEffect(() => {
        setFlashKey(prev => prev + 1);
    }, [totalSpentThisMonth]);

    if (budget === null || budget <= 0) {
        return (
            <div className="flex flex-col items-center text-center justify-center py-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <BanknotesIcon className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-on-surface-secondary mt-1 mb-3 max-w-xs">Establece un límite para empezar a monitorear tus movimientos.</p>
                <button
                    onClick={() => openModal('setBudget')}
                    className="bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-2 px-5 rounded-xl text-sm flex items-center shadow-lg shadow-primary/30 transform hover:-translate-y-1 transition-all duration-300"
                >
                    <PencilIcon className="w-4 h-4 mr-1.5" />
                    Establecer Presupuesto
                </button>
            </div>
        )
    }

    const percentage = budget > 0 ? (totalSpentThisMonth / budget) * 100 : 0;
    const remaining = budget - totalSpentThisMonth;
    const progressBarColor = percentage >= 100 ? 'bg-danger' : percentage > 80 ? 'bg-warning' : 'bg-primary';
    
    return (
        <div className="animate-grow-and-fade-in">
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

            <div className="mt-4 pt-3 border-t border-active-surface/50">
                <button onClick={() => setShowTrend(!showTrend)} className="w-full flex justify-between items-center text-sm font-semibold text-on-surface-secondary hover:text-on-surface">
                    <span>Evolución de Movimientos Diarios (7 días)</span>
                    {showTrend ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
                </button>
                <div className={`transition-all duration-500 ease-in-out overflow-hidden ${showTrend ? 'max-h-[450px] mt-4' : 'max-h-0'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                        <StackedBarChart data={dailyData} />
                        <AIWeeklyAnalysis expenses={last7DaysExpenses} user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BudgetTracker;