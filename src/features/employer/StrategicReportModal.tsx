import React, { useState, useEffect } from 'react';
import { SparklesIcon, DocumentArrowDownIcon, BuildingBlocksIcon, ChartPieIcon } from '@/components/ui/Icons';
import { getAIStrategicReportSummary } from '@/services/ai/employerService';
import { type CurrentUserType } from './EmployerDashboard';
import Spinner from '@/components/ui/Spinner.tsx';
import TreevuLogoText from '@/components/ui/TreevuLogoText.tsx';
interface StrategicReportModalProps {
    onClose: () => void;
    dashboardData: any;
    user: CurrentUserType;
}

interface AIReportContent {
    executiveSummary: string;
    recommendations: { title: string; detail: string }[];
}

const ReportSection: React.FC<{ title: string; children: React.ReactNode; icon: React.ReactNode }> = ({ title, children, icon }) => (
    <div className="report-section mb-6 break-inside-avoid">
        <h3 className="text-lg font-bold text-on-surface border-b-2 border-primary/50 pb-1 mb-3 flex items-center gap-2">
            {icon} {title}
        </h3>
        <div className="text-sm text-on-surface-secondary space-y-2">{children}</div>
    </div>
);

const KpiItem: React.FC<{ label: string; value: string | number; sublabel?: string }> = ({ label, value, sublabel }) => (
    <div className="bg-background p-3 rounded-lg text-center">
        <p className="text-xs font-semibold text-on-surface-secondary">{label}</p>
        <p className="text-2xl font-bold text-primary">{value}</p>
        {sublabel && <p className="text-xs text-on-surface-secondary -mt-1">{sublabel}</p>}
    </div>
);

const StrategicReportModal: React.FC<StrategicReportModalProps> = ({ onClose, dashboardData, user }) => {
    const [aiContent, setAiContent] = useState<AIReportContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReportContent = async () => {
            setIsLoading(true);
            try {
                const content = await getAIStrategicReportSummary(dashboardData);
                setAiContent(content);
            } catch (error) {
                console.error("Failed to fetch AI report content:", error);
                setAiContent({
                    executiveSummary: "No se pudo generar el resumen ejecutivo. Por favor, revise los datos e intente de nuevo.",
                    recommendations: []
                });
            } finally {
                setIsLoading(false);
            }
        };
        fetchReportContent();
    }, [dashboardData]);

    const handlePrint = () => {
        window.print();
    };

    const reportDate = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 print:hidden animate-fade-in" onClick={onClose}>
            <div
                className="bg-surface rounded-3xl shadow-2xl w-full max-w-3xl h-[90vh] flex flex-col animate-grow-and-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="report-title"
            >
                <header className="p-4 border-b border-active-surface/50 flex justify-between items-center flex-shrink-0 print:hidden">
                    <h2 id="report-title" className="text-xl font-bold text-on-surface">Informe Estratégico</h2>
                    <div className="flex items-center gap-4">
                         <button onClick={handlePrint} className="flex items-center text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
                            <DocumentArrowDownIcon className="w-5 h-5 mr-1.5" />
                            Imprimir / PDF
                        </button>
                        <button onClick={onClose} className="text-on-surface-secondary hover:text-on-surface rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-primary">
                            <span className="sr-only">Cerrar</span>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                </header>

                <main id="strategic-report-content-wrapper" className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                     {isLoading ? (
                        <div className="flex items-center justify-center h-full"><Spinner /></div>
                    ) : (
                    <div id="strategic-report-content">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-black text-on-surface"><TreevuLogoText />: Informe Estratégico</h1>
                            <p className="text-on-surface-secondary">Generado para: {user.name} | {reportDate}</p>
                        </div>
                        
                        <ReportSection title="Resumen Ejecutivo (Análisis IA)" icon={<SparklesIcon className="w-5 h-5 text-primary"/>}>
                            <p className="italic">{aiContent?.executiveSummary}</p>
                        </ReportSection>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 break-inside-avoid">
                            <KpiItem label="FWI Promedio" value={dashboardData.financialWellnessIndex.toFixed(0)} />
                            <KpiItem label="Riesgo de Fuga" value={dashboardData.talentFlightRisk} />
                            <KpiItem label="Activación" value={`${dashboardData.activationRate.toFixed(0)}%`} />
                            <KpiItem label="ROI del Programa" value={`${dashboardData.roiMultiplier.toFixed(1)}x`} />
                        </div>

                        <ReportSection title="Diagnóstico de Bienestar (FWI)" icon={<ChartPieIcon className="w-5 h-5 text-primary"/>}>
                            <p>El FWI de {dashboardData.financialWellnessIndex.toFixed(1)} indica el estado de salud financiera del segmento. Se compone de:</p>
                             <div className="grid grid-cols-3 gap-2 mt-2">
                                <KpiItem label="Salud Financiera" value={`${dashboardData.formalityScore.toFixed(0)}%`} sublabel="Formalidad" />
                                <KpiItem label="Balance Vida-Trabajo" value={`${dashboardData.workLifeBalanceScore.toFixed(0)}%`} sublabel="Ocio vs Esencial" />
                                <KpiItem label="Des. Profesional" value={`${dashboardData.selfDevScore.toFixed(0)}%`} sublabel="Gasto Educación" />
                            </div>
                        </ReportSection>

                        <ReportSection title="Recomendaciones Estratégicas (Análisis IA)" icon={<SparklesIcon className="w-5 h-5 text-primary"/>}>
                            {aiContent?.recommendations.length ? (
                                <ul className="space-y-3 list-decimal list-inside marker:text-primary marker:font-bold">
                                    {aiContent.recommendations.map((rec, index) => (
                                        <li key={index}>
                                            <strong className="text-on-surface">{rec.title}:</strong> {rec.detail}
                                        </li>
                                    ))}
                                </ul>
                            ) : <p>No se pudieron generar recomendaciones.</p>}
                        </ReportSection>
                    </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default StrategicReportModal;
