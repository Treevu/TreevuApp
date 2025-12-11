import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area, ZAxis } from 'recharts';
import { Store, ArrowUpRight, ToggleLeft, ToggleRight, Plus, AlertTriangle, CheckCircle, Clock, X, Filter, PieChart as PieChartIcon, BarChart2, Settings, LogOut, FileBarChart, Database, Shield, Server, Layers, ShieldCheck, MousePointer, Maximize2, Link, TrendingUp, DollarSign, Inbox, ClipboardCheck, Download, FileText, UserCheck, XCircle, RefreshCw, Briefcase, Users, ChevronDown, Info, Award, Leaf, Gift, Tag, Search, Mail, MapPin, Zap, MessageSquare, BookOpen, Ban, FileSearch, Target, Menu, Lock } from 'lucide-react';
import { EmployeeRisk, RiskCluster, TreePointStats, TreePointHeatmap, TreePointIssuance, MerchantProfile } from '../types';

// --- MOCK DATA ---

const FWI_TREND_DATA = [
  { month: 'Ene', score: 68 }, { month: 'Feb', score: 69 }, { month: 'Mar', score: 71 },
  { month: 'Abr', score: 70 }, { month: 'May', score: 73 }, { month: 'Jun', score: 76 }
];

const SAVINGS_BY_DEPT_DATA = [
  { name: 'Ventas', value: 12500 },
  { name: 'TI', value: 8200 },
  { name: 'Ops', value: 15600 },
  { name: 'Admin', value: 4500 }
];

const ADOPTION_DATA = [
  { name: 'Activos', value: 65, color: '#3CB7A9' },
  { name: 'Inactivos', value: 35, color: '#E2E8F0' }
];

const ENGAGEMENT_RADAR_DATA = [
  { subject: 'EWA', A: 120, fullMark: 150 },
  { subject: 'Ahorro', A: 98, fullMark: 150 },
  { subject: 'Metas', A: 86, fullMark: 150 },
  { subject: 'Cursos', A: 99, fullMark: 150 },
  { subject: 'Offers', A: 85, fullMark: 150 },
  { subject: 'Salud', A: 65, fullMark: 150 },
];

const RISKS: EmployeeRisk[] = [
  { id: 'r1', name: 'Ana Gomez', department: 'Ventas', fwiScore: 45, absenteeismRisk: 'High', ewaFrequency: 4, workModality: 'Remote', age: 29, tenure: 2 },
  { id: 'r2', name: 'Luis Perez', department: 'Operaciones', fwiScore: 52, absenteeismRisk: 'Medium', ewaFrequency: 2, workModality: 'On-site', age: 34, tenure: 5 },
  { id: 'r3', name: 'Maria Rodriguez', department: 'IT', fwiScore: 38, absenteeismRisk: 'Critical', ewaFrequency: 5, workModality: 'Hybrid', age: 26, tenure: 1 },
];

const PARTNERS: MerchantProfile[] = [
  { id: 'p1', name: 'Cinepolis', level: 'Gold', role: 'VIEWER' },
  { id: 'p2', name: 'Uber Eats', level: 'Silver', role: 'VIEWER' },
  { id: 'p3', name: 'SmartFit', level: 'Bronze', role: 'VIEWER' }
];

export const DashboardB2B: React.FC = () => {
    const [activeTab, setActiveTab] = useState('risk');
    const [showOnboarding, setShowOnboarding] = useState(true);

    // KPI Modal
    const [activeKpiModal, setActiveKpiModal] = useState<'fwi' | 'savings' | 'adoption' | 'engagement' | null>(null);

    // Bridge / Analysis
    const [showBridgeModal, setShowBridgeModal] = useState(false);
    const correlation = 0.78; // Mock correlation coefficient

    // TreePoints Issuance
    const [showIssueModal, setShowIssueModal] = useState(false);
    const [issueStep, setIssueStep] = useState<'form' | 'processing' | 'success'>('form');
    const [issueForm, setIssueForm] = useState<TreePointIssuance>({
        targetType: 'Department',
        targetId: '',
        amount: 0,
        reason: ''
    });

    // Modals
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [activeTpModal, setActiveTpModal] = useState<'issuance' | 'redemption' | 'budget' | null>(null);
    const [activeConfigModal, setActiveConfigModal] = useState<'mapping' | 'payroll' | null>(null);
    const [activePartnerStatsModal, setActivePartnerStatsModal] = useState<string | null>(null);
    const [activePartnerModal, setActivePartnerModal] = useState<MerchantProfile | null>(null);
    const [activeFinanceModal, setActiveFinanceModal] = useState<'receivable' | 'deductions' | null>(null);
    const [activeInterventionModal, setActiveInterventionModal] = useState<any | null>(null);
    const [interventionStep, setInterventionStep] = useState<'select' | 'processing' | 'success'>('select');

    // --- HANDLERS ---

    const handleIssuePoints = () => {
        setIssueStep('processing');
        setTimeout(() => setIssueStep('success'), 1500);
    };

    const handleInterventionSubmit = () => {
        setInterventionStep('processing');
        setTimeout(() => setInterventionStep('success'), 1500);
    };

    return (
    <div className="flex h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-[#0F172A] text-white p-6">
        <div className="flex items-center space-x-2 mb-10 text-white">
          <ShieldCheck size={28} className="text-[#3CB7A9]" />
          <span className="text-2xl font-bold font-['Space_Grotesk']">Treevü B2B</span>
        </div>
        
        <nav className="space-y-2">
            <button onClick={() => setActiveTab('risk')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'risk' ? 'bg-[#1E293B] text-[#3CB7A9] font-bold border border-[#3CB7A9]/30' : 'text-gray-400 hover:bg-[#1E293B]/50'}`}><BarChart2 size={20} /><span>Risk Intelligence</span></button>
            <button onClick={() => setActiveTab('requests')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'requests' ? 'bg-[#1E293B] text-[#3CB7A9] font-bold border border-[#3CB7A9]/30' : 'text-gray-400 hover:bg-[#1E293B]/50'}`}><Inbox size={20} /><span>Solicitudes EWA</span></button>
            <button onClick={() => setActiveTab('treepoints')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'treepoints' ? 'bg-[#1E293B] text-[#3CB7A9] font-bold border border-[#3CB7A9]/30' : 'text-gray-400 hover:bg-[#1E293B]/50'}`}><Gift size={20} /><span>TreePoints Manager</span></button>
            <button onClick={() => setActiveTab('partners')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'partners' ? 'bg-[#1E293B] text-[#3CB7A9] font-bold border border-[#3CB7A9]/30' : 'text-gray-400 hover:bg-[#1E293B]/50'}`}><Store size={20} /><span>Aliados Comerciales</span></button>
            <button onClick={() => setActiveTab('finance')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'finance' ? 'bg-[#1E293B] text-[#3CB7A9] font-bold border border-[#3CB7A9]/30' : 'text-gray-400 hover:bg-[#1E293B]/50'}`}><FileText size={20} /><span>Conciliación</span></button>
            <button onClick={() => setActiveTab('config')} className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all ${activeTab === 'config' ? 'bg-[#1E293B] text-[#3CB7A9] font-bold border border-[#3CB7A9]/30' : 'text-gray-400 hover:bg-[#1E293B]/50'}`}><Settings size={20} /><span>Configuración</span></button>
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-[#1E293B]">
                {activeTab === 'risk' && 'Monitor de Riesgo Operativo'}
                {activeTab === 'requests' && 'Centro de Aprobaciones'}
                {activeTab === 'treepoints' && 'Gestión de Incentivos'}
                {activeTab === 'partners' && 'Red de Beneficios'}
                {activeTab === 'finance' && 'Conciliación Financiera'}
                {activeTab === 'config' && 'Ajustes del Sistema'}
            </h1>
            <div className="flex items-center space-x-4">
                <div className="text-right">
                    <p className="text-xs text-gray-400 uppercase font-bold">Próximo Corte</p>
                    <p className="text-sm font-bold text-[#1E293B]">15 Oct - 23:59</p>
                </div>
            </div>
        </header>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-8">
            {activeTab === 'risk' && (
                <div className="space-y-8">
                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div onClick={() => setActiveKpiModal('fwi')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-[#3CB7A9] transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-2">FWI Promedio Corporativo</p>
                            <h3 className="text-3xl font-bold text-[#1E293B]">76/100</h3>
                            <span className="text-green-500 text-xs font-bold flex items-center mt-2"><TrendingUp size={14} className="mr-1"/> +2.4% vs mes anterior</span>
                        </div>
                        <div onClick={() => setActiveKpiModal('savings')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-[#3CB7A9] transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Ahorro en Intereses (Est.)</p>
                            <h3 className="text-3xl font-bold text-[#1E293B]">$42,800</h3>
                            <span className="text-green-500 text-xs font-bold flex items-center mt-2"><TrendingUp size={14} className="mr-1"/> Evitado a empleados</span>
                        </div>
                        <div onClick={() => setActiveKpiModal('adoption')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-[#3CB7A9] transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Adopción EWA</p>
                            <h3 className="text-3xl font-bold text-[#1E293B]">65%</h3>
                            <span className="text-gray-500 text-xs mt-2">de la plantilla elegible</span>
                        </div>
                        <div onClick={() => setActiveKpiModal('engagement')} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 cursor-pointer hover:border-[#3CB7A9] transition-all">
                            <p className="text-gray-400 text-xs font-bold uppercase mb-2">Engagement Index</p>
                            <h3 className="text-3xl font-bold text-[#1E293B]">High</h3>
                            <span className="text-blue-500 text-xs font-bold flex items-center mt-2">Top 10% industria</span>
                        </div>
                    </div>

                    {/* Bridge Button */}
                    <div className="flex justify-end">
                        <button onClick={() => setShowBridgeModal(true)} className="flex items-center space-x-2 text-[#3CB7A9] font-bold bg-[#3CB7A9]/10 px-4 py-2 rounded-lg hover:bg-[#3CB7A9]/20 transition-colors">
                            <PieChartIcon size={18} />
                            <span>Ver Performance Bridge</span>
                        </button>
                    </div>

                    {/* Risk Table */}
                    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="font-bold text-[#1E293B]">Alertas de Riesgo de Retención</h3>
                            <div className="flex space-x-2">
                                <button className="p-2 border rounded-lg hover:bg-gray-50"><Filter size={18} className="text-gray-500" /></button>
                                <button className="p-2 border rounded-lg hover:bg-gray-50"><Download size={18} className="text-gray-500" /></button>
                            </div>
                        </div>
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 text-xs text-gray-500 uppercase">
                                <tr>
                                    <th className="p-4">Empleado</th>
                                    <th className="p-4">Depto</th>
                                    <th className="p-4">FWI</th>
                                    <th className="p-4">Riesgo Absentismo</th>
                                    <th className="p-4">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {RISKS.map(risk => (
                                    <tr key={risk.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 font-medium text-[#1E293B]">{risk.name}</td>
                                        <td className="p-4 text-gray-500">{risk.department}</td>
                                        <td className="p-4"><span className={`font-bold ${risk.fwiScore < 50 ? 'text-red-500' : 'text-orange-500'}`}>{risk.fwiScore}</span></td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${risk.absenteeismRisk === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'}`}>{risk.absenteeismRisk}</span></td>
                                        <td className="p-4">
                                            <button onClick={() => { setActiveInterventionModal({ department: risk.department }); setInterventionStep('select'); }} className="text-[#3CB7A9] hover:underline font-bold text-sm">Intervenir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'treepoints' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-[#1E293B]">Gestión de TreePoints</h2>
                        <button onClick={() => setShowIssueModal(true)} className="bg-[#3CB7A9] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#2A9D8F] flex items-center">
                            <Plus size={18} className="mr-2"/> Emitir Puntos
                        </button>
                    </div>
                    {/* Add chart logic for TreePoints here if needed */}
                </div>
            )}

            {activeTab === 'partners' && (
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                         <h2 className="text-2xl font-bold text-[#1E293B]">Aliados</h2>
                         <button onClick={() => setShowInviteModal(true)} className="bg-[#1C81F2] text-white px-4 py-2 rounded-lg font-bold flex items-center"><UserPlus size={18} className="mr-2"/> Invitar Aliado</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {PARTNERS.map(p => (
                            <div key={p.id} onClick={() => setActivePartnerModal(p)} className="bg-white p-6 rounded-xl border shadow-sm cursor-pointer hover:shadow-md">
                                <h3 className="font-bold text-lg">{p.name}</h3>
                                <p className="text-sm text-gray-500">{p.level}</p>
                                <button onClick={(e) => { e.stopPropagation(); setActivePartnerStatsModal(p.name); }} className="mt-4 text-blue-600 text-sm font-bold hover:underline">Ver Stats</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            
            {/* Simple Placeholders for other tabs */}
            {activeTab === 'requests' && <div className="p-12 text-center text-gray-400">Módulo de Solicitudes (Demo Placeholder)</div>}
            {activeTab === 'finance' && (
                <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4">Conciliación</h3>
                    <div className="flex space-x-4">
                        <button onClick={() => setActiveFinanceModal('receivable')} className="p-4 border rounded-xl hover:bg-gray-50 w-1/2">Cuentas por Cobrar</button>
                        <button onClick={() => setActiveFinanceModal('deductions')} className="p-4 border rounded-xl hover:bg-gray-50 w-1/2">Reporte de Deducciones</button>
                    </div>
                </div>
            )}
            {activeTab === 'config' && (
                <div className="p-6 bg-white rounded-xl shadow-sm">
                    <h3 className="font-bold mb-4">Configuración del Sistema</h3>
                    <div className="space-y-3">
                        <button onClick={() => setActiveConfigModal('mapping')} className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">Mapeo de Estructura</button>
                        <button onClick={() => setActiveConfigModal('payroll')} className="w-full text-left p-3 border rounded-lg hover:bg-gray-50">Reglas de Nómina</button>
                    </div>
                </div>
            )}
        </main>
      </div>

        {/* KPI MODAL */}
        {activeKpiModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200 ring-1 ring-black/5"><button onClick={() => setActiveKpiModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24}/></button><div className="p-6 border-b border-gray-100"><h3 className="text-xl font-bold text-[#1E293B]">{activeKpiModal === 'fwi' && 'Tendencia Histórica: FWI Score'}{activeKpiModal === 'savings' && 'Ahorro Corporativo por Departamento'}{activeKpiModal === 'adoption' && 'Tasa de Adopción Real'}{activeKpiModal === 'engagement' && 'Niveles de Compromiso 360°'}</h3></div><div className="p-6">{activeKpiModal === 'fwi' && (<div className="h-64"><ResponsiveContainer width="100%" height="100%"><LineChart data={FWI_TREND_DATA}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis domain={[0, 100]} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#1E293B" strokeWidth={3} dot={{r:4}} activeDot={{r:6}} /></LineChart></ResponsiveContainer><p className="text-xs text-gray-500 mt-4 text-center"><span className="font-bold text-[#1E293B]">Insight de Tendencia:</span> La correlación entre la mejora del FWI (+8%) y la reducción de solicitudes de anticipo indica un aumento en la resiliencia financiera del personal.</p></div>)}{activeKpiModal === 'savings' && (<div className="h-64"><ResponsiveContainer width="100%" height="100%"><BarChart data={SAVINGS_BY_DEPT_DATA} layout="vertical"><CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} /><XAxis type="number" hide /><YAxis dataKey="name" type="category" width={80} tick={{fontSize: 12}} /><Tooltip cursor={{fill: 'transparent'}} /><Bar dataKey="value" fill="#3CB7A9" radius={[0, 4, 4, 0]} barSize={20} /></BarChart></ResponsiveContainer><p className="text-xs text-gray-500 mt-4 text-center"><span className="font-bold text-[#1E293B]">Cálculo de Impacto:</span> Ahorro estimado basado en tasas de interés de mercado evitadas (APR promedio 300% en préstamos predatorios).</p></div>)}{activeKpiModal === 'adoption' && (<div className="h-64 flex items-center justify-center"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={ADOPTION_DATA} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{ADOPTION_DATA.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip /><Legend verticalAlign="bottom" height={36}/></PieChart></ResponsiveContainer></div>)}{activeKpiModal === 'engagement' && (<div className="h-64"><ResponsiveContainer width="100%" height="100%"><RadarChart cx="50%" cy="50%" outerRadius="80%" data={ENGAGEMENT_RADAR_DATA}><PolarGrid /><PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} /><PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} /><Radar name="Engagement" dataKey="A" stroke="#1C81F2" fill="#1C81F2" fillOpacity={0.4} /><Tooltip /></RadarChart></ResponsiveContainer></div>)}</div></div></div>)}
        
        {/* PERFORMANCE BRIDGE MODAL */}
        {showBridgeModal && (<div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl p-6 relative overflow-hidden"><button onClick={() => setShowBridgeModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button><div className="mb-6"><h3 className="text-2xl font-bold text-[#1E293B] font-['Space_Grotesk'] mb-2">Análisis de Impacto: Performance Bridge</h3><p className="text-gray-500 text-sm">Entendiendo la correlación entre Bienestar Financiero y Riesgo Operativo.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"><div className="p-4 bg-blue-50 rounded-xl border border-blue-100"><h4 className="font-bold text-blue-800 text-sm mb-2">¿Cómo se lee este gráfico?</h4><ul className="text-xs text-blue-700 space-y-2"><li className="flex items-start"><span className="mr-2">•</span><strong>Eje X (FWI):</strong> Score de bienestar financiero (0-100). Más alto es mejor.</li><li className="flex items-start"><span className="mr-2">•</span><strong>Eje Y (Absentismo):</strong> Días de ausencia no programada en los últimos 6 meses.</li><li className="flex items-start"><span className="mr-2">•</span><strong>Tendencia Ideal:</strong> Queremos ver puntos agrupados en la esquina inferior derecha (Alto FWI, Bajo Absentismo).</li></ul></div><div className="p-4 bg-orange-50 rounded-xl border border-orange-100"><h4 className="font-bold text-orange-800 text-sm mb-2">Interpretación de Cuadrantes</h4><div className="space-y-2"><div className="flex justify-between text-xs border-b border-orange-200 pb-1"><span className="font-bold text-orange-700">Zona de Riesgo (Sup. Izq)</span><span className="text-orange-600">Bajo FWI / Alto Absentismo</span></div><div className="flex justify-between text-xs border-b border-orange-200 pb-1"><span className="font-bold text-green-700">Zona de Alto Rendimiento (Inf. Der)</span><span className="text-green-600">Alto FWI / Bajo Absentismo</span></div></div></div></div><div className="bg-gray-50 p-6 rounded-xl border border-gray-200 text-center"><p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Conclusión Ejecutiva (IA Generated)</p><p className="text-lg text-[#1E293B] font-medium leading-relaxed">"La correlación actual de <span className="font-bold text-[#1C81F2]">{correlation.toFixed(2)}</span> indica un vínculo significativo. Reducir el estrés financiero en el departamento de <span className="font-bold">Ventas</span> podría disminuir el absentismo en un estimado del <span className="font-bold text-green-600">15%</span> en el próximo trimestre."</p></div><div className="mt-6 flex justify-end"><button onClick={() => setShowBridgeModal(false)} className="bg-[#1C81F2] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-600 transition-all active:scale-95">Entendido</button></div></div></div>)}
        
        {/* ONBOARDING MODAL - ADDED 'X' */}
        {showOnboarding && (<div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto scrollbar-hide rounded-2xl shadow-2xl overflow-hidden relative"><button onClick={() => setShowOnboarding(false)} className="absolute top-4 right-4 text-white hover:text-gray-200 z-20"><X size={24} /></button><div className="bg-[#1C81F2] p-8 text-center text-white sticky top-0 z-10"><PieChartIcon size={48} className="mx-auto mb-4" /><h2 className="text-2xl font-bold mb-2">Treevü Intelligence Suite</h2><p className="opacity-90 font-mono text-sm">Centro de Comando de Riesgo y Liquidez</p></div><div className="p-8"><p className="text-gray-600 mb-6 text-sm leading-relaxed text-justify">Bienvenido a su torre de control para la <strong>Gestión de Riesgo Operativo y Bienestar Financiero</strong>. Treevü correlaciona la salud financiera de su fuerza laboral (FWI) con datos de retención y absentismo. Utilice este dashboard para supervisar los flujos de liquidez EWA (Earned Wage Access) sin impactar su flujo de caja y despliegue intervenciones basadas en datos para mitigar la rotación en clústeres críticos.</p><button onClick={() => setShowOnboarding(false)} className="w-full bg-[#1E293B] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all active:scale-95">Acceder al Panel de Control</button></div></div></div>)}

        {/* --- ADDED MISSING MODALS FOR B2B --- */}

        {/* ISSUE POINTS MODAL */}
        {showIssueModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setShowIssueModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Emitir TreePoints</h3><p className="text-sm text-gray-500">Incentivos para bienestar y productividad.</p></div>
                    {issueStep === 'form' ? (
                        <>
                            <div className="space-y-4 mb-6">
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Tipo de Emisión</label><select className="w-full p-2 border rounded-lg text-sm" value={issueForm.targetType} onChange={e => setIssueForm({...issueForm, targetType: e.target.value as any})}><option value="Department">Por Departamento</option><option value="Individual">Individual</option></select></div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Destinatario</label><input type="text" className="w-full p-2 border rounded-lg text-sm" value={issueForm.targetId} onChange={e => setIssueForm({...issueForm, targetId: e.target.value})} placeholder="Ej: Ventas o ID Empleado" /></div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Monto (pts)</label><input type="number" className="w-full p-2 border rounded-lg text-sm" value={issueForm.amount} onChange={e => setIssueForm({...issueForm, amount: Number(e.target.value)})} /></div>
                                <div><label className="block text-xs font-bold text-gray-500 mb-1">Motivo</label><input type="text" className="w-full p-2 border rounded-lg text-sm" value={issueForm.reason} onChange={e => setIssueForm({...issueForm, reason: e.target.value})} placeholder="Ej: Bono Trimestral" /></div>
                            </div>
                            <button onClick={handleIssuePoints} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold shadow-md hover:bg-blue-600 active:scale-95 transition-transform">Emitir Puntos</button>
                        </>
                    ) : (
                        <div className="text-center py-8">
                            {issueStep === 'processing' ? <RefreshCw className="animate-spin mx-auto mb-4 text-[#1C81F2]" size={40} /> : <CheckCircle className="mx-auto mb-4 text-green-500" size={40} />}
                            <p className="font-bold text-gray-800">{issueStep === 'processing' ? 'Procesando emisión...' : '¡Puntos Emitidos con Éxito!'}</p>
                            {issueStep === 'success' && <button onClick={() => setShowIssueModal(false)} className="mt-4 text-blue-600 font-bold underline">Cerrar</button>}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* INVITE PARTNER MODAL */}
        {showInviteModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <div className="text-center mb-6"><div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3"><Store size={24} className="text-[#1C81F2]" /></div><h3 className="text-xl font-bold text-[#1E293B]">Invitar Aliado Comercial</h3><p className="text-sm text-gray-500">Expande la red de beneficios corporativos.</p></div>
                    <input type="email" placeholder="Correo electrónico del contacto" className="w-full p-3 border rounded-xl mb-4" />
                    <button onClick={() => setShowInviteModal(false)} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold hover:bg-blue-600 active:scale-95 transition-transform">Enviar Invitación</button>
                </div>
            </div>
        )}

        {/* TREEPOINTS DETAIL MODAL */}
        {activeTpModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveTpModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <h3 className="text-xl font-bold mb-4">{activeTpModal === 'issuance' ? 'Detalle de Emisión' : activeTpModal === 'redemption' ? 'Análisis de Redención' : 'Uso de Presupuesto'}</h3>
                    <div className="h-48 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 text-gray-400 mb-4"><PieChartIcon size={48} className="opacity-20" /></div>
                    <p className="text-sm text-gray-600">Este modal mostraría el desglose detallado de {activeTpModal} por departamento y tendencia histórica.</p>
                </div>
            </div>
        )}

        {/* CONFIG MODAL */}
        {activeConfigModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveConfigModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <h3 className="text-xl font-bold mb-4">{activeConfigModal === 'mapping' ? 'Mapeo de Estructura Organizacional' : 'Reglas de Nómina'}</h3>
                    <div className="space-y-4">
                        <div className="p-4 border rounded-xl bg-gray-50"><div className="flex justify-between items-center mb-2"><span className="font-bold text-sm">Estado de Sincronización</span><span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-bold">Activo</span></div><p className="text-xs text-gray-500">Última actualización: Hace 5 minutos desde SAP/Workday.</p></div>
                        <button className="w-full border border-gray-300 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-50">Forzar Sincronización</button>
                    </div>
                </div>
            </div>
        )}

        {/* PARTNER STATS MODAL */}
        {activePartnerStatsModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActivePartnerStatsModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <h3 className="text-xl font-bold mb-4">Métricas de Aliado: {activePartnerStatsModal}</h3>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4"><p className="text-sm text-blue-800">El engagement de los empleados con los beneficios de {activePartnerStatsModal} ha aumentado un 15% este mes.</p></div>
                </div>
            </div>
        )}

        {/* PARTNER MANAGEMENT MODAL */}
        {activePartnerModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActivePartnerModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <h3 className="text-xl font-bold mb-2">{activePartnerModal.name}</h3>
                    <p className="text-sm text-gray-500 mb-4">{activePartnerModal.level} • {activePartnerModal.role}</p>
                    <div className="space-y-3">
                        <button className="w-full py-2 border rounded-lg font-bold text-gray-600 hover:bg-gray-50">Ver Reporte de Desempeño</button>
                        <button className="w-full py-2 border border-red-200 text-red-600 rounded-lg font-bold hover:bg-red-50">Desactivar Aliado</button>
                    </div>
                </div>
            </div>
        )}

        {/* FINANCE DETAILS MODAL */}
        {activeFinanceModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveFinanceModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <h3 className="text-xl font-bold mb-4">{activeFinanceModal === 'receivable' ? 'Detalle de Cuentas por Cobrar' : 'Pre-Nómina: Deducciones'}</h3>
                    <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead className="bg-gray-50"><tr><th className="p-2">ID Empleado</th><th className="p-2 text-right">Monto</th></tr></thead><tbody><tr><td className="p-2">EMP-1001</td><td className="p-2 text-right">$150.00</td></tr><tr><td className="p-2">EMP-1023</td><td className="p-2 text-right">$50.00</td></tr></tbody></table></div>
                </div>
            </div>
        )}

        {/* INTERVENTION MODAL */}
        {activeInterventionModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveInterventionModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <div className="mb-4"><h3 className="text-xl font-bold text-[#1E293B]">Intervención: {activeInterventionModal.department}</h3><p className="text-sm text-gray-500">Selecciona una estrategia para reducir el riesgo de rotación.</p></div>
                    {interventionStep === 'select' ? (
                        <div className="space-y-3">
                            <button onClick={handleInterventionSubmit} className="w-full text-left p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-200 transition-all group"><h4 className="font-bold text-[#1E293B] group-hover:text-blue-700">Campaña Educativa</h4><p className="text-xs text-gray-500">Enviar contenido sobre bienestar financiero.</p></button>
                            <button onClick={handleInterventionSubmit} className="w-full text-left p-4 border rounded-xl hover:bg-green-50 hover:border-green-200 transition-all group"><h4 className="font-bold text-[#1E293B] group-hover:text-green-700">Bono de Retención (TreePoints)</h4><p className="text-xs text-gray-500">Incentivo económico directo.</p></button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            {interventionStep === 'processing' ? <RefreshCw className="animate-spin mx-auto mb-4 text-[#1C81F2]" size={40} /> : <CheckCircle className="mx-auto mb-4 text-green-500" size={40} />}
                            <p className="font-bold text-gray-800">{interventionStep === 'processing' ? 'Desplegando intervención...' : 'Estrategia Activada'}</p>
                            {interventionStep === 'success' && <button onClick={() => setActiveInterventionModal(null)} className="mt-4 text-blue-600 font-bold underline">Cerrar</button>}
                        </div>
                    )}
                </div>
            </div>
        )}

    </div>
  );
};
