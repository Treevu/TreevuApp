import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GiftIcon, LockClosedIcon, StarIcon, HeartIcon, AcademicCapIcon, TicketIcon, TreevuCoinIcon, CheckBadgeIcon } from './Icons';
import { levelData } from '../services/gamificationService';
import { TreevuLevel } from '../types/common';
import { Reward } from '../types/user';
import Logo from './Logo';
import SubNavBar from './SubNavBar';

// --- MENÚ INICIAL DEL PILOTO ---

// Recompensa Estrella
const companyRewards: Reward[] = [
     { id: '1', title: 'Cosecha tu Descanso', description: 'Tu esfuerzo merece una pausa. Usa tus treevüs para un día libre de bienestar y recargar energías.', costInTreevus: 7000, icon: '🧘', category: 'Bienestar', minLevel: TreevuLevel.Bosque, isCompanyExclusive: true },
     { id: 'corp-2', title: 'Bono para Setup Remoto', description: 'Mejora tu espacio de trabajo. Canjea un bono de S/ 200 para equipamiento de oficina en casa.', costInTreevus: 5000, icon: '🖥️', category: 'Bienestar', isCompanyExclusive: true },
     { id: 'corp-3', title: 'Suscripción a App de Meditación', description: 'Invierte en tu paz mental. Un año de acceso premium a Headspace o Calm.', costInTreevus: 4000, icon: '🧠', category: 'Bienestar', isCompanyExclusive: true },
];

// Recompensas Aspiracionales y de Victoria Rápida (CATÁLOGO AMPLIADO)
const globalRewards: Reward[] = [
    // High-value aspirational
    { id: 'gr-6', title: 'Experiencia Culinaria', description: 'Disfruta de una cena para dos en un restaurante de autor. Saborea la gastronomía local de alto nivel.', costInTreevus: 6000, icon: '🍽️', category: 'Ocio' },
    
    // Education & Wellness
    { id: '2', title: 'Cultiva tu Mente (Platzi)', description: 'Invierte en ti. Accede a un mes de cursos top en tecnología y desarrollo profesional.', costInTreevus: 3500, icon: '🎓', category: 'Educación' },
    { id: 'gr-7', title: 'Pase a Gimnasio (SmartFit)', description: 'Activa tu cuerpo y mente. Canjea un pase mensual para mantenerte en forma y saludable.', costInTreevus: 3000, icon: '💪', category: 'Bienestar' },
    
    // Digital & Everyday
    { id: 'gr-8', title: 'Suscripción Rappi Prime', description: 'Recibe tus pedidos sin costo de envío por un mes. Comodidad a la puerta de tu casa.', costInTreevus: 2500, icon: '🛵', category: 'Bienestar' },
    { id: '3', title: 'Pausa Energizante (Starbucks)', description: 'El sabor de tu esfuerzo. Disfruta de un vale de S/ 50 en tu café o bebida favorita.', costInTreevus: 2000, icon: '☕', category: 'Ocio' },
    { id: 'gr-9', title: 'Vale de Supermercado', description: 'Convierte tus treevüs en compras para el hogar. Válido por S/ 50 en Wong o Plaza Vea.', costInTreevus: 2000, icon: '🛒', category: 'Bienestar' },

    // Entertainment & Social
    { id: '5', title: 'Boleto a la Gran Pantalla', description: 'Desconecta y sumérgete en una nueva historia. Válido para una entrada 2D en Cineplanet o Cinemark.', costInTreevus: 1500, icon: '🎬', category: 'Ocio' },
    { id: '4', title: 'Siembra una Sonrisa', description: 'Tu bienestar también puede ser el de otros. Convierte tus treevüs en una donación a "Juguete Pendiente".', costInTreevus: 800, icon: '💖', category: 'Impacto Social' },
];


const RewardCard: React.FC<{ reward: Reward; onConfirmRedemption: (reward: Reward) => void }> = ({ reward, onConfirmRedemption }) => {
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isRedeemed, setIsRedeemed] = useState(false);

    if (!user) return null;

    const canAfford = user.treevus >= reward.costInTreevus;
    const hasLevel = user.level >= (reward.minLevel || TreevuLevel.Brote);
    const canRedeem = canAfford && hasLevel;
    const missingAmount = reward.costInTreevus - user.treevus;
    const newBalance = user.treevus - reward.costInTreevus;

    const handleRedeemClick = () => {
        if (!canRedeem) return;
        setIsExpanded(true);
    }
    
    const handleConfirmClick = () => {
        if (navigator.vibrate) navigator.vibrate(50);
        onConfirmRedemption(reward);
        setIsRedeemed(true);
    }

    const handleCancelClick = () => {
        setIsExpanded(false);
        // Reset redeemed state after a short delay to allow for the collapse animation
        setTimeout(() => setIsRedeemed(false), 500);
    }
    
    const getSuccessMessage = () => {
        switch (reward.category) {
            case 'Bienestar': return "Hemos notificado a RRHH. Pronto recibirás un correo con los detalles. ¡Disfrútalo!";
            case 'Educación':
            case 'Ocio': return "Recibirás un correo con tu voucher. También lo encontrarás en 'Mis Beneficios' en tu perfil.";
            case 'Impacto Social': return "¡Gracias por tu generosidad! Hemos procesado tu donación. Has convertido tu esfuerzo en una sonrisa.";
            default: return "Tu beneficio ha sido procesado. Recibirás más detalles por correo electrónico.";
        }
    };
    
    return (
        <div className={`bg-surface rounded-2xl border transition-all duration-300 relative overflow-hidden ${!canRedeem ? 'opacity-60 saturate-50' : ''} ${isExpanded ? 'shadow-lg ring-2 ring-primary' : 'border-active-surface/50'}`}>
            {reward.isCompanyExclusive && (
                <div className="absolute top-0 left-0 w-full bg-primary/20 text-primary font-bold text-xs py-1 px-3 flex items-center justify-between z-10">
                    <span>EXCLUSIVO EMPRESA</span>
                    <Logo src={user.branding?.logoUrl} className="w-4 h-4" />
                </div>
            )}
            <div className={`p-4 flex flex-col justify-between ${reward.isCompanyExclusive ? 'pt-10' : ''}`}>
                {reward.minLevel && !hasLevel && (
                    <div className="absolute top-2 right-2 text-xs font-bold text-on-surface bg-surface px-2 py-1 rounded-full border border-active-surface/80 flex items-center gap-1 z-10">
                        <LockClosedIcon className="w-3 h-3"/>
                        <span>Exclusivo: Nivel {levelData[reward.minLevel].name}</span>
                    </div>
                )}
                <div>
                    <div className="flex items-start gap-4">
                        <span className="text-4xl">{reward.icon}</span>
                        <div>
                            <h3 className="font-bold text-on-surface text-base">{reward.title}</h3>
                            <p className="text-xs text-on-surface-secondary mt-1">{reward.description}</p>
                        </div>
                    </div>
                </div>
                {!isExpanded && (
                    <div className="mt-4 flex justify-between items-center">
                        <div className="flex items-center gap-1 font-bold">
                            <span className="text-primary">{reward.costInTreevus.toLocaleString('es-PE')}</span>
                            <TreevuCoinIcon className="w-5 h-5 text-primary" level={user.level} />
                        </div>
                        {canRedeem ? (
                            <button
                                onClick={handleRedeemClick}
                                className="px-4 py-1.5 text-sm font-bold rounded-full transition-colors bg-primary text-primary-dark"
                            >
                                Canjear
                            </button>
                        ) : (
                            <div className="text-right">
                                <button
                                    disabled
                                    className="px-4 py-1.5 text-sm font-bold rounded-full transition-colors disabled:bg-active-surface disabled:text-on-surface-secondary disabled:cursor-not-allowed"
                                >
                                    Canjear
                                </button>
                                {!canAfford ? (
                                <p className="text-xs text-yellow-400 mt-1">Te faltan {missingAmount.toLocaleString('es-PE')}</p>
                                ) : !hasLevel && (
                                <p className="text-xs text-yellow-400 mt-1">Requiere Nivel {levelData[reward.minLevel!].name}</p>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* --- EXPANDABLE CONTENT --- */}
            <div
                className="transition-all duration-500 ease-in-out overflow-hidden"
                style={{ maxHeight: isExpanded ? '300px' : '0px' }}
            >
                {isRedeemed ? (
                    // --- SUCCESS VIEW ---
                    <div className="p-4 border-t-2 border-primary/30 text-center space-y-3 animate-fade-in">
                        <CheckBadgeIcon className="w-16 h-16 text-primary mx-auto animate-grow-and-fade-in"/>
                        <h4 className="font-bold text-primary">¡Recompensa Desbloqueada!</h4>
                        <p className="text-xs text-on-surface-secondary">{getSuccessMessage()}</p>
                        <button
                            onClick={handleCancelClick}
                            className="w-full mt-2 bg-active-surface text-on-surface font-bold py-2 rounded-lg"
                        >
                            Cerrar
                        </button>
                    </div>
                ) : (
                    // --- CONFIRMATION VIEW ---
                    <div className="p-4 border-t border-active-surface/50 space-y-3 animate-fade-in">
                        <h4 className="font-bold text-on-surface text-center">Confirmar Canje</h4>
                        <div className="text-sm bg-background rounded-xl p-3 space-y-2 text-left">
                            <div className="flex justify-between">
                                <span className="text-on-surface-secondary">Tu Saldo Actual:</span>
                                <span className="font-semibold text-on-surface flex items-center">{user.treevus.toLocaleString('es-PE')} <TreevuCoinIcon className="w-4 h-4 ml-1 text-primary" level={user.level} /></span>
                            </div>
                            <div className="flex justify-between text-danger">
                                <span className="text-on-surface-secondary">Costo del Beneficio:</span>
                                <span className="font-semibold flex items-center">-{reward.costInTreevus.toLocaleString('es-PE')} <TreevuCoinIcon className="w-4 h-4 ml-1" level={user.level} /></span>
                            </div>
                            <div className="border-t border-active-surface/50 my-1"></div>
                            <div className="flex justify-between">
                                <span className="text-on-surface-secondary">Nuevo Saldo:</span>
                                <span className="font-bold text-primary flex items-center">{newBalance.toLocaleString('es-PE')} <TreevuCoinIcon className="w-4 h-4 ml-1" level={user.level} /></span>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-1">
                            <button onClick={handleCancelClick} className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl">Cancelar</button>
                            <button onClick={handleConfirmClick} className="px-5 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl">Confirmar Canje</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const RewardsView: React.FC = () => {
    const { user, redeemTreevusForReward } = useAuth();
    type RewardCategoryFilter = 'all' | Reward['category'];
    const [activeFilter, setActiveFilter] = useState<RewardCategoryFilter>('all');
    
    if (!user) return null;

    const handleConfirmRedemption = (reward: Reward) => {
        redeemTreevusForReward(reward);
    };

    const subTabs = [
        { id: 'all' as const, label: 'Todos', Icon: StarIcon },
        { id: 'Bienestar' as const, label: 'Bienestar', Icon: HeartIcon },
        { id: 'Educación' as const, label: 'Educación', Icon: AcademicCapIcon },
        { id: 'Ocio' as const, label: 'Ocio', Icon: TicketIcon },
    ];
    
    const filteredCompanyRewards = useMemo(() => {
        if (activeFilter === 'all') return companyRewards;
        return companyRewards.filter(r => r.category === activeFilter);
    }, [activeFilter]);
    
    const filteredGlobalRewards = useMemo(() => {
        if (activeFilter === 'all') return globalRewards;
        return globalRewards.filter(r => r.category === activeFilter);
    }, [activeFilter]);

    return (
        <>
            <div className="space-y-4 animate-grow-and-fade-in">
                 <div className="bg-gradient-to-br from-primary via-emerald-600 to-green-700 rounded-2xl p-5 text-white shadow-lg shadow-primary/30">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-sm font-semibold opacity-80">Tu Cosecha Actual</p>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-4xl font-black tracking-tighter">{user.treevus.toLocaleString('es-PE')}</span>
                                <TreevuCoinIcon className="w-7 h-7" level={user.level} />
                            </div>
                            <p className="text-xs opacity-80 mt-1">Disponibles para canjear en el mercado.</p>
                        </div>
                    </div>
                </div>

                <SubNavBar
                    tabs={subTabs}
                    activeTab={activeFilter}
                    onTabClick={(tab) => setActiveFilter(tab as RewardCategoryFilter)}
                />

                {filteredCompanyRewards.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-on-surface-secondary uppercase tracking-wider mb-2">Exclusivos de tu Empresa</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredCompanyRewards.map(reward => <RewardCard key={reward.id} reward={reward} onConfirmRedemption={handleConfirmRedemption} />)}
                        </div>
                    </div>
                )}

                {filteredGlobalRewards.length > 0 && (
                    <div>
                        <h3 className="text-sm font-bold text-on-surface-secondary uppercase tracking-wider mt-6 mb-2">Catálogo Global</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredGlobalRewards.map(reward => <RewardCard key={reward.id} reward={reward} onConfirmRedemption={handleConfirmRedemption} />)}
                        </div>
                    </div>
                )}

                {filteredCompanyRewards.length === 0 && filteredGlobalRewards.length === 0 && (
                     <div className="text-center py-12">
                        <p className="text-on-surface-secondary">No hay premios disponibles en esta categoría.</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default RewardsView;
