
import React, { useState, useMemo, useEffect } from 'react';
import { LightBulbIcon, SparklesIcon, ArrowTopRightOnSquareIcon } from '../Icons';
import Tooltip from '../Tooltip';
import KpiCard from './KpiCard';
import { EmployerEmployee } from '../../services/employerDataService';
import { getAIGoalInsight } from '../../services/ai/employerService';
import { CategoriaGasto } from '../../types/common';

const GOAL_ICONS: { [key: string]: string } = {
    'Viaje': '✈️',
    'Educación': '🎓',
    'Vivienda': '🏠',
    'Fondo de Emergencia': '🛡️',
    'Otro': '✨',
};

interface AspirationsWidgetProps {
    data: any; // Aggregated data for the main segment
    segmentEmployees: EmployerEmployee[]; // Raw employee data for the main segment
}

const AspirationsWidget: React.FC<AspirationsWidgetProps> = ({ data, segmentEmployees }) => {
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [aiInsight, setAiInsight] = useState<{ insight: string; recommendation: string } | null>(null);
    const [isLoadingInsight, setIsLoadingInsight] = useState(false);

    const filteredSegmentData = useMemo(() => {
        const subSegment = departmentFilter === 'all'
            ? segmentEmployees
            : segmentEmployees.filter(e => e.department === departmentFilter);

        if (subSegment.length === 0) {
            return {
                goalAdoptionRate: 0,
                avgGoalProgress: 0,
                avgGoalAmount: 0,
                employeeCount: 0,
            };
        }

        const employeesWithGoals = subSegment.filter(e => e.goals && e.goals.length > 0);
        const goalAdoptionRate = (employeesWithGoals.length / subSegment.length) * 100;
        const allGoals = subSegment.flatMap(e => e.goals || []);
            
        const totalTargetAmount = allGoals.reduce((sum, goal) => sum + Number(goal.targetAmount || 0), 0);
        const avgGoalAmount = allGoals.length > 0 ? totalTargetAmount / allGoals.length : 0;
        
        const totalProgressSum = allGoals.reduce((sum, goal) => (Number(goal.targetAmount) > 0 ? sum + (Number(goal.currentAmount) / Number(goal.targetAmount)) : sum), 0);
        const avgGoalProgress = allGoals.length > 0 ? (totalProgressSum / allGoals.length) * 100 : 0;

        return {
            goalAdoptionRate,
            avgGoalProgress,
            avgGoalAmount,
            employeeCount: subSegment.length,
        };
    }, [segmentEmployees, departmentFilter]);

    const savingsByCategory = useMemo(() => {
        const subSegment = departmentFilter === 'all'
            ? segmentEmployees
            : segmentEmployees.filter(e => e.department === departmentFilter);

        if (subSegment.length === 0) return [];

        const savingsMap = subSegment.flatMap(e => e.goals || []).reduce((acc, goal) => {
            // FIX: Ensure currentAmount is treated as a number in the arithmetic operation.
            acc[goal.name] = (acc[goal.name] || 0) + Number(goal.currentAmount || 0);
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(savingsMap)
            .map(([category, amount]) => ({ category, amount }))
            // FIX: Ensure amount properties are treated as numbers for sorting.
            .sort((a, b) => Number(b.amount) - Number(a.amount));
    }, [segmentEmployees, departmentFilter]);
    
    useEffect(() => {
        const fetchInsight = async () => {
            if (savingsByCategory.length === 0 && filteredSegmentData.employeeCount === 0) {
                setAiInsight(null);
                return;
            }
            setIsLoadingInsight(true);
            try {
                const insight = await getAIGoalInsight(
                    savingsByCategory,
                    departmentFilter === 'all' ? 'Toda la empresa' : departmentFilter,
                    filteredSegmentData.employeeCount
                );
                setAiInsight(insight);
            } catch (error) {
                console.error("Error fetching AI goal insight:", error);
                setAiInsight(null);
            } finally {
                setIsLoadingInsight(false);
            }
        };

        const timer = setTimeout(fetchInsight, 300); // Debounce
        return () => clearTimeout(timer);
    }, [savingsByCategory, departmentFilter, filteredSegmentData.employeeCount]);

    const { goalAdoptionRate, avgGoalProgress, avgGoalAmount } = filteredSegmentData;
    // FIX: Ensure item.amount is treated as a number in the arithmetic operation.
    const totalSavings = savingsByCategory.reduce((sum, item) => sum + Number(item.amount || 0), 0);

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="aspirations-widget-tooltip" text="Analiza las metas y aspiraciones de tu equipo. Usa estos insights para crear beneficios personalizados y predecir necesidades de desarrollo profesional." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                <LightBulbIcon className="w-6 h-6 mr-2 text-primary" />
                Análisis de Metas y Aspiraciones
            </h3>
            
            <div className="space-y-6">
                 <div>
                    <p className="text-sm text-on-surface-secondary my-4">
                        Las aspiraciones de tu equipo son un predictor clave del compromiso. Analiza cómo están planificando su futuro y qué es lo que más valoran.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <KpiCard
                            title="ADOPCIÓN DE METAS"
                            value={goalAdoptionRate.toFixed(0)}
                            valueSuffix="%"
                            tooltipText="Porcentaje de colaboradores que han creado al menos una meta de ahorro."
                            variant={goalAdoptionRate > 60 ? 'success' : goalAdoptionRate > 40 ? 'warning' : 'danger'}
                            history={data.goalAdoptionRateHistory}
                        />
                        <KpiCard
                            title="PROGRESO PROMEDIO"
                            value={avgGoalProgress.toFixed(0)}
                            valueSuffix="%"
                            tooltipText="Promedio de completitud de todas las metas de ahorro activas."
                            variant="default"
                            history={data.avgGoalProgressHistory}
                        />
                        <KpiCard
                            title="META PROMEDIO"
                            value={`S/ ${(avgGoalAmount / 1000).toFixed(1)}`}
                            valueSuffix="k"
                            tooltipText="El valor promedio que los colaboradores se proponen ahorrar para sus metas."
                            variant="default"
                            history={data.avgGoalAmountHistory}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico */}
                    <div className="bg-background rounded-xl p-4 flex flex-col">
                        <h4 className="font-bold text-on-surface mb-3">Distribución del Ahorro por Objetivo</h4>
                        
                        {savingsByCategory.length > 0 ? (
                            <div className="space-y-3 flex-grow">
                                {savingsByCategory.slice(0, 4).map(item => {
                                    const percentage = totalSavings > 0 ? (Number(item.amount) / totalSavings) * 100 : 0;
                                    return (
                                        <div key={item.category}>
                                            <div className="flex justify-between items-center text-sm mb-1">
                                                <span className="font-semibold text-on-surface flex items-center">
                                                    <span className="text-lg mr-2">{GOAL_ICONS[item.category] || '✨'}</span>
                                                    {item.category}
                                                </span>
                                                <span className="font-bold text-on-surface-secondary">S/ {Number(item.amount).toLocaleString('es-PE', { maximumFractionDigits: 0 })}</span>
                                            </div>
                                            <div className="h-2 w-full bg-active-surface rounded-full">
                                                <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }}></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center text-center text-on-surface-secondary text-sm">
                                <p>No hay ahorros registrados para metas en este segmento.</p>
                            </div>
                        )}
                    </div>

                    {/* Análisis IA */}
                    <div className="bg-background/50 rounded-lg p-4 flex flex-col justify-center">
                        {isLoadingInsight ? (
                            <div className="animate-pulse space-y-2">
                                <div className="h-3 w-1/4 bg-active-surface rounded"></div>
                                <div className="h-3 w-full bg-active-surface rounded"></div>
                                <div className="h-3 w-3/4 bg-active-surface rounded"></div>
                            </div>
                        ) : aiInsight ? (
                            <div className="space-y-2">
                                 <div>
                                    <p className="text-xs font-bold text-on-surface-secondary mb-1 flex items-center">
                                        <SparklesIcon className="w-4 h-4 mr-1 text-primary"/>
                                        Diagnóstico IA:
                                    </p>
                                    <p className="text-sm text-on-surface font-semibold italic">"{aiInsight.insight}"</p>
                                </div>
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <p className="text-xs font-bold text-primary mb-1 flex items-center">
                                         <ArrowTopRightOnSquareIcon className="w-4 h-4 mr-1"/>
                                        Acción Sugerida:
                                    </p>
                                    <p className="text-sm text-on-surface">{aiInsight.recommendation}</p>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AspirationsWidget;