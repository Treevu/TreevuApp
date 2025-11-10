import React from 'react';
import GoalsWidget from './GoalsWidget';
import { SparklesIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useExpenses } from '../contexts/ExpensesContext';
import { useGoals } from '../contexts/GoalsContext';
import { getAINextStepTip } from '../services/ai/employeeService';
import AIGoalCoachCard from './AIGoalCoachCard';
import { useAppContext } from '../contexts/AppContext';
import OnboardingChecklist from './OnboardingChecklist';
import BudgetTracker from './BudgetTracker';
import TaxSavingsWidget from './TaxSavingsWidget';
import { useModal } from '../contexts/ModalContext';
import { CategoriaGasto } from '../types/common';

const AINextStepCard: React.FC = () => {
    const { user } = useAuth();
    const { expenses } = useExpenses();
    const { goals } = useGoals();
    const [tip, setTip] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(true);

    const DEFAULT_TIP = "Registra un gasto formal para mantener tu racha y ganar más treevüs. ¡Cada boleta cuenta!";

    const fetchTip = React.useCallback(async () => {
        if (!user) {
            setTip(DEFAULT_TIP);
            setIsLoading(false);
            return;
        };
        setIsLoading(true);
        try {
            const nextStep = await getAINextStepTip(user, expenses, goals);
            setTip(nextStep || DEFAULT_TIP);
        } catch (error) {
            console.error("Error fetching AI next step tip:", error);
            setTip(DEFAULT_TIP);
        } finally {
            setIsLoading(false);
        }
    }, [user, expenses, goals]);

    React.useEffect(() => {
        fetchTip();
    }, [fetchTip]);

    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in">
            <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-primary"/>
                Consejo IA
            </h2>
            <div className="text-sm text-on-surface-secondary min-h-[40px] flex items-center">
                {isLoading ? (
                    <div className="h-4 w-3/4 bg-active-surface rounded animate-pulse"></div>
                ) : (
                    <p>{tip}</p>
                )}
            </div>
        </div>
    );
};

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
            <BudgetTracker />
            <AINextStepCard />
            <TaxSavingsWidget annualIncome={annualIncome} onSetup={() => openModal('setIncome')} />
            <GoalsWidget />
            <AIGoalCoachCard onCategoryClick={onCategoryClick} />
        </div>
    );
};

export default DashboardView;