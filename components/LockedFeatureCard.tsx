import React from 'react';
import { LockClosedIcon } from './Icons';
import DashboardWidget from './DashboardWidget';

interface LockedFeatureCardProps {
    title: string;
    Icon: React.FC<{ className?: string }>;
    unlockMessage: string;
    progressPercentage: number;
}

const LockedFeatureCard: React.FC<LockedFeatureCardProps> = ({ title, Icon, unlockMessage, progressPercentage }) => {
    return (
        <DashboardWidget title={title} Icon={Icon}>
            <div className="text-center p-4 bg-background rounded-xl opacity-70">
                <div className="w-12 h-12 bg-active-surface rounded-full flex items-center justify-center mx-auto mb-3">
                    <LockClosedIcon className="w-7 h-7 text-on-surface-secondary" />
                </div>
                <p className="text-sm font-semibold text-on-surface-secondary">{unlockMessage}</p>
                
                <div className="mt-4">
                    <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1">
                        <span>Progreso para desbloquear</span>
                        <span className="font-bold">{progressPercentage.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 w-full bg-active-surface rounded-full">
                        <div
                            className="h-2 rounded-full bg-primary/50 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </DashboardWidget>
    );
};

export default LockedFeatureCard;