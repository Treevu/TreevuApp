
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserRole, UserProfile, Expense, Offer, TreevuLevel, ExpenseCategory, CompanyKPIs, SavingsGoal, Squad, SubscriptionTier, PlanConfig, MissionType, MissionStatus, OfferType, Kudo, AppTheme, Department, SafeToSpendGranularity, DashboardSummaryResponse, ProjectionFocusResponse, AppView, MerchantActivityLog, HourlyTrafficData, AppNotification, AIQueryResponse } from '../types';
import { calculateLevel, calculateStreak, calculateExpensePoints } from '../services/gamificationService';
import { queryFinancialAgent } from '../services/geminiService';

// --- PRICING MATRIX CONFIGURATION (USD) ---
export const PLANS: Record<UserRole, PlanConfig[]> = {
  [UserRole.GUEST]: [],
  [UserRole.EMPLOYEE]: [
    {
      id: SubscriptionTier.FREE,
      name: "Starter",
      priceMonthly: 0,
      priceAnnual: 0,
      slogan: "Para quienes inician su camino al orden.",
      ctaText: "Plan Actual",
      features: [
        { text: "Registro manual ilimitado", included: true },
        { text: "IA básica (Lectura simple)", included: true },
        { text: "Gamificación (Niveles 1-5)", included: true },
        { text: "Reportes mensuales", included: true },
        { text: "Radar Fiscal", included: false },
      ]
    },
    {
      id: SubscriptionTier.PRO,
      name: "Explorer",
      priceMonthly: 9,
      priceAnnual: 90, // Savings: $18 (2 months free)
      slogan: "Maximizar la devolución fiscal.",
      recommended: true,
      ctaText: "Mejorar Plan",
      features: [
        { text: "Todo lo del plan Starter", included: true },
        { text: "Coach IA Personal", included: true, highlight: true },
        { text: "Radar Fiscal (Alerta 3 UIT)", included: true, highlight: true },
        { text: "Acceso VIP al Marketplace", included: true },
        { text: "Protección de Rachas", included: true },
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
      slogan: "Bienestar financiero básico.",
      ctaText: "Comenzar Piloto",
      features: [
        { text: "KPIs globales anonimizados", included: true },
        { text: "Financial Wellness Index (FWI)", included: true },
        { text: "Onboarding digital", included: true },
        { text: "Módulo de Kudos Básico", included: true },
        { text: "Predicción Riesgo de Fuga", included: false },
      ]
    },
    {
      id: SubscriptionTier.PRO,
      name: "Growth",
      priceMonthly: 0,
      priceAnnual: 0,
      isCustom: true,
      priceUnit: "",
      slogan: "Analítica predictiva de retención.",
      recommended: true,
      ctaText: "Cotizar",
      features: [
        { text: "Todo lo del plan Launch", included: true },
        { text: "Predicción Riesgo de Fuga", included: true, highlight: true },
        { text: "Segmentación por áreas", included: true },
        { text: "Morning Brief Ejecutivo", included: true },
        { text: "Simulador de Impacto IA", included: false },
      ]
    },
    {
      id: SubscriptionTier.ENTERPRISE,
      name: "Enterprise",
      priceMonthly: 0,
      priceAnnual: 0,
      isCustom: true,
      slogan: "Grandes corporaciones.",
      ctaText: "Contactar Ventas",
      features: [
        { text: "Integraciones API / ERP", included: true, highlight: true },
        { text: "Customer Success Manager dedicado", included: true },
        { text: "Soporte 24/7", included: true },
        { text: "Marca blanca opcional", included: true },
        { text: "Simulador de Impacto IA", included: true },
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
      slogan: "Unirse al marketplace.",
      ctaText: "Plan Actual",
      features: [
        { text: "Perfil de negocio", included: true },
        { text: "Listado en Marketplace", included: true },
        { text: "Estadísticas de visitas", included: true },
        { text: "IA para campañas", included: false },
        { text: "Visibilidad Destacada", included: false },
      ]
    },
    {
      id: SubscriptionTier.PRO,
      name: "Amplify",
      priceMonthly: 39,
      priceAnnual: 390, // Savings: $78 (2 months free)
      slogan: "Ventas impulsadas por IA.",
      recommended: true,
      ctaText: "Mejorar Plan",
      features: [
        { text: "Todo lo del plan Connect", included: true },
        { text: "IA para campañas dirigidas", included: true, highlight: true },
        { text: "Benchmarking sectorial", included: true },
        { text: "Insights de competencia", included: true },
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
  monthlyBudget: 0, // Initial 0 to trigger configuration flow
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
    color: 'bg-emerald-500' 
  },
  { 
    id: '3', 
    title: 'Fondo Emergencia', 
    targetAmount: 10000, 
    currentAmount: 1500, 
    deadline: '2024-12-31', 
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=800&q=80', 
    color: 'bg-emerald-700' 
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

export interface ChatMessage {
    id: string;
    sender: 'user' | 'ai';
    text: string;
    timestamp: string;
}

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
  isBudgetModalOpen: boolean;
  kudos: Kudo[];
  levelUp: TreevuLevel | null;
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
  toggleBudgetModal: (isOpen: boolean) => void;
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
  // Analytics
  trackEvent: (eventName: string, properties?: Record<string, any>) => void;
  // Onboarding
  showTour: boolean;
  closeTour: () => void;
  // AI Chat
  chatMessages: ChatMessage[];
  isAiThinking: boolean;
  sendAIChatMessage: (text: string) => void;
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

  // Modal States
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // B2C Granularity State
  const [safeToSpendGranularity, setSafeToSpendGranularity] = useState<SafeToSpendGranularity>(SafeToSpendGranularity.DAILY);

  // Navigation State
  const [viewStack, setViewStack] = useState<AppView[]>([AppView.DASHBOARD]);
  const currentView = viewStack[viewStack.length - 1];
  
  // Onboarding State
  const [showTour, setShowTour] = useState(false);

  // AI Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
      { id: 'welcome', sender: 'ai', text: '¡Hola! Soy tu copiloto financiero Treevü IA. ¿En qué puedo ayudarte hoy?', timestamp: new Date().toISOString() }
  ]);
  const [isAiThinking, setIsAiThinking] = useState(false);

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
    setShowTour(true); // Trigger tour on new role entry
    
    // Logic to reset tier based on role defaults
    let defaultTier = SubscriptionTier.FREE;
    if (newRole === UserRole.EMPLOYER) defaultTier = SubscriptionTier.PLUS; // Launch by default for demo
    if (newRole === UserRole.MERCHANT) defaultTier = SubscriptionTier.FREE; // Connect
    
    setUser(prev => ({ 
      ...prev, 
      role: newRole,
      subscriptionTier: defaultTier
    }));
    
    // Reset Chat on Role Switch
    setChatMessages([{ id: 'welcome', sender: 'ai', text: '¡Hola! Soy tu copiloto financiero Treevü IA. ¿En qué puedo ayudarte hoy?', timestamp: new Date().toISOString() }]);
    
    trackEvent('role_selected', { role: newRole });
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // --- ANALYTICS LOGGER (Format 3 Implementation) ---
  const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
      // In production, this would send data to BigQuery/Mixpanel
      console.log(`[ANALYTICS] ${eventName}`, {
          timestamp: new Date().toISOString(),
          user_id: user.email,
          ...properties
      });
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
    trackEvent('navigation', { view });
  };

  const goBack = () => {
    if (viewStack.length > 1) {
        setViewStack(prev => prev.slice(0, -1));
    } else {
        // If at root dashboard, go back to role selection
        switchRole(UserRole.GUEST);
    }
  };

  // --- RECALCULATE FWI & RISK (Format 2 Implementation) ---
  useEffect(() => {
    // 1. Calculate FWI V1
    const totalExpenses = expenses.length;
    if (totalExpenses === 0) return;

    const formalExpenses = expenses.filter(e => e.isFormal).length;
    const formalRatio = formalExpenses / totalExpenses;

    const spent = expenses.reduce((acc, e) => acc + e.amount, 0);
    const budgetAdherence = user.monthlyBudget > 0 ? Math.max(0, 1 - (spent / user.monthlyBudget)) : 0.5;

    const streakScore = Math.min(1, (user.currentStreak || 0) / 30);
    const newFWI = Math.round((formalRatio * 40) + (budgetAdherence * 30) + (streakScore * 30));
    
    if (newFWI !== user.fwiScore) {
        setUser(prev => ({ ...prev, fwiScore: newFWI }));
    }
    
    // 2. Update B2B Metrics
    const totalFormalAmount = expenses.filter(e => e.isFormal).reduce((acc, e) => acc + e.amount, 0);
    const simulatedSavings = 120000 + (totalFormalAmount * 0.05);
    
    let risk = 35;
    if (companyKPIs.teamMoodScore < 60) risk += 20;
    if (companyKPIs.teamMoodScore > 80) risk -= 10;

    setCompanyKPIs(prev => ({
        ...prev,
        retentionSavings: simulatedSavings,
        flightRiskScore: Math.max(0, Math.min(100, risk))
    }));

  }, [expenses, user.monthlyBudget, companyKPIs.teamMoodScore, user.currentStreak]);

  const getDashboardSummary = (): DashboardSummaryResponse => {
    const today = new Date();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const daysRemaining = Math.max(1, daysInMonth - today.getDate() + 1);
    
    const totalSpent = expenses.reduce((acc, e) => acc + e.amount, 0);
    const remainingBudget = Math.max(0, user.monthlyBudget - totalSpent);
    
    let safeAmount = remainingBudget / daysRemaining;

    if (safeToSpendGranularity === SafeToSpendGranularity.WEEKLY) {
        safeAmount = safeAmount * Math.min(7, daysRemaining);
    }

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
    const relevantExpenses = categoryIds.length > 0 
        ? expenses.filter(e => categoryIds.includes(e.category))
        : expenses;
    
    const spent = relevantExpenses.reduce((acc, e) => acc + e.amount, 0);
    const today = new Date().getDate();
    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const projected = (spent / Math.max(1, today)) * daysInMonth;
    
    const budgetPortion = categoryIds.length > 0 
        ? user.monthlyBudget * 0.4 
        : user.monthlyBudget;

    const status = projected > budgetPortion ? 'EXCEEDING_RISK' : projected > (budgetPortion * 0.8) ? 'WARNING' : 'OK';

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

  const updateMonthlyBudget = (amount: number) => {
      setUser(prev => ({ ...prev, monthlyBudget: amount }));
      addNotification("Presupuesto actualizado correctamente");
      trackEvent('budget_updated', { new_amount: amount });
  };

  // --- MERCHANT MAPPING LOGIC ---
  const normalizeMerchantName = (name: string): string => {
    if (!name) return '';
    return name.toUpperCase().replace(/[0-9]/g, '').replace(/[^\w\s]/g, '').trim();
  };

  const getSuggestedCategory = (merchant: string): ExpenseCategory | undefined => {
    const normalized = normalizeMerchantName(merchant);
    return merchantMap[normalized];
  };

  const learnMerchantCategory = (merchant: string, category: ExpenseCategory) => {
    const normalized = normalizeMerchantName(merchant);
    setMerchantMap(prev => ({ ...prev, [normalized]: category }));
  };

  // --- ACTIONS ---
  const addExpense = (expenseData: Partial<Expense>) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      merchant: expenseData.merchant || 'Desconocido',
      amount: expenseData.amount || 0,
      date: expenseData.date || new Date().toISOString(),
      category: expenseData.category || ExpenseCategory.OTHER,
      isFormal: expenseData.isFormal || false,
      ruc: expenseData.ruc,
      igv: expenseData.isFormal ? (expenseData.amount || 0) * 0.18 : undefined,
      lostSavings: !expenseData.isFormal ? (expenseData.amount || 0) * 0.18 : undefined,
      treevusEarned: calculateExpensePoints(expenseData.isFormal || false, expenseData.amount || 0)
    };

    setExpenses(prev => [newExpense, ...prev]);
    
    const newPoints = user.treevus + newExpense.treevusEarned;
    const newLevel = calculateLevel(newPoints);
    
    if (newLevel !== user.level) {
        setLevelUp(newLevel);
    }

    if (expenseData.merchant && expenseData.category) {
        learnMerchantCategory(expenseData.merchant, expenseData.category);
    }
    
    setUser(prev => ({
        ...prev,
        treevus: newPoints,
        level: newLevel,
        currentStreak: calculateStreak(prev.lastActivityDate, prev.currentStreak),
        lastActivityDate: new Date().toISOString()
    }));

    addNotification(
        `¡Control tomado! 🧘‍♂️ Gasto de S/ ${newExpense.amount} registrado.`,
        'success'
    );

    trackEvent('expense_created', {
        amount: newExpense.amount,
        category: newExpense.category,
        is_formal: newExpense.isFormal,
        source: expenseData.ruc ? 'ocr' : 'manual'
    });
  };

  const bulkAddExpenses = (newExpensesData: Partial<Expense>[]) => {
      let totalPoints = 0;
      const createdExpenses: Expense[] = newExpensesData.map(e => {
          const pts = calculateExpensePoints(e.isFormal || false, e.amount || 0);
          totalPoints += pts;
          return {
            id: Math.random().toString(36).substr(2, 9),
            merchant: e.merchant || 'Importado',
            amount: e.amount || 0,
            date: e.date || new Date().toISOString(),
            category: e.category || ExpenseCategory.OTHER,
            isFormal: e.isFormal || false,
            treevusEarned: pts
          };
      });

      setExpenses(prev => [...createdExpenses, ...prev]);
      setUser(prev => ({ ...prev, treevus: prev.treevus + totalPoints }));
      addNotification(`Importación exitosa. +${totalPoints} Treevüs ganados.`, 'success');
  };

  const editExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addNotification("Gasto actualizado");
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    addNotification("Gasto eliminado", "info");
  };

  const redeemOffer = (offerId: string): boolean => {
    const offer = offers.find(o => o.id === offerId);
    if (!offer) return false;

    if (user.treevus >= offer.costTreevus) {
        setUser(prev => ({ ...prev, treevus: prev.treevus - offer.costTreevus }));
        setOffers(prev => prev.map(o => o.id === offerId ? { ...o, redemptions: o.redemptions + 1 } : o));
        
        addNotification(`¡Canje exitoso! Disfruta tu ${offer.title}`, 'success');
        trackEvent('offer_redeemed', { offer_id: offerId, merchant: offer.merchantName });
        return true;
    } else {
        addNotification("No tienes suficientes Treevüs", "error");
        return false;
    }
  };

  const addOffer = (offer: Partial<Offer>) => {
      const newOffer: Offer = {
          id: Date.now().toString(),
          title: offer.title || 'Nueva Oferta',
          description: offer.description || '',
          merchantName: user.name || 'Mi Negocio',
          image: 'https://via.placeholder.com/150',
          discount: offer.discount || 0,
          costTreevus: offer.costTreevus || 100,
          redemptions: 0,
          revenueGenerated: 0,
          isFlash: offer.isFlash,
          type: OfferType.GLOBAL
      };
      setOffers(prev => [newOffer, ...prev]);
      addNotification("Oferta publicada correctamente");
      trackEvent('offer_created', { is_flash: offer.isFlash });
  };

  const registerSkippedExpense = () => {
      setUser(prev => ({
          ...prev,
          currentStreak: calculateStreak(prev.lastActivityDate, prev.currentStreak),
          lastActivityDate: new Date().toISOString()
      }));
      addNotification("Racha mantenida. ¡Mañana será mejor!");
  };

  const upgradeSubscription = (tier: SubscriptionTier) => {
      setUser(prev => ({ ...prev, subscriptionTier: tier }));
      setIsPricingOpen(false);
      addNotification(`¡Bienvenido al plan ${tier}!`, 'success');
      trackEvent('subscription_upgrade', { tier });
  };

  const togglePricingModal = (isOpen: boolean) => setIsPricingOpen(isOpen);
  const toggleChat = (isOpen: boolean) => setIsChatOpen(isOpen);
  const toggleBudgetModal = (isOpen: boolean) => setIsBudgetModalOpen(isOpen);

  const filterCompanyKPIs = (dept: Department) => {
      if (dept === Department.GLOBAL) {
          setCompanyKPIs(MOCK_KPIS);
      } else {
          setCompanyKPIs({
              ...MOCK_KPIS,
              avgFWI: Math.floor(Math.random() * 30) + 50,
              flightRiskScore: Math.floor(Math.random() * 40) + 10,
          });
      }
  };

  const submitPulseCheck = (mood: number) => {
      setUser(prev => ({ ...prev, lastPulseCheck: new Date().toISOString() }));
      setCompanyKPIs(prev => ({
          ...prev,
          teamMoodScore: Math.round((prev.teamMoodScore + (mood * 20)) / 2),
          history: {
              ...prev.history!,
              moodHistory: [...(prev.history?.moodHistory || []), mood * 20]
          }
      }));
      addNotification("¡Gracias! Tu feedback ayuda a mejorar el clima.", "success");
      trackEvent('pulse_submitted', { score: mood });
  };

  const sendKudos = (toUser: string, message: string) => {
      const newKudo: Kudo = {
          id: Date.now().toString(),
          fromUser: user.name,
          toUser,
          message,
          timestamp: new Date().toISOString(),
          type: 'TEAMWORK'
      };
      setKudos(prev => [newKudo, ...prev]);
      addNotification("Kudo enviado con éxito");
  };

  const contributeToGoal = (goalId: string, amount: number) => {
      if (user.monthlyBudget > 0 && amount > 0) {
           setSavingsGoals(prev => prev.map(g => {
               if (g.id === goalId) {
                   const newAmount = Math.min(g.targetAmount, g.currentAmount + amount);
                   if (newAmount >= g.targetAmount) {
                       addNotification(`¡Felicidades! Has completado la meta: ${g.title}`, 'success');
                       trackEvent('goal_completed', { goal_id: goalId });
                   }
                   return { ...g, currentAmount: newAmount };
               }
               return g;
           }));
           addNotification(`Aporte de S/ ${amount} registrado`, 'success');
           trackEvent('goal_contribution', { amount, goal_id: goalId });
      }
  };

  const downloadReport = () => {
    let dataStr = "";
    if (role === UserRole.EMPLOYEE) {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ user, expenses, goals: savingsGoals }));
    } else if (role === UserRole.EMPLOYER) {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ kpis: companyKPIs }));
    } else {
        dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ offers, traffic: MOCK_HOURLY_TRAFFIC }));
    }
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "treevu_report.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const joinSquad = (squadId: string) => {
      setUser(prev => ({ ...prev, squadId }));
      addNotification("¡Te has unido al Squad!", "success");
      trackEvent('squad_joined', { squad_id: squadId });
  };

  const closeTour = () => setShowTour(false);

  // --- AI CHAT LOGIC ---
  const sendAIChatMessage = async (text: string) => {
      const newUserMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          text,
          timestamp: new Date().toISOString()
      };
      setChatMessages(prev => [...prev, newUserMsg]);
      setIsAiThinking(true);

      try {
          const aiResponse: AIQueryResponse = await queryFinancialAgent(user, expenses, savingsGoals, text);
          
          const newAiMsg: ChatMessage = {
              id: aiResponse.ai_response_id,
              sender: 'ai',
              text: aiResponse.response_text,
              timestamp: new Date().toISOString()
          };

          setChatMessages(prev => [...prev, newAiMsg]);
          
          // Handle Suggested Actions (e.g. Create Goal, Open Budget)
          if (aiResponse.suggested_action) {
              if (aiResponse.suggested_action.action_type === 'CREATE_GOAL') {
                 // Could trigger goal modal here
              }
          }

      } catch (error) {
          setChatMessages(prev => [...prev, { id: 'err', sender: 'ai', text: 'Lo siento, tuve un error de conexión.', timestamp: new Date().toISOString() }]);
      } finally {
          setIsAiThinking(false);
      }
  };

  return (
    <StoreContext.Provider value={{
      user, role, expenses, savingsGoals, offers, companyKPIs, squads, userSquad, kudos,
      isPricingOpen, isChatOpen, isBudgetModalOpen, levelUp, setLevelUp,
      switchRole, updateUserProfile, addExpense, bulkAddExpenses, editExpense, deleteExpense, registerSkippedExpense,
      redeemOffer, addOffer, upgradeSubscription, togglePricingModal, toggleChat, toggleBudgetModal,
      submitPulseCheck, sendKudos, updateMonthlyBudget, contributeToGoal, setTheme, downloadReport, joinSquad,
      getSuggestedCategory, learnMerchantCategory, filterCompanyKPIs,
      safeToSpendGranularity, setSafeToSpendGranularity, getDashboardSummary, getProjectionByFocus,
      currentView, navigate, goBack,
      merchantActivityLog: MOCK_MERCHANT_LOGS,
      hourlyTraffic: MOCK_HOURLY_TRAFFIC,
      sectorHourlyTraffic: MOCK_SECTOR_TRAFFIC,
      sectorStats: MOCK_SECTOR_STATS,
      notifications, addNotification, removeNotification, trackEvent,
      showTour, closeTour,
      chatMessages, isAiThinking, sendAIChatMessage
    }}>
      {children}
    </StoreContext.Provider>
  );
};
