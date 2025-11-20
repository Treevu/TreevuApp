import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, UserProfile, Expense, Offer, TreevuLevel, ExpenseCategory, CompanyKPIs, SavingsGoal, Squad, SubscriptionTier, PlanConfig, MissionType, MissionStatus, OfferType, Kudo, AppTheme, Department, SafeToSpendGranularity, DashboardSummaryResponse, ProjectionFocusResponse, AppView, MerchantActivityLog, HourlyTrafficData, AppNotification } from '../types';
import { calculateLevel, calculateStreak, calculateExpensePoints } from '../services/gamificationService';

// --- PRICING MATRIX CONFIGURATION (USD) ---
export const PLANS: Record<UserRole, PlanConfig[]> = {
  [UserRole.GUEST]: [],
  [UserRole.EMPLOYEE]: [
    {
      id: SubscriptionTier.FREE,
      name: "Starter",
      priceMonthly: 0,
      priceAnnual: 0,
      slogan: "Tu aventura financiera personal.",
      ctaText: "Plan Actual",
      features: [
        { text: "Registro de Gastos (Manual + IA Básico)", included: true },
        { text: "Creación de Proyectos de Ahorro", included: true },
        { text: "Gamificación (Niveles y Badges)", included: true },
        { text: "Asistente IA Avanzado", included: false },
        { text: "Radar Fiscal (Devolución de Impuestos)", included: false },
      ]
    },
    {
      id: SubscriptionTier.PRO,
      name: "Explorer",
      priceMonthly: 9,
      priceAnnual: 90, // Savings: $18 (2 months free)
      slogan: "Acceso total y beneficios corporativos.",
      recommended: true,
      ctaText: "Mejorar Plan",
      features: [
        { text: "Todo lo del plan Starter", included: true },
        { text: "Asistente IA Avanzado & Coaching", included: true, highlight: true },
        { text: "Radar Fiscal (Análisis 3 UIT)", included: true, highlight: true },
        { text: "Tienda Global de Recompensas", included: true },
        { text: "Protección de Rachas (Streak Guard)", included: true },
      ]
    }
  ],
  [UserRole.EMPLOYER]: [
    {
      id: SubscriptionTier.PLUS,
      name: "Launch",
      priceMonthly: 7,
      priceAnnual: 70, // Savings: $14 (2 months free)
      priceUnit: "/ usuario",
      slogan: "Para Pilotos y Startups.",
      ctaText: "Comenzar Piloto",
      features: [
        { text: "App de Bienestar para empleados", included: true },
        { text: "Dashboard con KPIs Globales", included: true },
        { text: "FWI General de la Compañía", included: true },
        { text: "Módulo de Kudos Básico", included: true },
        { text: "Riesgo de Fuga Predictivo", included: false },
      ]
    },
    {
      id: SubscriptionTier.PRO,
      name: "Growth",
      priceMonthly: 15,
      priceAnnual: 150, // Savings: $30 (2 months free)
      priceUnit: "/ usuario",
      slogan: "Inteligencia para expansión.",
      recommended: true,
      ctaText: "Mejorar Plan",
      features: [
        { text: "FWI Segmentado (Áreas/Edad)", included: true, highlight: true },
        { text: "Riesgo de Fuga Predictivo", included: true, highlight: true },
        { text: "Módulo de Engagement & Retos", included: true },
        { text: "Filtros Estratégicos de Data", included: true },
        { text: "Simulador de Impacto IA", included: false },
      ]
    },
    {
      id: SubscriptionTier.ENTERPRISE,
      name: "Enterprise",
      priceMonthly: 0,
      priceAnnual: 0,
      isCustom: true,
      slogan: "Para Grandes Organizaciones.",
      ctaText: "Contactar Ventas",
      features: [
        { text: "Simulador de Impacto IA", included: true, highlight: true },
        { text: "Integración HRIS & SSO", included: true },
        { text: "Soporte Dedicado (CSM)", included: true },
        { text: "Recompensas Personalizadas", included: true },
        { text: "Boosts de Gamificación", included: true },
      ]
    }
  ],
  [UserRole.MERCHANT]: [
    {
      id: SubscriptionTier.FREE,
      name: "Connect",
      priceMonthly: 0,
      priceAnnual: 0,
      priceUnit: "(CPA)",
      slogan: "Únete a la red sin riesgo.",
      ctaText: "Plan Actual",
      features: [
        { text: "Publicación en Marketplace", included: true },
        { text: "Dashboard de Rendimiento Básico", included: true },
        { text: "Pago solo por conversión (Venta)", included: true },
        { text: "Visibilidad Destacada", included: false },
        { text: "IA Marketing Assistant", included: false },
      ]
    },
    {
      id: SubscriptionTier.PRO,
      name: "Amplify",
      priceMonthly: 39,
      priceAnnual: 390, // Savings: $78 (2 months free)
      slogan: "Maximiza tu alcance.",
      recommended: true,
      ctaText: "Mejorar Plan",
      features: [
        { text: "Todo lo del plan Connect", included: true },
        { text: "Visibilidad Destacada (Featured)", included: true, highlight: true },
        { text: "Analítica Avanzada vs Sector", included: true },
        { text: "Asistente IA de Marketing", included: true, highlight: true },
        { text: "Reporte de Oportunidad B2B", included: true },
      ]
    }
  ]
};

// --- Initial State Mocks ---
const INITIAL_USER: UserProfile = {
  name: "Alex Nomad",
  email: "alex.nomad@treevu.com",
  bio: "Cazador de experiencias y nómada digital.",
  role: UserRole.GUEST,
  avatarUrl: "https://picsum.photos/seed/alex/100/100",
  treevus: 1240,
  level: TreevuLevel.ARBUSTO,
  fwiScore: 72,
  fwiBreakdown: {
    formalScore: 65,
    balanceScore: 80,
    devScore: 50
  },
  monthlyBudget: 3000,
  squadId: undefined, // Start without squad to show join flow
  subscriptionTier: SubscriptionTier.FREE, // Default starting tier
  currentStreak: 4,
  lastActivityDate: new Date().toISOString(),
  theme: AppTheme.SYSTEM,
  notifications: {
    email: true,
    push: true,
    marketing: false
  },
  privacy: {
    publicProfile: true,
    shareStats: true
  }
};

const MOCK_EXPENSES: Expense[] = [
  { id: '1', merchant: 'Uber', amount: 25, date: '2023-10-25', category: ExpenseCategory.TRANSPORT, isFormal: true, igv: 3.81, treevusEarned: 8 },
  { id: '2', merchant: 'Puesto Comida', amount: 12, date: '2023-10-26', category: ExpenseCategory.FOOD, isFormal: false, lostSavings: 2.16, treevusEarned: 1 },
  { id: '3', merchant: 'Netflix', amount: 45, date: '2023-10-24', category: ExpenseCategory.ENTERTAINMENT, isFormal: true, igv: 6.86, treevusEarned: 8 },
];

const MOCK_GOALS: SavingsGoal[] = [
  { 
    id: '1', 
    title: 'MacBook Pro M3', 
    targetAmount: 7500, 
    currentAmount: 2400, 
    deadline: '2024-08-15', 
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80', 
    color: 'bg-emerald-600' 
  },
  { 
    id: '2', 
    title: 'Viaje a Cusco', 
    targetAmount: 3500, 
    currentAmount: 1800, 
    deadline: '2024-07-28', 
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80', 
    color: 'bg-green-600' 
  },
  { 
    id: '3', 
    title: 'Fondo Emergencia', 
    targetAmount: 10000, 
    currentAmount: 1500, 
    deadline: '2024-12-31', 
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80', 
    color: 'bg-teal-600' 
  },
];

const MOCK_OFFERS: Offer[] = [
  { 
    id: '1', 
    title: '20% Dscto Menú', 
    description: 'Descuento exclusivo en menú ejecutivo.',
    merchantName: 'Green Salad Co.', 
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80',
    discount: 20, 
    costTreevus: 250, 
    redemptions: 124, 
    revenueGenerated: 4200,
    type: OfferType.GLOBAL,
    isCashback: true
  },
  { 
    id: '2', 
    title: 'Café Gratis', 
    description: 'Un café americano o espresso gratis.',
    merchantName: 'Bean There', 
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=400&q=80',
    discount: 100, 
    costTreevus: 100, 
    redemptions: 89, 
    revenueGenerated: 0,
    type: OfferType.GLOBAL
  },
  { 
    id: '3', 
    title: 'Membresía Gym', 
    description: 'Matrícula bonificada al 100%.',
    merchantName: 'Iron Pump', 
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=400&q=80',
    discount: 15, 
    costTreevus: 2000, 
    redemptions: 45, 
    revenueGenerated: 12500,
    type: OfferType.COMPANY
  },
  { 
    id: '4', 
    title: 'Cena para Dos', 
    description: 'Postre de cortesía y 10% en vinos.',
    merchantName: 'La Mar', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80',
    discount: 10, 
    costTreevus: 500, 
    redemptions: 32, 
    revenueGenerated: 8400,
    isFlash: true,
    expiresAt: new Date(Date.now() + 7200000).toISOString(),
    type: OfferType.GLOBAL
  },
  {
      id: '5',
      title: 'Medio Día Libre',
      description: 'Canjea tus puntos por tiempo libre el viernes.',
      merchantName: 'Mi Empresa (HR)',
      image: 'https://images.unsplash.com/photo-1499750310159-5b9883e73c75?auto=format&fit=crop&w=400&q=80',
      discount: 100,
      costTreevus: 5000,
      redemptions: 5,
      revenueGenerated: 0,
      type: OfferType.COMPANY
  }
];

const MOCK_KPIS: CompanyKPIs = {
  avgFWI: 68,
  flightRiskScore: 35,
  roiMultiplier: 4.2,
  retentionSavings: 150000,
  projectedENPS: 42,
  spendingIntent: { essential: 60, desired: 40 },
  teamMoodScore: 75,
  trend: {
      avgFWI: 2.5,
      flightRiskScore: -5.2,
      retentionSavings: 12.8
  },
  adoption: {
      active: 65,
      sporadic: 25,
      inactive: 10
  },
  history: {
      avgFWI: [62, 63, 65, 64, 66, 68],
      flightRiskScore: [45, 42, 40, 38, 36, 35],
      retentionSavings: [120000, 125000, 132000, 138000, 145000, 150000],
      moodHistory: [65, 68, 72, 70, 75, 74, 78, 80, 79, 75, 72, 74, 76, 75]
  }
};

const MOCK_SQUADS: Squad[] = [
  {
    id: 'sq-1',
    name: 'Cyber Nómadas',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Cyber',
    totalTreevus: 15400,
    rank: 2,
    members: [
      { name: 'Alex', avatar: 'https://picsum.photos/seed/alex/50', isMvp: true },
      { name: 'Sarah', avatar: 'https://picsum.photos/seed/sarah/50' },
      { name: 'Mike', avatar: 'https://picsum.photos/seed/mike/50' }
    ],
    missions: [
        {
            id: 'm1',
            title: 'Cazadores de IGV',
            description: 'Registren 50 gastos formales en equipo esta semana.',
            type: MissionType.FISCAL,
            status: MissionStatus.ACTIVE,
            progress: 75,
            target: 100,
            rewardTreevus: 500,
            icon: '🧾'
        },
        {
            id: 'm2',
            title: 'Almuerzo Squad',
            description: 'Almuercen juntos y suban la foto (check-in).',
            type: MissionType.SOCIAL,
            status: MissionStatus.LOCKED,
            progress: 0,
            target: 1,
            rewardTreevus: 200,
            icon: '🍔'
        },
        {
            id: 'm3',
            title: 'Zero Gastos Hormiga',
            description: 'Un día entero sin gastos menores a S/10.',
            type: MissionType.HABIT,
            status: MissionStatus.LOCKED,
            progress: 0,
            target: 5,
            rewardTreevus: 350,
            icon: '🐜'
        }
    ]
  },
  {
    id: 'sq-2',
    name: 'Titanes Dev Ops',
    avatarUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=Dev',
    totalTreevus: 18200,
    rank: 1,
    members: [
      { name: 'Jin', avatar: 'https://picsum.photos/seed/jin/50' },
      { name: 'Todd', avatar: 'https://picsum.photos/seed/todd/50' }
    ],
    missions: [
        {
            id: 'm1',
            title: 'Ahorro Extremo',
            description: '0 Gastos Hormiga por 3 días.',
            type: MissionType.HABIT,
            status: MissionStatus.ACTIVE,
            progress: 40,
            target: 100,
            rewardTreevus: 1000,
            icon: '🛡️'
        }
    ]
  }
];

const MOCK_MERCHANT_LOGS: MerchantActivityLog[] = [
  { id: 'l1', action: 'REDEMPTION', userInitial: 'MC', detail: 'Canjeó "20% Dscto Menú"', timeAgo: '2 min', value: 250 },
  { id: 'l2', action: 'VIEW', userInitial: 'JP', detail: 'Vio oferta "Cena para Dos"', timeAgo: '15 min' },
  { id: 'l3', action: 'REDEMPTION', userInitial: 'AL', detail: 'Canjeó "Café Gratis"', timeAgo: '42 min', value: 100 },
  { id: 'l4', action: 'REVIEW', userInitial: 'SR', detail: 'Dejó 5 estrellas', timeAgo: '1 hr' }
];

// Dummy Data: Richer 12-hour window for visualization
const MOCK_HOURLY_TRAFFIC: HourlyTrafficData[] = [
  { hour: '10am', volume: 15, isPeak: false },
  { hour: '11am', volume: 30, isPeak: false },
  { hour: '12pm', volume: 60, isPeak: false },
  { hour: '1pm', volume: 95, isPeak: true }, // Lunch Peak
  { hour: '2pm', volume: 70, isPeak: false },
  { hour: '3pm', volume: 40, isPeak: false },
  { hour: '4pm', volume: 35, isPeak: false },
  { hour: '5pm', volume: 50, isPeak: false },
  { hour: '6pm', volume: 75, isPeak: false },
  { hour: '7pm', volume: 90, isPeak: true }, // Dinner Peak
  { hour: '8pm', volume: 85, isPeak: true },
  { hour: '9pm', volume: 40, isPeak: false }
];

const MOCK_SECTOR_TRAFFIC: HourlyTrafficData[] = [
  { hour: '10am', volume: 20, isPeak: false },
  { hour: '11am', volume: 35, isPeak: false },
  { hour: '12pm', volume: 65, isPeak: false },
  { hour: '1pm', volume: 80, isPeak: true }, // Lower peak than us
  { hour: '2pm', volume: 60, isPeak: false },
  { hour: '3pm', volume: 45, isPeak: false },
  { hour: '4pm', volume: 40, isPeak: false },
  { hour: '5pm', volume: 55, isPeak: false },
  { hour: '6pm', volume: 70, isPeak: false },
  { hour: '7pm', volume: 85, isPeak: true },
  { hour: '8pm', volume: 70, isPeak: false }, // We retain more dinner crowd
  { hour: '9pm', volume: 30, isPeak: false }
];

const MOCK_SECTOR_STATS = {
    avgTicket: 38.50,
    avgTraffic: 980
};

// Initial Pre-mapped merchants for demo
const INITIAL_MERCHANT_MAP: Record<string, ExpenseCategory> = {
    'UBER': ExpenseCategory.TRANSPORT,
    'CABIFY': ExpenseCategory.TRANSPORT,
    'STARBUCKS': ExpenseCategory.FOOD,
    'NETFLIX': ExpenseCategory.ENTERTAINMENT,
    'SPOTIFY': ExpenseCategory.ENTERTAINMENT,
    'METRO': ExpenseCategory.FOOD,
    'WONG': ExpenseCategory.FOOD,
    'PLAZA VEA': ExpenseCategory.FOOD,
    'CLARO': ExpenseCategory.UTILITIES,
    'MOVISTAR': ExpenseCategory.UTILITIES,
    'LUZ DEL SUR': ExpenseCategory.UTILITIES
};

interface StoreContextType {
  user: UserProfile;
  role: UserRole;
  expenses: Expense[];
  savingsGoals: SavingsGoal[];
  offers: Offer[];
  companyKPIs: CompanyKPIs;
  squads: Squad[];
  userSquad: Squad | undefined;
  isPricingOpen: boolean;
  isChatOpen: boolean;
  kudos: Kudo[];
  levelUp: TreevuLevel | null; // New State for Modal
  setLevelUp: (l: TreevuLevel | null) => void;
  switchRole: (role: UserRole) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  addExpense: (expense: Partial<Expense>) => void;
  bulkAddExpenses: (newExpenses: Partial<Expense>[]) => void;
  editExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  registerSkippedExpense: () => void;
  redeemOffer: (offerId: string) => boolean;
  addOffer: (offer: Partial<Offer>) => void;
  upgradeSubscription: (tier: SubscriptionTier) => void;
  togglePricingModal: (isOpen: boolean) => void;
  toggleChat: (isOpen: boolean) => void;
  submitPulseCheck: (mood: number) => void;
  sendKudos: (toUser: string, message: string) => void;
  updateMonthlyBudget: (amount: number) => void;
  contributeToGoal: (goalId: string, amount: number) => void;
  setTheme: (theme: AppTheme) => void;
  downloadReport: () => void;
  joinSquad: (squadId: string) => void;
  // Mapping Logic
  getSuggestedCategory: (merchant: string) => ExpenseCategory | undefined;
  learnMerchantCategory: (merchant: string, category: ExpenseCategory) => void;
  // Granularity Filters
  filterCompanyKPIs: (department: Department) => void;
  // B2C API Contract Methods
  safeToSpendGranularity: SafeToSpendGranularity;
  setSafeToSpendGranularity: (g: SafeToSpendGranularity) => void;
  getDashboardSummary: () => DashboardSummaryResponse;
  getProjectionByFocus: (categoryIds: string[]) => ProjectionFocusResponse;
  // Navigation Logic
  currentView: AppView;
  navigate: (view: AppView) => void;
  goBack: () => void;
  // Merchant Data
  merchantActivityLog: MerchantActivityLog[];
  hourlyTraffic: HourlyTrafficData[];
  sectorHourlyTraffic: HourlyTrafficData[];
  sectorStats: { avgTicket: number; avgTraffic: number; };
  // Notifications
  notifications: AppNotification[];
  addNotification: (message: string, type?: 'success' | 'info' | 'error' | 'warning') => void;
  removeNotification: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

export const StoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [role, setRole] = useState<UserRole>(UserRole.GUEST);
  const [expenses, setExpenses] = useState<Expense[]>(MOCK_EXPENSES);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>(MOCK_GOALS);
  const [offers, setOffers] = useState<Offer[]>(MOCK_OFFERS);
  const [companyKPIs, setCompanyKPIs] = useState<CompanyKPIs>(MOCK_KPIS);
  const [squads] = useState<Squad[]>(MOCK_SQUADS);
  const [kudos, setKudos] = useState<Kudo[]>([]);
  const [merchantMap, setMerchantMap] = useState<Record<string, ExpenseCategory>>(INITIAL_MERCHANT_MAP);
  
  // Gamification Celebration State
  const [levelUp, setLevelUp] = useState<TreevuLevel | null>(null);

  // Pricing Modal State
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  
  // AI Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // B2C Granularity State
  const [safeToSpendGranularity, setSafeToSpendGranularity] = useState<SafeToSpendGranularity>(SafeToSpendGranularity.DAILY);

  // Navigation State
  const [viewStack, setViewStack] = useState<AppView[]>([AppView.DASHBOARD]);
  const currentView = viewStack[viewStack.length - 1];

  const userSquad = squads.find(s => s.id === user.squadId);

  // Theme Logic
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (user.theme === AppTheme.SYSTEM) {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(user.theme);
    }
  }, [user.theme]);

  const setTheme = (theme: AppTheme) => {
    setUser(prev => ({ ...prev, theme }));
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setViewStack([AppView.DASHBOARD]); // Reset view stack on role change
    
    // Logic to reset tier based on role defaults
    let defaultTier = SubscriptionTier.FREE;
    if (newRole === UserRole.EMPLOYER) defaultTier = SubscriptionTier.PLUS; // Launch by default for demo
    if (newRole === UserRole.MERCHANT) defaultTier = SubscriptionTier.FREE; // Connect
    
    setUser(prev => ({ 
      ...prev, 
      role: newRole,
      subscriptionTier: defaultTier
    }));
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // --- NOTIFICATION LOGIC ---
  const addNotification = (message: string, type: 'success' | 'info' | 'error' | 'warning' = 'success') => {
    const id = Math.random().toString(36).substring(7);
    setNotifications(prev => [...prev, { id, message, type }]);
    // Auto remove after 3s
    setTimeout(() => removeNotification(id), 3000);
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // --- NAVIGATION LOGIC ---
  const navigate = (view: AppView) => {
    setViewStack(prev => [...prev, view]);
  };

  const goBack = () => {
    if (viewStack.length > 1) {
        setViewStack(prev => prev.slice(0, -1));
    } else {
        // If at root dashboard, go back to role selection
        switchRole(UserRole.GUEST);
    }
  };

  // --- API CONTRACT IMPLEMENTATIONS ---

  const getDashboardSummary = (): DashboardSummaryResponse => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, daysInMonth - today.getDate() + 1); // +1 to include today
    
    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
    const remainingBudget = Math.max(0, user.monthlyBudget - totalSpent);
    
    let safeAmount = remainingBudget / daysRemaining;

    // Adjust for Granularity
    if (safeToSpendGranularity === SafeToSpendGranularity.WEEKLY) {
        // If less than 7 days, just show total remaining (or cap at 7 days logic)
        // Logic: (Daily * 7) or Remaining if < 7 days left
        safeAmount = safeAmount * Math.min(7, daysRemaining);
    }

    // Mock trend history
    const trend = [safeAmount * 0.9, safeAmount * 0.95, safeAmount * 0.8, safeAmount * 1.1, safeAmount];

    return {
        user_name: user.name,
        safe_to_spend: {
            granularity: safeToSpendGranularity,
            amount: safeAmount,
            currency: 'S/',
            period_remaining_days: daysRemaining,
            last_5_days_trend: trend
        },
        fwi_score: user.fwiScore,
        fwi_breakdown: {
            health: user.fwiBreakdown?.formalScore || 0,
            balance: user.fwiBreakdown?.balanceScore || 0,
            development: user.fwiBreakdown?.devScore || 0
        },
        ai_coach_message: "Vas por buen camino, ¡sigue formalizando gastos!"
    };
  };

  const getProjectionByFocus = (categoryIds: string[]): ProjectionFocusResponse => {
    const totalSpentAll = expenses.reduce((acc, e) => acc + e.amount, 0);
    
    // Filter expenses by category if provided, else use all
    const relevantExpenses = categoryIds.length > 0 
        ? expenses.filter(e => categoryIds.includes(e.category))
        : expenses;
    
    const spent = relevantExpenses.reduce((acc, e) => acc + e.amount, 0);
    
    // Simple linear projection
    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const projected = (spent / Math.max(1, today)) * daysInMonth;

    // Estimate budget portion (Mock logic: 50% for Food/Transport/Utilities, 30% others)
    const budgetPortion = categoryIds.length > 0 
        ? user.monthlyBudget * 0.4 
        : user.monthlyBudget;

    const status = projected > budgetPortion ? 'EXCEEDING_RISK' : projected > (budgetPortion * 0.8) ? 'WARNING' : 'OK';

    // Generate mock chart data
    const chartData = [1, 7, 14, 21, 28].map(day => ({
        day,
        value: (projected / daysInMonth) * day
    }));

    return {
        focus_projection: {
            selected_categories: categoryIds,
            spent_month_to_date: spent,
            budgeted_for_group: budgetPortion,
            projected_end_of_month: projected,
            status,
            projection_chart_data: chartData
        }
    };
  };

  // ------------------------------------

  const updateMonthlyBudget = (amount: number) => {
      setUser(prev => ({ ...prev, monthlyBudget: amount }));
      addNotification("Presupuesto actualizado correctamente");
  };

  // --- MERCHANT MAPPING LOGIC ---
  const normalizeMerchantName = (name: string): string => {
    if (!name) return '';
    return name
      .toUpperCase()
      .replace(/[0-9]/g, '') // Remove numbers (e.g. Starbucks 123 -> STARBUCKS)
      .replace(/[^\w\s]/g, '') // Remove special chars
      .trim();
  };

  const getSuggestedCategory = (merchant: string): ExpenseCategory | undefined => {
    const normalized = normalizeMerchantName(merchant);
    return merchantMap[normalized];
  };

  const learnMerchantCategory = (merchant: string, category: ExpenseCategory) => {
    const normalized = normalizeMerchantName(merchant);
    if (normalized) {
        setMerchantMap(prev => ({ ...prev, [normalized]: category }));
    }
  };

  const recalculateUserStats = (currentExpenses: Expense[]) => {
    const allTotal = currentExpenses.reduce((acc, e) => acc + e.amount, 0);
    const allFormalTotal = currentExpenses.filter(e => e.isFormal).reduce((acc, e) => acc + e.amount, 0);
    const fFormal = allTotal > 0 ? (allFormalTotal / allTotal) * 100 : 0;
    
    const totalBudget = user.monthlyBudget || 1;
    const savingsRatio = Math.max(0, (totalBudget - allTotal) / totalBudget);
    const streakBonus = Math.min(100, (user.currentStreak || 0) * 10);

    // FORMULA v1 (From Product Req)
    const newFWI = Math.round((fFormal * 0.4) + (savingsRatio * 100 * 0.3) + (streakBonus * 0.3));

    setUser(prev => ({ 
        ...prev, 
        fwiScore: newFWI,
        fwiBreakdown: { ...prev.fwiBreakdown!, formalScore: fFormal },
    }));
  };

  const addExpense = (expenseData: Partial<Expense>) => {
    bulkAddExpenses([expenseData]);
  };

  const bulkAddExpenses = (newExpensesData: Partial<Expense>[]) => {
    if (newExpensesData.length === 0) return;

    const newExpensesFormatted: Expense[] = [];
    let totalReward = 0;
    let totalAmount = 0;
    let formalAmount = 0;

    // --- GAMIFICATION: STREAK CALCULATION ---
    const newStreak = calculateStreak(user.lastActivityDate, user.currentStreak);

    newExpensesData.forEach(data => {
        const amount = data.amount || 0;
        const isFormal = !!data.isFormal;
        
        // Calculate Reward using Service
        const reward = calculateExpensePoints(isFormal, amount);

        totalReward += reward;
        totalAmount += amount;
        if (isFormal) formalAmount += amount;

        newExpensesFormatted.push({
            id: Math.random().toString(36).substring(7),
            merchant: data.merchant || 'Unknown',
            amount: amount,
            date: data.date || new Date().toISOString(),
            category: data.category || ExpenseCategory.FOOD,
            isFormal: isFormal,
            ruc: data.ruc,
            igv: isFormal ? amount * 0.18 : 0,
            lostSavings: !isFormal ? amount * 0.10 : 0,
            treevusEarned: reward
        });
    });

    const updatedExpenses = [...newExpensesFormatted, ...expenses];
    setExpenses(updatedExpenses);

    // --- GAMIFICATION: LEVEL & POINTS ---
    const newTotalTreevus = user.treevus + totalReward;
    const newLevel = calculateLevel(newTotalTreevus);

    // Trigger Level Up Modal if changed
    if (newLevel !== user.level) {
        setLevelUp(newLevel);
    }
    
    // Instrument Analytics (Format 3)
    newExpensesFormatted.forEach(e => {
        console.log("TRACK EVENT: expense_created", {
            amount: e.amount,
            category: e.category,
            is_formal: e.isFormal,
            source: e.merchant === 'Uploaded Receipt' ? 'manual_upload' : 'camera_ocr'
        });
    });

    setUser(prev => ({ 
        ...prev, 
        treevus: newTotalTreevus,
        level: newLevel,
        currentStreak: newStreak,
        lastActivityDate: new Date().toISOString()
    }));
    
    // Force recalculate FWI
    recalculateUserStats(updatedExpenses);

    // --- NOTIFICATION (IKEA EFFECT / MINDFULNESS) ---
    addNotification(`¡Control tomado! 🧘‍♂️ +${totalReward} Treevüs. Has convertido un gasto en data.`, 'success');

    // Update Company KPI Side Effect
    if (formalAmount > 0) {
        setCompanyKPIs(prev => ({
            ...prev,
            retentionSavings: prev.retentionSavings + (formalAmount * 0.05),
            flightRiskScore: Math.max(0, prev.flightRiskScore - (newExpensesFormatted.length * 0.01))
        }));
    }
  };

  const editExpense = (id: string, updates: Partial<Expense>) => {
      setExpenses(prev => {
          const updatedList = prev.map(e => e.id === id ? { ...e, ...updates } : e);
          recalculateUserStats(updatedList);
          return updatedList;
      });
  };

  const deleteExpense = (id: string) => {
      setExpenses(prev => {
          const expense = prev.find(e => e.id === id);
          const updatedList = prev.filter(e => e.id !== id);
          recalculateUserStats(updatedList);

          // Reverse Side Effect on Company KPI if formal
          if (expense && expense.isFormal) {
              setCompanyKPIs(kpis => ({
                  ...kpis,
                  retentionSavings: Math.max(0, kpis.retentionSavings - (expense.amount * 0.05)),
                  flightRiskScore: Math.min(100, kpis.flightRiskScore + 0.01)
              }));
          }
          return updatedList;
      });
      addNotification("Gasto eliminado", "info");
  };

  const registerSkippedExpense = () => {
    // Add Treevüs for saving money without recording an expense
    const reward = 50; // Big reward for skipping!
    const newTotalTreevus = user.treevus + reward;
    const newLevel = calculateLevel(newTotalTreevus);
    const newStreak = calculateStreak(user.lastActivityDate, user.currentStreak);
    
    if (newLevel !== user.level) setLevelUp(newLevel);

    setUser(prev => ({ 
        ...prev, 
        treevus: newTotalTreevus,
        level: newLevel,
        currentStreak: newStreak,
        lastActivityDate: new Date().toISOString()
    }));

    addNotification(`¡Ahorro registrado! +${reward} Treevüs 🛡️`, 'success');
  };

  const submitPulseCheck = (mood: number) => {
    setUser(prev => ({ ...prev, lastPulseCheck: new Date().toISOString() }));
    
    // Logic: Lower mood increases flight risk
    const riskImpact = mood < 3 ? 5 : -2;

    setCompanyKPIs(prev => ({
        ...prev,
        teamMoodScore: Math.round((prev.teamMoodScore + mood * 20) / 2), // Scale 1-5 to 100
        flightRiskScore: Math.min(100, Math.max(0, prev.flightRiskScore + riskImpact)),
        history: {
            ...prev.history!,
            moodHistory: [...(prev.history?.moodHistory || []), mood * 20]
        }
    }));
    
    console.log("TRACK EVENT: pulse_submitted", { score: mood });
    addNotification("Pulse Check enviado. ¡Gracias!", "success");
  };

  const sendKudos = (toUser: string, message: string) => {
      const newKudo: Kudo = {
          id: Math.random().toString(36).substring(7),
          fromUser: user.name,
          toUser: toUser,
          message,
          timestamp: new Date().toISOString(),
          type: 'TEAMWORK'
      };
      setKudos(prev => [newKudo, ...prev]);
      
      // Reward the sender for positive culture
      const newTotal = user.treevus + 5;
      const newLevel = calculateLevel(newTotal);
      if (newLevel !== user.level) setLevelUp(newLevel);

      setUser(prev => ({ 
        ...prev, 
        level: newLevel,
        treevus: newTotal
      }));
      addNotification(`Kudo enviado a ${toUser} (+5 Treevüs)`, 'success');
  };

  const redeemOffer = (offerId: string): boolean => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return false;

    if (user.treevus >= offer.costTreevus) {
      setUser(prev => ({ ...prev, treevus: prev.treevus - offer.costTreevus }));
      setOffers(prev => prev.map(o => 
        o.id === offerId ? { ...o, redemptions: o.redemptions + 1 } : o
      ));
      console.log("TRACK EVENT: offer_redeemed", { offer_id: offerId, value: offer.discount });
      addNotification(`Oferta canjeada: ${offer.title}`, 'success');
      return true;
    }
    addNotification("No tienes suficientes Treevüs", "error");
    return false;
  };

  const addOffer = (offerData: Partial<Offer>) => {
    const newOffer: Offer = {
      id: Math.random().toString(36).substring(7),
      title: offerData.title || 'Nueva Oferta',
      description: offerData.description || '',
      merchantName: user.name || 'Mi Comercio',
      image: offerData.image || 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&w=400&q=80',
      discount: offerData.discount || 10,
      costTreevus: offerData.costTreevus || 100,
      redemptions: 0,
      revenueGenerated: 0,
      isFlash: offerData.isFlash,
      expiresAt: offerData.expiresAt,
      type: OfferType.GLOBAL
    };
    setOffers(prev => [newOffer, ...prev]);
    addNotification("Oferta creada exitosamente", "success");
  };

  const upgradeSubscription = (tier: SubscriptionTier) => {
    setUser(prev => ({ ...prev, subscriptionTier: tier }));
    setIsPricingOpen(false);
    addNotification(`¡Bienvenido al plan ${tier}!`, 'success');
  };

  const togglePricingModal = (isOpen: boolean) => {
    setIsPricingOpen(isOpen);
  };
  
  const toggleChat = (isOpen: boolean) => {
    setIsChatOpen(isOpen);
  };

  const contributeToGoal = (goalId: string, amount: number) => {
      setSavingsGoals(prev => prev.map(g => 
          g.id === goalId 
          ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) }
          : g
      ));
      
      console.log("TRACK EVENT: goal_contribution", { goal_id: goalId, amount });
      
      // Recalculate FWI (Savings Ratio changes)
      recalculateUserStats(expenses);

      addNotification(`Aporte de S/${amount} realizado a tu meta`, 'success');
  };

  const joinSquad = (squadId: string) => {
      setUser(prev => ({ ...prev, squadId }));
      addNotification("¡Te has unido al Squad!", "success");
  };

  const downloadReport = () => {
    // Mock CSV Generation based on Role
    let content = "";
    let filename = "";

    if (role === UserRole.EMPLOYEE) {
      content = "Fecha,Comercio,Categoria,Monto,Formal\n" + 
        expenses.map(e => `${e.date},${e.merchant},${e.category},${e.amount},${e.isFormal ? 'SI' : 'NO'}`).join('\n');
      filename = `treevu_reporte_gastos_${new Date().toISOString().split('T')[0]}.csv`;
    } else if (role === UserRole.EMPLOYER) {
      content = "Metrica,Valor\n" +
        `FWI Promedio,${companyKPIs.avgFWI}\n` +
        `Riesgo Fuga,${companyKPIs.flightRiskScore}%\n` +
        `Ahorro Retencion,S/${companyKPIs.retentionSavings}\n` +
        `ROI,${companyKPIs.roiMultiplier}x`;
      filename = `treevu_reporte_kpis_${new Date().toISOString().split('T')[0]}.csv`;
    } else {
      content = "Oferta,Redenciones,Ingresos\n" +
        offers.map(o => `${o.title},${o.redemptions},S/${o.revenueGenerated}`).join('\n');
      filename = `treevu_reporte_ventas_${new Date().toISOString().split('T')[0]}.csv`;
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification("Reporte descargado correctamente", "success");
  };

  // --- B2B Granularity Logic ---
  const filterCompanyKPIs = (department: Department) => {
     // For MVP demo, we simulate data changes
     const variance = department === Department.SALES ? -5 : department === Department.IT ? 5 : 0;
     
     setCompanyKPIs(prev => ({
         ...MOCK_KPIS,
         avgFWI: Math.min(100, Math.max(0, MOCK_KPIS.avgFWI + variance)),
         flightRiskScore: Math.min(100, Math.max(0, MOCK_KPIS.flightRiskScore - variance)),
     }));
     addNotification(`Filtro aplicado: ${department}`, "info");
  };

  return (
    <StoreContext.Provider value={{
      user,
      role,
      expenses,
      savingsGoals,
      offers,
      companyKPIs,
      squads,
      userSquad,
      isPricingOpen,
      isChatOpen,
      kudos,
      levelUp,
      setLevelUp,
      switchRole,
      updateUserProfile,
      addExpense,
      bulkAddExpenses,
      editExpense,
      deleteExpense,
      registerSkippedExpense,
      redeemOffer,
      addOffer,
      upgradeSubscription,
      togglePricingModal,
      toggleChat,
      submitPulseCheck,
      sendKudos,
      updateMonthlyBudget,
      contributeToGoal,
      joinSquad,
      setTheme,
      downloadReport,
      getSuggestedCategory,
      learnMerchantCategory,
      filterCompanyKPIs,
      safeToSpendGranularity,
      setSafeToSpendGranularity,
      getDashboardSummary,
      getProjectionByFocus,
      currentView,
      navigate,
      goBack,
      merchantActivityLog: MOCK_MERCHANT_LOGS,
      hourlyTraffic: MOCK_HOURLY_TRAFFIC,
      sectorHourlyTraffic: MOCK_SECTOR_TRAFFIC,
      sectorStats: MOCK_SECTOR_STATS,
      notifications,
      addNotification,
      removeNotification
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;