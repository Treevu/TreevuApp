import React from 'react';
import { LightBulbIcon } from '../Icons';
import KpiCard from './KpiCard';
import SpendingIntentBreakdown from './SpendingIntentBreakdown';
import Tooltip from '../Tooltip';

interface FinancialHabitsWidgetProps {
    data: any;
}

const FinancialHabitsWidget: React.FC<FinancialHabitsWidgetProps> = ({ data }) => {
    const { 
        avgProfessionalDevelopmentSpending,
        avgWorkLifeBalanceSpending,
        essentialVsDesiredBreakdown,
        avgProfDevSpendingHistory,
        avgWlbSpendingHistory
    } = data;

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
             <div className="absolute top-4 right-4">
                <Tooltip id="financial-habits-tooltip" text="Estos indicadores conectan el comportamiento financiero con métricas de talento. Un alto gasto en 'Desarrollo' indica proactividad, mientras que el 'Balance' es un proxy de la satisfacción y el bienestar." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <LightBulbIcon className="w-6 h-6 mr-2 text-primary" />
                Hábitos Financieros del Talento
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
                <div className="space-y-4">
                    <KpiCard 
                        title="Inversión en Desarrollo" 
                        value={`S/ ${avgProfessionalDevelopmentSpending.toFixed(0)}`}
                        subValue="prom./colab."
                        history={avgProfDevSpendingHistory}
                        tooltipText="Gasto promedio por colaborador en la categoría 'Educación'. Un indicador clave de la inversión proactiva en crecimiento profesional."
                        variant="default"
                    />
                    <KpiCard 
                        title="Inversión en Balance"
                        value={`S/ ${avgWorkLifeBalanceSpending.toFixed(0)}`}
                        subValue="prom./colab."
                        history={avgWlbSpendingHistory}
                        tooltipText="Gasto promedio por colaborador en la categoría 'Ocio'. Un proxy para medir el balance vida-trabajo y la capacidad de desconexión."
                        variant="default"
                    />
                </div>
                <div>
                    <SpendingIntentBreakdown data={essentialVsDesiredBreakdown} />
                </div>
            </div>
        </div>
    );
};

export default FinancialHabitsWidget;