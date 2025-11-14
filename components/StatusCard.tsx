import React, { useState, useMemo, useEffect, forwardRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppContext } from '../contexts/AppContext';
import { TreevuCoinIcon, FireIcon, PencilIcon, BroteIcon, PlantonIcon, ArbustoIcon, RobleIcon, BosqueIcon, TrophyIcon, RocketLaunchIcon, HandThumbUpIcon } from './Icons';
import { levelData } from '../services/gamificationService';
import { TreevuLevel } from '../types/common';
import { useModal } from '../contexts/ModalContext';
import { generateMockTreevuId, getMemberSinceYear } from '../utils';
import TreevuLogoText from './TreevuLogoText';
import { User, BadgeType } from '../types/user';

interface StatusCardProps { }

const levelIconComponents: Record<TreevuLevel, React.FC<{className?: string}>> = {
    [TreevuLevel.Brote]: BroteIcon,
    [TreevuLevel.Plantón]: PlantonIcon,
    [TreevuLevel.Arbusto]: ArbustoIcon,
    [TreevuLevel.Roble]: RobleIcon,
    [TreevuLevel.Bosque]: BosqueIcon,
};

const badgeData: { [key in BadgeType]: { icon: React.FC<{className?: string}>; title: string; isUnlocked: (user: User) => boolean } } = {
    pioneer: { icon: RocketLaunchIcon, title: "Pionero Fundador", isUnlocked: () => true },
    level: { icon: TrophyIcon, title: "Maestro del Bosque", isUnlocked: user => user.level >= TreevuLevel.Bosque },
    streak: { icon: FireIcon, title: "Corazón de Fuego", isUnlocked: user => (user.streak?.count || 0) >= 7 },
    kudos: { icon: HandThumbUpIcon, title: "Corazón Generoso", isUnlocked: user => user.kudosSent >= 10 },
};

const QrCodePlaceholder: React.FC = () => (
    <div className="w-14 h-14 bg-white p-1 rounded-sm grid grid-cols-7 gap-px">
        {Array.from({ length: 49 }).map((_, i) => {
            const row = Math.floor(i / 7);
            const col = i % 7;
            let isBlack = Math.random() > 0.5;
            // Static corners to make it look more like a QR code
            if ((row < 3 && col < 3) || (row < 3 && col > 3) || (row > 3 && col < 3)) isBlack = true;
            if ((row === 1 && col === 1) || (row === 1 && col === 5) || (row === 5 && col === 1)) isBlack = false;
            
            return <div key={i} className={`h-full w-full ${isBlack ? 'bg-black' : 'bg-white'}`}></div>
        })}
    </div>
);


const StatusCard = forwardRef<HTMLButtonElement, StatusCardProps>((props, ref) => {
    const { user } = useAuth();
    const { state: { expenses } } = useAppContext();
    const { openModal } = useModal();
    const [customization, setCustomization] = useState({ material: 'default', accent: 'primary' });
    const [isFlipped, setIsFlipped] = useState(false);
    
    const storageKey = `status-card-customization-${user?.id || 'default'}`;

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setCustomization(JSON.parse(saved));
        }
        const handleStorageChange = () => {
            const updated = localStorage.getItem(storageKey);
            if(updated) {
                setCustomization(JSON.parse(updated));
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [storageKey]);
    

    const handleFlip = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        setIsFlipped(!isFlipped);
    };

    const isLightCard = useMemo(() => {
        if (customization.material !== 'default') {
            return ['marble', 'brushed-metal', 'pearl'].includes(customization.material);
        }
        if (user) {
            return user.level === TreevuLevel.Plantón || user.level === TreevuLevel.Arbusto;
        }
        return false;
    }, [customization.material, user]);

    const embossClass = isLightCard ? 'text-emboss-light' : 'text-emboss-dark';
    
    if (!user) {
        return (
            <div className="aspect-[1.586/1] w-full bg-surface rounded-3xl flex items-center justify-center animate-pulse">
                <div className="w-1/2 h-8 bg-active-surface rounded-md"></div>
            </div>
        );
    }
    
    const getCardMaterialClass = (level: TreevuLevel): string => {
        if (customization.material !== 'default') {
             return `card-material-${customization.material}`;
        }
        switch (level) {
            case TreevuLevel.Brote: return 'card-material-wood';
            case TreevuLevel.Plantón: return 'card-material-marble';
            case TreevuLevel.Arbusto: return 'card-material-brushed-metal';
            case TreevuLevel.Roble: return 'card-material-carbon-fiber';
            case TreevuLevel.Bosque: return 'card-material-carbon-fiber';
            default: return 'card-material-wood';
        }
    };
    
    const cardMaterialClass = getCardMaterialClass(user.level);
    const specialEffectClass = user.level === TreevuLevel.Bosque && customization.material === 'default'
        ? 'card-effect-pulse-border'
        : '';
    
    const cardClasses = `${cardMaterialClass} ${specialEffectClass}`;
    
    const currentLevelData = levelData[user.level];
    
    let textColorClass = 'text-white';
    let subTextColorClass = 'text-gray-300';
    if (isLightCard) {
        textColorClass = 'text-gray-800';
        subTextColorClass = 'text-gray-600';
    }

    return (
        <div className="status-card-container w-full max-w-sm mx-auto aspect-[1.586/1]">
            <button
                ref={ref}
                className="w-full h-full p-0 border-0 bg-transparent text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary rounded-3xl"
                onClick={handleFlip}
                aria-label="Voltear tarjeta para ver detalles"
            >
                <div className={`status-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* FRONT FACE */}
                    <div className={`status-card-face status-card-front ${cardClasses} shadow-lg`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal('personalization', { storageKey });
                            }}
                            className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors ${subTextColorClass} hover:bg-black/20`}
                            aria-label="Personalizar tarjeta"
                        >
                            <PencilIcon className="w-4 h-4" />
                        </button>
                        <div className="flex justify-between items-start">
                             <h2 className={`status-card-logo text-2xl font-bold ${embossClass}`}>
                                <TreevuLogoText middleColorClass={isLightCard ? 'text-gray-800' : 'text-white'} />
                            </h2>
                            <div className="status-card-chip"></div>
                        </div>
                        
                        <div>
                            <p className={`font-sans text-xl md:text-2xl tracking-widest ${textColorClass} ${embossClass}`}>
                                {generateMockTreevuId(user.id)}
                            </p>
                            <div className={`flex items-center mt-2 ${subTextColorClass}`}>
                                <span className="text-[8px] font-semibold leading-none mr-1.5 text-center">MIEMBRO<br/>DESDE</span>
                                <span className={`font-mono text-base font-semibold ${textColorClass} ${embossClass}`}>
                                    ' {getMemberSinceYear()}
                                </span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div className="flex-1 min-w-0">
                                <p className={`text-lg font-semibold truncate ${textColorClass} ${embossClass}`}>
                                    {user.name}
                                    {user.prestigeLevel && user.prestigeLevel > 0 && 
                                        <span className="text-yellow-400 ml-1.5" title={`Nivel de Prestigio ${user.prestigeLevel}`}>
                                            🏆
                                        </span>
                                    }
                                </p>
                                <div className="leading-tight">
                                    <p className={`text-xs ${subTextColorClass} ${embossClass}`}>
                                        Nivel: {currentLevelData.name}
                                        {user.prestigeLevel && user.prestigeLevel > 0 && ` (P${user.prestigeLevel})`}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className={`font-bold text-xl ${textColorClass} ${embossClass} flex items-center justify-end gap-1`}>
                                    {user.treevus.toLocaleString('es-PE')} <TreevuCoinIcon className="w-5 h-5" level={user.level}/>
                                </p>
                                <p className={`text-xs -mt-1 ${subTextColorClass} ${embossClass}`}>
                                    Treevüs
                                </p>
                            </div>
                        </div>
                    </div>
                     {/* BACK FACE */}
                    <div className={`status-card-face status-card-back ${cardClasses} shadow-lg !p-0 !justify-start`}>
                        <div className="w-full h-full flex flex-col">
                            {/* Magnetic Strip */}
                            <div className="magnetic-strip mt-5"></div>
                            
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h4 className={`font-bold ${textColorClass} mb-1 flex items-center gap-1.5`}>
                                        ¿Qué es un <TreevuLogoText isTreevus={false} middleColorClass={isLightCard ? 'text-gray-800' : 'text-white'}/>?
                                    </h4>
                                    <p className={`text-xs ${subTextColorClass}`}>
                                        Un treevü es más que una moneda; es el símbolo de tu crecimiento. Cada uno que cosechas es un paso adelante en tu maestría financiera, una prueba de que estás construyendo un futuro más fuerte. ¡Es el poder de tus hábitos en tus manos!
                                    </p>
                                </div>
                                <div className="flex items-end justify-between">
                                    <div className="w-[70%] h-12 bg-white/80 flex items-center justify-start pl-2">
                                        <p className="font-serif italic text-lg text-gray-800">El Escuadrón Treevü</p>
                                    </div>
                                    <QrCodePlaceholder />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </button>
        </div>
    );
});

export default StatusCard;
