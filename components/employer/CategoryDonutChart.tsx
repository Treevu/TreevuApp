
import React from 'react';
import { CategoriaGasto } from '../../types/common';
import Tooltip from '../Tooltip';
import { categoryDetails } from '../TrendAnalysis';

interface CategoryDonutChartProps {
    data: { category: CategoriaGasto; amount: number }[];
}

const DonutSegment: React.FC<{ percentage: number; color: string; offset: number; radius: number; strokeWidth: number }> = ({ percentage, color, offset, radius, strokeWidth }) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
        <circle
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={-offset}
            strokeLinecap="round"
            stroke={color}
            fill="transparent"
            r={radius}
            cx="40"
            cy="40"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
    );
};

const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ data }) => {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const topCategories = data.slice(0, 4);

    const radius = 32;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="bg-surface rounded-2xl p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                     <h3 className="text-base font-bold text-on-surface flex items-center">
                        Gasto por Categoría
                    </h3>
                    <p className="text-xs text-on-surface-secondary">Top 4 Categorías</p>
                </div>
                 <Tooltip id="category-donut-tooltip" text="Distribución del gasto total del equipo. El centro muestra el monto total." />
            </div>
            {data && data.length > 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                    <div className="relative w-40 h-40">
                         <svg className="w-full h-full" viewBox="0 0 80 80">
                            {topCategories.map(item => {
                                const percentage = (item.amount / totalAmount) * 100;
                                const offset = (accumulatedPercentage / 100) * circumference;
                                accumulatedPercentage += percentage;
                                return (
                                    <DonutSegment
                                        key={item.category}
                                        percentage={percentage}
                                        color={categoryDetails[item.category]?.color || '#9ca3af'}
                                        offset={offset}
                                        radius={radius}
                                        strokeWidth={strokeWidth}
                                    />
                                );
                            })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <span className="text-xs text-on-surface-secondary">Total</span>
                                <span className="block text-xl font-extrabold text-on-surface tracking-tighter">
                                    S/{(totalAmount / 1000).toFixed(1)}K
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        {topCategories.map(item => (
                             <div key={item.category} className="flex items-center">
                                <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: categoryDetails[item.category]?.color || '#9ca3af' }} />
                                <span className="text-on-surface truncate">{item.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center text-on-surface-secondary text-sm">
                    <p>No hay datos de gastos.</p>
                </div>
            )}
        </div>
    );
};

export default CategoryDonutChart;