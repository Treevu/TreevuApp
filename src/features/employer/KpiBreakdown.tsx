import React from 'react';
import { UsersIcon } from '@/components/ui/Icons'; // Assuming a generic icon for items

interface KpiBreakdownProps {
    data: { label: string; value: number }[];
    metricLabel: string;
}

const BreakdownItem: React.FC<{ label: string; value: number }> = ({ label, value }) => {
    const percentage = 100; // Use a fixed percentage for bar length in this style
    
    const getBarColor = () => {
        if (value >= 75) return 'bg-emerald-500';
        if (value >= 50) return 'bg-warning';
        return 'bg-danger';
    };

    const barColor = getBarColor();
    const textColor = barColor.replace('bg-', 'text-');

    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-on-surface truncate pr-2">{label}</span>
                    <span className={`font-bold ${textColor}`}>{value.toFixed(0)}</span>
                </div>
                <div className="h-2 w-full bg-active-surface rounded-full">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${barColor}`}
                        style={{ width: `${value}%` }} // Bar width represents the actual value
                    ></div>
                </div>
            </div>
        </div>
    );
};


const KpiBreakdown: React.FC<KpiBreakdownProps> = ({ data }) => {
    return (
        <div>
            {data && data.length > 0 ? (
                <div className="space-y-4">
                    {data.map(item => (
                        <BreakdownItem 
                            key={item.label}
                            label={item.label}
                            value={item.value}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex items-center justify-center h-full text-center text-on-surface-secondary text-sm">
                    <p>No hay datos suficientes para este desglose.</p>
                </div>
            )}
        </div>
    );
};

export default KpiBreakdown;