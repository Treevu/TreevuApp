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

type EmployerActiveTab = 'resumen' | 'talento' | 'cultura' | 'perfil';

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

    const tabs: EmployerActiveTab[] = ['resumen', 'talento', 'cultura', 'perfil'];
    
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
    const talentoTabRef = useRef<HTMLButtonElement>(null);
    const culturaTabRef = useRef<HTMLButtonElement>(null);
    const perfilTabRef = useRef<HTMLButtonElement>(null);


    const navTabs = useMemo(() => [
        { id: 'resumen' as const, ref: resumenTabRef, label: 'Resumen', Icon: HomeIcon },
        { id: 'talento' as const, ref: talentoTabRef, label: 'Talento', Icon: ChartPieIcon },
        { id: 'cultura' as const, ref: culturaTabRef, label: 'Cultura', Icon: HeartIcon },
        { id: 'perfil' as const, ref: perfilTabRef, label: 'Perfil', Icon: UserCircleIcon },
    ], [resumenTabRef, talentoTabRef, culturaTabRef, perfilTabRef]);

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
        { targetRef: dashboardContentRef, text: 'Bienvenido al Centro de Mando Estratégico. Esta vista de \'Resumen\' es el pulso en tiempo real del bienestar y el riesgo de tu equipo.', position: 'bottom' as const, tab: 'resumen' },
        { targetRef: fwiRef, text: "El FWI (Índice de Bienestar Financiero) es tu métrica cardinal. Mide la salud financiera integral y predice el comportamiento del talento.", position: 'bottom' as const, tab: 'resumen' },
        { targetRef: filtersRef, text: 'Los Filtros Estratégicos son tu microscopio. Segmenta los datos para descubrir patrones ocultos y oportunidades de intervención precisas.', position: 'bottom' as const, tab: 'resumen' },
        { targetRef: kpisRef, text: 'Desde esta matriz de KPIs, monitorea indicadores de alto nivel como el Riesgo de Fuga Predictivo y el ROI del Programa para una gestión proactiva.', position: 'top' as const, tab: 'resumen' },
        { targetRef: talentoTabRef, text: "La pestaña de 'Talento' es tu centro de inteligencia. Aquí, transformamos datos brutos en insights sobre impacto, hábitos y aspiraciones.", position: 'top' as const, tab: 'talento' },
        { targetRef: benefitsImpactRef, text: 'En la sección de Impacto, cuantifica el ROI de tus beneficios y su correlación directa con el FWI, probando el valor de tu inversión.', position: 'bottom' as const, tab: 'talento' },
        { targetRef: culturaTabRef, text: "La vista de 'Cultura' es tu caja de herramientas para el engagement. Lanza iniciativas, monitorea el reconocimiento y fortalece la moral del equipo.", position: 'top' as const, tab: 'cultura' },
        { targetRef: teamChallengesRef, text: "Las Iniciativas de Equipo son catalizadores de cambio. Úsalas para gamificar metas colectivas y potenciar KPIs específicos, con sugerencias de la IA.", position: 'bottom' as const, tab: 'cultura' },
        { targetRef: perfilTabRef, text: "Tu 'Perfil' es también el acceso a tu Asistente Estratégico IA. Gestiona tu cuenta y delega análisis complejos a Gemini.", position: 'top' as const, tab: 'perfil' },
        { targetRef: assistantBtnRef, text: 'Pruébalo. Solicita un análisis comparativo o que redacte un comunicado. Transforma datos en acción con una simple pregunta.', position: 'top' as const, tab: 'perfil', isInteractive: true },
        { targetRef: null, text: 'Has completado la inducción. Ahora posees la inteligencia para pilotar la estrategia de talento de tu organización. El puente de mando es tuyo.', position: 'bottom' as const, tab: 'perfil' },
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
    }, [tourStep, activeTab, handleEndTour, tourSteps]);
    
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
    }, [tourStep, activeTab, tourSteps]);
    
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
