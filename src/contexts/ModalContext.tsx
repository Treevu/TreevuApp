import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, PropsWithChildren } from 'react';
import { AddExpenseModal } from '@/features/expenses/AddExpenseModal';
import SetBudgetModal from '@/features/wallet/SetBudgetModal';
import SetIncomeModal from '@/features/wallet/SetIncomeModal';
import SetGoalModal from '@/features/goals/SetGoalModal';
import AIAssistantChat from '@/features/ai-assistant/AIAssistantChat';
import GamificationLevelsModal from '@/features/gamification/GamificationLevelsModal';
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal';
import TreevusInfoModal from '@/features/gamification/ThreevusInfoModal';
import RewardConfirmationModal from '@/features/gamification/RewardConfirmationModal';
import MerchantDetailModal from '@/features/expenses/MerchantDetailModal';
import CreateChallengeModal from '@/features/employer/CreateChallengeModal';
import EmployerAIAssistant from '@/features/employer/EmployerAIAssistant';
import AddGoalContributionModal from '@/features/goals/AddGoalContributionModal';
import NotificationCenter from '@/features/notifications/NotificationCenter';
import SendKudosModal from '@/features/social/SendKudosModal';
import PersonalizationModal from '@/features/profile/PersonalizationModal';
import PrestigeModal from '@/features/gamification/PrestigeModal';
import ImpactSimulatorModal from '@/features/employer/ImpactSimulatorModal';
import PromoteLessonModal from '@/features/employer/PromoteLessonModal';
import StrategicReportModal from '@/features/employer/StrategicReportModal';

import { Tribe, TribeMember } from '@/types/tribe';

// Define the types for all possible modals and their props
type ModalType =
    | 'addExpense'
    | 'setBudget'
    | 'setIncome'
    | 'setGoal'
    | 'addGoalContribution'
    | 'aiAssistantChat'
    | 'gamificationLevels'
    | 'confirmDelete'
    | 'treevusInfo'
    | 'rewardConfirmation'
    | 'merchantDetail'
    | 'createChallenge'
    | 'employerAIAssistant'
    | 'notificationCenter'
    | 'sendKudos'
    | 'personalization'
    | 'prestige'
    | 'impactSimulator'
    | 'promoteLesson'
    | 'strategicReport';


type ModalPropsMap = {
    addExpense: React.ComponentProps<typeof AddExpenseModal> & { initialFile?: File };
    setBudget: React.ComponentProps<typeof SetBudgetModal>;
    setIncome: React.ComponentProps<typeof SetIncomeModal>;
    setGoal: React.ComponentProps<typeof SetGoalModal>;
    addGoalContribution: React.ComponentProps<typeof AddGoalContributionModal>;
    aiAssistantChat: React.ComponentProps<typeof AIAssistantChat> & {
        onAddReceiptManual?: () => void;
    };
    gamificationLevels: React.ComponentProps<typeof GamificationLevelsModal>;
    confirmDelete: React.ComponentProps<typeof ConfirmDeleteModal>;
    treevusInfo: React.ComponentProps<typeof TreevusInfoModal>;
    rewardConfirmation: React.ComponentProps<typeof RewardConfirmationModal>;
    merchantDetail: React.ComponentProps<typeof MerchantDetailModal>;
    createChallenge: React.ComponentProps<typeof CreateChallengeModal>;
    employerAIAssistant: React.ComponentProps<typeof EmployerAIAssistant>;
    notificationCenter: React.ComponentProps<typeof NotificationCenter>;
    sendKudos: { recipient: TribeMember | Tribe; onClose: () => void; };
    personalization: React.ComponentProps<typeof PersonalizationModal>;
    prestige: React.ComponentProps<typeof PrestigeModal>;
    impactSimulator: React.ComponentProps<typeof ImpactSimulatorModal>;
    promoteLesson: React.ComponentProps<typeof PromoteLessonModal>;
    strategicReport: React.ComponentProps<typeof StrategicReportModal>;
};

// State and context definitions
interface ModalState {
    type: ModalType | null;
    props: any;
}

interface ModalContextType {
    openModal: <T extends ModalType>(type: T, props?: Omit<ModalPropsMap[T], 'onClose'>) => void;
    closeModal: () => void;
    modalState: ModalState;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Modal components mapping
const MODAL_COMPONENTS: { [key in ModalType]: React.FC<any> } = {
    addExpense: AddExpenseModal,
    setBudget: SetBudgetModal,
    setIncome: SetIncomeModal,
    setGoal: SetGoalModal,
    addGoalContribution: AddGoalContributionModal,
    aiAssistantChat: AIAssistantChat,
    gamificationLevels: GamificationLevelsModal,
    confirmDelete: ConfirmDeleteModal,
    treevusInfo: TreevusInfoModal,
    rewardConfirmation: RewardConfirmationModal,
    merchantDetail: MerchantDetailModal,
    createChallenge: CreateChallengeModal,
    employerAIAssistant: EmployerAIAssistant,
    notificationCenter: NotificationCenter,
    sendKudos: SendKudosModal,
    personalization: PersonalizationModal,
    prestige: PrestigeModal,
    impactSimulator: ImpactSimulatorModal,
    promoteLesson: PromoteLessonModal,
    strategicReport: StrategicReportModal,
};

// FIX: To resolve the 'missing children' error in App.tsx, we use React.FC<PropsWithChildren<{}>> which correctly types a component that accepts children, making them optional. This aligns with React 18's type definitions and ensures compatibility.
export const ModalProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>({ type: null, props: {} });

    const openModal = useCallback(<T extends ModalType>(type: T, props: Omit<ModalPropsMap[T], 'onClose'> = {} as any) => {
        setModalState({ type, props });
    }, []);

    const closeModal = useCallback(() => {
        setModalState({ type: null, props: {} });
    }, []);

    const value = useMemo(() => ({ openModal, closeModal, modalState }), [openModal, closeModal, modalState]);

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within a ModalProvider');
    }
    return context;
};

export const ModalRenderer: React.FC = () => {
    const { modalState, closeModal } = useModal();
    const { type, props } = modalState;

    if (!type) {
        return null;
    }

    const ModalComponent = MODAL_COMPONENTS[type];
    const allProps = { ...props, onClose: closeModal };

    return <ModalComponent {...allProps} />;
};
