import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { GiftIcon, LockClosedIcon, ChevronDownIcon, TreevuCoinIcon } from './Icons';
import TreevuLogoText from './TreevuLogoText';
import RewardConfirmationModal from './RewardConfirmationModal';
import { levelData } from '../services/gamificationService';

import { TreevuLevel } from '../types/common';
import { Reward } from '../types/user';

// --- MENÚ INICIAL DEL PILOTO ---

// Recompensa Estrella
const companyRewards: Reward[] = [
     { id: '1', title: 'Cosecha tu Descanso', description: 'Tu esfuerzo merece una pausa. Usa tus treevüs para un día libre de bienestar y recargar energías.', costInTreevus: 7000, icon: '🧘', category: 'Bienestar', minLevel: TreevuLevel.Bosque },
];

// Recompensas Aspiracionales y de Victoria Rápida
const globalRewards: Reward[] = [
    { id: '2', title: 'Cultiva tu Mente (Platzi)', description: 'Invierte en ti. Accede a un mes de cursos top en tecnología y desarrollo profesional.', costInTreevus: 3500, icon: '🎓', category: 'Educación' },
    { id: '3', title: 'Pausa Energizante (Starbucks)', description: 'El sabor de tu esfuerzo. Disfruta de un vale de S/ 50 en tu café o bebida favorita.', costInTreevus: 2000, icon: '☕', category: 'Ocio' },
    { id: '5', title: 'Boleto a la Gran Pantalla', description: 'Desconecta y sumérgete en una nueva historia. Válido para una entrada 2D en Cineplanet o Cinemark.', costInTreevus: 1500, icon: '🎬', category: 'Ocio' },
    { id: '4', title: 'Siembra una Sonrisa', description: 'Tu bienestar también puede ser el de otros. Convierte tus treevüs en una donación a "Juguete Pendiente".', costInTreevus: 800, icon: '💖', category: 'Impacto Social' },
];


const RewardCard: React.FC<{ reward: Reward; onRedeem: (reward: Reward) => void }> = ({ reward, onRedeem }) => {
    const { user } = useAuth();
    if (!user) return null;

    const canAfford = user.treevus >= reward.costInTreevus;
    const hasLevel = user.level >= (reward.minLevel || TreevuLevel.Brote);
    const canRedeem = canAfford && hasLevel;
    const missingAmount = reward.costInTreevus - user.treevus;
    
    return (
        <div className={`relative bg-surface rounded-2xl p-4 flex flex-col justify-between border border-active-surface/50 transition-all duration-300 ${!canRedeem ? 'opacity-60 saturate-50' : ''}`}>
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
            <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-1 font-bold">
                    <span className="text-primary">{reward.costInTreevus.toLocaleString('es-PE')}</span>
                    <TreevuCoinIcon className="w-5 h-5 text-primary" level={user.level} />
                </div>
                {canRedeem ? (
                    <button
                        onClick={() => onRedeem(reward)}
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
        </div>
    );
};


const RewardsView: React.FC = () => {
    const { user, redeemTreevusForReward } = useAuth();
    const [isExplanationVisible, setIsExplanationVisible] = useState(false);
    const [rewardToConfirm, setRewardToConfirm] = useState<Reward | null>(null);
    
    if (!user) return null;

    const handleConfirmRedemption = (reward: Reward) => {
        redeemTreevusForReward(reward);
    };

    return (
        <>
            <div className="space-y-4 animate-grow-and-fade-in">
                <div className="bg-surface rounded-2xl p-4">
                     <div className="flex items-center gap-2 mb-1">
                        <TreevuCoinIcon className="w-5 h-5 text-primary" level={user.level} />
                        <h2 className="text-lg font-bold text-on-surface">
                            Tu Cosecha: {user.treevus.toLocaleString('es-PE')}
                        </h2>
                    </div>

                    <p className="text-sm text-on-surface-secondary">
                        Usa tus monedas para canjear beneficios.
                        <button 
                            onClick={() => setIsExplanationVisible(!isExplanationVisible)} 
                            className="ml-1.5 font-bold text-primary inline-flex items-center gap-1"
                            aria-expanded={isExplanationVisible}
                        >
                            <span>¿Qué son?</span>
                            <ChevronDownIcon className={`w-4 h-4 transition-transform ${isExplanationVisible ? 'rotate-180' : ''}`} />
                        </button>
                    </p>
                    
                    <div className={`grid transition-all duration-300 ease-in-out ${isExplanationVisible ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr] mt-0'}`}>
                        <div className="overflow-hidden">
                             <div className="text-sm text-on-surface-secondary bg-background p-3 rounded-lg">
                                Tus monedas <TreevuLogoText isTreevus /> son los tesoros que cosechas en tu aventura financiera. Cada buen hábito es una semilla que se convierte en una gran recompensa. Ganas al registrar gastos (¡más si son formales!), subir de nivel y mantener rachas.
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-on-surface-secondary uppercase tracking-wider mb-2">Exclusivos de tu Empresa</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {companyRewards.map(reward => <RewardCard key={reward.id} reward={reward} onRedeem={setRewardToConfirm} />)}
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-bold text-on-surface-secondary uppercase tracking-wider mt-6 mb-2">Catálogo Global</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {globalRewards.map(reward => <RewardCard key={reward.id} reward={reward} onRedeem={setRewardToConfirm} />)}
                    </div>
                </div>
            </div>
            
            {rewardToConfirm && (
                <RewardConfirmationModal
                    reward={rewardToConfirm}
                    userTreevus={user.treevus}
                    onClose={() => setRewardToConfirm(null)}
                    onConfirm={handleConfirmRedemption}
                />
            )}
        </>
    );
};

export default RewardsView;