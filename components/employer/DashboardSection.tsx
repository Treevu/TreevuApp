import React, { useState } from 'react';
import { ChevronDownIcon } from '../Icons';

interface DashboardSectionProps {
    title: string;
    Icon: React.FC<{ className?: string }>;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

const DashboardSection = React.forwardRef<HTMLDivElement, DashboardSectionProps>(
    ({ title, Icon, children, defaultOpen = true }, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div ref={ref} className="bg-surface rounded-2xl shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10 transition-all duration-300">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex justify-between items-center text-left"
                aria-expanded={isOpen}
            >
                <h2 className="text-lg font-bold text-on-surface flex items-center gap-3">
                    <Icon className="w-6 h-6 text-primary" />
                    {title}
                </h2>
                <ChevronDownIcon className={`w-6 h-6 text-on-surface-secondary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
            >
                <div className="overflow-hidden">
                    <div className="px-4 pb-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default DashboardSection;