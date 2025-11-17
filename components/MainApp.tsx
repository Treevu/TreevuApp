

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
import { BanknotesIcon, UsersIcon, GiftIcon, HomeIcon } from './Icons';
import ClubView from './ClubView';
import { levelData, badgeData, Badge, BadgeType } from '../services/gamificationService';
import FloatingActionButton from './FloatingActionButton';
import RewardsView from './RewardsView';
import QandAView from './QandAView';
import { getAIWeeklySummary } from '../services/ai/employeeService';
import { useNotifications } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';

import { ActiveTab, CategoriaGasto } from '../types/common';
import { useModal as useAchievementModal } from '../contexts/ModalContext'; // Renamed to avoid conflict

type NavTabId = ActiveTab;


const AppContent: React.FC = () => {
    const { user, updateUser } = useAuth();
    const { state: { expenses }, deleteExpense } = useAppContext();
    const { state: { budget } } = useAppContext();
    const { alert, setAlert } = useAlert();
    const { openModal, closeModal } = useModal();
    const { openModal: openAchievementModal } = useAchievementModal();
    const { addNotification } = useNotifications();
    
    const [activeTab, setActiveTab] = useState<ActiveTab>('inicio');
    const [categoryFilter, setCategoryFilter] = useState<CategoriaGasto | null>(null);
    
    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);

    const [isFabMenuOpen, setIsFabMenuOpen] = useState(false);
    
    const dashboardContentRef = useRef<HTMLDivElement>(null);
    const inicioTabRef = useRef<HTMLButtonElement>(null);
    const billeteraTabRef = useRef<HTMLButtonElement>(null);
    const comunidadTabRef = useRef<HTMLButtonElement>(null);
    const tiendaTabRef = useRef<HTMLButtonElement>(null);

    const swipeableTabs: ActiveTab[] = ['inicio', 'billetera', 'tienda', 'comunidad'];

    const { swipeHandlers, swipeOffset, isSwiping } = useSwipeNavigation(activeTab, (newTab) => setActiveTab(newTab), swipeableTabs);
    
     const navTabs = useMemo(() => [
        { id: 'inicio' as const, ref: inicioTabRef, label: 'Inicio', Icon: HomeIcon },
        { id: 'billetera' as const, ref: billeteraTabRef, label: 'Billetera', Icon: BanknotesIcon },
        { id: 'tienda' as const, ref: tiendaTabRef, label: 'Tienda', Icon: GiftIcon },
        { id: 'comunidad' as const, ref: comunidadTabRef, label: 'Squad', Icon: UsersIcon },
    ], [inicioTabRef, billeteraTabRef, tiendaTabRef, comunidadTabRef]);

    const activeTabLabel = useMemo(() => {
        return navTabs.find(tab => tab.id === activeTab)?.label || 'treevü';
    }, [activeTab, navTabs]);

    const handleEndTour = useCallback(() => {
        setIsTourActive(false);
        setTourStep(0);
        localStorage.setItem('treevu-tour-completed', 'true');
    }, []);

    const tourSteps = useMemo(() => {
        return [
            { targetRef: dashboardContentRef, text: 'Este es tu Perfil. Tu centro de mando para la expedición. Monitorea tu presupuesto, el avance de tus proyectos y recibe consejos de tu brújula IA.', position: 'bottom' as const, tab: 'inicio' },
            { targetRef: billeteraTabRef, text: "Tu Billetera es el diario de tu expedición. Registra cada hallazgo y usa la búsqueda para rastrear tus movimientos en el mapa financiero.", position: 'top' as const, tab: 'billetera' },
            { targetRef: tiendaTabRef, text: "La Tienda es donde tu esfuerzo se materializa. Canjea tus treevüs por beneficios exclusivos de tu empresa y de nuestros aliados.", position: 'top' as const, tab: 'tienda' },
            { targetRef: comunidadTabRef, text: "Bienvenido al Squad. Aquí tu expedición se vuelve colectiva. Colabora con tu equipo, compite en misiones y cosecha recompensas en el mercado.", position: 'top' as const, tab: 'comunidad' },
            { targetRef: null, text: '¡Estás listo, explorador! Ya conoces el terreno. Es hora de iniciar tu expedición y cultivar tu bienestar financiero.', position: 'bottom' as const, tab: 'inicio' },
        ];
    }, [dashboardContentRef, billeteraTabRef, tiendaTabRef, comunidadTabRef]);

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
        setActiveTab(tab);
    }, []);

    // --- Badge Unlocking Logic ---
    useEffect(() => {
        if (!user) return;
        
        const currentBadges = new Set(user.badges || []);
        let newBadgesFound = false;

        Object.keys(badgeData).forEach(key => {
            const badgeKey = key as BadgeType;
            if (!currentBadges.has(badgeKey)) {
                if (badgeData[badgeKey].isUnlocked(user)) {
                    currentBadges.add(badgeKey);
                    newBadgesFound = true;
                    setAlert({
                        message: `¡Insignia Desbloqueada: <strong>${badgeData[badgeKey].title}</strong>!`,
                        type: 'success'
                    });
                }
            }
        });

        if (newBadgesFound) {
            updateUser({ badges: Array.from(currentBadges) });
        }
    }, [user, setAlert, updateUser]);


    // --- AI Weekly Summary Logic ---
    useEffect(() => {
        if (!user || expenses.length < 3) return;
        const now = new Date();
        const lastSummaryKey = `last-summary-${user.id}`;
        const lastSummaryDate = localStorage.getItem(lastSummaryKey);
        
        const oneWeek = 7 * 24 * 60 * 60 * 1000;
        
        if (!lastSummaryDate || (now.getTime() - new Date(lastSummaryDate).getTime()) > oneWeek) {
            const fetchSummary = async () => {
                const oneWeekAgo = new Date(now.getTime() - oneWeek);
                const lastWeekExpenses = expenses.filter(e => new Date(e.fecha) >= oneWeekAgo);

                if(lastWeekExpenses.length < 2) return;

                try {
                    const summary = await getAIWeeklySummary(user, lastWeekExpenses);
                    if(summary) {
                         addNotification({
                            type: NotificationType.WeeklySummary,
                            title: 'Tu Resumen Semanal IA',
                            message: summary,
                        });
                        localStorage.setItem(lastSummaryKey, now.toISOString());
                    }
                } catch(e) {
                    console.error("Failed to fetch weekly summary:", e);
                }
            };
            fetchSummary();
        }
    }, [user, expenses, addNotification]);


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
        if (!user || !user.hasCompletedOnboarding) return;
        const tourCompleted = localStorage.getItem('treevu-tour-completed') === 'true';
        if (tourCompleted) return;
        setTimeout(() => setIsTourActive(true), 1500);
    }, [user]);

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
                const message = "¡Presupuesto excedido! Has superado tu límite. Analicemos juntos tus movimientos.";
                if (currentAlert?.message !== message) return { message, type: 'danger' };
            } else if (percentage >= 90) {
                const message = "¡Atención! Estás al 90% de tu límite. Considera frenar movimientos no esenciales.";
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
        <div className="flex flex-col h-screen">
            <Header activeTabLabel={activeTabLabel} />
            
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
                        <div role="tabpanel" id="panel-tienda" aria-labelledby="tab-tienda" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <RewardsView />
                        </div>
                        <div role="tabpanel" id="panel-comunidad" aria-labelledby="tab-comunidad" className="w-1/4 h-full overflow-y-auto custom-scrollbar px-4 pb-28">
                            <ClubView />
                        </div>
                    </div>
                </div>
            </main>
            
            <FloatingActionButton isOpen={isFabMenuOpen} onClose={() => setIsFabMenuOpen(false)} />

            <BottomNavBar
                tabs={navTabs}
                activeTab={activeTab}
                onTabClick={handleTabClick}
                onFabClick={() => setIsFabMenuOpen(prev => !prev)}
                isFabMenuOpen={isFabMenuOpen}
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