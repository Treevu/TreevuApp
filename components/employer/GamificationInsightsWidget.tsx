import React from 'react';
import { TrophyIcon, AcademicCapIcon, HandThumbUpIcon, UsersIcon } from '../Icons';
import { levelData } from '../../services/gamificationService';
import { TreevuLevel } from '../../types/common';
import KpiCard from './KpiCard';
import Tooltip from '../Tooltip';

interface GamificationInsightsWidgetProps {
    data: any;
    companyWideData: any;
}

const GamificationInsightsWidget: React.FC<GamificationInsightsWidgetProps> = ({ data, companyWideData }) => {
    const { totalKudosSent, totalKudosReceived, avgLessonsCompleted, levelDistribution, avgLevel } = data.gamification;
    const { kudosHistory, avgLessonsCompletedHistory, activationRateHistory, avgLevelHistory } = data;
    const totalKudos = totalKudosSent + totalKudosReceived;
    
    const levels = Object.values(levelData);

    const companyLevelDistribution = companyWideData.gamification.levelDistribution;
    const totalCompanyEmployees = companyWideData.gamification.totalEmployees;
    const totalSegmentEmployees = data.gamification.totalEmployees;

    return (
        <div className="bg-surface rounded-2xl p-5">
             <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-on-surface">Engagement y Gamificación</h3>
                <Tooltip 
                    id="gamification-insights-tooltip" 
                    text="Analiza cómo la gamificación impulsa el engagement. Mide desde la actividad en la plataforma hasta el progreso en la senda de aprendizaje financiero."
                />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* KPI Cards Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <KpiCard
                        title="Activación"
                        value={data.activationRate.toFixed(0)}
                        valueSuffix="%"
                        history={activationRateHistory}
                        tooltipText="Porcentaje de colaboradores del segmento que han iniciado sesión y registrado al menos una actividad. Es el pulso de la adopción del programa."
                        variant={data.activationRate > 80 ? 'success' : data.activationRate > 60 ? 'warning' : 'danger'}
                    />
                     <KpiCard
                        title="Reconocimiento"
                        value={totalKudos.toLocaleString()}
                        subValue="Kudos"
                        history={kudosHistory}
                        tooltipText="Suma de todos los kudos (reconocimientos) enviados y recibidos. Un indicador clave de la colaboración y el ambiente positivo."
                        variant="default"
                    />
                     <KpiCard
                        title="Aprendizaje"
                        value={avgLessonsCompleted.toFixed(1)}
                        subValue="Lecciones/Colab."
                        history={avgLessonsCompletedHistory}
                        tooltipText="Promedio de lecciones completadas por colaborador. Mide el compromiso con el desarrollo de habilidades financieras."
                        variant="default"
                    />
                    <KpiCard
                        title="Nivel Promedio"
                        value={avgLevel.toFixed(1)}
                        subValue="Nivel"
                        history={avgLevelHistory}
                        tooltipText="Nivel promedio de gamificación alcanzado por los colaboradores del segmento. Refleja el progreso general en la senda de bienestar financiero."
                        variant="default"
                    />
                </div>

                {/* Level Distribution Section */}
                <div>
                     <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                           <TrophyIcon className="w-5 h-5 text-primary" />
                           <h4 className="font-bold text-on-surface">Distribución de Niveles del Equipo</h4>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-primary"></div><span>Segmento</span></div>
                            <div className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-full bg-primary/30"></div><span>Cía.</span></div>
                        </div>
                    </div>
                    <div className="space-y-2.5 bg-background p-4 rounded-xl">
                        {levels.map(levelInfo => {
                             const levelKey = Object.keys(TreevuLevel).find(key => 
                                levelData[TreevuLevel[key as keyof typeof TreevuLevel] as TreevuLevel]?.name === levelInfo.name
                            );
                            
                            const segmentCount = levelKey ? levelDistribution[levelKey] || 0 : 0;
                            const segmentPercentage = totalSegmentEmployees > 0 ? (segmentCount / totalSegmentEmployees) * 100 : 0;
                            
                            const companyCount = levelKey ? companyLevelDistribution[levelKey] || 0 : 0;
                            const companyPercentage = totalCompanyEmployees > 0 ? (companyCount / totalCompanyEmployees) * 100 : 0;

                            return (
                                <div key={levelInfo.name} className="flex items-center gap-3 text-sm">
                                    <span className="w-24 text-on-surface-secondary truncate font-semibold">{levelInfo.name}</span>
                                    <div className="relative flex-1 bg-active-surface rounded-full h-4">
                                        {/* Company bar (background) */}
                                        <div 
                                            className="absolute top-0 left-0 bg-primary/20 h-4 rounded-full" 
                                            style={{ width: `${companyPercentage}%` }}
                                            title={`Promedio Cía: ${companyPercentage.toFixed(1)}%`}
                                        ></div>
                                        {/* Segment bar (foreground) */}
                                        <div 
                                            className="relative bg-primary h-4 rounded-full text-right pr-2 text-xs font-bold text-primary-dark flex items-center justify-end" 
                                            style={{ width: `${segmentPercentage}%` }}
                                            title={`Segmento: ${segmentPercentage.toFixed(1)}%`}
                                        >
                                           {segmentCount > 0 && <span>{segmentCount}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamificationInsightsWidget;