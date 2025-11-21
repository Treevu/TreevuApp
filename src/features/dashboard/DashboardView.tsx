import React, { useState } from 'react';
import GoalsWidget from '@/features/goals/GoalsWidget.tsx';
import AIGoalCoachCard from '@/features/ai-assistant/AIGoalCoachCard.tsx';
import { useAppContext } from '@/contexts/AppContext';
import OnboardingChecklist from '@/features/profile/OnboardingChecklist.tsx';
import BudgetTracker from '@/features/wallet/BudgetTracker.tsx';
import TaxSavingsWidget from '@/features/analytics/TaxSavingsWidget.tsx';
import { useModal } from '@/hooks/useZustandCompat';
import { CategoriaGasto } from '@/types/common';
import ActionableInsightCard from '@/features/analytics/ActionableInsightCard.tsx';
import StatusCard from '@/components/ui/StatusCard.tsx';
import { SubNavBar } from '@/components/layout';
import useProfileSubnavStore, { ProfileSubTab } from '@/stores/useProfileSubnavStore';
import { BookOpenIcon, UserCircleIcon } from '@/components/ui/Icons';

// ProfileSubTab now comes from store

interface DashboardViewProps {
    dashboardContentRef: React.RefObject<HTMLDivElement>;
    onCategoryClick: (category: CategoriaGasto) => void;
}
const SUB_TABS = [
    { id: 'profile' as const, label: 'Mi Perfil', Icon: UserCircleIcon },
    { id: 'learn' as const, label: 'Senda', Icon: BookOpenIcon },
];

const ProfileDashBoard: React.FC<{}> = ()=>{
    const { state: { expenses, annualIncome } } = useAppContext();
    const { openModal } = useModal();

    const activeSubTab = useProfileSubnavStore((s) => s.activeTab);
    const setActiveSubTab = useProfileSubnavStore((s) => s.setActiveTab);

    return (
        <div>
            <StatusCard />
            <SubNavBar tabs={SUB_TABS} activeTab={activeSubTab} onTabClick={setActiveSubTab} />
            {/* <ActionableInsightCard /> */}
            {/* <AIGoalCoachCard onCategoryClick={onCategoryClick} /> */}
            <BudgetTracker />
            <TaxSavingsWidget annualIncome={annualIncome} onSetup={() => openModal('setIncome')} />
            <GoalsWidget />
        </div>
    );
};

const LearnView: React.FC<{}> = ()=>{
    const activeSubTab = useProfileSubnavStore((s) => s.activeTab);
    const setActiveSubTab = useProfileSubnavStore((s) => s.setActiveTab);

    
    return (
        <div>
            <SubNavBar tabs={SUB_TABS} activeTab={activeSubTab} onTabClick={setActiveSubTab} />
        </div>
    );
}

const DashboardView: React.FC<DashboardViewProps> = ({ dashboardContentRef, onCategoryClick }) => {
    const activeSubTab = useProfileSubnavStore((s) => s.activeTab);
    return (
        <div ref={dashboardContentRef} className="animate-fade-in space-y-4">
            <div className="space-y-4">
                {activeSubTab === 'profile' && <ProfileDashBoard />}
                {activeSubTab === 'learn' && <LearnView />}
            </div>
        </div>
    );
};

export default DashboardView;
