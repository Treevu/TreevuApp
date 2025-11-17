
import React from 'react';
import { useModal } from '../contexts/ModalContext';
import { LockClosedIcon, SparklesIcon } from './Icons';

interface UpgradePlanCTAProps {
    title: string;
    description: string;
    Icon: React.FC<{ className?: string }>;
    variant?: 'card' | 'transparent';
    origin?: 'people' | 'business' | 'merchant';
}

const UpgradePlanCTA: React.FC<UpgradePlanCTAProps> = ({ title, description, Icon, variant = 'card', origin = 'business' }) => {
    const { openModal } = useModal();

    const containerClasses = variant === 'card' 
        ? "bg-surface rounded-2xl p-4" 
        : "";

    return (
        <div className={`${containerClasses} flex flex-col items-center text-center`}>
            <div className="w-12 h-12 bg-active-surface rounded-full flex items-center justify-center mb-3 relative">
                <Icon className="w-7 h-7 text-on-surface-secondary" />
                <div className="absolute -bottom-1 -right-1 bg-surface rounded-full p-0.5">
                    <LockClosedIcon className="w-5 h-5 text-warning" />
                </div>
            </div>
            <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                {title}
            </h2>
            <p className="text-sm text-on-surface-secondary mt-1 mb-4 max-w-xs">
                {description}
            </p>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Prevent parent clicks (like card flipping)
                    openModal('saasPlanMatrix', { origin });
                }}
                className="bg-primary text-primary-dark font-bold py-2 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center"
            >
                <SparklesIcon className="w-5 h-5 mr-1.5" />
                Ver Planes
            </button>
        </div>
    );
};

export default UpgradePlanCTA;
