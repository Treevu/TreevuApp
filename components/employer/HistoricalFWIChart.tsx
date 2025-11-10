import React from 'react';

interface FWIHistoryPoint {
    month: string;
    value: number;
}

interface HistoricalFWIChartProps {
    history: FWIHistoryPoint[];
}

const HistoricalFWIChart: React.FC<HistoricalFWIChartProps> = ({ history }) => {
    if (history.length < 2) {
        return <p className="text-center text-xs text-on-surface-secondary mt-4">No hay suficientes datos históricos.</p>;
    }

    const width = 300;
    const height = 100;
    const padding = { top: 10, right: 10, bottom: 20, left: 30 };
    
    const values = history.map(d => d.value);
    const min = Math.min(...values) - 5;
    const max = Math.max(...values) + 5;
    const range = max - min === 0 ? 1 : max - min;

    const getX = (index: number) => padding.left + (index / (history.length - 1)) * (width - padding.left - padding.right);
    const getY = (value: number) => height - padding.bottom - ((value - min) / range) * (height - padding.top - padding.bottom);

    const path = history.map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.value)}`).join(' ');

    return (
        <div className="mt-4">
            <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
                {/* Y-Axis Labels */}
                <text x={padding.left - 8} y={getY(max - 5)} dy="3" textAnchor="end" className="text-[8px] fill-current text-on-surface-secondary">{Math.round(max - 5)}</text>
                <text x={padding.left - 8} y={getY(min + 5)} dy="3" textAnchor="end" className="text-[8px] fill-current text-on-surface-secondary">{Math.round(min + 5)}</text>
                
                {/* Line Path */}
                <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

                {/* Data Points and X-Axis Labels */}
                {history.map((point, index) => (
                    <g key={point.month}>
                        <circle cx={getX(index)} cy={getY(point.value)} r="3" fill="var(--primary)" />
                        <text x={getX(index)} y={height - padding.bottom + 12} textAnchor="middle" className="text-[9px] font-semibold fill-current text-on-surface-secondary">
                            {point.month}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
};

export default HistoricalFWIChart;