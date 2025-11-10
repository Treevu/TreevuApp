import React, { useState } from 'react';
import BenefitsImpactWidget from './BenefitsImpactWidget';
import AspirationsWidget from './AspirationsWidget';
import SpendingIntentBreakdown from './SpendingIntentBreakdown';
import WorkModalityWidget from './WorkModalityWidget';
import WellnessHeatmapWidget from './WellnessHeatmapWidget';
import AdoptionMetrics from './AdoptionMetrics';
import RewardCategoryDonutChart from './RewardCategoryDonutChart';
import LearningEngagementWidget from './LearningEngagementWidget';
import SubNavBar from '../SubNavBar';
import { GiftIcon, LightBulbIcon, SparklesIcon } from '../Icons';
import { EmployerEmployee } from '../../services/employerDataService';

interface EmployerAnalysisViewProps {
    dashboardData: any;
    segmentEmployees: EmployerEmployee[];
    onOpenPromoteLessonModal: (lesson: { id: string, title: string }) => void;
    refs: {
        benefitsImpactRef: React.RefObject<HTMLDivElement>;
        aspirationsRef: React.RefObject<HTMLDivElement>;
        wellnessHeatmapRef: React.RefObject<HTMLDivElement>;
    };
}

type AnalysisSubTab = 'impacto' | 'habitos' | 'adopcion';

const EmployerAnalysisView: React.FC<EmployerAnalysisViewProps> = ({ dashboardData, segmentEmployees, onOpenPromoteLessonModal, refs }) => {
    const [activeSubTab, setActiveSubTab] = useState<AnalysisSubTab>('impacto');

    const subTabs = [
        { id: 'impacto' as const, label: 'Impacto', Icon: GiftIcon },
        { id: 'habitos' as const, label: 'Hábitos y Patrones', Icon: LightBulbIcon },
        { id: 'adopcion' as const, label: 'Adopción', Icon: SparklesIcon },
    ];

    const renderContent = () => {
        switch (activeSubTab) {
            case 'impacto':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <div ref={refs.benefitsImpactRef}>
                            <BenefitsImpactWidget data={dashboardData} />
                        </div>
                        <div ref={refs.aspirationsRef}>
                            <AspirationsWidget data={dashboardData} segmentEmployees={segmentEmployees} />
                        </div>
                    </div>
                );
            case 'habitos':
                return (
                    <div className="space-y-6 animate-fade-in">
                        <SpendingIntentBreakdown data={dashboardData.essentialVsDesiredBreakdown} />
                        <WorkModalityWidget data={dashboardData.insightsByModality} />
                        <div ref={refs.wellnessHeatmapRef}>
                            <WellnessHeatmapWidget data={dashboardData.wellnessHeatmapData} />
                        </div>
                    </div>
                );
            case 'adopcion':
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                        <AdoptionMetrics
                            activationRate={dashboardData.activationRate}
                            avgSpendingPerUser={dashboardData.avgSpendingPerUser}
                            dashboardViews={dashboardData.dashboardViews}
                        />
                        <RewardCategoryDonutChart data={dashboardData.rewardCategoryDistribution} />
                        <div className="lg:col-span-2">
                             <LearningEngagementWidget 
                                data={dashboardData.learningEngagement} 
                                onPromote={onOpenPromoteLessonModal}
                             />
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };
    
    return (
         <div className="w-1/4 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 pb-28">
            <header>
                <h1 className="text-3xl font-bold">Análisis Profundo</h1>
                <p className="text-on-surface-secondary">
                    Explora los datos para encontrar insights, patrones y oportunidades.
                </p>
            </header>

            <SubNavBar tabs={subTabs} activeTab={activeSubTab} onTabClick={(tab) => setActiveSubTab(tab)} />
            
            {dashboardData.isEmpty ? (
                 <div className="text-center py-16 bg-surface rounded-2xl mt-6">
                    <h3 className="text-xl font-bold">Sin Datos para esta Selección</h3>
                    <p className="text-on-surface-secondary mt-2">No hay colaboradores que coincidan con los filtros actuales.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {renderContent()}
                </div>
            )}
        </div>
    );
};

export default EmployerAnalysisView;