

import React from 'react';
import { TrophyIcon, AcademicCapIcon, HandThumbUpIcon } from '../Icons';
import { levelData } from '../../services/gamificationService';

interface GamificationInsightsWidgetProps {
    data: {
        totalKudosSent: number;
        totalKudosReceived: number;
        avgLessonsCompleted: number;
        levelDistribution: { [key: string]: number };
    };
}

const GamificationInsightsWidget: React.FC<GamificationInsightsWidgetProps> = ({ data }) => {
    const { totalKudosSent, totalKudosReceived, avgLessonsCompleted, levelDistribution } = data;
    const totalKudos = totalKudosSent + totalKudosReceived;
    
    const levels = Object.values(levelData).map(l => l.name);
    // FIX: Cast Object.values to number[] to prevent type error on spread.
    const maxInLevel = Math.max(...(Object.values(levelDistribution) as number[]), 0);
    
    return (
        <div className="bg-surface rounded-2xl p-5">
            <h3 className="text-lg font-bold text-on-surface mb-4">Métricas de Engagement</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Kudos Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <HandThumbUpIcon className="w-5 h-5 text-yellow-400"/>
                        <h4 className="font-bold text-on-surface">Cultura de Reconocimiento</h4>
                    </div>
                    <div className="text-center bg-background p-4 rounded-xl">
                        <p className="text-4xl font-extrabold text-primary">{totalKudos.toLocaleString()}</p>
                        <p className="text-sm font-semibold text-on-surface-secondary">Kudos Totales</p>
                    </div>
                    <div className="text-sm space-y-2">
                        <div className="flex justify-between p-2 bg-background rounded-lg">
                            <span className="font-semibold text-on-surface-secondary">Enviados</span>
                            <span className="font-bold text-on-surface">{totalKudosSent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between p-2 bg-background rounded-lg">
                            <span className="font-semibold text-on-surface-secondary">Recibidos</span>
                            <span className="font-bold text-on-surface">{totalKudosReceived.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* Level Distribution Section */}
                <div className="space-y-4">
                     <div className="flex items-center gap-2">
                        <TrophyIcon className="w-5 h-5 text-primary" title="Progreso del Equipo" />
                        <h4 className="font-bold text-on-surface">Progreso del Equipo</h4>
                    </div>
                    <div className="space-y-2">
                        {levels.map(levelName => {
                            const count = levelDistribution[levelName.split(' ')[0]] || 0;
                            const percentage = maxInLevel > 0 ? (count / maxInLevel) * 100 : 0;
                            return (
                                <div key={levelName} className="flex items-center gap-2 text-sm">
                                    <span className="w-28 text-on-surface-secondary truncate">{levelName}</span>
                                    <div className="flex-1 bg-active-surface rounded-full h-4">
                                        <div className="bg-primary h-4 rounded-full text-right pr-2 text-xs font-bold text-primary-dark flex items-center justify-end" style={{ width: `${percentage}%` }}>
                                           {count > 0 && <span>{count}</span>}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Learning Section */}
                 <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <AcademicCapIcon className="w-5 h-5 text-primary"/>
                        <h4 className="font-bold text-on-surface">Adopción de Aprendizaje</h4>
                    </div>
                    <div className="text-center bg-background p-4 rounded-xl">
                        <p className="text-4xl font-extrabold text-primary">{avgLessonsCompleted.toFixed(1)}</p>
                        <p className="text-sm font-semibold text-on-surface-secondary">Lecciones/Colaborador</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GamificationInsightsWidget;