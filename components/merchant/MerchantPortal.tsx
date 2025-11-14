

import React, { useState, useMemo, useCallback } from 'react';
import { useOffers } from '../../contexts/OffersContext';
import { useModal } from '../../contexts/ModalContext';
import { MOCK_MERCHANTS, MerchantUser, Offer, generateMerchantAnalytics } from '../../data/merchantData';
import { ArrowLeftIcon, ChartPieIcon, BuildingStorefrontIcon, SparklesIcon } from '../Icons';
import SubNavBar from '../SubNavBar';
import MerchantDashboard from './MerchantDashboard';
import OfferManager from './OfferManager';
import Logo from '../Logo';

interface MerchantPortalProps {
    user: MerchantUser;
    onSignOut: () => void;
}

type MerchantTab = 'dashboard' | 'offers';

const MerchantPortal: React.FC<MerchantPortalProps> = ({ user, onSignOut }) => {
    const { offers, addOffer, updateOffer, deleteOffer } = useOffers();
    const { openModal, closeModal } = useModal();
    const [activeTab, setActiveTab] = useState<MerchantTab>('dashboard');
    
    const merchantOffers = useMemo(() => offers.filter(o => o.merchantId === user.id), [offers, user.id]);
    const analytics = useMemo(() => generateMerchantAnalytics(merchantOffers), [merchantOffers]);

    const handleSaveOffer = useCallback((offerData: Omit<Offer, 'id' | 'views' | 'redemptions'>, editingId?: string) => {
        if (editingId) {
            updateOffer(editingId, offerData);
        } else {
            addOffer({ ...offerData, merchantId: user.id });
        }
        closeModal();
    }, [addOffer, updateOffer, user.id, closeModal]);
    
    const tabs = [
        { id: 'dashboard' as const, label: 'Dashboard', Icon: ChartPieIcon },
        { id: 'offers' as const, label: 'Mis Ofertas', Icon: BuildingStorefrontIcon },
    ];

    return (
        <div className="min-h-screen bg-background text-on-surface">
            <header className="bg-surface p-4 border-b border-active-surface/50">
                <div className="max-w-6xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <Logo src={user.logoUrl} className="w-10 h-10 rounded-lg" />
                        <div>
                            <h1 className="text-xl font-bold text-on-surface">{user.name}</h1>
                            <p className="text-sm text-on-surface-secondary">{user.category}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* --- IMPLEMENTACIÓN: Asistente IA para Comercios --- */}
                        <button
                            onClick={() => openModal('merchantAIAssistant', { analytics })}
                            className="flex items-center text-sm font-bold text-primary bg-primary/20 px-3 py-2 rounded-lg hover:bg-primary/30 transition-colors"
                            aria-label="Abrir asistente de IA"
                        >
                            <SparklesIcon className="w-5 h-5 mr-1.5" />
                            Asistente IA
                        </button>
                        {/* --- FIN IMPLEMENTACIÓN --- */}
                        <button onClick={onSignOut} className="flex items-center text-sm font-semibold text-danger hover:opacity-80">
                            <ArrowLeftIcon className="w-5 h-5 mr-1.5" />
                            Salir
                        </button>
                    </div>
                </div>
            </header>
            <main className="max-w-6xl mx-auto p-4 sm:p-6">
                <SubNavBar tabs={tabs} activeTab={activeTab} onTabClick={(t) => setActiveTab(t)} />
                <div className="mt-6">
                    {activeTab === 'dashboard' && <MerchantDashboard analytics={analytics} />}
                    {activeTab === 'offers' && (
                        <OfferManager 
                            offers={merchantOffers}
                            onDelete={deleteOffer}
                            onEdit={(offer) => openModal('offerForm', { onSave: handleSaveOffer, offerToEdit: offer })}
                            onCreate={() => openModal('offerForm', { onSave: handleSaveOffer })}
                        />
                    )}
                </div>
            </main>
        </div>
    );
};

export default MerchantPortal;
