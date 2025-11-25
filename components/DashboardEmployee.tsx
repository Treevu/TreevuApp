
import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Plus, 
  Leaf, 
  Award, 
  CreditCard,
  Zap,
  Activity,
  ArrowRight,
  ShoppingBag,
  Gift,
  Shield,
  TrendingDown,
  Home,
  User,
  Search,
  Camera,
  X,
  CheckCircle,
  Clock,
  Tag,
  Receipt,
  Target,
  PiggyBank,
  Calendar,
  AlertCircle,
  ShieldCheck,
  BarChart2,
  Store,
  GraduationCap, 
  Plane, 
  Smartphone, 
  Shirt,
  Settings,
  Bell,
  ChevronRight,
  Sliders,
  LineChart as LineChartIcon,
  Smile,
  Meh,
  Frown,
  Menu,
  Briefcase,
  Scissors,
  ArrowUp,
  RotateCcw,
  Layout,
  LogOut,
  Sparkles,
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  Info,
  CreditCard as CreditCardIcon,
  Lock,
  Building2,
  Globe,
  Coffee,
  Car,
  Utensils,
  Filter,
  MessageSquare,
  Send,
  Bot,
  Landmark,
  FileText,
  ToggleLeft,
  ToggleRight,
  RefreshCw,
  Server,
  Copy,
  Bookmark,
  UserX,
  UserCheck,
  Mail,
  Save,
  AlertTriangle,
  Maximize2
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, LineChart, Line } from 'recharts';
import { UserProfile, Transaction, MarketOffer, FinancialGoal, ExpenseAnalysis, ChatMessage, AiAdviceCard, EwaRequest, AppAlert } from '../types';
import { classifyExpense, getFinancialAdvice, getOfferPitch, chatWithFinancialAdvisor } from '../services/geminiService';
import { logCriticalEvent, MOAT_EVENTS } from '../services/dataMoat';

// Brand Colors
const COLORS = {
  primary: '#1C81F2',
  background: '#F6FAFE',
  accent: '#3CB7A9',
  warning: '#F59E0B',
  danger: '#EF4444',
  text: '#1E293B',
  success: '#10B981'
};

const INITIAL_USER: UserProfile = {
  name: "Alex Johnson",
  role: "Especialista Logística",
  status: 'ACTIVE', // Default State must be ACTIVE for features to work
  fwiScore: 65,
  treePoints: 1250,
  streakDays: 5,
  level: 3,
  monthlyIncome: 3200,
  availableEwa: 450 // Calculated limit based on accrued days
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: '1', merchant: 'Supermercado Día', amount: 84.50, category: 'Alimentos', date: 'Hoy', isDiscretionary: false },
  { id: '2', merchant: 'Netflix', amount: 15.99, category: 'Suscripción', date: 'Ayer', isDiscretionary: true },
  { id: '3', merchant: 'Shell', amount: 45.00, category: 'Transporte', date: 'Ayer', isDiscretionary: false },
  { id: '4', merchant: 'Starbucks', amount: 8.50, category: 'Ocio', date: 'Hace 2 días', isDiscretionary: true },
  { id: '5', merchant: 'Farmacia Cruz Verde', amount: 32.10, category: 'Salud', date: 'Hace 3 días', isDiscretionary: false },
];

const MOCK_EWA_HISTORY: EwaRequest[] = [
    { id: 'ewa_3', amount: 100, date: '15 Oct', status: 'disbursed', fee: 2.50, estimatedArrival: 'Inmediato' },
    { id: 'ewa_2', amount: 50, date: '02 Oct', status: 'disbursed', fee: 2.50, estimatedArrival: 'Inmediato' },
];

const MARKET_OFFERS: MarketOffer[] = [
  { id: 'm_ins_1', title: 'Seguro Desempleo', description: 'Cubre 3 meses de sueldo.', costPoints: 800, category: 'Emergency', targetFwiSegment: 'low', discountValue: 'Subsidio 50%', origin: 'corporate' },
  { id: 'm_ins_2', title: 'Seguro Médico Base', description: 'Urgencias y telemedicina.', costPoints: 500, category: 'Emergency', targetFwiSegment: 'low', discountValue: 'Gratis', origin: 'corporate' },
  { id: 'm_sav_1', title: 'Cuenta High-Yield', description: 'Tasa preferencial 6%.', costPoints: 300, category: 'Financial', targetFwiSegment: 'all', discountValue: '+1% Tasa', origin: 'global' },
  { id: 'm_sav_2', title: 'Fondo Emergencia', description: 'Ahorro automático nómina.', costPoints: 400, category: 'Financial', targetFwiSegment: 'low', discountValue: 'Bonus $10', origin: 'corporate' },
  { id: 'm_con_3', title: 'Gasolina Shell', description: 'Cashback en combustible.', costPoints: 600, category: 'Lifestyle', targetFwiSegment: 'mid', discountValue: '5% Cash', origin: 'global' }
];

const INITIAL_GOALS: FinancialGoal[] = [
  { id: 'g1', name: 'Fondo de Emergencia', targetAmount: 1000, currentAmount: 350, deadline: '2024-12-31', category: 'Emergency', priority: true, lastContribution: Date.now() - 86400000 * 5 },
  { id: 'g2', name: 'Vacaciones 2025', targetAmount: 2500, currentAmount: 400, deadline: '2025-06-15', category: 'Vacation', priority: false, lastContribution: Date.now() - 86400000 * 15 },
];

const MOCK_ADVICE_CARDS: AiAdviceCard[] = [
  { id: 'c1', type: 'risk', title: 'Gasto Hormiga Detectado', description: 'Has gastado $45 en café esta semana. ¿Reducimos a la mitad?', actionLabel: 'Ver Detalle', icon: 'coffee' },
  { id: 'c2', type: 'opportunity', title: 'Potencia tu Ahorro', description: 'Si ahorras $20 hoy, alcanzarás tu meta de vacaciones 1 semana antes.', actionLabel: 'Apartar $20', icon: 'trending-up' },
];

const MOCK_NOTIFICATIONS: AppAlert[] = [
    { id: 'n1', type: 'achievement', message: '¡Has mantenido tu racha por 5 días! Sigue así.', severity: 'info' },
    { id: 'n2', type: 'liquidity_warning', message: 'Tu disponible EWA ha aumentado a $450 por días trabajados.', severity: 'info' },
    { id: 'n3', type: 'policy_rejection', message: 'Recordatorio de seguridad: Se recomienda activar MFA.', severity: 'warning' }
];

const FWI_HISTORY_DATA = [
  { month: 'Jul', score: 58 },
  { month: 'Ago', score: 60 },
  { month: 'Sep', score: 62 },
  { month: 'Oct', score: 65 },
];

// Mock Streak Calendar Data (Last 30 days)
const STREAK_CALENDAR_DATA = Array.from({ length: 30 }, (_, i) => {
    const day = 30 - i;
    let status: 'active' | 'broken' | 'neutral' = 'neutral';
    if (i < 5) status = 'active'; // Last 5 days active
    else if (i === 6) status = 'broken'; // Broke streak a week ago
    else if (i > 6 && i < 15) status = 'active';
    else status = 'neutral'; // Older history
    
    return { day, status };
}).reverse();

export const DashboardEmployee: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'expense' | 'goals' | 'wallet' | 'assistant' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  
  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppAlert[]>(MOCK_NOTIFICATIONS);

  // Expense Hub State
  const [expenseStep, setExpenseStep] = useState<'input' | 'processing' | 'result'>('input');
  const [expenseInput, setExpenseInput] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState<ExpenseAnalysis | null>(null);
  const [expenseFilter, setExpenseFilter] = useState<string>('all');

  // Wallet & EWA State (EWA Lite Logic)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [ewaHistory, setEwaHistory] = useState<EwaRequest[]>(MOCK_EWA_HISTORY);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [ewaStep, setEwaStep] = useState<'select' | 'processing' | 'success'>('select');
  const [ewaSettings, setEwaSettings] = useState({
    notifyAvailable: true,
    notifyLowFwi: true
  });

  // Marketplace State
  const [marketFilter, setMarketFilter] = useState<'all' | 'corporate' | 'global' | 'saved'>('all');
  const [selectedOffer, setSelectedOffer] = useState<MarketOffer | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemStep, setRedeemStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(new Set());

  // Chat Assistant State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: 'msg_init', text: '¡Hola Alex! Soy Treevü Brain. He analizado tus finanzas de esta semana. ¿En qué puedo ayudarte hoy?', sender: 'ai', timestamp: Date.now() }
  ]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const [aiNudge, setAiNudge] = useState<string>("Analizando tu salud financiera...");
  const [showLiquidityAlert, setShowLiquidityAlert] = useState(false);

  // Smart Advice State
  const [activeAdvice, setActiveAdvice] = useState<AiAdviceCard | null>(null);
  const [adviceStep, setAdviceStep] = useState<'info' | 'processing' | 'success'>('info');

  // Info Modals (FWI & Streak)
  const [activeInfoModal, setActiveInfoModal] = useState<'fwi' | 'streak' | null>(null);

  // Profile & Config State (EWA Lite)
  const [profileForm, setProfileForm] = useState({
    email: 'alex.johnson@company.com',
    phone: '+1 (555) 123-4567',
    mfaEnabled: true,
    notifyHighBalance: true,
    notifyApproval: true,
    notifyExpense: true
  });
  const [personalEwaLimit, setPersonalEwaLimit] = useState(80); // %
  const [minSavingsTarget, setMinSavingsTarget] = useState(100);
  const [showBankRequestModal, setShowBankRequestModal] = useState(false);
  const [bankRequestStep, setBankRequestStep] = useState<'input' | 'processing' | 'success'>('input');
  const [newBankAccount, setNewBankAccount] = useState('');

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    // Only log events if active
    if (user.status === 'ACTIVE') {
      logCriticalEvent(MOAT_EVENTS.DASHBOARD_VIEW, { session_id: 'sess_' + Math.random().toString(36).substr(2, 9) }, { fwiScore: user.fwiScore });

      const loadAiContent = async () => {
        const nudge = await getFinancialAdvice(user.fwiScore, transactions);
        setAiNudge(nudge);
      };
      loadAiContent();

      // Simular alerta de liquidez para usuarios de riesgo
      if (user.fwiScore < 50 && user.availableEwa < 50) {
        setShowLiquidityAlert(true);
        logCriticalEvent(MOAT_EVENTS.ALERT_TRIGGERED, { type: 'liquidity_warning', severity: 'critical' }, { fwiScore: user.fwiScore });
      }
    }
  }, [user.status]);

  useEffect(() => {
    if (activeTab === 'assistant') {
      scrollToBottom();
    }
  }, [chatHistory, activeTab]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExpenseSubmit = async () => {
    if (user.status !== 'ACTIVE') return;
    if (!expenseInput) return;
    setExpenseStep('processing');
    
    // Call Gemini Service
    const analysis = await classifyExpense(expenseInput);
    setLastAnalysis(analysis);
    
    // Add to list
    const newTx: Transaction = {
      id: Date.now().toString(),
      merchant: analysis.merchant,
      amount: analysis.amount,
      category: analysis.category,
      date: 'Hoy',
      isDiscretionary: analysis.isDiscretionary,
      aiConfidence: analysis.confidence
    };
    setTransactions(prev => [newTx, ...prev]);
    
    // Update score slightly (Gamification)
    setUser(prev => ({...prev, treePoints: prev.treePoints + 10}));

    setExpenseStep('result');
    logCriticalEvent(MOAT_EVENTS.EXPENSE_DECLARED, { 
      method: 'ai_text', 
      category: analysis.category,
      amount: analysis.amount,
      has_budget_impact: true
    }, { fwiScore: user.fwiScore });
  };

  const handleEwaRequest = () => {
      if (user.status !== 'ACTIVE') return;
      setProcessingWithdrawal(true);
      setEwaStep('processing');
      
      // Simulate B2B API Latency
      setTimeout(() => {
          const newRequest: EwaRequest = {
            id: `req_${Date.now()}`,
            amount: withdrawAmount,
            date: 'Hoy',
            status: 'processing_transfer', // EWA Lite: Not instant, it's processing
            fee: 2.50,
            estimatedArrival: '30 min'
          };
          
          setEwaHistory(prev => [newRequest, ...prev]);
          setUser(prev => ({...prev, availableEwa: prev.availableEwa - withdrawAmount}));
          setProcessingWithdrawal(false);
          setEwaStep('success');
          
          logCriticalEvent(MOAT_EVENTS.EWA_INITIATED, { amount: withdrawAmount, fee: 2.50, type: 'lite_request' }, { fwiScore: user.fwiScore });
      }, 2000);
  };

  const closeEwaModal = () => {
    setShowWithdrawModal(false);
    setEwaStep('select');
    setWithdrawAmount(50);
  };

  const resetExpenseTab = () => {
    setExpenseInput('');
    setExpenseStep('input');
    setLastAnalysis(null);
  };

  const handleRedeemClick = (offer: MarketOffer) => {
    if (user.status !== 'ACTIVE') return;
    setSelectedOffer(offer);
    setRedeemStep('confirm');
    setShowRedeemModal(true);
  };

  const toggleSaveOffer = (offerId: string) => {
    if (user.status !== 'ACTIVE') return;
    setSavedOfferIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(offerId)) {
        newSet.delete(offerId);
      } else {
        newSet.add(offerId);
      }
      return newSet;
    });
  };

  const processRedemption = () => {
      if (!selectedOffer) return;
      if (user.treePoints < selectedOffer.costPoints) {
          return; // Add toast or visual feedback for insufficient funds
      }
      setRedeemStep('processing');
      setTimeout(() => {
          setUser(prev => ({ ...prev, treePoints: prev.treePoints - selectedOffer.costPoints }));
          setRedeemStep('success');
      }, 1500);
  };

  const handleSendMessage = async () => {
    if (user.status !== 'ACTIVE') return;
    if (!currentMessage.trim()) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), text: currentMessage, sender: 'user', timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setCurrentMessage('');
    setIsTyping(true);

    const responseText = await chatWithFinancialAdvisor(userMsg.text, user.fwiScore, user.monthlyIncome, transactions);
    
    setIsTyping(false);
    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai', timestamp: Date.now() };
    setChatHistory(prev => [...prev, aiMsg]);
  };

  const handleQuickPrompt = (prompt: string) => {
    setCurrentMessage(prompt);
  };

  // --- SMART ADVICE HANDLERS ---
  const handleAdviceClick = (card: AiAdviceCard) => {
    if (user.status !== 'ACTIVE') return;
    setActiveAdvice(card);
    setAdviceStep('info');
  };

  const handleRiskCommitment = () => {
    setAdviceStep('processing');
    setTimeout(() => {
        // EWA Lite: Internal logic to "reserve" or limit future requests.
        // Visually we reduce availableEwa to represent the commitment.
        setUser(prev => ({ ...prev, availableEwa: Math.max(0, prev.availableEwa - 22.50) })); 
        setAdviceStep('success');
        logCriticalEvent(MOAT_EVENTS.NUDGE_COMMITMENT, { type: 'risk_reduction', amount: 22.50 }, { fwiScore: user.fwiScore });
    }, 1500);
  };

  const handleSavingsInjection = () => {
    setAdviceStep('processing');
    setTimeout(() => {
        // EWA Lite: Create a specific request type for Savings.
        const newRequest: EwaRequest = {
            id: `req_sav_${Date.now()}`,
            amount: 20,
            date: 'Hoy',
            status: 'processing_transfer', 
            fee: 0.00, // Maybe subsidized?
            estimatedArrival: 'Próximo Corte'
        };
        
        setEwaHistory(prev => [newRequest, ...prev]);
        setUser(prev => ({...prev, availableEwa: prev.availableEwa - 20}));
        
        setAdviceStep('success');
        logCriticalEvent(MOAT_EVENTS.EWA_INITIATED, { amount: 20, type: 'savings_injection' }, { fwiScore: user.fwiScore });
    }, 1500);
  };

  const handleRecordContribution = () => {
    // Dynamically find the vacation goal or default to the first available goal
    setGoals(prev => {
        const vacationGoal = prev.find(g => g.category === 'Vacation') || prev[0];
        return prev.map(g => {
            if (g.id === vacationGoal.id) {
                return { ...g, currentAmount: g.currentAmount + 20, lastContribution: Date.now() };
            }
            return g;
        });
    });
    setActiveAdvice(null);
    setActiveTab('goals'); // Direct user to see the updated goal
    logCriticalEvent(MOAT_EVENTS.GOAL_CONTRIBUTION, { amount: 20, type: 'ewa_injection' }, { fwiScore: user.fwiScore });
  };

  // --- BANK REQUEST HANDLER (PROFILE) ---
  const handleBankRequest = () => {
      setBankRequestStep('processing');
      // Simulate API call to routing service
      setTimeout(() => {
          setBankRequestStep('success');
          // In real app, this sends payload to HRIS and creates a Ticket
      }, 2000);
  };

  const getCategoryIcon = (category: string) => {
      const cat = category.toLowerCase();
      if (cat.includes('auto') || cat.includes('transporte') || cat.includes('gasolina')) return <Car size={18} />;
      if (cat.includes('food') || cat.includes('comida') || cat.includes('restaurante')) return <Utensils size={18} />;
      if (cat.includes('cafe') || cat.includes('café')) return <Coffee size={18} />;
      if (cat.includes('compra') || cat.includes('shopping')) return <ShoppingBag size={18} />;
      if (cat.includes('suscri')) return <Zap size={18} />;
      return <CreditCard size={18} />;
  };

  const filteredTransactions = transactions.filter(t => {
      if (expenseFilter === 'all') return true;
      if (expenseFilter === 'discretionary') return t.isDiscretionary;
      return t.category.toLowerCase().includes(expenseFilter.toLowerCase());
  });

  const SidebarItem = ({ id, icon: Icon, label, active, onClick, disabled }: { id: string, icon: any, label: string, active: boolean, onClick: () => void, disabled?: boolean }) => (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        disabled 
          ? 'opacity-40 cursor-not-allowed text-gray-400' 
          : active 
            ? 'bg-[#1C81F2] text-white shadow-md' 
            : 'text-gray-500 hover:bg-white hover:shadow-sm'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm text-left">{label}</span>
      {disabled && <Lock size={12} className="ml-auto" />}
    </button>
  );

  // --- SUSPENDED STATE VIEW (MATRIX RULE 2.1) ---
  if (user.status === 'SUSPENDED') {
      return (
        <div className="flex h-screen bg-slate-50 items-center justify-center p-6">
            <div className="absolute top-4 right-4 z-50">
               {/* Role Switcher for Demo */}
               <select 
                  className="bg-white border border-gray-300 text-xs rounded p-1"
                  value={user.status}
                  onChange={(e) => setUser(prev => ({...prev, status: e.target.value as any}))}
               >
                  <option value="ACTIVE">Simular: Activo</option>
                  <option value="PENDING">Simular: Pendiente</option>
                  <option value="SUSPENDED">Simular: Suspendido</option>
               </select>
            </div>
            <div className="bg-white max-w-md w-full rounded-2xl shadow-xl p-8 text-center border border-slate-200">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <UserX size={40} />
                </div>
                <h2 className="text-2xl font-bold text-[#1E293B] mb-2 font-['Space_Grotesk']">Cuenta Suspendida</h2>
                <p className="text-gray-500 mb-8">
                    Tu acceso a Treevü ha sido desactivado temporalmente. Esto puede deberse a un cambio en tu estado laboral o una revisión administrativa.
                </p>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                    <p className="text-sm font-bold text-gray-700 mb-1">¿Crees que es un error?</p>
                    <p className="text-xs text-gray-500">Contacta a tu departamento de RR.HH.</p>
                </div>
                <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors">
                    Cerrar Sesión
                </button>
            </div>
        </div>
      );
  }

  return (
    <div className="flex h-screen bg-[#F6FAFE] overflow-hidden">
        {/* DEV: ROLE SWITCHER (TOP RIGHT) */}
        <div className="fixed top-4 right-20 z-50">
           <select 
              className="bg-white border border-gray-300 text-xs rounded p-1 shadow-sm opacity-50 hover:opacity-100 transition-opacity"
              value={user.status}
              onChange={(e) => setUser(prev => ({...prev, status: e.target.value as any}))}
           >
              <option value="ACTIVE">Simular: Activo</option>
              <option value="PENDING">Simular: Pendiente</option>
              <option value="SUSPENDED">Simular: Suspendido</option>
           </select>
        </div>

        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 h-full p-6 fixed left-0 top-0 z-20">
            <div className="flex items-center space-x-2 mb-8 px-2">
                <div className="bg-[#1C81F2] p-2 rounded-lg">
                    <Leaf className="text-white" size={24} />
                </div>
                <div className="leading-tight">
                    <span className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] block">Treevü</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Colaborador</span>
                </div>
            </div>

            {/* NEW STRUCTURE: Strategic / Transactional / System */}
            <nav className="flex-1 space-y-6 overflow-y-auto pr-2">
                
                {/* BIENESTAR (Estratégico) */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bienestar</p>
                    <SidebarItem 
                        id="home" 
                        icon={Layout} 
                        label="Mi Dashboard (FWI)" 
                        active={activeTab === 'home'} 
                        onClick={() => setActiveTab('home')}
                    />
                    <SidebarItem 
                        id="goals" 
                        icon={Target} 
                        label="Metas y Ahorro" 
                        active={activeTab === 'goals'} 
                        onClick={() => setActiveTab('goals')}
                        disabled={user.status !== 'ACTIVE'}
                    />
                    <SidebarItem 
                        id="assistant" 
                        icon={MessageSquare} 
                        label="Asistente IA" 
                        active={activeTab === 'assistant'} 
                        onClick={() => setActiveTab('assistant')}
                        disabled={user.status !== 'ACTIVE'}
                    />
                    <SidebarItem 
                        id="market" 
                        icon={Store} 
                        label="Marketplace" 
                        active={activeTab === 'market'} 
                        onClick={() => setActiveTab('market')}
                    />
                </div>

                {/* FINANZAS (Transaccional) */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Finanzas</p>
                    <SidebarItem 
                        id="wallet" 
                        icon={Banknote} 
                        label="Nómina On-Demand" 
                        active={activeTab === 'wallet'} 
                        onClick={() => setActiveTab('wallet')}
                        disabled={user.status !== 'ACTIVE'}
                    />
                    <SidebarItem 
                        id="expense" 
                        icon={CreditCard} 
                        label="Centro de Operaciones" 
                        active={activeTab === 'expense'} 
                        onClick={() => setActiveTab('expense')}
                        disabled={user.status !== 'ACTIVE'}
                    />
                </div>

                {/* SISTEMA (Config) */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sistema</p>
                    <SidebarItem 
                        id="profile" 
                        icon={User} 
                        label="Mi Perfil y Cuentas" 
                        active={activeTab === 'profile'} 
                        onClick={() => setActiveTab('profile')}
                    />
                </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-200">
                <div className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-[#3CB7A9] rounded-full flex items-center justify-center text-white font-bold">
                        AJ
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
                        <div className="flex items-center text-xs text-slate-500">
                            {user.status === 'ACTIVE' && <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>}
                            {user.status === 'PENDING' && <span className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></span>}
                            <span className="truncate capitalize">{user.status.toLowerCase()}</span>
                        </div>
                    </div>
                    <LogOut size={16} className="ml-auto text-gray-400 cursor-pointer hover:text-red-500" />
                </div>
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 md:ml-64 overflow-y-auto h-full scroll-smooth">
            {/* PENDING STATE BANNER (MATRIX 2.6) */}
            {user.status === 'PENDING' && (
                <div className="bg-yellow-50 border-b border-yellow-100 p-4 text-center">
                    <p className="text-sm text-yellow-800 font-bold flex items-center justify-center">
                        <UserCheck size={16} className="mr-2" />
                        Tu cuenta está en proceso de validación por RR.HH. Algunas funciones están limitadas.
                    </p>
                </div>
            )}

            <div className="p-6 md:p-10 font-sans">
                {/* GLOBAL HEADER */}
                <header className="mb-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E293B] font-['Space_Grotesk']">
                            {activeTab === 'home' && `Hola, ${user.name.split(' ')[0]}`}
                            {activeTab === 'expense' && 'Centro de Operaciones'}
                            {activeTab === 'market' && 'Marketplace de Bienestar'}
                            {activeTab === 'goals' && 'Mis Metas'}
                            {activeTab === 'wallet' && 'Nómina On-Demand'}
                            {activeTab === 'assistant' && 'Treevü Brain'}
                            {activeTab === 'profile' && 'Mi Perfil & Configuración'}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1">
                            {activeTab === 'home' && (user.status === 'ACTIVE' ? aiNudge : 'Completa tu perfil para acceder a insights.')}
                            {activeTab === 'expense' && 'Registro de Gastos & Conciliación'}
                            {activeTab === 'wallet' && 'Gestión de tu salario devengado con tu empresa.'}
                            {activeTab === 'market' && 'Canjea tus TreePoints por beneficios exclusivos.'}
                            {activeTab === 'goals' && 'Visualiza y alcanza tus objetivos financieros.'}
                            {activeTab === 'assistant' && 'Tu copiloto financiero personal con IA.'}
                            {activeTab === 'profile' && 'Gestiona tus datos, seguridad y preferencias de EWA.'}
                        </p>
                    </div>
                    
                    {/* Only Show Points/Notifications if Active */}
                    {user.status === 'ACTIVE' && (
                        <div className="flex items-center space-x-4">
                            <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2">
                                <Leaf size={16} className="text-[#3CB7A9]" />
                                <span className="font-bold text-[#1E293B]">{user.treePoints} pts</span>
                            </div>
                            
                            {/* NOTIFICATIONS DROPDOWN */}
                            <div className="relative">
                                <button 
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 relative hover:bg-gray-50 transition-colors"
                                >
                                    <Bell size={20} className="text-gray-500" />
                                    {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
                                        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                                            <h4 className="font-bold text-[#1E293B] text-sm">Notificaciones</h4>
                                            <button onClick={() => setNotifications([])} className="text-xs text-[#1C81F2] font-bold hover:underline">
                                                Limpiar
                                            </button>
                                        </div>
                                        <div className="max-h-64 overflow-y-auto">
                                            {notifications.length === 0 ? (
                                                <div className="p-6 text-center text-gray-400">
                                                    <Bell size={24} className="mx-auto mb-2 opacity-50" />
                                                    <p className="text-xs">No tienes notificaciones nuevas</p>
                                                </div>
                                            ) : (
                                                notifications.map(notif => (
                                                    <div key={notif.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors flex items-start">
                                                        <div className={`mt-1 p-1 rounded-full mr-3 ${
                                                            notif.severity === 'critical' ? 'bg-red-100 text-red-500' :
                                                            notif.type === 'achievement' ? 'bg-yellow-100 text-yellow-600' :
                                                            'bg-blue-100 text-blue-500'
                                                        }`}>
                                                            {notif.type === 'achievement' ? <Award size={14} /> : <Info size={14} />}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs text-slate-600 font-medium leading-relaxed">{notif.message}</p>
                                                            <p className="text-[10px] text-slate-400 mt-1">Hace un momento</p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </header>

                {/* --- HOME TAB --- */}
                {activeTab === 'home' && (
                  <div className="animate-in fade-in duration-500 space-y-8">
                     
                     {/* MATRIX 2.1: Only Active users see Nudges */}
                     {user.status === 'ACTIVE' ? (
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {MOCK_ADVICE_CARDS.map(card => (
                                <div key={card.id} className={`p-4 rounded-xl border flex items-start space-x-4 ${
                                    card.type === 'risk' ? 'bg-orange-50 border-orange-100' : 'bg-teal-50 border-teal-100'
                                }`}>
                                    <div className={`p-2 rounded-full ${
                                        card.type === 'risk' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'
                                    }`}>
                                        {card.type === 'risk' ? <AlertCircle size={20} /> : <TrendingUp size={20} />}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className={`font-bold text-sm mb-1 ${
                                            card.type === 'risk' ? 'text-orange-900' : 'text-teal-900'
                                        }`}>{card.title}</h4>
                                        <p className={`text-xs mb-3 ${
                                            card.type === 'risk' ? 'text-orange-700' : 'text-teal-700'
                                        }`}>{card.description}</p>
                                        <button 
                                            onClick={() => handleAdviceClick(card)}
                                            className={`text-xs font-bold underline ${
                                            card.type === 'risk' ? 'text-orange-800' : 'text-teal-800'
                                        }`}>
                                            {card.actionLabel}
                                        </button>
                                    </div>
                                </div>
                            ))}
                         </div>
                     ) : (
                         // Pending State Banner for Home
                         <div className="bg-white p-8 rounded-2xl border border-dashed border-gray-300 text-center">
                            <Clock className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-700">Tus insights financieros se están generando</h3>
                            <p className="text-sm text-gray-500">Una vez que tu cuenta esté activa, verás aquí consejos personalizados.</p>
                         </div>
                     )}

                     {/* FWI Score & Quick Stats */}
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* FWI Score Card (Hidden for Pending - Matrix 2.1) */}
                        {user.status === 'ACTIVE' ? (
                            <div 
                                onClick={() => setActiveInfoModal('fwi')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between cursor-pointer hover:shadow-md transition-all group relative"
                            >
                               <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ArrowUpRight size={16} className="text-gray-400" />
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-gray-500 uppercase mb-1">Tu FWI Score</p>
                                  <h2 className="text-4xl font-bold text-[#1E293B] font-['Space_Grotesk']">{user.fwiScore}/100</h2>
                                  <span className={`inline-block mt-2 px-2 py-1 rounded-md text-xs font-bold ${user.fwiScore > 60 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                     {user.fwiScore > 60 ? 'Saludable' : 'Atención Requerida'}
                                  </span>
                               </div>
                               <div className="h-24 w-24">
                                  <ResponsiveContainer width="100%" height="100%">
                                     <PieChart>
                                        <Pie data={[{value: user.fwiScore}, {value: 100-user.fwiScore}]} innerRadius={30} outerRadius={40} dataKey="value">
                                           <Cell fill={user.fwiScore > 60 ? COLORS.success : COLORS.warning} />
                                           <Cell fill="#E2E8F0" />
                                        </Pie>
                                     </PieChart>
                                  </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-center opacity-70">
                                <p className="text-sm font-bold text-gray-400 uppercase mb-1">FWI Score</p>
                                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <p className="text-xs text-gray-400">Disponible al activar</p>
                            </div>
                        )}
                        
                        {/* Streak Card */}
                        <div 
                            onClick={() => user.status === 'ACTIVE' && setActiveInfoModal('streak')}
                            className={`p-6 rounded-2xl shadow-sm flex items-center justify-between relative group ${
                            user.status === 'ACTIVE' ? 'bg-gradient-to-br from-[#1C81F2] to-blue-700 text-white cursor-pointer hover:shadow-lg transition-all' : 'bg-gray-100 text-gray-400'
                        }`}>
                           {user.status === 'ACTIVE' && (
                               <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <ArrowUpRight size={16} className="text-white/80" />
                                </div>
                           )}
                           <div>
                              <p className={`text-sm font-bold uppercase mb-1 ${user.status === 'ACTIVE' ? 'text-blue-200' : 'text-gray-400'}`}>Racha Actual</p>
                              <h2 className="text-4xl font-bold font-['Space_Grotesk']">{user.streakDays} Días</h2>
                              <p className={`text-xs mt-2 ${user.status === 'ACTIVE' ? 'text-blue-100' : 'text-gray-400'}`}>¡Sigue así para ganar bonos!</p>
                           </div>
                           <Award size={48} className={user.status === 'ACTIVE' ? 'text-white/20' : 'text-gray-300'} />
                        </div>

                        {/* Quick Balance (Hidden for Pending) */}
                        {user.status === 'ACTIVE' ? (
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                               <p className="text-sm font-bold text-gray-500 uppercase mb-2">Liquidez Disponible</p>
                               <h2 className="text-3xl font-bold text-[#1E293B] mb-2">${user.availableEwa.toFixed(2)}</h2>
                               <button onClick={() => setActiveTab('wallet')} className="text-sm text-[#1C81F2] font-bold flex items-center hover:underline">
                                  Ir a Nómina On-Demand <ArrowRight size={14} className="ml-1" />
                               </button>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 flex flex-col justify-center opacity-70">
                                <p className="text-sm font-bold text-gray-400 uppercase mb-2">Liquidez</p>
                                <div className="flex items-center space-x-2 text-gray-400">
                                    <Lock size={16} />
                                    <span className="text-sm font-bold">Bloqueado</span>
                                </div>
                            </div>
                        )}
                     </div>

                     {/* Recent Transactions (Hidden for Pending) */}
                     {user.status === 'ACTIVE' && (
                         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-[#1E293B]">Movimientos Recientes</h3>
                                <button onClick={() => setActiveTab('expense')} className="text-[#1C81F2] text-sm font-bold">Nuevo Gasto</button>
                            </div>
                            <div className="space-y-4">
                               {transactions.slice(0, 3).map((tx) => (
                                  <div key={tx.id} className="flex justify-between items-center p-3 hover:bg-gray-50 rounded-xl transition-colors">
                                     <div className="flex items-center space-x-4">
                                        <div className="bg-gray-100 p-2 rounded-full text-gray-600">
                                           <CreditCard size={20} />
                                        </div>
                                        <div>
                                           <p className="font-bold text-[#1E293B]">{tx.merchant}</p>
                                           <p className="text-xs text-gray-500">{tx.category} • {tx.date}</p>
                                        </div>
                                     </div>
                                     <div className="text-right">
                                        <p className="font-bold text-[#1E293B]">${tx.amount.toFixed(2)}</p>
                                        {tx.isDiscretionary && <span className="text-[10px] text-orange-500 font-bold bg-orange-50 px-1 rounded">Discrecional</span>}
                                     </div>
                                  </div>
                               ))}
                            </div>
                         </div>
                     )}
                  </div>
                )}

                {/* --- MARKETPLACE TAB (Matrix 2.4) --- */}
                {activeTab === 'market' && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        {/* Pending Banner for Marketplace */}
                        {user.status === 'PENDING' && (
                            <div className="mb-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-center">
                                <Info size={20} className="text-blue-500 mr-2" />
                                <p className="text-sm text-blue-800">Estás en modo visualización. Activa tu cuenta para canjear estos beneficios.</p>
                            </div>
                        )}

                        {/* Market Filters */}
                        <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
                           <button 
                             onClick={() => setMarketFilter('all')}
                             className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                               marketFilter === 'all' ? 'bg-[#1E293B] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'
                             }`}
                           >
                              <Layout size={16} /> <span>Todos</span>
                           </button>
                           <button 
                             onClick={() => setMarketFilter('corporate')}
                             className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                               marketFilter === 'corporate' ? 'bg-[#1C81F2] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'
                             }`}
                           >
                              <Building2 size={16} /> <span>Beneficios Corporativos</span>
                           </button>
                           <button 
                             onClick={() => setMarketFilter('global')}
                             className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                               marketFilter === 'global' ? 'bg-[#3CB7A9] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'
                             }`}
                           >
                              <Globe size={16} /> <span>Ofertas Globales</span>
                           </button>
                           <button 
                             onClick={() => setMarketFilter('saved')}
                             className={`px-4 py-2 rounded-full text-sm font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                               marketFilter === 'saved' ? 'bg-[#F59E0B] text-white shadow-md' : 'bg-white text-gray-500 border border-gray-200'
                             }`}
                           >
                              <Bookmark size={16} /> <span>Guardados</span>
                           </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {MARKET_OFFERS
                              .filter(offer => {
                                  if (marketFilter === 'saved') return savedOfferIds.has(offer.id);
                                  if (marketFilter === 'all') return true;
                                  return offer.origin === marketFilter;
                              })
                              .map(offer => (
                                <div key={offer.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                                    <div className="p-6 flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                                                offer.category === 'Emergency' ? 'bg-red-100 text-red-600' :
                                                offer.category === 'Financial' ? 'bg-blue-100 text-blue-600' :
                                                'bg-teal-100 text-teal-600'
                                            }`}>
                                                {offer.origin === 'corporate' ? 'Corporativo' : offer.category}
                                            </span>
                                            {offer.discountValue && (
                                                <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                    {offer.discountValue}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-lg font-bold text-[#1E293B] mb-2 font-['Space_Grotesk']">{offer.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4">{offer.description}</p>
                                    </div>
                                    <div className="p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center space-x-1">
                                            <Leaf size={16} className="text-[#3CB7A9]" />
                                            <span className="font-bold text-[#1E293B]">{offer.costPoints}</span>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                onClick={() => toggleSaveOffer(offer.id)}
                                                className={`p-2 rounded-full hover:bg-gray-200 transition-colors ${savedOfferIds.has(offer.id) ? 'text-[#1C81F2]' : 'text-gray-400'}`}
                                            >
                                                {savedOfferIds.has(offer.id) ? <Bookmark size={20} fill="currentColor" /> : <Bookmark size={20} />}
                                            </button>
                                            <button 
                                                onClick={() => handleRedeemClick(offer)}
                                                disabled={user.status !== 'ACTIVE'}
                                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                                    user.status === 'ACTIVE' 
                                                    ? 'bg-[#1E293B] text-white hover:bg-slate-800' 
                                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                Canjear
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* --- EXPENSE HUB --- */}
                {activeTab === 'expense' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
                           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1C81F2] to-[#3CB7A9]"></div>
                           
                           <div className="p-8">
                               <div className="flex items-center justify-between mb-6">
                                   <div className="flex items-center space-x-3">
                                      <div className="bg-blue-50 p-3 rounded-full text-[#1C81F2]">
                                         <Sparkles size={24} />
                                      </div>
                                      <div>
                                         <h3 className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk']">Captura Inteligente</h3>
                                         <p className="text-sm text-gray-500">Describe tu gasto, la IA lo clasifica y evalúa.</p>
                                      </div>
                                   </div>
                                   <button className="text-gray-400 hover:text-gray-600">
                                      <Camera size={24} />
                                   </button>
                               </div>

                               <div className="relative">
                                  <input
                                    type="text"
                                    value={expenseInput}
                                    onChange={(e) => setExpenseInput(e.target.value)}
                                    disabled={expenseStep === 'processing'}
                                    placeholder="Ej: $45 en Gasolina Shell (Escribe tu gasto aquí)"
                                    className="w-full text-lg p-5 pr-14 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-[#1C81F2] focus:ring-4 focus:ring-blue-50 transition-all placeholder:text-gray-400"
                                    onKeyDown={(e) => e.key === 'Enter' && handleExpenseSubmit()}
                                  />
                                  <button 
                                    onClick={handleExpenseSubmit}
                                    disabled={!expenseInput || expenseStep === 'processing'}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-[#1C81F2] text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                                  >
                                    {expenseStep === 'processing' ? <RefreshCw className="animate-spin" size={20} /> : <ArrowRight size={20} />}
                                  </button>
                                </div>
                           </div>

                           {expenseStep === 'result' && lastAnalysis && (
                              <div className="bg-slate-50 border-t border-slate-100 p-8 animate-in slide-in-from-top-2">
                                  <div className="flex items-start space-x-4 mb-6">
                                      <div className="p-2 bg-white rounded-lg shadow-sm text-green-500">
                                          <CheckCircle size={24} />
                                      </div>
                                      <div className="flex-1">
                                          <h4 className="font-bold text-[#1E293B] text-lg">Gasto Registrado</h4>
                                          <p className="text-sm text-gray-600">
                                              Clasificado como <span className="font-bold text-[#1C81F2]">{lastAnalysis.category}</span> con {(lastAnalysis.confidence * 100).toFixed(0)}% de confianza.
                                          </p>
                                      </div>
                                      <button onClick={resetExpenseTab} className="text-sm text-gray-400 hover:text-gray-600">Cerrar</button>
                                  </div>

                                  <div className="mb-6 bg-white p-4 rounded-xl border border-gray-200">
                                      <div className="flex justify-between items-center mb-2">
                                          <span className="text-xs font-bold uppercase text-gray-500">Impacto en Presupuesto ({lastAnalysis.category})</span>
                                          <span className={`text-xs font-bold ${
                                              lastAnalysis.budgetImpact?.status === 'critical' ? 'text-red-500' : 'text-gray-600'
                                          }`}>
                                              {lastAnalysis.budgetImpact?.percentUsed}% Usado
                                          </span>
                                      </div>
                                      <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                          <div 
                                              className={`h-2 rounded-full transition-all duration-1000 ${
                                                  lastAnalysis.budgetImpact?.status === 'critical' ? 'bg-red-500' : 
                                                  lastAnalysis.budgetImpact?.status === 'warning' ? 'bg-orange-400' : 'bg-green-500'
                                              }`} 
                                              style={{width: `${lastAnalysis.budgetImpact?.percentUsed}%`}}
                                          ></div>
                                      </div>
                                      <p className="text-xs text-gray-500">
                                          Te quedan <span className="font-bold">${lastAnalysis.budgetImpact?.remainingAfter}</span> disponibles para esta semana.
                                      </p>
                                  </div>

                                  {lastAnalysis.suggestedAction && (
                                      <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                                          <div className="flex items-center space-x-3">
                                              <div className="bg-indigo-100 p-2 rounded-full text-indigo-600">
                                                  {lastAnalysis.suggestedAction.type === 'offer' ? <Tag size={18} /> : <PiggyBank size={18} />}
                                              </div>
                                              <div>
                                                  <p className="font-bold text-indigo-900 text-sm">{lastAnalysis.suggestedAction.title}</p>
                                                  <p className="text-xs text-indigo-700">{lastAnalysis.suggestedAction.description}</p>
                                              </div>
                                          </div>
                                          <button className="text-xs font-bold bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700">
                                              Ver Acción
                                          </button>
                                      </div>
                                  )}
                              </div>
                           )}
                        </div>

                        <div className="flex flex-col md:flex-row gap-8">
                            <div className="flex-1 space-y-4">
                                <div className="flex items-center space-x-2 overflow-x-auto pb-2">
                                    {['all', 'Alimentos', 'Transporte', 'Ocio', 'Salud', 'Suscripción'].map(filter => (
                                        <button 
                                            key={filter}
                                            onClick={() => setExpenseFilter(filter)}
                                            className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                                                expenseFilter === filter 
                                                ? 'bg-[#1E293B] text-white shadow-md' 
                                                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
                                            }`}
                                        >
                                            {filter === 'all' ? 'Todo' : filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden min-h-[300px]">
                                    {filteredTransactions.length > 0 ? (
                                        <div className="divide-y divide-gray-100">
                                            {filteredTransactions.map(tx => (
                                                <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="bg-gray-100 p-2 rounded-xl text-gray-500">
                                                            {getCategoryIcon(tx.category)}
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-[#1E293B] text-sm">{tx.merchant}</p>
                                                            <p className="text-xs text-gray-400">{tx.date} • {tx.category}</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-[#1E293B] text-sm">-${tx.amount.toFixed(2)}</p>
                                                        {tx.aiConfidence && tx.aiConfidence < 0.8 && (
                                                            <button className="text-[10px] text-orange-500 font-bold hover:underline">¿Corregir?</button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center h-full p-10 text-gray-400">
                                            <Filter size={32} className="mb-2 opacity-50" />
                                            <p className="text-sm">No hay gastos en esta categoría.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="w-full md:w-80">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
                                    <h4 className="font-bold text-[#1E293B] mb-4">Resumen Mensual</h4>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-gray-500">Gastado</span>
                                                <span className="font-bold text-[#1E293B]">$1,240</span>
                                            </div>
                                            <div className="w-full bg-gray-100 h-2 rounded-full">
                                                <div className="bg-[#1C81F2] h-2 rounded-full w-[65%]"></div>
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-gray-100">
                                            <p className="text-xs font-bold text-gray-400 uppercase mb-2">Top Categorías</p>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs">
                                                    <span className="flex items-center text-gray-600"><div className="w-2 h-2 bg-orange-400 rounded-full mr-2"></div>Alimentos</span>
                                                    <span className="font-bold">$450</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="flex items-center text-gray-600"><div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>Transporte</span>
                                                    <span className="font-bold">$320</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- WALLET TAB --- */}
                {activeTab === 'wallet' && (
                  <div className="animate-in fade-in duration-500 space-y-8">
                     <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
                         <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-bl-full opacity-50"></div>
                         
                         <div className="p-8 relative z-10">
                             <div className="flex justify-between items-start mb-8">
                                 <div>
                                     <p className="text-sm font-bold text-gray-500 uppercase mb-1 flex items-center">
                                         <Clock size={16} className="mr-1" /> Salario Devengado (Calculado)
                                         <Info size={14} className="ml-1 text-gray-400 cursor-help" />
                                     </p>
                                     <h2 className="text-5xl font-bold text-[#1E293B] font-['Space_Grotesk'] tracking-tight">
                                         ${user.availableEwa.toFixed(2)}
                                     </h2>
                                     <div className="flex items-center mt-2 space-x-2">
                                         <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-md">
                                             Disponible para adelanto
                                         </span>
                                         <span className="text-xs text-gray-400">
                                             Ciclo: 01-15 Oct
                                         </span>
                                     </div>
                                 </div>
                                 <div className="flex space-x-2">
                                     <button 
                                         onClick={() => setShowWalletSettings(true)}
                                         className="p-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm"
                                     >
                                         <Settings size={20} className="text-gray-600" />
                                     </button>
                                     <button 
                                         onClick={() => setShowWithdrawModal(true)}
                                         className="p-3 bg-[#1C81F2] text-white rounded-xl hover:bg-blue-600 transition-colors shadow-lg flex items-center font-bold"
                                     >
                                         <Zap size={20} className="mr-2" /> Solicitar Adelanto
                                     </button>
                                 </div>
                             </div>

                             <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex items-center justify-between">
                                 <div className="flex-1 mr-4">
                                     <div className="flex justify-between text-xs mb-2 font-bold text-gray-500">
                                         <span>Inicio Ciclo (Día 1)</span>
                                         <span>Hoy (Día 12)</span>
                                         <span>Pago Nómina (Día 15)</span>
                                     </div>
                                     <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden relative">
                                         <div className="absolute top-0 left-0 h-full bg-green-500 w-[80%]"></div>
                                         <div className="absolute top-0 left-[80%] w-1 h-full bg-white z-10"></div>
                                     </div>
                                 </div>
                                 <div className="text-right pl-4 border-l border-gray-200">
                                     <p className="text-xs text-gray-400 font-bold uppercase">Próximo Pago</p>
                                     <p className="font-bold text-[#1E293B]">15 Oct</p>
                                 </div>
                             </div>
                         </div>
                     </div>

                     <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-lg text-[#1E293B]">Historial de Solicitudes</h3>
                            <button className="text-[#1C81F2] text-sm font-bold">Ver Todo</button>
                        </div>
                        <div className="divide-y divide-gray-100">
                           {ewaHistory.map((req) => (
                              <div key={req.id} className="p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                                 <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${
                                        req.status === 'disbursed' ? 'bg-green-100 text-green-600' : 
                                        req.status === 'processing_transfer' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                       {req.status === 'disbursed' ? <CheckCircle size={20} /> : <Clock size={20} />}
                                    </div>
                                    <div>
                                       <p className="font-bold text-[#1E293B]">Adelanto de Nómina</p>
                                       <p className="text-xs text-gray-500">
                                           {req.date} • {req.status === 'disbursed' ? 'Pagado por Empresa' : 'Enviado a Tesorería'}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-bold text-[#1E293B]">${req.amount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">Comisión: ${req.fee.toFixed(2)}</p>
                                 </div>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
                )}

                {/* --- GOALS TAB --- */}
                {activeTab === 'goals' && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {goals.map(goal => (
                                <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                                    {goal.priority && (
                                        <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-bl-xl">
                                            PRIORIDAD
                                        </div>
                                    )}
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="bg-blue-50 p-3 rounded-xl text-[#1C81F2]">
                                            <Target size={24} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 font-bold uppercase">Meta</p>
                                            <p className="font-bold text-lg">${goal.targetAmount}</p>
                                        </div>
                                    </div>
                                    <h3 className="font-bold text-lg text-[#1E293B] mb-1">{goal.name}</h3>
                                    <p className="text-xs text-gray-500 mb-4">Fecha límite: {goal.deadline}</p>
                                    
                                    <div className="w-full bg-gray-100 h-3 rounded-full mb-2">
                                        <div 
                                            className="bg-[#3CB7A9] h-3 rounded-full transition-all duration-1000" 
                                            style={{width: `${(goal.currentAmount / goal.targetAmount) * 100}%`}}
                                        ></div>
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-gray-600 mb-6">
                                        <span>${goal.currentAmount} ahorrados</span>
                                        <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                                    </div>

                                    <button className="w-full py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                                        Ver Detalles
                                    </button>
                                </div>
                            ))}
                            
                            {/* Add New Goal Card */}
                            <button className="border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center p-6 text-slate-400 hover:border-[#1C81F2] hover:text-[#1C81F2] transition-all bg-slate-50/50">
                                <Plus size={32} className="mb-2" />
                                <span className="font-bold">Nueva Meta</span>
                            </button>
                        </div>
                    </div>
                )}

                {/* --- PROFILE TAB --- */}
                {activeTab === 'profile' && (
                    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk']">Información Personal</h3>
                                    <p className="text-sm text-gray-500">Datos sincronizados con RR.HH. (HRIS)</p>
                                </div>
                                <div className="bg-blue-50 p-2 rounded-full text-[#1C81F2]">
                                    <User size={24} />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre Completo</label>
                                    <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed">
                                        <Briefcase size={16} className="mr-2" /> {user.name}
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">* Dato de lectura (Workday)</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ID Empleado</label>
                                    <div className="flex items-center p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed">
                                        <Tag size={16} className="mr-2" /> EMP-9921
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-1">* Clave única de nómina</p>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Correo Electrónico</label>
                                    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
                                        <Mail size={16} className="mr-2 text-gray-400" />
                                        <input 
                                            type="email" 
                                            value={profileForm.email}
                                            onChange={(e) => setProfileForm({...profileForm, email: e.target.value})}
                                            className="flex-1 outline-none text-[#1E293B]"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Teléfono Móvil</label>
                                    <div className="flex items-center p-3 bg-white border border-gray-200 rounded-lg">
                                        <Smartphone size={16} className="mr-2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={profileForm.phone}
                                            onChange={(e) => setProfileForm({...profileForm, phone: e.target.value})}
                                            className="flex-1 outline-none text-[#1E293B]"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button className="flex items-center px-4 py-2 bg-[#1C81F2] text-white rounded-xl text-sm font-bold shadow-sm hover:bg-blue-600 transition-colors">
                                    <Save size={16} className="mr-2" /> Guardar Cambios
                                </button>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <h3 className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] mb-6">Seguridad y Alertas</h3>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <div>
                                        <p className="font-bold text-[#1E293B]">Autenticación de Dos Factores (MFA)</p>
                                        <p className="text-xs text-gray-500">Recomendado para proteger el acceso a tu devengado.</p>
                                    </div>
                                    <button 
                                        onClick={() => setProfileForm(prev => ({...prev, mfaEnabled: !prev.mfaEnabled}))}
                                        className={`text-3xl transition-colors ${profileForm.mfaEnabled ? 'text-[#3CB7A9]' : 'text-gray-300'}`}
                                    >
                                        {profileForm.mfaEnabled ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                                    <div>
                                        <p className="font-bold text-[#1E293B]">Alertas de Liquidez</p>
                                        <p className="text-xs text-gray-500">Notificar cuando mi disponible supere los $500.</p>
                                    </div>
                                    <button 
                                        onClick={() => setProfileForm(prev => ({...prev, notifyHighBalance: !prev.notifyHighBalance}))}
                                        className={`text-3xl transition-colors ${profileForm.notifyHighBalance ? 'text-[#3CB7A9]' : 'text-gray-300'}`}
                                    >
                                        {profileForm.notifyHighBalance ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-[#1E293B]">Confirmaciones de Nómina</p>
                                        <p className="text-xs text-gray-500">Notificar cuando la empresa confirme un desembolso.</p>
                                    </div>
                                    <button 
                                        onClick={() => setProfileForm(prev => ({...prev, notifyApproval: !prev.notifyApproval}))}
                                        className={`text-3xl transition-colors ${profileForm.notifyApproval ? 'text-[#3CB7A9]' : 'text-gray-300'}`}
                                    >
                                        {profileForm.notifyApproval ? <ToggleRight size={40} /> : <ToggleLeft size={40} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-lg border border-blue-100 p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
                            
                            <div className="flex items-start space-x-4 mb-6 relative z-10">
                                <div className="bg-blue-100 p-3 rounded-xl text-[#1C81F2]">
                                    <Landmark size={24} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk']">Configuración de Nómina</h3>
                                    <p className="text-sm text-gray-500">Gestión de cuenta de depósito para adelantos.</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 mb-6 relative z-10">
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-xs font-bold text-gray-500 uppercase">Cuenta Registrada (Lectura)</p>
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold flex items-center">
                                        <CheckCircle size={10} className="mr-1" /> Validada por RR.HH.
                                    </span>
                                </div>
                                <div className="flex items-center space-x-3 mb-2">
                                    <Landmark size={24} className="text-gray-600" />
                                    <span className="text-xl font-mono font-bold text-[#1E293B]">Chase Bank •••• 4492</span>
                                </div>
                                <p className="text-xs text-gray-400">Esta es la cuenta donde tu empresa deposita tu salario y adelantos.</p>
                            </div>

                            <div className="flex justify-between items-center relative z-10">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase">Frecuencia de Pago</p>
                                    <p className="font-bold text-[#1E293B]">Quincenal (15 y 30)</p>
                                </div>
                                <button 
                                    onClick={() => setShowBankRequestModal(true)}
                                    className="px-4 py-2 border border-[#1C81F2] text-[#1C81F2] rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors"
                                >
                                    Solicitar Cambio de Cuenta
                                </button>
                            </div>
                        </div>

                         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                            <h3 className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] mb-6">Preferencias de Bienestar</h3>
                            
                            <div className="mb-8">
                                <div className="flex justify-between items-end mb-2">
                                    <label className="text-sm font-bold text-gray-700">Límite Personal de Retiro</label>
                                    <span className="text-[#1C81F2] font-bold">{personalEwaLimit}% del permitido</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="10" 
                                    max="100" 
                                    step="5" 
                                    value={personalEwaLimit}
                                    onChange={(e) => setPersonalEwaLimit(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C81F2]"
                                />
                                <p className="text-xs text-gray-400 mt-2">
                                    Reduce tu capacidad de endeudamiento voluntariamente para proteger tu salario final.
                                </p>
                            </div>

                            <div>
                                <label className="text-sm font-bold text-gray-700 mb-2 block">Objetivo Mínimo de Ahorro Mensual</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                    <input 
                                        type="number"
                                        value={minSavingsTarget}
                                        onChange={(e) => setMinSavingsTarget(parseInt(e.target.value))}
                                        className="w-full pl-8 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1C81F2]"
                                    />
                                </div>
                                <p className="text-xs text-gray-400 mt-2">
                                    Usaremos este monto para sugerirte "Aportes a Ahorro" inteligentes.
                                </p>
                            </div>
                         </div>
                    </div>
                )}

                {/* --- ASSISTANT TAB --- */}
                {activeTab === 'assistant' && (
                    <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden flex flex-col h-[calc(100vh-180px)] min-h-[500px] animate-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-[#1C81F2] p-4 flex items-center justify-between text-white">
                            <div className="flex items-center space-x-3">
                                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                                    <Bot size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold font-['Space_Grotesk'] text-lg">Treevü Brain</h3>
                                    <p className="text-xs text-blue-100 flex items-center">
                                        <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                                        En línea • Asistente Financiero
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 space-y-6">
                            {chatHistory.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm ${
                                        msg.sender === 'user' 
                                        ? 'bg-[#1C81F2] text-white rounded-tr-none' 
                                        : 'bg-white text-gray-800 border border-slate-100 rounded-tl-none'
                                    }`}>
                                        <p className="text-sm leading-relaxed">{msg.text}</p>
                                        <p className={`text-[10px] mt-2 text-right ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 flex space-x-1 items-center">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                                    </div>
                                </div>
                            )}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="flex space-x-2 mb-4 overflow-x-auto pb-2">
                                {["¿Cómo mejoro mi FWI?", "Analiza mis gastos", "¿Puedo ahorrar más?"].map(prompt => (
                                    <button 
                                        key={prompt}
                                        onClick={() => handleQuickPrompt(prompt)}
                                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-xs font-bold text-gray-600 whitespace-nowrap transition-colors"
                                    >
                                        {prompt}
                                    </button>
                                ))}
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={currentMessage}
                                    onChange={(e) => setCurrentMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Escribe tu consulta financiera..."
                                    className="flex-1 p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-[#1C81F2] transition-colors"
                                />
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={!currentMessage.trim() || isTyping}
                                    className="p-3 bg-[#1C81F2] text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>

        {/* ... (Modals code remains same, just ensured full content is preserved) ... */}
        {/* FWI Information Modal (Detailed & Transparent) */}
        {activeInfoModal === 'fwi' && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                 <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">Tu FWI Score: {user.fwiScore}/100 (Saludable)</h3>
                         <button onClick={() => setActiveInfoModal(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                     </div>

                     <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                         <h4 className="font-bold text-gray-800 mb-4 flex items-center"><TrendingUp size={16} className="mr-2 text-green-500"/> Tendencia (3 Meses)</h4>
                         <div className="h-40">
                             <ResponsiveContainer width="100%" height="100%">
                                 <LineChart data={FWI_HISTORY_DATA}>
                                     <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                     <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                     <YAxis domain={[0, 100]} hide />
                                     <Tooltip />
                                     <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                                 </LineChart>
                             </ResponsiveContainer>
                         </div>
                     </div>

                     <div className="space-y-4 mb-6">
                         <h4 className="font-bold text-gray-800">¿Cómo se calcula? (Factores)</h4>
                         
                         <div>
                             <div className="flex justify-between text-sm mb-1">
                                 <span className="text-gray-600">Uso del Devengado (30%)</span>
                                 <span className="font-bold text-green-600">Excelente</span>
                             </div>
                             <div className="w-full bg-gray-200 h-2 rounded-full"><div className="bg-green-500 h-2 rounded-full w-[90%]"></div></div>
                             <p className="text-[10px] text-gray-400 mt-1">Puntos por mantener tu solicitud &lt; 30% del disponible.</p>
                         </div>
                         
                         <div>
                             <div className="flex justify-between text-sm mb-1">
                                 <span className="text-gray-600">Cumplimiento de Ahorro (25%)</span>
                                 <span className="font-bold text-yellow-600">Mejorable</span>
                             </div>
                             <div className="w-full bg-gray-200 h-2 rounded-full"><div className="bg-yellow-500 h-2 rounded-full w-[50%]"></div></div>
                             <p className="text-[10px] text-gray-400 mt-1">Puntos por respetar tus límites de Gasto Hormiga.</p>
                         </div>

                         <div>
                             <div className="flex justify-between text-sm mb-1">
                                 <span className="text-gray-600">Frecuencia de Retiro (20%)</span>
                                 <span className="font-bold text-blue-600">Buena</span>
                             </div>
                             <div className="w-full bg-gray-200 h-2 rounded-full"><div className="bg-blue-500 h-2 rounded-full w-[70%]"></div></div>
                             <p className="text-[10px] text-gray-400 mt-1">Puntos por solicitar menos de 2 veces al mes.</p>
                         </div>
                     </div>

                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                         <p className="text-xs text-blue-800">
                             <strong>Recomendación:</strong> Para pasar a 'Sólido' (75+), tu mayor oportunidad es reducir la frecuencia de retiros o cumplir tu próximo compromiso de Gasto Hormiga.
                         </p>
                     </div>
                     
                     <p className="text-[10px] text-gray-400 text-center">
                         * El FWI Score es una guía interna de hábitos. NO es un puntaje de crédito y NO se comparte con entidades financieras externas.
                     </p>
                 </div>
             </div>
        )}

        {/* Streak Information Modal (Gamification & Calendar) */}
        {activeInfoModal === 'streak' && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                 <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                     <div className="text-center mb-6">
                         <div className="inline-block p-3 bg-yellow-100 rounded-full text-yellow-600 mb-2">
                            <Award size={32} />
                         </div>
                         <h2 className="text-2xl font-bold font-['Space_Grotesk'] text-[#1E293B]">¡Felicidades! Llevas {user.streakDays} Días de Racha</h2>
                     </div>
                     
                     <div className="space-y-6">
                         {/* Streak Calendar Visualization */}
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                             <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 text-center">Historial (30 Días)</h4>
                             <div className="grid grid-cols-7 gap-2">
                                 {STREAK_CALENDAR_DATA.map((day, idx) => (
                                     <div 
                                        key={idx} 
                                        className={`h-8 rounded-md flex items-center justify-center text-[10px] font-bold transition-all ${
                                            day.status === 'active' ? 'bg-green-500 text-white shadow-sm' :
                                            day.status === 'broken' ? 'bg-red-100 text-red-400' :
                                            'bg-gray-200 text-gray-400'
                                        }`}
                                     >
                                         {day.status === 'active' && <CheckCircle size={12} />}
                                         {day.status === 'broken' && <X size={12} />}
                                         {day.status === 'neutral' && day.day}
                                     </div>
                                 ))}
                             </div>
                         </div>

                         <div>
                             <h4 className="font-bold text-gray-800 mb-2 text-sm">Regla de la Racha:</h4>
                             <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                 Tu racha se mantiene siempre que no retires EWA, <strong>O</strong> si retiras, cumples el compromiso de ahorro (Gasto Hormiga) que tenías activo.
                             </p>
                         </div>

                         <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                             <div>
                                 <p className="text-xs font-bold text-yellow-800 uppercase">Próximo Hito (10 Días)</p>
                                 <p className="font-bold text-gray-800 text-sm">50% OFF en tarifa EWA</p>
                             </div>
                             <div className="text-right">
                                 <Gift size={24} className="text-yellow-600" />
                             </div>
                         </div>

                         <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-500 text-center">
                             Estás a un día de tu primer hito. Si necesitas liquidez hoy, considera iniciar la función <strong>"Potencia tu Ahorro"</strong> para un retiro planificado y no romper tu racha por una emergencia.
                         </div>
                     </div>

                     <button onClick={() => setActiveInfoModal(null)} className="w-full mt-6 bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-lg">
                         ¡Seguir así!
                     </button>
                 </div>
             </div>
        )}

        {/* Bank Request Modal */}
        {showBankRequestModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                 <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">Cambio de Cuenta</h3>
                         <button onClick={() => setShowBankRequestModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                     </div>

                     {bankRequestStep === 'input' && (
                         <>
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6 flex items-start">
                                <Info className="text-blue-500 mr-3 mt-1" size={20} />
                                <p className="text-sm text-blue-800">
                                    Por seguridad, Treevü <strong>enruta esta solicitud a RR.HH.</strong> para que actualicen tu nómina. El cambio puede tardar 24-48h.
                                </p>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nueva Cuenta Bancaria</label>
                                    <input 
                                        type="text" 
                                        placeholder="Número de Cuenta / IBAN" 
                                        value={newBankAccount}
                                        onChange={(e) => setNewBankAccount(e.target.value)}
                                        className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1C81F2]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmar Cuenta</label>
                                    <input type="text" placeholder="Repite el número" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1C81F2]" />
                                </div>
                            </div>

                            <button 
                                onClick={handleBankRequest}
                                disabled={!newBankAccount}
                                className="w-full bg-[#1C81F2] text-white font-bold py-3 rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Enviar Solicitud a RR.HH.
                            </button>
                         </>
                     )}

                     {bankRequestStep === 'processing' && (
                         <div className="py-10 text-center">
                             <RefreshCw className="animate-spin text-[#1C81F2] mx-auto mb-4" size={48} />
                             <h3 className="font-bold text-lg text-gray-800">Enviando a Nómina...</h3>
                             <p className="text-sm text-gray-500">Generando ticket seguro para RR.HH.</p>
                         </div>
                     )}

                     {bankRequestStep === 'success' && (
                         <div className="py-6 text-center">
                             <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <CheckCircle size={32} />
                             </div>
                             <h3 className="font-bold text-xl text-[#1E293B] mb-2">¡Solicitud Enrutada!</h3>
                             <p className="text-sm text-gray-500 mb-6">
                                 Hemos notificado a tu departamento de RR.HH. Recibirás una alerta cuando el cambio se haya aplicado en el sistema central.
                             </p>
                             <button onClick={() => { setShowBankRequestModal(false); setBankRequestStep('input'); setNewBankAccount(''); }} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">
                                 Entendido
                             </button>
                         </div>
                     )}
                 </div>
            </div>
        )}

        {/* EWA Lite: Withdrawal Request Modal */}
        {showWithdrawModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">Solicitar Adelanto</h3>
                        <button onClick={closeEwaModal} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    </div>

                    {ewaStep === 'select' && (
                        <>
                            <div className="mb-8">
                                <div className="flex justify-between text-sm font-bold text-gray-500 mb-4">
                                    <span>Monto a Solicitar</span>
                                    <span className="text-[#1C81F2]">${withdrawAmount}</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="20" 
                                    max={user.availableEwa} 
                                    step="10" 
                                    value={withdrawAmount}
                                    onChange={(e) => setWithdrawAmount(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C81F2]"
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-2">
                                    <span>Min: $20</span>
                                    <span>Max: ${user.availableEwa.toFixed(0)}</span>
                                </div>
                            </div>

                            {/* EWA LITE TRANSPARENCY BLOCK */}
                            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl mb-6">
                                <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center">
                                    <Info size={16} className="mr-2" /> Resumen de la Solicitud
                                </h4>
                                <ul className="text-xs text-blue-800 space-y-2">
                                    <li className="flex justify-between">
                                        <span>Adelanto Solicitado:</span>
                                        <span className="font-bold">${withdrawAmount.toFixed(2)}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span>Comisión Operativa:</span>
                                        <span>$2.50</span>
                                    </li>
                                    <li className="border-t border-blue-200 pt-2 mt-2 flex justify-between font-bold">
                                        <span>A recibir en cuenta:</span>
                                        <span>${(withdrawAmount - 2.50).toFixed(2)}</span>
                                    </li>
                                </ul>
                                <p className="text-[10px] text-blue-600 mt-3 italic">
                                    * Este monto será descontado de tu pago de nómina del día 15 Oct.
                                </p>
                            </div>

                            <button 
                                onClick={handleEwaRequest}
                                className="w-full bg-[#1C81F2] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
                            >
                                Enviar Solicitud a Empresa <ArrowRight size={18} className="ml-2" />
                            </button>
                        </>
                    )}

                    {ewaStep === 'processing' && (
                        <div className="py-10 text-center">
                            <RefreshCw className="animate-spin text-[#1C81F2] mx-auto mb-4" size={48} />
                            <h3 className="font-bold text-lg text-gray-800">Procesando Solicitud...</h3>
                            <p className="text-sm text-gray-500">Conectando con sistema de nómina empresarial.</p>
                        </div>
                    )}

                    {ewaStep === 'success' && (
                        <div className="py-6 text-center">
                            <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <CheckCircle size={32} />
                            </div>
                            <h3 className="font-bold text-xl text-[#1E293B] mb-2">¡Solicitud Enviada!</h3>
                            <p className="text-sm text-gray-500 mb-6">
                                Tu empresa ha recibido la instrucción. El depósito se reflejará en tu cuenta de nómina en aprox. 30 minutos.
                            </p>
                            <button onClick={closeEwaModal} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">
                                Entendido
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* EWA Settings Modal (V-2 Logic) */}
        {showWalletSettings && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">Configuración EWA</h3>
                        <button onClick={() => setShowWalletSettings(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    </div>

                    <div className="space-y-6 mb-8">
                         {/* Toggle 1: Available Notifications */}
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Notificar disponibilidad</p>
                                <p className="text-xs text-gray-500">Avísame cuando tenga &gt;$50 disponibles.</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setEwaSettings(prev => ({...prev, notifyAvailable: !prev.notifyAvailable}));
                                    logCriticalEvent(MOAT_EVENTS.ALERT_TRIGGERED, { type: 'setting_change', setting: 'notify_available', val: !ewaSettings.notifyAvailable }, { fwiScore: user.fwiScore });
                                }}
                                className={`text-2xl transition-colors ${ewaSettings.notifyAvailable ? 'text-[#3CB7A9]' : 'text-gray-300'}`}
                            >
                                {ewaSettings.notifyAvailable ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                         </div>

                         {/* Toggle 2: Low FWI Brake */}
                         <div className="flex items-center justify-between">
                            <div>
                                <p className="font-bold text-gray-800 text-sm">Alerta de Riesgo (FWI Bajo)</p>
                                <p className="text-xs text-gray-500">Sugerir revisión si mi score baja de 50.</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setEwaSettings(prev => ({...prev, notifyLowFwi: !prev.notifyLowFwi}));
                                    logCriticalEvent(MOAT_EVENTS.ALERT_TRIGGERED, { type: 'setting_change', setting: 'notify_low_fwi', val: !ewaSettings.notifyLowFwi }, { fwiScore: user.fwiScore });
                                }}
                                className={`text-2xl transition-colors ${ewaSettings.notifyLowFwi ? 'text-[#3CB7A9]' : 'text-gray-300'}`}
                            >
                                {ewaSettings.notifyLowFwi ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                            </button>
                         </div>

                         {/* Static Info */}
                         <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                             <div className="flex items-center space-x-3 mb-3">
                                 <Landmark size={20} className="text-gray-400" />
                                 <div>
                                     <p className="font-bold text-xs text-gray-500 uppercase">Cuenta de Depósito</p>
                                     <p className="font-bold text-sm text-[#1E293B]">Chase Bank •••• 4492</p>
                                 </div>
                             </div>
                             <div className="flex items-center space-x-3">
                                 <Calendar size={20} className="text-gray-400" />
                                 <div>
                                     <p className="font-bold text-xs text-gray-500 uppercase">Próximo Corte Nómina</p>
                                     <p className="font-bold text-sm text-[#1E293B]">15 de Octubre</p>
                                 </div>
                             </div>
                         </div>
                    </div>

                    <button onClick={() => setShowWalletSettings(false)} className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800">
                        Guardar Preferencias
                    </button>
                </div>
            </div>
        )}

        {/* Redemption Modal */}
        {showRedeemModal && selectedOffer && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                 <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                     <div className="flex justify-between items-center mb-6">
                         <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">Canjear Beneficio</h3>
                         <button onClick={() => setShowRedeemModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                     </div>

                     {redeemStep === 'confirm' && (
                         <div className="text-center">
                             <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 mb-6">
                                 <h4 className="font-bold text-gray-800 mb-1">{selectedOffer.title}</h4>
                                 <p className="text-sm text-gray-500 mb-4">{selectedOffer.description}</p>
                                 <div className="flex justify-center items-center space-x-2 text-[#3CB7A9]">
                                     <Leaf size={20} />
                                     <span className="font-bold text-2xl">{selectedOffer.costPoints} pts</span>
                                 </div>
                             </div>
                             <p className="text-xs text-gray-500 mb-6">
                                 Saldo actual: <strong>{user.treePoints} pts</strong> <br/>
                                 Saldo después: <strong>{user.treePoints - selectedOffer.costPoints} pts</strong>
                             </p>
                             <button 
                                 onClick={processRedemption}
                                 className="w-full bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors"
                             >
                                 Confirmar Canje
                             </button>
                         </div>
                     )}

                     {redeemStep === 'processing' && (
                         <div className="py-10 text-center">
                             <RefreshCw className="animate-spin text-[#3CB7A9] mx-auto mb-4" size={40} />
                             <p className="font-bold text-gray-700">Procesando canje...</p>
                         </div>
                     )}

                     {redeemStep === 'success' && (
                         <div className="text-center">
                             <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <Gift size={32} />
                             </div>
                             <h3 className="font-bold text-xl text-[#1E293B] mb-2">¡Canje Exitoso!</h3>
                             <p className="text-sm text-gray-500 mb-6">Aquí tienes tu código de activación:</p>
                             
                             <div className="bg-gray-100 p-4 rounded-xl border-dashed border-2 border-gray-300 mb-6 relative group cursor-pointer">
                                 <p className="font-mono text-xl font-bold text-gray-800 tracking-wider">TREEVU-2024-PROMO</p>
                                 <div className="absolute inset-0 bg-black/5 rounded-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                     <Copy size={20} className="text-gray-600" />
                                 </div>
                             </div>

                             <button onClick={() => setShowRedeemModal(false)} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">
                                 Cerrar
                             </button>
                         </div>
                     )}
                 </div>
             </div>
        )}

        {/* Advice Detail Modal (EWA Lite Logic: Risk & Savings) */}
        {activeAdvice && (
             <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                 <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-4">
                         <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">{activeAdvice.title}</h3>
                         <button onClick={() => setActiveAdvice(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                     </div>

                     {adviceStep === 'info' && (
                         <>
                             {activeAdvice.type === 'risk' ? (
                                 // RISK CARD: Debt Prevention Logic
                                 <div>
                                     <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6">
                                         <p className="text-sm text-orange-900 mb-2">{activeAdvice.description}</p>
                                         <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-orange-200">
                                             <span className="text-xs font-bold text-gray-500">Gasto Semanal</span>
                                             <span className="font-bold text-[#1E293B]">$45.00</span>
                                         </div>
                                         <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-orange-200 mt-2">
                                             <span className="text-xs font-bold text-gray-500">Proyección Anual</span>
                                             <span className="font-bold text-red-500">$2,340.00</span>
                                         </div>
                                     </div>
                                     <p className="text-xs text-gray-500 mb-6">
                                         Al aceptar, Treevü reservará $22.50 de tu disponible para ayudarte a no gastarlos.
                                     </p>
                                     <button onClick={handleRiskCommitment} className="w-full bg-orange-500 text-white font-bold py-3 rounded-xl hover:bg-orange-600 shadow-lg">
                                         Comprometerme a Reducir
                                     </button>
                                 </div>
                             ) : (
                                 // OPPORTUNITY CARD: EWA Injection for Goals
                                 <div>
                                     <div className="bg-teal-50 border border-teal-100 p-4 rounded-xl mb-6">
                                         <p className="text-sm text-teal-900 mb-4">{activeAdvice.description}</p>
                                         <div className="flex items-center justify-between text-xs mb-2">
                                             <span className="font-bold text-gray-500">Meta: Vacaciones</span>
                                             <span className="text-teal-700">Faltan $2,100</span>
                                         </div>
                                         <div className="w-full bg-teal-200 h-2 rounded-full mb-1">
                                             <div className="bg-teal-600 h-2 rounded-full w-[16%]"></div>
                                         </div>
                                     </div>

                                     {/* EWA LITE DISCLAIMER */}
                                     <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-xs text-blue-800">
                                         <strong>Importante:</strong>
                                         <ul className="list-disc pl-4 mt-1 space-y-1">
                                             <li>Se solicitará un adelanto de $20 a tu empresa.</li>
                                             <li>La empresa lo depositará en tu cuenta de nómina.</li>
                                             <li>Tú deberás moverlo a tu cuenta de ahorros.</li>
                                         </ul>
                                     </div>

                                     <button onClick={handleSavingsInjection} className="w-full bg-[#3CB7A9] text-white font-bold py-3 rounded-xl hover:bg-teal-600 shadow-lg">
                                         Solicitar Adelanto de $20
                                     </button>
                                 </div>
                             )}
                         </>
                     )}

                     {adviceStep === 'processing' && (
                         <div className="py-10 text-center">
                             <RefreshCw className="animate-spin text-gray-400 mx-auto mb-4" size={40} />
                             <p className="font-bold text-gray-700">Procesando solicitud...</p>
                         </div>
                     )}

                     {adviceStep === 'success' && (
                         <div className="text-center py-4">
                             <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                 <CheckCircle size={32} />
                             </div>
                             <h3 className="font-bold text-xl text-[#1E293B] mb-2">
                                 {activeAdvice.type === 'risk' ? '¡Compromiso Guardado!' : '¡Solicitud Iniciada!'}
                             </h3>
                             <p className="text-sm text-gray-500 mb-6">
                                 {activeAdvice.type === 'risk' 
                                    ? 'Hemos ajustado tu disponible para ayudarte a cumplir tu meta.' 
                                    : 'Recibirás el dinero en tu cuenta de nómina pronto.'}
                             </p>
                             
                             {/* POST-SUCCESS ACTION FOR SAVINGS (Closing the Loop) */}
                             {activeAdvice.type === 'opportunity' && (
                                <button 
                                    onClick={handleRecordContribution}
                                    className="w-full mb-3 bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg animate-pulse"
                                >
                                    Registrar Aporte en Meta Ahora
                                </button>
                             )}

                             <button onClick={() => setActiveAdvice(null)} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">
                                 Cerrar
                             </button>
                         </div>
                     )}
                 </div>
             </div>
        )}

        {/* Onboarding Modal (EWA Lite Education) */}
        {showOnboarding && user.status === 'ACTIVE' && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                    <div className="bg-[#1C81F2] p-8 text-white flex flex-col justify-center md:w-2/5 relative overflow-hidden">
                        <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full"></div>
                        <Leaf size={48} className="mb-6 relative z-10" />
                        <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-2 relative z-10">¡Bienvenido a Treevü!</h2>
                        <p className="text-blue-100 text-sm relative z-10">Tu Salario, a tu Ritmo.</p>
                    </div>
                    <div className="p-8 md:w-3/5 bg-white">
                        <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                            Treevü es una plataforma de bienestar financiero que te da control sobre la liquidez de tu salario <strong>ya devengado</strong>. No somos un banco ni una fintech: somos tu motor de cálculo y tu guía inteligente.
                        </p>
                        
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                            <h4 className="text-sm font-bold text-[#1E293B] mb-2">Modelo EWA Lite:</h4>
                            <ul className="space-y-2">
                                <li className="flex items-start text-xs text-gray-600">
                                    <div className="min-w-[20px]"><CheckCircle size={14} className="text-green-500 mt-0.5" /></div>
                                    <span><strong>Treevü:</strong> Calcula cuánto has ganado y enruta tu solicitud a la EMPRESA.</span>
                                </li>
                                <li className="flex items-start text-xs text-gray-600">
                                    <div className="min-w-[20px]"><CheckCircle size={14} className="text-green-500 mt-0.5" /></div>
                                    <span><strong>Tu EMPRESA:</strong> Es la única que desembolsa el dinero a tu cuenta de nómina.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-orange-100 rounded-lg text-orange-600"><TrendingUp size={18} /></div>
                            <p className="text-xs text-gray-500"><strong>Tu Rol Clave:</strong> Usa tu FWI Score y las alertas de Gasto Hormiga para mejorar tus hábitos.</p>
                        </div>

                        <button onClick={() => setShowOnboarding(false)} className="w-full bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                            Explorar Mi Dashboard
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
  );
};
