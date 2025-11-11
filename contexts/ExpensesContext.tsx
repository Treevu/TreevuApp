import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect, useCallback } from 'react';
import { trackEvent } from '../services/analyticsService';
import { sendInformalExpenseNotification } from '../services/notificationService';
import { triggerInAppNotificationChecks } from '../services/inAppNotificationService';
import { generateUniqueId } from '../utils';
import { useAuth } from './AuthContext';
import { calculateTreevusForAction, STREAK_BONUS_CONFIG } from '../services/gamificationService';
import { useModal } from './ModalContext';
import { useNotifications } from './NotificationContext';
import { useGoals } from './GoalsContext';
import { useAlert } from './AlertContext';
import { useTribes } from './TribesContext';

import { CategoriaGasto, TipoComprobante, FwiComponents } from '../types/common';
import { Expense, ExpenseData } from '../types/expense';
import { NotificationType } from '../types/notification';

// --- DEMO DATA ---
const getDateString = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

const initialExpenses: Expense[] = [
    // Today's Expenses
    { id: '101', razonSocial: 'La Lucha Sanguchería', ruc: '20548874679', fecha: getDateString(0), total: 45.50, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 6.94, intent: 'desired' },
    { id: '102', razonSocial: 'Café de la Mañana', ruc: 'N/A', fecha: getDateString(0), total: 12.00, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 2.16, igv: 0, intent: 'desired' },
    { id: '103', razonSocial: 'Metropolitano', ruc: 'N/A', fecha: getDateString(0), total: 3.50, categoria: CategoriaGasto.Transporte, tipoComprobante: TipoComprobante.BoletoTransporte, esFormal: true, ahorroPerdido: 0, igv: 0, intent: 'essential' },
    
    // Yesterday's Expenses
    { id: '1', razonSocial: 'Wong', ruc: '20332093952', fecha: getDateString(1), total: 125.50, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 19.14, intent: 'essential' },
    { id: '104', razonSocial: 'Gildemeister', ruc: '20422899231', fecha: getDateString(1), total: 80.00, categoria: CategoriaGasto.Transporte, tipoComprobante: TipoComprobante.FacturaElectronica, esFormal: true, ahorroPerdido: 0, igv: 12.20, intent: 'essential' },

    // Recent Expenses
    { id: '2', razonSocial: 'Netflix', ruc: 'N/A', fecha: getDateString(2), total: 39.90, categoria: CategoriaGasto.Ocio, tipoComprobante: TipoComprobante.Otro, esFormal: true, ahorroPerdido: 0, igv: 6.09, intent: 'desired' },
    { id: '3', razonSocial: 'Mercado de Surquillo', ruc: 'N/A', fecha: getDateString(3), total: 65.00, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 11.70, igv: 0, intent: 'essential' },
    { id: '105', razonSocial: 'Pago de Internet (Claro)', ruc: '20100259589', fecha: getDateString(3), total: 89.90, categoria: CategoriaGasto.Servicios, tipoComprobante: TipoComprobante.ReciboServiciosPublicos, esFormal: true, ahorroPerdido: 0, igv: 13.71, intent: 'essential' },
    { id: '4', razonSocial: 'Repsol', ruc: '20258092771', fecha: getDateString(4), total: 150.00, categoria: CategoriaGasto.Transporte, tipoComprobante: TipoComprobante.FacturaElectronica, esFormal: true, ahorroPerdido: 0, igv: 22.88, intent: 'essential' },
    { id: '106', razonSocial: 'Compra informal', ruc: 'N/A', fecha: getDateString(4), total: 25.00, categoria: CategoriaGasto.Consumos, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 4.50, igv: 0, isProductScan: true, mensaje: '¡Botín informal registrado!', intent: 'desired' },
    { id: '5', razonSocial: 'Platzi', ruc: 'N/A', fecha: getDateString(5), total: 95.00, categoria: CategoriaGasto.Educacion, tipoComprobante: TipoComprobante.Otro, esFormal: true, ahorroPerdido: 0, igv: 14.49, intent: 'desired' },
    { id: '6', razonSocial: 'Menú de Almuerzo', ruc: 'N/A', fecha: getDateString(6), total: 15.00, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 2.70, igv: 0, intent: 'essential' },
    { id: '107', razonSocial: 'Farmacia (Boticas y Salud)', ruc: '20502353393', fecha: getDateString(7), total: 35.20, categoria: CategoriaGasto.Salud, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 5.37, intent: 'essential' },

    // Older Expenses
    { id: '7', razonSocial: 'Luz del Sur', ruc: '20331923291', fecha: getDateString(8), total: 85.30, categoria: CategoriaGasto.Servicios, tipoComprobante: TipoComprobante.ReciboServiciosPublicos, esFormal: true, ahorroPerdido: 0, igv: 12.98, intent: 'essential' },
    { id: '8', razonSocial: 'Cineplanet', ruc: '20429683581', fecha: getDateString(10), total: 55.00, categoria: CategoriaGasto.Ocio, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 8.39, intent: 'desired' },
    { id: '9', razonSocial: 'Anticuchos de la esquina', ruc: 'N/A', fecha: getDateString(10), total: 20.00, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 3.60, igv: 0, intent: 'desired' },
    { id: '10', razonSocial: 'Inkafarma', ruc: '20550020681', fecha: getDateString(12), total: 45.80, categoria: CategoriaGasto.Salud, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 6.98, intent: 'essential' },
    { id: '108', razonSocial: 'Uber', ruc: 'N/A', fecha: getDateString(14), total: 18.50, categoria: CategoriaGasto.Transporte, tipoComprobante: TipoComprobante.Otro, esFormal: true, ahorroPerdido: 0, igv: 2.82, intent: 'essential' },
    { id: '11', razonSocial: 'Alquiler de Departamento', ruc: '10456789012', fecha: getDateString(15), total: 1500.00, categoria: CategoriaGasto.Vivienda, tipoComprobante: TipoComprobante.ReciboArrendamiento, esFormal: true, ahorroPerdido: 0, igv: 0, intent: 'essential' },
    { id: '12', razonSocial: 'Tottus', ruc: '20508565934', fecha: getDateString(18), total: 210.40, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 32.09, intent: 'essential' },
    { id: '109', razonSocial: 'Renovación de DNI', ruc: 'N/A', fecha: getDateString(20), total: 30.00, categoria: CategoriaGasto.Servicios, tipoComprobante: TipoComprobante.Otro, esFormal: true, ahorroPerdido: 0, igv: 0, intent: 'essential' },
    { id: '110', razonSocial: 'Concierto', ruc: 'N/A', fecha: getDateString(22), total: 250.00, categoria: CategoriaGasto.Ocio, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 45.00, igv: 0, intent: 'desired' },
    { id: '111', razonSocial: 'Libros (El Virrey)', ruc: '20100069213', fecha: getDateString(25), total: 120.00, categoria: CategoriaGasto.Educacion, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 18.31, intent: 'desired' },
    { id: '112', razonSocial: 'Ropa (H&M)', ruc: '20546931103', fecha: getDateString(28), total: 189.90, categoria: CategoriaGasto.Consumos, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 28.96, intent: 'desired' },
    { id: '113', razonSocial: 'Donación', ruc: 'N/A', fecha: getDateString(30), total: 50.00, categoria: CategoriaGasto.Otros, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 0, igv: 0, intent: 'desired' },
    { id: '114', razonSocial: 'Spotify', ruc: 'N/A', fecha: getDateString(32), total: 19.90, categoria: CategoriaGasto.Ocio, tipoComprobante: TipoComprobante.Otro, esFormal: true, ahorroPerdido: 0, igv: 3.04, intent: 'desired' },
    { id: '115', razonSocial: 'Visita al Dentista', ruc: '10451234567', fecha: getDateString(35), total: 180.00, categoria: CategoriaGasto.Salud, tipoComprobante: TipoComprobante.ReciboHonorariosElectronico, esFormal: true, ahorroPerdido: 0, igv: 0, intent: 'essential' },
    { id: '116', razonSocial: 'Saga Falabella', ruc: '20100128056', fecha: getDateString(40), total: 350.00, categoria: CategoriaGasto.Consumos, tipoComprobante: TipoComprobante.BoletaVentaElectronica, esFormal: true, ahorroPerdido: 0, igv: 53.39, intent: 'desired' },
    { id: '117', razonSocial: 'Menú de fin de semana', ruc: 'N/A', fecha: getDateString(42), total: 25.00, categoria: CategoriaGasto.Alimentacion, tipoComprobante: TipoComprobante.SinComprobante, esFormal: false, ahorroPerdido: 4.5, igv: 0, intent: 'desired' },
    { id: '118', razonSocial: 'Sedapal', ruc: '20100152356', fecha: getDateString(45), total: 65.50, categoria: CategoriaGasto.Servicios, tipoComprobante: TipoComprobante.ReciboServiciosPublicos, esFormal: true, ahorroPerdido: 0, igv: 9.99, intent: 'essential' },
];
// --- END DEMO DATA ---


interface ExpensesContextType {
    expenses: Expense[];
    totalExpenses: number;
    totalAhorroPerdido: number;
    formalityIndex: number;
    formalityIndexByCount: number;
    fwi_v2: number;
    fwi_v2_components: FwiComponents;
    addExpense: (newExpenseData: ExpenseData & { imageUrl?: string }) => Expense;
    updateExpense: (expenseId: string, updatedData: Partial<ExpenseData>) => void;
    deleteExpense: (expenseId: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

// --- Gamification Constants for "Surprise Harvest" ---
const SURPRISE_HARVEST_CHANCE = 0.15; // 15% chance
const SURPRISE_BONUS_MIN = 50;
const SURPRISE_BONUS_MAX = 100;

export const ExpensesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    
    const { user, updateUserProgress, addTreevus, updateUserStreak } = useAuth();
    const { openModal } = useModal();
    const { addNotification, lastNotificationTimes } = useNotifications();
    const { goals } = useGoals();
    const { setAlert } = useAlert();
    const { updateMissionProgress } = useTribes();

    useEffect(() => {
        try {
            const savedExpenses = localStorage.getItem('treevu-expenses');
            if (savedExpenses) {
                setExpenses(JSON.parse(savedExpenses));
            } else {
                // Load demo data if nothing is in localStorage
                setExpenses(initialExpenses);
            }
        } catch (e) { 
            console.error("Failed to parse expenses from localStorage, loading demo data.", e); 
            setExpenses(initialExpenses);
        }
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            localStorage.setItem('treevu-expenses', JSON.stringify(expenses));
        } catch (e) { console.error("Failed to save expenses to localStorage", e); }
    }, [expenses, isInitialLoad]);

    const totalExpenses = useMemo(() => expenses.reduce((sum, expense) => sum + expense.total, 0), [expenses]);
    const totalAhorroPerdido = useMemo(() => expenses.reduce((sum, expense) => sum + expense.ahorroPerdido, 0), [expenses]);
    const totalFormalExpenses = useMemo(() => expenses.filter(e => e.esFormal).reduce((sum, expense) => sum + expense.total, 0), [expenses]);
    const formalityIndex = useMemo(() => totalExpenses > 0 ? (totalFormalExpenses / totalExpenses) * 100 : 0, [totalFormalExpenses, totalExpenses]);
    const formalityIndexByCount = useMemo(() => {
        if (expenses.length === 0) return 100;
        const formalCount = expenses.filter(e => e.esFormal).length;
        return (formalCount / expenses.length) * 100;
    }, [expenses]);
    
    // FWI 2.0 Calculation
    const { fwi_v2, fwi_v2_components } = useMemo(() => {
        const formalityScore = formalityIndex / 100;

        const leisureSpending = expenses
            .filter(e => e.categoria === CategoriaGasto.Ocio)
            .reduce((sum, e) => sum + e.total, 0);
        
        const essentialSpendingForBalance = expenses
            .filter(e => [CategoriaGasto.Transporte, CategoriaGasto.Alimentacion].includes(e.categoria))
            .reduce((sum, e) => sum + e.total, 0);

        const workLifeBalanceScore = essentialSpendingForBalance > 0 
            ? Math.min(1, (leisureSpending / essentialSpendingForBalance) * 2) 
            : 0.5;

        const selfDevSpending = expenses
            .filter(e => e.categoria === CategoriaGasto.Educacion)
            .reduce((sum, e) => sum + e.total, 0);
        
        const selfDevScore = Math.min(1, selfDevSpending / 100);

        const components: FwiComponents = {
            financialHealth: { name: 'Salud Financiera', value: formalityScore * 100, weight: 0.5 },
            workLifeBalance: { name: 'Balance Vida-Trabajo', value: workLifeBalanceScore * 100, weight: 0.3 },
            selfDevelopment: { name: 'Desarrollo Profesional', value: selfDevScore * 100, weight: 0.2 },
        };

        const score = (formalityScore * components.financialHealth.weight) + 
                      (workLifeBalanceScore * components.workLifeBalance.weight) + 
                      (selfDevScore * components.selfDevelopment.weight);

        return { fwi_v2: score * 100, fwi_v2_components: components };
    }, [expenses, formalityIndex]);

    useEffect(() => {
        if (isInitialLoad) return;
        updateUserProgress({
            expensesCount: expenses.length,
            formalityIndex: fwi_v2,
        });
    }, [expenses.length, fwi_v2, isInitialLoad, updateUserProgress]);
    
    const addExpense = useCallback((newExpenseData: ExpenseData & { imageUrl?: string }) => {
        const isFirstExpense = expenses.length === 0;

        const newExpense: Expense = {
            id: generateUniqueId(),
            ...newExpenseData
        };
        const updatedExpenses = [newExpense, ...expenses];
        setExpenses(updatedExpenses);

        // --- Telemetry (Result): Track successful action from stimulus ---
        const activeStimulusRaw = sessionStorage.getItem('active_stimulus');
        if (activeStimulusRaw) {
            const activeStimulus = JSON.parse(activeStimulusRaw);
            if (activeStimulus.id === 'bonus_formal_expense' && newExpense.esFormal) {
                trackEvent('stimulus_responded', { 
                    stimulusId: activeStimulus.id,
                    result: 'success',
                    timeToConvert_ms: Date.now() - activeStimulus.shownAt,
                }, user);
                sessionStorage.removeItem('active_stimulus'); // Track only once
            }
        }

        triggerInAppNotificationChecks(updatedExpenses, goals, addNotification, lastNotificationTimes);

        const treevusEarned = calculateTreevusForAction('add_expense', { expense: newExpense });
        let streakBonus = 0;
        let firstExpenseBonus = 0;
        let surpriseBonus = 0;

        if (isFirstExpense) {
            firstExpenseBonus = 75;
        }

        if (newExpense.esFormal && user) {
            if(user.tribeId) {
                updateMissionProgress(user.tribeId, 'formalExpenseCount', 1);
            }
            const today = new Date();
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);
            const todayString = today.toISOString().split('T')[0];
            const yesterdayString = yesterday.toISOString().split('T')[0];
            const lastStreakDate = user.streak?.lastDate || '';
            let newStreakCount = user.streak?.count || 0;

            if (lastStreakDate !== todayString) {
                if (lastStreakDate === yesterdayString) {
                    newStreakCount++;
                } else {
                    newStreakCount = 1;
                }
                updateUserStreak({ count: newStreakCount, lastDate: todayString });
                
                if (newStreakCount >= STREAK_BONUS_CONFIG.MIN_STREAK_FOR_BONUS) {
                    streakBonus = Math.min(
                        STREAK_BONUS_CONFIG.MAX_BONUS,
                        (newStreakCount - 1) * STREAK_BONUS_CONFIG.MULTIPLIER
                    );
                }
            }
            
            // --- Cosecha Sorpresa Logic ---
            if (Math.random() < SURPRISE_HARVEST_CHANCE) {
                surpriseBonus = Math.floor(Math.random() * (SURPRISE_BONUS_MAX - SURPRISE_BONUS_MIN + 1)) + SURPRISE_BONUS_MIN;
            }
        }
        
        const totalTreevus = treevusEarned + streakBonus + firstExpenseBonus + surpriseBonus;
        if (totalTreevus > 0) addTreevus(totalTreevus);

        const infoAction = { text: '¿Qué son?', onClick: () => openModal('treevusInfo') };

        if (surpriseBonus > 0) {
            setAlert({ message: `✨ ¡Cosecha Sorpresa! Ganaste un bono de <strong>+${totalTreevus} treevüs</strong>.`, type: 'success', action: infoAction });
        } else if (isFirstExpense) {
            setAlert({ message: `¡Tu primer brote! Ganaste <strong>+${totalTreevus} treevüs</strong> por tu primer registro.`, type: 'success', action: infoAction });
        } else if (streakBonus > 0) {
            const streakCount = (user?.streak?.count || 0) + 1;
            addNotification({ type: NotificationType.StreakBonus, title: `¡Racha de ${streakCount} días!`, message: `¡Felicidades! Ganaste ${totalTreevus} treevüs de bonificación por tu constancia.` });
            setAlert({ message: `¡Racha de ${streakCount} días! Ganaste <strong>+${totalTreevus} treevüs</strong>.`, type: 'success', action: infoAction });
        } else {
             const message = `${newExpense.mensaje || '¡Gasto guardado!'} (<strong>+${totalTreevus} treevüs</strong> 🌿)`;
             setAlert({ message, type: 'success', action: infoAction });
        }

        if (!newExpense.esFormal && newExpense.ahorroPerdido > 0) {
            sendInformalExpenseNotification(newExpense);
        }
        return newExpense;
    }, [expenses, user, goals, addTreevus, updateUserStreak, setAlert, addNotification, lastNotificationTimes, openModal, updateMissionProgress]);

    const updateExpense = useCallback((expenseId: string, updatedData: Partial<ExpenseData>) => {
        setExpenses(prev => prev.map(expense => expense.id === expenseId ? { ...expense, ...updatedData } : expense));
    }, []);

    const deleteExpense = useCallback((expenseId: string) => {
        setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    }, []);
    
    const value = useMemo(() => ({
        expenses, totalExpenses, totalAhorroPerdido, formalityIndex, formalityIndexByCount,
        fwi_v2, fwi_v2_components,
        addExpense, updateExpense, deleteExpense
    }), [expenses, totalExpenses, totalAhorroPerdido, formalityIndex, formalityIndexByCount, fwi_v2, fwi_v2_components, addExpense, updateExpense, deleteExpense]);

    return (
        <ExpensesContext.Provider value={value}>
            {children}
        </ExpensesContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpensesContext);
    if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpensesProvider');
    }
    return context;
};
