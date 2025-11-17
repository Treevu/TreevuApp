import React from 'react';
import { ChartPieIcon, SparklesIcon } from '../Icons';
import { Offer } from '../../data/merchantData';
import Tooltip from '../Tooltip';

// Define category details for merchants, similar to other chart components.
const categoryDetails: { [key in Offer['category']]: { color: string; Icon: React.FC<{className?: string}> } } = {
    'Café y Postres': { color: '#a16207', Icon: SparklesIcon }, // amber-800
    'Libros y Cultura': { color: '#4f46e5', Icon: SparklesIcon }, // indigo-600
    'Restaurantes': { color: '#dc2626', Icon: SparklesIcon }, // red-600
    'Moda y Accesorios': { color: '#db2777', Icon: SparklesIcon }, // pink-600
    'Bienestar y Deporte': { color: '#0d9488', Icon: SparklesIcon }, // teal-600
    'Tecnología': { color: '#0284c7', Icon: SparklesIcon }, // sky-600
};

interface OfferCategoryDistributionProps {
    data: { category: Offer['category']; count: number }[];
}

// Reusing donut segment logic from another component
const DonutSegment: React.FC<{ percentage: number; color: string; offset: number; radius: number; strokeWidth: number }> = ({ percentage, color, offset, radius, strokeWidth }) => {
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

    return (
        <circle
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            stroke={color}
            fill="transparent"
            r={radius}
            cx="50"
            cy="50"
            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
    );
};

const OfferCategoryDistribution: React.FC<OfferCategoryDistributionProps> = ({ data }) => {
    const totalCount = data.reduce((sum, item) => sum + item.count, 0);
    
    const radius = 40;
    const strokeWidth = 10;
    const circumference = 2 * Math.PI * radius;
    let accumulatedPercentage = 0;

    return (
        <div className="bg-surface rounded-2xl p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                     <h3 className="text-base font-bold text-on-surface flex items-center">
                        Canjes por Categoría
                    </h3>
                    <p className="text-xs text-on-surface-secondary">Top Categorías</p>
                </div>
                 <Tooltip id="offer-category-donut-tooltip" text="Distribución de los canjes de ofertas por categoría. Te ayuda a entender qué tipo de promociones son más populares." />
            </div>
            {data && data.length > 0 ? (
                <div className="flex-1 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <div className="relative w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0">
                         <svg className="w-full h-full" viewBox="0 0 100 100">
                            {data.map(item => {
                                const percentage = totalCount > 0 ? (item.count / totalCount) * 100 : 0;
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
                                <span className="block text-2xl font-extrabold text-on-surface tracking-tighter">
                                    {totalCount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full sm:w-auto text-xs space-y-1.5">
                        {data.map(item => (
                             <div key={item.category} className="flex items-center">
                                <div className="w-2.5 h-2.5 rounded-full mr-2" style={{ backgroundColor: categoryDetails[item.category]?.color || '#9ca3af' }} />
                                <span className="text-on-surface font-semibold truncate">{item.category}</span>
                                <span className="ml-auto text-on-surface-secondary font-bold">{item.count}</span>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center text-on-surface-secondary text-sm">
                    <p>No hay datos de canjes.</p>
                </div>
            )}
        </div>
    );
};

export default OfferCategoryDistribution;