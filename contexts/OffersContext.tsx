
import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { MOCK_OFFERS, Offer } from '../data/merchantData';
import { generateUniqueId } from '../utils';

interface OffersContextType {
    offers: Offer[];
    addOffer: (offerData: Omit<Offer, 'id' | 'views' | 'redemptions'>) => void;
    updateOffer: (offerId: string, offerData: Partial<Omit<Offer, 'id'>>) => void;
    deleteOffer: (offerId: string) => void;
}

const OffersContext = createContext<OffersContextType | undefined>(undefined);

export const OffersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [offers, setOffers] = useState<Offer[]>([]);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        try {
            const savedOffers = localStorage.getItem('treevu-offers');
            if (savedOffers) {
                setOffers(JSON.parse(savedOffers));
            } else {
                setOffers(MOCK_OFFERS);
            }
        } catch (e) { 
            console.error("Failed to load offers from localStorage", e); 
            setOffers(MOCK_OFFERS);
        }
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            localStorage.setItem('treevu-offers', JSON.stringify(offers));
        } catch (e) { 
            console.error("Failed to save offers to localStorage", e); 
        }
    }, [offers, isInitialLoad]);

    const addOffer = useCallback((offerData: Omit<Offer, 'id' | 'views' | 'redemptions'>) => {
        const newOffer: Offer = {
            id: generateUniqueId(),
            ...offerData,
            views: 0,
            redemptions: 0,
        };
        setOffers(prev => [newOffer, ...prev]);
    }, []);

    const updateOffer = useCallback((offerId: string, offerData: Partial<Omit<Offer, 'id'>>) => {
        setOffers(prev => prev.map(offer => 
            offer.id === offerId ? { ...offer, ...offerData } : offer
        ));
    }, []);

    const deleteOffer = useCallback((offerId: string) => {
        setOffers(prev => prev.filter(offer => offer.id !== offerId));
    }, []);

    const value = useMemo(() => ({
        offers,
        addOffer,
        updateOffer,
        deleteOffer,
    }), [offers, addOffer, updateOffer, deleteOffer]);

    return (
        <OffersContext.Provider value={value}>
            {children}
        </OffersContext.Provider>
    );
};

export const useOffers = () => {
    const context = useContext(OffersContext);
    if (context === undefined) {
        throw new Error('useOffers must be used within an OffersProvider');
    }
    return context;
};