import React from 'react';

interface NavTab<T extends string> {
    id: T;
    ref?: React.RefObject<HTMLButtonElement>;
    label: string;
    Icon: React.FC<{ className?: string }>;
}

interface BottomNavBarProps<T extends string> {
    tabs: NavTab<T>[];
    activeTab: T;
    onTabClick: (tab: T) => void;
}

const BottomNavBar = <T extends string>({ tabs, activeTab, onTabClick }: BottomNavBarProps<T>): React.ReactElement => {
    const renderTab = (tab: NavTab<T>) => {
        const isActive = activeTab === tab.id;
        const isRegistrar = tab.id === 'registrar';

        return (
            <button
                key={tab.id as string}
                ref={tab.ref}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive && !isRegistrar}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onTabClick(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center text-center py-2 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-t-sm ${
                    isActive && !isRegistrar ? 'text-primary' : 'text-on-surface-secondary hover:text-primary'
                }`}
            >
                <div className="relative">
                     <div 
                        className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full transition-all duration-300 ease-in-out ${
                            isActive && !isRegistrar ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                        aria-hidden="true"
                    />
                    <tab.Icon className="w-7 h-7 mb-1"/>
                </div>
                <span className="text-xs font-bold">{tab.label}</span>
            </button>
        );
    };

    return (
        <nav
            role="tablist"
            aria-label="Navegación principal"
            className="fixed bottom-0 left-0 right-0 z-20 max-w-3xl mx-auto bg-surface/80 backdrop-blur-lg border-t border-active-surface/50 flex justify-around items-end h-[72px]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {tabs.map(renderTab)}
        </nav>
    );
};

export default BottomNavBar;