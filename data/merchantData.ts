


export interface MerchantUser {
    id: string;
    name: string;
    logoUrl: string;
    category: 'Cafetería' | 'Librería' | 'Restaurante' | 'Moda y Accesorios' | 'Bienestar y Deporte' | 'Tecnología';
    themeColor: string;
}

export interface Offer {
    id: string;
    merchantId: string;
    title: string;
    description: string;
    category: 'Café y Postres' | 'Libros y Cultura' | 'Restaurantes' | 'Moda y Accesorios' | 'Bienestar y Deporte' | 'Tecnología';
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
        themeColor: 'text-amber-500',
    },
    {
        id: 'merchant-2',
        name: 'Librería El Virrey',
        logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500',
        category: 'Librería',
        themeColor: 'text-indigo-500',
    },
    {
        id: 'merchant-3',
        name: 'Sabor Criollo',
        logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=red&shade=500',
        category: 'Restaurante',
        themeColor: 'text-red-500',
    },
    {
        id: 'merchant-4',
        name: 'Urbano Style',
        logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=pink&shade=500',
        category: 'Moda y Accesorios',
        themeColor: 'text-pink-500',
    },
    {
        id: 'merchant-5',
        name: 'ZenFlow Yoga',
        logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=teal&shade=500',
        category: 'Bienestar y Deporte',
        themeColor: 'text-teal-500',
    },
    {
        id: 'merchant-6',
        name: 'TechHub Perú',
        logoUrl: 'https://tailwindui.com/img/logos/mark.svg?color=sky&shade=500',
        category: 'Tecnología',
        themeColor: 'text-sky-500',
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
        id: 'offer-7',
        merchantId: 'merchant-1',
        title: 'Tu Taza de Café Gratis',
        description: 'En la compra de cualquier sánguche de nuestra carta, te invitamos el café.',
        category: 'Café y Postres',
        discountDetails: 'Gratis',
        conditions: 'Válido con la compra de un sánguche. Aplica para americano o espresso.',
        views: 980,
        redemptions: 95,
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
    {
        id: 'offer-8',
        merchantId: 'merchant-2',
        title: 'Libro del Mes con 25% OFF',
        description: 'Cada mes seleccionamos una joya literaria para ti. Llévatela a un precio especial.',
        category: 'Libros y Cultura',
        discountDetails: '25% OFF',
        conditions: 'Aplica solo al libro seleccionado del mes. Stock limitado.',
        views: 1800,
        redemptions: 120,
    },
    {
        id: 'offer-4',
        merchantId: 'merchant-3',
        title: 'Almuerzo Ejecutivo con 20% OFF',
        description: 'Disfruta de nuestra galardonada sazón criolla en tu almuerzo de mediodía a un precio especial.',
        category: 'Restaurantes',
        discountDetails: '20% OFF',
        conditions: 'Válido de Lunes a Viernes de 12pm a 3pm. Incluye entrada, segundo y refresco.',
        views: 4500,
        redemptions: 600,
    },
    {
        id: 'offer-5',
        merchantId: 'merchant-3',
        title: 'Piqueo Criollo para 2 + Chilcanos',
        description: 'Ideal para el after-office. Un piqueo contundente y dos chilcanos de pisco a un precio inigualable.',
        category: 'Restaurantes',
        discountDetails: 'S/ 79',
        conditions: 'Válido a partir de las 6pm. Precio regular S/ 110.',
        views: 3200,
        redemptions: 450,
    },
    {
        id: 'offer-6',
        merchantId: 'merchant-4',
        title: '30% en la Nueva Colección de Zapatillas',
        description: 'Renueva tu estilo urbano con lo último en calzado. Descuento exclusivo para miembros treevü.',
        category: 'Moda y Accesorios',
        discountDetails: '30% OFF',
        conditions: 'Aplica solo a productos de la nueva temporada. No acumulable.',
        views: 5100,
        redemptions: 480,
    },
    {
        id: 'offer-9',
        merchantId: 'merchant-5',
        title: 'Paquete de Bienvenida: 3 Clases',
        description: 'Inicia tu camino hacia el bienestar. Tres clases de yoga o meditación a un precio introductorio.',
        category: 'Bienestar y Deporte',
        discountDetails: '3 x S/ 50',
        conditions: 'Válido solo para nuevos alumnos. Las 3 clases deben usarse en un plazo de 15 días.',
        views: 2800,
        redemptions: 180,
    },
     {
        id: 'offer-10',
        merchantId: 'merchant-6',
        title: '10% de Descuento en Accesorios',
        description: 'Audífonos, teclados, mouses y más. Equipa tu setup con un descuento especial.',
        category: 'Tecnología',
        discountDetails: '10% OFF',
        conditions: 'No aplica a laptops, celulares o consolas. Válido en productos seleccionados.',
        views: 3500,
        redemptions: 250,
    }
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

    const redemptionsByCategory = offers.reduce((acc, offer) => {
        acc[offer.category] = (acc[offer.category] || 0) + offer.redemptions;
        return acc;
    }, {} as Record<string, number>);

    // --- Generate Historical Data ---
    const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    const now = new Date();
    
    const history = Array.from({ length: 6 }).map((_, i) => {
        const monthIndex = 5 - i;
        const d = new Date(now.getFullYear(), now.getMonth() - monthIndex, 1);
        const monthLabel = monthNames[d.getMonth()];
        
        const trendFactor = 1 - (monthIndex * 0.08) + (Math.random() - 0.5) * 0.1;

        const monthlyViews = totalViews * trendFactor * (0.7 + Math.random() * 0.5) / 6;
        const monthlyRedemptions = totalRedemptions * trendFactor * (0.7 + Math.random() * 0.5) / 6;
        const monthlyConversion = monthlyViews > 0 ? (monthlyRedemptions / monthlyViews) * 100 : 0;

        return {
            month: monthLabel,
            views: Math.round(monthlyViews),
            redemptions: Math.round(monthlyRedemptions),
            conversion: monthlyConversion,
        };
    });

    const redemptionsHistory = history.map(h => ({ month: h.month, value: h.redemptions }));
    const conversionRateHistory = history.map(h => ({ month: h.month, value: h.conversion }));
    const viewsHistory = history.map(h => ({ month: h.month, value: h.views }));
    
    return {
        totalRedemptions,
        totalViews,
        conversionRate,
        valueGenerated,
        redemptionsOverTime,
        topPerformingOffers,
        redemptionsByCategory: Object.entries(redemptionsByCategory)
            .map(([category, count]) => ({ category: category as Offer['category'], count }))
            .sort((a, b) => b.count - a.count),
        redemptionsHistory,
        conversionRateHistory,
        viewsHistory,
    };
};