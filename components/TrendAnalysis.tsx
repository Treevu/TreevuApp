import React from 'react';
import { CategoriaGasto } from '../types/common';
import {
    ReceiptPercentIcon,
    HomeIcon,
    TruckIcon,
    HeartIcon,
    TicketIcon,
    AcademicCapIcon,
    ShoppingBagIcon,
    CogIcon,
    SparklesIcon
} from './Icons';

export const categoryDetails: { [key in CategoriaGasto]: { color: string, Icon: React.FC<{className?: string}> } } = {
    [CategoriaGasto.Alimentacion]: { color: '#22d3ee', Icon: ReceiptPercentIcon },
    [CategoriaGasto.Vivienda]: { color: '#3b82f6', Icon: HomeIcon },
    [CategoriaGasto.Transporte]: { color: '#facc15', Icon: TruckIcon },
    [CategoriaGasto.Salud]: { color: '#34d399', Icon: HeartIcon },
    [CategoriaGasto.Ocio]: { color: '#a855f7', Icon: TicketIcon },
    [CategoriaGasto.Educacion]: { color: '#d946ef', Icon: AcademicCapIcon },
    [CategoriaGasto.Consumos]: { color: '#64748b', Icon: ShoppingBagIcon },
    [CategoriaGasto.Servicios]: { color: '#6366f1', Icon: CogIcon },
    [CategoriaGasto.Otros]: { color: '#9ca3af', Icon: SparklesIcon },
};

// --- SimpleLineChart ---
interface ChartDataPoint {
  label: string;
  value: number;
}

interface SimpleLineChartProps {
  data: ChartDataPoint[];
  comparisonData?: ChartDataPoint[];
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({ data, comparisonData }) => {
  if (!data || data.length < 2) {
    return <div className="h-full flex items-center justify-center text-xs text-on-surface-secondary">Datos insuficientes.</div>;
  }
  const width = 300;
  const height = 150;
  const padding = { top: 10, right: 10, bottom: 20, left: 10 };
  
  const allValues = [...data.map(d => d.value), ...(comparisonData?.map(d => d.value) || [])];
  const yMin = Math.min(...allValues);
  const yMax = Math.max(...allValues);
  const yRange = yMax - yMin === 0 ? 1 : yMax - yMin;
  
  const min = Math.max(0, yMin - yRange * 0.1);
  const max = yMax + yRange * 0.1;
  const range = max - min;

  const getX = (index: number) => padding.left + (index / (data.length - 1)) * (width - padding.left - padding.right);
  const getY = (value: number) => height - padding.bottom - ((value - min) / range) * (height - padding.top - padding.bottom);

  const path = data.map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.value)}`).join(' ');
  const areaPath = `${path} L ${getX(data.length - 1)} ${height - padding.bottom} L ${getX(0)} ${height - padding.bottom} Z`;
  const comparisonPath = comparisonData?.map((point, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(point.value)}`).join(' ');

  return (
    <div className="relative h-full w-full flex items-center">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.3} />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
          </linearGradient>
        </defs>

        <path d={areaPath} fill="url(#areaGradient)" />
        {comparisonPath && (
          <path d={comparisonPath} fill="none" stroke="var(--on-surface-secondary)" strokeWidth="1.5" strokeDasharray="4 4" strokeLinecap="round" />
        )}
        <path d={path} fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

        {data.map((point, index) => (
          <text key={point.label} x={getX(index)} y={height - padding.bottom + 15} textAnchor="middle" className="text-[10px] font-semibold fill-current text-on-surface-secondary">
            {point.label}
          </text>
        ))}
      </svg>
      {comparisonData && (
          <div className="absolute top-0 right-0 text-xs space-y-1">
              <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 bg-primary rounded-full"></div>
                  <span className="text-on-surface-secondary">Segmento</span>
              </div>
              <div className="flex items-center gap-2">
                  <div className="w-3 h-0.5 border-t border-dashed border-on-surface-secondary"></div>
                  <span className="text-on-surface-secondary">Prom. Cía</span>
              </div>
          </div>
      )}
    </div>
  );
};


// --- StackedBarChart ---
export interface StackedChartDataPoint {
    label: string;
    total: number;
    categories: { [key in CategoriaGasto]?: number };
}
interface StackedBarChartProps {
    data: StackedChartDataPoint[];
}
export const StackedBarChart: React.FC<StackedBarChartProps> = ({ data }) => {
    const maxTotal = Math.max(...data.map(d => d.total), 0);
    
    return (
        <div className="flex justify-between items-end h-48 space-x-2">
            {data.map(day => (
                <div key={day.label} className="flex-1 flex flex-col items-center group relative">
                    <div
                        className="w-full bg-active-surface rounded-t-lg flex flex-col-reverse relative overflow-hidden"
                        style={{ height: maxTotal > 0 ? `${(Number(day.total) / maxTotal) * 100}%` : '0%'}}
                    >
                        {Object.entries(day.categories).map(([cat, amount]) => (
                             <div
                                key={cat}
                                className="w-full"
                                style={{
                                    height: `${(Number(amount) / Number(day.total)) * 100}%`,
                                    backgroundColor: categoryDetails[cat as CategoriaGasto]?.color || categoryDetails.Otros.color,
                                }}
                                title={`${cat}: S/ ${Number(amount).toFixed(2)}`}
                            />
                        ))}
                    </div>
                     <span className="text-xs font-bold text-on-surface-secondary mt-2">{day.label}</span>
                     <div className="absolute -top-8 w-auto p-2 text-xs text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        S/ {Number(day.total).toFixed(2)}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- SimpleBarChart ---
export interface BarChartDataPoint {
  label: string;
  value: number;
}

interface SimpleBarChartProps {
  data: BarChartDataPoint[];
  height?: number;
}

export const SimpleBarChart: React.FC<SimpleBarChartProps> = ({ data, height = 120 }) => {
    if (!data || data.some(d => d.value > 0) === false) {
        return <div style={{ height }} className="flex items-center justify-center text-sm text-on-surface-secondary">No hay datos para este período.</div>;
    }
    
    const maxValue = Math.max(...data.map(d => d.value), 0);
    
    return (
        <div className="w-full" style={{ height }}>
            <div className="flex justify-between items-end h-full gap-px px-1">
                {data.map((point, index) => {
                    const barHeight = maxValue > 0 ? (point.value / maxValue) * 100 : 0;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                            <div
                                className="w-full bg-primary/50 rounded-t-sm group-hover:bg-primary transition-colors"
                                style={{ height: `${barHeight}%` }}
                            />
                            { (data.length < 15 || index % 2 === 0) &&
                              <span className="text-[8px] text-on-surface-secondary mt-1">{point.label}</span>
                            }
                            {/* Tooltip */}
                            <div className="absolute bottom-full mb-2 w-auto p-2 text-xs text-white bg-gray-900/80 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                                S/ {point.value.toFixed(2)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Sparkline Chart ---
export const Sparkline: React.FC<{ data: number[]; color: string; width?: number; height?: number }> = ({ data, color, width = 100, height = 30 }) => {
    if (data.length < 2) return null;
    const values = data;
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min === 0 ? 1 : max - min;

    const getX = (index: number) => (index / (values.length - 1)) * width;
    const getY = (value: number) => height - ((value - min) / range) * height;

    const path = values.map((val, index) => `${index === 0 ? 'M' : 'L'} ${getX(index)} ${getY(val)}`).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" preserveAspectRatio="none">
            <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
};