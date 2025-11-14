import React from 'react';
import { GiftIcon, AcademicCapIcon, HeartIcon, SparklesIcon } from '../Icons';
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
    const sortedCategories = data.sort((a, b) => b.amount - a.amount);

    const radius = 40;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="bg-surface rounded-2xl p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                     <h3 className="text-base font-bold text-on-surface flex items-center">
                        Beneficios Canjeados
                    </h3>
                    <p className="text-xs text-on-surface-secondary">Por categoría (valor)</p>
                </div>
                 <Tooltip id="reward-category-donut-tooltip" text="Distribución del valor total de recompensas canjeadas por categoría. Ayuda a entender qué beneficios son más valorados por el equipo." />
            </div>
            {data && data.length > 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center gap-4">
                    <div className="relative w-48 h-48">
                         <svg className="w-full h-full" viewBox="0 0 100 100">
                            {sortedCategories.map(item => {
                                const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
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
                                    S/{(totalAmount / 1000).toFixed(1)}K
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                        {sortedCategories.map(item => (
                             <div key={item.category} className="flex items-center">
                                <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: categoryDetails[item.category]?.color || '#9ca3af' }} />
                                <span className="text-on-surface truncate">{item.category}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center text-on-surface-secondary text-sm">
                    <p>No se han canjeado beneficios aún.</p>
                </div>
            )}
        </div>
    );
};

export default RewardCategoryDonutChart;