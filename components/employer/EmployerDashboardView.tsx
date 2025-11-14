import React, { useState, useEffect, useMemo } from 'react';
import PrivacyDisclaimer from './PrivacyDisclaimer';
import KpiCard from './KpiCard';
import { type CurrentUserType } from '../../types/employer';
import EmployerExportButton from './EmployerExportButton';
import FilterDrawer from './FilterDrawer';
import { AdjustmentsHorizontalIcon, ArrowLeftIcon, BuildingBlocksIcon, SparklesIcon, GiftIcon } from '../Icons';
import { useModal } from '../../contexts/ModalContext';
import { Challenge } from '../../types/employer';
import AreaComparisonChart from './AreaComparisonChart';
import CategoryBreakdown from './CategoryBreakdown';

interface EmployerDashboardViewProps {
    user: CurrentUserType;
    dashboardData: any;
    companyWideKpis: any[];
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
        areaComparisonRef: React.RefObject<HTMLDivElement>;
    };
    activeTab: 'resumen' | 'talento' | 'engagement' | 'perfil';
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
    companyWideKpis,
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

    const getFlightRiskVariant = (risk: 'Bajo' | 'Medio' | 'Alto') => {
        if (risk === 'Bajo') return 'success';
        if (risk === 'Medio') return 'warning';
        return 'danger';
    };
    
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
    
    const {
        flightRiskHistory,
        fwiHistory,
        activationRateHistory
    } = dashboardData;


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
                     <div ref={refs.kpisRef} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <KpiCard
                            title="FWI PROMEDIO"
                            value={dashboardData.financialWellnessIndex.toFixed(0)}
                            tooltipText="El Índice de Bienestar Financiero (FWI) es la métrica principal que resume la salud financiera del equipo."
                            variant={dashboardData.financialWellnessIndex > 75 ? 'success' : dashboardData.financialWellnessIndex > 60 ? 'warning' : 'danger'}
                            history={fwiHistory}
                        />
                        <KpiCard
                            title="RIESGO DE FUGA"
                            value={dashboardData.talentFlightRisk}
                            subValue={`${dashboardData.flightRiskScore.toFixed(0)}%`}
                            tooltipText="Estimación del riesgo de pérdida de talento basada en indicadores de bienestar financiero."
                            variant={getFlightRiskVariant(dashboardData.talentFlightRisk)}
                            history={flightRiskHistory}
                        />
                        <KpiCard
                            title="TASA DE ACTIVACIÓN"
                            value={dashboardData.activationRate.toFixed(0)}
                            valueSuffix="%"
                            tooltipText="Porcentaje de colaboradores del segmento que han iniciado sesión y registrado al menos una actividad."
                            variant={dashboardData.activationRate > 80 ? 'success' : dashboardData.activationRate > 60 ? 'warning' : 'danger'}
                            history={activationRateHistory}
                        />
                    </div>
                    
                    {/* Charts Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div ref={refs.areaComparisonRef}>
                            <AreaComparisonChart
                                data={companyWideKpis.map(d => ({ label: d.department, value: d.fwi || 0 }))}
                            />
                        </div>
                        <div>
                            <CategoryBreakdown data={dashboardData.spendingByCategory} />
                        </div>
                    </div>
                    
                    <PrivacyDisclaimer />
                </div>
            )}
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
