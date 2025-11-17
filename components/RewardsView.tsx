import React, { useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { LockClosedIcon, UsersIcon, ShareIcon, TreevuCoinIcon, CheckBadgeIcon } from './Icons';
import { levelData } from '../services/gamificationService';
import { TreevuLevel } from '../types/common';
import { Reward } from '../types/user';
import Logo from './Logo';

// --- REWARDS DATA ---
const companyRewards: Reward[] = [
    { id: '1', title: 'Cosecha tu Descanso', description: 'Tu esfuerzo merece una pausa. Usa tus treevüs para un día libre de bienestar y recargar energías.', costInTreevus: 7000, icon: '🧘', category: 'Bienestar', minLevel: TreevuLevel.Bosque, isCompanyExclusive: true },
    { id: 'corp-2', title: 'Bono para Setup Remoto', description: 'Mejora tu espacio de trabajo. Canjea un bono de S/ 200 para equipamiento de oficina en casa.', costInTreevus: 5000, icon: '🖥️', category: 'Bienestar', minLevel: TreevuLevel.Roble, isCompanyExclusive: true },
    { id: 'corp-3', title: 'Suscripción a App de Meditación', description: 'Invierte en tu paz mental. Un año de acceso premium a Headspace o Calm.', costInTreevus: 4000, icon: '🧠', category: 'Bienestar', minLevel: TreevuLevel.Arbusto, isCompanyExclusive: true },
];

const globalRewards: Reward[] = [
    { id: 'gr-6', title: 'Experiencia Culinaria', description: 'Disfruta de una cena para dos en un restaurante de autor. Saborea la gastronomía local de alto nivel.', costInTreevus: 6000, icon: '🍽️', category: 'Ocio', minLevel: TreevuLevel.Roble },
    { id: 'gr-11', title: 'Crédito para tu Próximo Vuelo', description: 'Un vale de S/ 100 para usar en tu próxima compra de pasajes en aerolíneas nacionales.', costInTreevus: 5500, icon: '✈️', category: 'Viajes', minLevel: TreevuLevel.Roble },
    { id: 'gr-10', title: 'Asesoría Financiera Personal', description: 'Una sesión de 1 hora con un planificador financiero certificado para optimizar tu estrategia.', costInTreevus: 4500, icon: '📈', category: 'Finanzas', minLevel: TreevuLevel.Arbusto },
    { id: '2', title: 'Cultiva tu Mente (Platzi)', description: 'Invierte en ti. Accede a un mes de cursos top en tecnología y desarrollo profesional.', costInTreevus: 3500, icon: '🎓', category: 'Educación', minLevel: TreevuLevel.Arbusto },
    { id: 'gr-7', title: 'Pase a Gimnasio (SmartFit)', description: 'Activa tu cuerpo y mente. Canjea un pase mensual para mantenerte en forma y saludable.', costInTreevus: 3000, icon: '💪', category: 'Salud', minLevel: TreevuLevel.Plantón },
    { id: 'gr-8', title: 'Suscripción Rappi Prime', description: 'Recibe tus pedidos sin costo de envío por un mes. Comodidad a la puerta de tu casa.', costInTreevus: 2500, icon: '🛵', category: 'Otros', minLevel: TreevuLevel.Plantón },
    { id: '3', title: 'Pausa Energizante (Starbucks)', description: 'El sabor de tu esfuerzo. Disfruta de un vale de S/ 50 en tu café o bebida favorita.', costInTreevus: 2000, icon: '☕', category: 'Ocio', minLevel: TreevuLevel.Brote },
    { id: 'gr-9', title: 'Vale de Supermercado', description: 'Convierte tus treevüs en compras para el hogar. Válido por S/ 50 en Wong o Plaza Vea.', costInTreevus: 2000, icon: '🛒', category: 'Otros', minLevel: TreevuLevel.Brote },
    { id: '5', title: 'Boleto a la Gran Pantalla', description: 'Desconecta y sumérgete en una nueva historia. Válido para una entrada 2D en Cineplanet o Cinemark.', costInTreevus: 1500, icon: '🎬', category: 'Ocio', minLevel: TreevuLevel.Brote },
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
            <div className={`p-4 flex flex-col justify-between`}>
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
                            <button onClick={handleRedeemClick} className="px-4 py-1.5 text-sm font-bold rounded-full transition-colors bg-gradient-to-r from-accent to-accent-secondary text-primary-dark">Canjear</button>
                        ) : (
                            <div className="text-right">
                                <button disabled className="px-4 py-1.5 text-sm font-bold rounded-full transition-colors disabled:bg-active-surface disabled:text-on-surface-secondary disabled:cursor-not-allowed">Canjear</button>
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
            <div className="transition-all duration-500 ease-in-out overflow-hidden" style={{ maxHeight: isExpanded ? '300px' : '0px' }}>
                {isRedeemed ? (
                    <div className="p-4 border-t-2 border-primary/30 text-center space-y-3 animate-fade-in">
                        <CheckBadgeIcon className="w-16 h-16 text-primary mx-auto animate-grow-and-fade-in"/>
                        <h4 className="font-bold text-primary">¡Recompensa Desbloqueada!</h4>
                        <p className="text-xs text-on-surface-secondary">{getSuccessMessage()}</p>
                        <button onClick={handleCancelClick} className="w-full mt-2 bg-active-surface text-on-surface font-bold py-2 rounded-lg">Cerrar</button>
                    </div>
                ) : (
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
                            <button onClick={handleConfirmClick} className="px-5 py-2 text-sm font-bold text-primary-dark bg-gradient-to-r from-accent to-accent-secondary rounded-xl">Confirmar Canje</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const InviteAndEarn: React.FC = () => {
    const { user } = useAuth();
    const { setAlert } = useAlert();
    const personalCode = useMemo(() => {
        if (!user) return '';
        const nameParts = user.name.split(' ');
        const firstName = nameParts[0].toUpperCase();
        const shortId = user.id.slice(-4).toUpperCase();
        return `${firstName}-${shortId}`;
    }, [user]);
    const handleCopy = () => {
        if (!personalCode) return;
        navigator.clipboard.writeText(personalCode).then(() => {
            setAlert({ message: '¡Código de referido copiado!', type: 'success' });
        });
    };
    const handleShare = async () => {
        const shareData = {
            title: '¡Únete a treevü!',
            text: `¡Ey! Te invito a unirte a treevü, la app de bienestar financiero que nos premia por buenos hábitos. Usa mi código ${personalCode} al registrarte y ambos ganaremos 500 treevüs.`,
            url: window.location.href,
        };
        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(`${shareData.text} Descárgala aquí: ${shareData.url}`);
                setAlert({ message: '¡Enlace de invitación copiado al portapapeles!', type: 'success' });
            }
        } catch (error) {
            console.error('Error sharing:', error);
            if ((error as Error).name !== 'AbortError') {
              setAlert({ message: 'No se pudo compartir la invitación.', type: 'danger' });
            }
        }
    };
    return (
        <div className="bg-surface rounded-2xl p-4 border-2 border-dashed border-accent/50 text-center">
            <UsersIcon className="w-10 h-10 text-accent mx-auto mb-2" />
            <h3 className="font-bold text-lg text-on-surface">Invita y Gana Recompensas</h3>
            <p className="text-sm text-on-surface-secondary mt-1">
                Por cada amigo que se una usando tu código, ¡ambos recibirán un bono de <strong className="text-accent">500 treevüs</strong>!
            </p>

            <div className="mt-4 flex justify-center">
                <div className="flex items-center gap-2 bg-background p-2 rounded-lg border border-dashed border-active-surface">
                    <span className="font-mono font-bold text-lg text-on-surface">{personalCode}</span>
                    <button onClick={handleCopy} className="bg-active-surface text-on-surface font-bold text-xs px-3 py-1.5 rounded-md hover:bg-background">Copiar</button>
                </div>
            </div>

            <button onClick={handleShare} className="mt-4 bg-accent text-accent-dark font-bold py-2 px-6 rounded-xl flex items-center justify-center gap-2 mx-auto">
                <ShareIcon className="w-5 h-5" />
                Compartir Código
            </button>
        </div>
    );
};

const RewardsView: React.FC = () => {
    const { user, redeemTreevusForReward } = useAuth();

    if (!user) return null;

    const handleConfirmRedemption = (reward: Reward) => {
        redeemTreevusForReward(reward);
    };
    
    const allRewards = useMemo(() => {
        const rewards = user.companyId ? [...companyRewards, ...globalRewards] : [...globalRewards];
        return rewards.sort((a, b) => a.costInTreevus - b.costInTreevus);
    }, [user.companyId]);

    const rewardsByLevel = useMemo(() => {
        const grouped = allRewards.reduce((acc, reward) => {
            const level = reward.minLevel || TreevuLevel.Brote;
            if (!acc[level]) acc[level] = [];
            acc[level].push(reward);
            return acc;
        }, {} as Record<TreevuLevel, Reward[]>);
        return grouped;
    }, [allRewards]);

    const levelOrder = [TreevuLevel.Brote, TreevuLevel.Plantón, TreevuLevel.Arbusto, TreevuLevel.Roble, TreevuLevel.Bosque];

    return (
        <div className="space-y-4 animate-grow-and-fade-in">
             <div className="bg-gradient-to-r from-accent to-accent-secondary rounded-2xl p-5 text-white shadow-lg shadow-accent/30">
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
            <InviteAndEarn />
            
            <div className="space-y-6">
                {levelOrder.map(level => {
                    const rewardsForLevel = rewardsByLevel[level];
                    if (!rewardsForLevel || rewardsForLevel.length === 0) return null;

                    const levelInfo = levelData[level];
                    const isUnlocked = user.level >= level;

                    return (
                        <section key={level}>
                            <h2 className="text-xl font-bold mb-3 flex items-center gap-3">
                                <span className="text-3xl">{levelInfo.icon}</span>
                                <div>
                                    <span className="block">{levelInfo.name}</span>
                                    {!isUnlocked && <span className="text-xs font-semibold text-warning flex items-center gap-1"><LockClosedIcon className="w-3 h-3"/> Bloqueado</span>}
                                </div>
                            </h2>
                            <div className={`grid grid-cols-1 md:grid-cols-2 gap-4`}>
                                {rewardsForLevel.map(reward => 
                                    <RewardCard key={reward.id} reward={reward} onConfirmRedemption={handleConfirmRedemption} />
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </div>
    );
};

export default RewardsView;