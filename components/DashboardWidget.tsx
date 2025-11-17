import React from 'react';

interface DashboardWidgetProps {
    title: string;
    Icon: React.FC<{ className?: string }>;
    children: React.ReactNode;
    actionButton?: React.ReactNode;
    gridSpan?: string;
    iconClassName?: string;
}

const DashboardWidget: React.FC<DashboardWidgetProps> = ({ title, Icon, children, actionButton, gridSpan = '', iconClassName = 'text-primary' }) => {
    return (
        <div className={`bg-surface/80 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-xl flex flex-col ${gridSpan}`}>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${iconClassName}`} />
                    {title}
                </h2>
                {actionButton}
            </div>
            <div className="flex-1 flex flex-col justify-center">
                {children}
            </div>
        </div>
    );
};

export default DashboardWidget;