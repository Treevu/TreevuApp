import React, { useState, useEffect, useMemo } from 'react';
import PrivacyDisclaimer from './PrivacyDisclaimer';
import FinancialWellnessIndexChart from './FinancialWellnessIndexChart';
import KpiCard from './KpiCard';
import { type CurrentUserType } from './EmployerDashboard';
import KpiMatrixWidget from './KpiMatrixWidget';
import RiskCorrelationChart from './RiskCorrelationChart';
import EmployerExportButton from './EmployerExportButton';
import { TOTAL_COMPANY_EMPLOYEES, DEPARTMENT_TOTALS } from '@/services/employerDataService';
import FilterDrawer from './FilterDrawer';
import { AdjustmentsHorizontalIcon, ArrowLeftIcon, BuildingBlocksIcon, SparklesIcon } from '@/components/ui/Icons';
import { useModal } from '@/contexts/ModalContext';
import { Challenge } from '@/types/employer';

interface EmployerDashboardViewProps {
    user: CurrentUserType;
    dashboardData: any;
    filters: {
        selectedDepartment: string;
        selectedTenure: string;
        selectedModality: string;
        selectedAgeRange: string;
    };
    setFilters: {
        setSelectedDepartment: (value: string) => void;
        setSelectedTenure: (value: string) => void;
        setSelectedModality: (value: string) => void;
        setSelectedAgeRange: (value: string) => void;
    };
    refs: {
        dashboardContentRef: React.RefObject<HTMLDivElement>;
        filtersRef: React.RefObject<HTMLDivElement>;
        fwiRef: React.RefObject<HTMLDivElement>;
        kpisRef: React.RefObject<HTMLDivElement>;
        riskChartRef: React.RefObject<HTMLDivElement>;
        areaComparisonRef: React.RefObject<HTMLDivElement>; // This ref will now point to the KpiMatrixWidget
    };
    activeTab: 'resumen' | 'talento' | 'cultura' | 'perfil';
    onSignOut: () => void;
    onOpenCreateChallengeModal: (suggestion?: Omit<Challenge, 'id'>) => void;
}

const EmptyState: React.FC = () => (
    <div className="text-center py-16 bg-surface rounded-2xl mt-6">
        <h3 className="text-xl font-bold">Sin Datos para esta Selección</h3>
        <p className="text-on-surface-secondary mt-2">No hay colaboradores que coincidan con los filtros actuales.</p>
    </div>
);

const EmployerDashboardView: React.FC<EmployerDashboardViewProps> = ({
    user,
    dashboardData,
    filters,
    setFilters,
    refs,
    activeTab,
    onSignOut,
    onOpenCreateChallengeModal,
}) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const { openModal } = useModal();

    useEffect(() => {
        if (activeTab !== 'resumen') {
            setIsDrawerOpen(false);
        }
    }, [activeTab]);

    const getRoiVariant = (roi: number) => {
        if (roi >= 2) return 'success';
        if (roi >= 1) return 'warning';
        return 'danger';
    };

    const getFlightRiskVariant = (risk: 'Bajo' | 'Medio' | 'Alto') => {
        if (risk === 'Bajo') return 'success';
        if (risk === 'Medio') return 'warning';
        return 'danger';
    };

    const getActivationVariant = (rate: number) => {
        if (rate >= 80) return 'success';
        if (rate >= 60) return 'warning';
        return 'danger';
    }
    
    const getActiveFilterSummary = () => {
        const activeFilters = [];
        if(filters.selectedDepartment !== 'all') activeFilters.push(filters.selectedDepartment);
        if(filters.selectedTenure !== 'all') activeFilters.push(filters.selectedTenure);
        if(filters.selectedModality !== 'all') activeFilters.push(filters.selectedModality);
        if(filters.selectedAgeRange !== 'all') activeFilters.push(filters.selectedAgeRange);

        if(activeFilters.length === 0) return 'Toda la empresa';
        if(activeFilters.length > 2) return `${activeFilters.slice(0, 2).join(', ')} y ${activeFilters.length - 2} más...`;
        return activeFilters.join(', ');
    }
    
    const { activationRateData, totalSegmentEmployees } = useMemo(() => {
        const totalEmployees = filters.selectedDepartment === 'all'
            ? TOTAL_COMPANY_EMPLOYEES
            : DEPARTMENT_TOTALS[filters.selectedDepartment as keyof typeof DEPARTMENT_TOTALS] || dashboardData.filteredActiveEmployees;

        const rate = totalEmployees > 0
            ? (dashboardData.filteredActiveEmployees / totalEmployees) * 100
            : 0;

        const isCapped = rate > 100;
        const displayRate = Math.min(100, rate);

        const value = isCapped
            ? `${displayRate.toFixed(0)}%+`
            : `${displayRate.toFixed(0)}%`;
            
        let tooltip = "Porcentaje de colaboradores en este segmento que han activado y están usando la plataforma treevü.";
        if (isCapped) {
            tooltip = `¡Excelente adopción! Se detectaron más usuarios activos que el total esperado (${rate.toFixed(0)}%). Esto puede deberse a nuevas contrataciones. El valor se muestra como 100%+ para mantener la consistencia visual.`;
        }

        return {
            activationRateData: {
                value,
                tooltip,
                rate,
            },
            totalSegmentEmployees: totalEmployees
        };
    }, [filters.selectedDepartment, dashboardData.filteredActiveEmployees]);


    return (
        <div className="w-1/4 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 pb-28">
            <header>
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold">Resumen Estratégico</h1>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => openModal('strategicReport', { dashboardData, user })}
                            disabled={dashboardData.isEmpty}
                            className="flex items-center text-sm font-bold text-primary bg-primary/20 px-3 py-2 rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Generar informe estratégico"
                        >
                            <BuildingBlocksIcon className="w-5 h-5 mr-1.5" />
                            Informe Estratégico
                        </button>
                        <EmployerExportButton data={dashboardData} />
                        <button
                            onClick={onSignOut}
                            className="flex items-center text-sm font-semibold text-danger hover:opacity-80 transition-opacity"
                            aria-label="Cerrar sesión"
                        >
                            <ArrowLeftIcon className="w-5 h-5 mr-1.5" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
                <p className="text-on-surface-secondary">
                    Hola, <span className="font-bold text-primary">{user.name}</span>. Bienvenido al Centro de Mando. Aquí tienes el pulso de tu equipo en tiempo real.
                </p>
            </header>

            <div ref={refs.filtersRef} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <button 
                    onClick={() => setIsDrawerOpen(true)}
                    disabled={user.role === 'area_manager'}
                    className="w-full flex items-center justify-between p-3 bg-surface rounded-xl text-left hover:bg-active-surface transition-colors shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-surface"
                >
                    <div className="flex items-center min-w-0">
                        <AdjustmentsHorizontalIcon className="w-6 h-6 mr-3 text-primary flex-shrink-0"/>
                        <div className="min-w-0">
                            <span className="font-bold text-on-surface">Filtros Activos</span>
                            <p className="text-xs text-on-surface-secondary truncate">
                               {getActiveFilterSummary()}
                            </p>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-primary flex-shrink-0 ml-2">Editar</span>
                </button>

                 <button
                    onClick={() => openModal('impactSimulator', { dashboardData: dashboardData, onLaunch: onOpenCreateChallengeModal })}
                    disabled={dashboardData.isEmpty}
                    className="w-full flex items-center justify-between p-3 bg-surface rounded-xl text-left hover:bg-active-surface transition-colors shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-surface"
                >
                    <div className="flex items-center min-w-0">
                        <SparklesIcon className="w-6 h-6 mr-3 text-primary flex-shrink-0"/>
                        <div className="min-w-0">
                            <span className="font-bold text-on-surface">Simulador de Impacto</span>
                            <p className="text-xs text-on-surface-secondary truncate">
                               Proyecta el ROI de tus iniciativas
                            </p>
                        </div>
                    </div>
                    <span className="text-sm font-bold text-primary flex-shrink-0 ml-2">Probar</span>
                </button>

                {user.role === 'area_manager' && (
                    <p className="text-xs text-on-surface-secondary text-center mt-2 px-2 md:col-span-2">
                        Los filtros están deshabilitados para este rol. Visualizas los datos de tu área: <strong>{user.department}</strong>.
                    </p>
                )}
            </div>
            
            {dashboardData.isEmpty ? <EmptyState /> : (
                <div ref={refs.dashboardContentRef} className="space-y-6">
                    {/* KPIs Row */}
                     <div ref={refs.kpisRef} className="grid grid-cols-2 gap-6">
                        <KpiCard
                            title="Riesgo de Fuga"
                            value={dashboardData.talentFlightRisk}
                            description="Riesgo de renuncia basado en FWI y balance."
                            tooltipText="Estimación del riesgo de pérdida de talento basada en indicadores de bienestar financiero."
                            variant={getFlightRiskVariant(dashboardData.talentFlightRisk)}
                        />
                        <KpiCard
                            title="ROI del Programa"
                            value={`${dashboardData.roiMultiplier.toFixed(1)}x`}
                            description={`S/${dashboardData.roiMultiplier.toFixed(2)} canjeados por c/ S/1 invertido.`}
                            tooltipText="Mide el retorno de la inversión basado en el valor de beneficios canjeados versus el costo del programa."
                            variant={getRoiVariant(dashboardData.roiMultiplier)}
                        />
                        <KpiCard
                            title="Tasa de Activación"
                            value={activationRateData.value}
                            description={`${dashboardData.filteredActiveEmployees} de ${totalSegmentEmployees} colaboradores usan la app.`}
                            tooltipText={activationRateData.tooltip}
                            variant={getActivationVariant(activationRateData.rate)}
                        />
                        <KpiCard
                            title="Velocidad de Acumulación"
                            value={dashboardData.earnVelocity.toFixed(0)}
                            description="Treevüs promedio/colab."
                            tooltipText="Mide el ritmo de engagement. Una velocidad alta indica que los empleados están adoptando activamente hábitos financieros saludables."
                            variant='default'
                        />
                    </div>

                    {/* Main Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div ref={refs.fwiRef} className="h-full">
                            <FinancialWellnessIndexChart
                                score={dashboardData.financialWellnessIndex}
                                components={dashboardData.fwiComponents}
                                history={dashboardData.fwiHistory}
                                companyAverage={dashboardData.companyWideFwi}
                            />
                        </div>
                        <div ref={refs.riskChartRef} className="h-full">
                           <RiskCorrelationChart
                                data={dashboardData.kpisByDepartment}
                                currentSegmentName={filters.selectedDepartment === 'all' ? 'Empresa' : filters.selectedDepartment}
                           />
                        </div>
                    </div>

                    {/* Secondary Charts Row */}
                    <div className="grid grid-cols-1 gap-6">
                        <div ref={refs.areaComparisonRef} className="h-full">
                             <KpiMatrixWidget data={dashboardData.kpisByDepartment} />
                        </div>
                    </div>
                </div>
            )}
            <PrivacyDisclaimer />
            
            <FilterDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
                filters={filters}
                setFilters={setFilters}
                userRole={user.role}
                userDepartment={user.role === 'area_manager' ? user.department : undefined}
            />
        </div>
    );
};

export default EmployerDashboardView;
