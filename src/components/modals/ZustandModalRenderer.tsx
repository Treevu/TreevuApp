import React from 'react'
import useModalStore, { ModalType } from '@/stores/useModalStore'

// Importamos todos los componentes de modal
import { AddExpenseModal } from '@/features/expenses/AddExpenseModal'
import SetBudgetModal from '@/features/wallet/SetBudgetModal'
import SetIncomeModal from '@/features/wallet/SetIncomeModal'
import SetGoalModal from '@/features/goals/SetGoalModal'
import AIAssistantChat from '@/features/ai-assistant/AIAssistantChat'
import GamificationLevelsModal from '@/features/gamification/GamificationLevelsModal'
import ConfirmDeleteModal from '@/components/ui/ConfirmDeleteModal'
import ThreevusInfoModal from '@/features/gamification/ThreevusInfoModal'
import RewardConfirmationModal from '@/features/gamification/RewardConfirmationModal'
import MerchantDetailModal from '@/features/expenses/MerchantDetailModal'
import CreateChallengeModal from '@/features/employer/CreateChallengeModal'
import EmployerAIAssistant from '@/features/employer/EmployerAIAssistant'
import AddGoalContributionModal from '@/features/goals/AddGoalContributionModal'
import NotificationCenter from '@/features/notifications/NotificationCenter'
import SendKudosModal from '@/features/social/SendKudosModal'
import PersonalizationModal from '@/features/profile/PersonalizationModal'
import PrestigeModal from '@/features/gamification/PrestigeModal'
import ImpactSimulatorModal from '@/features/employer/ImpactSimulatorModal'
import PromoteLessonModal from '@/features/employer/PromoteLessonModal'
import StrategicReportModal from '@/features/employer/StrategicReportModal'

// Mapeo de componentes de modal
const MODAL_COMPONENTS: { [key in ModalType]: React.FC<any> } = {
    addExpense: AddExpenseModal,
    setBudget: SetBudgetModal,
    setIncome: SetIncomeModal,
    setGoal: SetGoalModal,
    addGoalContribution: AddGoalContributionModal,
    aiAssistantChat: AIAssistantChat,
    gamificationLevels: GamificationLevelsModal,
    confirmDelete: ConfirmDeleteModal,
    treevusInfo: ThreevusInfoModal,
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
}

/**
 * ModalRenderer para Zustand
 * Renderiza automáticamente el modal abierto basado en el estado de Zustand
 */
export const ZustandModalRenderer: React.FC = () => {
    // Suscripción selectiva para mejor rendimiento
    const { isOpen, modalType, modalProps, closeModal } = useModalStore()

    // Si no hay modal abierto, no renderizar nada
    if (!isOpen || !modalType) {
        return null
    }

    // Obtener el componente del modal
    const ModalComponent = MODAL_COMPONENTS[modalType]

    if (!ModalComponent) {
        console.error(`Modal component not found for type: ${modalType}`)
        return null
    }

    // Props finales con onClose automático
    const finalProps = {
        ...modalProps,
        onClose: closeModal
    }

    return <ModalComponent {...finalProps} />
}

/**
 * Hook personalizado para usar modales con mejor tipado
 * Proporciona una interfaz más amigable que el store directo
 */
export const useZustandModal = () => {
    const store = useModalStore()
    
    return {
        // Estado
        isOpen: store.isOpen,
        modalType: store.modalType,
        modalProps: store.modalProps,
        
        // Acciones
        openModal: store.openModal,
        closeModal: store.closeModal,
        isModalOpen: store.isModalOpen,
        
        // Helpers
        openAddExpense: (props?: Parameters<typeof store.openModal<'addExpense'>>[1]) => 
            store.openModal('addExpense', props),
        openConfirmDelete: (onConfirm: () => void, title?: string, message?: string) => 
            store.openModal('confirmDelete', { onConfirm, title, message }),
        openAIChat: (props?: Parameters<typeof store.openModal<'aiAssistantChat'>>[1]) => 
            store.openModal('aiAssistantChat', props),
        // Agregar más helpers según necesidad
    }
}

export default ZustandModalRenderer