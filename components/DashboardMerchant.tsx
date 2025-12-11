import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell, PieChart, Pie, LineChart, Line, Legend } from 'recharts';
import { ShoppingBag, TrendingUp, Users, DollarSign, CreditCard, Plus, Edit3, Trash2, Target, LayoutDashboard, Tag, Settings, LogOut, Zap, Clock, Briefcase, CheckCircle, ExternalLink, Globe, Building, Download, Landmark, Webhook, UserPlus, ArrowUpRight, X, Activity, Award, PieChart as PieChartIcon, Filter, Calendar, FileText, List, Search, ChevronRight, Info, ArrowRight, RefreshCw, ShoppingCart, Mail, Shield, Store, Sparkles, Bot, Eye, QrCode, Menu, BarChart2 } from 'lucide-react';
import { MerchantTPStats } from '../types';
import { generateSmartOffer } from '../services/geminiService';

// --- MOCK DATA ---

const REVENUE_BREAKDOWN = [
  { name: 'Direct Sales', value: 4500, color: '#1C81F2' },
  { name: 'Flash Deals', value: 3800, color: '#3CB7A9' },
  { name: 'TreePoints', value: 1200, color: '#A78BFA' }
];

const CONVERSION_TREND = [
  { date: 'Sep 1', rate: 2.1 }, { date: 'Sep 5', rate: 2.4 }, { date: 'Sep 10', rate: 3.8 },
  { date: 'Sep 15', rate: 4.2 }, { date: 'Sep 20', rate: 4.1 }, { date: 'Sep 25', rate: 4.8 }
];

const TREEPOINTS_ROI_DATA = [
  { category: 'Alimentos', redeemed: 4500, sales: 12500 },
  { category: 'Salud', redeemed: 2000, sales: 8400 },
  { category: 'Ocio', redeemed: 3200, sales: 6200 }
];

const COMMISSION_DETAILS_DATA = [
    { id: 'C-001', type: 'Sales', rate: '5%', amount: 45.00, status: 'Pendiente' },
    { id: 'C-002', type: 'Sales', rate: '5%', amount: 12.50, status: 'Pendiente' },
    { id: 'C-003', type: 'Affiliate', rate: '2%', amount: 8.00, status: 'Pagado' },
];

export const DashboardMerchant: React.FC = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [showOnboarding, setShowOnboarding] = useState(true);

    // AI Offer Launch
    const [showAiLaunchModal, setShowAiLaunchModal] = useState(false);
    const [smartOffer, setSmartOffer] = useState<{ suggestedTitle: string, suggestedDiscount: string, rationale: string } | null>(null);
    const [showOfferModal, setShowOfferModal] = useState(false);

    // Detail Modals
    const [activeDetailModal, setActiveDetailModal] = useState<'revenue' | 'conversion' | 'points' | 'commissions' | null>(null);

    // Withdraw / Commissions
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [withdrawStep, setWithdrawStep] = useState<'amount' | 'processing' | 'success'>('amount');
    
    // Purchase Points
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    // Traceability
    const [activeTraceModal, setActiveTraceModal] = useState<'sales_commissions' | 'redemptions' | null>(null);
    const [activeTpDetailModal, setActiveTpDetailModal] = useState<string | null>(null);

    // Config
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [showKybModal, setShowKybModal] = useState(false);

    // Commission Data
    const [commissionDetails, setCommissionDetails] = useState(COMMISSION_DETAILS_DATA);

    // --- HANDLERS ---

    const handleLaunchAiOffer = () => {
        // Logic to launch offer
        setShowAiLaunchModal(false);
        // Show success toast or similar
    };

    const handleWithdrawRequest = () => {
        setWithdrawStep('processing');
        setTimeout(() => setWithdrawStep('success'), 1500);
    };

    const handleDisburse = (id: string) => {
        setCommissionDetails(prev => prev.map(c => c.id === id ? { ...c, status: 'Pagado' } : c));
    };

    return (
    <div className="flex h-screen bg-[#F0F4F8]">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-10 text-[#3CB7A9]">
          <Store size={28} />
          <span className="text-2xl font-bold font-['Space_Grotesk']">Treevü Partners</span>
        </div>
        
        <nav className="space-y-2">
            <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'overview' ? 'bg-[#3CB7A9] text-white shadow-lg shadow-teal-200' : 'text-gray-500 hover:bg-slate-50'}`}><LayoutDashboard size={20} /><span>Overview</span></button>
            <button onClick={() => setActiveTab('offers')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'offers' ? 'bg-[#3CB7A9] text-white shadow-lg shadow-teal-200' : 'text-gray-500 hover:bg-slate-50'}`}><Tag size={20} /><span>Mis Ofertas</span></button>
            <button onClick={() => setActiveTab('treepoints')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'treepoints' ? 'bg-[#3CB7A9] text-white shadow-lg shadow-teal-200' : 'text-gray-500 hover:bg-slate-50'}`}><Gift size={20} /><span>TreePoints</span></button>
            <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'finance' ? 'bg-[#3CB7A9] text-white shadow-lg shadow-teal-200' : 'text-gray-500 hover:bg-slate-50'}`}><DollarSign size={20} /><span>Finanzas</span></button>
            <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'settings' ? 'bg-[#3CB7A9] text-white shadow-lg shadow-teal-200' : 'text-gray-500 hover:bg-slate-50'}`}><Settings size={20} /><span>Configuración</span></button>
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
            <h1 className="text-xl font-bold text-[#1E293B]">
                {activeTab === 'overview' && 'Panel Principal'}
                {activeTab === 'offers' && 'Gestión de Ofertas'}
                {activeTab === 'treepoints' && 'Programa de Puntos'}
                {activeTab === 'finance' && 'Balance y Pagos'}
                {activeTab === 'settings' && 'Perfil de Aliado'}
            </h1>
            <div className="flex items-center space-x-4">
                <button className="p-2 border rounded-full hover:bg-gray-50"><Bell size={20} className="text-gray-500"/></button>
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center font-bold text-teal-700">CP</div>
                </div>
            </div>
        </header>

        <main className="p-8 max-w-6xl mx-auto">
            {activeTab === 'overview' && (
                <div className="space-y-8">
                    {/* Welcome Banner */}
                    <div className="bg-gradient-to-r from-[#3CB7A9] to-[#2A9D8F] rounded-2xl p-8 text-white flex justify-between items-center shadow-lg relative overflow-hidden">
                        <div className="relative z-10">
                            <h2 className="text-3xl font-bold mb-2">Hola, Cinepolis</h2>
                            <p className="opacity-90 max-w-lg">Tus campañas de 'Viernes de Estreno' tienen un 24% más de conversión en usuarios con FWI alto. ¿Quieres potenciar esto?</p>
                            <button 
                                onClick={async () => {
                                    const offer = await generateSmartOffer([{title: '2x1 Entradas', conversions: 150}]);
                                    setSmartOffer(offer);
                                    setShowAiLaunchModal(true);
                                }}
                                className="mt-6 bg-white text-[#2A9D8F] px-6 py-3 rounded-xl font-bold shadow-md hover:scale-105 transition-transform flex items-center"
                            >
                                <Sparkles size={18} className="mr-2" />
                                Generar Smart Offer con IA
                            </button>
                        </div>
                        <Store size={120} className="absolute right-[-20px] bottom-[-20px] opacity-20 rotate-12" />
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div onClick={() => setActiveDetailModal('revenue')} className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase">Ingresos Totales</p>
                            <h3 className="text-3xl font-bold text-[#1E293B] mt-2">$12,450</h3>
                            <span className="text-green-500 text-xs font-bold flex items-center mt-2">+12% vs mes anterior</span>
                        </div>
                        <div onClick={() => setActiveDetailModal('conversion')} className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase">Tasa de Conversión</p>
                            <h3 className="text-3xl font-bold text-[#1E293B] mt-2">4.8%</h3>
                            <span className="text-green-500 text-xs font-bold flex items-center mt-2">+0.5% vs promedio</span>
                        </div>
                        <div onClick={() => setActiveDetailModal('points')} className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase">TreePoints Canjeados</p>
                            <h3 className="text-3xl font-bold text-[#1E293B] mt-2">8,500</h3>
                            <span className="text-gray-500 text-xs mt-2">Equivalente a $850 USD</span>
                        </div>
                         <div onClick={() => setActiveDetailModal('commissions')} className="bg-white p-6 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase">Comisiones Pendientes</p>
                            <h3 className="text-3xl font-bold text-[#1E293B] mt-2">$320.50</h3>
                            <span className="text-orange-500 text-xs font-bold mt-2">Requiere atención</span>
                        </div>
                    </div>

                    {/* Charts Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-[#1E293B] mb-6">Rendimiento de Ofertas</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={CONVERSION_TREND}>
                                        <defs>
                                            <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3CB7A9" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3CB7A9" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="rate" stroke="#3CB7A9" fillOpacity={1} fill="url(#colorRate)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm">
                            <h3 className="font-bold text-[#1E293B] mb-6">Ventas por Categoría</h3>
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={TREEPOINTS_ROI_DATA}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="category" />
                                        <YAxis />
                                        <Tooltip cursor={{fill: 'transparent'}} />
                                        <Bar dataKey="sales" fill="#1C81F2" radius={[4, 4, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'offers' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Mis Ofertas Activas</h2>
                        <button onClick={() => setShowOfferModal(true)} className="bg-[#3CB7A9] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#2A9D8F] flex items-center">
                            <Plus size={18} className="mr-2"/> Nueva Oferta
                        </button>
                    </div>
                    {/* Offers List Placeholder */}
                    <div className="bg-white p-6 rounded-xl shadow-sm text-center text-gray-500 py-12">
                        <Tag size={48} className="mx-auto mb-4 opacity-20" />
                        <p>Gestiona tus promociones activas aquí.</p>
                    </div>
                </div>
            )}

             {activeTab === 'treepoints' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">TreePoints Wallet</h2>
                        <button onClick={() => setShowPurchaseModal(true)} className="bg-[#1C81F2] text-white px-4 py-2 rounded-lg font-bold flex items-center">
                            <Plus size={18} className="mr-2"/> Recargar Puntos
                        </button>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-4">Historial de Redenciones</h3>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500"><tr><th className="p-3">Fecha</th><th className="p-3">Usuario (Hash)</th><th className="p-3">Oferta</th><th className="p-3">Puntos</th></tr></thead>
                            <tbody>
                                <tr className="border-b"><td className="p-3">Hoy</td><td className="p-3 font-mono">u_8823</td><td className="p-3">2x1 Cine</td><td className="p-3 font-bold text-red-500">-200</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'finance' && (
                 <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">Finanzas</h2>
                        <button onClick={() => setShowWithdrawModal(true)} className="border border-gray-300 px-4 py-2 rounded-lg font-bold hover:bg-gray-50">Solicitar Corte</button>
                    </div>
                    {/* Finance Content Placeholder */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-white p-6 rounded-xl shadow-sm" onClick={() => setActiveTraceModal('sales_commissions')}>
                            <h3 className="font-bold mb-4">Comisiones de Ventas</h3>
                            <p className="text-3xl font-bold">$1,240.00</p>
                        </div>
                         <div className="bg-white p-6 rounded-xl shadow-sm" onClick={() => setActiveTraceModal('redemptions')}>
                            <h3 className="font-bold mb-4">Reembolsos TreePoints</h3>
                            <p className="text-3xl font-bold">$450.00</p>
                        </div>
                    </div>
                </div>
            )}
             
            {activeTab === 'settings' && (
                <div className="space-y-4">
                     <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-4">Datos de Empresa</h3>
                        <button onClick={() => setShowKybModal(true)} className="text-blue-600 font-bold text-sm underline">Verificar Documentación KYB</button>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="font-bold mb-4">Integraciones</h3>
                        <button onClick={() => setShowConfigModal(true)} className="border p-2 rounded-lg text-sm hover:bg-gray-50">Configurar API Keys</button>
                    </div>
                </div>
            )}
        </main>
      </div>

      {/* --- MODALS SECTION --- */}

          {/* AI LAUNCH MODAL - ADDED 'X' */}
          {showAiLaunchModal && smartOffer && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200"><div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative"><button onClick={() => setShowAiLaunchModal(false)} className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"><X size={24} /></button><div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white text-center"><div className="mx-auto bg-white/20 w-12 h-12 rounded-full flex items-center justify-center mb-3 backdrop-blur-sm"><Sparkles size={24} className="text-yellow-300" /></div><h3 className="text-xl font-bold font-['Space_Grotesk']">Lanzamiento Optimizado</h3><p className="text-white/80 text-sm mt-1">Treevü Intelligence</p></div><div className="p-6"><div className="text-center mb-6"><p className="text-gray-500 text-sm mb-2">Estás a punto de activar:</p><h4 className="text-2xl font-bold text-[#1E293B] mb-1">{smartOffer.suggestedTitle}</h4><span className="inline-block bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-sm font-bold border border-purple-200">{smartOffer.suggestedDiscount}</span></div><div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 flex items-start space-x-3"><TrendingUp className="text-blue-600 flex-shrink-0 mt-1" size={20} /><div><p className="text-sm font-bold text-blue-800">Proyección de Impacto</p><p className="text-xs text-blue-700 mt-1 leading-snug">Basado en tu historial, esta oferta tiene una probabilidad del <span className="font-bold">85%</span> de superar el rendimiento de tus campañas manuales.</p></div></div><div className="space-y-3"><button onClick={handleLaunchAiOffer} className="w-full bg-[#1E293B] text-white py-3.5 rounded-xl font-bold shadow-lg hover:bg-black transition-all active:scale-95 flex items-center justify-center space-x-2"><Zap size={18} className="text-yellow-400" /><span>Activar Oferta Ahora</span></button><button onClick={() => { setShowAiLaunchModal(false); setShowOfferModal(true); }} className="w-full py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-50 transition-colors text-sm">Editar parámetros manualmente</button></div></div></div></div>)}
          
          {/* KPI DETAIL MODAL - ADDED 'X' */}
          {activeDetailModal && (<div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 ring-1 ring-black/5"><button onClick={() => setActiveDetailModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20"><X size={24}/></button><div className="p-6 border-b border-gray-100 sticky top-0 bg-white/95 backdrop-blur z-10"><h3 className="text-xl font-bold text-[#1E293B]">{activeDetailModal === 'revenue' && 'Desglose de Ingresos'}{activeDetailModal === 'conversion' && 'Tendencia de Conversión'}{activeDetailModal === 'points' && 'ROI de TreePoints'}{activeDetailModal === 'commissions' && 'Comisiones Pendientes'}</h3></div><div className="p-6">{activeDetailModal === 'revenue' && (<><div className="h-64 mb-6"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={REVENUE_BREAKDOWN} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{REVENUE_BREAKDOWN.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /><Legend /></PieChart></ResponsiveContainer></div><div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 border border-gray-200 flex items-start"><Info size={16} className="mr-2 flex-shrink-0 mt-0.5 text-blue-500"/><p><strong>Dato Clave:</strong> El 43% de tus ingresos provienen de "Flash Deals". Considera aumentar la frecuencia de estas ofertas los viernes para captar el flujo de fin de semana.</p></div></>)}{activeDetailModal === 'conversion' && (<><div className="h-64 mb-6"><ResponsiveContainer width="100%" height="100%"><LineChart data={CONVERSION_TREND}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="date" /><YAxis domain={[0, 6]} /><Tooltip /><Line type="monotone" dataKey="rate" stroke="#3CB7A9" strokeWidth={3} dot={{r:4}} /></LineChart></ResponsiveContainer></div><div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 border border-gray-200 flex items-start"><Info size={16} className="mr-2 flex-shrink-0 mt-0.5 text-blue-500"/><p><strong>Entendiendo este dato:</strong> La tasa de conversión es el porcentaje de usuarios que ven tu oferta y la canjean. Un 4.8% es superior al promedio del sector (3.2%).</p></div></>)}{activeDetailModal === 'points' && (<><div className="h-64 mb-6"><ResponsiveContainer width="100%" height="100%"><BarChart data={TREEPOINTS_ROI_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="category" /><YAxis /><Tooltip /><Legend /><Bar dataKey="redeemed" fill="#1C81F2" name="Puntos Canjeados" /><Bar dataKey="sales" fill="#3CB7A9" name="Ventas Generadas ($)" /></BarChart></ResponsiveContainer></div><div className="bg-gray-50 p-4 rounded-xl text-xs text-gray-600 border border-gray-200 flex items-start"><Info size={16} className="mr-2 flex-shrink-0 mt-0.5 text-blue-500"/><p><strong>Análisis de ROI:</strong> Por cada 1000 puntos invertidos en la categoría 'Salud', estás generando $3,000 en ventas. Es tu categoría más rentable.</p></div></>)}{activeDetailModal === 'commissions' && (<div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50 uppercase text-xs text-gray-500"><tr><th className="p-3">ID</th><th className="p-3">Origen</th><th className="p-3">Tasa</th><th className="p-3 text-right">Monto</th><th className="p-3 text-center">Acción</th></tr></thead><tbody className="divide-y">{commissionDetails.filter(c => c.status !== 'Pagado').map(c => (<tr key={c.id}><td className="p-3 font-mono text-xs">{c.id}</td><td className="p-3">{c.type}</td><td className="p-3">{c.rate}</td><td className="p-3 text-right font-bold">${c.amount}</td><td className="p-3 text-center"><button onClick={() => handleDisburse(c.id)} className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-200">Autorizar</button></td></tr>))}{commissionDetails.filter(c => c.status !== 'Pagado').length === 0 && <tr><td colSpan={5} className="p-4 text-center text-gray-400">Todo conciliado.</td></tr>}</tbody></table></div>)}</div></div></div>)}
          
          {/* ONBOARDING MODAL - ADDED 'X' */}
          {showOnboarding && (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl overflow-hidden relative"><button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"><X size={24} /></button><div className="bg-[#3CB7A9] p-8 text-center text-white sticky top-0 z-10"><Store size={48} className="mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2 font-['Space_Grotesk']">Treevü Partner Portal</h2><p className="opacity-90 font-mono text-sm">Motor de Segmentación High-FWI</p></div><div className="p-8"><p className="text-gray-600 mb-6 text-sm leading-relaxed text-justify">Maximice su ROI conectando con la fuerza laboral más solvente. Utilice este portal para desplegar <strong>Smart Offers</strong> dirigidas específicamente a segmentos de alto <strong>FWI (Financial Wellness Index)</strong>. Monitoree en tiempo real la <strong>Atribución de Ventas</strong> y optimice su inventario ofreciendo incentivos justo cuando la liquidez del usuario es óptima.</p><div className="flex space-x-4"><button onClick={() => { setShowOnboarding(false); setActiveTab('settings'); }} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50 active:scale-95 transition-transform">Configurar Pagos</button><button onClick={() => setShowOnboarding(false)} className="flex-1 bg-[#1E293B] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all active:scale-95">Acceder al Dashboard</button></div></div></div></div>)}

          {/* --- ADDED MISSING MODALS FOR MERCHANT --- */}

          {/* OFFER MODAL */}
          {showOfferModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                      <button onClick={() => setShowOfferModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      <h3 className="text-xl font-bold text-[#1E293B] mb-4">Crear Nueva Oferta</h3>
                      <div className="space-y-4">
                          <input type="text" placeholder="Título de la Oferta" className="w-full p-3 border rounded-xl" />
                          <div className="flex space-x-4">
                              <select className="flex-1 p-3 border rounded-xl"><option>Evergreen</option><option>Flash Deal</option></select>
                              <input type="text" placeholder="Descuento (ej: 20%)" className="flex-1 p-3 border rounded-xl" />
                          </div>
                          <button onClick={() => setShowOfferModal(false)} className="w-full bg-[#3CB7A9] text-white py-3 rounded-xl font-bold hover:bg-teal-600">Publicar Oferta</button>
                      </div>
                  </div>
              </div>
          )}

          {/* WITHDRAW MODAL */}
          {showWithdrawModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                      <button onClick={() => setShowWithdrawModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      <h3 className="text-xl font-bold text-[#1E293B] mb-4">Solicitar Corte de Pagos</h3>
                      <div className="text-center py-6">
                          {withdrawStep === 'amount' ? (
                              <>
                                  <p className="text-gray-500 mb-4">Saldo Disponible: $4,250.00</p>
                                  <button onClick={handleWithdrawRequest} className="bg-[#1C81F2] text-white px-6 py-3 rounded-xl font-bold w-full">Confirmar Transferencia</button>
                              </>
                          ) : (
                              <>
                                  <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                                  <p className="font-bold">Solicitud Procesada</p>
                                  <button onClick={() => setShowWithdrawModal(false)} className="mt-4 text-blue-600 font-bold">Cerrar</button>
                              </>
                          )}
                      </div>
                  </div>
              </div>
          )}

          {/* PURCHASE POINTS MODAL */}
          {showPurchaseModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl p-8 relative">
                      <button onClick={() => setShowPurchaseModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      <h3 className="text-2xl font-bold text-[#1E293B] mb-6 text-center">Recargar TreePoints</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div className="border rounded-2xl p-6 text-center hover:border-blue-500 cursor-pointer transition-all">
                              <h4 className="font-bold text-lg">Starter</h4>
                              <p className="text-3xl font-bold my-4">5,000 pts</p>
                              <p className="text-gray-500 mb-4">$50 USD</p>
                              <button className="w-full border border-blue-500 text-blue-600 font-bold py-2 rounded-lg">Seleccionar</button>
                          </div>
                          <div className="border-2 border-[#1C81F2] bg-blue-50 rounded-2xl p-6 text-center transform scale-105 shadow-lg relative">
                              <div className="absolute top-0 right-0 bg-[#1C81F2] text-white text-xs font-bold px-2 py-1 rounded-bl-lg">POPULAR</div>
                              <h4 className="font-bold text-lg text-blue-900">Growth</h4>
                              <p className="text-3xl font-bold my-4 text-blue-700">20,000 pts</p>
                              <p className="text-blue-600 mb-4">$180 USD</p>
                              <button className="w-full bg-[#1C81F2] text-white font-bold py-2 rounded-lg">Comprar Ahora</button>
                          </div>
                          <div className="border rounded-2xl p-6 text-center hover:border-blue-500 cursor-pointer transition-all">
                              <h4 className="font-bold text-lg">Enterprise</h4>
                              <p className="text-3xl font-bold my-4">50,000 pts</p>
                              <p className="text-gray-500 mb-4">$400 USD</p>
                              <button className="w-full border border-blue-500 text-blue-600 font-bold py-2 rounded-lg">Seleccionar</button>
                          </div>
                      </div>
                  </div>
              </div>
          )}

          {/* TRACE MODAL */}
          {activeTraceModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                      <button onClick={() => setActiveTraceModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      <h3 className="text-xl font-bold mb-4">{activeTraceModal === 'sales_commissions' ? 'Detalle de Comisiones' : 'Reembolsos TreePoints'}</h3>
                      <div className="space-y-3">
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm">ID: TX-991</span><span className="font-bold">$120.00</span></div>
                          <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-sm">ID: TX-992</span><span className="font-bold">$45.50</span></div>
                      </div>
                  </div>
              </div>
          )}

          {/* TP DETAIL MODAL */}
          {activeTpDetailModal && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                      <button onClick={() => setActiveTpDetailModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      <h3 className="text-xl font-bold mb-4">Detalle: {activeTpDetailModal}</h3>
                      <div className="h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400"><BarChart2 size={40} /></div>
                  </div>
              </div>
          )}

          {/* CONFIG / KYB MODALS */}
          {(showConfigModal || showKybModal) && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                      <button onClick={() => { setShowConfigModal(false); setShowKybModal(false); }} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                      <h3 className="text-xl font-bold mb-4">{showKybModal ? 'Documentación Legal (KYB)' : 'Editar Configuración'}</h3>
                      <p className="text-gray-500 text-sm">Esta sección permite actualizar los datos sensibles de la cuenta comercial.</p>
                      <div className="mt-6 flex justify-end"><button onClick={() => { setShowConfigModal(false); setShowKybModal(false); }} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-bold">Cerrar</button></div>
                  </div>
              </div>
          )}

    </div>
  );
};
