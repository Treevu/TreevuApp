
export interface MerchantUser {
    id: string;
    name: string;
    logoUrl: string;
    category: 'Cafetería' | 'Librería';
}

export interface Offer {
    id: string;
    merchantId: string;
    title: string;
    description: string;
    category: 'Café y Postres' | 'Libros y Cultura';
    discountDetails: string;
    conditions: string;
    views: number;
    redemptions: number;
}

export const MOCK_MERCHANTS: MerchantUser[] = [
    {
        id: 'merchant-1',
        name: 'El Gato Negro Café',
        logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=amber&shade=500',
        category: 'Cafetería',
    },
    {
        id: 'merchant-2',
        name: 'Librería El Virrey',
        logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500',
        category: 'Librería',
    }
];

export const MOCK_OFFERS: Offer[] = [
    {
        id: 'offer-1',
        merchantId: 'merchant-1',
        title: '2x1 en Café Americano',
        description: 'Disfruta de dos cafés americanos por el precio de uno. Ideal para compartir.',
        category: 'Café y Postres',
        discountDetails: '2x1',
        conditions: 'Válido de Lunes a Jueves de 8am a 12pm. No acumulable con otras promociones.',
        views: 1250,
        redemptions: 150,
    },
    {
        id: 'offer-2',
        merchantId: 'merchant-1',
        title: 'Cheesecake + Espresso con 20% OFF',
        description: 'La combinación perfecta para una tarde productiva. Disfruta de nuestro cheesecake artesanal.',
        category: 'Café y Postres',
        discountDetails: '20% OFF',
        conditions: 'Válido todos los días. Mencionar la promoción al ordenar.',
        views: 2300,
        redemptions: 320,
    },
    {
        id: 'offer-3',
        merchantId: 'merchant-2',
        title: '15% de Descuento en Novedades',
        description: 'Descubre los últimos lanzamientos literarios con un descuento exclusivo para la comunidad treevü.',
        category: 'Libros y Cultura',
        discountDetails: '15% OFF',
        conditions: 'Válido para libros publicados en los últimos 3 meses. No aplica para libros de texto.',
        views: 3100,
        redemptions: 210,
    },
];

export const generateMerchantAnalytics = (offers: Offer[]) => {
    const totalRedemptions = offers.reduce((sum, offer) => sum + offer.redemptions, 0);
    const totalViews = offers.reduce((sum, offer) => sum + offer.views, 0);
    const conversionRate = totalViews > 0 ? (totalRedemptions / totalViews) * 100 : 0;
    const MOCK_AVG_TICKET = 25; // S/ 25
    const valueGenerated = totalRedemptions * MOCK_AVG_TICKET;

    const redemptionsOverTime = [
        { label: 'Lun', value: Math.floor(totalRedemptions * 0.1) },
        { label: 'Mar', value: Math.floor(totalRedemptions * 0.15) },
        { label: 'Mié', value: Math.floor(totalRedemptions * 0.12) },
        { label: 'Jue', value: Math.floor(totalRedemptions * 0.18) },
        { label: 'Vie', value: Math.floor(totalRedemptions * 0.25) },
        { label: 'Sáb', value: Math.floor(totalRedemptions * 0.15) },
        { label: 'Dom', value: Math.floor(totalRedemptions * 0.05) },
    ];

    const topPerformingOffers = [...offers].sort((a, b) => b.redemptions - a.redemptions).slice(0, 3);
    
    return {
        totalRedemptions,
        totalViews,
        conversionRate,
        valueGenerated,
        redemptionsOverTime,
        topPerformingOffers,
    };
};