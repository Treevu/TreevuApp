
import React from 'react';
import { BuildingBlocksIcon } from '../Icons';
import KpiCard from './KpiCard';
import Tooltip from '../Tooltip';
import { EmployerEmployee } from '../../services/employerDataService';

interface AspirationsWidgetProps {
    data: any;
    segmentEmployees: EmployerEmployee[];
}

const AspirationsWidget: React.FC<AspirationsWidgetProps> = ({ data, segmentEmployees }) => {
    const { goalAdoptionRate, avgGoalProgress, avgGoalAmount, topGoalCategories, goalAdoptionRateHistory } = data;

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="aspirations-widget-tooltip" text="Analiza las metas de ahorro del equipo. Entender sus aspiraciones es clave para alinear los beneficios y la comunicación." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <BuildingBlocksIcon className="w-6 h-6 mr-2 text-primary" />
                Aspiraciones del Equipo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard
                    title="ADOPCIÓN DE METAS"
                    value={goalAdoptionRate.toFixed(0)}
                    valueSuffix="%"
                    history={goalAdoptionRateHistory}
                    tooltipText="Porcentaje de colaboradores que han establecido al menos una meta de ahorro."
                    variant={goalAdoptionRate > 60 ? 'success' : 'warning'}
                />
                <KpiCard
                    title="PROGRESO PROMEDIO"
                    value={avgGoalProgress.toFixed(0)}
                    valueSuffix="%"
                    tooltipText="Progreso promedio de todas las metas de ahorro activas del equipo."
                    variant="default"
                />
                <KpiCard
                    title="MONTO PROMEDIO"
                    value={`S/ ${(avgGoalAmount / 1000).toFixed(1)}k`}
                    tooltipText="Monto promedio de las metas de ahorro establecidas."
                    variant="default"
                />
            </div>
            {topGoalCategories && topGoalCategories.length > 0 && (
                 <div className="mt-4 pt-4 border-t border-active-surface/50">
                    <h4 className="font-semibold text-on-surface mb-2">Categorías de Metas Populares</h4>
                    <div className="flex flex-wrap gap-2">
                        {topGoalCategories.map((cat: any) => (
                             <div key={cat.category} className="bg-background text-sm font-semibold text-on-surface-secondary px-3 py-1 rounded-full">
                                {cat.category} ({cat.count})
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AspirationsWidget;
