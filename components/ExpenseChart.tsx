import React, { useMemo } from 'react';
import { ChartPieIcon } from './Icons';
import Tooltip from './Tooltip';
import { categoryDetails } from './TrendAnalysis';
import { CategoriaGasto } from '../types/common';
import { Expense } from '../types/expense';

interface ExpenseChartProps {
    expenses: Expense[];
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
    const chartData = useMemo(() => {
        if (expenses.length === 0) return [];
        
        const dataByCategory = expenses.reduce((acc: Record<string, number>, expense) => {
            acc[expense.categoria] = (acc[expense.categoria] || 0) + expense.total;
            return acc;
        }, {});

        return Object.entries(dataByCategory)
            .map(([categoria, total]) => ({ categoria, total: total as number }))
            .sort((a, b) => b.total - a.total);
    }, [expenses]);

    const maxTotal = useMemo(() => {
        if (chartData.length === 0) return 0;
        return Math.max(...chartData.map(d => d.total));
    }, [chartData]);

    if (expenses.length === 0) {
        return null;
    }

    return (
        <div className="bg-surface rounded-2xl p-4 animate-slide-in-up">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <ChartPieIcon className="w-6 h-6 mr-2 text-primary"/>
                    Movimientos por Categoría
                </h2>
                <Tooltip id="gastos-categoria-tooltip" text="Desglose visual de tus movimientos. La barra de la categoría con mayor gasto siempre es del 100%, y las demás se escalan en comparación para que veas rápidamente dónde se concentra tu dinero." />
            </div>
            <div className="space-y-4">
                {chartData.map(({ categoria, total }) => {
                    const percentage = maxTotal > 0 ? (total / maxTotal) * 100 : 0;
                    const color = categoryDetails[categoria as CategoriaGasto]?.color || categoryDetails[CategoriaGasto.Otros].color;
                    return (
                        <div key={categoria} className="text-sm">
                            <div className="flex justify-between items-center mb-1">
                                <span className="font-semibold text-on-surface">{categoria}</span>
                                <span className="font-bold text-on-surface">
                                    S/ {total.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                            <div className="h-2 w-full bg-active-surface rounded-full">
                                <div
                                    className="h-2 rounded-full transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%`, backgroundColor: color }}
                                ></div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ExpenseChart;