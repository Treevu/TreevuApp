import React, { useMemo } from 'react';
import KpiCard from '../employer/KpiCard';
import { SimpleBarChart } from '../TrendAnalysis';
import { Offer, MerchantUser } from '../../data/merchantData';
import { useAlert } from '../../contexts/AlertContext';
import { UsersIcon, ShareIcon, CheckBadgeIcon, ChartPieIcon } from '../Icons';
import { useModal } from '../../contexts/ModalContext';
import OfferCategoryDistribution from './OfferCategoryDistribution';

interface MerchantDashboardProps {
    user: MerchantUser;
    analytics: {
        totalRedemptions: number;
        totalViews: number;
        conversionRate: number;
        valueGenerated: number;
        redemptionsOverTime: { label: string; value: number }[];
        topPerformingOffers: Offer[];
        redemptionsByCategory: { category: Offer['category']; count: number }[];
        redemptionsHistory: { month: string; value: number }[];
        conversionRateHistory: { month: string; value: number }[];
        viewsHistory: { month: string; value: number }[];
    };
    kpiGridRef: React.RefObject<HTMLDivElement>;
}

const AudienceInsightWidget = () => (
    <div className="bg-surface rounded-2xl p-5 h-full flex flex-col justify-center">
        <h3 className="font-bold text-lg text-on-surface mb-4">Tu Audiencia Potencial</h3>
        <div className="grid grid-cols-2 gap-4">
            <div className="bg-background p-3 rounded-lg text-center">
                <p className="text-xs font-semibold text-on-surface-secondary">Ticket Promedio</p>
                <p className="text-2xl font-bold text-primary">S/ 25</p>
                <p className="text-xs text-on-surface-secondary">en Cafeterías</p>
            </div>
            <div className="bg-background p-3 rounded-lg text-center">
                <p className="text-xs font-semibold text-on-surface-secondary">Frecuencia de Visita</p>
                <p className="text-2xl font-bold text-primary">3x</p>
                <p className="text-xs text-on-surface-secondary">por mes</p>
            </div>
        </div>
        <p className="text-xs text-on-surface-secondary mt-4 text-center">Datos agregados y anónimos de la red de colaboradores de treevü.</p>
    </div>
);


const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ user, analytics, kpiGridRef }) => {
    const { openModal } = useModal();
    return (
        <div className="space-y-6 animate-fade-in">
            <div ref={kpiGridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KpiCard
                    title="CANJES TOTALES"
                    value={analytics.totalRedemptions.toLocaleString()}
                    tooltipText="Número total de veces que los usuarios han canjeado tus ofertas."
                    variant={analytics.totalRedemptions > 100 ? 'success' : 'default'}
                    history={analytics.redemptionsHistory}
                />
                <KpiCard
                    title="TASA DE CONVERSIÓN"
                    value={analytics.conversionRate.toFixed(1)}
                    valueSuffix="%"
                    tooltipText="Porcentaje de usuarios que canjearon una oferta después de verla."
                    variant={analytics.conversionRate > 10 ? 'success' : 'warning'}
                    history={analytics.conversionRateHistory}
                />
                <KpiCard
                    title="VISTAS TOTALES"
                    value={analytics.totalViews.toLocaleString()}
                    tooltipText="Número total de veces que tus ofertas han sido vistas por los usuarios."
                    variant="default"
                    history={analytics.viewsHistory}
                />
                <button onClick={() => openModal('proofOfImpact')} className="text-left">
                     <KpiCard
                        title="REPORTE DE OPORTUNIDAD B2B"
                        value={"Generar"}
                        description="Demuestra tu valor a clientes corporativos."
                        tooltipText="Genera reportes que demuestran cómo tus ofertas contribuyen al bienestar de los colaboradores. Un diferenciador clave para atraer más clientes B2B."
                        variant="default"
                    />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AudienceInsightWidget />
                <OfferCategoryDistribution data={analytics.redemptionsByCategory} />
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
                            <div key={offer.id} className="bg-background p-3 rounded-lg flex justify-between items-center">
                                <p className="font-semibold text-on-surface text-sm truncate pr-2">{offer.title}</p>
                                <span className="text-sm font-bold text-primary flex-shrink-0">{offer.redemptions} canjes</span>
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