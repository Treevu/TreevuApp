import React from 'react';
import { ReceiptPercentIcon, LightBulbIcon } from '../Icons';
import Tooltip from '../Tooltip';

interface SpendingIntentBreakdownProps {
    data: {
        essential: number;
        desired: number;
        essentialPercent: number;
        desiredPercent: number;
        insight: string;
    };
}

const SpendingIntentBreakdown: React.FC<SpendingIntentBreakdownProps> = ({ data }) => {
    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="spending-intent-tooltip" text="Analiza la proporción del gasto total del equipo que se destina a necesidades (Esencial) vs. gustos (Deseado). Un % alto en 'Esencial' puede ser un indicador de estrés financiero." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <ReceiptPercentIcon className="w-6 h-6 mr-2 text-primary"/>
                Balance: Esencial vs. Deseado
            </h3>
            
            <div className="flex w-full h-4 rounded-full overflow-hidden bg-active-surface shadow-inner">
                <div style={{ width: `${data.essentialPercent}%` }} className="bg-primary transition-all duration-500 ease-out" title={`Esencial: ${data.essentialPercent.toFixed(1)}%`}></div>
                <div style={{ width: `${data.desiredPercent}%` }} className="bg-accent transition-all duration-500 ease-out" title={`Deseado: ${data.desiredPercent.toFixed(1)}%`}></div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-3">
                <div className="text-center bg-background p-3 rounded-lg">
                    <div className="flex items-center justify-center text-sm font-semibold">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary mr-2"></div>
                        Gasto Esencial
                    </div>
                    <p className="font-bold text-xl text-on-surface mt-1">S/ {data.essential.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</p>
                </div>
                <div className="text-center bg-background p-3 rounded-lg">
                    <div className="flex items-center justify-center text-sm font-semibold">
                        <div className="w-2.5 h-2.5 rounded-full bg-accent mr-2"></div>
                        Gasto Deseado
                    </div>
                    <p className="font-bold text-xl text-on-surface mt-1">S/ {data.desired.toLocaleString('es-PE', { minimumFractionDigits: 0 })}</p>
                </div>
            </div>

            <div className="mt-4 p-3 bg-background/50 rounded-lg flex items-start space-x-2.5">
                <LightBulbIcon className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <p className="text-sm text-on-surface-secondary leading-tight">{data.insight}</p>
            </div>
        </div>
    );
};

export default SpendingIntentBreakdown;