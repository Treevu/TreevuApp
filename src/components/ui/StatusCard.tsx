import React, { useState, useMemo, useEffect, forwardRef } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import { TreevuCoinIcon, FireIcon, PencilIcon, BroteIcon, PlantonIcon, ArbustoIcon, RobleIcon, BosqueIcon, TrophyIcon, RocketLaunchIcon, HandThumbUpIcon } from '@/components/ui/Icons';
import { levelData } from '@/services/gamificationService.ts';
import { TreevuLevel } from '@/types/common';
import { useModal } from '@/hooks/useZustandCompat';
import { generateMockTreevuId, getMemberSinceYear } from '@/utils';
import TreevuLogoText from '@/components/ui/TreevuLogoText.tsx';
import { User, BadgeType } from '@/types/user';
import Logo from '@/components/ui/Logo';

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
    const { state: { expenses } } = useAppContext();
    const { openModal } = useModal();
    const [customization, setCustomization] = useState({ material: 'default', accent: 'primary' });
    const [isFlipped, setIsFlipped] = useState(false);
    

    

    const handleFlip = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        setIsFlipped(!isFlipped);
    };

    


    
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
    
    
    
    let textColorClass = 'text-black';
    let subTextColorClass = 'text-gray-800';

    return (
        <div className="status-card-container w-full max-w-sm mx-auto aspect-[1.586/1]">
            <button
                ref={ref}
                className="w-full h-full status-card-btn p-0 border-0 text-left"
                onClick={handleFlip}
                aria-label="Voltear tarjeta para ver detalles"
            >
                <div className={`status-card-inner card-material-brushed-metal rounded-3xl shadow-lg relative dark:ring-1 dark:ring-white/10   ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* FRONT FACE */}
                    <div className={`status-card-face status-card-front shadow-lg`}>
                        <Logo className="absolute inset-0 m-auto w-2/3 h-2/3 text-black/5" />
                        <div className="flex flex-row-reverse justify-between items-start">
                             <h2 className={`status-card-logo text-2xl font-bold `}>
                                <TreevuLogoText className="text-2xl font-bold text-emboss-light" colorClass={'text-gray-800'} />
                            </h2>
                            <div className="status-card-chip"></div>
                        </div>
                        
                        <div className='flex flex-col'>
                            <p className={`font-sans text-xl md:text-2xl tracking-widest ${textColorClass}`}>
                                9883 3284829
                            </p>
                            <div className='flex flex-row justify-between items-end'>
                                <div className={`flex items-center mt-2 ${subTextColorClass}`}>
                                    <span className="text-[8px] font-semibold leading-none mr-1.5 text-center">MIEMBRO<br/>DESDE</span>
                                    <span className={`font-mono text-base font-semibold ${textColorClass}`}>
                                        {getMemberSinceYear()}
                                    </span>
                                </div>
                                <span>Mateo Rojas</span>
                                <p className='flex flex-col items-end justify-center'>
                                    <span className='text-2xl font-bold text-emboss-light'>1250 <i className="fa-solid fa-dollar-sign"></i></span>
                                    <TreevuLogoText className="" isTreevus={true} colorClass={'text-gray-800'} />
                                </p>
                            </div>
                        </div>
                    </div>
                     {/* BACK FACE */}
                    <div className={`status-card-face status-card-back shadow-lg !p-0 !justify-start`}>
                        <Logo className="absolute inset-0 m-auto w-2/3 h-2/3 text-black/5" />
                        <div className="w-full h-full flex flex-col">
                            {/* Magnetic Strip */}
                            <div className="magnetic-strip mt-5"></div>
                            
                            <div className="p-4 flex-grow flex flex-col justify-between">
                                <div>
                                    <h4 className={`font-bold ${textColorClass} mb-1 flex items-center gap-1.5`}>
                                        ¿Qué es un <TreevuLogoText isTreevus={false} colorClass='text-gray-800'/>?
                                    </h4>
                                    <p className={`text-xs ${subTextColorClass}`}>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed finibus scelerisque metus vitae volutpat. Sed ut sagittis nisi, eget molestie sem.
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