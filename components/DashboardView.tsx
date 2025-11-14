import React from 'react';
import GoalsWidget from './GoalsWidget';
import AIGoalCoachCard from './AIGoalCoachCard';
import { useAppContext } from '../contexts/AppContext';
import OnboardingChecklist from './OnboardingChecklist';
import BudgetTracker from './BudgetTracker';
import TaxSavingsWidget from './TaxSavingsWidget';
import { useModal } from '../contexts/ModalContext';
import { CategoriaGasto } from '../types/common';
import ActionableInsightCard from './ActionableInsightCard';
import { useAuth } from '../contexts/AuthContext';
import CorporateCardWidget from './CorporateCardWidget';

interface DashboardViewProps {
    dashboardContentRef: React.RefObject<HTMLDivElement>;
    onCategoryClick: (category: CategoriaGasto) => void;
}

const DashboardView: React.FC<DashboardViewProps> = ({ dashboardContentRef, onCategoryClick }) => {
    const { user } = useAuth();
    const { state: { expenses, annualIncome } } = useAppContext();
    const { openModal } = useModal();
    
    // Onboarding for new users with no expenses
    if (expenses.length === 0) {
        return <OnboardingChecklist />;
    }

    return (
        <div ref={dashboardContentRef} className="animate-fade-in space-y-4">
            {user?.hasCorporateCard && <CorporateCardWidget />}
            <ActionableInsightCard />
            <AIGoalCoachCard onCategoryClick={onCategoryClick} />
            <BudgetTracker />
            <TaxSavingsWidget annualIncome={annualIncome} onSetup={() => openModal('setIncome')} />
            <GoalsWidget />
        </div>
    );
};

export default DashboardView;