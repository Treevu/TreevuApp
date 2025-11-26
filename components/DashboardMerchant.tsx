
import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { ShoppingBag, TrendingUp, Users, DollarSign, CreditCard, Plus, Edit3, Trash2, Target, LayoutDashboard, Tag, Settings, LogOut, Zap, Clock, Briefcase, CheckCircle, ExternalLink, Globe, Building, Download, Landmark, Webhook, UserPlus, ArrowUpRight, X, Activity, Award, PieChart as PieChartIcon, Filter, Calendar, FileText, List, Search, ChevronRight, Info, ArrowRight, RefreshCw, ShoppingCart, Mail, Shield } from 'lucide-react';
import { MerchantTPStats } from '../types';

const COLORS = { primary: '#1C81F2', accent: '#3CB7A9', bg: '#F6FAFE', text: '#1E293B', warning: '#F59E0B', danger: '#EF4444' };
const SALES_DATA = [{ day: 'Lun', sales: 1200 }, { day: 'Mar', sales: 1900 }, { day: 'Mié', sales: 1500 }, { day: 'Jue', sales: 2400 }, { day: 'Vie', sales: 3200 }, { day: 'Sáb', sales: 3800 }, { day: 'Dom', sales: 3100 }];
const FWI_SEGMENT_DATA = [{ name: 'FWI Alto (Crecimiento)', value: 45, color: '#3CB7A9' }, { name: 'FWI Medio (Estable)', value: 30, color: '#1C81F2' }, { name: 'FWI Bajo (Necesidades)', value: 25, color: '#F59E0B' }];
const ACTIVE_OFFERS = [{ id: 1, title: 'Canasta Orgánica', discount: '$20 OFF', conversions: 412, status: 'Activa', type: 'evergreen', segment: 'Todos', expiry: 'Indefinido' }, { id: 2, title: 'Vitaminas Premium', discount: '2x1', conversions: 128, status: 'Activa', type: 'flash', segment: 'FWI Alto', expiry: '24h Restantes' }];
const PAYOUT_HISTORY = [{ id: 'TX-9926', date: '30 Dic 2023', amount: 5100.00, type: 'Liquidación Q4 Final', status: 'Pagado' }, { id: 'TX-9925', date: '15 Dic 2023', amount: 4850.25, type: 'Comisiones Ventas', status: 'Pagado' }];

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
const COMMISSION_DETAILS = [
    { id: 'C-123', type: 'Flash Deal - Electro', rate: '5%', amount: 355.00, status: 'Pendiente' },
    { id: 'C-124', type: 'Marketplace - Salud', rate: '$1.50 CPA', amount: 129.00, status: 'Pendiente' },
    { id: 'C-125', type: 'Evergreen - Retail', rate: '5%', amount: 210.00, status: 'En Revisión' }
];

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
  const [activeTraceModal, setActiveTraceModal] = useState<'sales_commissions' | 'treepoints_refund' | null>(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'amount' | 'summary' | 'processing' | 'success'>('amount');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  
  // Points Management State
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null);

  // Offer Creation State
  const [newOfferType, setNewOfferType] = useState<'evergreen' | 'flash'>('evergreen');

  // Settings State
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [configForm, setConfigForm] = useState({
      bankName: 'Chase Bank',
      accountNumber: '**** 8821',
      routingNumber: '021000021',
      payoutFrequency: 'Semanal (Viernes)',
      notificationEmail: 'finance@wholefoods.com'
  });

  const handleWithdrawRequest = () => { setWithdrawStep('processing'); setTimeout(() => setWithdrawStep('success'), 2000); };

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
                    <SidebarItem id="payments" icon={DollarSign} label="Pagos & Anticipos" active={activeTab === 'payments'} onClick={() => setActiveTab('payments')} />
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
              {activeTab === 'overview' && <div className="text-right"><p className="text-xs text-gray-400 font-bold uppercase mb-1">Próximo Pago</p><h2 className="text-3xl font-bold text-[#1C81F2]">$4,250.00</h2><span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded mt-1 inline-block">Listo para Procesar</span></div>}
          </header>

          {activeTab === 'overview' && (
              <div className="animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                      <div className="bg-white p-6 rounded-xl shadow-sm border cursor-pointer hover:border-[#1C81F2] transition-all group" onClick={() => setActiveDetailModal('revenue')}>
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Ingresos Totales</p>
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
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Comisiones Pendientes</p>
                          <h2 className="text-3xl font-bold text-[#1E293B]">$855.00</h2>
                          <p className="text-[10px] text-gray-400 mt-2 flex items-center group-hover:text-orange-500">Ver detalle deuda <ArrowUpRight size={10} className="ml-1"/></p>
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
              <div className="animate-in fade-in duration-500">
                  <div className="flex justify-between items-center mb-6">
                      <div><h3 className="text-2xl font-bold text-[#1E293B]">Ofertas Activas</h3><p className="text-gray-500">Gestiona tus campañas y promociones.</p></div>
                      <button onClick={() => setShowOfferModal(true)} className="bg-[#3CB7A9] hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-teal-900/10"><Plus size={20} className="mr-2" />Crear Nueva Oferta</button>
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
          )}

          {activeTab === 'payments' && (
              <div className="animate-in fade-in duration-500 space-y-8">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border">
                      <h3 className="font-bold text-lg mb-4">Balance Disponible</h3>
                      <div className="flex items-center justify-between mb-6"><span className="text-4xl font-bold text-[#1C81F2]">$4,250.00</span><button onClick={() => { setWithdrawAmount(1000); setWithdrawStep('amount'); setShowWithdrawModal(true); }} className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold">Solicitar Anticipo</button></div>
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
                          <h3 className="font-bold text-lg text-[#1E293B]">Historial de Desembolsos</h3>
                          <div className="flex space-x-2"><button className="p-2 hover:bg-gray-100 rounded"><Filter size={18} className="text-gray-500"/></button><button className="p-2 hover:bg-gray-100 rounded"><Download size={18} className="text-gray-500"/></button></div>
                      </div>
                      <table className="w-full text-sm">
                          <thead className="bg-gray-50 text-gray-500 font-bold text-xs uppercase"><tr><th className="p-4 text-left">ID Transacción</th><th className="p-4 text-left">Fecha</th><th className="p-4 text-left">Concepto</th><th className="p-4 text-right">Monto</th><th className="p-4 text-center">Estado</th></tr></thead>
                          <tbody className="divide-y divide-gray-100">
                              {PAYOUT_HISTORY.map(p => (
                                  <tr key={p.id} className="hover:bg-gray-50">
                                      <td className="p-4 font-mono text-xs text-gray-500">{p.id}</td>
                                      <td className="p-4">{p.date}</td>
                                      <td className="p-4 font-bold text-gray-700">{p.type}</td>
                                      <td className="p-4 text-right font-bold">${p.amount.toFixed(2)}</td>
                                      <td className="p-4 text-center"><span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">{p.status}</span></td>
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
                      <div className="bg-white p-6 rounded-2xl shadow-sm border">
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Balance Disponible</p>
                          <h2 className="text-4xl font-bold text-[#1E293B]">{MERCHANT_TP_STATS.balance.toLocaleString()} pts</h2>
                          <div className="mt-4 text-xs text-gray-400">Suficiente para ~3 campañas</div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border">
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Ventas Atribuidas</p>
                          <h2 className="text-4xl font-bold text-green-600">${MERCHANT_TP_STATS.attributedSales.toLocaleString()}</h2>
                          <div className="mt-4 text-xs text-gray-400">ROI: <span className="text-green-600 font-bold">{MERCHANT_TP_STATS.roi}%</span></div>
                      </div>
                      <div className="bg-white p-6 rounded-2xl shadow-sm border">
                          <p className="text-xs text-gray-500 font-bold uppercase mb-2">Total Distribuidos</p>
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
                                  <div className="flex items-center mb-4 text-purple-600"><Clock size={24} className="mr-3" /><h3 className="font-bold text-lg text-[#1E293B]">Frecuencia de Pago</h3></div>
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
                          <button className="text-blue-600 font-bold text-sm underline">Ver Documentos</button>
                      </div>
                  </div>
              </div>
          )}

          {/* DRILL DOWN MODALS FOR KPIs */}
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
                                  <h4 className="font-bold text-sm text-blue-800 mb-2">Top Empresas (B2B)</h4>
                                  <div className="space-y-2 text-sm">
                                      <div className="flex justify-between"><span>TechCorp Inc.</span><span className="font-bold">$5,200</span></div>
                                      <div className="flex justify-between"><span>Logistics Global</span><span className="font-bold">$3,100</span></div>
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
                                          <Bar dataKey="sales" name="Ventas ($)" fill="#1C81F2" radius={[0, 4, 4, 0]} />
                                          <Bar dataKey="redeemed" name="Puntos (x10)" fill="#94A3B8" radius={[0, 4, 4, 0]} />
                                      </BarChart>
                                  </ResponsiveContainer>
                              </div>
                              <div className="bg-green-50 p-4 rounded-xl border border-green-100 text-sm text-green-800">
                                  <strong>Insight:</strong> La categoría "Salud" genera $3.00 en ventas por cada punto invertido.
                              </div>
                          </div>
                      )}

                      {activeDetailModal === 'commissions' && (
                          <div>
                              <h3 className="text-2xl font-bold text-[#1E293B] mb-6">Detalle de Comisiones</h3>
                              <table className="w-full text-sm text-left">
                                  <thead className="bg-gray-50 font-bold text-gray-500"><tr><th className="p-2">ID</th><th className="p-2">Origen</th><th className="p-2">Tarifa</th><th className="p-2 text-right">Monto</th><th className="p-2">Estado</th></tr></thead>
                                  <tbody className="divide-y">
                                      {COMMISSION_DETAILS.map((c, i) => (
                                          <tr key={i}>
                                              <td className="p-2 font-mono text-xs">{c.id}</td>
                                              <td className="p-2">{c.type}</td>
                                              <td className="p-2 text-gray-500">{c.rate}</td>
                                              <td className="p-2 text-right font-bold">${c.amount.toFixed(2)}</td>
                                              <td className="p-2"><span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded text-xs font-bold">{c.status}</span></td>
                                          </tr>
                                      ))}
                                  </tbody>
                              </table>
                              <div className="mt-6 flex justify-end"><button className="bg-[#1E293B] text-white px-4 py-2 rounded-lg font-bold text-sm">Pagar Ahora</button></div>
                          </div>
                      )}
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
                              <label className="block text-xs font-bold text-gray-500 mb-1">Frecuencia de Pago</label>
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

          {/* OFFER MODAL */}
          {showOfferModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Crear Nueva Oferta</h3><button onClick={() => setShowOfferModal(false)}><X size={24} /></button></div>
                      <div className="space-y-4">
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">Título</label><input type="text" className="w-full p-3 border rounded-xl text-sm" placeholder="Ej: 20% en Vegetales" /></div>
                          <div><label className="block text-xs font-bold text-gray-500 mb-1">Descuento</label><input type="text" className="w-full p-3 border rounded-xl text-sm" placeholder="Ej: $10 OFF" /></div>
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
                      <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-bold">Solicitar Anticipo</h3><button onClick={() => setShowWithdrawModal(false)}><X size={24} /></button></div>
                      {withdrawStep === 'amount' && (
                          <>
                              <div className="mb-6"><input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(Number(e.target.value))} className="w-full p-4 bg-gray-50 border rounded-xl text-2xl font-bold" /></div>
                              <button onClick={() => setWithdrawStep('summary')} className="w-full bg-[#1C81F2] text-white font-bold py-3 rounded-xl">Continuar</button>
                          </>
                      )}
                      {withdrawStep === 'summary' && (
                          <>
                              <div className="bg-gray-50 p-6 rounded-xl mb-6"><div className="flex justify-between"><span className="text-gray-500">Monto</span><span className="font-bold">${withdrawAmount}</span></div></div>
                              <div className="flex space-x-3">
                                  <button onClick={() => setWithdrawStep('amount')} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Volver</button>
                                  <button onClick={handleWithdrawRequest} className="flex-1 bg-[#1E293B] text-white font-bold py-3 rounded-xl">Confirmar y Enviar</button>
                              </div>
                          </>
                      )}
                      {withdrawStep === 'success' && (
                          <div className="text-center py-4"><CheckCircle size={48} className="mx-auto text-green-500 mb-4" /><h3 className="font-bold text-xl">Solicitud Recibida</h3><p className="text-sm text-gray-500">Enviado a Tesorería.</p><button onClick={() => setShowWithdrawModal(false)} className="mt-6 w-full bg-gray-100 font-bold py-3 rounded-xl">Cerrar</button></div>
                      )}
                  </div>
              </div>
          )}
      </main>
    </div>
  );
};
