// FIX: Add missing React import to use React.ComponentProps
import React from 'react';
import { AISplitSuggestion, AISavingOpportunity } from './ai';
import { CategoriaGasto } from './common';
import { Expense, ExpenseData, Product, VerificationResult } from './expense';
import { AchievementShareModalProps } from '../components/AchievementShareModal';
import { MerchantAIAssistantProps } from '../components/merchant/MerchantAIAssistant';

export type ModalStep = 
    | 'initializing'
    | 'capture'
    | 'manual_entry' 
    | 'quick_confirm'
    | 'confirm_image' 
    | 'verifying_sunat'
    | 'verification_result'
    | 'analyzing' 
    | 'review' 
    | 'editing' 
    | 'review_products'
    | 'suggest_split'
    | 'saving_opportunity'
    | 'divert_expense';

export interface RucValidationResult {
    isValid: boolean;
    message: string;
    razonSocial?: string;
}

export interface ModalState {
    step: ModalStep;
    image: { url: string; base64: string; mimeType: string } | null;
    expenseData: ExpenseData | null;
    justSavedExpense: Expense | null;
    verificationResult: VerificationResult | null;
    products: (Product & { id: string })[];
    expenseSplitSuggestion: AISplitSuggestion[] | null;
    savingOpportunity: AISavingOpportunity | null;
    error: string | null;
    isSuggestingCategory: boolean;
    suggestedCategory: CategoriaGasto | null;
    isVerifyingRuc: boolean;
    rucValidationResult: RucValidationResult | null;
}

export type ModalAction =
    | { type: 'SET_STEP'; payload: ModalStep }
    | { type: 'SET_IMAGE'; payload: { url: string; base64: string; mimeType: string } | null }
    | { type: 'SET_EXPENSE_DATA'; payload: ExpenseData | null }
    | { type: 'SET_JUST_SAVED_EXPENSE', payload: Expense | null }
    | { type: 'SET_VERIFICATION_RESULT'; payload: VerificationResult | null }
    | { type: 'UPDATE_EXPENSE_DATA'; payload: Partial<ExpenseData> }
    | { type: 'SET_PRODUCTS'; payload: (Product & { id: string })[] }
    | { type: 'UPDATE_PRODUCT'; payload: { id: string; field: 'productName' | 'estimatedPrice'; value: string | number } }
    | { type: 'ADD_PRODUCT' }
    | { type: 'REMOVE_PRODUCT'; payload: string }
    | { type: 'SET_EXPENSE_SPLIT_SUGGESTION'; payload: AISplitSuggestion[] | null }
    | { type: 'SET_SAVING_OPPORTUNITY'; payload: AISavingOpportunity | null }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_IS_SUGGESTING_CATEGORY'; payload: boolean }
    | { type: 'SET_SUGGESTED_CATEGORY'; payload: CategoriaGasto | null }
    | { type: 'SET_IS_VERIFYING_RUC'; payload: boolean }
    | { type: 'SET_RUC_VALIDATION_RESULT'; payload: RucValidationResult | null }
    | { type: 'RESET_RUC_VALIDATION' }
    | { type: 'RESET' };
// Define the types for all possible modals and their props
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
    | 'offerForm'
    | 'achievementShare'
    | 'merchantAIAssistant';


export type ModalPropsMap = {
    addExpense: React.ComponentProps<typeof import('../components/AddExpenseModal').AddExpenseModal> & { initialFile?: File };
    setBudget: React.ComponentProps<typeof import('../components/SetBudgetModal').default>;
    setIncome: React.ComponentProps<typeof import('../components/SetIncomeModal').default>;
    setGoal: React.ComponentProps<typeof import('../components/SetGoalModal').default>;
    addGoalContribution: React.ComponentProps<typeof import('../components/AddGoalContributionModal').default>;
    aiAssistantChat: React.ComponentProps<typeof import('../components/AIAssistantChat').default> & {
        onAddReceiptManual?: () => void;
    };
    gamificationLevels: React.ComponentProps<typeof import('../components/GamificationLevelsModal').default>;
    confirmDelete: React.ComponentProps<typeof import('../components/ConfirmDeleteModal').default>;
    treevusInfo: React.ComponentProps<typeof import('../components/ThreevusInfoModal').default>;
    rewardConfirmation: React.ComponentProps<typeof import('../components/RewardConfirmationModal').default>;
    merchantDetail: React.ComponentProps<typeof import('../components/MerchantDetailModal').default>;
    createChallenge: React.ComponentProps<typeof import('../components/employer/CreateChallengeModal').default>;
    employerAIAssistant: React.ComponentProps<typeof import('../components/employer/EmployerAIAssistant').default>;
    notificationCenter: React.ComponentProps<typeof import('../components/NotificationCenter').default>;
    sendKudos: React.ComponentProps<typeof import('../components/SendKudosModal').default>;
    personalization: React.ComponentProps<typeof import('../components/PersonalizationModal').default>;
    prestige: React.ComponentProps<typeof import('../components/PrestigeModal').default>;
    impactSimulator: React.ComponentProps<typeof import('../components/employer/ImpactSimulatorModal').default>;
    promoteLesson: React.ComponentProps<typeof import('../components/employer/PromoteLessonModal').default>;
    strategicReport: React.ComponentProps<typeof import('../components/employer/StrategicReportModal').default>;
    offerForm: React.ComponentProps<typeof import('../components/merchant/OfferFormModal').default>;
    achievementShare: AchievementShareModalProps;
    merchantAIAssistant: MerchantAIAssistantProps;
};