import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Header from './Header';
import Alert from './Alert';
import OnboardingTour from './OnboardingTour';
import { useAuth } from './../contexts/AuthContext';
import { useAppContext } from './../contexts/AppContext';
import { useAlert } from './../contexts/AlertContext';
import WalletView from './WalletView';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { useModal } from './../contexts/ModalContext';
import DashboardView from './DashboardView';
import BottomNavBar from './BottomNavBar';
import { BanknotesIcon, HomeIcon, UserCircleIcon, StarIcon, PencilSquareIcon } from './Icons';
import ClubView from './ClubView';
import ProfileView from './ProfileView';
import { levelData } from '../services/gamificationService';

import { ActiveTab, CategoriaGasto } from '../types/common';
import { useModal as useAchievementModal } from '../contexts/ModalContext'; // Renamed to avoid conflict

type NavTabId = ActiveTab | 'registrar';


const AppContent: React.FC = () => {
    const { user } = useAuth();
    const { state: { expenses }, deleteExpense } = useAppContext();
    const { state: { budget } } = useAppContext();
    const { alert, setAlert } = useAlert();
    const { openModal, closeModal } = useModal();
    const { openModal: openAchievementModal } = useAchievementModal();
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
    const [categoryFilter, setCategoryFilter] = useState<CategoriaGasto | null>(null);
    
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    
    const dashboardContentRef = useRef<HTMLDivElement>(null);
    const registrarTabRef = useRef<HTMLButtonElement>(null);
    const inicioTabRef = useRef<HTMLButtonElement>(null);
    const billeteraTabRef = useRef<HTMLButtonElement>(null);
    const clubTabRef = useRef<HTMLButtonElement>(null);
    const perfilTabRef = useRef<HTMLButtonElement>(null);

    const swipeableTabs: ActiveTab[] = ['inicio', 'billetera', 'club', 'perfil'];

    const { swipeHandlers, swipeOffset, isSwiping } = useSwipeNavigation(activeTab, (newTab) => setActiveTab(newTab), swipeableTabs);
    
     const navTabs = useMemo(() => [
        { id: 'inicio' as const, ref: inicioTabRef, label: 'Inicio', Icon: HomeIcon },
        { id: 'billetera' as const, ref: billeteraTabRef, label: 'Billetera', Icon: BanknotesIcon },
        { id: 'registrar' as const, ref: registrarTabRef, label: 'Registro', Icon: PencilSquareIcon },
        { id: 'club' as const, ref: clubTabRef, label: 'Club', Icon: StarIcon },
        { id: 'perfil' as const, ref: perfilTabRef, label: 'Perfil', Icon: UserCircleIcon },
    ], []);

    const handleEndTour = useCallback(() => {
        setIsTourActive(false);
        setTourStep(0);
    }, []);

    const tourSteps = useMemo(() => {
        const registrarText = user?.hasCorporateCard
            ? "Usa el Registro para escanear los vouchers de tu tarjeta corporativa o añadir gastos manualmente. ¡Cada registro te acerca a tus metas y te da treevüs!"
            : "El botón de Registro es tu herramienta principal. Convierte cada gasto en un hallazgo, cada ahorro en un paso adelante. Captura, clasifica y conquista. ¡Pruébalo ahora!";

        return [
            { targetRef: dashboardContentRef, text: 'Este es tu Campamento Base. Tu centro de mando para la expedición. Monitorea tu presupuesto, el avance de tus proyectos y recibe consejos de tu brújula IA.', position: 'bottom' as const, tab: 'inicio' },
            { targetRef: billeteraTabRef, text: "Tu Billetera es el diario de tu expedición. Registra cada hallazgo y usa la búsqueda para rastrear tus movimientos en el mapa financiero.", position: 'top' as const, tab: 'billetera' },
            { targetRef: registrarTabRef, text: registrarText, position: 'top' as const, tab: 'billetera', isInteractive: true },
            { targetRef: clubTabRef, text: "Bienvenido al Club. Aquí tu expedición se vuelve colectiva. Colabora con tu escuadrón, compite en misiones y cosecha recompensas en el mercado.", position: 'top' as const, tab: 'club' },
            { targetRef: perfilTabRef, text: "Este es tu Perfil de Explorador. Aquí personalizas tu identidad, revisas tus logros y trazas tu ruta en la Senda del Conocimiento.", position: 'top' as const, tab: 'perfil' },
            { targetRef: null, text: '¡Estás listo, explorador! Ya conoces el terreno. Es hora de iniciar tu expedición y cultivar tu bienestar financiero.', position: 'bottom' as const, tab: 'perfil' },
        ];
    }, [user, dashboardContentRef, billeteraTabRef, registrarTabRef, clubTabRef, perfilTabRef]);

    const handleNextStep = useCallback(() => {
        const nextStepIndex = tourStep + 1;
        if (nextStepIndex < tourSteps.length) {
            const nextStep = tourSteps[nextStepIndex];
            if (nextStep.tab !== activeTab) {
                setActiveTab(nextStep.tab as ActiveTab);
                setTimeout(() => setTourStep(nextStepIndex), 350);
            } else {
                setTourStep(nextStepIndex);
            }
        } else {
            handleEndTour();
        }
    }, [tourStep, activeTab, handleEndTour, tourSteps]);

    const handlePrevStep = useCallback(() => {
        const prevStepIndex = tourStep - 1;
        if (prevStepIndex >= 0) {
            const prevStep = tourSteps[prevStepIndex];
            if (prevStep.tab !== activeTab) {
                setActiveTab(prevStep.tab as ActiveTab);
                setTimeout(() => setTourStep(prevStepIndex), 350);
            } else {
                setTourStep(prevStepIndex);
            }
        }
    }, [tourStep, activeTab, tourSteps]);
    
    const handleTabClick = useCallback((tab: NavTabId) => {
        if (tab === 'registrar') {
             const currentTourStep = tourSteps[tourStep];
             if (isTourActive && currentTourStep?.targetRef === registrarTabRef && currentTourStep.isInteractive) {
                handleNextStep();
            } else {
                openModal('addExpense', { initialAction: null });
            }
        } else {
            setActiveTab(tab);
        }
    }, [openModal, isTourActive, tourStep, handleNextStep, tourSteps, registrarTabRef]);

    // --- IMPLEMENTACIÓN: Logro Compartible (Level Up) ---
    const prevLevelRef = useRef(user?.level);
    useEffect(() => {
        if (user && prevLevelRef.current !== undefined && user.level > prevLevelRef.current) {
            openAchievementModal('achievementShare', {
                title: `¡Nuevo Nivel Alcanzado!`,
                subtitle: `Ahora eres un ${levelData[user.level].name}`,
                userName: user.name,
                userPicture: user.picture,
            });
        }
        prevLevelRef.current = user?.level;
    }, [user, openAchievementModal]);
    // --- FIN IMPLEMENTACIÓN ---

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'add_expense') {
            setTimeout(() => {
                openModal('addExpense', { initialAction: 'file', scanMode: 'receipt' });
            }, 500);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [openModal]);


    useEffect(() => {
        if (!user || !user.hasCompletedOnboarding) return; // Only show tour after onboarding wizard
        const tourCompleted = localStorage.getItem('treevu-tour-completed') === 'true';
        if (tourCompleted || expenses.length === 0) return;
        setTimeout(() => setIsTourActive(true), 1000);
    }, [user, expenses]);

    useEffect(() => {
        const totalExpensesThisMonth = expenses.filter(e => {
            const expenseDate = new Date(e.fecha);
            const today = new Date();
            return expenseDate.getFullYear() === today.getFullYear() && expenseDate.getMonth() === today.getMonth();
        }).reduce((sum, e) => sum + e.total, 0);

        setAlert(currentAlert => {
            if (budget === null || budget <= 0) return null;
            const percentage = (totalExpensesThisMonth / budget) * 100;
            if (percentage >= 100) {
                const message = "¡Presupuesto excedido! Has superado tu límite. Analicemos juntos tus gastos.";
                if (currentAlert?.message !== message) return { message, type: 'danger' };
            } else if (percentage >= 90) {
                const message = "¡Atención! Estás al 90% de tu límite. Considera frenar gastos no esenciales.";
                 if (currentAlert?.message !== message) return { message, type: 'warning' };
            }
            else if (currentAlert?.type === 'warning' || currentAlert?.type === 'danger') {
                return null;
            }
            return currentAlert;
        });
    }, [budget, expenses, setAlert]);
    
    const handleConfirmDelete = useCallback((expenseId: string) => {
        deleteExpense(expenseId);
        closeModal();
    }, [deleteExpense, closeModal]);

    const openConfirmDeleteModal = useCallback((expenseId: string) => {
        openModal('confirmDelete', { onConfirm: () => handleConfirmDelete(expenseId) });
    }, [openModal, handleConfirmDelete]);
    
    const handleEditExpense = useCallback((expenseId: string) => {
        const expense = expenses.find(e => e.id === expenseId);
        if (expense) {
            openModal('addExpense', { expenseToEdit: expense });
        }
    }, [expenses, openModal]);

    const handleClearFilter = useCallback(() => setCategoryFilter(null), []);

    const handleCategoryClick = useCallback((category: CategoriaGasto) => {
        setActiveTab('billetera');
        setCategoryFilter(category);
    }, []);

    const activeIndex = swipeableTabs.indexOf(activeTab);
    const transformValue = -activeIndex * 100;

    return (
        <div className="flex flex-col h-screen bg-background">
            <Header />
            
            <main className="flex-1 max-w-3xl w-full mx-auto flex flex-col overflow-hidden">
                <div className="px-4 pt-4">
                    {alert && <Alert message={alert.message} type={alert.type} onDismiss={() => setAlert(null)} action={alert.action} />}
                </div>

                <div className="flex-1 overflow-hidden relative">
                    <div 
                        {...swipeHandlers}
                        className="flex w-[400%] h-full absolute top-0 left-0"
                        style={{ 
                            transform: `translateX(calc(${transformValue / 4}% + ${swipeOffset}px))`,
                            transition: isSwiping ? 'none' : 'transform 0.3s ease-in-out'
                        }}
                    >
                        <div role="tabpanel" id="panel-inicio" aria-labelledby="tab-inicio" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <DashboardView 
                                dashboardContentRef={dashboardContentRef}
                                onCategoryClick={handleCategoryClick}
                            />
                        </div>
                        <div role="tabpanel" id="panel-billetera" aria-labelledby="tab-billetera" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <WalletView
                                expenses={expenses}
                                onDelete={openConfirmDeleteModal}
                                onEdit={handleEditExpense}
                                categoryFilter={categoryFilter}
                                onClearFilter={handleClearFilter}
                            />
                        </div>
                        <div role="tabpanel" id="panel-club" aria-labelledby="tab-club" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <ClubView />
                        </div>
                        <div role="tabpanel" id="panel-perfil" aria-labelledby="tab-perfil" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <ProfileView setActiveTab={setActiveTab} />
                        </div>
                    </div>
                </div>
            </main>
            
            <BottomNavBar
                tabs={navTabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
            />
            
            {isTourActive && tourSteps[tourStep] && (
                <OnboardingTour 
                    step={tourSteps[tourStep]}
                    currentStepIndex={tourStep}
                    totalSteps={tourSteps.length}
                    onNext={handleNextStep}
                    onPrev={handlePrevStep}
                    onSkip={handleEndTour}
                />
            )}
        </div>
    );
};


const MainApp: React.FC = () => {
    return (
        <AppContent />
    );
};

export default MainApp;