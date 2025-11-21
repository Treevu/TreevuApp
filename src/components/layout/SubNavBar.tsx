import React from 'react';

interface SubNavTab<T extends string> {
    id: T;
    label: string;
    Icon?: React.FC<{ className?: string }>;
}

interface SubNavBarProps<T extends string> {
    tabs: SubNavTab<T>[];
    activeTab: T;
    onTabClick: (tab: T) => void;
}

const SubNavBar = <T extends string>({ tabs, activeTab, onTabClick }: SubNavBarProps<T>): React.ReactElement => {
    return (
        <div className="bg-background mb-2 grid grid-flow-col grid-rows-2 gap-4">
            {tabs.map(({ id, label, Icon }) => (
                <button
                    key={id as string}
                    onClick={() => onTabClick(id)}
                    className={`flex-1 text-center py-2 px-4 rounded-full font-bold text-sm transition-colors flex items-center justify-center gap-2 border ${activeTab === id ? 'bg-surface border-surface text-on-surface shadow-sm' : 'text-on-surface-secondary border-transparent hover:border-white hover:text-on-surface'}`}
                    aria-pressed={activeTab === id}
                >
                    {Icon && <Icon className="w-5 h-5" />}
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
};

// FIX: Removed React.memo wrapper. The previous type assertion for memoizing a generic component
// may have caused a runtime error, preventing the app from loading. This change ensures stability.
export default SubNavBar;