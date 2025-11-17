
import React, { useState } from 'react';
import GoalsWidget from './GoalsWidget';
import { useAppContext } from '../contexts/AppContext';
import OnboardingChecklist from './OnboardingChecklist';
import BudgetTracker from './BudgetTracker';
import TaxSavingsWidget from './TaxSavingsWidget';
import { useModal } from '../contexts/ModalContext';
import { CategoriaGasto, TreevuLevel } from '../types/common';
import { SparklesIcon, BanknotesIcon, BuildingBlocksIcon, PencilIcon, PlusIcon, LockClosedIcon, UserCircleIcon, QuestionMarkCircleIcon } from './Icons';
import StatusCard from './StatusCard';
import DashboardWidget from './DashboardWidget';
import SubNavBar from './SubNavBar';
import QandAView from './QandAView';
import ThemeSwitcher from './ThemeSwitcher';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import LockedFeatureCard from './LockedFeatureCard';
import BadgesWidget from './BadgesWidget';
import { levelData } from '../services/gamificationService';

const DashboardView: React.FC<{
    dashboardContentRef: React.RefObject<HTMLDivElement>;
    onCategoryClick: (category: CategoriaGasto) => void;
}> = ({ dashboardContentRef, onCategoryClick }) => {
    const { user } = useAuth();
    const { state: { expenses, annualIncome } } = useAppContext();
    const { openModal } = useModal();
    const [activeSubTab, setActiveSubTab] = useState<'perfil' | 'ayuda'>('perfil');

    const subTabs = [
        { id: 'perfil' as const, label: 'Mi Panel', Icon: UserCircleIcon },
        { id: 'ayuda' as const, label: 'Guía del Explorador', Icon: QuestionMarkCircleIcon },
    ];

    // Onboarding for new users with no expenses
    if (expenses.length === 0) {
        return <OnboardingChecklist />;
    }

    const budgetActionButton = (
        <button
            onClick={() => openModal('setBudget')}
            className="flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
            aria-label="Editar presupuesto"
        >
            <PencilIcon className="w-4 h-4 mr-1" />
            Editar
        </button>
    );

    const goalsActionButton = (
        <button
            onClick={() => openModal('setGoal')}
            className="flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
            aria-label="Crear nuevo proyecto"
        >
            <PlusIcon className="w-4 h-4 mr-1" />
            Crear
        </button>
    );
    
    const AIConsultantWidget = () => {
        const { openModal } = useModal();
        const { user } = useAuth();
        const isCorporateUser = !!user?.companyId;

        if (isCorporateUser) {
            return (
                <div className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center">
                    <div className="w-12 h-12 bg-active-surface rounded-full flex items-center justify-center mb-3">
                        <SparklesIcon className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                        <SparklesIcon className="w-6 h-6 mr-2 text-primary"/>
                        Consejero IA Activado
                    </h2>
                    <p className="text-sm text-on-surface-secondary mt-1 mb-4 max-w-xs">
                        Tus funcionalidades de IA son gratuitas por ser parte de una empresa aliada. ¡Aprovéchalas!
                    </p>
                    <button
                        onClick={() => openModal('aiAssistantChat')}
                        className="bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-2 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm flex items-center"
                    >
                        <SparklesIcon className="w-5 h-5 mr-1.5" />
                        Abrir Asistente IA
                    </button>
                </div>
            );
        }

        return (
            <div className="bg-surface rounded-2xl p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-active-surface rounded-full flex items-center justify-center mb-3">
                    <SparklesIcon className="w-7 h-7 text-on-surface-secondary" />
                </div>
                <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                    <LockClosedIcon className="w-5 h-5 mr-2 text-warning"/>
                    Consejero IA
                </h2>
                <p className="text-sm text-on-surface-secondary mt-1 mb-4 max-w-xs">
                    Vincula tu cuenta con tu empresa para desbloquear el Asistente IA y obtener análisis personalizados.
                </p>
                <button
                    onClick={() => openModal('companySelection')}
                    className="bg-active-surface text-on-surface font-bold py-2 px-5 rounded-xl text-sm"
                >
                    Vincular Empresa
                </button>
            </div>
        );
    };

    return (
        <div className="animate-fade-in space-y-4" ref={dashboardContentRef}>
            <StatusCard />

            <SubNavBar 
                tabs={subTabs} 
                activeTab={activeSubTab} 
                onTabClick={(tab) => setActiveSubTab(tab)} 
            />

            {activeSubTab === 'perfil' && (
                <div className="space-y-4 animate-fade-in">
                    <DashboardWidget title="Mi Presupuesto" Icon={BanknotesIcon} actionButton={budgetActionButton}>
                        <BudgetTracker />
                    </DashboardWidget>
                    
                    <DashboardWidget title="Devolución de Impuestos" Icon={BanknotesIcon}>
                        {(user?.level ?? 0) >= TreevuLevel.Arbusto ? (
                            <TaxSavingsWidget annualIncome={annualIncome} onSetup={() => openModal('setIncome')} />
                        ) : (
                            <LockedFeatureCard 
                                title="Devolución de Impuestos"
                                Icon={BanknotesIcon}
                                unlockMessage={`Alcanza el nivel '${levelData[TreevuLevel.Arbusto].name}' para desbloquear.`}
                                progressPercentage={((user?.progress.expensesCount || 0) / (levelData[TreevuLevel.Arbusto].goals.expensesCount || 40)) * 100}
                            />
                        )}
                    </DashboardWidget>
                    
                    <DashboardWidget title="Mis Proyectos de Conquista" Icon={BuildingBlocksIcon} actionButton={goalsActionButton}>
                        <GoalsWidget />
                    </DashboardWidget>
                    
                    <BadgesWidget />
                    
                    <AIConsultantWidget />
                    
                    <div className="bg-surface rounded-2xl p-4">
                        <h2 className="text-lg font-bold text-on-surface mb-3">Configuración</h2>
                        <h3 className="text-sm font-bold text-on-surface-secondary mb-2">Tema de la App</h3>
                        <ThemeSwitcher />
                    </div>
                </div>
            )}
            
            {activeSubTab === 'ayuda' && (
                <QandAView />
            )}

        </div>
    );
};

export default DashboardView;
