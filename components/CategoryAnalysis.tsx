import React, { useMemo, useState } from 'react';
import { ChartPieIcon, ChevronDownIcon } from './Icons';
import Tooltip from './Tooltip';

import { CategoriaGasto } from '../types/common';
import { Expense } from '../types/expense';
import { SimpleBarChart, BarChartDataPoint } from './TrendAnalysis';

interface CategoryAnalysisProps {
    expenses: Expense[];
}

const get30DayHistory = (category: CategoriaGasto, allExpenses: Expense[]): BarChartDataPoint[] => {
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    thirtyDaysAgo.setHours(0, 0, 0, 0);

    const relevantExpenses = allExpenses.filter(expense => {
        const expenseDate = new Date(expense.fecha);
        return expenseDate >= thirtyDaysAgo && expense.categoria === category;
    });

    const dailyTotals = relevantExpenses.reduce((acc, expense) => {
        const dateKey = expense.fecha;
        acc[dateKey] = (acc[dateKey] || 0) + expense.total;
        return acc;
    }, {} as Record<string, number>);

    const chartData: BarChartDataPoint[] = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        
        chartData.push({
            label: date.toLocaleDateString('es-PE', { day: 'numeric' }),
            value: dailyTotals[dateString] || 0,
        });
    }
    return chartData;
};

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ expenses }) => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    const sortedCategories = useMemo(() => {
        const dataByCategory = expenses.reduce((acc, expense) => {
            const category = expense.categoria;
            if (!acc[category]) {
                acc[category] = { total: 0, count: 0 };
            }
            acc[category].total += expense.total;
            acc[category].count += 1;
            return acc;
        }, {} as Record<string, { total: number; count: number }>);

        return Object.entries(dataByCategory)
            .map(([category, data]) => ({
                category: category as CategoriaGasto,
                total: (data as { total: number; count: number }).total,
                count: (data as { total: number; count: number }).count,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [expenses]);

    const handleToggle = (category: string) => {
        setExpandedCategory(prev => (prev === category ? null : category));
    };
    
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <ChartPieIcon className="w-6 h-6 mr-2 text-primary"/>
                    Top Categorías
                </h2>
                <Tooltip id="top-categorias-tooltip" text="Un análisis de las 5 categorías donde más gastas. Haz clic en una para ver el detalle de los últimos 30 días." />
            </div>

            {sortedCategories.length > 0 ? (
                <div className="space-y-2">
                    {sortedCategories.map(({ category, total, count }) => {
                        const isExpanded = expandedCategory === category;
                        const historyData = isExpanded ? get30DayHistory(category, expenses) : [];
                        return (
                           <div key={category} className="bg-background rounded-xl transition-shadow hover:shadow-md">
                                <button onClick={() => handleToggle(category)} className="w-full p-3 flex justify-between items-center text-left">
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-on-surface text-base">{category}</p>
                                        <p className="text-xs text-on-surface-secondary">
                                            {count} {count === 1 ? 'transacción' : 'transacciones'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="font-bold text-on-surface text-base text-right w-24">
                                            s/&nbsp;{total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                        <ChevronDownIcon className={`w-5 h-5 text-on-surface-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                    </div>
                                </button>
                                <div
                                    className="transition-all duration-500 ease-in-out overflow-hidden"
                                    style={{ maxHeight: isExpanded ? '200px' : '0px' }}
                                >
                                    <div className="px-3 pb-3">
                                        <h4 className="text-xs font-bold text-on-surface-secondary mb-2 pt-2 border-t border-active-surface/50">Gasto en los últimos 30 días</h4>
                                        <SimpleBarChart data={historyData} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-center text-on-surface-secondary py-8">No hay datos de gastos para mostrar.</p>
            )}
        </div>
    );
};

export default CategoryAnalysis;