import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { ShoppingBag, TrendingUp, Users, DollarSign, CreditCard, Plus, Edit3, Trash2, Target, LayoutDashboard, Tag, Settings, LogOut, Zap, Clock, Briefcase, CheckCircle, ExternalLink, Globe, Building, Download, Landmark, Webhook, UserPlus, ArrowUpRight, X, Activity, Award, PieChart as PieChartIcon, Filter, Calendar, FileText, List, Search, ChevronRight, Info, ArrowRight, RefreshCw, ShoppingCart, Mail, Shield, Store, Sparkles, Bot, Eye, QrCode } from 'lucide-react';
import { MerchantTPStats } from '../types';
import { generateSmartOffer } from '../services/geminiService';

const COLORS = { primary: '#1C81F2', accent: '#3CB7A9', bg: '#F6FAFE', text: '#1E293B', warning: '#F59E0B', danger: '#EF4444' };
const SALES_DATA = [{ day: 'Lun', sales: 1200 }, { day: 'Mar', sales: 1900 }, { day: 'Mié', sales: 1500 }, { day: 'Jue', sales: 2400 }, { day: 'Vie', sales: 3200 }, { day: 'Sáb', sales: 3800 }, { day: 'Dom', sales: 3100 }];
const FWI_SEGMENT_DATA = [{ name: 'FWI Alto (Crecimiento)', value: 45, color: '#3CB7A9' }, { name: 'FWI Medio (Estable)', value: 30, color: '#1C81F2' }, { name: 'FWI Bajo (Necesidades)', value: 25, color: '#F59E0B' }];
const ACTIVE_OFFERS = [{ id: 1, title: 'Canasta Orgánica', discount: '$20 OFF', conversions: 412, status: 'Activa', type: 'evergreen', segment: 'Todos', expiry: 'Indefinido' }, { id: 2, title: 'Vitaminas Premium', discount: '2x1', conversions: 128, status: 'Activa', type: 'flash', segment: 'FWI Alto', expiry: '24h Restantes' }];

// Drill Down Data
const REVENUE_BREAKDOWN = [
    { name: 'Flash Deals', value: 7400, color: '#F59E0B' },
    { name: 'Evergreen', value: 5200, color: '#1C81F2' },
    { name: 'Beneficios Corp', value: 2300, color: '#3CB7A9' },
    { name: 'Otros', value: 2200, color: '#94A3B8' }
];
const CONVERSION_TREND = [
    { date: '01 Oct', rate: 3.2 }, { date: '05 Oct', rate: 3.5 }, { date: '10 Oct', rate: 4.1 }, { date: '15 Oct', rate: 4.8 }
];
const TREEPOINTS_ROI_DATA = [
    { category: 'Salud', redeemed: 5000, sales: 15000 },
    { category: 'Alimentos', redeemed: 3000, sales: 8000 },
    { category: 'Ocio', redeemed: 1500, sales: 3500 }
];

// TreePoints Drill Down Data (New)
const TP_BALANCE_HISTORY = [
    { month: 'Jul', balance: 5000, purchased: 10000, distributed: 5000 },
    { month: 'Ago', balance: 8000, purchased: 5000, distributed: 2000 },
    { month: 'Sep', balance: 6000, purchased: 0, distributed: 2000 },
    { month: 'Oct', balance: 15000, purchased: 15000, distributed: 6000 }
];

const TP_DISTRIBUTION_TYPE = [
    { name: 'Incentivos Venta', value: 65, color: '#1C81F2' },
    { name: 'Fidelización', value: 25, color: '#3CB7A9' },
    { name: 'Compensación', value: 10, color: '#F59E0B' }
];

const TP_ROI_CAMPAIGNS = [
    { name: 'Flash Octubre', cost: 120, sales: 450 },
    { name: 'Evergreen Q3', cost: 300, sales: 1100 },
    { name: 'Promo New User', cost: 80, sales: 150 }
];

// Initial Data for State
const INITIAL_PAYOUT_HISTORY = [
    { id: 'TX-9926', date: '30 Dic 2023', amount: 5100.00, type: 'Liquidación Q4 Final', status: 'Pagado' }, 
    { id: 'TX-9925', date: '15 Dic 2023', amount: 4850.25, type: 'Comisiones Ventas', status: 'Pagado' }
];
const INITIAL_COMMISSION_DETAILS = [
    { id: 'C-123', type: 'Flash Deal - Electro', rate: '5%', amount: 355.00, status: 'Pendiente' },
    { id: 'C-124', type: 'Marketplace - Salud', rate: '$1.50 CPA', amount: 129.00, status: 'Pendiente' },
    { id: 'C-125', type: 'Evergreen - Retail', rate: '5%', amount: 210.00, status: 'En Revisión' }
];

const TRACE_DATA = {
  sales_commissions: [
    { id: 'SC-001', date: '12 Oct', desc: 'Comisión - Campaña Flash', amount: 1250.00 },
    { id: 'SC-002', date: '13 Oct', desc: 'Comisión - Evergreen Ventas', amount: 850.00 },
    { id: 'SC-003', date: '14 Oct', desc: 'Comisión - Referidos', amount: 1700.00 }
  ],
  treepoints_refund: [
    { id: 'TR-001', date: '10 Oct', desc: 'Reembolso Canje - ID 8821', amount: 150.00 },
    { id: 'TR-002', date: '12 Oct', desc: 'Reembolso Canje - ID 8825', amount: 300.00 }
  ]
};

// Points Management Data
const MERCHANT_TP_STATS: MerchantTPStats = {
    balance: 15000,
    totalPurchased: 50000,
    totalDistributed: 35000,
    attributedSales: 9200.50,
    roi: 320 // 320%
};

const PURCHASE_PACKAGES = [
    { id: 1, points: 5000, price: 50, label: 'Starter' },
    { id: 2, points: 20000, price: 180, label: 'Growth' },
    { id: 3, points: 50000, price: 400, label: 'Enterprise' }
];

export const DashboardMerchant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'payments' | 'points' | 'settings'>('overview');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [activeDetailModal, setActiveDetailModal] = useState<'conversion' | 'segment' | 'points' | 'revenue' | 'commissions' | null>(null);
  const [activeTpDetailModal, setActiveTpDetailModal] = useState<'balance' | 'sales' | 'distributed' | null>(null);
  const [activeTraceModal, setActiveTraceModal] = useState<'sales_commissions' | 'treepoints_refund' | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'amount' | 'summary' | 'processing' | 'success'>('amount');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [showOnboarding, setShowOnboarding] = useState(true);
  
  // Data State
  const [payoutHistory, setPayoutHistory] = useState(INITIAL_PAYOUT_HISTORY);
  const [commissionDetails, setCommissionDetails] = useState(INITIAL_COMMISSION_DETAILS);

  // Points Management State
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Offer Creation State
  const [newOfferType, setNewOfferType] = useState<'evergreen' | 'flash'>('evergreen');

  // Smart Offer State
  const [isGeneratingSmartOffer, setIsGeneratingSmartOffer] = useState(false);
  const [smartOffer, setSmartOffer] = useState<{suggestedTitle: string, suggestedDiscount: string, rationale: string} | null>(null);
  
  // Redemption State
  const [redemptionCode, setRedemptionCode] = useState('');
  const [redemptionStatus, setRedemptionStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  // Settings State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [showKybModal, setShowKybModal] = useState(false);
  const [configForm, setConfigForm] = useState({
      bankName: 'Chase Bank',
      accountNumber: '**** 8821',
      routingNumber: '021000021',
      payoutFrequency: 'Semanal (Viernes)',
      notificationEmail: 'finance@wholefoods.com'
  });

  const handleWithdrawRequest = () => { 
      setWithdrawStep('processing'); 
      setTimeout(() => {
          setWithdrawStep('success');
          // Add to payout history
          const newPayout = { 
              id: `TX-${Math.floor(Math.random() * 10000)}`, 
              date: 'Hoy', 
              amount: withdrawAmount, 
              type: 'Corte Solicitado (Settlement)', 
              status: 'Procesando' 
          };
          setPayoutHistory(prev => [newPayout, ...prev]);
      }, 2000); 
  };

  const handleDisburse = (id: string) => {
      const commission = commissionDetails.find(c => c.id === id);
      if (!commission) return;

      // 1. Update commission status
      setCommissionDetails(prev => prev.map(c => c.id === id ? { ...c, status: 'Pagado' } : c));

      // 2. Add to payout history
      const newPayout = { 
          id: `TX-${Math.floor(Math.random() * 10000)}`, 
          date: 'Hoy', 
          amount: commission.amount, 
          type: `Liquidación ${commission.type}`, 
          status: 'Pagado' 
      };
      setPayoutHistory(prev => [newPayout, ...prev]);
  };

  const handleGenerateSmartOffer = async () => {
      setIsGeneratingSmartOffer(true);
      const topOffers = ACTIVE_OFFERS.map(o => ({ title: o.title, conversions: o.conversions }));
      const result = await generateSmartOffer(topOffers);
      setSmartOffer(result);
      setIsGeneratingSmartOffer(false);
  };
  
  const handleValidateRedemption = () => {
      if(redemptionCode.toUpperCase() === 'TREEVU-2024-PROMO') {
          setRedemptionStatus('valid');
      } else {
          setRedemptionStatus('invalid');
      }
  };

  const SidebarItem = ({ id, icon: Icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#1C81F2] text-white shadow-md' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}>
      <Icon size={20} /> <span className="font-bold text-sm text-left">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F6FAFE] overflow-hidden">
      <aside className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 h-full p-6 fixed left-0 top-0 z-20">
          <div className="flex items-center space-x-2 mb-10 px-2">
              <div className="bg-[#1C81F2] p-2 rounded-lg"><ShoppingBag className="text-white" size={24} /></div>
              <div><span className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] block">Whole Foods</span><span className="text-[10px] text-gray-500 font-bold uppercase">Portal de Aliados</span></div>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2">
              <div className="mb-6">
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">VISIBILIDAD</p>
                  <div className="space-y-1">
                    <SidebarItem id="overview" icon={LayoutDashboard} label="Dashboard de Ingresos" active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} />
                  </div>
              </div>
              <div className="mb-6">
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">OPERACIONES</p>
                  <div className="space-y-1">
                    <SidebarItem id="offers" icon={Tag} label="Gestión de Ofertas" active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} />
                    <SidebarItem id="payments" icon={DollarSign} label="Pagos & Conciliación" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
                    <SidebarItem id="points" icon={Award} label="Gestión de Puntos" active={activeTab === 'points'} onClick={() => setActiveTab('points')} />
                  </div>
              </div>
              <div>
                  <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">SISTEMA</p>
                  <div className="space-y-1">
                    <SidebarItem id="settings" icon={Settings} label="Configuración de Cobro" active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} />
                  </div>
              </div>
          </nav>
      </aside>

      <main className="flex-1 md:ml-64 overflow-y-auto h-full p-6 md:p-10">
          <header className="mb-10 border-b border-gray-200 pb-6 flex justify-between items-end">
              <div><p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">PORTAL DE ALIADOS</p><h1 className="text-4xl font-bold text-[#1E293B] font-['Space_Grotesk']">Whole Foods Market</h1><p className="text-gray-500 mt-2">ID Comercio: WF-8821 • Socio Nivel Oro</p></div>
              {activeTab === 'overview' && <div className="text-right"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Próximo Corte</p><h2 className="text-3xl font-bold text-[#1C81F2]">$4,250.00</h2><span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded mt-1 inline-block">Listo para Conciliar</span></div>}
          </header>

          {activeTab === 'overview' && (
              <div className="animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                      <div className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:border-[#1C81F2] transition-all group" onClick={() => setActiveDetailModal('revenue')}>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Ingresos Atribuidos</p>
                          <div className="flex items-center space-x-2"><h2 className="text-3xl font-bold text-[#1E293B]">$17,100</h2><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">+12%</span></div>
                          <p className="text-[10px] text-gray-400 mt-2 group-hover:text-blue-500 flex items-center">Ver desglose <ArrowUpRight size={10} className="ml-1"/></p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:border-[#3CB7A9] transition-all group" onClick={() => setActiveDetailModal('conversion')}>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Tasa de Conversión</p>
                          <div className="flex items-center space-x-2"><h2 className="text-3xl font-bold text-[#1E293B]">4.8%</h2><span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">+0.5%</span></div>
                          <p className="text-[10px] text-gray-400 mt-2 group-hover:text-teal-500 flex items-center">Ver tendencia <ArrowUpRight size={10} className="ml-1"/></p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:border-[#1C81F2] transition-all group" onClick={() => setActiveDetailModal('points')}>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">TreePoints Canjeados</p>
                          <div className="flex items-center space-x-2"><h2 className="text-3xl font-bold text-[#1E293B]">842k</h2><span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded">Alto Vol.</span></div>
                          <p className="text-[10px] text-gray-400 mt-2 group-hover:text-blue-500 flex items-center">Análisis de ROI <ArrowUpRight size={10} className="ml-1"/></p>
                      </div>
                      <div className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:border-orange-400 transition-all group" onClick={() => setActiveDetailModal('commissions')}>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Por Conciliar</p>
                          <h2 className="text-3xl font-bold text-[#1E293B]">$855.00</h2>
                          <p className="text-[10px] text-gray-400 mt-2 flex items-center group-hover:text-orange-500">Ver detalle pendiente <ArrowUpRight size={10} className="ml-1"/></p>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                          <div className="flex justify-between items-center mb-6">
                              <div><h3 className="text-lg font-bold text-[#1E293B]">Analítica de Rendimiento</h3><p className="text-sm text-gray-500">Volumen de Ventas vs. Tráfico</p></div>
                              <div className="flex space-x-2"><button className="bg-gray-100 text-xs font-bold px-3 py-1 rounded">7D</button><button className="bg-white border text-xs font-bold px-3 py-1 rounded text-gray-500">30D</button></div>
                          </div>
                          <div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={SALES_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="day" tick={{fontSize: 10}} /><YAxis tick={{fontSize: 10}} /><Tooltip /><Area type="monotone" dataKey="sales" stroke={COLORS.primary} strokeWidth={2} fill={COLORS.primary} fillOpacity={0.1} /></AreaChart></ResponsiveContainer></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border">
                          <div className="flex justify-between items-start mb-2">
                              <div><h3 className="text-lg font-bold text-[#1E293B]">Perfil del Cliente</h3><p className="text-sm text-gray-500">Ventas por Segmento de Bienestar (FWI)</p></div>
                              <ArrowUpRight size={14} className="text-gray-400" />
                          </div>
                          <div className="h-60 relative">
                              <ResponsiveContainer width="100%" height="100%">
                                  <PieChart>
                                      <Pie data={FWI_SEGMENT_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5}>
                                          {FWI_SEGMENT_DATA.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />))}
                                      </Pie>
                                  </PieChart>
                              </ResponsiveContainer>
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                  <span className="text-3xl font-bold text-[#1E293B]">45%</span>
                                  <span className="text-[10px] font-bold uppercase text-gray-400">Puntaje Alto</span>
                              </div>
                          </div>
                          <div className="space-y-3 mt-4">
                              {FWI_SEGMENT_DATA.map((seg, i) => (
                                  <div key={i} className="flex justify-between items-center text-sm">
                                      <div className="flex items-center space-x-2"><div className="w-3 h-3 rounded-full" style={{backgroundColor: seg.color}}></div><span className="text-gray-600">{seg.name}</span></div>
                                      <span className="font-bold text-[#1E293B]">{seg.value}%</span>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'offers' && (
              <div className="animate-in fade-in duration-500 flex flex-col md:flex-row gap-6">
                  {/* Left Column: Offers List */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-6">
                        <div><h3 className="text-2xl font-bold text-[#1E293B]">Ofertas Activas</h3><p className="text-gray-500">Gestiona tus campañas y promociones.</p></div>
                        <button onClick={() => setShowOfferModal(true)} className="bg-[#3CB7A9] hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-teal-900/10"><Plus size={20} className="mr-2" />Crear Nueva Oferta</button>
                    </div>

                    {/* Smart Offers Section (IA) */}
                    <div className="mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <Sparkles className="text-purple-600" size={20} />
                            <h4 className="text-lg font-bold text-[#1E293B]">Ofertas Inteligentes</h4>
                        </div>
                        <div className="p-1 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                        <div className="bg-white rounded-xl p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-start space-x-4">
                                    <div className="p-3 bg-purple-100 rounded-xl text-purple-600"><Bot size={24} /></div>
                                    <div>
                                        <h3 className="text-lg font-bold text-[#1E293B] flex items-center">Marketing Studio IA</h3>
                                        <p className="text-sm text-gray-500 mt-1 max-w-xl">Genera propuestas de ofertas basadas en el historial de rendimiento de tus campañas anteriores.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleGenerateSmartOffer}
                                    disabled={isGeneratingSmartOffer}
                                    className={`flex items-center space-x-2 px-5 py-3 rounded-xl font-bold text-white transition-all ${isGeneratingSmartOffer ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg'}`}
                                >
                                    {isGeneratingSmartOffer ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                                    <span>{isGeneratingSmartOffer ? 'Analizando Datos...' : 'Generar Sugerencia'}</span>
                                </button>
                            </div>
                            
                            {smartOffer && (
                                <div className="mt-6 pt-6 border-t border-gray-100 animate-in slide-in-from-top-4">
                                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 flex justify-between items-center">
                                        <div>
                                            <p className="text-xs font-bold text-purple-600 uppercase mb-2">Sugerencia IA</p>
                                            <h4 className="text-2xl font-bold text-[#1E293B] mb-1">{smartOffer.suggestedTitle}</h4>
                                            <p className="text-sm text-gray-600">{smartOffer.rationale}</p>
                                            <div className="mt-3 flex items-center space-x-2">
                                                <span className="bg-white text-purple-700 px-3 py-1 rounded-lg text-xs font-bold border border-purple-200">{smartOffer.suggestedDiscount}</span>
                                            </div>
                                        </div>
                                        <button 
                                            onClick={() => setShowOfferModal(true)} 
                                            className="bg-white text-purple-700 border border-purple-200 px-6 py-3 rounded-xl font-bold hover:bg-purple-100 transition-colors shadow-sm"
                                        >
                                            Usar esta Sugerencia
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500"><tr><th className="p-4">Título Oferta</th><th className="p-4">Tipo</th><th className="p-4">Descuento</th><th className="p-4">Segmento</th><th className="p-4">Expiración</th><th className="p-4">Canjes</th><th className="p-4">Estado</th><th className="p-4 text-right">Acciones</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {ACTIVE_OFFERS.map(offer => (
                                    <tr key={offer.id} className="hover:bg-gray-50">
                                        <td className="p-4 font-bold text-[#1E293B]">{offer.title}</td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${offer.type === 'flash' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{offer.type === 'flash' ? '⚡ Flash' : 'Evergreen'}</span></td>
                                        <td className="p-4">{offer.discount}</td>
                                        <td className="p-4"><span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">◎ {offer.segment}</span></td>
                                        <td className="p-4 text-xs text-gray-500">{offer.expiry}</td>
                                        <td className="p-4 font-mono">{offer.conversions}</td>
                                        <td className="p-4"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{offer.status}</span></td>
                                        <td className="p-4 text-right"><div className="flex justify-end space-x-2"><button className="text-gray-400 hover:text-blue-600"><Edit3 size={16} /></button><button className="text-gray-400 hover:text-red-600"><Trash2 size={16} /></button></div></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                  </div>

                  {/* Right Column: Validation Widget */}
                  <div className="w-full md:w-80 space-y-6">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border">
                          <div className="flex items-center space-x-2 mb-4">
                              <QrCode className="text-[#1C81F2]" size={20} />
                              <h3 className="font-bold text-[#1E293B]">Validar Canje</h3>
                          </div>
                          <p className="text-xs text-gray-500 mb-4">Ingresa el código presentado por el cliente para registrar la conversión.</p>
                          <input 
                              type="text" 
                              placeholder="Ej: TREEVU-2024..." 
                              className="w-full p-3 border rounded-xl text-sm mb-3 uppercase font-mono"
                              value={redemptionCode}
                              onChange={(e) => { setRedemptionCode(e.target.value); setRedemptionStatus('idle'); }}
                          />
                          <button 
                              onClick={handleValidateRedemption}
                              className="w-full bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-black transition-all"
                          >
                              Validar Código
                          </button>
                          
                          {redemptionStatus === 'valid' && (
                              <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-100 flex items-start space-x-2 animate-in fade-in">
                                  <CheckCircle size={16} className="text-green-600 mt-0.5" />
                                  <div>
                                      <p className="text-xs font-bold text-green-700">¡Código Válido!</p>
                                      <p className="text-[10px] text-green-600">Oferta: Canasta Orgánica ($20 OFF)</p>
                                  </div>
                              </div>
                          )}
                          {redemptionStatus === 'invalid' && (
                              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start space-x-2 animate-in fade-in">
                                  <X size={16} className="text-red-600 mt-0.5" />
                                  <div>
                                      <p className="text-xs font-bold text-red-700">Código Inválido</p>
                                      <p className="text-[10px] text-red-600">Verifique e intente nuevamente.</p>
                                  </div>
                              </div>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {activeTab === 'payments' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <h3 className="font-bold text-lg mb-4">Ventas por Conciliar (Acumulado)</h3>
                      <div className="flex items-center justify-between mb-6"><span className="text-4xl font-bold text-[#1C81F2]">$4,250.00</span><button onClick={() => { setWithdrawAmount(1000); setWithdrawStep('amount'); setShowWithdrawModal(true); }} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold">Solicitar Corte de Pagos</button></div>
                      <div className="space-y-2 border-t pt-4">
                          <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group" onClick={() => setActiveTraceModal('sales_commissions')}>
                              <span className="text-sm text-gray-600 flex items-center"><Tag size={16} className="mr-2 text-gray-400"/> Comisiones por Ventas</span>
                              <span className="font-bold text-[#1E293B] flex items-center">$3,800.00 <ChevronRight size={14} className="ml-2 text-gray-300 group-hover:text-blue-500"/></span>
                          </div>
                          <div className="flex justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer group" onClick={() => setActiveTraceModal('treepoints_refund')}>
                              <span className="text-sm text-gray-600 flex items-center"><Award size={16} className="mr-2 text-gray-400"/> Reembolso TreePoints</span>
                              <span className="font-bold text-[#1E293B] flex items-center">$450.00 <ChevronRight size={14} className="ml-2 text-gray-300 group-hover:text-blue-500"/></span>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                      <div className="p-6 border-b flex justify-between items-center">
                          <h3 className="font-bold text-lg text-[#1E293B]">Historial de Cortes (Settlements)</h3>
                          <div className="flex space-x-2"><button className="p-2 hover:bg-gray-100 rounded"><Filter size={18} className="text-gray-500"/></button><button className="p-2 hover:bg-gray-100 rounded"><Download size={18} className="text-gray-500"/></button></div>
                      </div>
                      <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase"><tr><th className="p-4 text-left">ID Transacción</th><th className="p-4 text-left">Fecha</th><th className="p-4 text-left">Concepto</th><th className="p-4 text-right">Monto</th><th className="p-4 text-center">Estado</th></tr></thead>
                          <tbody className="divide-y divide-gray-100">
                              {payoutHistory.map(p => (
                                  <tr key={p.id} className="hover:bg-gray-50">
                                      <td className="p-4 font-mono text-xs text-gray-500">{p.id}</td>
                                      <td className="p-4">{p.date}</td>
                                      <td className="p-4 font-bold text-gray-700">{p.type}</td>
                                      <td className="p-4 text-right font-bold">${p.amount.toFixed(2)}</td>
                                      <td className="p-4 text-center"><span className={`px-2 py-1 rounded text-xs font-bold ${p.status === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span></td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'points' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                  <div className="flex justify-between items-center">
                      <div><h3 className="text-2xl font-bold text-[#1E293B]">Gestión de Puntos</h3><p className="text-gray-500">Administra tus incentivos y analiza el ROI.</p></div>
                      <button onClick={() => setShowPurchaseModal(true)} className="bg-[#1C81F2] hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-blue-900/10"><ShoppingCart size={20} className="mr-2" />Comprar Puntos</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-500 group transition-all" onClick={() => setActiveTpDetailModal('balance')}>
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Balance Disponible</p>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-blue-500" />
                          </div>
                          <h2 className="text-4xl font-bold text-[#1E293B]">{MERCHANT_TP_STATS.balance.toLocaleString()} pts</h2>
                          <div className="mt-4 text-xs text-gray-400">Suficiente para ~3 campañas</div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-green-500 group transition-all" onClick={() => setActiveTpDetailModal('sales')}>
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Ventas Atribuidas</p>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-green-500" />
                          </div>
                          <h2 className="text-4xl font-bold text-green-600">${MERCHANT_TP_STATS.attributedSales.toLocaleString()}</h2>
                          <div className="mt-4 text-xs text-gray-400">ROI: <span className="text-green-600 font-bold">{MERCHANT_TP_STATS.roi}%</span></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-orange-500 group transition-all" onClick={() => setActiveTpDetailModal('distributed')}>
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs text-gray-500 font-bold uppercase mb-2">Total Distribuidos</p>
                            <ExternalLink size={14} className="text-gray-400 group-hover:text-orange-500" />
                          </div>
                          <h2 className="text-4xl font-bold text-[#1E293B]">{MERCHANT_TP_STATS.totalDistributed.toLocaleString()} pts</h2>
                          <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden"><div className="bg-blue-500 h-full" style={{width: '70%'}}></div></div>
                      </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border p-6">
                      <h3 className="font-bold text-lg text-[#1E293B] mb-4">Historial de Movimientos</h3>
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500"><tr><th className="p-3">Fecha</th><th className="p-3">Tipo</th><th className="p-3">Detalle</th><th className="p-3 text-right">Cantidad</th></tr></thead>
                          <tbody className="divide-y">
                              <tr><td className="p-3">Hoy</td><td className="p-3"><span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-bold">Asignación</span></td><td className="p-3">Campaña Flash Octubre</td><td className="p-3 text-right font-bold text-red-600">-5,000</td></tr>
                              <tr><td className="p-3">01 Oct</td><td className="p-3"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Compra</span></td><td className="p-3">Paquete Growth</td><td className="p-3 text-right font-bold text-green-600">+20,000</td></tr>
                          </tbody>
                      </table>
                  </div>
              </div>
          )}

          {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto animate-in fade-in duration-500 space-y-8">
                  <div className="bg-white rounded-2xl shadow-sm border p-8">
                      <div className="flex justify-between items-center mb-8">
                          <div><h2 className="text-2xl font-bold text-[#1E293B]">Configuración de Cobro</h2><p className="text-gray-500 text-sm">Administra tu cuenta bancaria y preferencias de pago.</p></div>
                          <button onClick={() => setShowConfigModal(true)} className="bg-[#1C81F2] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-blue-600 flex items-center"><Edit3 size={16} className="mr-2"/> Editar Configuración</button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                              <div className="flex items-center mb-4 text-blue-600"><Landmark size={24} className="mr-3" /><h3 className="font-bold text-lg text-[#1E293B]">Datos Bancarios</h3></div>
                              <div className="space-y-3 text-sm">
                                  <div className="flex justify-between"><span className="text-gray-500">Banco</span><span className="font-bold text-[#1E293B]">{configForm.bankName}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Número de Cuenta</span><span className="font-bold text-[#1E293B] font-mono">{configForm.accountNumber}</span></div>
                                  <div className="flex justify-between"><span className="text-gray-500">Routing Number</span><span className="font-bold text-[#1E293B] font-mono">{configForm.routingNumber}</span></div>
                                  <div className="mt-4 pt-3 border-t border-gray-200 flex items-center text-green-600 text-xs font-bold"><CheckCircle size={14} className="mr-1"/> Cuenta Verificada</div>
                              </div>
                          </div>

                          <div className="space-y-6">
                              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                  <div className="flex items-center mb-4 text-purple-600"><Clock size={24} className="mr-3" /><h3 className="font-bold text-lg text-[#1E293B]">Frecuencia de Corte</h3></div>
                                  <p className="text-sm text-gray-600 mb-2">Tus comisiones y anticipos se procesan automáticamente:</p>
                                  <div className="bg-white px-3 py-2 rounded border border-gray-200 font-bold text-[#1E293B] text-sm inline-block">{configForm.payoutFrequency}</div>
                              </div>
                              <div className="p-6 bg-gray-50 rounded-xl border border-gray-200">
                                  <div className="flex items-center mb-4 text-orange-600"><Mail size={24} className="mr-3" /><h3 className="font-bold text-lg text-[#1E293B]">Notificaciones</h3></div>
                                  <p className="text-sm text-gray-600">Enviaremos los comprobantes de pago a:</p>
                                  <p className="font-bold text-[#1E293B] text-sm mt-1">{configForm.notificationEmail}</p>
                              </div>
                          </div>
                      </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl shadow-sm border p-8">
                      <h3 className="text-xl font-bold text-[#1E293B] mb-4">Seguridad y Cumplimiento</h3>
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <div className="flex items-center"><Shield size={24} className="text-blue-600 mr-4"/><div className="text-sm"><p className="font-bold text-blue-900">KYB Verificado</p><p className="text-blue-700">Tu documentación de negocio está al día.</p></div></div>
                          <button onClick={() => setShowKybModal(true)} className="text-blue-600 font-bold text-sm underline hover:text-blue-800">Ver Documentos</button>
                      </div>
                  </div>
              </div>
          )}

          {/* DRILL DOWN MODALS FOR OVERVIEW KPIs */}
          {activeDetailModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                      <button onClick={() => setActiveDetailModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      
                      {activeDetailModal === 'revenue' && (
                          <div>
                              <h3 className="text-2xl font-bold text-[#1E293B] mb-6">Desglose de Ingresos</h3>
                              <div className="flex items-center justify-center h-64 mb-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <PieChart>
                                          <Pie data={REVENUE_BREAKDOWN} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label>
                                              {REVENUE_BREAKDOWN.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                          </Pie>
                                          <Legend />
                                          <Tooltip />
                                      </PieChart>
                                  </ResponsiveContainer>
                              </div>
                              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                  <h4 className="font-bold text-sm text-blue-800 mb-2">Análisis de Venta Incremental</h4>
                                  <div className="text-sm text-blue-900 leading-relaxed">
                                    Treevü genera principalmente <strong>Venta Incremental</strong> (nuevos clientes traídos por la plataforma) a través de ofertas Flash. Las ofertas Evergreen fidelizan la base orgánica.
                                  </div>
                              </div>
                          </div>
                      )}

                      {activeDetailModal === 'conversion' && (
                          <div>
                              <h3 className="text-2xl font-bold text-[#1E293B] mb-6">Tendencia de Conversión</h3>
                              <div className="h-64 bg-slate-50 rounded-xl p-4 mb-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <LineChart data={CONVERSION_TREND}>
                                          <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                          <XAxis dataKey="date" />
                                          <YAxis domain={[0, 6]} />
                                          <Tooltip />
                                          <Line type="monotone" dataKey="rate" stroke="#3CB7A9" strokeWidth={3} />
                                      </LineChart>
                                  </ResponsiveContainer>
                              </div>
                              <p className="text-sm text-gray-600">La tasa de conversión ha aumentado un <strong>50%</strong> desde el lanzamiento de la oferta Flash.</p>
                          </div>
                      )}

                      {activeDetailModal === 'points' && (
                          <div>
                              <h3 className="text-2xl font-bold text-[#1E293B] mb-6">ROI de TreePoints</h3>
                              <div className="h-64 mb-6">
                                  <ResponsiveContainer width="100%" height="100%">
                                      <BarChart data={TREEPOINTS_ROI_DATA} layout="vertical">
                                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                          <XAxis type="number" />
                                          <YAxis dataKey="category" type="category" width={80} />
                                          <Tooltip />
                                          <Legend />
                                          <Bar dataKey="sales" name="Ventas (LTV)" fill="#1C81F2" radius={[0, 4, 4, 0]} />
                                          <Bar dataKey="redeemed" name="Costo Adquisición (CAC)" fill="#94A3B8" radius={[0, 4, 4, 0]} />
                                      </BarChart>
                                  </ResponsiveContainer>
                              </div>
                              <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-sm text-green-800">
                                  <strong>Eficiencia:</strong> Estás adquiriendo clientes a un costo (CAC) 3x menor que el valor que generan (LTV). El segmento 'Salud' muestra la mejor relación costo-beneficio.
                              </div>
                          </div>
                      )}

                      {activeDetailModal === 'commissions' && (
                          <div>
                              <h3 className="text-2xl font-bold text-[#1E293B] mb-6">Detalle de Comisiones</h3>
                              <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-50 font-bold text-gray-500"><tr><th className="p-2">ID</th><th className="p-2">Origen</th><th className="p-2">Tarifa</th><th className="p-2 text-right">Monto</th><th className="p-2">Estado</th><th className="p-2 text-right">Acción</th></tr></thead>
                                  <tbody className="divide-y">
                                      {commissionDetails.map((c, i) => (
                                          <tr key={i}>
                                              <td className="p-2 font-mono text-xs">{c.id}</td>
                                              <td className="p-2">{c.type}</td>
                                              <td className="p-2 text-gray-500">{c.rate}</td>
                                              <td className="p-2 text-right font-bold">${c.amount.toFixed(2)}</td>
                                              <td className="p-2"><span className={`px-2 py-0.5 rounded text-xs font-bold ${c.status === 'Pagado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{c.status}</span></td>
                                              <td className="p-2 text-right">
                                                  {c.status === 'Pagado' ? (
                                                      <span className="text-gray-400 text-xs flex items-center justify-end"><CheckCircle size={12} className="mr-1"/> Completado</span>
                                                  ) : (
                                                      <button onClick={() => handleDisburse(c.id)} className="text-blue-600 font-bold text-xs hover:underline hover:text-blue-800 transition-colors">Procesar Pago</button>
                                                  )}
                                              </td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                          </div>
                      )}
                  </div>
              </div>
          )}

           {/* DRILL DOWN MODALS FOR TREEPOINTS (ActiveTab = Points) */}
           {activeTpDetailModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveTpDetailModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    {activeTpDetailModal === 'balance' && (
                        <div>
                            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Flujo de Puntos</h3>
                            <p className="text-sm text-gray-500 mb-6">Historial de Compras vs. Distribución</p>
                            
                            <div className="h-64 bg-slate-50 rounded-xl p-4 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={TP_BALANCE_HISTORY}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="balance" stackId="1" stroke="#1C81F2" fill="#1C81F2" fillOpacity={0.1} name="Balance" />
                                        <Area type="step" dataKey="purchased" stackId="2" stroke="#3CB7A9" fill="none" name="Compras" />
                                        <Legend />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-gray-700">
                                <strong>Burn Rate:</strong> Estás distribuyendo aproximadamente 2,000 puntos semanales. Se recomienda una recarga antes de la temporada navideña.
                            </div>
                        </div>
                    )}

                    {activeTpDetailModal === 'sales' && (
                        <div>
                            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Efectividad de Campañas</h3>
                            <p className="text-sm text-gray-500 mb-6">Ventas generadas por tipo de campaña</p>
                            
                            <div className="h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={TP_ROI_CAMPAIGNS} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={100} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="sales" name="Ventas ($)" fill="#10B981" radius={[0, 4, 4, 0]} barSize={20} />
                                        <Bar dataKey="cost" name="Costo Puntos ($)" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={20} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500 text-sm text-gray-700">
                                <strong>Top Performer:</strong> Las campañas "Evergreen" tienen el mejor ROI sostenido. Las campañas "Flash" generan volumen rápido pero a un costo mayor.
                            </div>
                        </div>
                    )}

                    {activeTpDetailModal === 'distributed' && (
                        <div>
                            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Distribución de Incentivos</h3>
                            <p className="text-sm text-gray-500 mb-6">¿En qué conceptos se gastan tus puntos?</p>
                            
                            <div className="flex items-center justify-center h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={TP_DISTRIBUTION_TYPE} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" paddingAngle={5} label>
                                            {TP_DISTRIBUTION_TYPE.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                        </Pie>
                                        <Legend />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-xl border-l-4 border-orange-500 text-sm text-gray-700">
                                <strong>Estrategia:</strong> El 65% de tus puntos se usan para incentivar ventas directas. Considera aumentar la asignación a "Fidelización" para mejorar la retención a largo plazo.
                            </div>
                        </div>
                    )}
                </div>
            </div>
           )}

          {/* ACTIVE TRACE MODAL (Balance Breakdown) */}
          {activeTraceModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveTraceModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    <div className="mb-6">
                      <h3 className="text-2xl font-bold text-[#1E293B]">
                        {activeTraceModal === 'sales_commissions' ? 'Comisiones por Ventas' : 'Reembolso TreePoints'}
                      </h3>
                      <p className="text-sm text-gray-500">Desglose de transacciones acumuladas</p>
                    </div>

                    <div className="border rounded-xl overflow-hidden">
                      <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500">
                            <tr><th className="p-3">ID</th><th className="p-3">Fecha</th><th className="p-3">Descripción</th><th className="p-3 text-right">Monto</th></tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {TRACE_DATA[activeTraceModal].map((row, idx) => (
                              <tr key={idx} className="hover:bg-gray-50">
                                <td className="p-3 font-mono text-xs text-gray-500">{row.id}</td>
                                <td className="p-3">{row.date}</td>
                                <td className="p-3 font-medium text-[#1E293B]">{row.desc}</td>
                                <td className="p-3 text-right font-bold text-[#1E293B]">${row.amount.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                      </table>
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <button onClick={() => setActiveTraceModal(null)} className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-2 rounded-xl font-bold transition-colors">Cerrar</button>
                    </div>
                </div>
            </div>
          )}

          {/* PURCHASE POINTS MODAL */}
          {showPurchaseModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Adquirir Paquete de Puntos</h3><button onClick={() => setShowPurchaseModal(false)}><X size={20} /></button></div>
                      <div className="grid grid-cols-1 gap-4 mb-6">
                          {PURCHASE_PACKAGES.map(pkg => (
                              <div key={pkg.id} onClick={() => setSelectedPackage(pkg.id)} className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex justify-between items-center ${selectedPackage === pkg.id ? 'border-[#1C81F2] bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}>
                                  <div>
                                      <h4 className="font-bold text-[#1E293B]">{pkg.label}</h4>
                                      <p className="text-sm text-gray-500">{pkg.points.toLocaleString()} TreePoints</p>
                                  </div>
                                  <div className="text-right">
                                      <span className="block text-xl font-bold text-[#1C81F2]">${pkg.price}</span>
                                      <span className="text-[10px] text-gray-400 uppercase">Facturación B2B</span>
                                  </div>
                              </div>
                          ))}
                      </div>
                      <div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 mb-6 flex items-start"><Info size={16} className="mr-2 flex-shrink-0 text-blue-500"/> Los puntos adquiridos se acreditarán inmediatamente a tu saldo de incentivos. La factura se enviará al correo registrado.</div>
                      <div className="flex space-x-3">
                          <button onClick={() => setShowPurchaseModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                          <button onClick={() => setShowPurchaseModal(false)} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Confirmar Compra</button>
                      </div>
                  </div>
              </div>
          )}

          {/* CONFIGURATION MODAL */}
          {showConfigModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Editar Configuración</h3><button onClick={() => setShowConfigModal(false)}><X size={24} /></button></div>
                      <div className="space-y-4">
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Nombre del Banco</label>
                              <input type="text" value={configForm.bankName} onChange={(e) => setConfigForm({...configForm, bankName: e.target.value})} className="w-full p-3 border rounded-xl text-sm font-bold" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                              <div><label className="block text-xs font-bold text-gray-500 mb-1">Nº Cuenta</label><input type="text" value={configForm.accountNumber} onChange={(e) => setConfigForm({...configForm, accountNumber: e.target.value})} className="w-full p-3 border rounded-xl text-sm font-mono" /></div>
                              <div><label className="block text-xs font-bold text-gray-500 mb-1">Routing</label><input type="text" value={configForm.routingNumber} onChange={(e) => setConfigForm({...configForm, routingNumber: e.target.value})} className="w-full p-3 border rounded-xl text-sm font-mono" /></div>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Frecuencia de Corte</label>
                              <select value={configForm.payoutFrequency} onChange={(e) => setConfigForm({...configForm, payoutFrequency: e.target.value})} className="w-full p-3 border rounded-xl text-sm">
                                  <option>Semanal (Viernes)</option>
                                  <option>Quincenal</option>
                                  <option>A demanda (Instantáneo)</option>
                              </select>
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Email Notificaciones</label>
                              <input type="email" value={configForm.notificationEmail} onChange={(e) => setConfigForm({...configForm, notificationEmail: e.target.value})} className="w-full p-3 border rounded-xl text-sm" />
                          </div>
                          <div className="flex space-x-3 pt-4">
                              <button onClick={() => setShowConfigModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                              <button onClick={() => setShowConfigModal(false)} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Guardar Cambios</button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

           {/* KYB DOCUMENTS MODAL */}
           {showKybModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                      <button onClick={() => setShowKybModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      
                      <div className="mb-6 flex items-start space-x-4">
                          <div className="p-3 bg-blue-100 rounded-xl text-blue-600"><Shield size={28} /></div>
                          <div>
                              <h3 className="text-xl font-bold text-[#1E293B]">Expediente Digital (KYB)</h3>
                              <p className="text-sm text-gray-500">Estado de la documentación regulatoria.</p>
                          </div>
                      </div>

                      <div className="space-y-4 mb-8">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="flex items-center space-x-3">
                                  <FileText className="text-gray-400" size={20} />
                                  <div>
                                      <p className="font-bold text-sm text-[#1E293B]">Acta Constitutiva</p>
                                      <p className="text-xs text-gray-500">Verificado el 12/01/2024</p>
                                  </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aprobado</span>
                                  <button className="p-2 hover:bg-white rounded-lg text-gray-500"><Eye size={16}/></button>
                              </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="flex items-center space-x-3">
                                  <FileText className="text-gray-400" size={20} />
                                  <div>
                                      <p className="font-bold text-sm text-[#1E293B]">Cédula Fiscal (RUC/NIT)</p>
                                      <p className="text-xs text-gray-500">Verificado el 12/01/2024</p>
                                  </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aprobado</span>
                                  <button className="p-2 hover:bg-white rounded-lg text-gray-500"><Eye size={16}/></button>
                              </div>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                              <div className="flex items-center space-x-3">
                                  <FileText className="text-gray-400" size={20} />
                                  <div>
                                      <p className="font-bold text-sm text-[#1E293B]">ID Representante Legal</p>
                                      <p className="text-xs text-gray-500">Verificado el 15/01/2024</p>
                                  </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Aprobado</span>
                                  <button className="p-2 hover:bg-white rounded-lg text-gray-500"><Eye size={16}/></button>
                              </div>
                          </div>
                      </div>

                      <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 flex items-start border border-blue-100">
                          <Info size={16} className="mr-2 flex-shrink-0" />
                          Tu expediente cumple con los requisitos de la regulación fintech local. Próxima revisión anual programada para Enero 2025.
                      </div>
                  </div>
              </div>
           )}

          {/* OFFER MODAL */}
          {showOfferModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Crear Nueva Oferta</h3><button onClick={() => setShowOfferModal(false)}><X size={24} /></button></div>
                      <div className="space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Título</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded-xl text-sm" 
                                placeholder="Ej: 20% en Vegetales" 
                                defaultValue={smartOffer?.suggestedTitle || ''} 
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 mb-1">Descuento</label>
                            <input 
                                type="text" 
                                className="w-full p-3 border rounded-xl text-sm" 
                                placeholder="Ej: $10 OFF" 
                                defaultValue={smartOffer?.suggestedDiscount || ''} 
                            />
                          </div>
                          <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Tipo de Campaña</label>
                              <div className="flex space-x-2">
                                  <button onClick={() => setNewOfferType('evergreen')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newOfferType === 'evergreen' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-500'}`}>Evergreen (Fija)</button>
                                  <button onClick={() => setNewOfferType('flash')} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${newOfferType === 'flash' ? 'bg-orange-50 border-orange-200 text-orange-700' : 'border-gray-200 text-gray-500'}`}>⚡ Flash (Urgencia)</button>
                              </div>
                          </div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">Segmento Objetivo (FWI)</label><select className="w-full p-3 border rounded-xl text-sm"><option>Todos</option><option>Alto (Premium)</option><option>Bajo (Ahorro)</option></select></div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">Presupuesto Puntos (Opcional)</label><input type="number" className="w-full p-3 border rounded-xl text-sm" placeholder="0" /></div>
                          <div className="flex space-x-3 pt-4">
                              <button onClick={() => setShowOfferModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                              <button onClick={() => setShowOfferModal(false)} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Publicar</button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* WITHDRAWAL MODAL */}
          {showWithdrawModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Solicitar Corte de Caja</h3><button onClick={() => setShowWithdrawModal(false)}><X size={24} /></button></div>
                      {withdrawStep === 'amount' && (
                          <>
                              <div className="mb-6"><input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} className="w-full p-4 bg-gray-50 border rounded-xl text-2xl font-bold" /></div>
                              <button onClick={() => setWithdrawStep('summary')} className="w-full bg-[#1C81F2] text-white font-bold py-3 rounded-xl">Continuar</button>
                          </>
                      )}
                      {withdrawStep === 'summary' && (
                          <>
                              <div className="bg-gray-50 p-6 rounded-xl mb-6"><div className="flex justify-between"><span className="text-gray-500">Monto a Conciliar</span><span className="font-bold">${withdrawAmount}</span></div></div>
                              <div className="flex space-x-3">
                                  <button onClick={() => setWithdrawStep('amount')} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Volver</button>
                                  <button onClick={handleWithdrawRequest} className="flex-1 bg-[#1E293B] text-white font-bold py-3 rounded-xl">Confirmar y Enviar</button>
                              </div>
                          </>
                      )}
                      {withdrawStep === 'success' && (
                          <div className="text-center py-4"><CheckCircle size={48} className="mx-auto text-green-500 mb-4" /><h3 className="font-bold text-xl">Solicitud Recibida</h3><p className="text-sm text-gray-500">Enviado a Tesorería Corporativa para proceso de pago.</p><button onClick={() => setShowWithdrawModal(false)} className="mt-6 w-full bg-gray-100 font-bold py-3 rounded-xl">Cerrar</button></div>
                      )}
                  </div>
              </div>
          )}

          {/* ONBOARDING MODAL */}
          {showOnboarding && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden custom-scrollbar">
                      <div className="bg-[#3CB7A9] p-8 text-center text-white">
                          <Store size={48} className="mx-auto mb-4" />
                          <h2 className="text-3xl font-bold mb-2 font-['Space_Grotesk']">Bienvenido al Portal de Aliados</h2>
                          <p className="opacity-90">Crecimiento Inteligente con Treevü Network</p>
                      </div>
                      <div className="p-8">
                          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                              Conecta tu negocio con miles de empleados corporativos. Utiliza la inteligencia de datos de Treevü para ofrecer beneficios personalizados y maximizar tu retorno de inversión.
                          </p>
                          <div className="space-y-4 mb-8">
                              <div className="flex items-start space-x-3">
                                  <div className="bg-teal-50 p-2 rounded-lg text-teal-600"><Target size={20} /></div>
                                  <div><h4 className="font-bold text-sm text-[#1E293B]">Segmentación FWI</h4><p className="text-xs text-gray-500">Dirige ofertas según el perfil financiero (Ahorro vs. Lifestyle).</p></div>
                              </div>
                              <div className="flex items-start space-x-3">
                                  <div className="bg-blue-50 p-2 rounded-lg text-blue-600"><Award size={20} /></div>
                                  <div><h4 className="font-bold text-sm text-[#1E293B]">Loyalty TreePoints</h4><p className="text-xs text-gray-500">Participa en el ecosistema de puntos corporativos.</p></div>
                              </div>
                              <div className="flex items-start space-x-3">
                                  <div className="bg-orange-50 p-2 rounded-lg text-orange-600"><Zap size={20} /></div>
                                  <div><h4 className="font-bold text-sm text-[#1E293B]">Conversión Flash</h4><p className="text-xs text-gray-500">Ofertas de tiempo limitado para liquidar inventario.</p></div>
                              </div>
                          </div>
                          <div className="flex space-x-4">
                              <button onClick={() => { setShowOnboarding(false); setActiveTab('settings'); }} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Configurar Pagos</button>
                              <button onClick={() => setShowOnboarding(false)} className="flex-1 bg-[#1E293B] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all">Ir al Dashboard</button>
                          </div>
                      </div>
                  </div>
              </div>
          )}
      </main>
    </div>
  );
};