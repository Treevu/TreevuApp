
import React from 'react';
import { useOffers } from '../contexts/OffersContext';
import { MOCK_MERCHANTS } from '../data/merchantData';
import OfferCard from './OfferCard';
import { BuildingStorefrontIcon } from './Icons';

const OffersView: React.FC = () => {
    const { offers } = useOffers();

    const offersWithMerchant = offers.map(offer => ({
        ...offer,
        merchant: MOCK_MERCHANTS.find(m => m.id === offer.merchantId)
    })).filter(o => o.merchant);

    return (
        <div className="space-y-4 animate-grow-and-fade-in">
            <div className="bg-surface rounded-2xl p-4">
                <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center">
                    <BuildingStorefrontIcon className="w-6 h-6 mr-2 text-primary"/>
                    Ofertas Exclusivas para Ti
                </h2>
                <p className="text-sm text-on-surface-secondary">
                    Descubre descuentos y promociones especiales de nuestros comercios aliados, solo para miembros de la comunidad treevü.
                </p>
            </div>
            {offersWithMerchant.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offersWithMerchant.map(offer => (
                        <OfferCard key={offer.id} offer={offer} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-surface rounded-2xl">
                    <p className="text-on-surface-secondary">
                        Aún no hay ofertas disponibles. ¡Vuelve pronto!
                    </p>
                </div>
            )}
        </div>
    );
};

export default OffersView;