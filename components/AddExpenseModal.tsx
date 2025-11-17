





import React, { useRef, useCallback, useEffect, useReducer, useState, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAlert } from '../contexts/AlertContext';
import { type Expense, type Product, type VerificationResult, type ExpenseData } from '../types/expense';
import { CategoriaGasto, TipoComprobante } from '../types/common';
import { type ModalState as ModalStateImport, type ModalAction as ModalActionImport } from '../types/modal';
import { type AISavingOpportunity } from '../types/ai';
import { 
    getAISavingOpportunity,
} from '../services/ai/employeeService';
import { 
    extractExpenseDataFromImage, 
    extractProductsFromImage,
    suggestReceiptType,
    verifyReceiptValidity,
    KNOWN_RUCS,
    normalizeName,
} from '../services/ai/imageService';
import { 
    getSmartCategorySuggestion,
    suggestExpenseSplit,
} from '../services/ai/suggestionService';
import { validateRuc } from '../services/validationService';
import { generateUniqueId, compressImage, fileToDataUrl } from '../utils';
import { 
    CheckIcon, XMarkIcon, DocumentArrowUpIcon, 
    PencilIcon, PlusIcon, TrashIcon, ExclamationTriangleIcon, 
    ArrowPathIcon, SparklesIcon, ShieldCheckIcon, CubeIcon, ReceiptPercentIcon, BanknotesIcon, PencilSquareIcon, GhostIcon, CameraIcon, CheckBadgeIcon, TreevuCoinIcon
} from './Icons';
import LoadingView from './LoadingView';
import { useAppContext } from '../contexts/AppContext';
import ModalWrapper from './ModalWrapper';

interface AddExpenseModalProps {
    onClose: () => void;
    initialAction?: 'file' | 'manual' | 'camera' | 'divert' | null;
    initialFile?: File;
    scanMode?: 'receipt' | 'products' | 'verify' | null;
    expenseToEdit?: Expense | null;
    initialExpenseData?: Partial<ExpenseData>;
}

const BLANK_EXPENSE: ExpenseData = {
    razonSocial: '',
    ruc: '',
    fecha: new Date().toISOString().split('T')[0],
    total: 0,
    categoria: CategoriaGasto.Otros,
    tipoComprobante: TipoComprobante.SinComprobante,
    esFormal: false,
    ahorroPerdido: 0,
    igv: 0,
    isCorporate: false,
    intent: 'unclassified',
};

// Use imported types and add earnedTreevus
type ModalState = ModalStateImport & { earnedTreevus: number };
type ModalAction = ModalActionImport | { type: 'SET_EARNED_TREEVUS'; payload: number };


const initialState: ModalState = {
    step: 'capture',
    image: null,
    expenseData: null,
    justSavedExpense: null,
    verificationResult: null,
    products: [],
    expenseSplitSuggestion: null,
    savingOpportunity: null,
    error: null,
    isSuggestingCategory: false,
    suggestedCategory: null,
    isVerifyingRuc: false,
    rucValidationResult: null,
    earnedTreevus: 0,
};

function modalReducer(state: ModalState, action: ModalAction): ModalState {
    switch (action.type) {
        case 'SET_STEP':
            return { ...state, step: action.payload, error: null };
        case 'SET_IMAGE':
            return { ...state, image: action.payload };
        case 'SET_EXPENSE_DATA':
            return { ...state, expenseData: action.payload };
        case 'SET_JUST_SAVED_EXPENSE':
            return { ...state, justSavedExpense: action.payload };
        case 'SET_VERIFICATION_RESULT':
            return { ...state, verificationResult: action.payload };
        case 'SET_EXPENSE_SPLIT_SUGGESTION':
            return { ...state, expenseSplitSuggestion: action.payload };
        case 'SET_SAVING_OPPORTUNITY':
            return { ...state, savingOpportunity: action.payload };
        case 'UPDATE_EXPENSE_DATA': {
            if (!state.expenseData) return state;
            const updatedData = { ...state.expenseData, ...action.payload };
            
            if (action.payload.total !== undefined || action.payload.esFormal !== undefined) {
                const total = updatedData.total;
                const igv = total > 0 ? total * (18 / 118) : 0;
                updatedData.igv = updatedData.esFormal ? igv : 0;
                updatedData.ahorroPerdido = updatedData.esFormal ? 0 : igv;
            }
            return { ...state, expenseData: updatedData };
        }
        case 'SET_PRODUCTS':
            return { ...state, products: action.payload };
        case 'UPDATE_PRODUCT':
            return {
                ...state,
                products: state.products.map(p =>
                    p.id === action.payload.id ? { ...p, [action.payload.field]: action.payload.value } : p
                ),
            };
        case 'ADD_PRODUCT':
            return {
                ...state,
                products: [...state.products, { id: generateUniqueId(), productName: '', estimatedPrice: 0 }],
            };
        case 'REMOVE_PRODUCT':
            return { ...state, products: state.products.filter(p => p.id !== action.payload) };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'SET_IS_SUGGESTING_CATEGORY':
            return { ...state, isSuggestingCategory: action.payload };
        case 'SET_SUGGESTED_CATEGORY':
            return { ...state, suggestedCategory: action.payload };
        case 'SET_IS_VERIFYING_RUC':
            return { ...state, isVerifyingRuc: action.payload, rucValidationResult: action.payload ? null : state.rucValidationResult };
        case 'SET_RUC_VALIDATION_RESULT':
            return { ...state, rucValidationResult: action.payload };
        case 'RESET_RUC_VALIDATION':
             return { ...state, isVerifyingRuc: false, rucValidationResult: null };
        case 'SET_EARNED_TREEVUS':
             return { ...state, earnedTreevus: action.payload };
        case 'RESET':
            return { ...initialState, step: 'capture' };
        default:
            return state;
    }
}

const inputClasses = "mt-1 block w-full bg-background border border-active-surface rounded-xl p-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary";
const smallInputClasses = "w-full bg-background border border-active-surface rounded-xl p-2 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-offset-2 focus:ring-offset-surface focus:ring-primary";

const VerificationDisplay = ({ result }: { result: VerificationResult }) => {
    const { isValidForDeduction, checks, overallVerdict, reasonForInvalidity } = result;
    return (
        <>
            <div className={`rounded-2xl p-4 flex items-start space-x-3 ${isValidForDeduction ? 'bg-primary/10' : 'bg-yellow-400/10'}`}>
                {isValidForDeduction ?
                    <ShieldCheckIcon className="w-8 h-8 text-primary flex-shrink-0" /> :
                    <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
                }
                <div>
                    <h3 className={`font-bold ${isValidForDeduction ? 'text-primary' : 'text-yellow-300'}`}>
                        {isValidForDeduction ? "Verificación Exitosa" : "Posible Inconsistencia"}
                    </h3>
                    <p className={`text-sm ${isValidForDeduction ? 'text-on-surface' : 'text-yellow-300/90'}`}>{overallVerdict}</p>
                </div>
            </div>
            <div className="space-y-2 mt-4">
                {checks.map(check => (
                    <div key={check.item} className="flex items-center text-sm p-2 bg-background rounded-lg">
                        {check.valid ?
                            <CheckIcon className="w-5 h-5 text-primary mr-3 flex-shrink-0" /> :
                            <XMarkIcon className="w-5 h-5 text-danger mr-3 flex-shrink-0" />
                        }
                        <span className="font-semibold text-on-surface">{check.item}:</span>
                        <span className="ml-2 text-on-surface-secondary text-xs truncate">{check.reason}</span>
                    </div>
                ))}
            </div>
            {!isValidForDeduction && reasonForInvalidity &&
                <p className="text-left text-xs text-on-surface-secondary p-2 bg-background rounded-md mt-2">{reasonForInvalidity}</p>
            }
        </>
    );
};

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose, initialAction, initialFile, scanMode, expenseToEdit, initialExpenseData }) => {
    const { state: appState, addExpense, updateExpense, updateGoalContribution } = useAppContext();
    const { expenses, goals } = appState;
    const { user, addTreevus } = useAuth();
    const { setAlert } = useAlert();
    
    const getInitialState = useCallback((): ModalState => {
        if (expenseToEdit) {
            return {
                ...initialState,
                step: 'editing',
                expenseData: expenseToEdit,
                image: expenseToEdit.imageUrl ? { url: expenseToEdit.imageUrl, base64: '', mimeType: '' } : null,
            };
        }
        if (initialFile || initialAction === 'file' || initialAction === 'camera') {
            return { ...initialState, step: 'capture' }; // Start at capture to trigger useEffect
        }
        if (initialAction === 'divert') {
            return { ...initialState, step: 'divert_expense' };
        }
        if (initialAction === 'manual' || initialExpenseData) {
            return { ...initialState, expenseData: { ...BLANK_EXPENSE, ...initialExpenseData }, step: 'manual_entry' };
        }
        return { ...initialState, step: 'capture' };
    }, [expenseToEdit, initialAction, initialFile, initialExpenseData]);
    
    const [state, dispatch] = useReducer(modalReducer, getInitialState());
    const { step, image, expenseData, products, error, verificationResult, expenseSplitSuggestion, justSavedExpense, savingOpportunity, isSuggestingCategory, suggestedCategory, isVerifyingRuc, rucValidationResult, earnedTreevus } = state;

    const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);
    const [divertAmount, setDivertAmount] = useState('');
    const [divertDescription, setDivertDescription] = useState('');
    const [divertGoalId, setDivertGoalId] = useState('');
    const [divertError, setDivertError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
    const cameraInputRef = useRef<HTMLInputElement>(null);
    const productsContainerRef = useRef<HTMLDivElement>(null);
    const hasTriggeredInitialAction = useRef(false);

    const uniqueMerchants = useMemo(() => {
        const merchantSet = new Set(expenses.map(e => e.razonSocial));
        return Array.from(merchantSet);
    }, [expenses]);

    const modalTitle = useMemo(() => {
        if (error) return 'Ocurrió un Error';
        if (expenseToEdit) return 'Ajustar Coordenadas';
        if (scanMode === 'products') return 'Analizar Botín Informal';
        if (scanMode === 'verify') return 'Brújula IA de Comprobantes';
        switch (step) {
            case 'review':
            case 'editing':
            case 'manual_entry':
                return 'Revisa tu Hallazgo';
            case 'quick_confirm':
                 return 'Confirmación Rápida del Hallazgo';
            case 'save_success':
                return '¡Hallazgo Registrado!';
            case 'review_products':
                return 'Clasifica tu Botín';
            case 'suggest_split':
                return 'Ruta Inteligente';
            case 'verification_result':
                return 'Veredicto de la Brújula';
            case 'saving_opportunity':
                return '¡Impulso al Proyecto!';
            case 'divert_expense':
                return 'Desviar Gasto a un Proyecto';
            default:
                return 'Añade un Hallazgo al Mapa';
        }
    }, [expenseToEdit, scanMode, step, error]);
    
    // Auto-trigger file/camera input for Zero-Friction Capture flow
    useEffect(() => {
        if (hasTriggeredInitialAction.current) return;

        if (initialAction === 'file' && fileInputRef.current) {
            hasTriggeredInitialAction.current = true;
            fileInputRef.current.click();
        } else if (initialAction === 'camera' && cameraInputRef.current) {
            hasTriggeredInitialAction.current = true;
            cameraInputRef.current.click();
        }
    }, [initialAction]);

    useEffect(() => {
        // When switching to the divert step, if no goal is selected
        // and goals are available, pre-select the first one.
        if (step === 'divert_expense' && !divertGoalId && goals.length > 0) {
            setDivertGoalId(goals[0].id);
        }
        // If a goal that was selected is deleted while modal is open, reset selection
        if (step === 'divert_expense' && divertGoalId && !goals.find(g => g.id === divertGoalId)) {
            setDivertGoalId(goals.length > 0 ? goals[0].id : '');
        }
    }, [step, goals, divertGoalId]);

    const processImage = useCallback(async (imageData: { url: string; base64: string; mimeType: string }) => {
        dispatch({ type: 'SET_IMAGE', payload: imageData });
        dispatch({ type: 'SET_STEP', payload: 'analyzing' });

        try {
            if (scanMode === 'verify') {
                const result = await verifyReceiptValidity(imageData.base64, imageData.mimeType);
                dispatch({ type: 'SET_VERIFICATION_RESULT', payload: result });
                dispatch({ type: 'SET_STEP', payload: 'verification_result' });
                return;
            }

            if (scanMode === 'products') {
                const products = await extractProductsFromImage(imageData.base64, imageData.mimeType);
                if (products && products.length > 0) {
                    const productsWithIds = products.map(p => ({ ...p, id: generateUniqueId() }));
                    dispatch({ type: 'SET_PRODUCTS', payload: productsWithIds });
                    const splitSuggestion = await suggestExpenseSplit(products);
                    if (splitSuggestion && splitSuggestion.length > 1) {
                        dispatch({ type: 'SET_EXPENSE_SPLIT_SUGGESTION', payload: splitSuggestion });
                        dispatch({ type: 'SET_STEP', payload: 'suggest_split' });
                    } else {
                        dispatch({ type: 'SET_STEP', payload: 'review_products' });
                    }
                } else {
                     throw new Error('No se pudieron identificar productos. Intenta un registro manual.');
                }
                return;
            }

            // Default receipt flow
            const verification = await verifyReceiptValidity(imageData.base64, imageData.mimeType);
            if (!verification?.isValidForDeduction) {
                dispatch({ type: 'SET_VERIFICATION_RESULT', payload: verification });
                dispatch({ type: 'SET_STEP', payload: 'verification_result' });
                return;
            }
            
            const expenseData = await extractExpenseDataFromImage(imageData.base64, imageData.mimeType);
            const isHighConfidence = expenseData && expenseData.total > 0 && expenseData.razonSocial && expenseData.razonSocial !== 'N/A' && expenseData.fecha;

            if (isHighConfidence) {
                dispatch({ type: 'SET_EXPENSE_DATA', payload: expenseData });
                dispatch({ type: 'SET_STEP', payload: 'quick_confirm' });

                dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: true });
                try {
                    const suggestedCat = await getSmartCategorySuggestion(expenseData.razonSocial, expenseData.tipoComprobante, expenses);
                    if (suggestedCat) {
                        dispatch({ type: 'SET_SUGGESTED_CATEGORY', payload: suggestedCat });
                    }
                } finally {
                    dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: false });
                }

            } else {
                dispatch({ type: 'SET_EXPENSE_DATA', payload: expenseData || BLANK_EXPENSE });
                dispatch({ type: 'SET_STEP', payload: 'review' });
            }
        } catch (err) {
            console.error(err);
            let friendlyMessage = (err as Error).message || 'Hubo un error al procesar la imagen.';
            if (friendlyMessage.includes('No se pudieron identificar productos')) {
                friendlyMessage = '¡Ups! La IA no pudo leer bien la imagen. Prueba con más luz y un fondo plano, o intenta un registro manual.';
            } else if (friendlyMessage.toLowerCase().includes('timed out') || friendlyMessage.includes('tardado demasiado')) {
                friendlyMessage = 'La conexión está un poco lenta. Por favor, intenta de nuevo.'
            }
            dispatch({ type: 'SET_ERROR', payload: friendlyMessage });
        }
    }, [scanMode, expenses]);

    const handleImageFile = useCallback(async (file: File | null) => {
        if (!file) {
            onClose(); // Close modal if user cancels file selection
            return;
        }
        try {
            dispatch({ type: 'SET_STEP', payload: 'initializing' });
            const isPdf = file.type === 'application/pdf';
            const data = isPdf ? await fileToDataUrl(file) : await compressImage(file);
            await processImage(data);
        } catch (err) {
            console.error(err);
            dispatch({ type: 'SET_ERROR', payload: (err as Error).message || 'Hubo un error al procesar el archivo.' });
        }
    }, [onClose, processImage]);
    
    useEffect(() => {
        if (initialFile) {
            handleImageFile(initialFile);
        }
    }, [initialFile, handleImageFile]);
    
    const handleUpdateField = (field: keyof ExpenseData, value: string | number | boolean) => {
        dispatch({ type: 'UPDATE_EXPENSE_DATA', payload: { [field]: value } });
    };

    const handleProductUpdate = (id: string, field: 'productName' | 'estimatedPrice', value: string | number) => {
        dispatch({ type: 'UPDATE_PRODUCT', payload: { id, field, value } });
    };

    const handleRucBlur = async (ruc: string) => {
        if (!ruc || ruc.length !== 11 || !expenseData) return;

        dispatch({ type: 'SET_IS_VERIFYING_RUC', payload: true });
        try {
            const result = await validateRuc(ruc);
            dispatch({ type: 'SET_RUC_VALIDATION_RESULT', payload: result });

            if (result.isValid && result.razonSocial) {
                // Auto-fill the merchant name
                handleUpdateField('razonSocial', result.razonSocial);
                
                // Trigger category suggestion
                dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: true });
                try {
                    const cat = await getSmartCategorySuggestion(
                        result.razonSocial,
                        expenseData.tipoComprobante,
                        expenses
                    );
                    if (cat) dispatch({ type: 'SET_SUGGESTED_CATEGORY', payload: cat });
                } finally {
                    dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: false });
                }
            }
        } catch (error) {
            console.error("RUC validation failed:", error);
            dispatch({ type: 'SET_RUC_VALIDATION_RESULT', payload: { isValid: false, message: 'Error de conexión' } });
        } finally {
            dispatch({ type: 'SET_IS_VERIFYING_RUC', payload: false });
        }
    };

    const handleProceedAfterSave = useCallback(async () => {
        if (!justSavedExpense) {
            onClose();
            return;
        }
    
        if (justSavedExpense.intent === 'desired' && goals.length > 0) {
            dispatch({ type: 'SET_STEP', payload: 'saving_opportunity' });
            const opportunity = await getAISavingOpportunity(justSavedExpense, goals);
            dispatch({ type: 'SET_SAVING_OPPORTUNITY', payload: opportunity });
        } else {
            onClose();
        }
    }, [justSavedExpense, goals, onClose]);

    const handleSaveExpense = async () => {
        if (!expenseData) return;
        if (navigator.vibrate) navigator.vibrate(50);
        
        const finalExpenseData = { ...expenseData };

        if (expenseToEdit) {
            updateExpense(expenseToEdit.id, finalExpenseData);
            onClose();
        } else {
            const { expense: addedExpense, treevusEarned } = addExpense({ ...finalExpenseData, imageUrl: image?.url });
            dispatch({ type: 'SET_EARNED_TREEVUS', payload: treevusEarned });
            dispatch({ type: 'SET_JUST_SAVED_EXPENSE', payload: addedExpense });
            dispatch({ type: 'SET_STEP', payload: 'save_success' });
            
            // Wait for animation, then proceed
            setTimeout(() => {
                handleProceedAfterSave();
            }, 2500);
        }
    };

    const handleDivertExpense = () => {
        const amount = parseFloat(divertAmount);
        if (!divertDescription.trim()) {
            setDivertError('Por favor, describe qué gasto estás evitando.');
            return;
        }
        if (isNaN(amount) || amount <= 0) {
            setDivertError('Por favor, ingresa un monto válido y positivo.');
            return;
        }
        if (!divertGoalId) {
            setDivertError('Debes seleccionar un proyecto de conquista.');
            return;
        }
    
        if (navigator.vibrate) navigator.vibrate(50);
        updateGoalContribution(divertGoalId, amount);
        addTreevus(25); // Award a high value for this positive habit
        setAlert({
            message: `¡Excelente! Desviaste <strong>S/ ${amount.toFixed(2)}</strong> a tu proyecto. <strong>+25 treevüs</strong> 🌿`,
            type: 'success'
        });
        onClose();
    };

    const handleSaveProductsAsExpense = () => {
        if (products.length === 0) return;
        if (navigator.vibrate) navigator.vibrate(50);
        const total = products.reduce((sum, p) => sum + Number(p.estimatedPrice), 0);
        const expenseData: ExpenseData = {
            razonSocial: products.map(p => p.productName).join(', ').substring(0, 100) || 'Compra informal',
            ruc: 'N/A',
            fecha: new Date().toISOString().split('T')[0],
            total,
            categoria: CategoriaGasto.Consumos, // Default category for product scans
            tipoComprobante: TipoComprobante.SinComprobante,
            esFormal: false,
            ahorroPerdido: total * 0.18, // Simplified IGV calculation for informal
            igv: 0,
            isProductScan: true,
            mensaje: '¡Botín informal registrado!',
            intent: 'unclassified',
        };
        const { treevusEarned } = addExpense(expenseData);
        dispatch({ type: 'SET_EARNED_TREEVUS', payload: treevusEarned });
        dispatch({ type: 'SET_STEP', payload: 'save_success' });
        setTimeout(onClose, 2500);
    };
    
    const handleSplitExpense = () => {
        if (!expenseSplitSuggestion) return;
        if (navigator.vibrate) navigator.vibrate(50);
        let totalTreevus = 0;
        expenseSplitSuggestion.forEach(suggestion => {
            const expense: ExpenseData = {
                razonSocial: `Compra: ${suggestion.productNames.join(', ')}`,
                ruc: 'N/A',
                fecha: new Date().toISOString().split('T')[0],
                total: suggestion.total,
                categoria: suggestion.category,
                tipoComprobante: TipoComprobante.SinComprobante,
                esFormal: false,
                ahorroPerdido: suggestion.total * 0.18,
                igv: 0,
                isProductScan: true,
                mensaje: `¡Tesoro de ${suggestion.category} separado!`,
                intent: 'unclassified',
            };
            const result = addExpense(expense);
            totalTreevus += result.treevusEarned;
        });
        dispatch({ type: 'SET_EARNED_TREEVUS', payload: totalTreevus });
        dispatch({ type: 'SET_STEP', payload: 'save_success' });
        setTimeout(onClose, 2500);
    };
    
    const handleSaveOpportunity = (goalId: string, amount: number) => {
        if (navigator.vibrate) navigator.vibrate(50);
        updateGoalContribution(goalId, amount);
        onClose();
    };


    const renderContent = () => {
        if (error) {
            return (
                <div className="text-center">
                    <ExclamationTriangleIcon className="w-12 h-12 text-danger mx-auto" />
                    <p className="mt-4 text-on-surface-secondary">{error}</p>
                    <button onClick={onClose} className="mt-6 bg-gradient-to-r from-accent to-accent-secondary text-primary-dark font-bold py-2 px-4 rounded-xl shadow-lg shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300">
                        Cerrar e Intentar de Nuevo
                    </button>
                </div>
            );
        }
        
        switch (step) {
            case 'initializing':
            case 'analyzing':
            case 'verifying_sunat':
                const messages: {[key in typeof step]: string} = {
                    initializing: 'Iniciando cámara...',
                    analyzing: 'Descifrando con IA...',
                    verifying_sunat: 'Consultando la Brújula IA...',
                };
                return <LoadingView text={messages[step]} />;
            
            case 'capture':
                 return (
                     <div className="space-y-4">
                        <button onClick={() => cameraInputRef.current?.click()} className="w-full flex items-center gap-4 p-4 bg-gradient-to-r from-accent to-accent-secondary text-primary-dark rounded-xl transition-all text-left shadow-lg shadow-primary/20 transform hover:-translate-y-1 duration-300">
                            <CameraIcon className="w-8 h-8 flex-shrink-0" />
                            <div>
                                <p className="font-bold">Capturar Hallazgo</p>
                                <p className="text-sm opacity-90">Toma una foto a tu comprobante</p>
                            </div>
                        </button>
                         <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-active-surface transition-colors text-left">
                            <DocumentArrowUpIcon className="w-8 h-8 text-accent-secondary flex-shrink-0" />
                            <div>
                                <p className="font-bold text-on-surface">Subir Archivo</p>
                                <p className="text-sm text-on-surface-secondary">Selecciona una imagen o PDF</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => {
                                dispatch({ type: 'SET_EXPENSE_DATA', payload: BLANK_EXPENSE });
                                dispatch({ type: 'SET_STEP', payload: 'manual_entry' });
                            }} 
                            className="w-full flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-active-surface transition-colors text-left">
                            <PencilSquareIcon className="w-8 h-8 text-accent flex-shrink-0" />
                            <div>
                                <p className="font-bold text-on-surface">Registro Manual</p>
                                <p className="text-sm text-on-surface-secondary">Ingresa los datos del hallazgo</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => {
                                dispatch({ type: 'SET_STEP', payload: 'divert_expense' });
                            }} 
                            className="w-full flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-active-surface transition-colors text-left">
                            <ReceiptPercentIcon className="w-8 h-8 text-accent-secondary flex-shrink-0" />
                            <div>
                                <p className="font-bold text-on-surface">Desviar Gasto</p>
                                <p className="text-sm text-on-surface-secondary">Ahorra el dinero de una compra que evitaste</p>
                            </div>
                        </button>
                    </div>
                );

            case 'confirm_image': // This step is now skipped in the ZFC flow, but kept for other potential flows
                return (
                    <div>
                        <img src={image!.url} alt="Comprobante capturado" className="rounded-xl max-h-64 w-auto mx-auto border border-active-surface" />
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80 flex items-center gap-2">
                                <ArrowPathIcon className="w-5 h-5"/> Volver
                            </button>
                            <button onClick={() => processImage(image!)} className="flex-1 px-4 py-2 text-sm font-bold text-primary-dark bg-gradient-to-r from-accent to-accent-secondary rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300">
                                <CheckIcon className="w-5 h-5"/>
                                Confirmar y Analizar
                            </button>
                        </div>
                    </div>
                );
            
            case 'verification_result':
                return (
                    <div>
                        {verificationResult && <VerificationDisplay result={verificationResult} />}
                        <div className="mt-6 flex justify-end space-x-3">
                            <button onClick={onClose} className="px-4 py-2 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80">Volver</button>
                            { (scanMode !== 'verify' && verificationResult?.isValidForDeduction) &&
                                <button onClick={() => processImage(image!)} className="flex-1 px-4 py-2 text-sm font-bold text-primary-dark bg-gradient-to-r from-accent to-accent-secondary rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 transform hover:-translate-y-1 transition-all duration-300">
                                    <SparklesIcon className="w-5 h-5" /> Continuar Análisis
                                </button>
                            }
                        </div>
                    </div>
                );
            // ... (rest of the cases)
            default:
                return (
                    <div>
                        <p>Paso desconocido: {step}</p>
                        <button onClick={onClose} className="mt-4 bg-gradient-to-r from-accent to-accent-secondary text-primary-dark p-2 rounded">Cerrar</button>
                    </div>
                );
        }
    };

    return (
        <ModalWrapper title={modalTitle} onClose={onClose}>
            {renderContent()}
            <input type="file" ref={fileInputRef} onChange={e => handleImageFile(e.target.files?.[0] || null)} className="hidden" accept="image/*,application/pdf" />
            <input type="file" ref={cameraInputRef} onChange={e => handleImageFile(e.target.files?.[0] || null)} className="hidden" accept="image/*" capture="environment" />
        </ModalWrapper>
    );
};