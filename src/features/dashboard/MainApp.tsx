import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Header from '@/components/layout/Header';
import Alert from '@/components/ui/Alert';
import OnboardingTour from '@/features/profile/OnboardingTour';
import { useExpenses, useBudget, useAlert } from '@/hooks/useZustandCompat';
import { useZustandModal } from '@/components/modals/ZustandModalRenderer';
import WalletView from '@/features/wallet/WalletView';
import { useSwipeNavigation } from '@/hooks/useSwipeNavigation';
import DeveloperNotice from '@/features/notifications/DeveloperNotice';
import DashboardView from './DashboardView';
import BottomNavBar from '@/components/layout/BottomNavBar';
import { BanknotesIcon, HomeIcon, UserCircleIcon, StarIcon, PencilSquareIcon } from '@/components/ui/Icons';
import ClubView from '@/features/social/ClubView';
import ProfileView from '@/features/profile/ProfileView';

import { ActiveTab, CategoriaGasto } from '@/types/common';

type ScanMode = 'receipt' | 'products' | 'verify';
type NavTabId = ActiveTab | 'registrar';


const MainApp: React.FC = () => {
    // Zustand hooks de compatibilidad
    const { expenses, deleteExpense, totalExpenses } = useExpenses();
    const { budget } = useBudget();
    const { alert, setAlert } = useAlert();
    const { openModal, closeModal } = useZustandModal();
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
    const [categoryFilter, setCategoryFilter] = useState<CategoriaGasto | null>(null);
    
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);
    
    // --- Refs for Tour ---
    const headerRef = useRef<HTMLDivElement>(null);
    const dashboardContentRef = useRef<HTMLDivElement>(null);
    const registrarTabRef = useRef<HTMLButtonElement>(null);
    const inicioTabRef = useRef<HTMLButtonElement>(null); // Now Inicio tab
    const billeteraTabRef = useRef<HTMLButtonElement>(null);
    const clubTabRef = useRef<HTMLButtonElement>(null);
    const perfilTabRef = useRef<HTMLButtonElement>(null);

    const swipeableTabs: ActiveTab[] = ['inicio', 'billetera', 'club', 'perfil'];
    
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
    }, [openModal, isTourActive, tourStep]);

    const { swipeHandlers, swipeOffset, isSwiping } = useSwipeNavigation(activeTab, (newTab) => setActiveTab(newTab), swipeableTabs);
    
     const navTabs = useMemo(() => [
        { id: 'inicio' as const, ref: inicioTabRef, label: 'Inicio', Icon: HomeIcon },
        { id: 'billetera' as const, ref: billeteraTabRef, label: 'Billetera', Icon: BanknotesIcon },
        { id: 'registrar' as const, ref: registrarTabRef, label: 'Registro', Icon: PencilSquareIcon },
        { id: 'club' as const, ref: clubTabRef, label: 'Club', Icon: StarIcon },
        { id: 'perfil' as const, ref: perfilTabRef, label: 'Perfil', Icon: UserCircleIcon },
    ], [inicioTabRef, billeteraTabRef, registrarTabRef, clubTabRef, perfilTabRef]);

    // Handle PWA shortcut
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('action') === 'add_expense') {
            // A small delay to ensure the UI is ready
            setTimeout(() => {
                openModal('addExpense', { initialAction: 'file', scanMode: 'receipt' });
            }, 500);
            // Clean up URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }, [openModal]);


    useEffect(() => {
        if (budget === null || budget <= 0) {
            setAlert(null);
            return;
        }
        
        const percentage = (totalExpenses / budget) * 100;
        if (percentage >= 100) {
            const message = "¡Presupuesto excedido! Has superado tu límite. Analicemos juntos tus gastos.";
            if (alert?.message !== message) {
                setAlert({ message, type: 'danger' });
            }
        } else if (percentage >= 90) {
            const message = "¡Atención! Estás al 90% de tu límite. Considera frenar gastos no esenciales.";
            if (alert?.message !== message) {
                setAlert({ message, type: 'warning' });
            }
        } else if (alert?.type === 'warning' || alert?.type === 'danger') {
            setAlert(null);
        }
    }, [budget, totalExpenses, alert, setAlert]);

    const handleEndTour = useCallback(() => {
        setIsTourActive(false);
        setTourStep(0);
        localStorage.setItem('treevu-tour-completed', 'true');
    }, []);
    
    const tourSteps = useMemo(() => [
        { targetRef: dashboardContentRef, text: 'Este es tu Campamento Base. Tu centro de mando para la expedición. Monitorea tu presupuesto, el avance de tus proyectos y recibe consejos de tu brújula IA.', position: 'bottom' as const, tab: 'inicio' },
        { targetRef: billeteraTabRef, text: "Tu Billetera es el diario de tu expedición. Registra cada hallazgo y usa la búsqueda para rastrear tus movimientos en el mapa financiero.", position: 'top' as const, tab: 'billetera' },
        { targetRef: registrarTabRef, text: "El botón de Registro es tu herramienta principal. Convierte cada gasto en un hallazgo, cada ahorro en un paso adelante. Captura, clasifica y conquista. ¡Pruébalo ahora!", position: 'top' as const, tab: 'billetera', isInteractive: true },
        { targetRef: clubTabRef, text: "Bienvenido al Club. Aquí tu expedición se vuelve colectiva. Colabora con tu escuadrón, compite en misiones y cosecha recompensas en el mercado.", position: 'top' as const, tab: 'club' },
        { targetRef: perfilTabRef, text: "Este es tu Perfil de Explorador. Aquí personalizas tu identidad, revisas tus logros y trazas tu ruta en la Senda del Conocimiento.", position: 'top' as const, tab: 'perfil' },
        { targetRef: null, text: '¡Estás listo, explorador! Ya conoces el terreno. Es hora de iniciar tu expedición y cultivar tu bienestar financiero.', position: 'bottom' as const, tab: 'perfil' },
    ], [dashboardContentRef, billeteraTabRef, registrarTabRef, clubTabRef, perfilTabRef]);


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
            <div ref={headerRef}>
                <Header />
            </div>
            
            <main className="flex-1 w-full mx-auto flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden relative">
                    <div className="mx-4 my-4">
                        {alert && <Alert message={alert.message} type={alert.type} autoDismiss={true} onDismiss={() => setAlert(null)} action={alert.action} />}
                    </div>
                    <div 
                        {...swipeHandlers}
                        className="flex w-[400%] h-full absolute top-0 left-0 mt-4"
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
            
            <DeveloperNotice />
        </div>
    );
};

export default MainApp;