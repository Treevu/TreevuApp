import React, { useState, useEffect } from 'react';
import { 
  Wallet, TrendingUp, Plus, Leaf, Award, Zap, Activity, ArrowRight,
  ShoppingBag, Gift, Shield, TrendingDown, Home, User, Search, Camera, X,
  CheckCircle, Clock, Tag, Receipt, Target, PiggyBank, Calendar, AlertCircle,
  ShieldCheck, BarChart2, Store, GraduationCap, Plane, Smartphone, Shirt,
  Settings, Bell, ChevronRight, Sliders, LineChart as LineChartIcon, Smile,
  Meh, Frown, Menu, Briefcase, Scissors, ArrowUp, ArrowDown, RotateCcw, Layout, LogOut,
  Sparkles, ArrowDownLeft, ArrowUpRight, Banknote, Info, CreditCard as CreditCardIcon,
  Lock, Building2, Globe, Coffee, Car, Utensils, Filter, MessageSquare, Send,
  Bot, Landmark, FileText, ToggleLeft, ToggleRight, RefreshCw, Server, Copy,
  Bookmark, UserX, UserCheck, Mail, Save, AlertTriangle, Maximize2, LifeBuoy, CheckSquare,
  HelpCircle, XCircle, Image, LogOut as LogOutIcon, HelpCircle as HelpIcon
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, CartesianGrid, LineChart, Line } from 'recharts';
import { UserProfile, Transaction, MarketOffer, FinancialGoal, ExpenseAnalysis, ChatMessage, AiAdviceCard, EwaRequest, AppAlert } from '../types';
import { classifyExpense, getFinancialAdvice, getOfferPitch, chatWithFinancialAdvisor } from '../services/geminiService';
import { logCriticalEvent, MOAT_EVENTS } from '../services/dataMoat';

// --- MOCK DATA ---

const MOCK_USER: UserProfile = {
  name: "Carlos Mendez",
  role: "Senior Designer",
  status: "ACTIVE",
  fwiScore: 78,
  treePoints: 1250,
  streakDays: 5,
  level: 3,
  monthlyIncome: 3200,
  availableEwa: 450
};

const FWI_HISTORY_DATA = [
  { month: 'Ene', score: 65 },
  { month: 'Feb', score: 68 },
  { month: 'Mar', score: 72 },
  { month: 'Abr', score: 70 },
  { month: 'May', score: 75 },
  { month: 'Jun', score: 78 },
];

const STREAK_CALENDAR_DATA = Array.from({ length: 14 }, (_, i) => ({
  day: i + 1,
  status: i < 5 ? 'active' : i === 5 ? 'today' : 'future'
}));

const RECENT_TRANSACTIONS: Transaction[] = [
  { id: 't1', merchant: 'Uber Eats', amount: 24.50, category: 'Food', date: 'Hoy, 2:30 PM', isDiscretionary: true, aiConfidence: 0.98 },
  { id: 't2', merchant: 'Netflix', amount: 12.00, category: 'Entertainment', date: 'Ayer', isDiscretionary: true, aiConfidence: 0.99 },
  { id: 't3', merchant: 'Farmacia San Pablo', amount: 45.00, category: 'Health', date: 'Ayer', isDiscretionary: false, aiConfidence: 0.95 },
];

const GOALS: FinancialGoal[] = [
  { id: 'g1', name: 'Vacaciones Cancún', targetAmount: 2000, currentAmount: 850, deadline: '2024-12-01', category: 'Vacation', priority: true, imageUrl: 'https://images.unsplash.com/photo-1544550581-5f7ceaf7f992?auto=format&fit=crop&w=400&q=80' },
  { id: 'g2', name: 'Fondo Emergencia', targetAmount: 5000, currentAmount: 1200, deadline: '2025-01-01', category: 'Emergency', priority: true }
];

const OFFERS: MarketOffer[] = [
  { id: 'o1', title: '2x1 Cinepolis', description: 'Válido lunes y jueves', costPoints: 200, category: 'Lifestyle', targetFwiSegment: 'all', origin: 'corporate' },
  { id: 'o2', title: '15% Desc. Walmart', description: 'En canasta básica', costPoints: 500, category: 'Financial', targetFwiSegment: 'mid', origin: 'global' }
];

const ADVICE_CARDS: AiAdviceCard[] = [
  { id: 'a1', type: 'risk', title: 'Riesgo de Gasto Hormiga', description: 'Has gastado $45 en café esta semana. ¿Quieres ponerte un límite?', actionLabel: 'Sí, limitar', icon: 'coffee' },
  { id: 'a2', type: 'opportunity', title: 'Acelera tu Meta', description: 'Si ahorras $20 hoy, llegarás a tu meta de vacaciones 3 días antes.', actionLabel: 'Ahorrar $20', icon: 'trend' }
];

export const DashboardEmployee: React.FC = () => {
  const [user, setUser] = useState<UserProfile>(MOCK_USER);
  const [activeTab, setActiveTab] = useState('home');
  
  // Modals & Flows State
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<FinancialGoal | null>(null);
  const [activeInfoModal, setActiveInfoModal] = useState<'fwi' | 'streak' | null>(null);
  
  // Capture Flow
  const [showCaptureModal, setShowCaptureModal] = useState(false);
  const [captureMode, setCaptureMode] = useState<'manual' | 'ocr'>('manual');
  const [expenseInput, setExpenseInput] = useState('');
  const [ocrProcessing, setOcrProcessing] = useState(false);

  // Bank Request
  const [showBankRequestModal, setShowBankRequestModal] = useState(false);
  const [bankRequestStep, setBankRequestStep] = useState<'input' | 'processing' | 'success'>('input');
  const [newBankAccount, setNewBankAccount] = useState('');

  // EWA / Withdraw
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [ewaStep, setEwaStep] = useState<'select' | 'processing' | 'success'>('select');
  const [withdrawAmount, setWithdrawAmount] = useState(50);
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Settings
  const [showWalletSettings, setShowWalletSettings] = useState(false);
  const [ewaSettings, setEwaSettings] = useState({ notifyAvailable: true, notifyLowFwi: true });

  // Redeem
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<MarketOffer | null>(null);
  const [redeemStep, setRedeemStep] = useState<'confirm' | 'processing' | 'success'>('confirm');

  // Advice
  const [activeAdvice, setActiveAdvice] = useState<AiAdviceCard | null>(null);
  const [adviceStep, setAdviceStep] = useState<'info' | 'processing' | 'success'>('info');

  // Onboarding
  const [showOnboarding, setShowOnboarding] = useState(true);

  // --- HANDLERS ---

  const handleExpenseSubmit = async () => {
    if (!expenseInput) return;
    setShowCaptureModal(false);
    setExpenseInput('');
    // Mock processing
    const analysis = await classifyExpense(expenseInput);
    console.log("Expense added:", analysis);
    logCriticalEvent(MOAT_EVENTS.EXPENSE_DECLARED, { merchant: analysis.merchant, amount: analysis.amount }, { fwiScore: user.fwiScore });
  };

  const handleOcrScan = () => {
    setOcrProcessing(true);
    setTimeout(() => {
      setOcrProcessing(false);
      setShowCaptureModal(false);
      // Mock OCR result logic here
    }, 2000);
  };

  const handleBankRequest = () => {
    setBankRequestStep('processing');
    setTimeout(() => setBankRequestStep('success'), 1500);
  };

  const handleEwaRequest = () => {
    if (!termsAccepted) return;
    setEwaStep('processing');
    logCriticalEvent(MOAT_EVENTS.EWA_INITIATED, { amount: withdrawAmount }, { fwiScore: user.fwiScore });
    setTimeout(() => {
        setEwaStep('success');
        setUser(prev => ({ ...prev, availableEwa: prev.availableEwa - withdrawAmount }));
    }, 2000);
  };

  const handleRiskCommitment = () => {
    setAdviceStep('processing');
    logCriticalEvent(MOAT_EVENTS.NUDGE_COMMITMENT, { type: 'risk_mitigation' }, { fwiScore: user.fwiScore });
    setTimeout(() => setAdviceStep('success'), 1000);
  };

  const handleSavingsInjection = () => {
    setAdviceStep('processing');
    logCriticalEvent(MOAT_EVENTS.GOAL_CONTRIBUTION, { amount: 20, origin: 'nudge' }, { fwiScore: user.fwiScore });
    setTimeout(() => setAdviceStep('success'), 1000);
  };
  
  const handleRecordContribution = () => {
      // Logic to record contribution would go here
      setActiveAdvice(null);
  }

  // Helper for Sidebar items
  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all mb-1 ${
        activeTab === id ? 'bg-[#1C81F2] text-white shadow-lg shadow-blue-200' : 'text-gray-500 hover:bg-slate-100'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F6FAFE]">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 p-6">
        <div className="flex items-center space-x-2 mb-8 text-[#1C81F2]">
          <Leaf size={28} />
          <span className="text-2xl font-bold font-['Space_Grotesk'] tracking-tight">Treevü</span>
        </div>
        
        <nav className="flex-1 space-y-2">
          <SidebarItem id="home" icon={Home} label="Inicio" />
          <SidebarItem id="wallet" icon={Wallet} label="Mi Nómina" />
          <SidebarItem id="goals" icon={Target} label="Metas" />
          <SidebarItem id="market" icon={Store} label="Beneficios" />
          <SidebarItem id="advisor" icon={Bot} label="Asistente AI" />
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors">
            <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold">CM</div>
            <div>
              <p className="text-sm font-bold text-[#1E293B]">{user.name}</p>
              <p className="text-xs text-gray-500">Nivel {user.level}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-100 px-6 py-4 flex justify-between items-center">
            <div className="md:hidden text-[#1C81F2]"><Menu /></div>
            <h1 className="text-xl font-bold text-[#1E293B]">
                {activeTab === 'home' && 'Resumen Diario'}
                {activeTab === 'wallet' && 'Mi Billetera'}
                {activeTab === 'goals' && 'Mis Metas'}
                {activeTab === 'market' && 'Marketplace'}
                {activeTab === 'advisor' && 'Treevü Brain'}
            </h1>
            <div className="flex items-center space-x-4">
                <button className="p-2 text-gray-400 hover:text-[#1C81F2] transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
            </div>
        </header>

        <main className="p-6 max-w-5xl mx-auto">
            {/* RENDER CONTENT BASED ON TAB - SIMPLIFIED FOR DEMO */}
            {activeTab === 'home' && (
                <div className="space-y-6">
                    {/* FWI & Streak */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div onClick={() => setActiveInfoModal('fwi')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-gray-500 text-sm font-bold uppercase tracking-wide">FWI Score</p>
                                    <h3 className="text-4xl font-bold text-[#1E293B] mt-1">{user.fwiScore}</h3>
                                </div>
                                <div className="p-3 bg-green-50 rounded-xl text-green-600">
                                    <Activity size={24} />
                                </div>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                                <div className="bg-[#1C81F2] h-2 rounded-full" style={{width: `${user.fwiScore}%`}}></div>
                            </div>
                            <p className="text-xs text-gray-500">Tu salud financiera es estable.</p>
                        </div>

                        <div onClick={() => setActiveInfoModal('streak')} className="bg-gradient-to-br from-[#1C81F2] to-[#1666C1] p-6 rounded-2xl shadow-lg text-white cursor-pointer hover:translate-y-[-2px] transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-blue-100 text-sm font-bold uppercase tracking-wide">Racha Actual</p>
                                    <h3 className="text-4xl font-bold mt-1 flex items-center">
                                        {user.streakDays} <span className="text-lg ml-1 opacity-80">días</span>
                                    </h3>
                                </div>
                                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                                    <Zap size={24} className="text-yellow-300 fill-current" />
                                </div>
                            </div>
                            <p className="text-sm text-blue-100">Sin pedir adelantos. ¡Sigue así!</p>
                        </div>
                    </div>

                    {/* Advice Cards */}
                    <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
                        {ADVICE_CARDS.map(card => (
                            <div key={card.id} className="min-w-[280px] bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex flex-col">
                                <div className="flex items-center space-x-2 mb-2">
                                    <Sparkles size={16} className={card.type === 'risk' ? 'text-orange-500' : 'text-teal-500'} />
                                    <span className="text-xs font-bold uppercase text-gray-400">Treevü Brain</span>
                                </div>
                                <h4 className="font-bold text-[#1E293B] mb-1">{card.title}</h4>
                                <p className="text-xs text-gray-500 mb-4 flex-1">{card.description}</p>
                                <button 
                                    onClick={() => setActiveAdvice(card)}
                                    className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                                        card.type === 'risk' 
                                        ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' 
                                        : 'bg-teal-50 text-teal-600 hover:bg-teal-100'
                                    }`}
                                >
                                    {card.actionLabel}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Recent Transactions */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <h3 className="font-bold text-[#1E293B]">Actividad Reciente</h3>
                            <button onClick={() => setShowCaptureModal(true)} className="p-2 bg-[#1C81F2] text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {RECENT_TRANSACTIONS.map(tx => (
                                <div key={tx.id} onClick={() => setSelectedTransaction(tx)} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex justify-between items-center group">
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-full ${tx.isDiscretionary ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                                            {tx.category === 'Food' && <Utensils size={16} />}
                                            {tx.category === 'Entertainment' && <Globe size={16} />}
                                            {tx.category === 'Health' && <Activity size={16} />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-[#1E293B] group-hover:text-[#1C81F2] transition-colors">{tx.merchant}</p>
                                            <p className="text-xs text-gray-400">{tx.date}</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[#1E293B] text-sm">-${tx.amount.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'wallet' && (
                <div className="space-y-6">
                    <div className="bg-gradient-to-r from-[#1E293B] to-[#334155] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-slate-300 text-sm font-medium">Disponible para retiro (EWA)</p>
                                    <h2 className="text-4xl font-bold mt-1 tracking-tight">${user.availableEwa.toFixed(2)}</h2>
                                </div>
                                <button onClick={() => setShowWalletSettings(true)} className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors backdrop-blur-sm">
                                    <Settings size={20} />
                                </button>
                            </div>
                            <div className="flex space-x-3">
                                <button onClick={() => setShowWithdrawModal(true)} className="flex-1 bg-[#1C81F2] hover:bg-blue-600 text-white py-3 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center">
                                    <Banknote size={18} className="mr-2" />
                                    Dispersar Ahora
                                </button>
                                <button onClick={() => setShowBankRequestModal(true)} className="px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold transition-all backdrop-blur-sm">
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'goals' && (
                <div className="grid gap-4">
                    {GOALS.map(goal => (
                        <div key={goal.id} onClick={() => setSelectedGoal(goal)} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-all">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-bold text-[#1E293B]">{goal.name}</h4>
                                <span className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">${goal.currentAmount} / ${goal.targetAmount}</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2">
                                <div className="bg-[#3CB7A9] h-2 rounded-full" style={{width: `${(goal.currentAmount / goal.targetAmount) * 100}%`}}></div>
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-400 font-bold hover:border-[#1C81F2] hover:text-[#1C81F2] transition-colors flex items-center justify-center">
                        <Plus size={20} className="mr-2" /> Crear Nueva Meta
                    </button>
                </div>
            )}

            {activeTab === 'market' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {OFFERS.map(offer => (
                        <div key={offer.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all group">
                            <div className="h-32 bg-gray-200 relative">
                                <img src={`https://source.unsplash.com/random/400x300?${offer.category}`} alt="Offer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    {offer.costPoints} Pts
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-[#1E293B] mb-1">{offer.title}</h4>
                                <p className="text-sm text-gray-500 mb-4">{offer.description}</p>
                                <button onClick={() => { setSelectedOffer(offer); setShowRedeemModal(true); }} className="w-full py-2 bg-[#1E293B] text-white rounded-lg font-bold text-sm hover:bg-black transition-colors">
                                    Canjear
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
      </div>

      {/* --- MODALS SECTION --- */}

      {/* 1. TRANSACTION DRILL DOWN */}
      {selectedTransaction && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"><div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5 relative"><div className="p-6 bg-slate-50 border-b border-gray-100 flex justify-between items-start"><div><p className="text-xs text-gray-500 font-bold uppercase mb-1">Detalle del Gasto</p><h3 className="text-xl font-bold text-[#1E293B]">{selectedTransaction.merchant}</h3><p className="text-sm text-gray-600">{selectedTransaction.date} • {selectedTransaction.category}</p></div><button onClick={() => setSelectedTransaction(null)} className="text-gray-400 hover:text-gray-600 absolute top-4 right-4"><X size={24}/></button></div><div className="p-6"><div className="flex justify-between items-center mb-6"><span className="text-3xl font-bold text-[#1E293B] numeric-tabular">-${selectedTransaction.amount.toFixed(2)}</span>{selectedTransaction.isDiscretionary ? <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold border border-orange-200">Discrecional</span> : <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold border border-green-200">Esencial</span>}</div><div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4"><div className="flex items-center space-x-2 mb-2"><Bot size={16} className="text-blue-600" /><span className="text-xs font-bold text-blue-800 uppercase">Análisis Treevü Brain</span></div><p className="text-sm text-blue-900 leading-relaxed">{selectedTransaction.isDiscretionary ? "Este gasto fue clasificado como 'Deseo' porque corresponde a entretenimiento o servicios no vitales. Reducir esta categoría es la vía más rápida para subir tu FWI." : "Clasificado como 'Necesidad'. Este gasto es esencial para tu vida diaria (Salud, Transporte o Alimentos)."}</p><div className="mt-3 pt-3 border-t border-blue-200 text-[10px] text-blue-600 font-mono">AI Confidence: {((selectedTransaction.aiConfidence || 0.95) * 100).toFixed(0)}%</div></div><button onClick={() => setSelectedTransaction(null)} className="w-full bg-white border-2 border-slate-200 text-gray-600 font-bold py-3 rounded-xl hover:bg-gray-50 active:scale-95 transition-all">Cerrar Detalle</button></div></div></div>)}

      {/* 2. GOAL DRILL DOWN */}
      {selectedGoal && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"><div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden relative"><div className="absolute top-0 left-0 w-full h-32">{selectedGoal.imageUrl && <img src={selectedGoal.imageUrl} className="w-full h-full object-cover opacity-90" />}<div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div></div><div className="relative pt-20 px-6 pb-6"><div className="flex justify-between items-end mb-4 text-white"><div><p className="text-xs font-bold opacity-80 uppercase mb-1">{selectedGoal.category}</p><h3 className="text-2xl font-bold leading-none">{selectedGoal.name}</h3></div><button onClick={() => setSelectedGoal(null)} className="bg-white/20 p-2 rounded-full hover:bg-white/30 backdrop-blur-sm absolute top-4 right-4"><X size={16} /></button></div><div className="bg-white rounded-xl shadow-lg p-6 mb-6"><div className="flex justify-between text-sm text-gray-500 mb-1"><span>Progreso Actual</span><span className="font-bold text-[#1E293B]">{((selectedGoal.currentAmount / selectedGoal.targetAmount) * 100).toFixed(0)}%</span></div><div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4"><div className="h-full bg-[#3CB7A9] transition-all duration-1000" style={{width: `${(selectedGoal.currentAmount / selectedGoal.targetAmount) * 100}%`}}><div className="absolute top-0 right-0 bottom-0 w-1 bg-white/30"></div></div></div><div className="flex justify-between items-center text-[#1E293B]"><div className="text-center"><p className="text-xs text-gray-400 uppercase">Ahorrado</p><p className="text-xl font-bold numeric-tabular">${selectedGoal.currentAmount}</p></div><div className="h-8 w-px bg-gray-200"></div><div className="text-center"><p className="text-xs text-gray-400 uppercase">Meta</p><p className="text-xl font-bold numeric-tabular">${selectedGoal.targetAmount}</p></div></div></div><div className="space-y-3"><div className="p-3 bg-green-50 rounded-xl border border-green-100 flex items-start space-x-3"><TrendingUp className="text-green-600 flex-shrink-0 mt-1" size={18} /><div><p className="text-sm font-bold text-green-800">Consejo de Aceleración</p><p className="text-xs text-green-700">Si depositas $25 esta semana, alcanzarás tu meta 12 días antes de lo previsto.</p></div></div><button onClick={() => { setSelectedGoal(null); }} className="w-full bg-[#1E293B] text-white py-3 rounded-xl font-bold shadow-lg hover:bg-black active:scale-95 transition-all">Hacer Aporte Extra</button></div></div></div></div>)}

      {/* 3. INFO MODALS */}
      {activeInfoModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in zoom-in-95 duration-200"><div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative"><button onClick={() => setActiveInfoModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1"><X size={24} /></button>{activeInfoModal === 'fwi' ? (<div><h3 className="text-xl font-bold text-[#1E293B] mb-1">Tu FWI Score: {user.fwiScore}/100</h3><p className="text-sm text-green-600 font-bold mb-6">Nivel: Saludable</p><div className="h-48 mb-6 bg-slate-50 rounded-xl p-4"><ResponsiveContainer width="100%" height="100%"><LineChart data={FWI_HISTORY_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis domain={[0, 100]} hide /><Tooltip /><Line type="monotone" dataKey="score" stroke="#1C81F2" strokeWidth={3} dot={{r: 4}} /></LineChart></ResponsiveContainer></div><div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-900 leading-relaxed border border-blue-100"><div className="flex items-center mb-2 font-bold text-blue-700"><Info size={16} className="mr-2"/> ¿Qué es esto?</div>El <strong>Financial Wellness Index (FWI)</strong> mide tu capacidad de absorber choques económicos. No es un score crediticio; es un indicador de salud calculado en tiempo real basado en tu flujo de caja libre y patrones de gasto.</div></div>) : (<div><div className="text-center mb-6"><div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Award size={32} className="text-[#1C81F2]" /></div><h3 className="text-2xl font-bold text-[#1E293B]">¡5 Días de Racha!</h3><p className="text-sm text-gray-500">Independencia Financiera en acción.</p></div><div className="grid grid-cols-7 gap-2 mb-6 p-4 bg-slate-50 rounded-xl">{STREAK_CALENDAR_DATA.slice(0, 14).map(d => (<div key={d.day} className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold ${d.status === 'active' ? 'bg-[#1C81F2] text-white' : d.status === 'broken' ? 'bg-red-200 text-red-800' : 'bg-gray-200 text-gray-400'}`}>{d.day}</div>))}</div><div className="bg-gray-50 p-4 rounded-xl text-sm text-gray-700 leading-relaxed border border-gray-200"><div className="flex items-center mb-2 font-bold text-gray-900"><ShieldCheck size={16} className="mr-2"/> ¿Cómo funciona?</div>Tu racha aumenta cada día que <strong>NO solicitas adelantos de salario para gastos no esenciales</strong>. Mantener una racha alta desbloquea tarifas reducidas y demuestra resiliencia financiera ante gastos imprevistos.</div></div>)}</div></div>)}

      {/* 4. CAPTURE MODAL */}
      {showCaptureModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden"><button onClick={() => setShowCaptureModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button><div className="text-center mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Registrar Movimiento</h3><p className="text-sm text-gray-500">Elige cómo quieres ingresar la información</p></div><div className="flex p-1 bg-gray-100 rounded-xl mb-6"><button onClick={() => setCaptureMode('manual')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${captureMode === 'manual' ? 'bg-white text-[#1C81F2] shadow-sm' : 'text-gray-500'}`}>Manual</button><button onClick={() => setCaptureMode('ocr')} className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center ${captureMode === 'ocr' ? 'bg-white text-[#1C81F2] shadow-sm' : 'text-gray-500'}`}><Camera size={14} className="mr-1" />Escanear (OCR)</button></div>{captureMode === 'manual' ? (<div className="animate-in fade-in slide-in-from-left-4 duration-300"><p className="text-xs text-gray-500 font-bold uppercase mb-2 ml-1">Descripción del Gasto</p><div className="relative mb-6"><input type="text" value={expenseInput} onChange={(e) => setExpenseInput(e.target.value)} placeholder="Ej: $45 en Gasolina Shell" className="w-full p-4 pr-12 text-lg border-2 border-slate-200 rounded-xl focus:border-[#1C81F2] focus:ring-4 focus:ring-blue-50 outline-none transition-all placeholder:text-gray-300" onKeyDown={(e) => e.key === 'Enter' && handleExpenseSubmit()} autoFocus /><button onClick={handleExpenseSubmit} className="absolute right-3 top-3 p-2 bg-[#1C81F2] text-white rounded-lg hover:bg-blue-600 transition-colors active:scale-95"><ArrowRight size={20} /></button></div><div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 flex items-start"><Bot size={16} className="mr-2 flex-shrink-0 mt-0.5" /><p><strong>Treevü Brain:</strong> Escribe naturalmente. Yo detectaré el monto, la categoría y si es un gasto hormiga.</p></div></div>) : (<div className="animate-in fade-in slide-in-from-right-4 duration-300">{ocrProcessing ? (<div className="h-64 bg-gray-900 rounded-xl flex flex-col items-center justify-center relative overflow-hidden"><div className="absolute inset-0 bg-scan-line animate-scan opacity-20"></div><RefreshCw className="text-[#1C81F2] animate-spin mb-4" size={48} /><p className="text-white font-bold">Procesando Recibo...</p><p className="text-gray-400 text-xs mt-2">Extrayendo texto y montos</p></div>) : (<div className="h-64 bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center mb-6 relative group cursor-pointer hover:border-blue-400 transition-colors" onClick={handleOcrScan}><Camera size={48} className="text-gray-400 group-hover:text-blue-500 transition-colors mb-2" /><p className="text-sm font-bold text-gray-500 group-hover:text-blue-600">Tocar para Escanear</p><p className="text-xs text-gray-400 mt-1">Sube una foto de tu recibo</p></div>)}{!ocrProcessing && (<button onClick={handleOcrScan} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center"><Camera size={20} className="mr-2" />Activar Cámara</button>)}</div>)}</div></div>)}

      {/* 5. BANK REQUEST MODAL */}
      {showBankRequestModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative"><button onClick={() => setShowBankRequestModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button><div className="flex justify-between mb-4"><h3 className="font-bold text-lg">Solicitud de Cambio de Cuenta</h3></div>{bankRequestStep === 'input' ? (<><p className="text-sm text-gray-600 mb-4">Ingresa la nueva cuenta. Treevü validará el formato y enviará la solicitud a RR.HH.</p><input type="text" placeholder="Número de Cuenta / CLABE" value={newBankAccount} onChange={(e) => setNewBankAccount(e.target.value)} className="w-full p-3 border rounded-xl mb-4" /><div className="flex space-x-3"><button onClick={() => setShowBankRequestModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button><button onClick={handleBankRequest} className="flex-1 py-3 bg-[#1C81F2] text-white rounded-xl font-bold">Enviar Solicitud</button></div></>) : (<div className="text-center py-8">{bankRequestStep === 'processing' ? <RefreshCw className="animate-spin mx-auto mb-4 text-blue-500" size={40} /> : <CheckCircle className="mx-auto mb-4 text-green-500" size={40} />}<p className="font-bold text-gray-800">{bankRequestStep === 'processing' ? 'Enviando a RR.HH...' : 'Solicitud Enrutada con Éxito'}</p>{bankRequestStep === 'success' && <button onClick={() => setShowBankRequestModal(false)} className="mt-4 text-blue-600 font-bold underline">Cerrar</button>}</div>)}</div></div>)}

      {/* 6. WITHDRAW MODAL */}
      {showWithdrawModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative overflow-hidden"><button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>{ewaStep === 'select' && (<><div className="text-center mb-6"><div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><Banknote size={32} className="text-[#1C81F2]" /></div><h3 className="text-2xl font-bold text-[#1E293B]">Solicitar Dispersión</h3><p className="text-sm text-gray-500 mt-2">Generar instrucción de pago a tu empresa.</p></div><div className="mb-6"><div className="flex justify-between text-sm font-bold mb-4 text-gray-500"><span>Monto a solicitar</span><span>${withdrawAmount}</span></div><input type="range" min="20" max={user.availableEwa} step="10" value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} className="w-full h-3 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#1C81F2]" /><div className="flex justify-between text-xs text-gray-400 mt-2"><span>$20</span><span>Max: ${user.availableEwa.toFixed(2)}</span></div></div><div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6"><h4 className="font-bold text-xs text-blue-800 uppercase mb-3 flex items-center"><Receipt size={12} className="mr-1"/> Proyección de Próxima Nómina</h4><div className="space-y-2 text-sm"><div className="flex justify-between text-gray-600"><span>Salario Neto Estimado</span><span>${(user.monthlyIncome * 0.8).toFixed(2)}</span></div><div className="flex justify-between text-red-500 font-medium"><span>(-) Dispersión Solicitada</span><span>-${withdrawAmount.toFixed(2)}</span></div><div className="flex justify-between text-orange-500 font-medium"><span>(-) Tarifa Servicio</span><span>-$2.50</span></div><div className="border-t border-blue-200 pt-2 flex justify-between font-bold text-[#1E293B] text-base"><span>A Recibir (Aprox)</span><span>${((user.monthlyIncome * 0.8) - withdrawAmount - 2.50).toFixed(2)}</span></div></div></div><div className="flex items-start space-x-3 mb-6 bg-gray-50 p-3 rounded-lg border border-gray-100"><button onClick={() => setTermsAccepted(!termsAccepted)} className={`mt-0.5 w-5 h-5 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-[#1C81F2] border-[#1C81F2] text-white' : 'bg-white border-gray-300 text-transparent'}`}><CheckSquare size={14} /></button><p className="text-[10px] text-gray-500 leading-tight">Entiendo que este monto <strong>no es un crédito</strong>, sino un acceso anticipado a mi salario ya trabajado. Autorizo irrevocablemente a mi empleador a descontar el monto total (${(withdrawAmount + 2.50).toFixed(2)}) de mi próxima nómina.</p></div><div className="flex space-x-3"><button onClick={() => setShowWithdrawModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button><button onClick={handleEwaRequest} disabled={!termsAccepted} className={`flex-1 text-white py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 ${termsAccepted ? 'bg-[#1E293B] hover:bg-black' : 'bg-gray-300 cursor-not-allowed'}`}>Confirmar</button></div></>)}{ewaStep === 'processing' && <div className="text-center py-12"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-6" size={48} /><h3 className="text-xl font-bold text-[#1E293B]">Enviando instrucción...</h3></div>}{ewaStep === 'success' && <div className="text-center py-8"><CheckCircle size={40} className="text-green-600 mx-auto mb-6" /><h3 className="text-2xl font-bold mb-2">¡Instrucción Enviada!</h3><button onClick={() => setShowWithdrawModal(false)} className="w-full bg-gray-100 text-gray-800 font-bold py-3 rounded-xl">Entendido</button></div>}</div></div>)}

      {/* 7. WALLET SETTINGS MODAL */}
      {showWalletSettings && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative"><button onClick={() => setShowWalletSettings(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button><div className="flex justify-between mb-6"><h3 className="font-bold text-lg">Configuración de Nómina</h3></div><div className="space-y-4 mb-8"><div className="flex items-center justify-between"><span className="text-sm font-medium">Notificar cuando haya disponible</span><button onClick={() => setEwaSettings(s => ({...s, notifyAvailable: !s.notifyAvailable}))} className={`w-11 h-6 rounded-full relative transition-colors ${ewaSettings.notifyAvailable ? 'bg-green-50' : 'bg-gray-300'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${ewaSettings.notifyAvailable ? 'translate-x-5' : ''}`} /></button></div><div className="flex items-center justify-between"><span className="text-sm font-medium">Alerta de FWI Bajo (Freno)</span><button onClick={() => setEwaSettings(s => ({...s, notifyLowFwi: !s.notifyLowFwi}))} className={`w-11 h-6 rounded-full relative transition-colors ${ewaSettings.notifyLowFwi ? 'bg-green-50' : 'bg-gray-300'}`}><span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${ewaSettings.notifyLowFwi ? 'translate-x-5' : ''}`} /></button></div></div><div className="flex space-x-3"><button onClick={() => setShowWalletSettings(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button><button onClick={() => setShowWalletSettings(false)} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Guardar Preferencias</button></div></div></div>)}

      {/* 8. REDEEM MODAL - ADDED 'X' */}
      {showRedeemModal && selectedOffer && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center relative"><button onClick={() => setShowRedeemModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>{redeemStep === 'confirm' ? (<><div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4"><Gift size={32} className="text-[#1C81F2]" /></div><h3 className="text-xl font-bold text-[#1E293B] mb-2">Canjear Beneficio</h3><p className="text-gray-500 mb-6 text-sm">Estás a punto de canjear <strong>{selectedOffer.title}</strong> por <span className="text-[#1E293B] font-bold">{selectedOffer.costPoints} TreePoints</span>.</p><div className="flex space-x-3"><button onClick={() => setShowRedeemModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button><button onClick={() => { setRedeemStep('processing'); setTimeout(() => { setUser(prev => ({...prev, treePoints: prev.treePoints - selectedOffer.costPoints})); setRedeemStep('success'); }, 1500); }} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold active:scale-95">Confirmar</button></div></>) : redeemStep === 'processing' ? (<div className="py-8"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={32} /><p>Procesando canje...</p></div>) : (<div className="py-4"><CheckCircle className="mx-auto text-green-500 mb-4" size={48} /><h3 className="font-bold text-lg mb-2">¡Canje Exitoso!</h3><div className="bg-gray-100 p-3 rounded-lg font-mono text-sm font-bold mb-6 tracking-widest">TREEVU-2024-PROMO</div><button onClick={() => setShowRedeemModal(false)} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Cerrar</button></div>)}</div></div>)}

      {/* 9. ADVICE MODAL - ADDED 'X' */}
      {activeAdvice && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6 relative"><button onClick={() => setActiveAdvice(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>{adviceStep === 'info' && (<><div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${activeAdvice.type === 'risk' ? 'bg-orange-100 text-orange-600' : 'bg-teal-100 text-teal-600'}`}>{activeAdvice.icon === 'coffee' ? <Coffee size={32} /> : <TrendingUp size={32} />}</div><h3 className="text-xl font-bold text-[#1E293B] mb-2 text-center">{activeAdvice.title}</h3><p className="text-gray-500 mb-6 text-center text-sm">{activeAdvice.description}</p><div className="flex space-x-3"><button onClick={() => setActiveAdvice(null)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button><button onClick={activeAdvice.type === 'risk' ? handleRiskCommitment : handleSavingsInjection} className={`flex-1 text-white py-3 rounded-xl font-bold active:scale-95 transition-transform ${activeAdvice.type === 'risk' ? 'bg-orange-500 hover:bg-orange-600' : 'bg-teal-500 hover:bg-teal-600'}`}>{activeAdvice.type === 'risk' ? 'Comprometerme' : 'Sí, Apartar $20'}</button></div></>)}{adviceStep === 'processing' && <div className="py-8 text-center"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={32} /><p>Procesando solicitud...</p></div>}{adviceStep === 'success' && (<div className="py-4 text-center"><CheckCircle className="mx-auto text-green-500 mb-4" size={48} /><h3 className="font-bold text-lg mb-2">{activeAdvice.type === 'risk' ? '¡Compromiso Guardado!' : '¡Aporte Iniciado!'}</h3><p className="text-xs text-gray-500 mb-6">{activeAdvice.type === 'risk' ? 'Tu límite EWA se ha ajustado (autolimitación) para proteger tu liquidez futura y evitar deuda innecesaria.' : 'Instrucción enviada. La empresa depositará los $20 en tu cuenta. Recuerda moverlos a tu ahorro.'}</p>{activeAdvice.type === 'opportunity' && <button onClick={handleRecordContribution} className="w-full bg-[#3CB7A9] text-white py-3 rounded-xl font-bold mb-2 active:scale-95">Registrar Aporte en Meta</button>}<button onClick={() => setActiveAdvice(null)} className="w-full bg-gray-100 text-gray-800 py-3 rounded-xl font-bold">Cerrar</button></div>)}</div></div>)}

      {/* 10. ONBOARDING MODAL - ADDED 'X' */}
      {showOnboarding && (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl overflow-hidden scrollbar-hide relative"><button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"><X size={24} /></button><div className="bg-[#1C81F2] p-8 text-center text-white sticky top-0 z-10"><Leaf size={48} className="mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">Treevü Proactive</h2><p className="opacity-90 font-mono text-sm">Tu Copiloto Financiero</p></div><div className="p-8"><p className="text-gray-600 mb-6 text-sm leading-relaxed text-justify">Estás accediendo a tu módulo de <strong>Acceso a Salario Devengado (EWA)</strong>. Esto <strong>no es un préstamo</strong> ni un crédito; es liquidez que ya has generado con tu trabajo diario. Treevü calcula tu <strong>Score FWI</strong> basándose en tus patrones de gasto y te permite acceder a una parte de tu salario acumulado para cubrir emergencias o aprovechar oportunidades, sin endeudarte.</p><div className="space-y-4 mb-8"><div className="flex items-start space-x-3"><div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Clock size={20} /></div><div><h4 className="font-bold text-sm text-[#1E293B]">Cálculo de Devengado</h4><p className="text-xs text-gray-500">Algoritmo diario basado en días trabajados vs. nómina.</p></div></div><div className="flex items-start space-x-3"><div className="bg-green-100 p-2 rounded-lg text-green-600"><Building2 size={20} /></div><div><h4 className="font-bold text-sm text-[#1E293B]">Sin Intermediación Financiera</h4><p className="text-xs text-gray-500">Treevü solo procesa la instrucción de pago a tu empresa.</p></div></div><div className="flex items-start space-x-3"><div className="bg-purple-100 p-2 rounded-lg text-purple-600"><FileText size={20} /></div><div><h4 className="font-bold text-sm text-[#1E293B]">Conciliación Automática</h4><p className="text-xs text-gray-500">El anticipo se ajusta automáticamente en tu próximo recibo.</p></div></div></div><button onClick={() => setShowOnboarding(false)} className="w-full bg-[#1E293B] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all active:scale-95">Explorar Mi Dashboard</button></div></div></div>)}
    </div>
  );
};
