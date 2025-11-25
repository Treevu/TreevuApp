
import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { 
  ShoppingBag, 
  TrendingUp, 
  Users, 
  DollarSign, 
  CreditCard, 
  Plus, 
  Edit3, 
  Trash2,
  Target,
  LayoutDashboard,
  Tag,
  Settings,
  LogOut,
  Zap,
  Clock,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Globe,
  Building,
  Download,
  Landmark,
  Webhook,
  UserPlus,
  ArrowUpRight,
  X,
  Activity,
  Award,
  PieChart as PieChartIcon,
  Filter,
  Calendar,
  FileText,
  List,
  Search,
  ChevronRight,
  Info,
  ArrowRight,
  RefreshCw
} from 'lucide-react';

const COLORS = {
  primary: '#1C81F2',
  accent: '#3CB7A9',
  bg: '#F6FAFE',
  text: '#1E293B',
  warning: '#F59E0B'
};

const SALES_DATA = [
  { day: 'Lun', sales: 1200, clicks: 4500 },
  { day: 'Mar', sales: 1900, clicks: 5200 },
  { day: 'Mié', sales: 1500, clicks: 4800 },
  { day: 'Jue', sales: 2400, clicks: 6100 },
  { day: 'Vie', sales: 3200, clicks: 7500 },
  { day: 'Sáb', sales: 3800, clicks: 8200 },
  { day: 'Dom', sales: 3100, clicks: 7100 },
];

const FWI_SEGMENT_DATA = [
  { name: 'FWI Alto (Crecimiento)', value: 45, color: '#3CB7A9' }, // Desire purchases
  { name: 'FWI Medio (Estable)', value: 30, color: '#1C81F2' },
  { name: 'FWI Bajo (Necesidades)', value: 25, color: '#F59E0B' }, // Need purchases
];

// --- MOCK DATA FOR DRILL-DOWN MODALS (M-6) ---

const REVENUE_BREAKDOWN = [
    { type: 'Flash Deals', revenue: 7400, share: 43, growth: 18, color: '#F59E0B' },
    { type: 'Evergreen', revenue: 5200, share: 30, growth: 10, color: '#1C81F2' },
    { type: 'Corp. Benefits', revenue: 2300, share: 13, growth: 5, color: '#3CB7A9' },
    { type: 'Salud', revenue: 1100, share: 7, growth: 22, color: '#10B981' },
    { type: 'Otros', revenue: 1100, share: 7, growth: 8, color: '#64748B' },
];

const REVENUE_BY_COMPANY = [
    { name: 'Empresa A', revenue: 4500, users: 612 },
    { name: 'Empresa B', revenue: 3100, users: 489 },
    { name: 'Empresa C', revenue: 2200, users: 318 },
];

const COMMISSION_BREAKDOWN = [
    { benefit: 'Flash Deal - Electro', model: '5% Fee', redemptions: 142, generated: 355.00 },
    { benefit: 'Marketplace - Salud', model: '$1.50 CPA', redemptions: 86, generated: 129.00 },
    { benefit: 'Evergreen - Retail', model: '5% Fee', redemptions: 75, generated: 210.00 },
    { benefit: 'Beneficio Corp.', model: 'N/A', redemptions: 0, generated: 0 },
];

const COMMISSION_STATUS = [
    { id: 'C-14231', status: 'En revisión', date: '10/11', amount: 210.00 },
    { id: 'C-14252', status: 'Aprobada', date: '08/11', amount: 122.00 },
    { id: 'C-14261', status: 'Pendiente', date: '11/11', amount: 63.00 },
];

// --- NEW: MOCK DATA FOR TRACEABILITY MODALS (RN-ING-003) ---
const MOCK_COMMISSION_DETAILS = [
    { ref: 'INV-2023-881', date: '2023-10-12', amount: 1200.50, status: 'Validado por Empresa' },
    { ref: 'INV-2023-885', date: '2023-10-13', amount: 850.00, status: 'Validado por Empresa' },
    { ref: 'INV-2023-890', date: '2023-10-14', amount: 950.25, status: 'Validado por Empresa' },
    { ref: 'INV-2023-892', date: '2023-10-14', amount: 799.25, status: 'Pendiente Nómina' },
];

const MOCK_TREEPOINTS_DETAILS = [
    { concept: 'Reembolso Campaña Q3', date: '2023-10-01', amount: 250.00, status: 'Aprobado' },
    { concept: 'Incentivo Activación', date: '2023-10-05', amount: 100.00, status: 'Aprobado' },
    { concept: 'Bono Performance Sep', date: '2023-10-10', amount: 100.00, status: 'Aprobado' },
];

const ACTIVE_OFFERS = [
  { id: 1, title: 'Canasta Orgánica', discount: '$20 OFF', conversions: 412, status: 'Activa', type: 'evergreen', segment: 'Todos', expiry: 'Indefinido' },
  { id: 2, title: 'Vitaminas Premium', discount: '2x1', conversions: 128, status: 'Activa', type: 'flash', segment: 'FWI Alto', expiry: '24h Restantes' },
  { id: 3, title: 'Kit Comida Económico', discount: '50% Primera Caja', conversions: 89, status: 'Pausada', type: 'evergreen', segment: 'FWI Bajo', expiry: 'Indefinido' },
];

const TOP_COMPANIES = [
    { name: 'Acme Corp', employees: 120, conversion: '18%' },
    { name: 'Globex Inc', employees: 85, conversion: '12%' },
    { name: 'Stark Ind', employees: 40, conversion: '22%' },
];

const PAYOUT_HISTORY = [
    { id: 'TX-9926', date: '30 Dic 2023', amount: 5100.00, type: 'Liquidación Q4 Final', status: 'Pagado' },
    { id: 'TX-9925', date: '15 Dic 2023', amount: 4850.25, type: 'Comisiones Ventas', status: 'Pagado' },
    { id: 'TX-9924', date: '30 Nov 2023', amount: 4200.00, type: 'Canje TreePoints', status: 'Pagado' },
    { id: 'TX-9923', date: '15 Nov 2023', amount: 3950.50, type: 'Comisiones Ventas', status: 'Pagado' },
    { id: 'TX-9922', date: '30 Oct 2023', amount: 4100.00, type: 'Canje TreePoints', status: 'Pagado' },
    { id: 'TX-9921', date: '15 Oct 2023', amount: 4250.00, type: 'Comisiones Ventas', status: 'Pagado' },
];

export const DashboardMerchant: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'offers' | 'payments' | 'settings'>('overview');
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [newOfferType, setNewOfferType] = useState<'evergreen' | 'flash'>('evergreen');

  // DRILL-DOWN MODAL STATE
  const [activeDetailModal, setActiveDetailModal] = useState<'conversion' | 'segment' | 'points' | 'revenue' | 'commissions' | null>(null);
  
  // TRACEABILITY MODAL STATE (Balance Breakdown)
  const [activeTraceModal, setActiveTraceModal] = useState<'sales_commissions' | 'treepoints_refund' | null>(null);

  // WITHDRAWAL MODAL STATE (EWA Lite)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawStep, setWithdrawStep] = useState<'amount' | 'summary' | 'processing' | 'success'>('amount');
  const [withdrawAmount, setWithdrawAmount] = useState<number>(1000);
  const [withdrawPurpose, setWithdrawPurpose] = useState<string>('Inversión Inventario');

  // ONBOARDING STATE
  const [showOnboarding, setShowOnboarding] = useState(true);

  const MAX_BALANCE = 4250.00;

  const handleWithdrawRequest = () => {
      setWithdrawStep('processing');
      setTimeout(() => {
          setWithdrawStep('success');
      }, 2000);
  };

  const SidebarItem = ({ id, icon: Icon, label, active, onClick }: { id: string, icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
        active 
          ? 'bg-[#1C81F2] text-white shadow-md' 
          : 'text-gray-500 hover:bg-white hover:shadow-sm'
      }`}
    >
      <Icon size={20} />
      <span className="font-bold text-sm text-left">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F6FAFE] overflow-hidden">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 h-full p-6 fixed left-0 top-0 z-20">
            <div className="flex items-center space-x-2 mb-10 px-2">
                <div className="bg-[#1C81F2] p-2 rounded-lg">
                    <ShoppingBag className="text-white" size={24} />
                </div>
                <div className="leading-tight">
                    <span className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] block">Whole Foods</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Portal de Aliados</span>
                </div>
            </div>

            <nav className="flex-1 space-y-6 overflow-y-auto pr-2">
                {/* VISIBILIDAD (Estratégico) */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visibilidad</p>
                    <SidebarItem 
                        id="overview" 
                        icon={LayoutDashboard} 
                        label="Dashboard de Ingresos" 
                        active={activeTab === 'overview'} 
                        onClick={() => setActiveTab('overview')}
                    />
                </div>

                {/* OPERACIONES (Transaccional) */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operaciones</p>
                    <SidebarItem 
                        id="offers" 
                        icon={Tag} 
                        label="Gestión de Ofertas" 
                        active={activeTab === 'offers'} 
                        onClick={() => setActiveTab('offers')}
                    />
                    <SidebarItem 
                        id="payments" 
                        icon={DollarSign} 
                        label="Pagos & Anticipos" 
                        active={activeTab === 'payments'} 
                        onClick={() => setActiveTab('payments')}
                    />
                </div>

                {/* SISTEMA (Config) */}
                <div className="space-y-2">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sistema</p>
                    <SidebarItem 
                        id="settings" 
                        icon={Settings} 
                        label="Configuración de Cobro" 
                        active={activeTab === 'settings'} 
                        onClick={() => setActiveTab('settings')}
                    />
                </div>
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-200">
                <div className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-bold">
                        WF
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Socio Oro</p>
                        <p className="text-xs text-slate-500 truncate">ID: WF-8821</p>
                    </div>
                    <LogOut size={16} className="ml-auto text-gray-400 cursor-pointer hover:text-red-500" />
                </div>
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 md:ml-64 overflow-y-auto h-full scroll-smooth">
            <div className="p-6 md:p-10 font-sans">
                
                {/* --- HEADER --- */}
                <header className="mb-10 border-b border-gray-200 pb-6 flex justify-between items-end">
                    <div>
                        <div className="flex items-center space-x-2 text-gray-400 mb-1 text-sm font-bold uppercase tracking-wider">
                            <ShoppingBag size={16} />
                            <span>Portal de Aliados</span>
                        </div>
                        <h1 className="text-4xl font-bold text-[#1E293B] font-['Space_Grotesk'] tracking-tight">Whole Foods Market</h1>
                        <p className="text-gray-500 mt-2">ID Comercio: WF-8821 • Socio Nivel Oro</p>
                    </div>
                    {activeTab === 'overview' && (
                        <div className="text-right">
                            <p className="text-sm text-gray-400 font-medium">Próximo Pago</p>
                            <h2 className="text-2xl font-bold text-[#1C81F2] font-['Space_Grotesk']">$4,250.00</h2>
                            <p className="text-xs text-green-600 font-bold bg-green-50 inline-block px-2 py-1 rounded mt-1">Listo para Procesar</p>
                        </div>
                    )}
                </header>

                {/* --- VIEW: OVERVIEW --- */}
                {activeTab === 'overview' && (
                    <div className="animate-in fade-in duration-500">
                        {/* KPI Cards (Interactive M-6 Triggers) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                            
                            {/* KPI 1: Revenue (Clickable) */}
                            <div 
                                onClick={() => setActiveDetailModal('revenue')}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#1C81F2] transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-500 font-medium uppercase group-hover:text-[#1C81F2]">Ingresos Totales</p>
                                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#1C81F2] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex items-end mt-4">
                                <span className="text-3xl font-bold text-[#1E293B] font-['Space_Grotesk'] group-hover:text-[#1C81F2]">$17,100</span>
                                <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+12%</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">Click para detalle de Ecosistema</p>
                            </div>

                            {/* KPI 2: Conversion (Clickable) */}
                            <div 
                                onClick={() => setActiveDetailModal('conversion')}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#3CB7A9] transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-500 font-medium uppercase group-hover:text-[#3CB7A9]">Tasa de Conversión</p>
                                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#3CB7A9] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex items-end mt-4">
                                <span className="text-3xl font-bold text-[#1E293B] font-['Space_Grotesk'] group-hover:text-[#3CB7A9]">4.8%</span>
                                <span className="ml-2 text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">+0.5%</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">Click para detalle Flash vs Evergreen</p>
                            </div>

                            {/* KPI 3: Points (Clickable) */}
                            <div 
                                onClick={() => setActiveDetailModal('points')}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#1C81F2] transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-500 font-medium uppercase group-hover:text-[#1C81F2]">TreePoints Canjeados</p>
                                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#1C81F2] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex items-end mt-4">
                                <span className="text-3xl font-bold text-[#1E293B] font-['Space_Grotesk'] group-hover:text-[#1C81F2]">842k</span>
                                <span className="ml-2 text-xs font-bold text-[#3CB7A9] bg-teal-50 px-2 py-1 rounded-full">Alto Vol.</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">Click para análisis de ROI</p>
                            </div>

                            {/* KPI 4: Pending (Clickable) */}
                            <div 
                                onClick={() => setActiveDetailModal('commissions')}
                                className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#F59E0B] transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <p className="text-sm text-gray-500 font-medium uppercase group-hover:text-[#F59E0B]">Comisiones Pendientes</p>
                                    <ArrowUpRight size={16} className="text-gray-300 group-hover:text-[#F59E0B] opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="flex items-end mt-4">
                                <span className="text-3xl font-bold text-gray-800 font-['Space_Grotesk'] group-hover:text-[#F59E0B]">$855.00</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2">5% Tarifa Afiliado</p>
                            </div>
                        </div>

                        {/* ... Charts ... */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
                            
                            {/* Sales Performance Chart */}
                            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex justify-between items-center mb-6">
                                    <div>
                                        <h3 className="font-bold text-xl text-[#1E293B] font-['Space_Grotesk']">Analítica de Rendimiento</h3>
                                        <p className="text-sm text-gray-500">Volumen de Ventas vs. Tráfico</p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button className="px-3 py-1 text-xs font-bold bg-gray-100 rounded-md text-gray-600">7D</button>
                                        <button className="px-3 py-1 text-xs font-bold bg-white border border-gray-200 rounded-md text-gray-400">30D</button>
                                    </div>
                                </div>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={SALES_DATA}>
                                            <defs>
                                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1}/>
                                                    <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                                            <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                                            <Area type="monotone" dataKey="sales" stroke={COLORS.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* FWI Segmentation Intelligence (Clickable for Detail) */}
                            <div 
                                onClick={() => setActiveDetailModal('segment')}
                                className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-lg transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold text-xl text-[#1E293B] font-['Space_Grotesk'] group-hover:text-[#1C81F2]">Perfil del Cliente</h3>
                                    <ArrowUpRight size={20} className="text-gray-300 group-hover:text-[#1C81F2]" />
                                </div>
                                <p className="text-sm text-gray-500 mb-6">Ventas por Segmento de Bienestar (FWI)</p>
                                
                                <div className="h-48 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={FWI_SEGMENT_DATA}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={80}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {FWI_SEGMENT_DATA.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                    {/* Center Label */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                        <span className="text-3xl font-bold text-gray-800 font-['Space_Grotesk']">45%</span>
                                        <span className="text-[10px] uppercase text-gray-400 font-bold">Puntaje Alto</span>
                                    </div>
                                </div>
                                
                                <div className="mt-6 space-y-3">
                                    {FWI_SEGMENT_DATA.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-sm">
                                            <div className="flex items-center">
                                                <div className="w-3 h-3 rounded-full mr-2" style={{backgroundColor: item.color}}></div>
                                                <span className="text-gray-600">{item.name}</span>
                                            </div>
                                            <span className="font-bold text-gray-800">{item.value}%</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="mt-6 bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                                    <strong className="block mb-1 font-bold">Insight Treevü:</strong>
                                    Tu oferta "Vitaminas Premium" está impulsando alta adopción en el <span className="font-bold">Segmento de Crecimiento</span>. Considera aumentar inventario.
                                </div>
                            </div>
                        </div>

                        {/* Top Corporate Clients (Clickable for Detail) */}
                        <div 
                            onClick={() => setActiveDetailModal('segment')}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-10 cursor-pointer hover:border-gray-300 transition-colors"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-lg text-[#1E293B]">Ranking de Empresas Clientes</h3>
                                <button className="text-[#1C81F2] text-sm font-bold flex items-center">
                                    Ver reporte detallado <ArrowUpRight size={14} className="ml-1" />
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {TOP_COMPANIES.map((company, index) => (
                                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                        <div className="flex items-center space-x-3">
                                            <div className="bg-white p-2 rounded-lg border border-gray-200">
                                                <Briefcase size={20} className="text-gray-500" />
                                            </div>
                                            <div>
                                                <p className="font-bold text-[#1E293B]">{company.name}</p>
                                                <p className="text-xs text-gray-500">{company.employees} compradores</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="block font-bold text-[#3CB7A9]">{company.conversion}</span>
                                            <span className="text-[10px] text-gray-400 uppercase">Conv.</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: OFFERS (M-5) --- */}
                {activeTab === 'offers' && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        {/* Offer Management Header */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-xl text-[#1E293B] font-['Space_Grotesk']">Ofertas Activas</h3>
                                    <p className="text-sm text-gray-500">Gestiona tus campañas y promociones.</p>
                                </div>
                                <button 
                                    onClick={() => setShowOfferModal(true)}
                                    className="bg-[#3CB7A9] text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-teal-600 transition-colors shadow-lg"
                                >
                                    <Plus size={16} className="mr-2" /> Crear Nueva Oferta
                                </button>
                            </div>
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Título Oferta</th>
                                        <th className="p-4">Tipo</th>
                                        <th className="p-4">Descuento</th>
                                        <th className="p-4">Segmento</th>
                                        <th className="p-4">Expiración</th>
                                        <th className="p-4">Canjes</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4 text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {ACTIVE_OFFERS.map(offer => (
                                        <tr key={offer.id} className="hover:bg-[#F6FAFE] transition-colors">
                                            <td className="p-4 font-bold text-gray-900">{offer.title}</td>
                                            <td className="p-4">
                                                {offer.type === 'flash' ? (
                                                    <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded w-max">
                                                        <Zap size={12} className="mr-1" /> Flash
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded w-max">
                                                        <Clock size={12} className="mr-1" /> Evergreen
                                                    </span>
                                                )}
                                            </td>
                                            <td className="p-4">{offer.discount}</td>
                                            <td className="p-4">
                                                <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-600 text-xs font-bold">
                                                    <Target size={12} className="mr-1" /> {offer.segment}
                                                </span>
                                            </td>
                                            <td className="p-4 text-xs font-mono">{offer.expiry}</td>
                                            <td className="p-4 font-mono font-medium">{offer.conversions}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${offer.status === 'Activa' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {offer.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-gray-400 hover:text-[#1C81F2] mx-1"><Edit3 size={16} /></button>
                                                <button className="text-gray-400 hover:text-red-500 mx-1"><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        
                        {/* CREATE OFFER MODAL */}
                        {showOfferModal && (
                            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">Nueva Oferta / Campaña</h3>
                                        <button onClick={() => setShowOfferModal(false)} className="text-gray-400 hover:text-gray-600"><Trash2 size={24} className="rotate-45" /></button>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Tipo de Campaña</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button 
                                                    onClick={() => setNewOfferType('evergreen')}
                                                    className={`p-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${newOfferType === 'evergreen' ? 'bg-blue-50 border-[#1C81F2] text-[#1C81F2]' : 'border-gray-200 text-gray-500'}`}
                                                >
                                                    <Clock size={18} />
                                                    <span className="font-bold text-sm">Evergreen</span>
                                                </button>
                                                <button 
                                                    onClick={() => setNewOfferType('flash')}
                                                    className={`p-3 rounded-xl border flex items-center justify-center space-x-2 transition-all ${newOfferType === 'flash' ? 'bg-orange-50 border-orange-500 text-orange-600' : 'border-gray-200 text-gray-500'}`}
                                                >
                                                    <Zap size={18} />
                                                    <span className="font-bold text-sm">Flash Sale</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Título de la Oferta</label>
                                            <input type="text" placeholder="Ej: 20% OFF en primera compra" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1C81F2]" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoría</label>
                                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1C81F2]">
                                                    <option>Alimentación</option>
                                                    <option>Salud</option>
                                                    <option>Bienestar</option>
                                                    <option>Educación</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Segmento Objetivo</label>
                                                <select className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1C81F2]">
                                                    <option>Todos</option>
                                                    <option>FWI Bajo (Necesidad)</option>
                                                    <option>FWI Alto (Lujo)</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Enlace de Afiliado / Tracking</label>
                                            <div className="relative">
                                                <ExternalLink size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input type="text" placeholder="https://mitienda.com/promo?ref=treevu" className="w-full pl-9 p-3 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-[#1C81F2]" />
                                            </div>
                                        </div>

                                        <button className="w-full py-3 bg-[#1C81F2] text-white font-bold rounded-xl shadow-lg hover:bg-blue-600 transition-colors mt-4">
                                            Publicar Oferta
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* --- VIEW: PAYMENTS & FINANCE --- */}
                {activeTab === 'payments' && (
                     <div className="animate-in slide-in-from-right-4 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <h3 className="font-bold text-lg text-[#1E293B] mb-4">Balance Disponible</h3>
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-4xl font-bold text-[#1C81F2] font-['Space_Grotesk']">$4,250.00</span>
                                    <button 
                                        onClick={() => {
                                            setWithdrawAmount(1000); // reset default
                                            setWithdrawStep('amount');
                                            setShowWithdrawModal(true);
                                        }}
                                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition-colors"
                                    >
                                        Solicitar Anticipo
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {/* Row 1: Commissions (Clickable) */}
                                    <div 
                                        onClick={() => setActiveTraceModal('sales_commissions')}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors group"
                                    >
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                                            <span className="text-sm group-hover:text-[#1C81F2]">Comisiones por Ventas</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-bold text-[#1E293B]">$3,800.00</span>
                                            <ChevronRight size={16} className="ml-2 text-gray-300 group-hover:text-[#1C81F2]" />
                                        </div>
                                    </div>
                                    {/* Row 2: TreePoints (Clickable) */}
                                    <div 
                                        onClick={() => setActiveTraceModal('treepoints_refund')}
                                        className="flex justify-between items-center p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-teal-50 transition-colors group"
                                    >
                                        <div className="flex items-center text-gray-600">
                                            <span className="w-2 h-2 bg-[#3CB7A9] rounded-full mr-2"></span>
                                            <span className="text-sm group-hover:text-[#3CB7A9]">Reembolso TreePoints</span>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="font-bold text-[#1E293B]">$450.00</span>
                                            <ChevronRight size={16} className="ml-2 text-gray-300 group-hover:text-[#3CB7A9]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg text-[#1E293B] mb-1">Próxima Liquidación</h3>
                                    <p className="text-sm text-gray-500">Pago automático programado</p>
                                </div>
                                <div className="flex items-center space-x-4 mb-6">
                                    <div className="bg-blue-50 p-3 rounded-xl text-[#1C81F2]">
                                        <Calendar size={24} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-xl text-[#1E293B]">Viernes, 15 Oct</p>
                                        <p className="text-xs text-gray-500">Cuenta: Chase ****8821</p>
                                    </div>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                    <p className="text-xs text-yellow-800 font-bold mb-1 flex items-center">
                                        <Zap size={12} className="mr-1" /> Early Payment Disponible
                                    </p>
                                    <p className="text-[10px] text-yellow-700">
                                        Puedes adelantar tus fondos hoy con una tarifa del 1.5%.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-[#1E293B]">Historial de Pagos</h3>
                                <div className="flex space-x-2">
                                    <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 flex items-center">
                                        <Filter size={12} className="mr-1" /> Filtrar
                                    </button>
                                    <button className="px-3 py-1 border border-gray-200 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-50 flex items-center">
                                        <Download size={12} className="mr-1" /> Exportar
                                    </button>
                                </div>
                            </div>
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">ID Transacción</th>
                                        <th className="p-4">Fecha</th>
                                        <th className="p-4">Concepto</th>
                                        <th className="p-4">Monto</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4 text-right">Recibo</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {PAYOUT_HISTORY.map((payout) => (
                                        <tr key={payout.id} className="hover:bg-[#F6FAFE] transition-colors">
                                            <td className="p-4 font-mono text-xs">{payout.id}</td>
                                            <td className="p-4">{payout.date}</td>
                                            <td className="p-4 font-medium text-gray-800">{payout.type}</td>
                                            <td className="p-4 font-bold text-[#1E293B]">${payout.amount.toFixed(2)}</td>
                                            <td className="p-4">
                                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                                    {payout.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button className="text-gray-400 hover:text-[#1C81F2]"><FileText size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                     </div>
                )}

                {/* --- VIEW: SETTINGS --- */}
                {activeTab === 'settings' && (
                    <div className="max-w-2xl animate-in fade-in duration-500">
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-xl text-[#1E293B] mb-6">Configuración de Cuenta</h3>
                            
                            <div className="space-y-6">
                                <div className="pb-6 border-b border-gray-100">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-[#1E293B]">Cuenta Bancaria (Payouts)</h4>
                                            <p className="text-sm text-gray-500">Cuenta destino para tus comisiones.</p>
                                        </div>
                                        <button className="text-[#1C81F2] text-sm font-bold hover:underline">Editar</button>
                                    </div>
                                    <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <Landmark size={24} className="text-gray-400 mr-3" />
                                        <div>
                                            <p className="font-bold text-[#1E293B] font-mono">Chase Bank **** 8821</p>
                                            <p className="text-xs text-gray-500">Verificado • Transferencia ACH</p>
                                        </div>
                                        <CheckCircle size={16} className="text-green-500 ml-auto" />
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-bold text-[#1E293B] mb-4">Integraciones</h4>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#1C81F2] cursor-pointer transition-colors">
                                            <div className="flex items-center">
                                                <Webhook size={20} className="text-gray-400 mr-3" />
                                                <div>
                                                    <p className="font-bold text-sm text-[#1E293B]">Webhook de Ventas</p>
                                                    <p className="text-xs text-gray-500">Notificar a Treevü en tiempo real</p>
                                                </div>
                                            </div>
                                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">Activo</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-[#1C81F2] cursor-pointer transition-colors">
                                            <div className="flex items-center">
                                                <UserPlus size={20} className="text-gray-400 mr-3" />
                                                <div>
                                                    <p className="font-bold text-sm text-[#1E293B]">Gestión de Usuarios</p>
                                                    <p className="text-xs text-gray-500">3 usuarios activos</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={16} className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- DRILL-DOWN MODALS (M-6) --- */}
                
                {/* 1. Revenue Breakdown */}
                {activeDetailModal === 'revenue' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="bg-[#1E293B] p-6 flex justify-between items-center text-white">
                                <h2 className="text-xl font-bold font-['Space_Grotesk']">Desglose de Ingresos</h2>
                                <button onClick={() => setActiveDetailModal(null)}><X size={24} className="text-white/80 hover:text-white" /></button>
                            </div>
                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-4">Por Tipo de Beneficio</h4>
                                        <div className="space-y-3">
                                            {REVENUE_BREAKDOWN.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                    <div className="flex items-center">
                                                        <div className="w-3 h-3 rounded-full mr-3" style={{backgroundColor: item.color}}></div>
                                                        <span className="text-sm font-medium text-gray-700">{item.type}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-bold text-[#1E293B]">${item.revenue}</p>
                                                        <p className="text-xs text-green-600">+{item.growth}%</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-800 mb-4">Top Empresas Clientes</h4>
                                        <div className="space-y-3">
                                            {REVENUE_BY_COMPANY.map((item, idx) => (
                                                <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                                                    <div>
                                                        <p className="font-bold text-sm text-[#1E293B]">{item.name}</p>
                                                        <p className="text-xs text-gray-500">{item.users} empleados activos</p>
                                                    </div>
                                                    <span className="font-bold text-[#1C81F2]">${item.revenue}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                    <p className="text-sm text-blue-800">
                                        <strong>Insight:</strong> El 60% de tus ingresos provienen de <strong>Flash Deals</strong>. Considera lanzar una nueva oferta relámpago los viernes para maximizar la tendencia.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Pending Commissions (Debt) */}
                {activeDetailModal === 'commissions' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="bg-[#F59E0B] p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-xl font-bold font-['Space_Grotesk']">Comisiones Pendientes</h2>
                                    <p className="text-white/80 text-sm">Montos devengados por pagar a Treevü</p>
                                </div>
                                <button onClick={() => setActiveDetailModal(null)}><X size={24} className="text-white/80 hover:text-white" /></button>
                            </div>
                            <div className="p-8">
                                <div className="mb-8">
                                    <h4 className="font-bold text-gray-800 mb-4">Desglose de Deuda</h4>
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                            <tr>
                                                <th className="p-3 rounded-l-lg">Beneficio</th>
                                                <th className="p-3">Modelo</th>
                                                <th className="p-3">Redenciones</th>
                                                <th className="p-3 text-right rounded-r-lg">Comisión Generada</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {COMMISSION_BREAKDOWN.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className="p-3 font-medium text-gray-900">{item.benefit}</td>
                                                    <td className="p-3 text-gray-500">{item.model}</td>
                                                    <td className="p-3 text-gray-500">{item.redemptions}</td>
                                                    <td className="p-3 text-right font-bold text-[#1E293B]">${item.generated.toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                
                                <div>
                                    <h4 className="font-bold text-gray-800 mb-4">Estado de Liquidación</h4>
                                    <div className="space-y-2">
                                        {COMMISSION_STATUS.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                                                <div className="flex items-center space-x-4">
                                                    <span className="font-mono text-xs text-gray-400">{item.id}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        item.status === 'Aprobada' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="text-right">
                                                    <span className="block font-bold text-[#1E293B]">${item.amount.toFixed(2)}</span>
                                                    <span className="text-xs text-gray-400">{item.date}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end">
                                    <button className="bg-[#1E293B] text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-800">
                                        Pagar Total ($855.00)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Traceability Modal (Balance Breakdown) */}
                {activeTraceModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1E293B]">
                                        {activeTraceModal === 'sales_commissions' ? 'Trazabilidad: Comisiones Ventas' : 'Detalle: Reembolsos TreePoints'}
                                    </h3>
                                    <p className="text-sm text-gray-500">Fuente de datos: Validado por Empresa Cliente</p>
                                </div>
                                <button onClick={() => setActiveTraceModal(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>
                            
                            <div className="max-h-[60vh] overflow-y-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs sticky top-0">
                                        <tr>
                                            <th className="p-4">{activeTraceModal === 'sales_commissions' ? 'Ref. Factura' : 'Concepto'}</th>
                                            <th className="p-4">Fecha</th>
                                            <th className="p-4">Estado</th>
                                            <th className="p-4 text-right">Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {activeTraceModal === 'sales_commissions' ? (
                                            MOCK_COMMISSION_DETAILS.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="p-4 font-mono text-gray-600">{item.ref}</td>
                                                    <td className="p-4 text-gray-500">{item.date}</td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right font-bold text-[#1E293B]">${item.amount.toFixed(2)}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            MOCK_TREEPOINTS_DETAILS.map((item, idx) => (
                                                <tr key={idx} className="hover:bg-gray-50">
                                                    <td className="p-4 font-medium text-gray-800">{item.concept}</td>
                                                    <td className="p-4 text-gray-500">{item.date}</td>
                                                    <td className="p-4">
                                                        <span className="px-2 py-1 bg-teal-100 text-teal-700 rounded-full text-xs font-bold">
                                                            {item.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-4 text-right font-bold text-[#1E293B]">${item.amount.toFixed(2)}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                            <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center border-t border-gray-100">
                                * Los montos mostrados han sido aprobados para pago por la empresa cliente y son elegibles para anticipo.
                            </div>
                        </div>
                    </div>
                )}

                {/* EWA LITE: 3-STEP WITHDRAWAL MODAL (B2B Early Payment) */}
                {showWithdrawModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold font-['Space_Grotesk'] text-[#1E293B]">Solicitar Anticipo</h3>
                                <button onClick={() => setShowWithdrawModal(false)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>

                            {/* STEP 1: AMOUNT & PURPOSE */}
                            {withdrawStep === 'amount' && (
                                <>
                                    <div className="mb-6">
                                        <div className="flex justify-between text-xs font-bold text-gray-500 uppercase mb-2">
                                            <span>Monto a Retirar</span>
                                            <span>Máx: ${MAX_BALANCE.toFixed(2)}</span>
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-lg">$</span>
                                            <input 
                                                type="number" 
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(Math.min(MAX_BALANCE, Math.max(0, Number(e.target.value))))}
                                                className="w-full p-4 pl-8 bg-gray-50 border border-gray-200 rounded-xl text-2xl font-bold text-[#1E293B] outline-none focus:border-[#1C81F2]"
                                            />
                                        </div>
                                        <input 
                                            type="range" 
                                            min="100" 
                                            max={MAX_BALANCE} 
                                            step="50"
                                            value={withdrawAmount}
                                            onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                                            className="w-full mt-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1C81F2]"
                                        />
                                    </div>

                                    <div className="mb-6">
                                        <p className="text-xs font-bold text-gray-500 uppercase mb-2">Origen del Fondo (Transparencia)</p>
                                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 text-xs text-blue-800">
                                            El fondo proviene de <strong>Comisiones por Ventas</strong> y <strong>Reembolso TreePoints</strong> validados.
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Propósito del Retiro (FWI Data)</label>
                                        <select 
                                            value={withdrawPurpose}
                                            onChange={(e) => setWithdrawPurpose(e.target.value)}
                                            className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#1C81F2] text-sm"
                                        >
                                            <option>Inversión Inventario</option>
                                            <option>Flujo de Caja Operativo</option>
                                            <option>Pago de Proveedores</option>
                                            <option>Emergencia</option>
                                            <option>Otro</option>
                                        </select>
                                    </div>

                                    <button 
                                        onClick={() => setWithdrawStep('summary')}
                                        className="w-full bg-[#1C81F2] text-white font-bold py-3 rounded-xl hover:bg-blue-600 shadow-lg transition-colors flex justify-center items-center"
                                    >
                                        Continuar <ArrowRight size={18} className="ml-2" />
                                    </button>
                                </>
                            )}

                            {/* STEP 2: SUMMARY & FEES */}
                            {withdrawStep === 'summary' && (
                                <>
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-6">
                                        <h4 className="font-bold text-[#1E293B] mb-4">Resumen de Transacción</h4>
                                        <div className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Monto Solicitado</span>
                                                <span className="font-bold text-[#1E293B]">${withdrawAmount.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-500">Tarifa Servicio (1.5%)</span>
                                                <span className="font-bold text-red-500">-${(withdrawAmount * 0.015).toFixed(2)}</span>
                                            </div>
                                            <div className="border-t border-gray-200 pt-3 flex justify-between text-base">
                                                <span className="font-bold text-gray-800">Neto a Recibir</span>
                                                <span className="font-bold text-[#1C81F2]">${(withdrawAmount * 0.985).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 mb-8 flex items-start">
                                        <Info size={18} className="text-orange-500 mr-3 mt-0.5" />
                                        <p className="text-xs text-orange-800 leading-relaxed">
                                            <strong>Nota:</strong> Al confirmar, estás cediendo el derecho de cobro de estas facturas a cambio de liquidez inmediata. Esta acción es irrevocable.
                                        </p>
                                    </div>

                                    <button 
                                        onClick={handleWithdrawRequest}
                                        className="w-full bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-slate-800 shadow-lg transition-colors"
                                    >
                                        Confirmar y Enviar a EMPRESA
                                    </button>
                                </>
                            )}

                            {/* PROCESSING STATE */}
                            {withdrawStep === 'processing' && (
                                <div className="py-10 text-center">
                                    <RefreshCw className="animate-spin text-[#1C81F2] mx-auto mb-4" size={48} />
                                    <h3 className="font-bold text-lg text-gray-800">Enrutando Solicitud...</h3>
                                    <p className="text-sm text-gray-500">Conectando con Tesorería de Whole Foods HQ.</p>
                                </div>
                            )}

                            {/* STEP 3: SUCCESS & ROUTING CONFIRMATION */}
                            {withdrawStep === 'success' && (
                                <div className="text-center py-4">
                                    <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="font-bold text-xl text-[#1E293B] mb-2">¡Solicitud Recibida!</h3>
                                    
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-6 text-left">
                                        <h4 className="font-bold text-blue-900 text-sm mb-2 flex items-center">
                                            <Webhook size={16} className="mr-2" /> Estado del Enrutamiento
                                        </h4>
                                        <p className="text-xs text-blue-800 leading-relaxed">
                                            Treevü ha enrutado su solicitud a <strong>Whole Foods Market Inc.</strong> para su procesamiento. 
                                            La transferencia final de <strong>${(withdrawAmount * 0.985).toFixed(2)}</strong> será realizada directamente por su EMPRESA a su cuenta registrada: <strong>Chase Bank **** 8821</strong>.
                                        </p>
                                    </div>

                                    <p className="text-xs text-gray-400 mb-6">
                                        Tiempo estimado: Próximo corte bancario (14:00 hrs).
                                    </p>

                                    <button onClick={() => setShowWithdrawModal(false)} className="w-full bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200">
                                        Ir al Historial
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ONBOARDING MODAL (B2B EARLY PAYMENT) */}
                {showOnboarding && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                            <div className="bg-green-600 p-8 text-white flex flex-col justify-center md:w-2/5 relative overflow-hidden">
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                                <DollarSign size={48} className="mb-6 relative z-10 text-green-200" />
                                <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-2 relative z-10">Tu Portal de Ingresos</h2>
                                <p className="text-green-100 text-sm relative z-10">Visibilidad y Anticipos B2B</p>
                            </div>
                            <div className="p-8 md:w-3/5 bg-white">
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    Estimado Aliado <strong>Whole Foods</strong>, su EMPRESA cliente ha implementado Treevü para darle control total sobre sus Cuentas por Cobrar. 
                                </p>
                                
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                                    <h4 className="text-sm font-bold text-green-900 mb-2">Modelo EWA Lite B2B:</h4>
                                    <ul className="space-y-2">
                                        <li className="flex items-start text-xs text-green-800">
                                            <CheckCircle size={14} className="mr-2 mt-0.5" />
                                            <span><strong>Visibilidad:</strong> Vea sus facturas y comisiones validadas en tiempo real.</span>
                                        </li>
                                        <li className="flex items-start text-xs text-green-800">
                                            <CheckCircle size={14} className="mr-2 mt-0.5" />
                                            <span><strong>Early Payment:</strong> Solicite el pago anticipado de sus fondos elegibles. Treevü enruta la solicitud a la empresa.</span>
                                        </li>
                                    </ul>
                                </div>

                                <p className="text-xs text-gray-500 mb-6">
                                    <strong>Nota:</strong> La EMPRESA cliente es la única responsable del desembolso final a su cuenta registrada.
                                </p>

                                <button onClick={() => setShowOnboarding(false)} className="w-full bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                                    Ver Fondos Pendientes
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </main>
    </div>
  );
};
