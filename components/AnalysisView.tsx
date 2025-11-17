

import React from 'react';
import { useAppContext } from '../contexts/AppContext';
import FinancialWellnessWidget from './FinancialWellnessWidget';
import WalletSummaryCard from './WalletSummaryCard';
import SpendingIntentWidget from './SpendingIntentWidget';
import UpgradePlanCTA from './UpgradePlanCTA';
import { SparklesIcon } from './Icons';

const AnalysisView: React.FC = () => {
    const { state: { expenses, fwi_v2, fwi_v2_components } } = useAppContext();
    
    if (expenses.length === 0) {
        return (
            <div className="text-center py-16">
                 <p className="text-on-surface-secondary">Registra tu primer hallazgo para ver tus insights.</p>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fade-in">
            <WalletSummaryCard expenses={expenses} />

            <SpendingIntentWidget expenses={expenses} />
            
            <div className="md:col-span-2">
                <FinancialWellnessWidget 
                    fwi={fwi_v2} 
                    components={fwi_v2_components}
                />
            </div>

            <div className="md:col-span-2">
                <UpgradePlanCTA 
                    Icon={SparklesIcon}
                    title="Análisis IA Semanal"
                    description="Desbloquea análisis semanales personalizados y consejos de nuestra IA para optimizar tus finanzas."
                    origin="people"
                />
            </div>
        </div>
    );
};

export default React.memo(AnalysisView);