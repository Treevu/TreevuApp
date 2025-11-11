
import React from 'react';
import { AcademicCapIcon, BookOpenIcon, UsersIcon, SparklesIcon } from '@/components/ui/Icons';
import Tooltip from '@/components/ui/Tooltip.tsx';

const LESSON_TITLES: { [key: string]: string } = {
    'intro': '¿Qué es esta Aventura?',
    'accelerate': 'Acelera tu Cosecha',
    'how-it-works': 'El Mapa y la Brújula',
    'formality': 'La Magia de la Formalidad',
};


interface LearningEngagementWidgetProps {
    data: {
        completionByDept: { department: string; rate: number }[];
        topLessons: { id: string; count: number }[];
    };
    onPromote: (lesson: { id: string, title: string }) => void;
}

const LearningEngagementWidget: React.FC<LearningEngagementWidgetProps> = ({ data, onPromote }) => {
    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="learning-engagement-tooltip" text="Mide el compromiso del equipo con el contenido educativo. Identifica las áreas más proactivas y los temas de mayor interés para guiar tus estrategias de L&D." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <AcademicCapIcon className="w-6 h-6 mr-2 text-primary" />
                Radar de Aprendizaje
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Completion Rate by Department */}
                <div>
                    <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-on-surface-secondary" />
                        Tasa de Finalización por Área
                    </h4>
                    <div className="space-y-3">
                        {data.completionByDept.map(dept => (
                            <div key={dept.department}>
                                <div className="flex justify-between text-sm font-semibold mb-1">
                                    <span className="text-on-surface truncate pr-2">{dept.department}</span>
                                    <span className="text-primary">{dept.rate.toFixed(0)}%</span>
                                </div>
                                <div className="h-2 w-full bg-active-surface rounded-full">
                                    <div className="h-2 rounded-full bg-primary" style={{ width: `${dept.rate}%` }}></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Top Lessons */}
                <div>
                    <h4 className="font-bold text-on-surface mb-3 flex items-center gap-2">
                        <BookOpenIcon className="w-5 h-5 text-on-surface-secondary" />
                        Pergaminos más Leídos
                    </h4>
                    {data.topLessons.length > 0 ? (
                        <div className="space-y-2">
                            {data.topLessons.map(lesson => (
                                <div key={lesson.id} className="bg-background p-3 rounded-lg flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-semibold text-on-surface truncate pr-2">{LESSON_TITLES[lesson.id] || 'Artículo Desconocido'}</p>
                                        <p className="text-xs text-on-surface-secondary">{lesson.count.toLocaleString()} lecturas</p>
                                    </div>
                                    <button 
                                        onClick={() => onPromote({id: lesson.id, title: LESSON_TITLES[lesson.id] || 'Lección'})}
                                        className="text-primary bg-primary/10 hover:bg-primary/20 font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1"
                                    >
                                        <SparklesIcon className="w-4 h-4"/>
                                        Promocionar
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="text-center py-12 text-on-surface-secondary">
                            <p>Aún no hay datos de finalización de lecciones.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LearningEngagementWidget;