import React from 'react';
import Tooltip from '@/components/ui/Tooltip.tsx';

interface KpiCardProps {
    title: string | number;
    value: string | number;
    description?: string;
    tooltipText: string;
    variant?: 'default' | 'success' | 'warning' | 'danger';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, description, tooltipText, variant = 'default' }) => {
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

    return (
        <div className={`rounded-2xl p-4 flex flex-col border ${currentVariant.bg} transition-colors duration-300`}>
            {/* Top section: Title */}
            <div className="flex items-start justify-between min-h-[36px]">
                <h3 className={`text-xs font-bold uppercase tracking-wider pr-2 ${currentVariant.title}`}>{title}</h3>
                <Tooltip text={tooltipText} id={tooltipId} />
            </div>
            
            {/* Middle section: Value (takes up available space) */}
            <div className="flex-grow flex items-center justify-center py-2">
                <p className={`text-3xl md:text-4xl font-extrabold ${currentVariant.text} tracking-tighter text-center`}>{value}</p>
            </div>

            {/* Bottom section: Description */}
            {description && (
                <div className="text-xs text-on-surface-secondary mt-2 text-center min-h-[2.5rem] flex items-center justify-center">
                    <span>{description}</span>
                </div>
            )}
        </div>
    );
};

export default React.memo(KpiCard);