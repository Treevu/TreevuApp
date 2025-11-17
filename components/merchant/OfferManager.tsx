import React from 'react';
import { Offer } from '../../data/merchantData';
import { PlusIcon, PencilIcon, TrashIcon } from '../Icons';

interface OfferManagerProps {
    offers: Offer[];
    onCreate: () => void;
    onEdit: (offer: Offer) => void;
    onDelete: (offerId: string) => void;
    createOfferBtnRef: React.RefObject<HTMLButtonElement>;
}

const OfferManager: React.FC<OfferManagerProps> = ({ offers, onCreate, onEdit, onDelete, createOfferBtnRef }) => {
    return (
        <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-on-surface">Mis Ofertas</h2>
                <button
                    ref={createOfferBtnRef}
                    onClick={onCreate}
                    className="bg-primary text-primary-dark font-bold py-2 px-4 rounded-xl flex items-center gap-2"
                >
                    <PlusIcon className="w-5 h-5" />
                    Crear Nueva Oferta
                </button>
            </div>

            {offers.length > 0 ? (
                <div className="space-y-4">
                    {offers.map(offer => (
                        <div key={offer.id} className="bg-surface p-4 rounded-xl flex justify-between items-start gap-4">
                            <div className="flex-1">
                                <span className="text-xs font-semibold bg-primary/20 text-primary px-2 py-0.5 rounded-full">{offer.category}</span>
                                <h3 className="font-bold text-on-surface mt-2">{offer.title}</h3>
                                <p className="text-sm text-on-surface-secondary mt-1">{offer.description}</p>
                                <p className="text-xs text-on-surface-secondary mt-2"><strong>Condiciones:</strong> {offer.conditions}</p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                                <span className="text-xl font-extrabold text-primary">{offer.discountDetails}</span>
                                <div className="flex gap-2 mt-4">
                                     <button onClick={() => onEdit(offer)} className="p-2 bg-active-surface rounded-full text-on-surface-secondary hover:text-on-surface">
                                        <PencilIcon className="w-5 h-5" />
                                    </button>
                                    <button onClick={() => onDelete(offer.id)} className="p-2 bg-active-surface rounded-full text-on-surface-secondary hover:text-danger">
                                        <TrashIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-surface rounded-2xl">
                    <h3 className="text-xl font-bold">Aún no tienes ofertas activas</h3>
                    <p className="text-on-surface-secondary mt-2">Usa el botón "Crear Nueva Oferta" para empezar.</p>
                </div>
            )}
        </div>
    );
};

export default OfferManager;