import React, { useState } from 'react';
import { FlaskIcon, ChevronDownIcon, ChevronUpIcon } from './Icons';
import { FwiComponents, FwiComponent } from '../types/common';
import { useAppContext } from '../contexts/AppContext';
import { SimpleLineChart } from './TrendAnalysis';
import Tooltip from './Tooltip';

interface FinancialWellnessWidgetProps {
    fwi: number;
    components: FwiComponents;
}

const componentColors = ['var(--primary)', 'var(--accent)', 'var(--accent-secondary)'];

const FinancialWellnessWidget: React.FC<FinancialWellnessWidgetProps> = ({ fwi, components }) => {
    const { state: { fwiHistory } } = useAppContext();
    const [showTrend, setShowTrend] = useState(false);
    const index = Math.round(fwi);
    const circumference = 2 * Math.PI * 34; // 2 * pi * radius
    const strokeDashoffset = circumference - (index / 100) * circumference;

    const getStatus = () => {
        if (index >= 80) return { text: 'Maestro Alquimista', color: 'text-emerald-500' };
        if (index >= 65) return { text: 'Transmutación Avanzada', color: 'text-primary' };
        if (index >= 50) return { text: 'Fórmula Perfectible', color: 'text-warning' };
        return { text: 'Materia Prima', color: 'text-danger' };
    };

    const status = getStatus();
    
    const chartData = fwiHistory.map(h => ({ label: h.month, value: h.value }));

    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <FlaskIcon className="w-6 h-6 mr-2 text-primary"/>
                    Puntaje de Bienestar
                </h2>
                <Tooltip id="fwi-explanation-tooltip" text="Tu Puntaje de Bienestar es una métrica de 0 a 100 que resume tu salud financiera, balance vida-trabajo y desarrollo profesional. ¡Es el reflejo de tus buenos hábitos!" />
            </div>
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 80 80">
                        <circle
                            className="text-active-surface"
                            strokeWidth="8"
                            stroke="currentColor"
                            fill="transparent"
                            r="36"
                            cx="40"
                            cy="40"
                        />
                        <circle
                            className={`${status.color}`}
                            strokeWidth="8"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r="36"
                            cx="40"
                            cy="40"
                            style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s ease-out' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${status.color}`}>{index}</span>
                    </div>
                </div>
                <div className="text-left">
                    <p className={`font-bold text-lg ${status.color}`}>{status.text}</p>
                    <p className="text-xs text-on-surface-secondary mt-1">
                        Tu FWI 2.0 mide tu salud financiera, balance vida-trabajo y desarrollo profesional. ¡Es el reflejo de tus buenos hábitos!
                    </p>
                </div>
            </div>
            {components && (
                <div className="w-full space-y-2 border-t border-active-surface/50 pt-3">
                    {Object.values(components).map((comp, index) => (
                        // FIX: Cast `comp` to `FwiComponent` to resolve TypeScript error where it was being inferred as `unknown`.
                        <div key={(comp as FwiComponent).name} className="flex items-center text-sm">
                            <div className="w-3 h-3 rounded-full mr-3" style={{ backgroundColor: componentColors[index % componentColors.length] }} />
                            <span className="text-on-surface-secondary flex-1 truncate">{(comp as FwiComponent).name}</span>
                            <div className="w-1/4 bg-active-surface rounded-full h-2 mx-3">
                                <div className="h-2 rounded-full" style={{ width: `${(comp as FwiComponent).value}%`, backgroundColor: componentColors[index % componentColors.length] }} />
                            </div>
                            <span className="font-bold text-on-surface w-8 text-right">{(comp as FwiComponent).value.toFixed(0)}</span>
                        </div>
                    ))}
                </div>
            )}
             <div className="mt-4 pt-3 border-t border-active-surface/50">
                <button onClick={() => setShowTrend(!showTrend)} className="w-full flex justify-between items-center text-sm font-semibold text-on-surface-secondary hover:text-on-surface">
                    <span>Evolución (6 meses)</span>
                    {showTrend ? <ChevronUpIcon className="w-5 h-5"/> : <ChevronDownIcon className="w-5 h-5"/>}
                </button>
                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${showTrend ? 'max-h-48' : 'max-h-0'}`}>
                    <SimpleLineChart data={chartData} />
                </div>
            </div>
        </div>
    );
};

export default FinancialWellnessWidget;