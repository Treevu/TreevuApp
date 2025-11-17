import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
    BanknotesIcon, BookOpenIcon, CheckBadgeIcon, RocketLaunchIcon, CheckIcon, LockClosedIcon, ShieldCheckIcon, BuildingBlocksIcon, StarIcon, TrophyIcon
} from '@/components/ui/Icons';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';
import { useAppContext } from '@/contexts/AppContext';
import { TreevuLevel } from '@/types/common';
// FIX: Import User type to fix circular reference error.
import { type User } from '@/types/user';

interface Expedition {
  id: string;
  title: string;
  icon: React.FC<{className?: string}>;
  belt: 'Cinta Blanca' | 'Cinta Verde' | 'Cinta Marrón' | 'Cinta Negra';
  branch: 'Tronco Fundamental' | 'Senda del Alquimista Fiscal' | 'Senda del Ahorrador' | 'Senda del Inversor' | 'Senda del Mentor';
  description: string;
  mission: {
    description: string;
    reward: number;
    completionKey: 'hasFormalExpense' | 'hasGoal' | 'hasBudget' | 'hasThreeFormalExpenses' | 'hasGoalContribution' | 'hasHighFWI' | 'isMaxLevel' | 'isKudosSender';
  };
}

const expeditions: Expedition[] = [
    // --- Cinta Blanca: Tronco Fundamental ---
    {
        id: 'exp-formal-1',
        title: 'El Primer Sello Formal',
        icon: ShieldCheckIcon,
        belt: 'Cinta Blanca',
        branch: 'Tronco Fundamental',
        description: 'La formalidad es la piedra angular de tu alquimia financiera. Cada vez que pides una boleta o factura electrónica con tu DNI, conviertes un gasto simple en un activo que puede darte un tesoro de devolución de impuestos. ¡Es el hábito más poderoso que puedes construir!',
        mission: {
            description: 'Registra tu primer hallazgo formal (con boleta o factura).',
            reward: 30,
            completionKey: 'hasFormalExpense',
        },
    },
    {
        id: 'exp-goal-1',
        title: 'El Mapa del Tesoro',
        icon: BuildingBlocksIcon,
        belt: 'Cinta Blanca',
        branch: 'Tronco Fundamental',
        description: 'Un explorador sin un mapa del tesoro es solo un turista. Tus "Proyectos de Conquista" (metas) son ese mapa. Le dan un propósito a tu ahorro y convierten cada sol que guardas en un paso tangible hacia tus sueños.',
        mission: {
            description: 'Crea tu primer Proyecto de Conquista.',
            reward: 25,
            completionKey: 'hasGoal',
        },
    },
    {
        id: 'exp-budget-1',
        title: 'Las Fronteras del Reino',
        icon: BanknotesIcon,
        belt: 'Cinta Blanca',
        branch: 'Tronco Fundamental',
        description: 'Tu presupuesto no es una jaula, ¡es el muro de tu fortaleza! Establecer un límite mensual te da el poder de saber dónde estás parado, tomar decisiones conscientes y defender tu reino financiero de los gastos inesperados.',
        mission: {
            description: 'Establece tu primer presupuesto mensual.',
            reward: 25,
            completionKey: 'hasBudget',
        },
    },
    // --- Cinta Verde: Ramas de Especialización ---
    {
        id: 'exp-formal-3',
        title: 'La Senda del Alquimista',
        icon: ShieldCheckIcon,
        belt: 'Cinta Verde',
        branch: 'Senda del Alquimista Fiscal',
        description: 'Un solo acto de formalidad es bueno, pero la constancia es donde reside la verdadera magia. Al convertir la formalidad en un hábito, no solo acumulas potencial de devolución, sino que le envías una señal clara a tu cerebro de que estás en control de tu dinero.',
        mission: {
            description: 'Registra un total de 3 hallazgos formales.',
            reward: 50,
            completionKey: 'hasThreeFormalExpenses',
        },
    },
    {
        id: 'exp-saver-1',
        title: 'El Impulso del Ahorrador',
        icon: RocketLaunchIcon,
        belt: 'Cinta Verde',
        branch: 'Senda del Ahorrador',
        description: 'El primer aporte a un proyecto es el más importante. Es el momento en que tu meta deja de ser un sueño y se convierte en un plan en marcha. Celebra este primer paso, ¡es el que impulsa todo el viaje!',
        mission: {
            description: 'Realiza tu primer aporte a un Proyecto de Conquista.',
            reward: 40,
            completionKey: 'hasGoalContribution',
        },
    },
    // --- Cinta Marrón: Senda del Inversor ---
    {
        id: 'exp-investor-1',
        title: 'La Fórmula Maestra',
        icon: CheckBadgeIcon,
        belt: 'Cinta Marrón',
        branch: 'Senda del Inversor',
        description: 'Alcanzar un FWI superior a 80 te convierte en un verdadero alquimista financiero. Demuestra que has encontrado el balance perfecto entre tus hábitos de gasto, tu vida personal y tu crecimiento profesional.',
        mission: {
            description: 'Alcanza un Índice de Bienestar Financiero (FWI) de 80.',
            reward: 75,
            completionKey: 'hasHighFWI',
        }
    },
    // --- Cinta Negra: Senda del Mentor ---
    {
        id: 'exp-mentor-1',
        title: 'Guardián del Bosque',
        icon: TrophyIcon,
        belt: 'Cinta Negra',
        branch: 'Senda del Mentor',
        description: 'Un verdadero maestro no solo crece, sino que ayuda a crecer a los demás. Reconocer el esfuerzo de tu equipo es la máxima expresión de liderazgo y cultura.',
        mission: {
            description: 'Otorga 10 kudos (reconocimientos) a tus compañeros.',
            reward: 100,
            completionKey: 'isKudosSender',
        }
    }
];

const ExpeditionDetailsModal: React.FC<{ expedition: Expedition; onClose: () => void; }> = ({ expedition, onClose }) => {
    return (
        <ModalWrapper title={expedition.title} onClose={onClose}>
            <div className="text-sm text-on-surface-secondary -mt-4 space-y-4">
                <p>{expedition.description}</p>
                <div className="bg-background p-3 rounded-xl border border-dashed border-primary/50">
                    <h4 className="font-bold text-on-surface mb-2">Tu Misión de Expedición:</h4>
                    <p className="font-semibold text-on-surface">{expedition.mission.description}</p>
                    <p className="text-xs text-primary mt-1">(La app detectará y te recompensará automáticamente cuando la completes)</p>
                </div>
            </div>
            <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end">
                <button
                    onClick={onClose}
                    className="w-full px-6 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90"
                >
                    ¡Entendido!
                </button>
            </div>
        </ModalWrapper>
    );
};

const LearnView: React.FC = () => {
    // Usuario estático
    const user = {
        id: 'static-user-id',
        name: 'Usuario Demo',
        completedLessons: ['lesson-1', 'lesson-2']
    };
    // Funciones mock
    const completeLesson = (lessonId: string) => {
        console.log('completeLesson called with:', lessonId);
    };
    const addTreevus = (amount: number) => {
        console.log('addTreevus called with:', amount);
    };
    
    // Función mock para setAlert
    const setAlert = (alertData: any) => {
        console.log('setAlert called with:', alertData);
    };
    
    const { state: appState } = useAppContext();
    const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);

    const completedLessons = user?.completedLessons || [];

    const completionChecks = useMemo(() => ({
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        hasFormalExpense: (state: typeof appState, user: User | null) => state.expenses.some(e => e.esFormal),
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        hasGoal: (state: typeof appState, user: User | null) => state.goals.length > 0,
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        hasBudget: (state: typeof appState, user: User | null) => state.budget !== null && state.budget > 0,
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        hasThreeFormalExpenses: (state: typeof appState, user: User | null) => state.expenses.filter(e => e.esFormal).length >= 3,
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        hasGoalContribution: (state: typeof appState, user: User | null) => state.goals.some(g => g.currentAmount > 0),
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        hasHighFWI: (state: typeof appState, user: User | null) => state.fwi_v2 >= 80,
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        isMaxLevel: (state: typeof appState, user: User | null) => user!.level === TreevuLevel.Bosque,
        // FIX: Replaced 'typeof user' with 'User | null' to prevent circular type reference.
        isKudosSender: (state: typeof appState, user: User | null) => (user?.kudosSent || 0) >= 10,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    useEffect(() => {
        if (!user) return;
        expeditions.forEach(exp => {
            if (!completedLessons.includes(exp.id)) {
                // Lógica simplificada - siempre true para demo
                const isCompleted = true;
                if (isCompleted) {
                    completeLesson(exp.id);
                    addTreevus(exp.mission.reward);
                    setAlert({
                        message: `¡Misión "<strong class="text-primary">${exp.title}</strong>" completada! Has cosechado <strong>+${exp.mission.reward} treevüs</strong> 🌿`,
                        type: 'success'
                    });
                }
            }
        });
    }, [appState, user, completedLessons, completeLesson, addTreevus, setAlert, completionChecks]);

    const expeditionsByBranch = useMemo(() => {
        return expeditions.reduce((acc, exp) => {
            if (!acc[exp.branch]) {
                acc[exp.branch] = [];
            }
            acc[exp.branch].push(exp);
            return acc;
        }, {} as Record<Expedition['branch'], Expedition[]>);
    }, []);

    const isCintaBlancaComplete = useMemo(() => {
        return expeditionsByBranch['Tronco Fundamental']?.every(exp => completedLessons.includes(exp.id));
    }, [completedLessons, expeditionsByBranch]);
    
    const isCintaVerdeComplete = useMemo(() => {
        return expeditionsByBranch['Senda del Alquimista Fiscal']?.every(exp => completedLessons.includes(exp.id)) &&
               expeditionsByBranch['Senda del Ahorrador']?.every(exp => completedLessons.includes(exp.id));
    }, [completedLessons, expeditionsByBranch]);

    const isCintaMarronComplete = useMemo(() => {
        return expeditionsByBranch['Senda del Inversor']?.every(exp => completedLessons.includes(exp.id));
    }, [completedLessons, expeditionsByBranch]);


    const renderBranch = (branchName: Expedition['branch'], isUnlocked: boolean) => {
        const branchExpeditions = expeditionsByBranch[branchName];
        if (!branchExpeditions) return null;

        return (
            <div key={branchName} className="relative pl-8">
                <div className="absolute top-0 left-[3px] w-0.5 h-full bg-active-surface" aria-hidden="true"></div>
                
                <div className="space-y-6">
                    {branchExpeditions.map((expedition) => {
                        const isCompleted = completedLessons.includes(expedition.id);
                        const Icon = expedition.icon;
                        
                        return (
                             <div key={expedition.id} className="relative animate-staggered-fade-in-slide-up">
                                <div className={`absolute top-1/2 -translate-y-1/2 -left-[30px] w-5 h-5 bg-background border-2 rounded-full z-10 transition-colors ${isCompleted ? 'border-primary' : isUnlocked ? 'border-primary/50' : 'border-active-surface'}`}>
                                    <div className={`w-full h-full rounded-full transition-colors ${isCompleted ? 'bg-primary' : isUnlocked ? 'bg-primary/50 animate-pulse' : 'bg-active-surface'}`}></div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isUnlocked) {
                                            setSelectedExpedition(expedition);
                                        }
                                    }}
                                    disabled={!isUnlocked}
                                    className={`w-full p-3 bg-surface rounded-2xl border text-left flex items-center gap-3 transition-all duration-300 ${isUnlocked ? 'hover:bg-active-surface cursor-pointer' : 'cursor-not-allowed'} ${isCompleted ? 'border-transparent opacity-60' : 'border-active-surface/80'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted ? 'bg-background' : 'bg-active-surface'}`}>
                                        {isCompleted ? <CheckIcon className="w-6 h-6 text-primary"/> : !isUnlocked ? <LockClosedIcon className="w-6 h-6 text-on-surface-secondary"/> : <Icon className="w-6 h-6 text-primary" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold text-on-surface ${isCompleted ? 'line-through text-on-surface-secondary' : ''}`}>{expedition.title}</h3>
                                    </div>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                 <h2 className="text-xl font-bold text-on-surface">Senda del Guardián del Bosque</h2>
                 <p className="text-sm text-on-surface-secondary mt-1">Completa expediciones, demuestra tu maestría y cosecha grandes recompensas.</p>
            </div>
            
            {/* Cinta Blanca */}
            <div className="space-y-4">
                <h3 className="font-bold text-primary">CINTA BLANCA: INICIACIÓN</h3>
                {renderBranch('Tronco Fundamental', true)}
            </div>

            {/* Cinta Verde */}
            <div className="space-y-4">
                <h3 className={`font-bold transition-colors ${isCintaBlancaComplete ? 'text-primary' : 'text-on-surface-secondary'}`}>CINTA VERDE: FUNDAMENTOS</h3>
                {!isCintaBlancaComplete && (
                    <div className="flex items-center gap-2 p-2 text-xs text-on-surface-secondary bg-background rounded-lg">
                        <LockClosedIcon className="w-4 h-4 flex-shrink-0" />
                        <span>Completa todas las misiones de la Cinta Blanca para desbloquear estas sendas.</span>
                    </div>
                )}
                <div className="space-y-6">
                    {renderBranch('Senda del Alquimista Fiscal', isCintaBlancaComplete)}
                    {renderBranch('Senda del Ahorrador', isCintaBlancaComplete)}
                </div>
            </div>

             {/* Cinta Marrón */}
            <div className="space-y-4">
                <h3 className={`font-bold transition-colors ${isCintaVerdeComplete ? 'text-primary' : 'text-on-surface-secondary'}`}>CINTA MARRÓN: ESTRATEGIA</h3>
                {!isCintaVerdeComplete && (
                    <div className="flex items-center gap-2 p-2 text-xs text-on-surface-secondary bg-background rounded-lg">
                        <LockClosedIcon className="w-4 h-4 flex-shrink-0" />
                        <span>Completa las misiones de la Cinta Verde para desbloquear esta senda.</span>
                    </div>
                )}
                <div className="space-y-6">
                    {renderBranch('Senda del Inversor', isCintaVerdeComplete)}
                </div>
            </div>

            {/* Cinta Negra */}
            <div className="space-y-4">
                <h3 className={`font-bold transition-colors ${isCintaMarronComplete ? 'text-primary' : 'text-on-surface-secondary'}`}>CINTA NEGRA: MENTORÍA</h3>
                {!isCintaMarronComplete && (
                     <div className="flex items-center gap-2 p-2 text-xs text-on-surface-secondary bg-background rounded-lg">
                        <LockClosedIcon className="w-4 h-4 flex-shrink-0" />
                        <span>Completa las misiones de la Cinta Marrón para alcanzar la maestría.</span>
                    </div>
                )}
                <div className="space-y-6">
                    {renderBranch('Senda del Mentor', isCintaMarronComplete)}
                </div>
            </div>
            
            {selectedExpedition && (
                <ExpeditionDetailsModal
                    expedition={selectedExpedition}
                    onClose={() => setSelectedExpedition(null)}
                />
            )}
        </div>
    );
};

export default React.memo(LearnView);
