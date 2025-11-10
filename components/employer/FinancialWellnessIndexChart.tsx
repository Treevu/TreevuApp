import React, { useState } from 'react';
import Tooltip from '../Tooltip';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon, ChevronDownIcon } from '../Icons';
import HistoricalFWIChart from './HistoricalFWIChart';

interface FWIComponent {
    name: string;
    value: number; // 0-100
    weight: number; // 0-1
}

interface FWIHistoryPoint {
    month: string;
    value: number;
}

interface FinancialWellnessIndexChartProps {
    score: number;
    components: FWIComponent[];
    history: FWIHistoryPoint[];
    companyAverage: number;
}

const componentColors = ['#00E0FF', '#9F70FF', '#8A91A1'];

const FwiDonutChart: React.FC<{ score: number }> = ({ score }) => {
    const radius = 36;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const progressOffset = circumference - (score / 100) * circumference;

    const getStatusColor = () => {
        if (score >= 75) return 'text-emerald-500';
        if (score >= 50) return 'text-warning';
        return 'text-danger';
    };
    const colorClass = getStatusColor();

    return (
        <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-full h-full" viewBox="0 0 80 80">
                <circle className="text-active-surface" strokeWidth={strokeWidth} stroke="currentColor" fill="transparent" r={radius} cx="40" cy="40" />
                <circle
                    className={colorClass}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={progressOffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx="40"
                    cy="40"
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                    <span className={`text-3xl font-extrabold ${colorClass} tracking-tighter`}>{score.toFixed(0)}</span>
                    <span className="block text-xs font-bold text-on-surface-secondary -mt-1">FWI</span>
                </div>
            </div>
        </div>
    );
};

const FinancialWellnessIndexChart: React.FC<FinancialWellnessIndexChartProps> = ({ score, components, history, companyAverage }) => {
    const [showHistory, setShowHistory] = useState(false);
    const lastMonthValue = history.length > 1 ? history[history.length - 2].value : 0;
    const deltaVsLastMonth = score - lastMonthValue;
    const deltaVsCompanyAvg = score - companyAverage;

    const DeltaIndicator: React.FC<{ value: number, label: string }> = ({ value, label }) => {
        const isPositive = value >= 0;
        const color = isPositive ? 'text-emerald-500' : 'text-danger';
        const Icon = isPositive ? ArrowTrendingUpIcon : ArrowTrendingDownIcon;
        return (
            <div className="text-center">
                <p className="text-xs text-on-surface-secondary">{label}</p>
                <div className={`flex items-center justify-center font-bold ${color}`}>
                    <Icon className="w-4 h-4 mr-1" />
                    <span>{value.toFixed(1)} pts</span>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-surface rounded-2xl p-5 relative h-full flex flex-col justify-between">
            <div className="w-full flex items-start justify-between">
                 <h2 className="text-lg font-bold text-on-surface">Índice de Bienestar Financiero</h2>
                <Tooltip id="fwi-tooltip" text="El Índice de Bienestar Financiero (FWI) es la métrica principal que resume la salud financiera del equipo. Se compone de la formalidad de sus gastos, su balance entre vida y trabajo, y su inversión en desarrollo profesional." />
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center my-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 items-center gap-4 w-full">
                    <div className="flex justify-center">
                        <FwiDonutChart score={score} />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <DeltaIndicator value={deltaVsLastMonth} label="vs Mes Anterior" />
                        <DeltaIndicator value={deltaVsCompanyAvg} label="vs Prom. Cía" />
                    </div>
                </div>
            </div>

            <div className="w-full max-w-sm space-y-2">
                {components.map((comp, index) => (
                    <div key={comp.name} className="flex items-center text-sm">
                        <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: componentColors[index % componentColors.length] }} />
                        <span className="text-on-surface-secondary flex-1 truncate">{comp.name}</span>
                        <div className="w-1/4 bg-active-surface rounded-full h-2 mx-3">
                            <div className="h-2 rounded-full" style={{ width: `${comp.value}%`, backgroundColor: componentColors[index % componentColors.length] }} />
                        </div>
                        <span className="font-bold text-on-surface w-8 text-right">{comp.value.toFixed(0)}</span>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-active-surface/50">
                 <button 
                    onClick={() => setShowHistory(!showHistory)}
                    className="w-full text-sm font-semibold text-primary flex items-center justify-center gap-2 hover:opacity-80"
                    aria-expanded={showHistory}
                >
                    <span>{showHistory ? 'Ocultar' : 'Ver'} Histórico (6 Meses)</span>
                    <ChevronDownIcon className={`w-5 h-5 transition-transform duration-300 ${showHistory ? 'rotate-180' : ''}`} />
                </button>
                <div 
                    className="grid transition-all duration-500 ease-in-out"
                    style={{ gridTemplateRows: showHistory ? '1fr' : '0fr' }}
                >
                    <div className="overflow-hidden">
                        <HistoricalFWIChart history={history} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FinancialWellnessIndexChart;