



import React from 'react';
import AspirationsWidget from './AspirationsWidget';
import StrategicInsights from './StrategicInsights';
import { EmployerEmployee } from '../../services/employerDataService';
import FinancialHabitsWidget from './FinancialHabitsWidget';
import LearningEngagementWidget from './LearningEngagementWidget';
import { CurrentUserType } from '../../types/employer';
import UpgradePlanCTA from '../UpgradePlanCTA';
import { SparklesIcon, ChartPieIcon } from '../Icons';
import Logo from '../Logo';
import TreevuLogoText from '../TreevuLogoText';

interface EmployerTalentViewProps {
    user: CurrentUserType;
    dashboardData: any;
    segmentEmployees: EmployerEmployee[];
    onOpenPromoteLessonModal: (lesson: { id: string, title: string }) => void;
    refs: {
        benefitsImpactRef: React.RefObject<HTMLDivElement>;
        aspirationsRef: React.RefObject<HTMLDivElement>;
        wellnessHeatmapRef: React.RefObject<HTMLDivElement>;
    };
}

const EmployerTalentView: React.FC<EmployerTalentViewProps> = ({ user, dashboardData, segmentEmployees, onOpenPromoteLessonModal, refs }) => {
    
     if (user.plan === 'Launch') {
        return (
            <div className="w-1/4 h-full p-4 sm:p-6 flex items-center justify-center">
                <UpgradePlanCTA
                    Icon={ChartPieIcon}
                    title="Desbloquea el Análisis de Talento"
                    description="Actualiza al plan Crece para acceder a insights detallados sobre los hábitos financieros, aspiraciones y engagement de aprendizaje de tu equipo."
                    origin="business"
                />
            </div>
        );
    }

    return (
         <div className="w-1/4 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 pb-28">
            <header>
                <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold leading-tight -mb-1">
                            <TreevuLogoText />
                        </h1>
                        <p className="text-accent text-sm font-bold leading-none italic">
                            for business
                        </p>
                    </div>
                </div>
                <h2 className="text-3xl font-bold mt-4 treevu-text">Análisis de Talento</h2>
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
                    <div>
                        <FinancialHabitsWidget data={dashboardData} />
                    </div>
                     <div ref={refs.benefitsImpactRef}>
                         <AspirationsWidget data={dashboardData} segmentEmployees={segmentEmployees} />
                    </div>
                    <div>
                        <LearningEngagementWidget data={dashboardData.learningEngagement} onPromote={onOpenPromoteLessonModal} />
                    </div>
                    <div ref={refs.aspirationsRef}>
                        {user.plan === 'Enterprise' ? (
                            <StrategicInsights data={dashboardData} />
                        ) : (
                            <div className="bg-surface rounded-2xl p-5">
                                <UpgradePlanCTA
                                    Icon={SparklesIcon}
                                    title="Señales Estratégicas (IA)"
                                    description="Desbloquea diagnósticos y recomendaciones automáticas de la IA para tomar acciones preventivas y estratégicas."
                                    variant="transparent"
                                    origin="business"
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default EmployerTalentView;
