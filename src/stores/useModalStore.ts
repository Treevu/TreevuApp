import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// Importamos los tipos del ModalContext original para mantener compatibilidad
import { Tribe, TribeMember } from '@/types/tribe'

// Tipos de modales disponibles
export type ModalType =
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
    | 'strategicReport'

// Mapeo de props para cada tipo de modal
export type ModalPropsMap = {
    addExpense: {
        expenseToEdit?: any
        initialAction?: 'file' | 'manual' | 'photo' | null
        scanMode?: 'receipt' | 'product'
        initialFile?: File
    }
    setBudget: {
        currentBudget?: number
    }
    setIncome: {
        currentIncome?: number
    }
    setGoal: {
        goalToEdit?: any
    }
    addGoalContribution: {
        goalId: string
        goalTitle: string
        currentAmount: number
        targetAmount: number
    }
    aiAssistantChat: {
        onAddReceiptManual?: () => void
        initialMessage?: string
    }
    gamificationLevels: {}
    confirmDelete: {
        onConfirm: () => void
        title?: string
        message?: string
    }
    treevusInfo: {}
    rewardConfirmation: {
        reward: {
            id: string
            title: string
            cost: number
            description?: string
        }
        onConfirm: () => void
    }
    merchantDetail: {
        merchant: {
            name: string
            totalSpent: number
            transactionCount: number
            category: string
            expenses: any[]
        }
    }
    createChallenge: {
        onChallengeCreate?: (challenge: any) => void
    }
    employerAIAssistant: {
        initialMessage?: string
    }
    notificationCenter: {}
    sendKudos: {
        recipient: TribeMember | Tribe
    }
    personalization: {
        currentPreferences?: any
    }
    prestige: {
        currentLevel: number
        newLevel: number
        rewards?: any[]
    }
    impactSimulator: {
        departmentData?: any
        initialFilters?: any
    }
    promoteLesson: {
        lesson: {
            id: string
            title: string
            description: string
        }
    }
    strategicReport: {
        reportData?: any
        dateRange?: {
            start: Date
            end: Date
        }
    }
}

// Estado del store
interface ModalState {
    isOpen: boolean
    modalType: ModalType | null
    modalProps: any
}

// Acciones del store
interface ModalActions {
    openModal: <T extends ModalType>(type: T, props?: ModalPropsMap[T]) => void
    closeModal: () => void
    isModalOpen: (type?: ModalType) => boolean
}

// Store completo
export type ModalStore = ModalState & ModalActions

const useModalStore = create<ModalStore>()(
    devtools(
        (set, get) => ({
            // Estado inicial
            isOpen: false,
            modalType: null,
            modalProps: {},

            // Abrir modal con tipo específico y props tipadas
            openModal: (type, props) => {
                set({
                    isOpen: true,
                    modalType: type,
                    modalProps: props || {}
                }, false, `openModal(${type})`)
            },

            // Cerrar modal
            closeModal: () => {
                set({
                    isOpen: false,
                    modalType: null,
                    modalProps: {}
                }, false, 'closeModal')
            },

            // Verificar si hay modal abierto (opcionalmente de un tipo específico)
            isModalOpen: (type) => {
                const state = get()
                if (!type) return state.isOpen
                return state.isOpen && state.modalType === type
            }
        }),
        { name: 'Modal Store' }
    )
)

export default useModalStore