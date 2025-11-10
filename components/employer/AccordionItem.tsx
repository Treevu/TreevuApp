import React from 'react';
import { ChevronDownIcon } from '../Icons';

interface AccordionItemProps {
    title: React.ReactNode;
    isOpen: boolean;
    onClick: () => void;
    children: React.ReactNode;
}

const AccordionItem: React.FC<AccordionItemProps> = ({ title, isOpen, onClick, children }) => {
    return (
        <div className="border-b border-active-surface/50 last:border-b-0">
            <button
                onClick={onClick}
                className="w-full flex justify-between items-center py-3 text-left font-semibold text-on-surface hover:bg-active-surface/30 rounded-t-lg px-2"
                aria-expanded={isOpen}
            >
                <div className="flex-1 pr-2">{title}</div>
                <ChevronDownIcon
                    className={`w-5 h-5 transition-transform duration-300 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className="grid transition-[grid-template-rows] duration-300 ease-in-out"
                style={{
                    gridTemplateRows: isOpen ? '1fr' : '0fr',
                }}
            >
                <div className="overflow-hidden">
                    <div className="pb-3 px-2">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccordionItem;
