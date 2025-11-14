import React from 'react';
import { ChartPieIcon } from '../Icons';
import { CategoriaGasto } from '../../types/common';
import Tooltip from '../Tooltip';
import { categoryDetails } from '../TrendAnalysis';

interface CategoryBreakdownProps {
    data: { category: CategoriaGasto; amount: number }[];
}

const CategoryItem: React.FC<{ category: CategoriaGasto; amount: number; percentage: number }> = ({ category, amount, percentage }) => {
    const { color, Icon } = categoryDetails[category] || categoryDetails.Otros;
    return (
        <div className="text-sm transition-colors duration-200">
            <div className="flex justify-between items-center mb-1.5 font-semibold">
                <div className="flex items-center">
                    <Icon className="w-4 h-4 mr-2 text-on-surface-secondary" />
                    <span className="text-on-surface">{category}</span>
                </div>
                <span className="text-on-surface">
                    S/ {amount.toLocaleString('es-PE', { minimumFractionDigits: 0 })}
                </span>
            </div>
            <div className="h-2 w-full bg-active-surface rounded-full">
                <div
                    className={`h-2 rounded-full`}
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                    title={`${percentage.toFixed(1)}%`}
                ></div>
            </div>
        </div>
    );
};

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ data }) => {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <div className="bg-surface rounded-2xl p-5 animate-slide-in-up relative">
             <div className="absolute top-3 right-3">
                <Tooltip id="category-breakdown-tooltip" text="Visualiza la distribución del gasto total del equipo en las diferentes categorías. Identifica dónde se concentra el mayor consumo." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <ChartPieIcon className="w-6 h-6 mr-2 text-primary" />
                Desglose por Categoría
            </h3>
            {data.length > 0 ? (
                <div className="space-y-3">
                    {data.map(({ category, amount }) => {
                        const percentage = totalAmount > 0 ? (amount / totalAmount) * 100 : 0;
                        return (
                            <CategoryItem
                                key={category}
                                category={category}
                                amount={amount}
                                percentage={percentage}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="flex items-center justify-center h-48 text-center text-on-surface-secondary">
                    <p>No hay datos de gastos para mostrar en esta selección.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryBreakdown;