
import React from 'react';
import KpiCard from '../employer/KpiCard';
import { SimpleBarChart } from '../TrendAnalysis';
import { Offer } from '../../data/merchantData';

interface MerchantDashboardProps {
    analytics: {
        totalRedemptions: number;
        totalViews: number;
        conversionRate: number;
        valueGenerated: number;
        redemptionsOverTime: { label: string; value: number }[];
        topPerformingOffers: Offer[];
    };
}

const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ analytics }) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="CANJES TOTALES"
                    value={analytics.totalRedemptions.toLocaleString()}
                    tooltipText="Número total de veces que los usuarios han canjeado tus ofertas."
                    variant={analytics.totalRedemptions > 100 ? 'success' : 'default'}
                />
                <KpiCard
                    title="TASA DE CONVERSIÓN"
                    value={`${analytics.conversionRate.toFixed(1)}%`}
                    tooltipText="Porcentaje de usuarios que canjearon una oferta después de verla."
                    variant={analytics.conversionRate > 10 ? 'success' : 'warning'}
                />
                <KpiCard
                    title="VISTAS TOTALES"
                    value={analytics.totalViews.toLocaleString()}
                    tooltipText="Número total de veces que tus ofertas han sido vistas por los usuarios."
                    variant="default"
                />
                <KpiCard
                    title="VALOR GENERADO (EST.)"
                    value={`S/ ${(analytics.valueGenerated / 1000).toFixed(1)}k`}
                    tooltipText="Estimación del valor total generado por los canjes, basado en un ticket promedio."
                    variant="success"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-surface p-5 rounded-2xl">
                    <h3 className="font-bold text-lg text-on-surface mb-4">Rendimiento Semanal de Canjes</h3>
                    <div className="h-64">
                         <SimpleBarChart data={analytics.redemptionsOverTime} />
                    </div>
                </div>
                <div className="bg-surface p-5 rounded-2xl">
                    <h3 className="font-bold text-lg text-on-surface mb-4">Ofertas Top</h3>
                    <div className="space-y-3">
                        {analytics.topPerformingOffers.map(offer => (
                            <div key={offer.id} className="bg-background p-3 rounded-lg">
                                <p className="font-semibold text-on-surface text-sm truncate">{offer.title}</p>
                                <p className="text-xs text-on-surface-secondary">
                                    {offer.redemptions} canjes
                                </p>
                            </div>
                        ))}
                         {analytics.topPerformingOffers.length === 0 && (
                            <p className="text-sm text-center text-on-surface-secondary pt-8">Aún no hay datos de rendimiento.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MerchantDashboard;