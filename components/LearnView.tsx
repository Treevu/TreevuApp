import React, { useState, useMemo, useEffect } from 'react';
import {
    BanknotesIcon, BookOpenIcon, CheckBadgeIcon, RocketLaunchIcon, CheckIcon, LockClosedIcon, ShieldCheckIcon, BuildingBlocksIcon, StarIcon, TrophyIcon, GhostIcon, GiftIcon
} from './Icons';
import ModalWrapper from './ModalWrapper';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { useAppContext } from '../contexts/AppContext';
import { TreevuLevel } from '../types/common';
import { type User } from '../types/user';
import SubNavBar from './SubNavBar';
import ArticleCard from './ArticleCard';
import { articles } from '../data/articles';
import { calculateTreevusForAction } from '../services/gamificationService';

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
    completionKey: 'hasFormalExpense' | 'hasGoal' | 'hasBudget' | 'hasThreeFormalExpenses' | 'hasGoalContribution' | 'hasHighFWI' | 'isKudosSender' | 'hasLowAhorroPerdido' | 'hasCompletedGoal' | 'hasReadAllArticles';
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
        id: 'exp-ghost-chaser',
        title: 'El Ojo del Halcón',
        icon: GhostIcon,
        belt: 'Cinta Verde',
        branch: 'Senda del Alquimista Fiscal',
        description: "A veces, el tesoro no está en lo que ganas, sino en lo que dejas de perder. Identificar y reducir tu 'Botín Fantasma' (ahorro perdido por gastos informales) es una habilidad de alquimista avanzado.",
        mission: {
            description: "Reduce tu 'Botín Fantasma' total por debajo de S/ 50.",
            reward: 60,
            completionKey: 'hasLowAhorroPerdido',
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
    {
        id: 'exp-goal-conqueror',
        title: 'Conquistador de Metas',
        icon: TrophyIcon,
        belt: 'Cinta Marrón',
        branch: 'Senda del Inversor',
        description: 'Un mapa no sirve de nada si no llegas al tesoro. Completar tu primer Proyecto de Conquista no es solo un logro financiero, es una prueba de tu disciplina y visión. ¡Celebra esta gran victoria!',
        mission: {
            description: 'Completa tu primer Proyecto de Conquista (alcanza el 100% de la meta).',
            reward: 150,
            completionKey: 'hasCompletedGoal',
        },
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
    },
    {
        id: 'exp-knowledge-beacon',
        title: 'Faro del Conocimiento',
        icon: BookOpenIcon,
        belt: 'Cinta Negra',
        branch: 'Senda del Mentor',
        description: 'Un verdadero maestro comparte su sabiduría. Al leer todos los pergaminos de la biblioteca, no solo te fortaleces tú, sino que te conviertes en una fuente de conocimiento para tu escuadrón.',
        mission: {
            description: 'Lee todos los pergaminos disponibles en la Biblioteca.',
            reward: 120,
            completionKey: 'hasReadAllArticles',
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

type LearnSubTab = 'senda' | 'biblioteca';

const LearnView: React.FC = () => {
    const { user, completeLesson, addTreevus } = useAuth();
    const { setAlert } = useAlert();
    const { state: appState, updateMissionProgress } = useAppContext();
    const [selectedExpedition, setSelectedExpedition] = useState<Expedition | null>(null);
    const [activeSubTab, setActiveSubTab] = useState<LearnSubTab>('senda');

    const completedLessons = user?.completedLessons || [];

    const completionChecks = useMemo(() => ({
        hasFormalExpense: (state: typeof appState, user: User | null) => state.expenses.some(e => e.esFormal),
        hasGoal: (state: typeof appState, user: User | null) => state.goals.length > 0,
        hasBudget: (state: typeof appState, user: User | null) => state.budget !== null && state.budget > 0,
        hasThreeFormalExpenses: (state: typeof appState, user: User | null) => state.expenses.filter(e => e.esFormal).length >= 3,
        hasGoalContribution: (state: typeof appState, user: User | null) => state.goals.some(g => g.currentAmount > 0),
        hasHighFWI: (state: typeof appState, user: User | null) => state.fwi_v2 >= 80,
        isKudosSender: (state: typeof appState, user: User | null) => (user?.kudosSent || 0) >= 10,
        hasLowAhorroPerdido: (state: typeof appState, user: User | null) => state.totalAhorroPerdido < 50 && state.expenses.length > 5,
        hasCompletedGoal: (state: typeof appState, user: User | null) => state.goals.some(g => g.status === 'completed' || g.currentAmount >= g.targetAmount),
        hasReadAllArticles: (state: typeof appState, user: User | null) => {
            if (!user?.completedLessons) return false;
            const articleIds = articles.map(a => a.id);
            return articleIds.every(id => user.completedLessons!.includes(id));
        },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }), []);

    useEffect(() => {
        if (!user) return;
        expeditions.forEach(exp => {
            if (!completedLessons.includes(exp.id)) {
                const check = completionChecks[exp.mission.completionKey as keyof typeof completionChecks];
                if (check && check(appState, user)) {
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
    
    const { completedExpeditionsCount, totalExpeditions, pathProgress } = useMemo(() => {
        const total = expeditions.length;
        const completed = expeditions.filter(exp => completedLessons.includes(exp.id)).length;
        const progress = total > 0 ? (completed / total) * 100 : 0;
        return { completedExpeditionsCount: completed, totalExpeditions: total, pathProgress: progress };
    }, [completedLessons]);
    
    const readArticlesCount = useMemo(() => {
        return articles.filter(art => completedLessons.includes(art.id)).length;
    }, [completedLessons]);

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

    const handleArticleFirstOpen = (articleId: string) => {
        if (!completedLessons.includes(articleId)) {
            const reward = calculateTreevusForAction('complete_lesson');
            completeLesson(articleId);
            addTreevus(reward);
            setAlert({
                message: `¡Pergamino leído! Has cosechado <strong>+${reward} treevüs</strong> 🌿`,
                type: 'success'
            });
            if (user?.tribeId) {
                updateMissionProgress(user.tribeId, 'lessonsCompletedCount', 1);
            }
        }
    };

    const renderBranch = (branchName: Expedition['branch'], isUnlocked: boolean) => {
        const branchExpeditions = expeditionsByBranch[branchName];
        if (!branchExpeditions) return null;

        return (
            <div key={branchName} className="relative pl-8">
                <div className="absolute top-0 left-[3px] w-0.5 h-full bg-active-surface" aria-hidden="true"></div>
                
                <div className="space-y-6">
                    {branchExpeditions.map((expedition, index) => {
                        const isCompleted = completedLessons.includes(expedition.id);
                        const Icon = expedition.icon;
                        
                        return (
                             <div key={expedition.id} className="relative animate-staggered-fade-in-slide-up" style={{ animationDelay: `${index * 50}ms`}}>
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
                                    className={`w-full p-3 bg-surface rounded-2xl border text-left flex items-start gap-3 transition-all duration-300 ${isUnlocked ? 'hover:bg-active-surface cursor-pointer' : 'cursor-not-allowed filter grayscale opacity-50'} ${isCompleted ? 'border-primary/50 opacity-100 filter-none' : 'border-active-surface/80'}`}
                                >
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${isCompleted ? 'bg-primary/10' : 'bg-active-surface'}`}>
                                        {isCompleted ? <CheckIcon className="w-6 h-6 text-primary"/> : !isUnlocked ? <LockClosedIcon className="w-6 h-6 text-on-surface-secondary"/> : <Icon className="w-6 h-6 text-primary" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className={`font-bold text-on-surface`}>{expedition.title}</h3>
                                        <div className="flex items-center gap-1 text-xs font-bold text-yellow-400 mt-1">
                                            <GiftIcon className="w-3.5 h-3.5"/>
                                            <span>+{expedition.mission.reward} treevüs</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        )
                    })}
                </div>
            </div>
        )
    }

    const subTabs = [
        { id: 'senda' as const, label: 'Senda', Icon: RocketLaunchIcon },
        { id: 'biblioteca' as const, label: 'Biblioteca', Icon: BookOpenIcon },
    ];
    
    const renderSenda = () => (
        <div className="space-y-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-active-surface/50 rounded-xl">
                    <TrophyIcon className="w-6 h-6 text-primary"/>
                    <h3 className="font-bold text-primary">CINTA BLANCA: INICIACIÓN</h3>
                </div>
                {renderBranch('Tronco Fundamental', true)}
            </div>

            <div className="space-y-4">
                 <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isCintaBlancaComplete ? 'bg-active-surface/50' : 'bg-background'}`}>
                    <TrophyIcon className={`w-6 h-6 transition-colors ${isCintaBlancaComplete ? 'text-primary' : 'text-on-surface-secondary'}`}/>
                    <h3 className={`font-bold transition-colors ${isCintaBlancaComplete ? 'text-primary' : 'text-on-surface-secondary'}`}>CINTA VERDE: FUNDAMENTOS</h3>
                </div>
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

            <div className="space-y-4">
                 <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isCintaVerdeComplete ? 'bg-active-surface/50' : 'bg-background'}`}>
                    <TrophyIcon className={`w-6 h-6 transition-colors ${isCintaVerdeComplete ? 'text-primary' : 'text-on-surface-secondary'}`}/>
                    <h3 className={`font-bold transition-colors ${isCintaVerdeComplete ? 'text-primary' : 'text-on-surface-secondary'}`}>CINTA MARRÓN: ESTRATEGIA</h3>
                </div>
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

            <div className="space-y-4">
                 <div className={`flex items-center gap-3 p-3 rounded-xl transition-colors ${isCintaMarronComplete ? 'bg-active-surface/50' : 'bg-background'}`}>
                    <TrophyIcon className={`w-6 h-6 transition-colors ${isCintaMarronComplete ? 'text-primary' : 'text-on-surface-secondary'}`}/>
                    <h3 className={`font-bold transition-colors ${isCintaMarronComplete ? 'text-primary' : 'text-on-surface-secondary'}`}>CINTA NEGRA: MENTORÍA</h3>
                </div>
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
        </div>
    );
    
    const renderBiblioteca = () => (
        <div className="space-y-4">
            <div className="text-center">
                 <h2 className="text-xl font-bold text-on-surface">Biblioteca de Pergaminos</h2>
                 <p className="text-sm text-on-surface-secondary mt-1">Expande tu conocimiento y cosecha treevüs con cada pergamino que leas.</p>
            </div>
            {articles.map((article, index) => (
                <div 
                    key={article.id} 
                    className="animate-staggered-fade-in-slide-up" 
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <ArticleCard
                        article={article}
                        isCompleted={completedLessons.includes(article.id)}
                        onFirstOpen={() => handleArticleFirstOpen(article.id)}
                    />
                </div>
            ))}
        </div>
    );
    
    const LearnHeader = () => (
        <div className="bg-surface p-4 rounded-2xl mb-6">
            <div className="text-center mb-4">
                <h2 className="text-xl font-bold text-on-surface">Senda del Guardián del Bosque</h2>
                <p className="text-sm text-on-surface-secondary mt-1">Completa expediciones, demuestra tu maestría y cosecha grandes recompensas.</p>
            </div>

            <div>
                <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1">
                    <span>Progreso Total de la Senda</span>
                    <span className="font-bold text-primary">{pathProgress.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-active-surface rounded-full">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${pathProgress}%` }}></div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center mt-4">
                <div className="bg-background p-2 rounded-lg">
                    <p className="text-xs font-semibold text-on-surface-secondary flex items-center justify-center gap-1.5"><CheckBadgeIcon className="w-4 h-4"/> Expediciones</p>
                    <p className="text-lg font-bold text-on-surface">{completedExpeditionsCount} / {totalExpeditions}</p>
                </div>
                <div className="bg-background p-2 rounded-lg">
                    <p className="text-xs font-semibold text-on-surface-secondary flex items-center justify-center gap-1.5"><BookOpenIcon className="w-4 h-4"/> Pergaminos</p>
                    <p className="text-lg font-bold text-on-surface">{readArticlesCount} / {articles.length}</p>
                </div>
            </div>
        </div>
    );

    return (
        <div className="animate-fade-in">
            <LearnHeader />
            
            <SubNavBar 
                tabs={subTabs} 
                activeTab={activeSubTab} 
                onTabClick={(tab) => setActiveSubTab(tab as LearnSubTab)}
            />
            
            <div className="mt-6">
                {activeSubTab === 'senda' && renderSenda()}
                {activeSubTab === 'biblioteca' && renderBiblioteca()}
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