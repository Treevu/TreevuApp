
import React, { useRef, useCallback, useEffect, useReducer, useState, useMemo } from 'react';
// FIX: Updated imports from deprecated 'types.ts' to domain-specific type files.
import { type Expense, type Product, type VerificationResult, type ExpenseData } from '@/types/expense';
import { CategoriaGasto, TipoComprobante } from '@/types/common';
import { type ModalState, type ModalAction } from '@/types/modal';
import { type AISavingOpportunity } from '@/types/ai';
import { 
    // FIX: Updated imports from deprecated 'geminiService.ts' to specific AI service files.
    getAISavingOpportunity,
} from '@/services/ai/employeeService.ts';
import { 
    extractExpenseDataFromImage, 
    extractProductsFromImage,
    suggestReceiptType,
    verifyReceiptValidity,
    KNOWN_RUCS,
    normalizeName,
} from '@/services/ai/imageService.ts';
import { 
    getSmartCategorySuggestion,
    suggestExpenseSplit,
} from '@/services/ai/suggestionService.ts';
import { validateRuc } from '@/services/validationService.ts';
import { generateUniqueId, compressImage, fileToDataUrl } from '@/utils';
import { 
    CheckIcon, XMarkIcon, DocumentArrowUpIcon, 
    PencilIcon, PlusIcon, TrashIcon, ExclamationTriangleIcon, 
    ArrowPathIcon, SparklesIcon, ShieldCheckIcon, CubeIcon, ReceiptPercentIcon, BanknotesIcon, PencilSquareIcon, GhostIcon 
} from '@/components/ui/Icons';
import LoadingView from '@/components/ui/LoadingView.tsx';
import { useAppContext } from '@/contexts/AppContext';
import ModalWrapper from '@/components/ui/ModalWrapper.tsx';

interface AddExpenseModalProps {
    onClose: () => void;
    initialAction?: 'file' | 'manual' | null;
    initialFile?: File;
    scanMode?: 'receipt' | 'products' | 'verify' | null;
    expenseToEdit?: Expense | null;
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
    intent: 'unclassified',
};

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

export const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ onClose, initialAction, initialFile, scanMode, expenseToEdit }) => {
    const { state: appState, addExpense, updateExpense, updateGoalContribution } = useAppContext();
    const { expenses, goals } = appState;
    // Función mock para addTreevus
    const addTreevus = (amount: number) => {
        console.log(`addTreevus called with amount: ${amount}`);
    };
    // Función mock para setAlert
    const setAlert = (alertData: any) => {
        console.log('setAlert called with:', alertData);
    };
    
    const getInitialState = useCallback((): ModalState => {
        if (expenseToEdit) {
            return {
                ...initialState,
                step: 'editing',
                expenseData: expenseToEdit,
                image: expenseToEdit.imageUrl ? { url: expenseToEdit.imageUrl, base64: '', mimeType: '' } : null,
            };
        }
        if (initialFile || initialAction === 'file') {
            return { ...initialState, step: 'capture' }; // Start at capture to trigger useEffect
        }
        if (initialAction === 'manual') {
            return { ...initialState, expenseData: BLANK_EXPENSE, step: 'manual_entry' };
        }
        return { ...initialState, step: 'capture' };
    }, [expenseToEdit, initialAction, initialFile]);
    
    const [state, dispatch] = useReducer(modalReducer, getInitialState());
    const { step, image, expenseData, products, error, verificationResult, expenseSplitSuggestion, justSavedExpense, savingOpportunity, isSuggestingCategory, suggestedCategory, isVerifyingRuc, rucValidationResult } = state;

    const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);
    const [divertAmount, setDivertAmount] = useState('');
    const [divertDescription, setDivertDescription] = useState('');
    const [divertGoalId, setDivertGoalId] = useState(goals.length > 0 ? goals[0].id : '');
    const [divertError, setDivertError] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);
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
            case 'review_products':
                return 'Clasifica tu Botín';
            case 'suggest_split':
                return 'Ruta Inteligente';
            case 'verification_result':
                return 'Veredicto de la Brújula';
            case 'saving_opportunity':
                return '¡Momento de Cosechar!';
            case 'divert_expense':
                return 'Desviar Gasto a un Proyecto';
            default:
                return 'Añade un Hallazgo al Mapa';
        }
    }, [expenseToEdit, scanMode, step, error]);
    
    // Auto-trigger file input for Zero-Friction Capture flow
    useEffect(() => {
        if (initialAction === 'file' && !hasTriggeredInitialAction.current && fileInputRef.current) {
            hasTriggeredInitialAction.current = true;
            fileInputRef.current.click();
        }
    }, [initialAction]);

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

    const handleSaveExpense = async () => {
        if (!expenseData) return;
        if (navigator.vibrate) navigator.vibrate(50);
        
        // The state `expenseData.categoria` is the source of truth.
        // The user explicitly applies suggestions via UI buttons, which updates `expenseData`.
        const finalExpenseData = { ...expenseData };

        if (expenseToEdit) {
            updateExpense(expenseToEdit.id, finalExpenseData);
            onClose(); // Skip opportunity step on edit
        } else {
            // FIX: The addExpense function expects a single object argument.
            // The expense data and imageUrl are now combined into one object.
            const addedExpense = addExpense({ ...finalExpenseData, imageUrl: image?.url });
            if (goals.length > 0) {
                dispatch({ type: 'SET_JUST_SAVED_EXPENSE', payload: addedExpense });
                dispatch({ type: 'SET_STEP', payload: 'saving_opportunity' });
                const opportunity = await getAISavingOpportunity(addedExpense, goals);
                dispatch({ type: 'SET_SAVING_OPPORTUNITY', payload: opportunity });
            } else {
                onClose();
            }
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
        addExpense(expenseData);
        onClose();
    };
    
    const handleSplitExpense = () => {
        if (!expenseSplitSuggestion) return;
        if (navigator.vibrate) navigator.vibrate(50);
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
            addExpense(expense);
        });
        onClose(); // Don't show saving opportunity for splits to avoid complexity
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
                    <button onClick={onClose} className="mt-6 bg-primary text-primary-dark font-bold py-2 px-4 rounded-xl">
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
                         <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-active-surface transition-colors text-left">
                            <DocumentArrowUpIcon className="w-8 h-8 text-primary flex-shrink-0" />
                            <div>
                                <p className="font-bold text-on-surface">Subir Archivo</p>
                                <p className="text-sm text-on-surface-secondary">Selecciona una imagen o PDF de tu hallazgo</p>
                            </div>
                        </button>
                        <button 
                            onClick={() => {
                                dispatch({ type: 'SET_EXPENSE_DATA', payload: BLANK_EXPENSE });
                                dispatch({ type: 'SET_STEP', payload: 'manual_entry' });
                            }} 
                            className="w-full flex items-center gap-4 p-4 bg-background rounded-xl hover:bg-active-surface transition-colors text-left">
                            <PencilSquareIcon className="w-8 h-8 text-primary flex-shrink-0" />
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
                            <ReceiptPercentIcon className="w-8 h-8 text-primary flex-shrink-0" />
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
                            <button onClick={() => processImage(image!)} className="flex-1 px-4 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
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
                                <button onClick={() => processImage(image!)} className="flex-1 px-4 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90">
                                    Extraer Datos
                                </button>
                            }
                        </div>
                    </div>
                );
            
             case 'quick_confirm':
                if (!expenseData) return null;
                return (
                    <div className="space-y-4">
                         <p className="text-sm text-center text-on-surface-secondary">La IA ha descifrado los datos de tu hallazgo. Si son correctos, confírmalos para un registro instantáneo.</p>
                         <div className="bg-background p-4 rounded-xl space-y-3 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-on-surface-secondary">Comercio:</span>
                                <span className="font-bold text-on-surface text-right">{expenseData.razonSocial}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-on-surface-secondary">Fecha:</span>
                                <span className="font-bold text-on-surface">{expenseData.fecha}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-on-surface-secondary">Total:</span>
                                <span className="text-2xl font-black text-primary">S/ {expenseData.total.toLocaleString('es-PE', { minimumFractionDigits: 2})}</span>
                            </div>
                            <div className="border-t border-active-surface/50"></div>
                            <div className="flex justify-between items-center">
                                <span className="font-semibold text-on-surface-secondary">Categoría:</span>
                                <div className="flex items-center gap-2">
                                    {isSuggestingCategory ? (<span className="text-xs animate-pulse">Analizando...</span>) : (
                                        suggestedCategory && suggestedCategory !== expenseData.categoria ? (
                                             <button 
                                                onClick={() => {
                                                    dispatch({ type: 'UPDATE_EXPENSE_DATA', payload: { categoria: suggestedCategory } });
                                                    dispatch({ type: 'SET_SUGGESTED_CATEGORY', payload: null });
                                                }}
                                                className="text-xs font-bold text-primary flex items-center gap-1 p-1 rounded-lg bg-primary/10 hover:bg-primary/20"
                                            >
                                                <SparklesIcon className="w-3 h-3" /> Usar: {suggestedCategory}
                                            </button>
                                        ) : null
                                    )}
                                    <span className="font-bold text-on-surface">{expenseData.categoria}</span>
                                </div>
                            </div>
                         </div>
                         <div className="pt-4 flex flex-col sm:flex-row gap-3">
                            <button onClick={() => dispatch({ type: 'SET_STEP', payload: 'review' })} className="w-full px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80 flex items-center justify-center gap-2">
                                <PencilIcon className="w-4 h-4"/>
                                Ajustar Manualmente
                            </button>
                            <button onClick={handleSaveExpense} className="w-full px-4 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                                <CheckIcon className="w-5 h-5"/>
                                Confirmar Hallazgo
                            </button>
                        </div>
                    </div>
                );

            case 'manual_entry':
            case 'review':
            case 'editing':
                if (!expenseData) return null;
                return (
                    <div className="space-y-4 text-sm">
                        <div className="relative">
                           <label className="font-medium text-on-surface-secondary">Comercio</label>
                           <input 
                                type="text" 
                                value={expenseData.razonSocial} 
                                onChange={e => {
                                    const value = e.target.value;
                                    handleUpdateField('razonSocial', value);
                                    if (value) {
                                        setMerchantSuggestions(uniqueMerchants.filter(m => m.toLowerCase().includes(value.toLowerCase())).slice(0, 5));
                                    } else {
                                        setMerchantSuggestions([]);
                                    }
                                }} 
                                onBlur={async () => {
                                    setTimeout(() => setMerchantSuggestions([]), 150); // Hide on blur, with delay
                                    
                                    // Only autofill if RUC is empty, to avoid overwriting manual input.
                                    if (expenseData.razonSocial && (!expenseData.ruc || expenseData.ruc === 'N/A')) {
                                        const normalizedName = normalizeName(expenseData.razonSocial);
                                        const knownRucKey = Object.keys(KNOWN_RUCS).find(key => normalizedName.includes(key));
                                        if (knownRucKey) {
                                            const ruc = KNOWN_RUCS[knownRucKey];
                                            handleUpdateField('ruc', ruc);
                                            handleRucBlur(ruc);
                                        }
                                    }
                                    
                                    if(expenseData.razonSocial) {
                                        dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: true });
                                        const cat = await getSmartCategorySuggestion(expenseData.razonSocial, expenseData.tipoComprobante, expenses);
                                        if (cat) dispatch({ type: 'SET_SUGGESTED_CATEGORY', payload: cat });
                                        dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: false });
                                    }
                                }}
                                className={inputClasses} 
                            />
                            {merchantSuggestions.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-background border border-active-surface rounded-xl shadow-lg">
                                    {merchantSuggestions.map(m => (
                                        <button key={m} 
                                            onMouseDown={async () => { // onMouseDown to fire before onBlur
                                                handleUpdateField('razonSocial', m);
                                                setMerchantSuggestions([]);

                                                const normalizedName = normalizeName(m);
                                                const knownRucKey = Object.keys(KNOWN_RUCS).find(key => normalizedName.includes(key));
                                                if (knownRucKey) {
                                                    const ruc = KNOWN_RUCS[knownRucKey];
                                                    handleUpdateField('ruc', ruc);
                                                    handleRucBlur(ruc);
                                                }

                                                dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: true });
                                                const cat = await getSmartCategorySuggestion(m, expenseData.tipoComprobante, expenses);
                                                if(cat) dispatch({ type: 'SET_SUGGESTED_CATEGORY', payload: cat });
                                                dispatch({ type: 'SET_IS_SUGGESTING_CATEGORY', payload: false });
                                            }}
                                            className="w-full text-left px-4 py-2 text-sm text-on-surface hover:bg-active-surface"
                                        >{m}</button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="font-medium text-on-surface-secondary">RUC</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={expenseData.ruc}
                                    onChange={e => {
                                        handleUpdateField('ruc', e.target.value);
                                        dispatch({ type: 'RESET_RUC_VALIDATION' });
                                    }}
                                    onBlur={e => handleRucBlur(e.target.value)}
                                    placeholder="11 dígitos"
                                    className={`${inputClasses} pr-10`}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 h-full flex items-center">
                                    {isVerifyingRuc ? (
                                        <div className="w-5 h-5 border-2 border-t-primary border-transparent rounded-full animate-spin"></div>
                                    ) : rucValidationResult ? (
                                        rucValidationResult.isValid ? (
                                            <ShieldCheckIcon className="w-6 h-6 text-primary" />
                                        ) : (
                                            <ExclamationTriangleIcon className="w-6 h-6 text-warning" />
                                        )
                                    ) : null}
                                </div>
                            </div>
                            {rucValidationResult && (
                                <p className={`text-xs mt-1 ${rucValidationResult.isValid ? 'text-primary' : 'text-warning'}`}>
                                    {rucValidationResult.isValid && rucValidationResult.razonSocial ? rucValidationResult.razonSocial : rucValidationResult.message}
                                </p>
                            )}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div>
                                <label className="font-medium text-on-surface-secondary">Fecha</label>
                                <input type="date" value={expenseData.fecha} onChange={e => handleUpdateField('fecha', e.target.value)} className={inputClasses} />
                            </div>
                             <div>
                                <label className="font-medium text-on-surface-secondary">Total (S/)</label>
                                <input type="number" value={expenseData.total} onChange={e => handleUpdateField('total', parseFloat(e.target.value) || 0)} className={inputClasses} />
                            </div>
                        </div>
                        <div>
                            <label className="font-medium text-on-surface-secondary">Categoría</label>
                            {isSuggestingCategory ? (
                                <div className="text-xs text-on-surface-secondary animate-pulse mt-1">Buscando sugerencia IA...</div>
                            ) : suggestedCategory && suggestedCategory !== expenseData.categoria ? (
                                <button 
                                    onClick={() => {
                                        handleUpdateField('categoria', suggestedCategory);
                                        dispatch({ type: 'SET_SUGGESTED_CATEGORY', payload: null });
                                    }}
                                    className="w-full text-left text-xs font-bold text-primary flex items-center gap-1.5 p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 mt-1 mb-1 transition-colors"
                                >
                                    <SparklesIcon className="w-4 h-4 flex-shrink-0" /> 
                                    <span>Aplicar sugerencia: <span className="underline">{suggestedCategory}</span></span>
                                </button>
                            ) : null}
                            <select value={expenseData.categoria} onChange={e => handleUpdateField('categoria', e.target.value)} className={inputClasses}>
                                {Object.values(CategoriaGasto).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-medium text-on-surface-secondary">Intención del Gasto</label>
                            <div className="mt-1 grid grid-cols-2 gap-2 p-1 bg-background rounded-xl">
                                <button
                                    type="button"
                                    onClick={() => handleUpdateField('intent', 'essential')}
                                    className={`py-2 text-sm font-bold rounded-lg transition-colors ${expenseData.intent === 'essential' ? 'bg-primary text-primary-dark' : 'text-on-surface-secondary hover:bg-active-surface'}`}
                                >
                                    Esencial
                                </button>
                                <button
                                    type="button"
                                    onClick={() => handleUpdateField('intent', 'desired')}
                                    className={`py-2 text-sm font-bold rounded-lg transition-colors ${expenseData.intent === 'desired' ? 'bg-accent text-accent-dark' : 'text-on-surface-secondary hover:bg-active-surface'}`}
                                >
                                    Deseado
                                </button>
                            </div>
                        </div>
                        <div>
                           <label className="font-medium text-on-surface-secondary">Tipo de Comprobante</label>
                           <select value={expenseData.tipoComprobante} onChange={e => handleUpdateField('tipoComprobante', e.target.value)} className={inputClasses}>
                               {Object.values(TipoComprobante).map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
                           </select>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-background rounded-lg">
                           <label className="font-medium text-on-surface">¿Es un hallazgo formal?</label>
                           <button onClick={() => handleUpdateField('esFormal', !expenseData.esFormal)} className={`w-12 h-6 rounded-full p-1 transition-colors ${expenseData.esFormal ? 'bg-primary' : 'bg-active-surface'}`}>
                               <span className="sr-only">Es formal</span>
                               <span className={`block w-4 h-4 rounded-full bg-white transform transition-transform ${expenseData.esFormal ? 'translate-x-6' : 'translate-x-0'}`}></span>
                           </button>
                        </div>
                        <div className={`p-2 rounded-lg text-center font-semibold text-sm flex items-center justify-center gap-2 ${expenseData.esFormal ? 'bg-primary/10 text-primary' : 'bg-yellow-400/10 text-yellow-300'}`}>
                            {expenseData.esFormal
                                ? `Tesoro fiscal recuperable aprox.: S/ ${expenseData.igv.toFixed(2)}`
                                : <>
                                    <GhostIcon className="w-5 h-5" />
                                    <span>Botín Fantasma: S/ {expenseData.ahorroPerdido.toFixed(2)}</span>
                                  </>
                            }
                        </div>
                        <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                            <button onClick={onClose} className="px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80">Cancelar</button>
                            <button onClick={handleSaveExpense} className="flex-1 px-4 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                                <CheckIcon className="w-5 h-5"/>
                                {expenseToEdit ? 'Actualizar Hallazgo' : 'Guardar Hallazgo'}
                            </button>
                        </div>
                    </div>
                );
            case 'divert_expense':
                return (
                    <div className="space-y-4 text-sm">
                        <p className="text-on-surface-secondary text-center">¡Gran decisión! Convierte un gasto evitado en progreso para tus proyectos.</p>
                        {divertError && <p role="alert" className="text-danger bg-danger/20 p-2 rounded-md text-xs text-center">{divertError}</p>}
                        
                        {goals.length > 0 ? (
                            <>
                                <div>
                                    <label className="font-medium text-on-surface-secondary">Gasto evitado</label>
                                    <input 
                                        type="text" 
                                        value={divertDescription}
                                        onChange={e => setDivertDescription(e.target.value)}
                                        placeholder="Ej: Café de la tarde, delivery"
                                        className={inputClasses} 
                                    />
                                </div>
                                <div>
                                    <label className="font-medium text-on-surface-secondary">Monto a desviar (S/)</label>
                                    <input 
                                        type="number" 
                                        value={divertAmount}
                                        onChange={e => setDivertAmount(e.target.value)}
                                        placeholder="0.00"
                                        className={inputClasses} 
                                    />
                                </div>
                                 <div>
                                    <label className="font-medium text-on-surface-secondary">Destinar a proyecto</label>
                                    <select value={divertGoalId} onChange={e => setDivertGoalId(e.target.value)} className={inputClasses}>
                                        {goals.map(goal => <option key={goal.id} value={goal.id}>{goal.icon} {goal.name}</option>)}
                                    </select>
                                </div>
                                <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                                    <button onClick={onClose} className="px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80">Cancelar</button>
                                    <button onClick={handleDivertExpense} className="flex-1 px-4 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                                        <CheckIcon className="w-5 h-5"/>
                                        Confirmar Desvío
                                    </button>
                                </div>
                            </>
                        ) : (
                             <div className="text-center bg-background p-4 rounded-xl">
                                <p className="text-on-surface-secondary">Para desviar un gasto, primero necesitas crear un "Proyecto de Conquista".</p>
                                 <button onClick={onClose} className="mt-4 px-4 py-2 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90">
                                    Entendido
                                </button>
                            </div>
                        )}
                    </div>
                );
            case 'review_products':
                return (
                    <div className="space-y-2">
                        <div ref={productsContainerRef} className="max-h-64 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                             {products.map(p => (
                                <div key={p.id} className="grid grid-cols-[1fr,100px,auto] gap-2 items-center">
                                    <input type="text" value={p.productName} onChange={e => handleProductUpdate(p.id, 'productName', e.target.value)} placeholder="Producto" className={smallInputClasses} />
                                    <div className="relative">
                                         <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-secondary text-xs">S/</span>
                                        <input type="number" value={p.estimatedPrice} onChange={e => handleProductUpdate(p.id, 'estimatedPrice', parseFloat(e.target.value) || 0)} placeholder="Precio" className={`${smallInputClasses} pl-6`} />
                                    </div>
                                    <button onClick={() => dispatch({ type: 'REMOVE_PRODUCT', payload: p.id })} className="text-danger hover:opacity-70" aria-label="Eliminar producto"><TrashIcon className="w-5 h-5"/></button>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => dispatch({ type: 'ADD_PRODUCT' })} className="w-full text-sm font-bold text-primary flex items-center justify-center gap-1.5 p-2 rounded-lg hover:bg-primary/10">
                            <PlusIcon className="w-4 h-4" /> Añadir Producto
                        </button>
                         <div className="mt-4 pt-4 border-t border-active-surface/50 flex justify-end space-x-3">
                            <button onClick={onClose} className="px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80">Cancelar</button>
                            <button onClick={handleSaveProductsAsExpense} className="flex-1 px-4 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                                <CubeIcon className="w-5 h-5"/>
                                Guardar Botín
                            </button>
                        </div>
                    </div>
                );
            case 'suggest_split':
                if (!expenseSplitSuggestion) return null;
                const total = expenseSplitSuggestion.reduce((sum, s) => sum + s.total, 0);
                return (
                    <div>
                        <p className="text-sm text-center text-on-surface-secondary mb-4">La IA sugiere que este botín puede dividirse en varios tesoros. ¿Quieres separarlos en tu mapa?</p>
                        <div className="space-y-2">
                            {expenseSplitSuggestion.map(s => (
                                <div key={s.category} className="bg-background p-3 rounded-xl">
                                    <div className="flex justify-between font-bold">
                                        <span>{s.category}</span>
                                        <span>S/ {s.total.toFixed(2)}</span>
                                    </div>
                                    <p className="text-xs text-on-surface-secondary truncate">{s.productNames.join(', ')}</p>
                                </div>
                            ))}
                        </div>
                         <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                            <button onClick={() => dispatch({ type: 'SET_STEP', payload: 'review_products' })} className="px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80">No, editar</button>
                            <button onClick={handleSplitExpense} className="flex-1 px-4 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                                <ReceiptPercentIcon className="w-5 h-5"/>
                                Sí, Dividir Tesoro
                            </button>
                        </div>
                    </div>
                );
            case 'saving_opportunity':
                if (!savingOpportunity) {
                    return <LoadingView text="Buscando tesoros ocultos..." />;
                }
                return (
                    <div>
                        <p className="text-sm text-center text-on-surface-secondary mb-4">{savingOpportunity.suggestionText}</p>
                        <p className="text-xs text-center text-on-surface-secondary mb-4 italic">
                            Esto registrará un aporte virtual a tu proyecto de conquista, no es una transferencia de dinero real.
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                            {savingOpportunity.suggestedAmounts.slice(0, 3).map(amount => (
                                <button
                                    key={amount}
                                    onClick={() => handleSaveOpportunity(goals[0].id, amount)} // Assume first goal for simplicity
                                    className="p-3 bg-background rounded-xl text-center font-bold text-primary hover:bg-active-surface"
                                >
                                    S/ {amount}
                                </button>
                            ))}
                        </div>
                         <div className="mt-6 pt-5 border-t border-active-surface/50 flex justify-end space-x-3">
                            <button onClick={onClose} className="px-4 py-2.5 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:opacity-80">Ahora no</button>
                            <button onClick={() => handleSaveOpportunity(goals[0].id, savingOpportunity.suggestedAmounts[0])} className="flex-1 px-4 py-2.5 text-sm font-bold text-primary-dark bg-primary rounded-xl hover:opacity-90 flex items-center justify-center gap-2">
                                <BanknotesIcon className="w-5 h-5"/>
                                Asignar S/ {savingOpportunity.suggestedAmounts[0]}
                            </button>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <ModalWrapper title={modalTitle} onClose={onClose}>
            <>
                {renderContent()}
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleImageFile(e.target.files ? e.target.files[0] : null)}
                    className="hidden"
                    accept="image/*,application/pdf"
                />
            </>
        </ModalWrapper>
    );
};
