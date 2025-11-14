import React from 'react';
import AspirationsWidget from './AspirationsWidget';
import StrategicInsights from './StrategicInsights';
import { EmployerEmployee } from '../../services/employerDataService';
import FinancialHabitsWidget from './FinancialHabitsWidget';

interface EmployerTalentViewProps {
    dashboardData: any;
    segmentEmployees: EmployerEmployee[];
    onOpenPromoteLessonModal: (lesson: { id: string, title: string }) => void;
    refs: {
        benefitsImpactRef: React.RefObject<HTMLDivElement>;
        aspirationsRef: React.RefObject<HTMLDivElement>;
        wellnessHeatmapRef: React.RefObject<HTMLDivElement>;
    };
}

const EmployerTalentView: React.FC<EmployerTalentViewProps> = ({ dashboardData, segmentEmployees, onOpenPromoteLessonModal, refs }) => {
    
    return (
         <div className="w-1/4 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 pb-28">
            <header>
                <h1 className="text-3xl font-bold">Análisis de Talento</h1>
                <p className="text-on-surface-secondary">
                    Convierte los datos de bienestar de tu equipo en una ventaja competitiva.
                </p>
            </header>

            {dashboardData.isEmpty ? (
                 <div className="text-center py-16 bg-surface rounded-2xl mt-6">
                    <h3 className="text-xl font-bold">Sin Datos para esta Selección</h3>
                    <p className="text-on-surface-secondary mt-2">No hay colaboradores que coincidan con los filtros actuales.</p>
                </div>
            ) : (
                <div className="space-y-6 animate-fade-in">
                    <div ref={refs.aspirationsRef}>
                        <StrategicInsights data={dashboardData} />
                    </div>
                    <div>
                        <FinancialHabitsWidget data={dashboardData} />
                    </div>
                    <div ref={refs.benefitsImpactRef}>
                         <AspirationsWidget data={dashboardData} segmentEmployees={segmentEmployees} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerTalentView;