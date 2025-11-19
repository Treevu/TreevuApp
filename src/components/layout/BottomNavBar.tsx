import React from 'react';

interface NavTab<T extends string> {
    id: T;
    ref?: React.RefObject<HTMLButtonElement>;
    label: string;
    Icon: string;
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
        
        if (isRegistrar) {
            // Botón de registro especial
            return (
                <div key={tab.id as string} className="registrar-tab">
                    <button
                        ref={tab.ref}
                        id={`tab-${tab.id}`}
                        role="tab"
                        aria-label={tab.label}
                        onClick={() => onTabClick(tab.id)}
                        className="nav-button"
                    >
                        <i className={`nav-icon ${tab.Icon}`}></i>
                    </button>
                    {/* <span className="nav-label">{tab.label}</span> */}
                </div>
            );
        }
        
        // Botones normales
        return (
            <button
                key={tab.id as string}
                ref={tab.ref}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onTabClick(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center text-center py-2 duration-200 outline-none rounded-t-sm ${
                    isActive && !isRegistrar ? 'text-primary' : 'text-on-surface-secondary hover:text-primary'
                }`}
            >
                <div className="relative">
                    <i className={`text-lg h-8 ${tab.Icon}`}></i>
                    <div 
                        className={`absolute top-7 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full transition-all duration-300 ease-in-out ${
                            isActive && !isRegistrar ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
                        }`}
                        aria-hidden="true"
                    />
                </div>
                <span className="text-xs font-bold">{tab.label}</span>
            </button>
        );
    };

    return (
        <nav
            role="tablist"
            aria-label="Navegación principal"
            className="bottom-nav-bar flex justify-around items-end h-[72px]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            {tabs.map(renderTab)}
        </nav>
    );
};

export default BottomNavBar;