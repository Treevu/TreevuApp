import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TreevuLevel } from '../types/common';
import { CheckIcon, BroteIcon, PlantonIcon, ArbustoIcon, RobleIcon, BosqueIcon, GiftIcon } from './Icons';
import { levelData } from '../services/gamificationService';
import ModalWrapper from './ModalWrapper';
import TreevuLogoText from './TreevuLogoText';

const allLevelsData = Object.values(levelData);

const levelIconComponents: Record<TreevuLevel, React.FC<{className?: string}>> = {
    [TreevuLevel.Brote]: BroteIcon,
    [TreevuLevel.Plantón]: PlantonIcon,
    [TreevuLevel.Arbusto]: ArbustoIcon,
    [TreevuLevel.Roble]: RobleIcon,
    [TreevuLevel.Bosque]: BosqueIcon,
};

interface GamificationLevelsModalProps {
    onClose: () => void;
}

const GamificationLevelsModal: React.FC<GamificationLevelsModalProps> = ({ onClose }) => {
    const { user } = useAuth();
    const currentUserLevel = user?.level || TreevuLevel.Brote;
    const title = <>Tu Senda en <TreevuLogoText /></>;

    return (
        <ModalWrapper title={title} onClose={onClose}>
            <div className="-mt-5">
                <p className="text-sm text-center text-on-surface-secondary">
                    A medida que registras hallazgos y mejoras tu formalidad, avanzas en tu senda y desbloqueas nuevos niveles.
                </p>
                <div className="mt-4 space-y-4">
                    {allLevelsData.map((levelInfo) => {
                        const isCompleted = levelInfo.level < currentUserLevel;
                        const isCurrent = levelInfo.level === currentUserLevel;
                        const isFuture = levelInfo.level > currentUserLevel;
                        const LevelIcon = levelIconComponents[levelInfo.level];

                        return (
                            <div
                                key={levelInfo.level}
                                className={`p-3 rounded-2xl flex items-start space-x-4 transition-all duration-300
                                    ${isCurrent ? 'bg-background ring-2 ring-primary' : 'bg-background'}
                                    ${isFuture ? 'opacity-50' : 'opacity-100'}
                                `}
                            >
                                <div className={`w-12 h-12 flex items-center justify-center flex-shrink-0 rounded-lg ${isCurrent ? 'text-primary' : 'text-on-surface-secondary'}`}>
                                    <LevelIcon className="w-10 h-10" />
                                </div>
                                <div className="flex-1">
                                    <h3 className={`font-bold ${isCurrent ? 'text-primary' : 'text-on-surface'}`}>{levelInfo.name}</h3>
                                    <p className="text-xs text-on-surface-secondary mt-0.5">{levelInfo.description}</p>
                                    <div className="mt-2 space-y-1">
                                        {levelInfo.requirements.map((req, index) => (
                                            <div key={index} className={`flex items-center text-xs ${isCompleted ? 'text-on-surface-secondary line-through' : 'text-on-surface-secondary'}`}>
                                                <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${isCompleted ? 'bg-primary' : 'border border-active-surface'}`}>
                                                    {isCompleted && <CheckIcon className="w-2.5 h-2.5 text-primary-dark" />}
                                                </div>
                                                <span>{req}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* NEW BENEFITS SECTION */}
                                    {levelInfo.benefits && levelInfo.benefits.length > 0 && (
                                        <div className="mt-3 pt-2 border-t border-dashed border-active-surface">
                                             <h4 className="text-xs font-bold text-on-surface mb-1">Beneficios Desbloqueados:</h4>
                                             <div className="space-y-1">
                                                {levelInfo.benefits.map((benefit, index) => (
                                                    <div key={index} className={`flex items-center text-xs ${isCompleted || isCurrent ? 'text-on-surface' : 'text-on-surface-secondary'}`}>
                                                        <GiftIcon className={`w-3.5 h-3.5 mr-2 flex-shrink-0 ${isCompleted || isCurrent ? 'text-primary' : 'text-on-surface-secondary'}`} />
                                                        <span className={isCompleted || isCurrent ? 'font-semibold' : ''}>{benefit}</span>
                                                    </div>
                                                ))}
                                             </div>
                                        </div>
                                    )}
                                    {/* END NEW SECTION */}

                                </div>
                            </div>
                        );
                    })}
                </div>
                 <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 transition-opacity"
                    >
                        ¡Entendido!
                    </button>
                </div>
            </div>
        </ModalWrapper>
    );
};

export default GamificationLevelsModal;