

import React, { useState } from 'react';
import { useAppContext } from '@/contexts/AppContext';
import FinancialWellnessWidget from './FinancialWellnessWidget';
import CategoryAnalysis from '@/features/expenses/CategoryAnalysis.tsx';
import MerchantAnalysis from '@/features/expenses/MerchantAnalysis.tsx';
import { SparklesIcon, ChartPieIcon, ShoppingBagIcon } from '@/components/ui/Icons';
import { getAIWeeklySummary } from '@/services/ai/employeeService.ts';
import WalletSummaryCard from '@/features/wallet/WalletSummaryCard.tsx';
import SpendingIntentWidget from '@/features/expenses/SpendingIntentWidget.tsx';
import SubNavBar from '@/components/layout/SubNavBar.tsx';

type AnalysisSubTab = 'categories' | 'merchants';

const AIInsightCard = () => {
    const { state: { expenses } } = useAppContext();
    // Usuario estático
    const user = {
        id: 'static-user-id',
        name: 'Usuario Demo',
        email: 'usuario@demo.com',
        picture: '',
        level: 3 as const,
        progress: {
            expensesCount: 25,
            formalityIndex: 0.7
        },
        treevus: 2500,
        isProfileComplete: true,
        kudosSent: 10,
        kudosReceived: 15,
        registrationDate: '2024-01-15T00:00:00Z',
        lastActivityDate: '2024-12-14T00:00:00Z',
        rewardsClaimedCount: 3,
        engagementScore: 85,
        fwiTrend: 'improving' as const
    };
    const [aiSummary, setAiSummary] = React.useState('');
    const [isLoadingSummary, setIsLoadingSummary] = React.useState(true);

    React.useEffect(() => {
        const fetchSummary = async () => {
            if (user && expenses.length > 0) {
                setIsLoadingSummary(true);
                try {
                    const lastWeekExpenses = expenses.filter(e => {
                        const expenseDate = new Date(e.fecha);
                        const today = new Date();
                        const oneWeekAgo = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
                        return expenseDate >= oneWeekAgo;
                    });

                    if (lastWeekExpenses.length > 0) {
                        const summary = await getAIWeeklySummary(user, lastWeekExpenses);
                        setAiSummary(summary);
                    } else {
                        setAiSummary("No hay suficientes gastos recientes para un resumen. ¡Sigue registrando! 🌳");
                    }
                } catch (e) {
                    console.error("Failed to fetch AI summary", e);
                    setAiSummary("No pude generar tu resumen esta semana. Intenta de nuevo más tarde.");
                } finally {
                    setIsLoadingSummary(false);
                }
            } else {
                setAiSummary("Registra algunos gastos para que pueda darte un resumen inteligente de tu semana.");
                setIsLoadingSummary(false);
            }
        };
        fetchSummary();
    }, [user, expenses]);

    const renderSummary = (text: string) => {
        return text
            .split('\n\n')
            .map((paragraph, index) => (
                <p 
                    key={index} 
                    dangerouslySetInnerHTML={{ 
                        __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    }} 
                />
            ));
    };

    return (
        <div className="bg-surface rounded-2xl p-4">
            <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                <SparklesIcon className="w-6 h-6 mr-2 text-primary"/>
                Análisis IA Semanal
            </h2>
            <div 
                className="text-sm text-on-surface-secondary space-y-2"
                aria-live="polite"
                aria-busy={isLoadingSummary}
            >
                {isLoadingSummary ? (
                    <div role="status" aria-label="Cargando análisis semanal de la IA...">
                        <div className="space-y-2">
                            <div className="h-4 w-3/4 bg-active-surface rounded animate-pulse"></div>
                            <div className="h-4 w-1/2 bg-active-surface rounded animate-pulse"></div>
                        </div>
                    </div>
                ) : (
                    renderSummary(aiSummary)
                )}
            </div>
        </div>
    );
};

const AnalysisView: React.FC = () => {
    const { state: { expenses, fwi_v2, fwi_v2_components } } = useAppContext();
    const [analysisSubTab, setAnalysisSubTab] = useState<AnalysisSubTab>('categories');
    
    const analysisSubTabs = [
        { id: 'categories' as const, label: 'Top Categorías', Icon: ChartPieIcon },
        { id: 'merchants' as const, label: 'Top Comercios', Icon: ShoppingBagIcon },
    ];
    
    if (expenses.length === 0) {
        return (
            <div className="text-center py-16">
                 <p className="text-on-surface-secondary">Registra tu primer gasto para ver tus insights.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <div className="md:col-span-2">
                <AIInsightCard />
            </div>
            
            <div className="md:col-span-2">
                <WalletSummaryCard expenses={expenses} />
            </div>
            
            <FinancialWellnessWidget 
                fwi={fwi_v2} 
                components={fwi_v2_components}
            />
            
            <SpendingIntentWidget expenses={expenses} />

            <div className="bg-surface rounded-2xl p-4 md:col-span-2">
                <SubNavBar
                    tabs={analysisSubTabs}
                    activeTab={analysisSubTab}
                    onTabClick={(tab) => setAnalysisSubTab(tab as AnalysisSubTab)}
                />
                <div className="mt-4">
                    {analysisSubTab === 'categories' && <CategoryAnalysis expenses={expenses} />}
                    {analysisSubTab === 'merchants' && <MerchantAnalysis expenses={expenses} />}
                </div>
            </div>
        </div>
    );
};

export default React.memo(AnalysisView);