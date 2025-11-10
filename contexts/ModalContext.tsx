
import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from 'react';
import { AddExpenseModal } from '../components/AddExpenseModal';
import SetBudgetModal from '../components/SetBudgetModal';
import SetIncomeModal from '../components/SetIncomeModal';
import SetGoalModal from '../components/SetGoalModal';
import AIAssistantChat from '../components/AIAssistantChat';
import GamificationLevelsModal from '../components/GamificationLevelsModal';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import TreevusInfoModal from '../components/ThreevusInfoModal';
import RewardConfirmationModal from '../components/RewardConfirmationModal';
import MerchantDetailModal from '../components/MerchantDetailModal';
import CreateChallengeModal from '../components/employer/CreateChallengeModal';
import EmployerAIAssistant from '../components/employer/EmployerAIAssistant';
import AddGoalContributionModal from '../components/AddGoalContributionModal';
import NotificationCenter from '../components/NotificationCenter';
import SendKudosModal from '../components/SendKudosModal';
import PersonalizationModal from '../components/PersonalizationModal';
import PrestigeModal from '../components/PrestigeModal';
import ImpactSimulatorModal from '../components/employer/ImpactSimulatorModal';
import PromoteLessonModal from '../components/employer/PromoteLessonModal';

import { Tribe, TribeMember } from '../types/tribe';

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
    | 'promoteLesson';


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
};

// FIX: Changed from React.FC to a standard function component with explicit children prop type to resolve the 'missing children' error from App.tsx.
export const ModalProvider = ({ children }: { children: ReactNode }) => {
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