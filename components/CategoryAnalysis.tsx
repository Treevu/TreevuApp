
import React, { useMemo } from 'react';
import { ChartPieIcon } from './Icons';
import Tooltip from './Tooltip';

import { CategoriaGasto } from '../types/common';
import { Expense } from '../types/expense';

interface CategoryAnalysisProps {
    expenses: Expense[];
}

const CategoryAnalysis: React.FC<CategoryAnalysisProps> = ({ expenses }) => {
    const sortedCategories = useMemo(() => {
        // FIX: Correctly typed the accumulator's initial value in the reduce function to ensure proper type inference.
        const dataByCategory = expenses.reduce((acc: Record<string, { total: number; count: number }>, expense) => {
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
                // FIX: Cast `data` to its expected type to resolve TypeScript error where it was being inferred as `unknown`.
                total: (data as { total: number; count: number }).total,
                count: (data as { total: number; count: number }).count,
            }))
            .sort((a, b) => b.total - a.total)
            .slice(0, 5);
    }, [expenses]);
    
    return (
        <div>
            <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <ChartPieIcon className="w-6 h-6 mr-2 text-primary"/>
                Top Categorías
            </h2>
            {sortedCategories.length > 0 ? (
                <div className="space-y-4">
                    {sortedCategories.map(({ category, total, count }) => (
                        <div key={category} className="flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-on-surface text-base">{category}</p>
                                <p className="text-xs text-on-surface-secondary">
                                    {count} {count === 1 ? 'transacción' : 'transacciones'}
                                </p>
                            </div>
                            <span className="font-bold text-on-surface text-base">
                                s/&nbsp;{total.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-on-surface-secondary py-8">No hay datos de gastos para mostrar.</p>
            )}
        </div>
    );
};

export default CategoryAnalysis;