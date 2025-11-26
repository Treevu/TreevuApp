import React, { useState, useEffect, useRef } from 'react';
import { 
  Wallet, TrendingUp, Plus, Leaf, Award, CreditCard, Zap, Activity, ArrowRight,
  ShoppingBag, Gift, Shield, TrendingDown, Home, User, Search, Camera, X,
  CheckCircle, Clock, Tag, Receipt, Target, PiggyBank, Calendar, AlertCircle,
  ShieldCheck, BarChart2, Store, GraduationCap, Plane, Smartphone, Shirt,
  Settings, Bell, ChevronRight, Sliders, LineChart as LineChartIcon, Smile,
  Meh, Frown, Menu, Briefcase, Scissors, ArrowUp, RotateCcw, Layout, LogOut,
  Sparkles, ArrowDownLeft, ArrowUpRight, Banknote, Info, CreditCard as CreditCardIcon,
  Lock, Building2, Globe, Coffee, Car, Utensils, Filter, MessageSquare, Send,
  Bot, Landmark, FileText, ToggleLeft, ToggleRight, RefreshCw, Server, Copy,
  Bookmark, UserX, UserCheck, Mail, Save, AlertTriangle, Maximize2, LifeBuoy
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
  status: 'ACTIVE',
  fwiScore: 65,
  treePoints: 1250,
  streakDays: 5,
  level: 3,
  monthlyIncome: 3200,
  availableEwa: 450
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

const STREAK_CALENDAR_DATA = Array.from({ length: 30 }, (_, i) => {
    const day = 30 - i;
    let status: 'active' | 'broken' | 'neutral' = 'neutral';
    if (i < 5) status = 'active';
    else if (i === 6) status = 'broken';
    else if (i > 6 && i < 15) status = 'active';
    else status = 'neutral';
    return { day, status };
}).reverse();

const getCategoryIcon = (category: string) => {
    switch(category.toLowerCase()) {
        case 'alimentos': return Utensils;
        case 'transporte': return Car;
        case 'ocio': return Coffee;
        case 'suscripción': return Zap;
        case 'salud': return Activity;
        default: return ShoppingBag;
    }
};

export const DashboardEmployee: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'market' | 'expense' | 'goals' | 'wallet' | 'assistant' | 'profile'>('home');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [goals, setGoals] = useState<FinancialGoal[]>(INITIAL_GOALS);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<AppAlert[]>(MOCK_NOTIFICATIONS);
  
  // Expense State
  const [expenseStep, setExpenseStep] = useState<'input' | 'processing' | 'result'>('input');
  const [expenseInput, setExpenseInput] = useState('');
  const [lastAnalysis, setLastAnalysis] = useState<ExpenseAnalysis | null>(null);
  const [expenseFilter, setExpenseFilter] = useState<string>('all');

  // Wallet State
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [ewaHistory, setEwaHistory] = useState<EwaRequest[]>(MOCK_EWA_HISTORY);
  const [processingWithdrawal, setProcessingWithdrawal] = useState(false);
  const [ewaStep, setEwaStep] = useState<'select' | 'processing' | 'success'>('select');
  const [ewaSettings, setEwaSettings] = useState({ notifyAvailable: true, notifyLowFwi: true });

  // Market State
  const [marketFilter, setMarketFilter] = useState<'all' | 'corporate' | 'global' | 'saved'>('all');
  const [selectedOffer, setSelectedOffer] = useState<MarketOffer | null>(null);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [redeemStep, setRedeemStep] = useState<'confirm' | 'processing' | 'success'>('confirm');
  const [savedOfferIds, setSavedOfferIds] = useState<Set<string>>(new Set());

  // Assistant State
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([{ id: 'msg_init', text: '¡Hola Alex! Soy Treevü Brain. He analizado tus finanzas de esta semana. ¿En qué puedo ayudarte hoy?', sender: 'ai', timestamp: Date.now() }]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [aiNudge, setAiNudge] = useState<string>("Analizando tu salud financiera...");

  // Modals
  const [activeAdvice, setActiveAdvice] = useState<AiAdviceCard | null>(null);
  const [adviceStep, setAdviceStep] = useState<'info' | 'processing' | 'success'>('info');
  const [activeInfoModal, setActiveInfoModal] = useState<'fwi' | 'streak' | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Profile State
  const [profileForm, setProfileForm] = useState({ email: 'alex.johnson@company.com', phone: '+1 (555) 123-4567', mfaEnabled: true, notifyHighBalance: true, notifyApproval: true, notifyExpense: true });
  const [personalEwaLimit, setPersonalEwaLimit] = useState(80);
  const [showBankRequestModal, setShowBankRequestModal] = useState(false);
  const [bankRequestStep, setBankRequestStep] = useState<'input' | 'processing' | 'success'>('input');
  const [newBankAccount, setNewBankAccount] = useState('');

  useEffect(() => {
    if (user.status === 'ACTIVE') {
      logCriticalEvent(MOAT_EVENTS.DASHBOARD_VIEW, { session_id: 'sess_' + Math.random().toString(36).substr(2, 9) }, { fwiScore: user.fwiScore });
      getFinancialAdvice(user.fwiScore, transactions).then(setAiNudge);
    }
  }, [user.status]);

  useEffect(() => { if (activeTab === 'assistant') chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, activeTab]);

  const handleExpenseSubmit = async () => {
    if (user.status !== 'ACTIVE' || !expenseInput) return;
    setExpenseStep('processing');
    const analysis = await classifyExpense(expenseInput);
    setLastAnalysis(analysis);
    setTransactions(prev => [{ id: Date.now().toString(), merchant: analysis.merchant, amount: analysis.amount, category: analysis.category, date: 'Hoy', isDiscretionary: analysis.isDiscretionary, aiConfidence: analysis.confidence }, ...prev]);
    setUser(prev => ({...prev, treePoints: prev.treePoints + 10}));
    setExpenseStep('result');
  };

  const handleEwaRequest = () => {
      if (user.status !== 'ACTIVE') return;
      setProcessingWithdrawal(true);
      setEwaStep('processing');
      setTimeout(() => {
          setEwaHistory(prev => [{ id: `req_${Date.now()}`, amount: withdrawAmount, date: 'Hoy', status: 'processing_transfer', fee: 2.50, estimatedArrival: '30 min' }, ...prev]);
          setUser(prev => ({...prev, availableEwa: prev.availableEwa - withdrawAmount}));
          setProcessingWithdrawal(false);
          setEwaStep('success');
      }, 2000);
  };

  const handleAdviceClick = (card: AiAdviceCard) => { if (user.status === 'ACTIVE') { setActiveAdvice(card); setAdviceStep('info'); } };
  const handleRiskCommitment = () => { setAdviceStep('processing'); setTimeout(() => { setUser(prev => ({ ...prev, availableEwa: Math.max(0, prev.availableEwa - 22.50) })); setAdviceStep('success'); }, 1500); };
  const handleSavingsInjection = () => { setAdviceStep('processing'); setTimeout(() => { setEwaHistory(prev => [{ id: `req_sav_${Date.now()}`, amount: 20, date: 'Hoy', status: 'processing_transfer', fee: 0.00, estimatedArrival: 'Próximo Corte' }, ...prev]); setUser(prev => ({...prev, availableEwa: prev.availableEwa - 20})); setAdviceStep('success'); }, 1500); };
  const handleRecordContribution = () => {
    setGoals(prev => prev.map(g => g.category === 'Vacation' ? { ...g, currentAmount: g.currentAmount + 20, lastContribution: Date.now() } : g));
    setActiveAdvice(null);
    setActiveTab('goals');
  };
  const handleBankRequest = () => { setBankRequestStep('processing'); setTimeout(() => { setBankRequestStep('success'); }, 2000); };
  const handleSendMessage = async () => {
    if (user.status !== 'ACTIVE' || !currentMessage.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), text: currentMessage, sender: 'user', timestamp: Date.now() };
    setChatHistory(prev => [...prev, userMsg]);
    setCurrentMessage('');
    setIsTyping(true);
    const responseText = await chatWithFinancialAdvisor(userMsg.text, user.fwiScore, user.monthlyIncome, transactions);
    setIsTyping(false);
    setChatHistory(prev => [...prev, { id: (Date.now() + 1).toString(), text: responseText, sender: 'ai', timestamp: Date.now() }]);
  };

  const handleSaveOffer = (offerId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedOfferIds(prev => {
        const next = new Set(prev);
        if (next.has(offerId)) next.delete(offerId);
        else next.add(offerId);
        return next;
    });
  };

  const SidebarItem = ({ id, icon: Icon, label, active, onClick, disabled }: any) => (
    <button onClick={disabled ? undefined : onClick} disabled={disabled} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${disabled ? 'opacity-40 cursor-not-allowed text-gray-400' : active ? 'bg-[#1C81F2] text-white shadow-md' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}>
      <Icon size={20} /> <span className="font-bold text-sm text-left">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F6FAFE] overflow-hidden">
      <div className="fixed top-4 right-20 z-50">
         <select className="bg-white border border-gray-300 text-xs rounded p-1 opacity-50 hover:opacity-100" value={user.status} onChange={(e) => setUser(prev => ({...prev, status: e.target.value as any}))}>
            <option value="ACTIVE">Simular: Activo</option>
            <option value="PENDING">Simular: Pendiente</option>
            <option value="SUSPENDED">Simular: Suspendido</option>
         </select>
      </div>

      <aside className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 h-full p-6 fixed left-0 top-0 z-20">
          <div className="flex items-center space-x-2 mb-8 px-2">
              <div className="bg-[#1C81F2] p-2 rounded-lg"><Leaf className="text-white" size={24} /></div>
              <div><span className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] block">Treevü</span><span className="text-[10px] text-gray-500 font-bold uppercase">Colaborador</span></div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
              
              {/* BIENESTAR SECTION */}
              <div className="mb-6">
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">BIENESTAR</p>
                  <div className="space-y-1">
                    <SidebarItem id="home" icon={Layout} label="Mi Dashboard (FWI)" active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
                    <SidebarItem id="goals" icon={Target} label="Metas y Ahorro" active={activeTab === 'goals'} onClick={() => setActiveTab('goals')} disabled={user.status !== 'ACTIVE'} />
                    <SidebarItem id="assistant" icon={MessageSquare} label="Asistente IA" active={activeTab === 'assistant'} onClick={() => setActiveTab('assistant')} disabled={user.status !== 'ACTIVE'} />
                    <SidebarItem id="market" icon={Store} label="Marketplace" active={activeTab === 'market'} onClick={() => setActiveTab('market')} />
                  </div>
              </div>

              {/* FINANZAS SECTION */}
              <div className="mb-6">
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">FINANZAS</p>
                  <div className="space-y-1">
                    <SidebarItem id="wallet" icon={Banknote} label="Nómina On-Demand" active={activeTab === 'wallet'} onClick={() => setActiveTab('wallet')} disabled={user.status !== 'ACTIVE'} />
                    <SidebarItem id="expense" icon={CreditCard} label="Centro de Operaciones" active={activeTab === 'expense'} onClick={() => setActiveTab('expense')} disabled={user.status !== 'ACTIVE'} />
                  </div>
              </div>

              {/* SISTEMA SECTION */}
              <div>
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">SISTEMA</p>
                  <div className="space-y-1">
                    <SidebarItem id="profile" icon={User} label="Mi Perfil y Cuentas" active={activeTab === 'profile'} onClick={() => setActiveTab('profile')} />
                  </div>
              </div>
          </nav>
      </aside>

      <main className="flex-1 md:ml-64 overflow-y-auto h-full p-6 md:p-10">
          <header className="mb-10 flex justify-between items-center">
              <div>
                  <h1 className="text-3xl font-bold text-[#1E293B] font-['Space_Grotesk']">
                      {activeTab === 'home' && `Hola, ${user.name.split(' ')[0]}`}
                      {activeTab === 'market' && 'Marketplace de Beneficios'}
                      {activeTab === 'expense' && 'Centro de Operaciones'}
                      {activeTab === 'wallet' && 'Nómina On-Demand'}
                      {activeTab === 'goals' && 'Metas Financieras'}
                      {activeTab === 'assistant' && 'Treevü Brain'}
                      {activeTab === 'profile' && 'Mi Perfil'}
                  </h1>
                  {activeTab === 'home' && <p className="text-gray-500 mt-2">{aiNudge}</p>}
              </div>
              <div className="flex items-center space-x-4">
                  <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center space-x-2">
                      <Leaf className="text-green-500" size={16} />
                      <span className="font-bold text-[#1E293B]">{user.treePoints} pts</span>
                  </div>
                   <div className="relative">
                      <button onClick={() => setShowNotifications(!showNotifications)} className="bg-white p-3 rounded-full shadow-sm border border-slate-200 relative hover:bg-slate-50">
                          <Bell size={20} className="text-gray-600" />
                          {notifications.length > 0 && <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></span>}
                      </button>
                      {showNotifications && (
                          <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50">
                              <div className="p-4 border-b bg-gray-50 flex justify-between items-center"><h4 className="font-bold text-sm">Notificaciones</h4><button onClick={() => setNotifications([])} className="text-xs text-blue-600 font-bold">Limpiar</button></div>
                              <div className="max-h-64 overflow-y-auto">
                                  {notifications.length === 0 ? <div className="p-4 text-center text-gray-400 text-xs">No tienes notificaciones</div> : notifications.map(n => (
                                      <div key={n.id} className="p-4 border-b last:border-0 hover:bg-gray-50">
                                          <div className="flex items-start space-x-3">
                                              {n.type === 'achievement' && <Award size={16} className="text-yellow-500 mt-1" />}
                                              {n.type === 'liquidity_warning' && <Banknote size={16} className="text-blue-500 mt-1" />}
                                              {n.type === 'policy_rejection' && <Shield size={16} className="text-red-500 mt-1" />}
                                              <div><p className="text-sm text-gray-800">{n.message}</p></div>
                                          </div>
                                      </div>
                                  ))}
                              </div>
                          </div>
                      )}
                   </div>
                  <div className="w-10 h-10 bg-[#1C81F2] rounded-full flex items-center justify-center text-white font-bold">{user.name.charAt(0)}</div>
              </div>
          </header>

          {/* --- MAIN CONTENT RENDERERS --- */}
          {activeTab === 'home' && (
             <div className="space-y-8 animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {MOCK_ADVICE_CARDS.map(card => (
                       <div key={card.id} className={`p-4 rounded-xl border flex items-start space-x-4 ${card.type === 'risk' ? 'bg-orange-50 border-orange-100' : 'bg-teal-50 border-teal-100'}`}>
                           <div className={`p-2 rounded-lg ${card.type === 'risk' ? 'bg-orange-100' : 'bg-teal-100'}`}>
                                {card.icon === 'coffee' ? <Coffee size={20} className={card.type === 'risk' ? 'text-orange-600' : 'text-teal-600'} /> : <TrendingUp size={20} className={card.type === 'risk' ? 'text-orange-600' : 'text-teal-600'} />}
                           </div>
                           <div className="flex-1">
                               <h4 className="font-bold text-sm text-gray-900">{card.title}</h4>
                               <p className="text-xs text-gray-600 mb-3">{card.description}</p>
                               <div className="flex space-x-3">
                                   <button onClick={() => handleAdviceClick(card)} className={`text-xs font-bold underline ${card.type === 'risk' ? 'text-orange-700' : 'text-teal-700'}`}>{card.actionLabel}</button>
                                   <button className="text-xs text-gray-400 hover:text-gray-600">Ignorar</button>
                               </div>
                           </div>
                       </div>
                   ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div onClick={() => setActiveInfoModal('fwi')} className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:shadow-md transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={16} className="text-gray-400" /></div>
                        <h2 className="text-4xl font-bold text-[#1E293B]">{user.fwiScore}/100</h2>
                        <p className="text-sm text-gray-500 font-medium uppercase mt-2">FWI Score</p>
                        <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full bg-gradient-to-r from-red-400 via-yellow-400 to-green-500" style={{width: `${user.fwiScore}%`}}></div></div>
                    </div>
                    <div onClick={() => setActiveInfoModal('streak')} className="bg-[#1C81F2] text-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={16} className="text-white/50" /></div>
                        <h2 className="text-4xl font-bold">{user.streakDays} Días</h2>
                        <p className="text-sm opacity-80 font-medium uppercase mt-2">Racha Actual</p>
                        <div className="mt-4 flex space-x-1">{[1,2,3,4,5].map(i => <div key={i} className={`h-2 w-8 rounded-full ${i <= user.streakDays ? 'bg-white' : 'bg-white/30'}`}></div>)}</div>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm border flex flex-col justify-center">
                        <div className="flex justify-between items-end">
                            <div><h2 className="text-3xl font-bold text-[#1E293B]">${user.availableEwa.toFixed(2)}</h2><p className="text-sm text-gray-500 font-medium uppercase mt-2">Devengado Disp.</p></div>
                            <button onClick={() => setActiveTab('wallet')} className="bg-gray-50 p-3 rounded-full hover:bg-gray-100"><ArrowRight size={20} className="text-[#1C81F2]" /></button>
                        </div>
                    </div>
                </div>
             </div>
          )}

          {/* Other tab contents remain consistent with provided logic... */}
          {activeTab === 'wallet' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="bg-gradient-to-br from-[#1E293B] to-[#0F172A] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
                      <div className="relative z-10">
                          <div className="flex justify-between items-start mb-8">
                              <div><p className="text-gray-400 text-sm font-medium uppercase tracking-wider">Salario Devengado</p><h2 className="text-5xl font-bold mt-2">${user.availableEwa.toFixed(2)}</h2></div>
                              <div className="flex space-x-3">
                                  <button onClick={() => setShowWalletSettings(true)} className="p-3 bg-white/10 rounded-xl hover:bg-white/20 transition-all"><Settings className="text-white" size={20} /></button>
                                  <button onClick={() => setShowWithdrawModal(true)} className="flex items-center space-x-2 bg-[#1C81F2] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20"><Zap size={20} /><span>Solicitar Adelanto</span></button>
                              </div>
                          </div>
                          <div className="grid grid-cols-3 gap-8 pt-6 border-t border-white/10">
                              <div><p className="text-xs text-gray-400 uppercase mb-1">Días Trabajados</p><p className="font-mono text-xl">12 / 30</p></div>
                              <div><p className="text-xs text-gray-400 uppercase mb-1">Próximo Corte</p><p className="font-mono text-xl">15 Oct</p></div>
                              <div><p className="text-xs text-gray-400 uppercase mb-1">Límite EWA</p><p className="font-mono text-xl text-green-400">50%</p></div>
                          </div>
                      </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg text-[#1E293B]">Historial de Solicitudes</h3></div>
                      <div className="divide-y divide-gray-100">
                          {ewaHistory.map(req => (
                              <div key={req.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                  <div className="flex items-center space-x-4">
                                      <div className={`p-3 rounded-xl ${req.status === 'disbursed' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}><Clock size={20} /></div>
                                      <div><p className="font-bold text-[#1E293B]">Solicitud de Adelanto</p><p className="text-xs text-gray-500">{req.date} • {req.status === 'disbursed' ? 'Enviado a Banco' : 'Procesando'}</p></div>
                                  </div>
                                  <div className="text-right"><p className="font-bold text-[#1E293B] text-lg">-${req.amount.toFixed(2)}</p><p className="text-xs text-gray-400">Tarifa: ${req.fee.toFixed(2)}</p></div>
                              </div>
                          ))}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'expense' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-teal-400"></div>
                      <div className="p-8">
                          <h3 className="text-2xl font-bold text-[#1E293B] mb-2 text-center">Centro de Operaciones</h3>
                          <p className="text-gray-500 text-center mb-8 text-sm">Registra movimientos y recibe feedback de impacto en tiempo real.</p>
                          {expenseStep === 'input' && (
                              <div className="max-w-lg mx-auto">
                                  <div className="relative">
                                      <input type="text" value={expenseInput} onChange={(e) => setExpenseInput(e.target.value)} placeholder="Ej: $45 en Gasolina Shell (Escribe tu gasto aquí)" className="w-full p-4 pr-12 text-lg border-2 border-slate-200 rounded-2xl focus:border-[#1C81F2] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300" onKeyDown={(e) => e.key === 'Enter' && handleExpenseSubmit()} />
                                      <button onClick={handleExpenseSubmit} className="absolute right-3 top-3 p-2 bg-[#1C81F2] text-white rounded-xl hover:bg-blue-600 transition-colors"><ArrowRight size={20} /></button>
                                  </div>
                              </div>
                          )}
                          {/* Processing and Result steps logic maintained... */}
                          {expenseStep === 'processing' && <div className="text-center py-12"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={40} /><p className="font-bold text-gray-600">Analizando impacto presupuestario...</p></div>}
                          {expenseStep === 'result' && lastAnalysis && (
                              <div className="animate-in zoom-in duration-300">
                                  {/* ... Analysis result UI ... */}
                                  <div className="flex items-start space-x-4 mb-6 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                      <div className={`p-3 rounded-full ${lastAnalysis.budgetImpact?.status === 'critical' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                          {lastAnalysis.budgetImpact?.status === 'critical' ? <AlertTriangle size={24} /> : <CheckCircle size={24} />}
                                      </div>
                                      <div className="flex-1">
                                          <h4 className="font-bold text-lg text-[#1E293B]">Gasto Clasificado: {lastAnalysis.category}</h4>
                                          <p className="text-sm text-gray-600 mt-1">Has utilizado el <span className="font-bold">{lastAnalysis.budgetImpact?.percentUsed}%</span> de tu presupuesto semanal para {lastAnalysis.category}.</p>
                                      </div>
                                  </div>
                                  <div className="flex space-x-3">
                                      <button onClick={() => { setExpenseStep('input'); setExpenseInput(''); }} className="flex-1 py-3 border-2 border-slate-200 rounded-xl font-bold text-gray-500 hover:bg-slate-50">Corregir</button>
                                      <button onClick={() => { setExpenseStep('input'); setExpenseInput(''); }} className="flex-1 py-3 bg-[#1C81F2] text-white rounded-xl font-bold hover:bg-blue-600 shadow-lg shadow-blue-200">Confirmar</button>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                      <div className="p-6 border-b border-gray-100 flex justify-between items-center"><h3 className="font-bold text-lg text-[#1E293B]">Historial Operativo</h3></div>
                      <div className="divide-y divide-gray-100">
                          {transactions.filter(t => expenseFilter === 'all' || t.category === expenseFilter).map(txn => {
                              const Icon = getCategoryIcon(txn.category);
                              return (
                                  <div key={txn.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors group">
                                      <div className="flex items-center space-x-4">
                                          <div className="p-3 bg-gray-50 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all"><Icon size={20} className="text-gray-500" /></div>
                                          <div><p className="font-bold text-[#1E293B]">{txn.merchant}</p><p className="text-xs text-gray-500">{txn.category} • {txn.date}</p></div>
                                      </div>
                                      <p className="font-bold text-[#1E293B] text-lg">-${txn.amount.toFixed(2)}</p>
                                  </div>
                              );
                          })}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'market' && (
              <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
                  {/* Market content */}
                  <div className="flex space-x-2 mb-6">
                      <button onClick={() => setMarketFilter('all')} className={`px-4 py-2 rounded-full text-xs font-bold ${marketFilter === 'all' ? 'bg-[#1E293B] text-white' : 'bg-white border text-gray-500'}`}>Todos</button>
                      <button onClick={() => setMarketFilter('corporate')} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 ${marketFilter === 'corporate' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white border text-gray-500'}`}><Building2 size={12} /><span>Corporativos</span></button>
                      <button onClick={() => setMarketFilter('global')} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 ${marketFilter === 'global' ? 'bg-purple-100 text-purple-700 border-purple-200' : 'bg-white border text-gray-500'}`}><Globe size={12} /><span>Globales</span></button>
                      <button onClick={() => setMarketFilter('saved')} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 ${marketFilter === 'saved' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : 'bg-white border text-gray-500'}`}><Bookmark size={12} /><span>Guardados</span></button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {MARKET_OFFERS.filter(o => {
                          if (marketFilter === 'saved') return savedOfferIds.has(o.id);
                          if (marketFilter !== 'all') return o.origin === marketFilter;
                          return true;
                      }).map(offer => (
                          <div key={offer.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all group">
                              <div className={`h-32 ${offer.category === 'Emergency' ? 'bg-orange-100' : 'bg-blue-100'} p-6 relative`}>
                                  <div className={`absolute top-4 left-4 px-2 py-1 rounded text-[10px] font-bold uppercase ${offer.origin === 'corporate' ? 'bg-blue-600 text-white' : 'bg-white text-gray-600'}`}>{offer.origin === 'corporate' ? 'Benefit Corp' : 'Oferta Global'}</div>
                                  <button onClick={(e) => handleSaveOffer(offer.id, e)} className="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-all"><Bookmark size={16} className={savedOfferIds.has(offer.id) ? "fill-yellow-500 text-yellow-500" : "text-gray-600"} /></button>
                                  <Gift className={`absolute bottom-4 right-4 ${offer.category === 'Emergency' ? 'text-orange-500' : 'text-blue-500'} opacity-20`} size={64} />
                              </div>
                              <div className="p-6">
                                  <h3 className="font-bold text-lg text-[#1E293B] mb-1">{offer.title}</h3>
                                  <p className="text-xs text-gray-500 mb-4 h-8">{offer.description}</p>
                                  <div className="flex justify-between items-center">
                                      <div className="flex items-center space-x-1 text-green-600 font-bold"><Leaf size={14} /><span>{offer.costPoints} pts</span></div>
                                      <button onClick={() => { setSelectedOffer(offer); setRedeemStep('confirm'); setShowRedeemModal(true); }} className="bg-[#1E293B] text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-black transition-colors">Canjear</button>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
          )}

          {activeTab === 'goals' && (
              <div className="max-w-4xl mx-auto space-y-6 animate-in slide-in-from-right-4 duration-500">
                  <div className="bg-[#3CB7A9] rounded-2xl p-8 text-white shadow-lg mb-8 flex justify-between items-center">
                      <div><h2 className="text-2xl font-bold">Mis Metas de Ahorro</h2><p className="opacity-90 text-sm mt-1">Estás a $150 de completar tu fondo de emergencia.</p></div>
                      <button className="bg-white/20 p-3 rounded-xl hover:bg-white/30 transition-all"><Plus size={24} /></button>
                  </div>
                  {goals.map(goal => (
                      <div key={goal.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                          <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center space-x-3">
                                  <div className="p-3 bg-teal-50 text-teal-600 rounded-xl"><Target size={20} /></div>
                                  <div><h3 className="font-bold text-[#1E293B]">{goal.name}</h3><p className="text-xs text-gray-500">Meta: ${goal.targetAmount}</p></div>
                              </div>
                              <span className="font-bold text-lg text-[#1E293B]">${goal.currentAmount}</span>
                          </div>
                          <div className="h-3 bg-gray-100 rounded-full overflow-hidden mb-2"><div className="h-full bg-[#3CB7A9] transition-all duration-1000" style={{width: `${(goal.currentAmount / goal.targetAmount) * 100}%`}}></div></div>
                          <div className="flex justify-between text-xs text-gray-400"><span>{((goal.currentAmount / goal.targetAmount) * 100).toFixed(0)}% Completado</span><span>{goal.deadline}</span></div>
                      </div>
                  ))}
              </div>
          )}

          {activeTab === 'assistant' && (
              <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in slide-in-from-right-4 duration-500">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                      {chatHistory.map(msg => (
                          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.sender === 'user' ? 'bg-[#1C81F2] text-white rounded-br-none' : 'bg-gray-100 text-gray-800 rounded-bl-none'}`}>
                                  <p className="text-sm">{msg.text}</p>
                              </div>
                          </div>
                      ))}
                      {isTyping && <div className="flex space-x-1 p-4"><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div><div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div></div>}
                      <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t border-gray-100 bg-gray-50">
                      <div className="flex space-x-2">
                          <input type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Pregunta a Treevü Brain..." className="flex-1 p-3 rounded-xl border border-gray-200 outline-none focus:border-[#1C81F2]" />
                          <button onClick={handleSendMessage} className="p-3 bg-[#1C81F2] text-white rounded-xl hover:bg-blue-600"><Send size={20} /></button>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'profile' && (
              <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                  {/* Profile content logic retained */}
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                      <h3 className="text-xl font-bold text-[#1E293B] mb-6">Preferencias EWA (Auto-Regulación)</h3>
                      <div className="mb-6">
                          <div className="flex justify-between text-sm font-bold mb-2"><span>Límite Personal de Retiro</span><span>{personalEwaLimit}% del Disponible</span></div>
                          <input type="range" min="10" max="100" value={personalEwaLimit} onChange={(e) => setPersonalEwaLimit(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C81F2]" />
                          <p className="text-xs text-gray-500 mt-2">Restringe voluntariamente cuánto puedes retirar, incluso si la empresa permite más.</p>
                      </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                      <div className="flex justify-between items-start mb-6">
                          <div><h3 className="text-xl font-bold text-[#1E293B]">Cuenta de Nómina</h3><p className="text-sm text-gray-500">Cuenta destino para desembolsos de la EMPRESA</p></div>
                          <button onClick={() => setShowBankRequestModal(true)} className="text-[#1C81F2] text-sm font-bold hover:underline">Solicitar Cambio</button>
                      </div>
                      <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200"><Landmark size={24} className="text-gray-400 mr-3" /><div><p className="font-bold text-[#1E293B] font-mono">Chase Bank **** 4492</p><p className="text-xs text-gray-500">Verificado por RR.HH.</p></div><CheckCircle size={16} className="text-green-500 ml-auto" /></div>
                  </div>
              </div>
          )}
      </main>

      {/* --- MODALS (Retained identically from previous logic) --- */}
      {showBankRequestModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                  <div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Solicitud de Cambio de Cuenta</h3><button onClick={() => setShowBankRequestModal(false)}><X size={20} /></button></div>
                  {bankRequestStep === 'input' ? (
                      <>
                          <p className="text-sm text-gray-600 mb-4">Ingresa la nueva cuenta. Treevü validará el formato y enviará la solicitud a RR.HH.</p>
                          <input type="text" placeholder="Número de Cuenta / CLABE" value={newBankAccount} onChange={(e) => setNewBankAccount(e.target.value)} className="w-full p-3 border rounded-xl mb-4" />
                          <div className="flex space-x-3">
                              <button onClick={() => setShowBankRequestModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                              <button onClick={handleBankRequest} className="flex-1 py-3 bg-[#1C81F2] text-white rounded-xl font-bold">Enviar Solicitud</button>
                          </div>
                      </>
                  ) : (
                      <div className="text-center py-8">
                          {bankRequestStep === 'processing' ? <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={40} /> : <CheckCircle className="mx-auto mb-4 text-green-500" size={40} />}
                          <p className="font-bold text-gray-800">{bankRequestStep === 'processing' ? 'Enviando a RR.HH...' : 'Solicitud Enrutada con Éxito'}</p>
                          {bankRequestStep === 'success' && <button onClick={() => setShowBankRequestModal(false)} className="mt-4 text-blue-600 font-bold underline">Cerrar</button>}
                      </div>
                  )}
              </div>
          </div>
      )}

      {showWithdrawModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                  <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  {ewaStep === 'select' && (
                      <>
                          <div className="text-center mb-8">
                              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><Banknote size={32} className="text-[#1C81F2]" /></div>
                              <h3 className="text-2xl font-bold text-[#1E293B]">Solicitar Adelanto</h3>
                              <p className="text-sm text-gray-500 mt-2">Enviaremos una instrucción a tu empresa.</p>
                          </div>
                          <div className="mb-8">
                              <div className="flex justify-between text-sm font-bold mb-4 text-gray-500"><span>Monto a solicitar</span><span>${withdrawAmount}</span></div>
                              <input type="range" min="20" max={user.availableEwa} step="10" value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1C81F2]" />
                              <div className="flex justify-between text-xs text-gray-400 mt-2"><span>$20</span><span>Max: ${user.availableEwa}</span></div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6">
                              <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">Comisión por Servicio</span><span className="font-bold text-[#1E293B]">$2.50</span></div>
                              <div className="flex justify-between text-sm mb-2"><span className="text-gray-600">A depositar por Empresa</span><span className="font-bold text-[#1C81F2]">${(withdrawAmount - 2.50).toFixed(2)}</span></div>
                              <div className="mt-2 pt-2 border-t border-blue-200 text-xs text-blue-800">Se descontará de tu nómina del día 15 Oct.</div>
                          </div>
                          <div className="flex space-x-3">
                              <button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                              <button onClick={handleEwaRequest} className="flex-1 bg-[#1E293B] text-white py-4 rounded-xl font-bold hover:bg-black transition-all shadow-lg">Confirmar Solicitud</button>
                          </div>
                      </>
                  )}
                  {ewaStep === 'processing' && <div className="text-center py-12"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-6" size={48} /><h3 className="text-xl font-bold text-[#1E293B]">Enviando instrucción...</h3></div>}
                  {ewaStep === 'success' && <div className="text-center py-8"><CheckCircle size={40} className="text-green-600 mx-auto mb-6" /><h3 className="text-2xl font-bold mb-2">¡Solicitud Enviada!</h3><button onClick={() => setShowWithdrawModal(false)} className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl">Entendido</button></div>}
              </div>
          </div>
      )}

      {/* Other modals (Redeem, Settings, Advice, Info, Onboarding) are kept as is to maintain functionality */}
      {showWalletSettings && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                  <div className="flex justify-between mb-6"><h3 className="font-bold text-lg">Configuración de Nómina</h3><button onClick={() => setShowWalletSettings(false)}><X size={20} /></button></div>
                  <div className="space-y-4 mb-8">
                      <div className="flex items-center justify-between"><span className="text-sm font-medium">Notificar cuando haya disponible</span><button onClick={() => setEwaSettings(s => ({...s, notifyAvailable: !s.notifyAvailable}))} className={`w-11 h-6 rounded-full relative transition-colors ${ewaSettings.notifyAvailable ? 'bg-green-500' : 'bg-gray-300'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${ewaSettings.notifyAvailable ? 'translate-x-5' : ''}`} /></button></div>
                      <div className="flex items-center justify-between"><span className="text-sm font-medium">Alerta de FWI Bajo (Freno)</span><button onClick={() => setEwaSettings(s => ({...s, notifyLowFwi: !s.notifyLowFwi}))} className={`w-11 h-6 rounded-full relative transition-colors ${ewaSettings.notifyLowFwi ? 'bg-green-500' : 'bg-gray-300'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${ewaSettings.notifyLowFwi ? 'translate-x-5' : ''}`} /></button></div>
                  </div>
                  <div className="flex space-x-3">
                       <button onClick={() => setShowWalletSettings(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                       <button onClick={() => setShowWalletSettings(false)} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Guardar Preferencias</button>
                  </div>
              </div>
          </div>
      )}

      {showRedeemModal && selectedOffer && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center">
                  {redeemStep === 'confirm' ? (
                      <>
                          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><Gift size={32} className="text-[#1C81F2]" /></div>
                          <h3 className="text-xl font-bold text-[#1E293B] mb-2">Canjear Beneficio</h3>
                          <p className="text-gray-500 mb-6 text-sm">Estás a punto de canjear <strong>{selectedOffer.title}</strong> por <span className="text-[#1E293B] font-bold">{selectedOffer.costPoints} TreePoints</span>.</p>
                          <div className="flex space-x-3">
                              <button onClick={() => setShowRedeemModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                              <button onClick={() => { setRedeemStep('processing'); setTimeout(() => { setUser(prev => ({...prev, treePoints: prev.treePoints - selectedOffer.costPoints})); setRedeemStep('success'); }, 1500); }} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Confirmar</button>
                          </div>
                      </>
                  ) : redeemStep === 'processing' ? (
                      <div className="py-8"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={32} /><p>Procesando canje...</p></div>
                  ) : (
                      <div className="py-4">
                          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                          <h3 className="font-bold text-lg mb-2">¡Canje Exitoso!</h3>
                          <div className="bg-gray-100 p-3 rounded-lg font-mono text-sm font-bold mb-6 tracking-widest">TREEVU-2024-PROMO</div>
                          <button onClick={() => setShowRedeemModal(false)} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Cerrar</button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {activeAdvice && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
                  {adviceStep === 'info' && (
                      <>
                          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${activeAdvice.type === 'risk' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>
                              {activeAdvice.icon === 'coffee' ? <Coffee size={32} /> : <TrendingUp size={32} />}
                          </div>
                          <h3 className="text-xl font-bold text-[#1E293B] mb-2 text-center">{activeAdvice.title}</h3>
                          <p className="text-gray-500 mb-6 text-center text-sm">{activeAdvice.description}</p>
                          <div className="flex space-x-3">
                              <button onClick={() => setActiveAdvice(null)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                              <button onClick={activeAdvice.type === 'risk' ? handleRiskCommitment : handleSavingsInjection} className={`flex-1 text-white py-3 rounded-xl font-bold ${activeAdvice.type === 'risk' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-teal-500 hover:bg-teal-600'}`}>
                                  {activeAdvice.type === 'risk' ? 'Comprometerme' : 'Sí, Apartar $20'}
                              </button>
                          </div>
                      </>
                  )}
                  {adviceStep === 'processing' && <div className="py-8 text-center"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={32} /><p>Procesando solicitud...</p></div>}
                  {adviceStep === 'success' && (
                      <div className="py-4 text-center">
                          <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                          <h3 className="font-bold text-lg mb-2">{activeAdvice.type === 'risk' ? '¡Compromiso Guardado!' : '¡Aporte Iniciado!'}</h3>
                          <p className="text-xs text-gray-500 mb-6">{activeAdvice.type === 'risk' ? 'Te ayudaremos a mantener tu racha.' : 'La empresa depositará los $20 en tu cuenta. Recuerda moverlos a tu ahorro.'}</p>
                          {activeAdvice.type === 'opportunity' && <button onClick={handleRecordContribution} className="w-full bg-[#3CB7A9] text-white py-3 rounded-xl font-bold mb-2">Registrar Aporte en Meta</button>}
                          <button onClick={() => setActiveAdvice(null)} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold">Cerrar</button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {activeInfoModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                  <button onClick={() => setActiveInfoModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                  {activeInfoModal === 'fwi' ? (
                      <div>
                          <h3 className="text-xl font-bold text-[#1E293B] mb-1">Tu FWI Score: {user.fwiScore}/100</h3>
                          <p className="text-sm text-green-600 font-bold mb-6">Nivel: Saludable</p>
                          <div className="h-48 mb-6 bg-slate-50 rounded-xl p-4">
                              <ResponsiveContainer width="100%" height="100%">
                                  <LineChart data={FWI_HISTORY_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis domain={[0, 100]} hide /><Tooltip /><Line type="monotone" dataKey="score" stroke="#1C81F2" strokeWidth={3} dot={{r: 4}} /></LineChart>
                              </ResponsiveContainer>
                          </div>
                          <h4 className="font-bold text-sm text-gray-800 mb-3">¿Cómo se calcula?</h4>
                          <div className="space-y-3 mb-6">
                              <div className="flex justify-between text-sm"><span className="text-gray-600">Uso del Devengado (30%)</span><span className="font-bold text-green-500">Excelente</span></div>
                              <div className="flex justify-between text-sm"><span className="text-gray-600">Cumplimiento Ahorro (25%)</span><span className="font-bold text-yellow-500">Regular</span></div>
                              <div className="flex justify-between text-sm"><span className="text-gray-600">Frecuencia Retiro (20%)</span><span className="font-bold text-green-500">Baja</span></div>
                          </div>
                          <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 mb-4"><strong>Recomendación:</strong> Para llegar a 75+, intenta cumplir tu próximo compromiso de Gasto Hormiga.</div>
                          <p className="text-[10px] text-gray-400 text-center">El FWI Score es una guía interna de hábitos. NO es un puntaje de crédito externo.</p>
                      </div>
                  ) : (
                      <div>
                          <div className="text-center mb-6">
                              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Award size={32} className="text-[#1C81F2]" /></div>
                              <h3 className="text-2xl font-bold text-[#1E293B]">¡5 Días de Racha!</h3>
                              <p className="text-sm text-gray-500">Mantienes hábitos positivos consistentemente.</p>
                          </div>
                          <div className="grid grid-cols-7 gap-2 mb-6 p-4 bg-slate-50 rounded-xl">
                              {STREAK_CALENDAR_DATA.slice(0, 14).map(d => (
                                  <div key={d.day} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${d.status === 'active' ? 'bg-[#1C81F2] text-white' : d.status === 'broken' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-400'}`}>{d.day}</div>
                              ))}
                          </div>
                          <div className="space-y-4 mb-6">
                              <div className="flex items-start space-x-3">
                                  <ShieldCheck className="text-green-500 mt-1" size={16} />
                                  <div><p className="text-sm font-bold text-gray-800">Regla de Oro</p><p className="text-xs text-gray-500">La racha sigue si no retiras EWA innecesariamente o si cumples tus compromisos de ahorro.</p></div>
                              </div>
                              <div className="flex items-start space-x-3">
                                  <Gift className="text-purple-500 mt-1" size={16} />
                                  <div><p className="text-sm font-bold text-gray-800">Próximo Hito (10 Días)</p><p className="text-xs text-gray-500">Desbloqueas 50% OFF en la tarifa de tu próximo adelanto.</p></div>
                              </div>
                          </div>
                          <button onClick={() => setActiveInfoModal(null)} className="w-full bg-[#1E293B] text-white py-3 rounded-xl font-bold">¡A por ello!</button>
                      </div>
                  )}
              </div>
          </div>
      )}

      {showOnboarding && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-[#1C81F2] p-8 text-center text-white">
                      <Leaf size={48} className="mx-auto mb-4" />
                      <h2 className="text-2xl font-bold mb-2">¡Bienvenido a Treevü!</h2>
                      <p className="opacity-90">Tu Salario, a tu Ritmo. Sin Complicaciones.</p>
                  </div>
                  <div className="p-8">
                      <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                          Treevü es una plataforma de bienestar financiero que te da control sobre la liquidez de tu salario ya devengado. No somos un banco ni una fintech: somos tu motor de cálculo y guía inteligente.
                      </p>
                      <div className="space-y-4 mb-8">
                          <div className="flex items-start space-x-3">
                              <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Clock size={20} /></div>
                              <div><h4 className="font-bold text-sm text-[#1E293B]">Tú Ganas, Treevü Calcula</h4><p className="text-xs text-gray-500">Calculamos cuánto salario ya trabajaste y está disponible.</p></div>
                          </div>
                          <div className="flex items-start space-x-3">
                              <div className="bg-green-100 p-2 rounded-lg text-green-600"><Building2 size={20} /></div>
                              <div><h4 className="font-bold text-sm text-[#1E293B]">Tu Empresa Paga</h4><p className="text-xs text-gray-500">Treevü no toca el dinero. Enviamos la instrucción y tu empresa te deposita.</p></div>
                          </div>
                          <div className="flex items-start space-x-3">
                              <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FileText size={20} /></div>
                              <div><h4 className="font-bold text-sm text-[#1E293B]">Descuento Transparente</h4><p className="text-xs text-gray-500">Lo que adelantes se descuenta automáticamente en tu próxima nómina.</p></div>
                          </div>
                      </div>
                      <button onClick={() => setShowOnboarding(false)} className="w-full bg-[#1E293B] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all">Explorar Mi Dashboard</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};