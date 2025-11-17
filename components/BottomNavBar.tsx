import React from 'react';
import { PlusIcon } from './Icons';

interface NavTab<T extends string> {
    id: T;
    ref?: React.RefObject<HTMLButtonElement>;
    label: string;
    Icon: React.FC<{ className?: string }>;
}

// FIX: Made onFabClick and isFabMenuOpen optional to support navbars without a FAB.
interface BottomNavBarProps<T extends string> {
    tabs: NavTab<T>[];
    activeTab: T;
    onTabClick: (tab: T) => void;
    onFabClick?: () => void;
    isFabMenuOpen?: boolean;
}

const BottomNavBar = <T extends string>({ tabs, activeTab, onTabClick, onFabClick, isFabMenuOpen }: BottomNavBarProps<T>): React.ReactElement => {
    
    const hasFab = onFabClick && typeof isFabMenuOpen !== 'undefined';
    const leftTabs = hasFab ? tabs.slice(0, 2) : [];
    const rightTabs = hasFab ? tabs.slice(2) : [];

    const renderTab = (tab: NavTab<T>) => {
        const isActive = activeTab === tab.id;

        return (
            <button
                key={tab.id as string}
                ref={tab.ref}
                id={`tab-${tab.id}`}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.id}`}
                onClick={() => onTabClick(tab.id)}
                className={`flex-1 flex flex-col items-center justify-center text-center py-2 transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-primary rounded-t-sm ${
                    isActive ? 'text-primary' : 'text-on-surface-secondary hover:text-primary'
                }`}
            >
                <div className="relative">
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
            className="fixed bottom-0 left-0 right-0 z-20 max-w-3xl mx-auto bg-surface/80 backdrop-blur-lg border-t border-white/10 h-[72px]"
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
            <div className="flex justify-around items-end w-full h-full">
                {hasFab ? (
                    <>
                        {leftTabs.map(renderTab)}
                        <div className="w-20 flex-shrink-0" aria-hidden="true" /> {/* Placeholder for the FAB */}
                        {rightTabs.map(renderTab)}
                    </>
                ) : (
                    tabs.map(renderTab)
                )}
            </div>
            {hasFab && (
                 <button
                    onClick={onFabClick}
                    className="absolute left-1/2 -translate-x-1/2 bottom-4 w-16 h-16 bg-gradient-to-r from-accent to-accent-secondary text-primary-dark rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center transform hover:scale-110 active:scale-100 transition-all duration-300 ease-in-out ring-4 ring-surface"
                    aria-expanded={isFabMenuOpen}
                    aria-haspopup="true"
                    aria-label={isFabMenuOpen ? "Cerrar menú de registro" : "Abrir menú de registro"}
                >
                    <div className={`transition-transform duration-300 ${isFabMenuOpen ? 'rotate-45' : 'rotate-0'}`}>
                        <PlusIcon className="w-8 h-8" />
                    </div>
                </button>
            )}
        </nav>
    );
};

export default BottomNavBar;