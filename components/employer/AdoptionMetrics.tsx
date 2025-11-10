
import React from 'react';
import Tooltip from '../Tooltip';
import { UsersIcon, EyeIcon } from '../Icons';

interface AdoptionMetricsProps {
    activationRate: number;
    avgSpendingPerUser: number;
    dashboardViews: number;
}

const AdoptionMetrics: React.FC<AdoptionMetricsProps> = ({ activationRate, avgSpendingPerUser, dashboardViews }) => {
    
    // Add a pulsing dot to indicate risk if activation is low
    const getStatusIndicator = () => {
        if (activationRate < 50) return 'bg-danger animate-pulse';
        if (activationRate < 75) return 'bg-warning animate-pulse';
        return 'bg-emerald-500';
    };

    return (
        <div className="bg-surface rounded-2xl p-4 flex flex-col justify-between h-full">
            <div>
                <div className="flex items-start justify-between text-on-surface-secondary">
                    <h3 className="text-xs font-bold uppercase tracking-wider pr-2">Adopción y Engagement</h3>
                    <Tooltip id="adoption-metrics-tooltip" text="Métricas clave sobre cómo tu equipo está utilizando la plataforma treevü." />
                </div>

                <div className="flex items-baseline mt-2">
                    <p className="text-5xl font-extrabold text-on-surface tracking-tighter">{activationRate.toFixed(0)}<span className="text-4xl">%</span></p>
                    <div className={`w-3 h-3 rounded-full ml-2 ${getStatusIndicator()}`}></div>
                </div>
                <p className="text-xs text-on-surface-secondary">Tasa de Activación</p>
            </div>
            <div className="mt-4 pt-3 border-t border-active-surface/50 grid grid-cols-2 gap-3">
                <div className="bg-background rounded-lg p-2.5">
                    <div className="flex items-center text-on-surface-secondary mb-1">
                        <UsersIcon className="w-4 h-4 mr-2" />
                        <span className="text-xs font-medium">Gasto Prom./Colab.</span>
                    </div>
                    <p className="font-extrabold text-xl text-on-surface text-center">S/ {avgSpendingPerUser.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</p>
                </div>
                <div className="bg-background rounded-lg p-2.5">
                    <div className="flex items-center text-on-surface-secondary mb-1">
                        <EyeIcon className="w-4 h-4 mr-2" />
                        <span className="text-xs font-medium">Vistas al Dashboard</span>
                    </div>
                    <p className="font-extrabold text-xl text-on-surface text-center">{dashboardViews.toLocaleString('es-PE', { maximumFractionDigits: 0 })}</p>
                </div>
            </div>
        </div>
    );
};

export default AdoptionMetrics;