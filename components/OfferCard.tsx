import React from 'react';
import { Offer, MerchantUser } from '../data/merchantData';
import Logo from './Logo';
import { FireIcon, ArrowRightIcon } from './Icons';

interface OfferCardProps {
    offer: Offer & { merchant?: MerchantUser };
}

const OfferCard: React.FC<OfferCardProps> = ({ offer }) => {
    const isPopular = offer.redemptions > 250;

    return (
        <div className="bg-surface rounded-2xl border border-active-surface/50 overflow-hidden flex flex-col justify-between h-full group transition-all duration-300 hover:shadow-xl hover:border-primary/50 hover:scale-[1.02]">
            
            <div className="p-4 relative">
                {isPopular && (
                    <div className="absolute top-0 right-0 bg-danger text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 z-10 animate-fade-in">
                        <FireIcon className="w-4 h-4" />
                        POPULAR
                    </div>
                )}
                
                {offer.merchant && (
                    <div className="flex items-center gap-2 mb-3">
                        <Logo src={offer.merchant.logoUrl} className="w-6 h-6 rounded-md" />
                        <span className="text-xs font-bold text-on-surface-secondary">{offer.merchant.name}</span>
                    </div>
                )}

                <h3 className="font-bold text-lg text-on-surface leading-tight h-12">{offer.title}</h3>
                <p className="text-sm text-on-surface-secondary mt-1 h-10">{offer.description}</p>
                
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-2xl font-extrabold text-primary bg-primary/10 px-4 py-2 rounded-lg">
                        {offer.discountDetails}
                    </span>
                    <button className="flex items-center gap-2 text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        Ver Detalles
                        <ArrowRightIcon className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-background px-4 py-2 border-t border-active-surface/50">
                <p className="text-xs text-on-surface-secondary truncate">
                    <strong>Condiciones:</strong> {offer.conditions}
                </p>
            </div>
        </div>
    );
};

export default OfferCard;