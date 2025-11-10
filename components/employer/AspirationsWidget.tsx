



import React, { useState, useMemo, useEffect } from 'react';
import { LightBulbIcon, SparklesIcon, ArrowTopRightOnSquareIcon } from '../Icons';
import Tooltip from '../Tooltip';
import KpiCard from './KpiCard';
// FIX: Corrected import path for DEPARTMENTS.
import { EmployerEmployee } from '../../services/employerDataService';
import { DEPARTMENTS } from '../../types/employer';
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
                topGoalCategories: [],
                employeeCount: 0,
            };
        }

        const employeesWithGoals = subSegment.filter(e => e.goals && e.goals.length > 0);
        const goalAdoptionRate = (employeesWithGoals.length / subSegment.length) * 100;
        const allGoals = subSegment.flatMap(e => e.goals || []);
        
        const goalCounts = allGoals.reduce((acc, goal) => {
            acc[goal.name] = (acc[goal.name] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        const topGoalCategories = Object.entries(goalCounts)
            .map(([category, count]) => ({ category, count }))
            .sort((a, b) => b.count - a.count);
            
        const totalTargetAmount = allGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
        const avgGoalAmount = allGoals.length > 0 ? totalTargetAmount / allGoals.length : 0;
        const totalProgressSum = allGoals.reduce((sum, goal) => (goal.targetAmount > 0 ? sum + (goal.currentAmount / goal.targetAmount) : sum), 0);
        const avgGoalProgress = allGoals.length > 0 ? (totalProgressSum / allGoals.length) * 100 : 0;

        return {
            goalAdoptionRate,
            avgGoalProgress,
            avgGoalAmount,
            topGoalCategories,
            employeeCount: subSegment.length,
        };
    }, [segmentEmployees, departmentFilter]);
    
    useEffect(() => {
        const fetchInsight = async () => {
            if (filteredSegmentData.topGoalCategories.length === 0 && filteredSegmentData.employeeCount === 0) {
                setAiInsight(null);
                return;
            }
            setIsLoadingInsight(true);
            try {
                const insight = await getAIGoalInsight(
                    filteredSegmentData.topGoalCategories,
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
    }, [filteredSegmentData, departmentFilter]);

    const { goalAdoptionRate, avgGoalProgress, avgGoalAmount, topGoalCategories } = filteredSegmentData;
    // FIX: Explicitly type the accumulator in the reduce function to `number` to resolve a TypeScript type inference issue.
    const totalGoalsInFilteredSegment = topGoalCategories.reduce((sum: number, item) => sum + item.count, 0);

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="aspirations-widget-tooltip" text="Analiza las metas y aspiraciones de tu equipo. Usa estos insights para crear beneficios personalizados y predecir necesidades de desarrollo profesional." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <LightBulbIcon className="w-6 h-6 mr-2 text-primary" />
                Análisis de Metas y Ahorro
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Columna Izquierda: KPIs */}
                <div className="space-y-4">
                    <KpiCard
                        title="ADOPCIÓN DE METAS"
                        value={`${goalAdoptionRate.toFixed(0)}%`}
                        description="Colaboradores con al menos una meta activa."
                        tooltipText="Porcentaje de colaboradores que han creado al menos una meta de ahorro."
                        variant={goalAdoptionRate > 60 ? 'success' : goalAdoptionRate > 40 ? 'warning' : 'danger'}
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <KpiCard
                            title="PROGRESO PROMEDIO"
                            value={`${avgGoalProgress.toFixed(0)}%`}
                            description="Avance promedio hacia la meta."
                            tooltipText="Promedio de completitud de todas las metas de ahorro activas."
                            variant="default"
                        />
                        <KpiCard
                            title="META PROMEDIO"
                            value={`S/\u00A0${(avgGoalAmount / 1000).toFixed(1)}k`}
                            description="Monto objetivo promedio de las metas."
                            tooltipText="El valor promedio que los colaboradores se proponen ahorrar para sus metas."
                            variant="default"
                        />
                    </div>
                </div>

                {/* Columna Derecha: Gráfico y Análisis IA */}
                <div className="bg-background rounded-xl p-4 flex flex-col">
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="font-bold text-on-surface">Principales Objetivos</h4>
                        <select
                            value={departmentFilter}
                            onChange={(e) => setDepartmentFilter(e.target.value)}
                            className="bg-surface border border-active-surface text-on-surface-secondary text-xs rounded-lg focus:ring-primary focus:border-primary block p-1.5"
                        >
                            <option value="all">Ver todos</option>
                            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    
                    {topGoalCategories.length > 0 ? (
                        <div className="space-y-3 flex-grow">
                            {topGoalCategories.slice(0, 4).map(item => {
                                const percentage = totalGoalsInFilteredSegment > 0 ? (item.count / totalGoalsInFilteredSegment) * 100 : 0;
                                return (
                                    <div key={item.category} className="space-y-1">
                                        <div className="flex justify-between items-center text-sm font-semibold">
                                            <span className="flex items-center gap-2">{GOAL_ICONS[item.category] || '🎯'} {item.category}</span>
                                            <span>{item.count}</span>
                                        </div>
                                        <div className="h-2 w-full bg-active-surface rounded-full">
                                            <div className="h-2 rounded-full bg-primary" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-center text-sm text-on-surface-secondary">
                           <p>No se encontraron metas de ahorro en este segmento.</p>
                        </div>
                    )}
                    
                    <div className="mt-4 pt-4 border-t border-active-surface/50">
                        <h4 className="font-bold text-on-surface mb-2 flex items-center">
                            <SparklesIcon className="w-5 h-5 mr-1.5 text-primary" />
                            Análisis IA
                        </h4>
                        {isLoadingInsight ? (
                            <div className="space-y-2 animate-pulse">
                                <div className="h-3 w-full bg-active-surface rounded"></div>
                                <div className="h-3 w-2/3 bg-active-surface rounded"></div>
                            </div>
                        ) : aiInsight ? (
                            <div className="space-y-2">
                                <p className="text-sm text-on-surface"><strong className="text-on-surface-secondary">Diagnóstico:</strong> {aiInsight.insight}</p>
                                <p className="text-sm text-on-surface"><strong className="text-primary">Acción Sugerida:</strong> {aiInsight.recommendation}</p>
                            </div>
                        ) : (
                            <p className="text-sm text-on-surface-secondary">No hay suficientes datos para un análisis detallado.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AspirationsWidget;