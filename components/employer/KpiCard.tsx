import React, { useMemo } from 'react';
import Tooltip from '../Tooltip';
import { Sparkline } from '../TrendAnalysis';
import { ArrowTrendingUpIcon, ArrowTrendingDownIcon } from '../Icons';

interface KpiCardProps {
    title: string | number;
    value: string | number;
    subValue?: string;
    description?: string;
    tooltipText: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
    history?: { month: string; value: number }[];
    valueSuffix?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, subValue, description, tooltipText, variant = 'default', history, valueSuffix = '' }) => {
    const variants = {
        default: {
            text: 'text-on-surface',
            title: 'text-on-surface-secondary',
            bg: 'bg-surface border-active-surface/50'
        },
        success: {
            text: 'text-emerald-500',
            title: 'text-emerald-600 dark:text-emerald-400',
            bg: 'bg-emerald-500/5 border-emerald-500/20'
        },
        warning: {
            text: 'text-warning',
            title: 'text-yellow-600 dark:text-yellow-400',
            bg: 'bg-warning/5 border-warning/20'
        },
        danger: {
            text: 'text-danger',
            title: 'text-red-600 dark:text-red-400',
            bg: 'bg-danger/5 border-danger/20'
        },
    };
    const currentVariant = variants[variant];
    const tooltipId = `kpi-tooltip-${String(title).replace(/\s+/g, '-').toLowerCase()}`;

    const delta = useMemo(() => {
        if (!history || history.length < 2) return null;
        const currentValue = history[history.length - 1].value;
        const prevValue = history[history.length - 2].value;
        const change = currentValue - prevValue;
        
        let isPositiveImprovement = change >= 0;
        // For 'danger' and 'warning' variants, a decrease is an improvement
        if (variant === 'danger' || variant === 'warning') {
            isPositiveImprovement = change <= 0;
        }

        return { value: change, isPositiveImprovement };
    }, [history, variant]);

    // Simple Card Layout (No History)
    if (!history) {
        return (
            <div className={`rounded-2xl p-4 flex flex-col border ${currentVariant.bg} transition-colors duration-300`}>
                <div className="flex items-start justify-between min-h-[36px]">
                    <h3 className={`text-xs font-bold uppercase tracking-wider pr-2 ${currentVariant.title}`}>{title}</h3>
                    <Tooltip text={tooltipText} id={tooltipId} />
                </div>
                <div className="flex-grow flex items-center justify-center py-2">
                    <p className={`text-3xl md:text-4xl font-extrabold ${currentVariant.text} tracking-tighter text-center`}>{value}</p>
                </div>
                {description && (
                    <div className="text-xs text-on-surface-secondary mt-2 text-center min-h-[2.5rem] flex items-center justify-center">
                        <span>{description}</span>
                    </div>
                )}
            </div>
        );
    }
    
    // Historical Card Layout
    const historyValues = history.map(h => h.value);
    const sparklineColor = {
        default: 'var(--primary)',
        success: 'var(--primary)',
        warning: 'var(--warning)',
        danger: 'var(--danger)',
    }[variant];

    const startMonth = history[0]?.month;
    const endMonth = history[history.length - 1]?.month;

    return (
        <div className={`rounded-2xl p-4 flex flex-col border ${currentVariant.bg} transition-colors duration-300`}>
            <div className="flex items-start justify-between">
                <h3 className={`text-xs font-bold uppercase tracking-wider pr-2 ${currentVariant.title}`}>{title}</h3>
                <Tooltip text={tooltipText} id={tooltipId} />
            </div>

            <div className="flex-grow flex items-center justify-between gap-4 mt-2">
                <div>
                    <div className="flex items-baseline gap-2">
                         <p className={`text-4xl md:text-5xl font-extrabold ${currentVariant.text} tracking-tighter`}>
                            {value}
                            <span className="text-3xl">{valueSuffix}</span>
                        </p>
                        {subValue && <span className={`text-lg font-bold ${currentVariant.text}`}>{subValue}</span>}
                    </div>
                    {delta && (
                        <div className={`flex items-center font-bold mt-1 text-sm ${delta.isPositiveImprovement ? 'text-emerald-500' : 'text-danger'}`}>
                            {delta.isPositiveImprovement ? <ArrowTrendingUpIcon className="w-4 h-4 mr-1"/> : <ArrowTrendingDownIcon className="w-4 h-4 mr-1"/>}
                            <span>{Math.abs(delta.value).toFixed(1)}{valueSuffix} vs mes anterior</span>
                        </div>
                    )}
                </div>
                <div className="w-24 flex-shrink-0">
                    <div className="h-10">
                        <Sparkline data={historyValues} color={sparklineColor} />
                    </div>
                    {startMonth && endMonth && (
                        <div className="flex justify-between text-[10px] font-semibold text-on-surface-secondary mt-1">
                            <span>{startMonth}</span>
                            <span>{endMonth}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default React.memo(KpiCard);