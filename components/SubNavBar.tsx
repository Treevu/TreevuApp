import React from 'react';

interface SubNavTab<T extends string> {
    id: T;
    label: string;
    Icon?: React.FC<{ className?: string }>;
    ref?: React.RefObject<HTMLButtonElement>;
}

interface SubNavBarProps<T extends string> {
    tabs: SubNavTab<T>[];
    activeTab: T;
    onTabClick: (tab: T) => void;
}

const SubNavBar = <T extends string>({ tabs, activeTab, onTabClick }: SubNavBarProps<T>): React.ReactElement => {
    const gridColsClass = tabs.length === 3 ? 'grid-cols-3' : 'grid-cols-2';
    return (
        <div className={`grid ${gridColsClass} gap-3 mb-4`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id as string}
                    ref={tab.ref}
                    onClick={() => onTabClick(tab.id)}
                    className={`w-full text-left p-4 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${
                        activeTab === tab.id 
                        ? 'bg-surface text-on-surface shadow-md ring-1 ring-inset ring-primary/50' 
                        : 'bg-background text-on-surface-secondary hover:bg-active-surface'
                    }`}
                    aria-pressed={activeTab === tab.id}
                >
                    {tab.Icon && <tab.Icon className="w-6 h-6" />}
                    <span>{tab.label}</span>
                </button>
            ))}
        </div>
    );
};

export default SubNavBar;