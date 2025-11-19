import React from 'react';
import GoalsWidget from '@/features/goals/GoalsWidget.tsx';
import AIGoalCoachCard from '@/features/ai-assistant/AIGoalCoachCard.tsx';
import { useAppContext } from '@/contexts/AppContext';
import OnboardingChecklist from '@/features/profile/OnboardingChecklist.tsx';
import BudgetTracker from '@/features/wallet/BudgetTracker.tsx';
import TaxSavingsWidget from '@/features/analytics/TaxSavingsWidget.tsx';
import { useModal } from '@/hooks/useZustandCompat';
import { CategoriaGasto } from '@/types/common';
import ActionableInsightCard from '@/features/analytics/ActionableInsightCard.tsx';

interface DashboardViewProps {
    dashboardContentRef: React.RefObject<HTMLDivElement>;
    onCategoryClick: (category: CategoriaGasto) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ dashboardContentRef, onCategoryClick }) => {
    const { state: { expenses, annualIncome } } = useAppContext();
    const { openModal } = useModal();
    
    // Onboarding for new users with no expenses
    if (expenses.length === 0) {
        return <OnboardingChecklist />;
    }

    return (
        <div ref={dashboardContentRef} className="animate-fade-in space-y-4">
            <ActionableInsightCard />
            <AIGoalCoachCard onCategoryClick={onCategoryClick} />
            <BudgetTracker />
            <TaxSavingsWidget annualIncome={annualIncome} onSetup={() => openModal('setIncome')} />
            <GoalsWidget />
        </div>
    );
};

export default DashboardView;
