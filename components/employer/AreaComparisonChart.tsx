
import React from 'react';
import Tooltip from '../Tooltip';
import { UsersIcon } from '../Icons';

interface AreaComparisonChartProps {
    data: { label: string; value: number }[];
}

const ComparisonItem: React.FC<{ label: string; value: number; isTop: boolean }> = ({ label, value, isTop }) => {
    const barColor = isTop ? 'bg-primary' : 'bg-on-surface';
    const textColor = isTop ? 'text-primary' : 'text-on-surface';

    return (
        <div className="flex items-center gap-3 text-sm">
            <div className="w-8 h-8 rounded-lg bg-active-surface flex items-center justify-center flex-shrink-0">
                <UsersIcon className={`w-5 h-5 ${isTop ? 'text-primary' : 'text-on-surface-secondary'}`} />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-on-surface truncate pr-2">{label}</span>
                    <span className={`font-bold ${textColor}`}>{value.toFixed(0)}</span>
                </div>
                <div className="h-2 w-full bg-active-surface rounded-full">
                    <div
                        className={`h-2 rounded-full transition-all duration-500 ease-out ${barColor}`}
                        style={{ width: `${value}%` }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

const AreaComparisonChart: React.FC<AreaComparisonChartProps> = ({ data }) => {
    const sortedData = [...data].sort((a, b) => b.value - a.value);
    const topValue = sortedData.length > 0 ? sortedData[0].value : 0;

    return (
        <div className="bg-surface rounded-2xl p-4 flex flex-col h-full">
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-base font-bold text-on-surface flex items-center">
                        Comparativo por Área
                    </h3>
                    <p className="text-xs text-on-surface-secondary">FWI Promedio</p>
                </div>
                 <Tooltip id="area-comparison-tooltip" text="Compara el FWI promedio entre las áreas clave de la empresa." />
            </div>
            {sortedData && sortedData.length > 0 ? (
                <div className="flex-1 flex flex-col justify-start gap-4">
                    {sortedData.map(item => (
                        <ComparisonItem
                            key={item.label}
                            label={item.label}
                            value={item.value}
                            isTop={item.value === topValue}
                        />
                    ))}
                </div>
            ) : (
                 <div className="flex-1 flex items-center justify-center text-center text-on-surface-secondary text-sm">
                    <p>No hay datos suficientes.</p>
                </div>
            )}
        </div>
    );
};

export default AreaComparisonChart;