import React, { useState, useEffect, forwardRef, useMemo } from 'react';
import { CurrentUserType } from './EmployerDashboard';
import { UsersIcon, ArrowTrendingDownIcon, ArrowTrendingUpIcon, PencilIcon, TreevuNetworkIcon } from '@/components/ui/Icons';
import { useModal } from '@/contexts/ModalContext';
import { generateMockCardNumber, generateMockExpiryDate, generateMockCvv } from '../../utils';
import TreevuLogoText from '@/components/ui/TreevuLogoText.tsx';

interface EmployerStatusCardProps {
    user: CurrentUserType;
    dashboardData: any;
    isTourHighlightActive?: boolean;
    selectedDepartment: string;
}

const EmployerStatusCard = forwardRef<HTMLButtonElement, EmployerStatusCardProps>(({ user, dashboardData, isTourHighlightActive = false, selectedDepartment }, ref) => {
    const [isFlipped, setIsFlipped] = useState(false);
    const { openModal } = useModal();
    const [customization, setCustomization] = useState({ material: 'default', accent: 'primary' });
    const [isGlareActive, setIsGlareActive] = useState(true);

    const storageKey = `employer-status-card-customization-${user.name.replace(/\s+/g, '-')}`;

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            setCustomization(JSON.parse(saved));
        }
        const handleStorageChange = () => {
            const updated = localStorage.getItem(storageKey);
            if(updated) setCustomization(JSON.parse(updated));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [storageKey]);
    
    useEffect(() => {
        setIsGlareActive(true);
        const timer = setTimeout(() => setIsGlareActive(false), 800);
        return () => clearTimeout(timer);
    }, [customization.material]);

    useEffect(() => {
        if (isTourHighlightActive) {
            // Sequence: glare, flip to back, pause, flip to front
            const sequence = [
                () => setIsGlareActive(true),
                () => setTimeout(() => setIsFlipped(true), 500),
                () => setTimeout(() => setIsFlipped(false), 3000),
                () => setTimeout(() => setIsGlareActive(false), 3800),
            ];
            
            sequence.forEach((fn, i) => setTimeout(fn, i * 100));
        }
    }, [isTourHighlightActive]);
    
    const handleFlip = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        setIsFlipped(!isFlipped);
    }
    
    const isLightCard = useMemo(() => {
        if (customization.material !== 'default') {
            return ['marble', 'brushed-metal', 'pearl'].includes(customization.material);
        }
        return dashboardData.financialWellnessIndex < 65; // Crecimiento tier is light
    }, [customization.material, dashboardData.financialWellnessIndex]);

    const embossClass = isLightCard ? 'text-emboss-light' : 'text-emboss-dark';

    if (dashboardData.isEmpty) {
         return (
            <div className="aspect-[1.586/1] w-full bg-surface rounded-3xl flex items-center justify-center animate-pulse">
                <div className="w-1/2 h-8 bg-active-surface rounded-md"></div>
            </div>
        );
    }

    const fwi = dashboardData.financialWellnessIndex;
    let cardTier: { class: string; levelName: string; icon: string; text: string; subText: string };
    
    if (customization.material !== 'default') {
        cardTier = { class: `card-material-${customization.material}`, levelName: 'Personalizado', icon: '✨', text: 'text-white', subText: 'text-gray-300' };
         if (customization.material === 'marble' || customization.material === 'brushed-metal' || customization.material === 'pearl') {
            cardTier.text = 'text-gray-800';
            cardTier.subText = 'text-gray-600';
        }
    } else if (fwi >= 80) {
        cardTier = { class: 'card-material-matte-black border border-accent', levelName: 'Estratégico', icon: '🏆', text: 'text-white', subText: 'text-gray-300' };
    } else if (fwi >= 65) {
        cardTier = { class: 'card-material-carbon-fiber', levelName: 'Consolidado', icon: '🌿', text: 'text-white', subText: 'text-gray-300' };
    } else {
        cardTier = { class: 'card-material-brushed-metal', levelName: 'Crecimiento', icon: '🌱', text: 'text-gray-800', subText: 'text-gray-600' };
    }
    
    const segmentName = selectedDepartment === 'all' ? 'Toda la Empresa' : selectedDepartment;


    return (
        <button ref={ref} className="w-full max-w-sm mx-auto aspect-[1.586/1] p-0 border-0 bg-transparent text-left focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary rounded-3xl" onClick={handleFlip} aria-label="Voltear tarjeta para ver detalles">
            <div className="status-card-container w-full h-full">
                <div className={`status-card-inner ${isFlipped ? 'is-flipped' : ''}`}>
                    {/* Front of card */}
                    <div className={`status-card-face status-card-front ${cardTier.class} ${isGlareActive ? 'glare-active' : ''} shadow-lg relative`}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                openModal('personalization', { storageKey });
                            }}
                            className={`absolute top-3 right-3 z-10 p-1.5 rounded-full transition-colors ${cardTier.subText} hover:bg-black/20`}
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
                            <p className={`font-mono text-xl md:text-2xl tracking-wider ${cardTier.text} ${embossClass}`}>
                                {generateMockCardNumber(user.name)}
                            </p>
                             <div className={`flex items-center mt-1 ${cardTier.subText}`}>
                                <span className="text-[8px] font-semibold leading-none mr-1.5 text-center">VALID<br/>THRU</span>
                                <span className={`font-mono text-base font-semibold ${cardTier.text} ${embossClass}`}>{generateMockExpiryDate(user.name)}</span>
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-end">
                            <div>
                                <p className={`text-lg font-semibold ${cardTier.text} ${embossClass}`}>Equipo Sinapsis Corp</p>
                                <p className={`text-sm font-medium ${cardTier.subText} ${embossClass}`}>{segmentName}</p>
                                <p className={`text-xs ${cardTier.subText} ${embossClass} mt-1`}>Nivel de Bienestar: {cardTier.levelName}</p>
                            </div>
                             <div className="flex items-end gap-4">
                                <TreevuNetworkIcon className={`w-12 h-auto ${cardTier.text} opacity-70`} />
                                <span className="text-4xl">{cardTier.icon}</span>
                            </div>
                        </div>
                    </div>
                    {/* Back of card */}
                     <div className={`status-card-face status-card-back ${cardTier.class} !p-0 !justify-start shadow-lg`}>
                        <div className="w-full h-full flex flex-col">
                            <div className="magnetic-strip mt-6"></div>
                            <div className="px-4 mt-4">
                                <div className="w-full h-8 bg-white/90 flex justify-end items-center pr-2" style={{backgroundImage: "repeating-linear-gradient(90deg, #bbb, #bbb 1px, transparent 1px, transparent 5px)"}}>
                                    <p className="font-mono italic text-lg tracking-widest text-gray-800 bg-white px-2 rounded">
                                        {generateMockCvv(user.name)}
                                    </p>
                                </div>
                                <p className={`text-[8px] mt-1 ${cardTier.subText}`}>AUTHORIZED SIGNATURE - NOT VALID UNLESS SIGNED</p>
                            </div>
                            <div className="flex-grow flex flex-row justify-around items-stretch gap-2 py-2 px-4">
                                {/* KPIs */}
                                <div className={`flex-1 flex flex-col justify-center text-center px-1 py-1 bg-black/10 rounded-lg ${cardTier.text}`}>
                                    <p className={`text-[10px] font-semibold ${cardTier.subText} flex items-center justify-center gap-1`}>
                                        <ArrowTrendingDownIcon className="w-3 h-3"/> Riesgo Fuga
                                    </p>
                                    <p className="text-lg font-bold leading-tight">{dashboardData.talentFlightRisk}</p>
                                </div>
                                 <div className={`flex-1 flex flex-col justify-center text-center px-1 py-1 bg-black/10 rounded-lg ${cardTier.text}`}>
                                    <p className={`text-[10px] font-semibold ${cardTier.subText} flex items-center justify-center gap-1`}>
                                        <ArrowTrendingUpIcon className="w-3 h-3"/> ROI
                                    </p>
                                    <p className="text-lg font-bold leading-tight">{dashboardData.roiMultiplier.toFixed(1)}x</p>
                                </div>
                                 <div className={`flex-1 flex flex-col justify-center text-center px-1 py-1 bg-black/10 rounded-lg ${cardTier.text}`}>
                                    <p className={`text-[10px] font-semibold ${cardTier.subText} flex items-center justify-center gap-1`}>
                                        <UsersIcon className="w-3 h-3"/> Activación
                                    </p>
                                    <p className="text-lg font-bold leading-tight">{dashboardData.activationRate.toFixed(0)}%</p>
                                </div>
                            </div>
                             <p className={`text-[10px] ${cardTier.subText} text-right px-4 pb-2`}>business.treevu.pe</p>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
});

export default EmployerStatusCard;