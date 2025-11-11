import React from 'react';
import { GiftIcon } from '@/components/ui/Icons';
import Tooltip from '@/components/ui/Tooltip.tsx';
import KpiCard from './KpiCard';

interface BenefitsImpactWidgetProps {
    data: any;
}

const BenefitsImpactWidget: React.FC<BenefitsImpactWidgetProps> = ({ data }) => {
    const { redemptionRate, fwiComparison, rewardCategoryDistribution } = data;
    const totalRedeemedValue = rewardCategoryDistribution.reduce((sum: number, item: any) => sum + item.amount, 0);
    const fwiDifference = fwiComparison.redeemers - fwiComparison.nonRedeemers;

    const getRedemptionVariant = (rate: number) => {
        if (rate >= 75) return 'success';
        if (rate >= 50) return 'warning';
        return 'danger';
    };

    const getFwiImpactVariant = (diff: number) => {
        if (diff > 5) return 'success';
        if (diff <= 0) return 'warning';
        return 'default';
    };

    return (
        <div className="bg-surface rounded-2xl p-5 relative">
            <div className="absolute top-4 right-4">
                <Tooltip id="benefits-impact-tooltip" text="Analiza el retorno y el impacto de tu programa de beneficios, midiendo desde el engagement hasta su correlación con el bienestar financiero." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <GiftIcon className="w-6 h-6 mr-2 text-primary" />
                Impacto del Programa de Beneficios
            </h3>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <KpiCard
                    title="TASA DE CANJE"
                    value={`${redemptionRate.toFixed(0)}%`}
                    description="Colaboradores que han canjeado al menos un premio."
                    tooltipText="Porcentaje de colaboradores activos que han utilizado sus treevüs para canjear al menos una recompensa."
                    variant={getRedemptionVariant(redemptionRate)}
                />
                 <KpiCard
                    title="IMPACTO EN BIENESTAR (FWI)"
                    value={`${fwiDifference >= 0 ? '+' : ''}${fwiDifference.toFixed(1)} pts`}
                    description="Diferencia FWI 'canjeadores' vs 'no canjeadores'."
                    tooltipText="Muestra la diferencia en el puntaje de Bienestar Financiero (FWI) promedio entre los colaboradores que canjean premios y los que no."
                    variant={getFwiImpactVariant(fwiDifference)}
                />
                <KpiCard
                    title="VALOR TOTAL CANJEADO"
                    value={`S/ ${(totalRedeemedValue / 1000).toFixed(1)}k`}
                    description="Valor monetario de los beneficios canjeados."
                    tooltipText="Suma del valor en soles de todas las recompensas canjeadas, un indicador clave del ROI del programa."
                    variant="default"
                />
            </div>
        </div>
    );
};

export default BenefitsImpactWidget;