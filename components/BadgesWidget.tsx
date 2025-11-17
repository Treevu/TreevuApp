import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { badgeData, BadgeType } from '../services/gamificationService';
import { TrophyIcon } from './Icons';

const BadgesWidget: React.FC = () => {
    const { user, updateUser } = useAuth();

    if (!user) return null;

    const handleSelectBadge = (badgeKey: BadgeType) => {
        if (user.badges?.includes(badgeKey)) {
            updateUser({ featuredBadge: badgeKey });
        }
    };

    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in">
            <h2 className="text-lg font-bold text-on-surface mb-3 flex items-center">
                <TrophyIcon className="w-6 h-6 mr-2 text-primary"/>
                Mis Insignias
            </h2>
            <div className="grid grid-cols-4 gap-4">
                {Object.entries(badgeData).map(([key, badge]) => {
                    const badgeKey = key as BadgeType;
                    const isUnlocked = user.badges?.includes(badgeKey);
                    const isFeatured = user.featuredBadge === badgeKey;
                    
                    return (
                        <div key={badgeKey} className="tooltip-container flex flex-col items-center">
                            <button
                                onClick={() => handleSelectBadge(badgeKey)}
                                disabled={!isUnlocked}
                                className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 transform
                                    ${isUnlocked ? 'bg-active-surface hover:scale-110' : 'bg-background grayscale opacity-50'}
                                    ${isFeatured ? 'ring-2 ring-offset-2 ring-offset-surface ring-primary' : ''}
                                `}
                            >
                                <badge.icon className={`w-9 h-9 ${isUnlocked ? 'text-primary' : 'text-on-surface-secondary'}`} />
                            </button>
                            <div className="tooltip-box !w-40 text-center">
                                <p className="font-bold">{badge.title}</p>
                                <p className="text-xs mt-1">{badge.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
             <p className="text-xs text-center text-on-surface-secondary mt-4">
                ¡Haz clic en una insignia desbloqueada para mostrarla en el ranking!
            </p>
        </div>
    );
};

export default BadgesWidget;