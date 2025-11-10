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
    department: 'Ventas y Marketing',
    streak: { count: 4, lastDate: getDateString(1) },
    kudosSent: 18,
    kudosReceived: 22,
    tribeId: 'centauri-1',
    featuredBadge: 'pioneer',
    prestigeLevel: 0,
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
    { id: 'ig1', name: 'Maestría en el Extranjero', icon: '🎓', targetAmount: 80000, currentAmount: 12000, createdAt: getDateString(100) },
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
    department: 'Tecnología e Innovación',
    modality: 'Remoto',
    streak: { count: 8, lastDate: getDateString(1) },
    kudosSent: 25,
    kudosReceived: 40,
    tribeId: 'orion-2',
    featuredBadge: 'streak',
    prestigeLevel: 0,
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
    { id: 'ng1', name: 'Viaje a Japón', icon: '🏯', targetAmount: 15000, currentAmount: 8000, createdAt: getDateString(120) },
];


// --- 3. La Visionaria de Metas ---
const visionaryUser: User = {
    id: 'user-visionary',
    name: 'Sofía Castillo',
    email: 'sofia.castillo@example.com',
    picture: `https://ui-avatars.com/api/?name=SC&background=f87171&color=fff&size=128&bold=true`,
    level: TreevuLevel.Arbusto,
    progress: { expensesCount: 55, formalityIndex: 71 },
    treevus: 2800,
    isProfileComplete: true,
    department: 'Tecnología e Innovación',
    streak: { count: 3, lastDate: getDateString(1) },
    kudosSent: 15,
    kudosReceived: 25,
    tribeId: 'andromeda-3',
    featuredBadge: 'pioneer',
    prestigeLevel: 0,
};

const visionaryExpenses: Expense[] = Array.from({ length: 55 }, (_, i) => {
    const daysAgo = (i % 55) + 3; // Spread over the last ~2 months
    const isFormal = i % 3 !== 0; // ~66% formal to maintain the ratio
    let razonSocial, ruc, categoria, total, tipoComprobante, intent;
    if (isFormal) {
        const vendors = [
            { name: 'Plaza Vea', ruc: '20100070970', cat: CategoriaGasto.Alimentacion, t: 60 + Math.random() * 150, intent: 'essential' as const },
            { name: 'Promart', ruc: '20536557858', cat: CategoriaGasto.Vivienda, t: 50 + Math.random() * 100, intent: 'essential' as const },
            { name: 'Oechsle', ruc: '20493020618', cat: CategoriaGasto.Consumos, t: 80 + Math.random() * 120, intent: 'desired' as const },
            { name: 'Movistar', ruc: '20100017491', cat: CategoriaGasto.Servicios, t: 70, intent: 'essential' as const },
        ];
        const vendor = vendors[i % vendors.length];
        razonSocial = vendor.name; ruc = vendor.ruc; categoria = vendor.cat; total = vendor.t; tipoComprobante = TipoComprobante.BoletaVentaElectronica; intent = vendor.intent;
    } else {
         const vendors = [
            { name: 'Café para llevar', cat: CategoriaGasto.Alimentacion, t: 15 + Math.random() * 5, intent: 'desired' as const },
            { name: 'Mercado local', cat: CategoriaGasto.Alimentacion, t: 40 + Math.random() * 20, intent: 'essential' as const }
        ];
        const vendor = vendors[i % vendors.length];
        razonSocial = vendor.name; ruc = 'N/A'; categoria = vendor.cat; total = vendor.t; tipoComprobante = TipoComprobante.SinComprobante; intent = vendor.intent;
    }
    total = parseFloat(total.toFixed(2));
    const igv = isFormal ? total * (18 / 118) : 0;
    const ahorroPerdido = !isFormal ? total * 0.18 : 0;
    return {
        id: `v${i + 1}`, razonSocial, ruc, fecha: getDateString(daysAgo), total, categoria, tipoComprobante, intent,
        esFormal: isFormal, ahorroPerdido: parseFloat(ahorroPerdido.toFixed(2)), igv: parseFloat(igv.toFixed(2)),
    };
});

const visionaryGoals: Goal[] = [
    { id: 'vg1', name: 'Inicial de Departamento', icon: '🏠', targetAmount: 50000, currentAmount: 35000, createdAt: getDateString(200) },
    { id: 'vg2', name: 'Fondo de Emergencia', icon: '🛡️', targetAmount: 10000, currentAmount: 10000, createdAt: getDateString(300) },
];

const visionaryNotifications: Notification[] = [
    { id: 'vn1', type: NotificationType.GoalMilestone, title: '¡Meta casi completada!', message: 'Estás al 70% de tu meta "Inicial de Departamento". ¡Sigue así!', timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000, isRead: false },
    { id: 'vn2', type: NotificationType.Info, title: '¡Nuevo Nivel!', message: 'Alcanzaste el nivel Arbusto Consciente. ¡+100 Treevüs para ti!', timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, isRead: true },
];

export type ArchetypeKey = 'intrapreneur' | 'nomad' | 'visionary';

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
    visionary: {
        user: visionaryUser,
        expenses: visionaryExpenses,
        goals: visionaryGoals,
        budget: 3500,
        annualIncome: 80000,
        notifications: visionaryNotifications,
    },
};
