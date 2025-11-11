import React, { forwardRef, useMemo } from 'react';
import Tooltip from '@/components/ui/Tooltip.tsx';
import { BinocularsIcon } from '@/components/ui/Icons';

interface KpiData {
    department: string;
    fwi?: number;
    flightRiskScore?: number;
}

interface RiskCorrelationChartProps {
    data: KpiData[];
    currentSegmentName: string;
}

const legendDetails = [
  {
    icon: '🔴',
    title: 'Riesgo',
    description: 'Priorizar 1:1 con líderes de equipo para diagnosticar causas raíz y actuar.',
    colorClass: 'text-danger'
  },
  {
    icon: '🟡',
    title: 'Anomalía',
    description: 'Realizar encuestas de clima para investigar otros factores (liderazgo, carga laboral).',
    colorClass: 'text-warning'
  },
  {
    icon: '🔵',
    title: 'Oportunidad',
    description: 'Desplegar talleres de presupuesto y ahorro para potenciar su bienestar.',
    colorClass: 'text-blue-500'
  },
  {
    icon: '🟢',
    title: 'Fortaleza',
    description: 'Analizar sus hábitos y replicar las mejores prácticas en otras áreas.',
    colorClass: 'text-emerald-500'
  },
];


const RiskCorrelationChart = forwardRef<HTMLDivElement, RiskCorrelationChartProps>(({ data, currentSegmentName }, ref) => {
    
    const AXIS_PADDING = 10;

    const { fwiRange, riskRange } = useMemo(() => {
        if (!data || data.length === 0) {
            return { fwiRange: [0, 100] as [number, number], riskRange: [0, 100] as [number, number] };
        }
        
        const fwis = data.map(d => d.fwi || 0);
        const risks = data.map(d => d.flightRiskScore || 0);

        const minFwi = Math.min(...fwis);
        const maxFwi = Math.max(...fwis);
        const minRisk = Math.min(...risks);
        const maxRisk = Math.max(...risks);

        const fwiAxisMin = Math.max(0, Math.floor((minFwi - AXIS_PADDING) / 10) * 10);
        const fwiAxisMax = Math.min(100, Math.ceil((maxFwi + AXIS_PADDING) / 10) * 10);
        const riskAxisMin = Math.max(0, Math.floor((minRisk - AXIS_PADDING) / 10) * 10);
        const riskAxisMax = Math.min(100, Math.ceil((maxRisk + AXIS_PADDING) / 10) * 10);

        // Ensure range is not zero
        const finalFwiRange: [number, number] = fwiAxisMin === fwiAxisMax ? [fwiAxisMin - 10, fwiAxisMax + 10].map(v => Math.max(0, Math.min(100, v))) as [number, number] : [fwiAxisMin, fwiAxisMax];
        const finalRiskRange: [number, number] = riskAxisMin === riskAxisMax ? [riskAxisMin - 10, riskAxisMax + 10].map(v => Math.max(0, Math.min(100, v))) as [number, number] : [riskAxisMin, riskAxisMax];

        return {
            fwiRange: finalFwiRange,
            riskRange: finalRiskRange,
        };
    }, [data]);

    const calculatePosition = (value: number, range: [number, number]) => {
        const [min, max] = range;
        if (max - min === 0) return 50;
        const pos = ((value - min) / (max - min)) * 100;
        return Math.max(0, Math.min(100, pos));
    };

    const verticalLinePosition = calculatePosition(50, fwiRange);
    const horizontalLinePosition = calculatePosition(50, riskRange);
    
    return (
        <div ref={ref} className="bg-surface rounded-2xl p-5 relative h-full flex flex-col">
            <div className="w-full flex items-start justify-between">
                 <h2 className="text-lg font-bold text-on-surface flex items-center">
                    <BinocularsIcon className="w-6 h-6 mr-2 text-primary" />
                    Riesgo vs. Bienestar
                </h2>
                <Tooltip id="risk-correlation-tooltip" text="Correlación entre el FWI (eje X) y el Riesgo de Fuga Predictivo (eje Y). Cada punto es un área. Los ejes se ajustan dinámicamente para enfocar en la distribución actual de los datos." />
            </div>
            
            <div className="flex-1 flex items-center justify-center my-4 min-h-[250px] sm:min-h-[300px] pl-10 pr-4 sm:pl-12 sm:pr-6">
                <div className="relative w-full h-full text-on-surface-secondary">
                    {/* Quadrant Backgrounds (visual guides) */}
                    <div className="absolute top-0 left-0 w-full h-full" aria-hidden="true">
                        <div className="absolute bg-red-500/5" style={{ top: 0, left: 0, width: `${verticalLinePosition}%`, height: `calc(100% - ${horizontalLinePosition}%)` }}></div>
                        <div className="absolute bg-yellow-500/5" style={{ top: 0, right: 0, width: `calc(100% - ${verticalLinePosition}%)`, height: `calc(100% - ${horizontalLinePosition}%)` }}></div>
                        <div className="absolute bg-blue-500/5" style={{ bottom: 0, left: 0, width: `${verticalLinePosition}%`, height: `${horizontalLinePosition}%` }}></div>
                        <div className="absolute bg-green-500/5" style={{ bottom: 0, right: 0, width: `calc(100% - ${verticalLinePosition}%)`, height: `${horizontalLinePosition}%` }}></div>
                    </div>

                    {/* Y-Axis Labels & Grid */}
                    <span className="absolute -left-8 sm:-left-10 top-1/2 -translate-y-1/2 -rotate-90 text-xs tracking-wider whitespace-nowrap">Riesgo de Fuga (%)</span>
                    <div className="absolute w-full border-t border-dashed border-active-surface/50" style={{ bottom: `${horizontalLinePosition}%` }}></div>
                    <span className="absolute -left-6 sm:-left-8 text-xs" style={{ bottom: `${horizontalLinePosition}%`, transform: 'translateY(50%)' }}>50</span>
                    <span className="absolute -left-6 sm:-left-8 text-xs" style={{ bottom: '0px' }}>{riskRange[0]}</span>
                    <span className="absolute -left-6 sm:-left-8 text-xs" style={{ top: '0px' }}>{riskRange[1]}</span>


                    {/* X-Axis Labels & Grid */}
                     <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs tracking-wider whitespace-nowrap">Índice de Bienestar Financiero (FWI)</span>
                     <div className="absolute h-full border-l border-dashed border-active-surface/50" style={{ left: `${verticalLinePosition}%` }}></div>
                     <span className="absolute -bottom-5 text-xs" style={{ left: `${verticalLinePosition}%`, transform: 'translateX(-50%)' }}>50</span>
                     <span className="absolute -bottom-5 text-xs" style={{ left: '0px' }}>{fwiRange[0]}</span>
                     <span className="absolute -bottom-5 text-xs" style={{ right: '0px' }}>{fwiRange[1]}</span>

                    {/* Data Points */}
                    {data.map(item => {
                        const fwi = item.fwi || 0;
                        const risk = item.flightRiskScore || 0;
                        const isCurrent = item.department === currentSegmentName;
                        
                        const leftPos = calculatePosition(fwi, fwiRange);
                        const bottomPos = calculatePosition(risk, riskRange);

                        const pointSize = isCurrent ? 'w-5 h-5' : 'w-3 h-3';
                        const zIndex = isCurrent ? 'z-10' : 'z-0';
                        
                        let pointColor = 'bg-blue-500'; // Oportunidad
                        if(fwi > 50 && risk < 50) pointColor = 'bg-green-500'; // Fortaleza
                        else if(fwi < 50 && risk > 50) pointColor = 'bg-red-500'; // Riesgo
                        else if(fwi > 50 && risk > 50) pointColor = 'bg-yellow-500'; // Anomalia

                        return (
                             <div
                                key={item.department}
                                className={`absolute group transition-all duration-300 ${zIndex}`}
                                style={{
                                    left: `${leftPos}%`,
                                    bottom: `${bottomPos}%`,
                                    transform: 'translate(-50%, 50%)'
                                }}
                            >
                                <div
                                    className={`relative rounded-full ${pointSize} ${pointColor} ${isCurrent ? 'ring-2 ring-offset-2 ring-offset-surface ring-white' : ''} transition-all duration-300 ease-in-out group-hover:scale-150 shadow-lg`}
                                />
                                {/* Tooltip for the point */}
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2 bg-background text-on-surface-secondary text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20">
                                    <p className="font-bold text-on-surface">{item.department}</p>
                                    <p>FWI: {fwi.toFixed(1)}</p>
                                    <p>Riesgo: {risk.toFixed(1)}%</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* NEW LEGEND SECTION */}
            <div className="mt-6 pt-4 border-t border-active-surface/50">
                <h4 className="text-sm font-bold text-on-surface mb-3">Leyenda de Acciones Estratégicas</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                    {legendDetails.map(item => (
                        <div key={item.title} className="flex items-start gap-2">
                            <span className="text-lg leading-tight mt-0.5">{item.icon}</span>
                            <div>
                                <p className={`font-bold text-sm ${item.colorClass}`}>{item.title}</p>
                                <p className="text-xs text-on-surface-secondary">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
});

export default RiskCorrelationChart;