import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Header from './Header';
import Alert from './Alert';
import OnboardingTour from './OnboardingTour';
import { useAuth } from './../contexts/AuthContext';
import { useExpenses } from './../contexts/ExpensesContext';
import { useBudget } from './../contexts/BudgetContext';
import { useAlert } from './../contexts/AlertContext';
import WalletView from './WalletView';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import DeveloperNotice from './DeveloperNotice';
import { useModal } from './../contexts/ModalContext';
import DashboardView from './DashboardView';
import BottomNavBar from './BottomNavBar';
import { BanknotesIcon, HomeIcon, UserCircleIcon, StarIcon, PencilSquareIcon } from './Icons';
import ClubView from './ClubView';
import ProfileView from './ProfileView';

import { ActiveTab, CategoriaGasto } from '../types/common';

type ScanMode = 'receipt' | 'products' | 'verify';
type NavTabId = ActiveTab | 'registrar';


const AppContent: React.FC = () => {
    const { user } = useAuth();
    const { expenses, deleteExpense, totalExpenses } = useExpenses();
    const { budget } = useBudget();
    const { alert, setAlert } = useAlert();
    const { openModal, closeModal } = useModal();
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('perfil');
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

    const swipeableTabs: ActiveTab[] = ['perfil', 'billetera', 'club', 'inicio'];
    
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
        { id: 'perfil' as const, ref: perfilTabRef, label: 'Perfil', Icon: UserCircleIcon },
        { id: 'billetera' as const, ref: billeteraTabRef, label: 'Billetera', Icon: BanknotesIcon },
        { id: 'registrar' as const, ref: registrarTabRef, label: 'Registrar', Icon: PencilSquareIcon },
        { id: 'club' as const, ref: clubTabRef, label: 'Club', Icon: StarIcon },
        { id: 'inicio' as const, ref: inicioTabRef, label: 'Inicio', Icon: HomeIcon },
    ], [perfilTabRef, billeteraTabRef, registrarTabRef, clubTabRef, inicioTabRef]);

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
        const tourCompleted = localStorage.getItem('treevu-tour-completed') === 'true';
        if (!user || tourCompleted) return;
        setTimeout(() => setIsTourActive(true), 500);
    }, [user]);

    useEffect(() => {
        setAlert(currentAlert => {
            if (budget === null || budget <= 0) return null;
            const percentage = (totalExpenses / budget) * 100;
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
    }, [budget, totalExpenses, setAlert]);

    const handleEndTour = useCallback(() => {
        setIsTourActive(false);
        setTourStep(0);
        localStorage.setItem('treevu-tour-completed', 'true');
    }, []);
    
    const tourSteps = useMemo(() => [
        { targetRef: perfilTabRef, text: "Bienvenido a tu perfil. Aquí gestionas tu cuenta, personalizas la app y accedes a contenido de aprendizaje.", position: 'top' as const, tab: 'perfil' },
        { targetRef: billeteraTabRef, text: "En 'Billetera' encontrarás el historial detallado de todos tus gastos. Usa la búsqueda para encontrar cualquier movimiento.", position: 'top' as const, tab: 'billetera' },
        { targetRef: registrarTabRef, text: "Este es el corazón de tu expedición. Transforma cada gasto en progreso real: sube una foto, registra una compra o celebra un ahorro. ¡Pruébalo!", position: 'top' as const, tab: 'billetera', isInteractive: true },
        { targetRef: clubTabRef, text: "Bienvenido al 'Club', el corazón social y de gamificación. ¡Compite con tu equipo y canjea premios!", position: 'top' as const, tab: 'club' },
        { targetRef: dashboardContentRef, text: 'Este es tu panel de "Inicio", el centro de mando de tu aventura financiera. Aquí tienes una vista rápida de tu presupuesto, metas y tus próximos pasos recomendados por la IA.', position: 'bottom' as const, tab: 'inicio' },
        { targetRef: null, text: '¡Todo listo! Ya sabes cómo moverte por treevü. ¡Es hora de empezar a cultivar tus finanzas!', position: 'bottom' as const, tab: 'inicio' },
    ], [perfilTabRef, billeteraTabRef, registrarTabRef, clubTabRef, dashboardContentRef]);


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
    }, [tourStep, activeTab, handleEndTour, tourSteps.length]);
    
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
                        <div role="tabpanel" id="panel-perfil" aria-labelledby="tab-perfil" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <ProfileView setActiveTab={setActiveTab} />
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
                        <div role="tabpanel" id="panel-inicio" aria-labelledby="tab-inicio" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <DashboardView 
                                dashboardContentRef={dashboardContentRef}
                                onCategoryClick={handleCategoryClick}
                            />
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


const MainApp: React.FC = () => {
    return (
        <AppContent />
    );
};

export default MainApp;