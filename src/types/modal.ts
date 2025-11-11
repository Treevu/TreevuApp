import { AISplitSuggestion, AISavingOpportunity } from './ai';
import { CategoriaGasto } from './common';
import { Expense, ExpenseData, Product, VerificationResult } from './expense';

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
    | { type: 'SET_EXPENSE_SPLIT_SUGGESTION', payload: AISplitSuggestion[] | null }
    | { type: 'SET_SAVING_OPPORTUNITY', payload: AISavingOpportunity | null }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'SET_IS_SUGGESTING_CATEGORY'; payload: boolean }
    | { type: 'SET_SUGGESTED_CATEGORY'; payload: CategoriaGasto | null }
    | { type: 'SET_IS_VERIFYING_RUC'; payload: boolean }
    | { type: 'SET_RUC_VALIDATION_RESULT'; payload: RucValidationResult | null }
    | { type: 'RESET_RUC_VALIDATION' }
    | { type: 'RESET' }