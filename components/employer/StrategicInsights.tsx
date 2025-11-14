import React, { useState, useEffect } from 'react';
import { SparklesIcon, HeartIcon, AcademicCapIcon, TicketIcon, LightBulbIcon, UsersIcon } from '../Icons';
// FIX: Updated import from deprecated 'geminiService.ts'.
import { getAIStrategicInsights } from '../../services/ai/employerService';
import Tooltip from '../Tooltip';
import AccordionItem from './AccordionItem';

type AnalysisResult = {
    status: string;
    insight: string;
    recommendation: string;
};

type Metric = {
    title: string;
    icon: React.FC<{ className?: string }>;
    metricName: 'Salud Financiera' | 'Balance Vida-Trabajo' | 'Desarrollo Profesional' | 'Adopción y Engagement';
    valueKey: keyof StrategicInsightsProps['data'];
    analysis: AnalysisResult | null;
};

interface StrategicInsightsProps {
    data: any;
}

const StrategicInsights: React.FC<StrategicInsightsProps> = ({ data }) => {
    const [insights, setInsights] = useState<Metric[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [openInsight, setOpenInsight] = useState<string | null>('Salud Financiera');

    const metrics: Omit<Metric, 'analysis'>[] = [
        { title: "Salud Financiera", icon: HeartIcon, metricName: "Salud Financiera", valueKey: 'formalityScore' },
        { title: "Balance Vida-Trabajo", icon: TicketIcon, metricName: "Balance Vida-Trabajo", valueKey: 'workLifeBalanceScore' },
        { title: "Desarrollo Profesional", icon: AcademicCapIcon, metricName: "Desarrollo Profesional", valueKey: 'selfDevScore' },
        { title: "Adopción y Engagement", icon: UsersIcon, metricName: "Adopción y Engagement", valueKey: 'activationRate' },
    ];

    useEffect(() => {
        const fetchInsights = async () => {
            if (!data || data.isEmpty) {
                setIsLoading(false);
                return;
            };
            setIsLoading(true);
            try {
                const results = await getAIStrategicInsights(data);
                
                if (results && Array.isArray(results)) {
                    const populatedInsights = metrics.map(m => {
                        const analysisResult = results.find(r => r.metricName === m.metricName);
                        return { ...m, analysis: analysisResult || null };
                    });
                    setInsights(populatedInsights);
                } else {
                    throw new Error("Invalid or empty response from AI");
                }

            } catch (error) {
                console.error("An unexpected error occurred while fetching insights:", error);
                const errorInsights = metrics.map(m => ({ ...m, analysis: { status: 'Error', insight: 'Ocurrió un error inesperado.', recommendation: 'Intenta recargar la página.' } }));
                setInsights(errorInsights);
            } finally {
                setIsLoading(false);
            }
        };
        fetchInsights();
    }, [data]);

    const getStatusColor = (status: string = "Desconocido") => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus.includes('saludable') || lowerStatus.includes('positivo') || lowerStatus.includes('fuerte')) return 'bg-primary/20 text-primary';
        if (lowerStatus.includes('mejora') || lowerStatus.includes('equilibrado') || lowerStatus.includes('moderado')) return 'bg-warning/20 text-warning';
        if (lowerStatus.includes('atención') || lowerStatus.includes('riesgo') || lowerStatus.includes('bajo')) return 'bg-danger/20 text-danger';
        return 'bg-active-surface text-on-surface-secondary';
    };

    const renderSkeleton = () => (
        <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-background rounded-xl p-3 flex items-start gap-3 animate-pulse">
                    <div className="w-8 h-8 rounded-lg bg-active-surface flex-shrink-0 mt-1"></div>
                    <div className="flex-1">
                        <div className="h-4 w-1/3 bg-active-surface rounded mb-2"></div>
                        <div className="h-3 w-1/4 bg-active-surface rounded mb-2"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="strategic-insights-tooltip" text="La IA de Gemini analiza las métricas clave y genera diagnósticos y recomendaciones accionables para mejorar el bienestar del equipo." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-primary" />
                Señales Estratégicas
            </h3>
            {isLoading ? renderSkeleton() : (
                <div className="space-y-1">
                    {insights.map((insight) => (
                        <div key={insight.title} className="bg-background rounded-xl">
                            <AccordionItem
                                isOpen={openInsight === insight.title}
                                onClick={() => setOpenInsight(openInsight === insight.title ? null : insight.title)}
                                title={
                                    <div className="flex items-center">
                                        <div className="w-8 h-8 rounded-lg bg-active-surface flex items-center justify-center flex-shrink-0">
                                            <insight.icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div className="ml-3">
                                            <h4 className="font-bold text-on-surface text-sm">{insight.title}</h4>
                                            {insight.analysis && (
                                                <div className={`mt-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(insight.analysis.status)}`}>
                                                    {insight.analysis.status}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                }
                            >
                                <div className="space-y-3">
                                    {insight.analysis && (
                                        <>
                                            <div>
                                                <p className="text-xs font-semibold text-on-surface-secondary mb-1">Diagnóstico IA:</p>
                                                <p className="text-sm text-on-surface">{insight.analysis.insight}</p>
                                            </div>
                                            <div className="border-t border-active-surface/50"></div>
                                            <div>
                                                <p className="text-xs font-bold text-primary mb-1 flex items-center">
                                                    <LightBulbIcon className="w-4 h-4 mr-1.5"/>
                                                    Acción Sugerida:
                                                </p>
                                                <p className="text-sm text-on-surface">{insight.analysis.recommendation}</p>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </AccordionItem>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default StrategicInsights;
