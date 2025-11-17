import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo, PropsWithChildren } from 'react';
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
import StrategicReportModal from '../components/employer/StrategicReportModal';
import OfferFormModal from '../components/merchant/OfferFormModal';
import AchievementShareModal from '../components/AchievementShareModal';
import MerchantAIAssistant from '../components/merchant/MerchantAIAssistant';
import ProofOfImpactModal from '../components/ProofOfImpactModal';
import SaasPlanMatrixModal from '../components/SaasPlanMatrixModal';
import CompanySelectionModal from '../components/CompanySelectionModal';
import LeadCaptureModal from '../components/LeadCaptureModal';

import { Tribe, TribeMember } from '../types/tribe';
import { ModalType, ModalPropsMap } from '../types/modal';


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
    offerForm: OfferFormModal,
    achievementShare: AchievementShareModal,
    merchantAIAssistant: MerchantAIAssistant,
    proofOfImpact: ProofOfImpactModal,
    saasPlanMatrix: SaasPlanMatrixModal,
    companySelection: CompanySelectionModal,
    leadCapture: LeadCaptureModal,
};

export const ModalProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [modalState, setModalState] = useState<ModalState>({ type: null, props: {} });

    const closeModal = useCallback(() => {
        setModalState({ type: null, props: {} });
    }, []);

    const openModal = useCallback(<T extends ModalType>(type: T | null, props: Omit<ModalPropsMap[T], 'onClose'> = {} as any) => {
        if (type === null) {
            closeModal();
            return;
        }
        setModalState({ type, props });
    }, [closeModal]);

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

    if (!ModalComponent) {
        console.warn(`Modal type "${type}" not found in MODAL_COMPONENTS.`);
        return null;
    }

    return <ModalComponent {...props} onClose={closeModal} />;
};