import { TreevuLevel } from '../types/common';
import { CategoriaGasto, TipoComprobante } from '../types/common';
import { User } from '../types/user';
import { Expense } from '../types/expense';
import { Goal } from '../types/goal';
import { Notification, NotificationType } from '../types/notification';

// Helper to get dates
const getDateString = (daysAgo: number) => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString().split('T')[0];
};

// --- 1. El Intraemprendedor Ambicioso ---
const intrapreneurUser: User = {
    id: 'user-intrapreneur',
    name: 'Mateo Rojas',
    email: 'mateo.rojas@example.com',
    picture: `https://ui-avatars.com/api/?name=MR&background=818cf8&color=eef2ff&size=128&bold=true`,
    level: TreevuLevel.Plantón,
    progress: { expensesCount: 35, formalityIndex: 68 },
    treevus: 1250,
    isProfileComplete: true,
    hasCorporateCard: true,
    department: 'Ventas y Marketing',
    streak: { count: 4, lastDate: getDateString(1) },
    kudosSent: 18,
    kudosReceived: 22,
    tribeId: 'centauri-1',
    featuredBadge: 'pioneer',
    prestigeLevel: 0,
    registrationDate: getDateString(100),
    lastActivityDate: getDateString(1),
    rewardsClaimedCount: 0,
    engagementScore: 65,
    fwiTrend: 'improving',
    isCompanyLinkComplete: true,
    hasAcceptedEthicalPromise: true,
    hasCompletedOnboarding: true,
};

const intrapreneurExpenses: Expense[] = Array.from({ length: 35 }, (_, i) => {
    const daysAgo = Math.floor(i * 1.5) + 1;
    const isFormal = i % 4 !== 0; // ~75% formal
    let razonSocial, ruc, categoria, total, tipoComprobante, intent;
    if (isFormal) {
        const vendors = [
            { name: 'Chili\'s', ruc: '20100169887', cat: CategoriaGasto.Alimentacion, t: 70 + Math.random() * 50, intent: 'desired' as const },
            { name: 'Plaza Vea', ruc: '20100070970', cat: CategoriaGasto.Alimentacion, t: 90 + Math.random() * 100, intent: 'essential' as const },
            { name: 'Beat', ruc: 'N/A', cat: CategoriaGasto.Transporte, t: 25 + Math.random() * 15, intent: 'essential' as const },
            { name: 'WeWork', ruc: '20601837641', cat: CategoriaGasto.Servicios, t: 150, intent: 'essential' as const },
        ];
        const vendor = vendors[i % vendors.length];
        razonSocial = vendor.name; ruc = vendor.ruc; categoria = vendor.cat; total = vendor.t; tipoComprobante = TipoComprobante.BoletaVentaElectronica; intent = vendor.intent;
    } else {
        const vendors = [
            { name: 'Café de la esquina', cat: CategoriaGasto.Alimentacion, t: 10 + Math.random() * 5, intent: 'desired' as const },
            { name: 'Menú de almuerzo', cat: CategoriaGasto.Alimentacion, t: 18 + Math.random() * 8, intent: 'essential' as const },
            { name: 'Taxi de la calle', cat: CategoriaGasto.Transporte, t: 20 + Math.random() * 10, intent: 'essential' as const },
        ];
        const vendor = vendors[i % vendors.length];
        razonSocial = vendor.name; ruc = 'N/A'; categoria = vendor.cat; total = vendor.t; tipoComprobante = TipoComprobante.SinComprobante; intent = vendor.intent;
    }
    total = parseFloat(total.toFixed(2));
    const igv = isFormal ? total * (18 / 118) : 0;
    const ahorroPerdido = !isFormal ? total * 0.18 : 0;
    return {
        id: `i${i + 1}`, razonSocial, ruc, fecha: getDateString(daysAgo), total, categoria, tipoComprobante, intent,
        esFormal: isFormal, ahorroPerdido: parseFloat(ahorroPerdido.toFixed(2)), igv: parseFloat(igv.toFixed(2)),
    };
});

const intrapreneurGoals: Goal[] = [
    { id: 'ig1', name: 'Maestría en el Extranjero', icon: '🎓', targetAmount: 80000, currentAmount: 12000, createdAt: getDateString(100), status: 'active' },
];

// --- 2. La Nómada Digital ---
const nomadUser: User = {
    id: 'user-nomad',
    name: 'Camila Soto',
    email: 'camila.soto@example.com',
    picture: `https://ui-avatars.com/api/?name=CS&background=c084fc&color=f3e8ff&size=128&bold=true`,
    level: TreevuLevel.Arbusto,
    progress: { expensesCount: 55, formalityIndex: 78 },
    treevus: 3200,
    isProfileComplete: true,
    hasCorporateCard: true,
    department: 'Tecnología e Innovación',
    modality: 'Remoto',
    streak: { count: 8, lastDate: getDateString(1) },
    kudosSent: 25,
    kudosReceived: 40,
    tribeId: 'orion-2',
    featuredBadge: 'streak',
    prestigeLevel: 0,
    registrationDate: getDateString(150),
    lastActivityDate: getDateString(1),
    rewardsClaimedCount: 2,
    engagementScore: 78,
    fwiTrend: 'stable',
    isCompanyLinkComplete: true,
    hasAcceptedEthicalPromise: true,
    hasCompletedOnboarding: true,
};

const nomadExpenses: Expense[] = Array.from({ length: 55 }, (_, i) => {
    const daysAgo = Math.floor(i * 1.2) + 1;
    const isFormal = i % 5 !== 0; // 80% formal
    let razonSocial, ruc, categoria, total, tipoComprobante, intent;
    if (isFormal) {
        const vendors = [
            { name: 'Spotify', ruc: 'N/A', cat: CategoriaGasto.Ocio, t: 20, intent: 'desired' as const },
            { name: 'Netflix', ruc: 'N/A', cat: CategoriaGasto.Ocio, t: 40, intent: 'desired' as const },
            { name: 'AWS Services', ruc: 'N/A', cat: CategoriaGasto.Servicios, t: 80 + Math.random() * 50, intent: 'essential' as const },
            { name: 'Rappi', ruc: '20603751222', cat: CategoriaGasto.Alimentacion, t: 45 + Math.random() * 30, intent: 'desired' as const },
            { name: 'iShop', ruc: '20517724237', cat: CategoriaGasto.Consumos, t: 500 + Math.random() * 200, intent: 'desired' as const },
        ];
        const vendor = vendors[i % vendors.length];
        razonSocial = vendor.name; ruc = vendor.ruc; categoria = vendor.cat; total = vendor.t; tipoComprobante = TipoComprobante.Otro; intent = vendor.intent;
    } else {
        const vendors = [
            { name: 'Antojos de medianoche', cat: CategoriaGasto.Alimentacion, t: 25 + Math.random() * 10, intent: 'desired' as const },
            { name: 'Artesanías locales', cat: CategoriaGasto.Consumos, t: 50 + Math.random() * 20, intent: 'desired' as const },
        ];
        const vendor = vendors[i % vendors.length];
        razonSocial = vendor.name; ruc = 'N/A'; categoria = vendor.cat; total = vendor.t; tipoComprobante = TipoComprobante.SinComprobante; intent = vendor.intent;
    }
    total = parseFloat(total.toFixed(2));
    const igv = isFormal ? total * (18 / 118) : 0;
    const ahorroPerdido = !isFormal ? total * 0.18 : 0;
    return {
        id: `n${i + 1}`, razonSocial, ruc, fecha: getDateString(daysAgo), total, categoria, tipoComprobante, intent,
        esFormal: isFormal, ahorroPerdido: parseFloat(ahorroPerdido.toFixed(2)), igv: parseFloat(igv.toFixed(2)),
    };
});

const nomadGoals: Goal[] = [
    { id: 'ng1', name: 'Viaje a Japón', icon: '🏯', targetAmount: 15000, currentAmount: 8000, createdAt: getDateString(120), status: 'active' },
];

export type ArchetypeKey = 'intrapreneur' | 'nomad';

export const archetypeData: {
    [key in ArchetypeKey]: {
        user: User;
        expenses: Expense[];
        goals: Goal[];
        budget: number;
        annualIncome: number;
        notifications: Notification[];
    }
} = {
    intrapreneur: {
        user: intrapreneurUser,
        expenses: intrapreneurExpenses,
        goals: intrapreneurGoals,
        budget: 4500,
        annualIncome: 95000,
        notifications: [
            { id: 'in1', type: NotificationType.Kudos, title: '¡Recibiste un Trofeo!', message: 'Camila Soto te ha reconocido por tu gran presentación.', timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, isRead: false },
        ],
    },
    nomad: {
        user: nomadUser,
        expenses: nomadExpenses,
        goals: nomadGoals,
        budget: 6000,
        annualIncome: 120000,
        notifications: [
            { id: 'nn1', type: NotificationType.StreakBonus, title: '¡Racha de 8 Días!', message: '¡Tu constancia te dio un bono de +15 treevüs! Sigue así.', timestamp: Date.now() - 20 * 60 * 60 * 1000, isRead: false },
        ],
    },
};