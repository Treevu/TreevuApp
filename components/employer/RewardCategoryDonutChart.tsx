


import React from 'react';
import { GiftIcon, AcademicCapIcon, HeartIcon, SparklesIcon } from '../Icons';
// FIX: Updated import from deprecated 'types.ts' to 'types/user.ts'.
import { Reward } from '../../types/user';
import Tooltip from '../Tooltip';

interface RewardCategoryDonutChartProps {
    data: { category: Reward['category']; amount: number }[];
}

const categoryDetails: { [key in Reward['category']]: { color: string, Icon: React.FC<{className?: string}> } } = {
    'Bienestar': { color: '#2dd4bf', Icon: HeartIcon },
    'Educación': { color: '#fb923c', Icon: AcademicCapIcon },
    'Ocio': { color: '#c084fc', Icon: GiftIcon },
    'Impacto Social': { color: '#f472b6', Icon: SparklesIcon },
};

const DonutSegment: React.FC<{ percentage: number; color: string; offset: number; radius: number; strokeWidth: number }> = ({ percentage, color, offset, radius, strokeWidth }) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
        <circle
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={-offset}
            strokeLinecap="butt" // Use butt for distinct segments
            stroke={color}
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
    );
};

const RewardCategoryDonutChart: React.FC<RewardCategoryDonutChartProps> = ({ data }) => {
    const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);
    const topCategories = data.slice(0, 4);

    const radius = 42;
    const strokeWidth = 12;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="bg-background rounded-xl p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-2">
                <div>
                     <h3 className="text-base font-bold text-on-surface flex items-center">
                        Premios por Categoría
                    </h3>
                    <p className="text-xs text-on-surface-secondary">Valor canjeado (S/)</p>
                </div>
                 <Tooltip id="reward-category-donut-tooltip" text="Distribución del valor de las recompensas canjeadas por el equipo." />
            </div>
            {data && data.length > 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                    <div className="relative w-48 h-48">
                         <svg className="w-full h-full" viewBox="0 0 100 100">
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
                                <span className="text-xs text-on-surface-secondary">Total Canjeado</span>
                                <span className="block text-2xl font-extrabold text-on-surface tracking-tighter">
                                    S/{(totalAmount).toLocaleString('es-PE', { maximumFractionDigits: 0 })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                        {topCategories.map(item => (
                             <div key={item.category} className="flex items-center">
                                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: categoryDetails[item.category]?.color || '#9ca3af' }} />
                                <span className="text-on-surface truncate">{item.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center text-on-surface-secondary text-sm">
                    <p>Aún no se han canjeado premios en este segmento.</p>
                </div>
            )}
        </div>
    );
};

export default RewardCategoryDonutChart;