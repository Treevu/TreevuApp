import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import OnboardingTour from '../OnboardingTour';
import BottomNavBar from '../BottomNavBar';
import EmployerDashboardView from './EmployerDashboardView';
import EmployerAnalysisView from './EmployerTalentView'; // This is now 'Análisis' view
import EmployerCultureView from './EmployerStrategyView'; // This is now 'Cultura' view
import EmployerProfileView from './EmployerProfileView';
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation';
import { generateUniqueId } from '../../utils';
import { generateMockEmployees, calculateKpisForSegment, MOCK_CHALLENGES } from '../../services/employerDataService';
import { useModal } from '../../contexts/ModalContext';
import { Challenge } from '../../types/employer';
import { HomeIcon, ChartPieIcon, HeartIcon, UserCircleIcon } from '../Icons';


export type AdminUser = {
    name: string;
    role: 'admin';
};

export type AreaManagerUser = {
    name: string;
    role: 'area_manager';
    department: string;
};

export type CurrentUserType = AdminUser | AreaManagerUser;

interface EmployerDashboardProps {
    user: CurrentUserType;
    onSignOut: () => void;
}

type EmployerActiveTab = 'resumen' | 'analisis' | 'cultura' | 'perfil';

const EmployerDashboard: React.FC<EmployerDashboardProps> = ({ user, onSignOut }) => {
    const [employees] = useState(() => generateMockEmployees(195));
    const [selectedDepartment, setSelectedDepartment] = useState(
        user.role === 'area_manager' ? user.department : 'all'
    );
    const [selectedTenure, setSelectedTenure] = useState('all');
    const [selectedModality, setSelectedModality] = useState('all');
    const [selectedAgeRange, setSelectedAgeRange] = useState('all');
    const [challenges, setChallenges] = useState<Challenge[]>(MOCK_CHALLENGES);
    const { openModal, closeModal } = useModal();
    const [activeTab, setActiveTab] = useState<EmployerActiveTab>('resumen');

    const tabs: EmployerActiveTab[] = ['resumen', 'analisis', 'cultura', 'perfil'];
    
    const handleTabClick = useCallback((tab: EmployerActiveTab) => {
        setActiveTab(tab);
    }, []);

    const { swipeHandlers, swipeOffset, isSwiping } = useSwipeNavigation(activeTab, handleTabClick, tabs);

    const [isTourActive, setIsTourActive] = useState(false);
    const [tourStep, setTourStep] = useState(0);

    const dashboardContentRef = useRef<HTMLDivElement>(null);
    const filtersRef = useRef<HTMLDivElement>(null);
    const fwiRef = useRef<HTMLDivElement>(null);
    const kpisRef = useRef<HTMLDivElement>(null);
    const riskChartRef = useRef<HTMLDivElement>(null);
    const areaComparisonRef = useRef<HTMLDivElement>(null);
    const benefitsImpactRef = useRef<HTMLDivElement>(null);
    const aspirationsRef = useRef<HTMLDivElement>(null);
    const teamChallengesRef = useRef<HTMLDivElement>(null);
    const wellnessHeatmapRef = useRef<HTMLDivElement>(null);
    const assistantBtnRef = useRef<HTMLButtonElement>(null);

    const resumenTabRef = useRef<HTMLButtonElement>(null);
    const analisisTabRef = useRef<HTMLButtonElement>(null);
    const culturaTabRef = useRef<HTMLButtonElement>(null);
    const perfilTabRef = useRef<HTMLButtonElement>(null);


    const navTabs = useMemo(() => [
        { id: 'resumen' as const, ref: resumenTabRef, label: 'Resumen', Icon: HomeIcon },
        { id: 'analisis' as const, ref: analisisTabRef, label: 'Análisis', Icon: ChartPieIcon },
        { id: 'cultura' as const, ref: culturaTabRef, label: 'Cultura', Icon: HeartIcon },
        { id: 'perfil' as const, ref: perfilTabRef, label: 'Perfil', Icon: UserCircleIcon },
    ], [resumenTabRef, analisisTabRef, culturaTabRef, perfilTabRef]);

    const filteredEmployees = useMemo(() => {
        return employees.filter(e => 
            (selectedDepartment === 'all' || e.department === selectedDepartment) &&
            (selectedTenure === 'all' || e.tenure === selectedTenure) &&
            (selectedModality === 'all' || e.modality === selectedModality) &&
            (selectedAgeRange === 'all' || e.ageRange === selectedAgeRange)
        );
    }, [employees, selectedDepartment, selectedTenure, selectedModality, selectedAgeRange]);

    const dashboardData = useMemo(() => {
        return calculateKpisForSegment(filteredEmployees);
    }, [filteredEmployees]);

    useEffect(() => {
        const tourCompleted = localStorage.getItem('treevu-employer-tour-completed') === 'true';
        if (tourCompleted) return;
        setTimeout(() => setIsTourActive(true), 1000);
    }, []);

    const tourSteps = [
        { targetRef: dashboardContentRef, text: '¡Bienvenido al Dashboard Estratégico! Este es tu "Resumen", donde tienes una vista completa de la salud financiera de tu equipo.', position: 'bottom' as const, tab: 'resumen' },
        { targetRef: fwiRef, text: "Todo gira en torno al FWI (Índice de Bienestar Financiero). Es tu métrica 'Estrella del Norte' para medir la salud del segmento que has elegido.", position: 'bottom' as const, tab: 'resumen' },
        { targetRef: filtersRef, text: 'Usa estos filtros para explorar los datos. Segmenta por área o antigüedad para descubrir insights profundos y comparar el bienestar entre grupos.', position: 'bottom' as const, tab: 'resumen' },
        { targetRef: kpisRef, text: 'Monitorea los KPIs más importantes de un vistazo, como el riesgo de fuga y el retorno de inversión (ROI) de tu programa de beneficios.', position: 'top' as const, tab: 'resumen' },
        { targetRef: analisisTabRef, text: "Ahora, exploremos 'Análisis', tu centro neurálgico para explorar TODOS los datos sobre impacto, hábitos y adopción.", position: 'top' as const, tab: 'analisis' },
        { targetRef: benefitsImpactRef, text: 'Mide el impacto directo de tu programa de beneficios, desde la tasa de canje hasta su correlación con el bienestar.', position: 'bottom' as const, tab: 'analisis' },
        { targetRef: culturaTabRef, text: "En 'Cultura' encontrarás herramientas para fomentar el engagement, como las iniciativas de equipo y el ranking de reconocimiento.", position: 'top' as const, tab: 'cultura' },
        { targetRef: teamChallengesRef, text: "Lanza 'Iniciativas' para motivar a tu equipo a alcanzar metas colectivas. Puedes usar la IA para obtener sugerencias y hacerlas más efectivas.", position: 'bottom' as const, tab: 'cultura' },
        { targetRef: perfilTabRef, text: "Finalmente, en 'Perfil' gestionas tu cuenta y accedes al Asistente Estratégico de IA, tu aliado para análisis complejos.", position: 'top' as const, tab: 'perfil' },
        { targetRef: assistantBtnRef, text: 'Pruébalo ahora. Pide a nuestra IA análisis o borradores de comunicados, todo basado en los datos de tu equipo.', position: 'top' as const, tab: 'perfil', isInteractive: true },
        { targetRef: null, text: '¡Has completado el recorrido! Ahora tienes las herramientas para potenciar el bienestar y la estrategia de tu equipo. ¡Adelante!', position: 'bottom' as const, tab: 'perfil' },
    ];
    
    const handleEndTour = useCallback(() => {
        setIsTourActive(false);
        setTourStep(0);
        localStorage.setItem('treevu-employer-tour-completed', 'true');
        setActiveTab('resumen');
    }, []);

    const handleNextStep = useCallback(() => {
        const nextStepIndex = tourStep + 1;
        if (nextStepIndex < tourSteps.length) {
            const nextStep = tourSteps[nextStepIndex];
            if (nextStep.tab !== activeTab) {
                setActiveTab(nextStep.tab as EmployerActiveTab);
                setTimeout(() => setTourStep(nextStepIndex), 350);
            } else {
                setTourStep(nextStepIndex);
            }
        } else {
            handleEndTour();
        }
    }, [tourStep, activeTab, handleEndTour]);
    
     const handlePrevStep = useCallback(() => {
        const prevStepIndex = tourStep - 1;
        if (prevStepIndex >= 0) {
            const prevStep = tourSteps[prevStepIndex];
            if (prevStep.tab !== activeTab) {
                setActiveTab(prevStep.tab as EmployerActiveTab);
                setTimeout(() => setTourStep(prevStepIndex), 350);
            } else {
                setTourStep(prevStepIndex);
            }
        }
    }, [tourStep, activeTab]);
    
    const handleCreateChallenge = useCallback((newChallengeData: Omit<Challenge, 'id'>) => {
        const newChallenge: Challenge = {
            id: generateUniqueId(),
            ...newChallengeData,
        };
        setChallenges(prev => [newChallenge, ...prev]);
        closeModal();
    }, [closeModal]);
    
    const openCreateChallengeModal = useCallback((suggestion?: Omit<Challenge, 'id'>) => {
        openModal('createChallenge', { onSave: handleCreateChallenge, suggestion });
    }, [openModal, handleCreateChallenge]);

    const handlePromoteLesson = useCallback((lesson: {id: string, title: string}, bonus: number) => {
        const newChallenge: Challenge = {
            id: generateUniqueId(),
            title: `Lección Promocionada: ${lesson.title}`,
            description: `Completa la lección "${lesson.title}" para ganar un bono especial y potenciar tu conocimiento.`,
            targetMetric: 'financialWellnessIndex', // Or a new metric like 'lessonCompletion'
            targetValue: dashboardData.kpisByDepartment.find((d:any) => d.department === 'all')?.lessonCompletionRate > 80 ? 95 : 80, // Target a high completion rate
            department: 'all',
            reward: `Bono de ${bonus} treevüs por completar`,
        };
        setChallenges(prev => [newChallenge, ...prev]);
        closeModal();
    }, [closeModal, dashboardData]);

    const openPromoteLessonModal = useCallback((lesson: {id: string, title: string}) => {
        openModal('promoteLesson', { onSave: (bonus) => handlePromoteLesson(lesson, bonus), lesson });
    }, [openModal, handlePromoteLesson]);
    
    const activeIndex = tabs.indexOf(activeTab);
    const transformValue = -activeIndex * 100;

    return (
        <div className="flex flex-col h-screen bg-background">
            <main className="flex-1 max-w-7xl w-full mx-auto flex flex-col overflow-hidden">
                 <div 
                    {...swipeHandlers}
                    className="flex w-[400%] h-full"
                    style={{ 
                        transform: `translateX(calc(${transformValue / 4}% + ${swipeOffset}px))`,
                        transition: isSwiping ? 'none' : 'transform 0.3s ease-in-out'
                    }}
                >
                    <EmployerDashboardView
                        user={user}
                        dashboardData={dashboardData}
                        filters={{ selectedDepartment, selectedTenure, selectedModality, selectedAgeRange }}
                        setFilters={{ setSelectedDepartment, setSelectedTenure, setSelectedModality, setSelectedAgeRange }}
                        refs={{ dashboardContentRef, filtersRef, fwiRef, kpisRef, riskChartRef, areaComparisonRef }}
                        activeTab={activeTab}
                        onSignOut={onSignOut}
                    />
                    <EmployerAnalysisView
                        dashboardData={dashboardData}
                        segmentEmployees={filteredEmployees}
                        onOpenPromoteLessonModal={openPromoteLessonModal}
                        refs={{ benefitsImpactRef, aspirationsRef, wellnessHeatmapRef }}
                    />
                    <EmployerCultureView
                        dashboardData={dashboardData}
                        challenges={challenges}
                        onOpenCreateChallengeModal={openCreateChallengeModal}
                        refs={{ teamChallengesRef }}
                    />
                    <EmployerProfileView
                        user={user}
                        dashboardData={dashboardData}
                        refs={{ assistantBtnRef }}
                        onTourInteraction={handleNextStep}
                        isTourActiveStep={isTourActive && tourSteps[tourStep]?.isInteractive}
                    />
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

export default EmployerDashboard;