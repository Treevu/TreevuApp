import React from 'react';
import { TrophyIcon, XMarkIcon } from '../Icons';

interface AchievementBannerProps {
    title: string;
    subtitle: string;
    onDismiss: () => void;
}

const AchievementBanner: React.FC<AchievementBannerProps> = ({ title, subtitle, onDismiss }) => {
    return (
        <div
            role="alert"
            className="bg-surface p-4 rounded-2xl flex items-start gap-4 animate-grow-and-fade-in shadow-lg border border-primary/50"
        >
            <div className="w-12 h-12 bg-primary/10 rounded-full flex-shrink-0 flex items-center justify-center">
                <TrophyIcon className="w-8 h-8 text-primary" />
            </div>
            <div className="flex-1">
                <h3 className="font-bold text-primary">{title.replace('Logro Desbloqueado', 'Hito Alcanzado')}</h3>
                <p className="text-sm text-on-surface-secondary mt-1">{subtitle}</p>
            </div>
            <button
                onClick={onDismiss}
                className="p-1 rounded-full text-on-surface-secondary hover:bg-active-surface"
                aria-label="Descartar logro"
            >
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    );
};

export default AchievementBanner;