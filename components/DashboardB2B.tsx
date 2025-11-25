
import React, { useState, useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from 'recharts';
import { 
  Store, 
  ArrowUpRight, 
  ToggleLeft, 
  ToggleRight, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  X,
  Filter,
  PieChart as PieChartIcon,
  BarChart2,
  Settings,
  LogOut,
  FileBarChart,
  Database,
  Shield,
  Server,
  Layers,
  ShieldCheck,
  MousePointer,
  Maximize2,
  Link,
  TrendingUp,
  DollarSign,
  Inbox,
  ClipboardCheck,
  Download,
  FileText,
  UserCheck,
  XCircle,
  RefreshCw,
  Briefcase,
  Users
} from 'lucide-react';
import { EmployeeRisk } from '../types';

// --- MOCK DATA FOR B2B ANALYTICS ---

const EMPLOYEES_DB: EmployeeRisk[] = [
  // High Risk (Low FWI, High Absenteeism)
  { id: 'e1', name: 'Sarah Connor', department: 'Ventas', fwiScore: 35, absenteeismRisk: 'Critical', ewaFrequency: 8, workModality: 'On-site', age: 29 },
  { id: 'e2', name: 'John Doe', department: 'Logística', fwiScore: 42, absenteeismRisk: 'High', ewaFrequency: 6, workModality: 'On-site', age: 34 },
  { id: 'e3', name: 'Mike Ross', department: 'Ventas', fwiScore: 38, absenteeismRisk: 'Critical', ewaFrequency: 7, workModality: 'Hybrid', age: 26 },
  { id: 'e4', name: 'Rachel Zane', department: 'Legal', fwiScore: 45, absenteeismRisk: 'Medium', ewaFrequency: 3, workModality: 'Remote', age: 31 },
  
  // Mid Range
  { id: 'e5', name: 'Harvey Specter', department: 'Legal', fwiScore: 65, absenteeismRisk: 'Low', ewaFrequency: 1, workModality: 'On-site', age: 42 },
  { id: 'e6', name: 'Donna Paulsen', department: 'Admin', fwiScore: 58, absenteeismRisk: 'Low', ewaFrequency: 2, workModality: 'Hybrid', age: 38 },
  { id: 'e7', name: 'Louis Litt', department: 'Legal', fwiScore: 52, absenteeismRisk: 'Medium', ewaFrequency: 4, workModality: 'On-site', age: 45 },

  // High FWI (Low Risk)
  { id: 'e8', name: 'Jessica Pearson', department: 'Dirección', fwiScore: 88, absenteeismRisk: 'Low', ewaFrequency: 0, workModality: 'Hybrid', age: 50 },
  { id: 'e9', name: 'Alex Williams', department: 'IT', fwiScore: 76, absenteeismRisk: 'Low', ewaFrequency: 0, workModality: 'Remote', age: 28 },
  { id: 'e10', name: 'Samantha Wheeler', department: 'Ventas', fwiScore: 72, absenteeismRisk: 'Low', ewaFrequency: 1, workModality: 'On-site', age: 33 },
  { id: 'e11', name: 'Robert Zane', department: 'Logística', fwiScore: 30, absenteeismRisk: 'Critical', ewaFrequency: 9, workModality: 'On-site', age: 55 },
  { id: 'e12', name: 'Katrina Bennett', department: 'IT', fwiScore: 82, absenteeismRisk: 'Low', ewaFrequency: 0, workModality: 'Remote', age: 29 },
];

const PARTNER_OFFERS = [
  { id: 1, name: 'Seguro de Mascotas', provider: 'Mapfre', status: 'Active', adoption: '12%', cost: '$5/user' },
  { id: 2, name: 'Gimnasio Corporativo', provider: 'SmartFit', status: 'Active', adoption: '35%', cost: '$15/user' },
  { id: 3, name: 'Terapia Psicológica', provider: 'Terapify', status: 'Inactive', adoption: '0%', cost: '$8/user' },
  { id: 4, name: 'Adelanto Nómina (EWA)', provider: 'Treevü Internal', status: 'Active', adoption: '68%', cost: 'Subsidiado' },
];

// --- MOCK DATA FOR REQUESTS (OPERATIONAL INBOX) ---
const INITIAL_REQUESTS = [
    { id: 'REQ-8821', empName: 'Sarah Connor', empId: 'EMP-001', amount: 150.00, purpose: 'General', date: 'Hoy, 09:15 AM', bank: 'Chase ****4492', status: 'pending' },
    { id: 'REQ-8822', empName: 'Mike Ross', empId: 'EMP-042', amount: 20.00, purpose: 'Aporte Ahorro', date: 'Hoy, 09:45 AM', bank: 'Internal Savings', status: 'pending' },
    { id: 'REQ-8823', empName: 'John Doe', empId: 'EMP-012', amount: 75.50, purpose: 'Emergencia', date: 'Hoy, 10:00 AM', bank: 'Wells ****1234', status: 'pending' },
    { id: 'REQ-8824', empName: 'Rachel Zane', empId: 'EMP-009', amount: 200.00, purpose: 'General', date: 'Ayer, 16:30 PM', bank: 'Citi ****9988', status: 'pending' },
];

// --- MOCK DATA FOR RECONCILIATION (FINANCE) ---
const RECONCILIATION_DATA = [
    { id: 'EMP-001', name: 'Sarah Connor', dept: 'Ventas', totalDisbursed: 350.00, fee: 7.50, status: 'Pending Deduction' },
    { id: 'EMP-042', name: 'Mike Ross', dept: 'Ventas', totalDisbursed: 60.00, fee: 0.00, status: 'Pending Deduction' },
    { id: 'EMP-012', name: 'John Doe', dept: 'Logística', totalDisbursed: 125.50, fee: 5.00, status: 'Pending Deduction' },
    { id: 'EMP-099', name: 'Robert Zane', dept: 'Logística', totalDisbursed: 450.00, fee: 12.50, status: 'Pending Deduction' },
    { id: 'EMP-102', name: 'Louis Litt', dept: 'Legal', totalDisbursed: 100.00, fee: 2.50, status: 'Pending Deduction' },
];

// --- MOCK DATA FOR FINANCE MODALS ---
const AGING_DATA = [
    { range: '1-3 días', amount: 650 },
    { range: '4-7 días', amount: 280 },
    { range: '8+ días', amount: 55.5 },
];

const PURPOSE_BREAKDOWN = [
    { name: 'Emergencia', value: 70, color: '#EF4444' },
    { name: 'Aporte Ahorro', value: 30, color: '#10B981' },
];

const DEDUCTION_COMPOSITION = [
    { name: 'Principal (Activo)', value: 985.50, color: '#1C81F2' },
    { name: 'Tarifas EWA', value: 27.50, color: '#F59E0B' },
];

const FEE_BREAKDOWN = [
    { type: 'Retiro Estándar', count: 12, amount: 22.50 },
    { type: 'Retiro Emergencia', count: 2, amount: 5.00 },
    { type: 'Subsidio Empresa', count: 5, amount: 0.00 },
];

// --- DETAILED MODAL DATA ---

const FWI_TREND_DATA = [
  { month: 'May', score: 58 },
  { month: 'Jun', score: 59 },
  { month: 'Jul', score: 57 },
  { month: 'Ago', score: 60 },
  { month: 'Sep', score: 61 },
  { month: 'Oct', score: 62 },
];

const FWI_BY_SEGMENT = [
  { department: 'IT', score: 78, ewaUsage: 'Bajo' },
  { department: 'Admin', score: 65, ewaUsage: 'Medio' },
  { department: 'Ventas', score: 52, ewaUsage: 'Alto' },
  { department: 'Logística', score: 45, ewaUsage: 'Crítico' },
];

const SAVINGS_DISTRIBUTION = [
  { name: 'Aporte a Metas (EWA)', value: 60, color: '#3CB7A9' }, // "Potencia tu Ahorro"
  { name: 'Gasto Hormiga (Autolimitación)', value: 40, color: '#F59E0B' }, // "Compromiso"
];

const EWA_FREQUENCY_DATA = [
  { usage: '1 vez/mes', count: 45 },
  { usage: '2 veces/mes', count: 30 },
  { usage: '3+ veces/mes', count: 15 },
  { usage: 'Emergencia Única', count: 10 },
];

const ENGAGEMENT_RADAR = [
  { subject: 'EWA (Pago)', A: 85, fullMark: 100 },
  { subject: 'Gastos (Ops)', A: 65, fullMark: 100 },
  { subject: 'FWI (Score)', A: 75, fullMark: 100 },
  { subject: 'Marketplace', A: 50, fullMark: 100 },
  { subject: 'Metas', A: 60, fullMark: 100 },
];

// --- MOCK DATA FOR CONFIG ---
const MOCK_DEPT_MAPPING = [
    { source: 'CC_SALES_001', treevu: 'Ventas', status: 'mapped' },
    { source: 'CC_OPS_WAREHOUSE_A', treevu: 'Logística', status: 'mapped' },
    { source: 'CC_IT_DEV_TEAM', treevu: 'IT', status: 'mapped' },
    { source: 'TEMP_STAFF_Q3', treevu: 'Unassigned', status: 'warning' },
    { source: 'CORP_LEGAL_NY', treevu: 'Legal', status: 'mapped' },
];

// Helper to convert categorical risk to numeric days for Scatter Plot
const getAbsenteeismDays = (risk: string) => {
  switch(risk) {
    case 'Critical': return Math.floor(Math.random() * 5) + 15; // 15-20 days
    case 'High': return Math.floor(Math.random() * 5) + 10; // 10-15 days
    case 'Medium': return Math.floor(Math.random() * 5) + 5; // 5-10 days
    case 'Low': return Math.floor(Math.random() * 4); // 0-4 days
    default: return 0;
  }
};

// --- MATH ENGINE: PEARSON CORRELATION ---
const calculateCorrelation = (xArray: number[], yArray: number[]) => {
  const n = xArray.length;
  if (n === 0) return 0;
  
  const sumX = xArray.reduce((a, b) => a + b, 0);
  const sumY = yArray.reduce((a, b) => a + b, 0);
  const sumXY = xArray.reduce((sum, x, i) => sum + x * yArray[i], 0);
  const sumX2 = xArray.reduce((sum, x) => sum + x * x, 0);
  const sumY2 = yArray.reduce((sum, y) => sum + y * y, 0);

  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));

  return denominator === 0 ? 0 : numerator / denominator;
};

export const DashboardB2B: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'requests' | 'reconciliation' | 'partners' | 'config'>('reports');
  
  // FILTERS STATE
  const [filterDept, setFilterDept] = useState<string>('All');
  const [filterModality, setFilterModality] = useState<string>('All');
  const [filterAge, setFilterAge] = useState<string>('All');
  
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);

  // MODAL STATE FOR KPIS
  const [activeKpiModal, setActiveKpiModal] = useState<'fwi' | 'savings' | 'adoption' | 'engagement' | null>(null);

  // MODAL STATE FOR CONFIG (DATA BRIDGE)
  const [activeConfigModal, setActiveConfigModal] = useState<'mapping' | 'payroll' | null>(null);

  // MODAL STATE FOR FINANCE (DRILL-DOWN)
  const [activeFinanceModal, setActiveFinanceModal] = useState<'receivable' | 'deduction' | null>(null);

  // STATE FOR REQUESTS MANAGEMENT
  const [pendingRequests, setPendingRequests] = useState(INITIAL_REQUESTS);

  // ONBOARDING STATE
  const [showOnboarding, setShowOnboarding] = useState(true);

  // --- FILTER LOGIC ---
  const filteredEmployees = useMemo(() => {
    return EMPLOYEES_DB.filter(emp => {
      if (filterDept !== 'All' && emp.department !== filterDept) return false;
      if (filterModality !== 'All' && emp.workModality !== filterModality) return false;
      if (filterAge !== 'All') {
        if (filterAge === '18-25' && (emp.age < 18 || emp.age > 25)) return false;
        if (filterAge === '26-35' && (emp.age < 26 || emp.age > 35)) return false;
        if (filterAge === '36-45' && (emp.age < 36 || emp.age > 45)) return false;
        if (filterAge === '46+' && emp.age < 46) return false;
      }
      return true;
    });
  }, [filterDept, filterModality, filterAge]);

  // --- KPI STATS CALCULATION ---
  const kpiStats = useMemo(() => {
    const count = filteredEmployees.length;
    if (count === 0) return { fwi: 0, savings: '0', adoption: 0, engagement: 0 };

    // Average FWI
    const totalFWI = filteredEmployees.reduce((sum, emp) => sum + emp.fwiScore, 0);
    const avgFWI = Math.round(totalFWI / count);

    // Projected Savings (Mock Logic: Based on headcount in selection)
    // Assuming approx $3,750 potential savings per employee per year if optimized
    const savingsValue = count * 3750;
    const savings = savingsValue >= 1000 ? (savingsValue / 1000).toFixed(1) + 'k' : savingsValue.toString();

    // EWA Adoption %
    const activeEwaUsers = filteredEmployees.filter(e => e.ewaFrequency > 0).length;
    const adoption = Math.round((activeEwaUsers / count) * 100);

    // Engagement Score (Mock Logic: Correlated with FWI for demo purposes)
    const engagement = Math.min(Math.round(avgFWI * 1.2), 98);

    return { fwi: avgFWI, savings, adoption, engagement };
  }, [filteredEmployees]);


  // --- DYNAMIC SCATTER DATA & CORRELATION ---
  const scatterData = useMemo(() => {
    return filteredEmployees.map(emp => ({
      x: emp.fwiScore,
      y: getAbsenteeismDays(emp.absenteeismRisk),
      z: 100, // Bubble size
      name: emp.name,
      dept: emp.department
    }));
  }, [filteredEmployees]);

  const correlation = useMemo(() => {
    const fwiScores = scatterData.map(d => d.x);
    const absentDays = scatterData.map(d => d.y);
    return calculateCorrelation(fwiScores, absentDays);
  }, [scatterData]);

  // --- RISK CLUSTERING LOGIC ---
  const riskClusters = useMemo(() => {
    const clusters: Record<string, { count: number, riskSum: number, employees: EmployeeRisk[] }> = {};
    
    filteredEmployees.forEach(emp => {
      if (emp.fwiScore < 50) {
        if (!clusters[emp.department]) {
          clusters[emp.department] = { count: 0, riskSum: 0, employees: [] };
        }
        clusters[emp.department].count += 1;
        clusters[emp.department].riskSum += (100 - emp.fwiScore); // simplistic risk magnitude
        clusters[emp.department].employees.push(emp);
      }
    });

    return Object.entries(clusters).map(([dept, data]) => ({
      department: dept,
      count: data.count,
      severity: data.riskSum / data.count > 60 ? 'Critical' : 'High',
      projectedLoss: data.count * 3500 // Mock cost per risky employee
    })).sort((a, b) => b.projectedLoss - a.projectedLoss);
  }, [filteredEmployees]);

  const handleDisburseRequest = (id: string) => {
      setPendingRequests(prev => prev.filter(req => req.id !== id));
      // In production: API call to send callback to Treevü
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
      <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F6FAFE] overflow-hidden">
        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 h-full p-6 fixed left-0 top-0 z-20">
            <div className="flex items-center space-x-2 mb-10 px-2">
                <div className="bg-[#1C81F2] p-2 rounded-lg">
                    <PieChartIcon className="text-white" size={24} />
                </div>
                <div className="leading-tight">
                    <span className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] block">Treevü Corp</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">RR.HH. Intelligence</span>
                </div>
            </div>

            <nav className="flex-1 space-y-2">
                <div className="px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Estratégico</div>
                <SidebarItem 
                    id="reports" 
                    icon={FileBarChart} 
                    label="Dashboard Ejecutivo" 
                    active={activeTab === 'reports'} 
                    onClick={() => setActiveTab('reports')}
                />
                <SidebarItem 
                    id="partners" 
                    icon={Store} 
                    label="Red de Beneficios" 
                    active={activeTab === 'partners'} 
                    onClick={() => setActiveTab('partners')}
                />
                <div className="mt-6 px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Operativo</div>
                <SidebarItem 
                    id="requests" 
                    icon={Inbox} 
                    label="Gestión Solicitudes" 
                    active={activeTab === 'requests'} 
                    onClick={() => setActiveTab('requests')}
                />
                <SidebarItem 
                    id="reconciliation" 
                    icon={ClipboardCheck} 
                    label="Conciliación (Finanzas)" 
                    active={activeTab === 'reconciliation'} 
                    onClick={() => setActiveTab('reconciliation')}
                />
                <div className="mt-6 px-4 pb-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sistema</div>
                <SidebarItem 
                    id="config" 
                    icon={Settings} 
                    label="Configuración" 
                    active={activeTab === 'config'} 
                    onClick={() => setActiveTab('config')}
                />
            </nav>

            <div className="mt-auto pt-6 border-t border-slate-200">
                <div className="flex items-center p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                        HR
                    </div>
                    <div className="ml-3 overflow-hidden">
                        <p className="text-sm font-bold text-slate-800 truncate">Director People</p>
                        <p className="text-xs text-slate-500 truncate">Admin Access</p>
                    </div>
                    <LogOut size={16} className="ml-auto text-gray-400 cursor-pointer hover:text-red-500" />
                </div>
            </div>
        </aside>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 md:ml-64 overflow-y-auto h-full scroll-smooth">
            <div className="p-6 md:p-10 font-sans">
                
                {/* --- HEADER --- */}
                <header className="mb-10 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-[#1E293B] font-['Space_Grotesk']">
                            {activeTab === 'reports' && 'Inteligencia Corporativa'}
                            {activeTab === 'requests' && 'Gestión de Solicitudes EWA'}
                            {activeTab === 'reconciliation' && 'Cierre & Conciliación'}
                            {activeTab === 'partners' && 'Gestión de Beneficios'}
                            {activeTab === 'config' && 'Configuración de Cuenta'}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {activeTab === 'reports' && 'Análisis de correlación: Bienestar Financiero vs Riesgo Operativo.'}
                            {activeTab === 'requests' && 'Bandeja de entrada de instrucciones de pago pendientes.'}
                            {activeTab === 'reconciliation' && 'Control de flujo de caja y descuentos de nómina.'}
                            {activeTab === 'partners' && 'Maximiza el ROI de tu inversión en bienestar.'}
                            {activeTab === 'config' && 'Control de privacidad e integración de nómina.'}
                        </p>
                    </div>
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-2">
                        <ShieldCheck size={16} className="text-green-500" />
                        <span className="font-bold text-[#1E293B] text-sm">Sistema Saludable</span>
                    </div>
                </header>

                {/* --- VIEW: REPORTS (B-1 Performance Bridge) --- */}
                {activeTab === 'reports' && (
                    <div className="animate-in fade-in duration-500">
                        {/* ... Reports content remains same ... */}
                        {/* 0. FILTER BAR (Moved to Top) */}
                        <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex flex-wrap gap-4 items-center mb-6">
                            <div className="flex items-center text-gray-500 font-bold text-sm">
                                <Filter size={16} className="mr-2" /> Filtros:
                            </div>
                            <select 
                                className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 font-medium outline-none focus:border-[#1C81F2]"
                                value={filterDept}
                                onChange={(e) => setFilterDept(e.target.value)}
                            >
                                <option value="All">Todos los Deptos</option>
                                <option value="Ventas">Ventas</option>
                                <option value="Logística">Logística</option>
                                <option value="IT">IT</option>
                                <option value="Legal">Legal</option>
                            </select>
                            <select 
                                className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 font-medium outline-none focus:border-[#1C81F2]"
                                value={filterModality}
                                onChange={(e) => setFilterModality(e.target.value)}
                            >
                                <option value="All">Todas Modalidades</option>
                                <option value="On-site">Presencial</option>
                                <option value="Hybrid">Híbrido</option>
                                <option value="Remote">Remoto</option>
                            </select>
                            <select 
                                className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 font-medium outline-none focus:border-[#1C81F2]"
                                value={filterAge}
                                onChange={(e) => setFilterAge(e.target.value)}
                            >
                                <option value="All">Todas las Edades</option>
                                <option value="18-25">18-25</option>
                                <option value="26-35">26-35</option>
                                <option value="36-45">36-45</option>
                                <option value="46+">46+</option>
                            </select>
                        </div>

                        {/* 1. TOP KPIS (Dynamic & Interactive) */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                             {/* FWI Card */}
                             <div 
                                onClick={() => setActiveKpiModal('fwi')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#1C81F2] transition-all group relative overflow-hidden"
                             >
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} className="text-gray-400" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">FWI Promedio</p>
                                <div className="flex items-end">
                                    <h2 className="text-4xl font-bold text-[#1E293B] font-['Space_Grotesk']">{kpiStats.fwi}</h2>
                                    <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full ml-2 mb-1">+4pts</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center group-hover:text-[#1C81F2]">Ver detalle de tendencia <ArrowUpRight size={10} className="ml-1" /></p>
                             </div>
                             
                             {/* Savings Card */}
                             <div 
                                onClick={() => setActiveKpiModal('savings')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#3CB7A9] transition-all group relative"
                             >
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} className="text-gray-400" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Ahorro Proyectado</p>
                                <div className="flex items-end">
                                    <h2 className="text-4xl font-bold text-[#1E293B] font-['Space_Grotesk']">${kpiStats.savings}</h2>
                                    <span className="text-xs font-bold text-gray-500 ml-2 mb-1">/ mes</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center group-hover:text-[#3CB7A9]">Ver desglose de ahorro <ArrowUpRight size={10} className="ml-1" /></p>
                             </div>
                             
                             {/* Adoption Card */}
                             <div 
                                onClick={() => setActiveKpiModal('adoption')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-indigo-500 transition-all group relative"
                             >
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} className="text-gray-400" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Adopción EWA</p>
                                <div className="flex items-end">
                                    <h2 className="text-4xl font-bold text-indigo-600 font-['Space_Grotesk']">{kpiStats.adoption}%</h2>
                                    <span className="text-xs font-bold text-gray-400 ml-2 mb-1">Activa</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center group-hover:text-indigo-500">Ver frecuencia de uso <ArrowUpRight size={10} className="ml-1" /></p>
                             </div>
                             
                             {/* Engagement Card */}
                             <div 
                                onClick={() => setActiveKpiModal('engagement')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-[#F59E0B] transition-all group relative"
                             >
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} className="text-gray-400" />
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Engagement</p>
                                <div className="flex items-end">
                                    <h2 className="text-4xl font-bold text-[#3CB7A9] font-['Space_Grotesk']">{kpiStats.engagement}%</h2>
                                    <span className="text-xs font-bold text-green-600 ml-2 mb-1">↑ 12%</span>
                                </div>
                                <p className="text-[10px] text-gray-400 mt-2 flex items-center group-hover:text-[#F59E0B]">Ver distribución <ArrowUpRight size={10} className="ml-1" /></p>
                             </div>
                        </div>

                        {/* 2. CHART (The Bridge) */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left: Chart */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* The Performance Bridge Chart */}
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <div className="flex justify-between items-start mb-6">
                                        <div>
                                            <h3 className="font-bold text-lg text-[#1E293B]">Puente de Rendimiento</h3>
                                            <p className="text-sm text-gray-500">Correlación: Bienestar Financiero vs Riesgo Operativo</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${
                                            correlation < -0.5 
                                                ? 'bg-red-50 text-red-700 border-red-100' 
                                                : 'bg-gray-50 text-gray-600 border-gray-100'
                                        }`}>
                                            Correlación (r): {correlation.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="h-80 w-full relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis type="number" dataKey="x" name="FWI Score" unit=" pts" domain={[0, 100]} />
                                                <YAxis type="number" dataKey="y" name="Días Ausente" unit=" días" />
                                                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                                                <Scatter name="Colaborador" data={scatterData} fill="#1C81F2" />
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                        
                                        {/* Dynamic Insight Overlay */}
                                        {correlation < -0.7 && (
                                            <div className="absolute top-4 right-4 max-w-xs bg-red-50/90 backdrop-blur-sm border border-red-200 p-3 rounded-xl shadow-lg">
                                                <div className="flex items-start">
                                                    <AlertTriangle size={18} className="text-red-600 mr-2 mt-0.5" />
                                                    <p className="text-xs text-red-800">
                                                        <strong>Insight Crítico:</strong> En {filterDept === 'All' ? 'la organización' : filterDept}, los empleados con FWI &lt; 50 tienen <strong>5x más absentismo</strong>.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Right: Risk Clusters (Group Actions) */}
                            <div className="space-y-6">
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                    <h3 className="font-bold text-lg text-[#1E293B] mb-4">Focos de Riesgo (Clusters)</h3>
                                    <p className="text-xs text-gray-500 mb-4">Grupos con FWI &lt; 50 que requieren intervención.</p>

                                    <div className="space-y-4">
                                        {riskClusters.map((cluster, idx) => (
                                            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-[#1C81F2] transition-colors relative overflow-hidden">
                                                <div className={`absolute top-0 left-0 w-1 h-full ${
                                                    cluster.severity === 'Critical' ? 'bg-red-500' : 'bg-orange-500'
                                                }`}></div>
                                                
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h4 className="font-bold text-[#1E293B] text-sm">{cluster.department}</h4>
                                                        <p className="text-xs text-gray-500">{cluster.count} Personas en riesgo</p>
                                                    </div>
                                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${
                                                        cluster.severity === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                                                    }`}>{cluster.severity}</span>
                                                </div>
                                                
                                                <div className="flex items-center justify-between mt-3">
                                                    <span className="text-xs font-bold text-gray-600">
                                                        Pérdida Proy: <span className="text-red-600">${(cluster.projectedLoss / 1000).toFixed(1)}k</span>
                                                    </span>
                                                    <button 
                                                        onClick={() => { setSelectedCluster(cluster); setShowInterventionModal(true); }}
                                                        className="text-xs bg-white border border-gray-300 px-3 py-1 rounded-lg font-bold hover:bg-[#1C81F2] hover:text-white hover:border-transparent transition-all"
                                                    >
                                                        Intervenir
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: REQUESTS (OPERATIONAL INBOX) --- */}
                {activeTab === 'requests' && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        {/* ... Requests content remains same ... */}
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-bold text-[#1E293B] flex items-center">
                                        <Inbox size={24} className="mr-2 text-[#1C81F2]" /> Bandeja de Solicitudes
                                    </h2>
                                    <p className="text-sm text-gray-500 mt-1">Solicitudes enrutadas por Treevü, pendientes de ejecución por Tesorería.</p>
                                </div>
                                <button className="flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-bold hover:bg-gray-50">
                                    <Download size={16} className="mr-2" /> Exportar Lote (TXT Bancario)
                                </button>
                            </div>

                            {pendingRequests.length === 0 ? (
                                <div className="p-12 text-center text-gray-400">
                                    <CheckCircle size={48} className="mx-auto mb-4 text-green-200" />
                                    <p className="font-bold text-gray-600">¡Todo al día!</p>
                                    <p className="text-sm">No hay solicitudes pendientes de desembolso.</p>
                                </div>
                            ) : (
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="p-4">ID Solicitud</th>
                                            <th className="p-4">Colaborador</th>
                                            <th className="p-4">Monto</th>
                                            <th className="p-4">Propósito</th>
                                            <th className="p-4">Cuenta Destino</th>
                                            <th className="p-4 text-right">Acción (Tesorería)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {pendingRequests.map((req) => (
                                            <tr key={req.id} className="hover:bg-[#F6FAFE] transition-colors group">
                                                <td className="p-4 font-mono text-xs">{req.id}</td>
                                                <td className="p-4">
                                                    <p className="font-bold text-gray-900">{req.empName}</p>
                                                    <p className="text-xs text-gray-400">{req.empId}</p>
                                                </td>
                                                <td className="p-4 font-bold text-[#1E293B]">${req.amount.toFixed(2)}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                                                        req.purpose === 'Aporte Ahorro' ? 'bg-teal-100 text-teal-700' : 
                                                        req.purpose === 'Emergencia' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {req.purpose}
                                                    </span>
                                                </td>
                                                <td className="p-4 font-mono text-xs">{req.bank}</td>
                                                <td className="p-4 text-right">
                                                    <div className="flex items-center justify-end space-x-2">
                                                        <button 
                                                            className="text-red-400 hover:text-red-600 p-2 rounded-full hover:bg-red-50"
                                                            title="Rechazar"
                                                        >
                                                            <XCircle size={18} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDisburseRequest(req.id)}
                                                            className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                                                        >
                                                            <CheckCircle size={14} className="mr-1" /> Marcar Desembolsado
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                        
                        <div className="mt-6 bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start text-sm text-blue-800">
                            <ShieldCheck className="mr-3 mt-1 text-blue-600" size={20} />
                            <div>
                                <p className="font-bold">Nota de Seguridad EWA Lite:</p>
                                <p>Al marcar como "Desembolsado", Treevü enviará una notificación al empleado y actualizará su saldo disponible. La ejecución real de la transferencia depende de la carga del archivo en su portal bancario.</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- VIEW: RECONCILIATION (FINANCE) --- */}
                {activeTab === 'reconciliation' && (
                    <div className="animate-in fade-in duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Card 1: Receivable (Interactive) */}
                            <div 
                                onClick={() => setActiveFinanceModal('receivable')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-orange-400 transition-all group relative"
                            >
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} className="text-gray-400" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Cuenta x Cobrar (Activo)</h3>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-[#1E293B]">$985.50</h2>
                                        <p className="text-xs text-gray-400 mt-1">Adelantos Pendientes de Nómina</p>
                                    </div>
                                    <div className="bg-orange-50 p-2 rounded-lg text-orange-600">
                                        <Clock size={24} />
                                    </div>
                                </div>
                            </div>

                            {/* Card 2: Deduction (Interactive) */}
                            <div 
                                onClick={() => setActiveFinanceModal('deduction')}
                                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 cursor-pointer hover:shadow-md hover:border-green-400 transition-all group relative"
                            >
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Maximize2 size={16} className="text-gray-400" />
                                </div>
                                <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">Total a Descontar (Próx. Ciclo)</h3>
                                <div className="flex items-end justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-[#1E293B]">$1,013.00</h2>
                                        <p className="text-xs text-green-600 font-bold mt-1">Incluye $27.50 en tarifas EWA</p>
                                    </div>
                                    <div className="bg-green-50 p-2 rounded-lg text-green-600">
                                        <DollarSign size={24} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden mb-8">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="font-bold text-lg text-[#1E293B] flex items-center">
                                    <ClipboardCheck size={20} className="mr-2 text-[#3CB7A9]" /> Detalle de Descuentos
                                </h3>
                                <button className="text-[#1C81F2] text-sm font-bold flex items-center hover:underline">
                                    <FileText size={16} className="mr-1" /> Generar Reporte Contable
                                </button>
                            </div>
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">ID Empleado</th>
                                        <th className="p-4">Nombre</th>
                                        <th className="p-4">Depto</th>
                                        <th className="p-4 text-right">Total Adelantado</th>
                                        <th className="p-4 text-right">Tarifa Servicio</th>
                                        <th className="p-4 text-right">Total a Descontar</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {RECONCILIATION_DATA.map((rec, idx) => (
                                        <tr key={idx} className="hover:bg-[#F6FAFE]">
                                            <td className="p-4 font-mono text-xs">{rec.id}</td>
                                            <td className="p-4 font-bold text-gray-900">{rec.name}</td>
                                            <td className="p-4">{rec.dept}</td>
                                            <td className="p-4 text-right">${rec.totalDisbursed.toFixed(2)}</td>
                                            <td className="p-4 text-right text-gray-400">${rec.fee.toFixed(2)}</td>
                                            <td className="p-4 text-right font-bold text-red-600">-${(rec.totalDisbursed + rec.fee).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- VIEW: PARTNERS (Marketplace Mgmt) --- */}
                {activeTab === 'partners' && (
                    <div className="animate-in slide-in-from-right-4 duration-500">
                        {/* ... Partners content remains same ... */}
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-[#1E293B]">Aliados & Beneficios Activos</h2>
                            <button className="bg-[#1C81F2] text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center shadow-lg hover:bg-blue-600">
                                <Plus size={16} className="mr-2" /> Agregar Nuevo Beneficio
                            </button>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                            <table className="w-full text-left text-sm text-gray-600">
                                <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                    <tr>
                                        <th className="p-4">Beneficio / Oferta</th>
                                        <th className="p-4">Proveedor</th>
                                        <th className="p-4">Estado</th>
                                        <th className="p-4">Tasa de Adopción</th>
                                        <th className="p-4">Costo Corp.</th>
                                        <th className="p-4 text-right">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {PARTNER_OFFERS.map((offer) => (
                                        <tr key={offer.id} className="hover:bg-[#F6FAFE] transition-colors">
                                            <td className="p-4 font-bold text-gray-900">{offer.name}</td>
                                            <td className="p-4">{offer.provider}</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                    offer.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {offer.status === 'Active' ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center">
                                                    <span className="font-bold mr-2">{offer.adoption}</span>
                                                    <div className="w-20 bg-gray-200 rounded-full h-1.5">
                                                        <div 
                                                            className="bg-[#1C81F2] h-1.5 rounded-full" 
                                                            style={{width: offer.adoption}}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4 font-mono text-xs">{offer.cost}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-gray-400 hover:text-[#1C81F2]">
                                                    {offer.status === 'Active' ? <ToggleRight size={24} className="text-green-500" /> : <ToggleLeft size={24} />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* --- VIEW: CONFIG --- */}
                {activeTab === 'config' && (
                    <div className="max-w-3xl animate-in fade-in duration-500">
                        {/* ... Config content remains same ... */}
                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
                            <h3 className="font-bold text-xl text-[#1E293B] mb-6">Integración de Datos (Data Bridge)</h3>
                            <div className="flex items-center p-4 bg-green-50 border border-green-100 rounded-xl mb-6">
                                <CheckCircle size={24} className="text-green-600 mr-3" />
                                <div>
                                    <p className="font-bold text-green-900">Sincronización HRIS Activa</p>
                                    <p className="text-xs text-green-700">Última actualización: Hoy, 08:30 AM (Workday API)</p>
                                </div>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <Layers size={18} className="mr-3 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">Mapeo de Departamentos</span>
                                    </div>
                                    <button 
                                        onClick={() => setActiveConfigModal('mapping')}
                                        className="text-[#1C81F2] text-sm font-bold border border-[#1C81F2] px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Verificar
                                    </button>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                                    <div className="flex items-center">
                                        <RefreshCw size={18} className="mr-3 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-600">Ingesta de Nómina (para EWA)</span>
                                    </div>
                                    <button 
                                        onClick={() => setActiveConfigModal('payroll')}
                                        className="text-[#1C81F2] text-sm font-bold border border-[#1C81F2] px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        Configurar
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                            <h3 className="font-bold text-xl text-[#1E293B] mb-6">Privacidad y Accesos</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <button className="p-4 border border-gray-200 rounded-xl text-left hover:border-[#1C81F2] transition-colors">
                                    <Shield size={20} className="text-gray-400 mb-2" />
                                    <p className="font-bold text-sm text-gray-800">Usuarios Administradores</p>
                                    <p className="text-xs text-gray-500">Gestionar roles de RR.HH.</p>
                                </button>
                                <button className="p-4 border border-gray-200 rounded-xl text-left hover:border-[#1C81F2] transition-colors">
                                    <Database size={20} className="text-gray-400 mb-2" />
                                    <p className="font-bold text-sm text-gray-800">Retención de Datos</p>
                                    <p className="text-xs text-gray-500">Configurar políticas de purga.</p>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- DETAILED FINANCE MODALS (RECONCILIATION DRILL-DOWN) --- */}
                
                {/* 1. Accounts Receivable (Activo) */}
                {activeFinanceModal === 'receivable' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                             <div className="bg-orange-500 p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Space_Grotesk']">Análisis de Adelantos Pendientes (Activo)</h2>
                                    <p className="text-orange-100 text-sm">Detalle del flujo de efectivo desembolsado</p>
                                </div>
                                <button onClick={() => setActiveFinanceModal(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Aging Chart */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <Clock size={18} className="mr-2 text-orange-500" /> Antigüedad del Activo
                                        </h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={AGING_DATA}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="range" axisLine={false} tickLine={false} />
                                                    <YAxis axisLine={false} tickLine={false} />
                                                    <Tooltip cursor={{fill: '#fff7ed'}} />
                                                    <Bar dataKey="amount" fill="#F97316" radius={[4, 4, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    
                                    {/* Purpose Breakdown */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <PieChartIcon size={18} className="mr-2 text-orange-500" /> Activo por Propósito
                                        </h4>
                                        <div className="h-64 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={PURPOSE_BREAKDOWN}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {PURPOSE_BREAKDOWN.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend verticalAlign="bottom" height={36}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                                <span className="text-3xl font-bold text-gray-800 font-['Space_Grotesk']">$985</span>
                                                <span className="text-[10px] uppercase text-gray-400 font-bold">Total</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-orange-50 border border-orange-100 p-6 rounded-xl flex items-start mb-6">
                                    <CheckCircle className="text-orange-600 mr-4 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-lg font-bold text-orange-900">Conclusión Operativa:</h4>
                                        <p className="text-orange-800 text-sm mt-1">
                                            El 95% del activo es menor a 5 días. La cuenta por cobrar está saludable y el riesgo de insolvencia es bajo, ya que el activo se liquida en el próximo ciclo.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="px-6 py-3 border border-gray-300 rounded-xl text-gray-700 font-bold hover:bg-gray-50 flex items-center">
                                        <Download size={18} className="mr-2" /> Exportar Listado Detallado
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. Deduction Detail (Próx. Ciclo) */}
                {activeFinanceModal === 'deduction' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                             <div className="bg-green-600 p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Space_Grotesk']">Conciliación de Nómina</h2>
                                    <p className="text-green-100 text-sm">Desglose de Principal vs. Tarifas</p>
                                </div>
                                <button onClick={() => setActiveFinanceModal(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Composition Chart */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <DollarSign size={18} className="mr-2 text-green-600" /> Composición del Descuento
                                        </h4>
                                        <div className="h-64 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={DEDUCTION_COMPOSITION}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {DEDUCTION_COMPOSITION.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend verticalAlign="bottom" height={36}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    
                                    {/* Fee Breakdown */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <FileText size={18} className="mr-2 text-[#F59E0B]" /> Detalle de Tarifas
                                        </h4>
                                        <table className="w-full text-sm text-left">
                                            <thead>
                                                <tr className="text-gray-400 border-b border-gray-100">
                                                    <th className="pb-2 font-bold">Tipo Tarifa</th>
                                                    <th className="pb-2 text-right font-bold">Cant.</th>
                                                    <th className="pb-2 text-right font-bold">Monto</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {FEE_BREAKDOWN.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="py-3 font-medium text-gray-700">{item.type}</td>
                                                        <td className="py-3 text-right text-gray-500">{item.count}</td>
                                                        <td className="py-3 text-right font-bold text-[#1E293B]">${item.amount.toFixed(2)}</td>
                                                    </tr>
                                                ))}
                                                <tr className="bg-gray-50">
                                                    <td className="py-3 font-bold text-gray-900 pl-2">Total Fees</td>
                                                    <td className="py-3"></td>
                                                    <td className="py-3 text-right font-bold text-[#F59E0B] pr-2">$27.50</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                
                                <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start mb-6">
                                    <ClipboardCheck className="text-blue-600 mr-4 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-lg font-bold text-blue-900">Instrucción Contable:</h4>
                                        <p className="text-blue-800 text-sm mt-1">
                                            El principal a recuperar (<strong>$985.50</strong>) liquida la cuenta de Activo, y la diferencia de <strong>$27.50</strong> debe ser aplicada como Tarifa de Servicio (deducción) al colaborador.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button className="px-6 py-3 bg-[#1E293B] text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 flex items-center transition-colors">
                                        <FileText size={18} className="mr-2" /> Generar Archivo de Conciliación (.CSV)
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ... Other Modals (KPI Detail, Config, Onboarding) remain same ... */}
                {/* 1. FWI DETAIL MODAL */}
                {activeKpiModal === 'fwi' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                             <div className="bg-[#1E293B] p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Space_Grotesk']">Análisis Detallado: FWI Promedio</h2>
                                    <p className="text-gray-400 text-sm">Tendencia Histórica y Desglose por Segmento</p>
                                </div>
                                <button onClick={() => setActiveKpiModal(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Trend Chart */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <TrendingUp size={18} className="mr-2 text-green-500" /> Tendencia (6 Meses)
                                        </h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <LineChart data={FWI_TREND_DATA}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                                    <YAxis domain={[0, 100]} axisLine={false} tickLine={false} />
                                                    <Tooltip />
                                                    <Line type="monotone" dataKey="score" stroke="#10B981" strokeWidth={3} dot={{r: 4}} />
                                                </LineChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    
                                    {/* Segment Breakdown */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <Layers size={18} className="mr-2 text-[#1C81F2]" /> FWI por Departamento vs Uso EWA
                                        </h4>
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-gray-400 border-b border-gray-100">
                                                    <th className="text-left pb-2 font-bold">Depto</th>
                                                    <th className="text-right pb-2 font-bold">Score</th>
                                                    <th className="text-right pb-2 font-bold">Uso EWA</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {FWI_BY_SEGMENT.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className="py-3 font-medium text-gray-700">{item.department}</td>
                                                        <td className="py-3 text-right font-bold">
                                                            <span className={`px-2 py-1 rounded-full text-xs ${item.score < 50 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                                {item.score}
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-right text-gray-500">{item.ewaUsage}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="bg-green-50 border border-green-100 p-6 rounded-xl flex items-start">
                                    <CheckCircle className="text-green-600 mr-4 mt-1" size={24} />
                                    <div>
                                        <h4 className="text-lg font-bold text-green-900">Conclusión Operativa:</h4>
                                        <p className="text-green-800 text-sm mt-1">
                                            El incremento de <strong>4pts</strong> está correlacionado con el uso de la función 'Gasto Hormiga Detectado'. 
                                            Los departamentos con mayor uso de herramientas de autolimitación muestran mejor recuperación de FWI.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 2. SAVINGS DETAIL MODAL */}
                {activeKpiModal === 'savings' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                             <div className="bg-[#3CB7A9] p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Space_Grotesk']">Impacto Proyectado: Ahorro Colectivo</h2>
                                    <p className="text-teal-100 text-sm">Distribución de capital retenido por empleados</p>
                                </div>
                                <button onClick={() => setActiveKpiModal(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Distribution Chart */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <PieChartIcon size={18} className="mr-2 text-[#3CB7A9]" /> Fuente del Ahorro
                                        </h4>
                                        <div className="h-64 relative">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <PieChart>
                                                    <Pie
                                                        data={SAVINGS_DISTRIBUTION}
                                                        cx="50%"
                                                        cy="50%"
                                                        innerRadius={60}
                                                        outerRadius={80}
                                                        paddingAngle={5}
                                                        dataKey="value"
                                                    >
                                                        {SAVINGS_DISTRIBUTION.map((entry, index) => (
                                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                                        ))}
                                                    </Pie>
                                                    <Tooltip />
                                                    <Legend verticalAlign="bottom" height={36}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                                                <span className="text-3xl font-bold text-gray-800 font-['Space_Grotesk']">60%</span>
                                                <span className="text-[10px] uppercase text-gray-400 font-bold">Vía EWA</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Actionable Insight */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1 flex flex-col justify-center">
                                        <div className="bg-teal-50 p-6 rounded-xl border border-teal-100 mb-4">
                                            <h4 className="font-bold text-teal-900 mb-2">EWA con Propósito</h4>
                                            <p className="text-sm text-teal-800">
                                                El 60% del ahorro proviene de la función <strong>"Potencia tu Ahorro"</strong>. 
                                                Esto significa que los empleados están usando el adelanto de nómina para inyectar capital a sus cuentas de ahorro, no para gasto corriente.
                                            </p>
                                        </div>
                                        <button className="w-full py-3 border border-teal-200 text-teal-700 font-bold rounded-xl hover:bg-teal-50 transition-colors">
                                            Validar con Tesorería (Solicitudes Etiquetadas)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. ADOPTION DETAIL MODAL */}
                {activeKpiModal === 'adoption' && (
                     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                             <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Space_Grotesk']">Métricas de Uso Operacional EWA</h2>
                                    <p className="text-indigo-100 text-sm">Frecuencia y Monto Promedio de Retiro</p>
                                </div>
                                <button onClick={() => setActiveKpiModal(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Frequency Histogram */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <BarChart2 size={18} className="mr-2 text-indigo-600" /> Frecuencia de Uso Mensual
                                        </h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={EWA_FREQUENCY_DATA}>
                                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                                    <XAxis dataKey="usage" axisLine={false} tickLine={false} tick={{fontSize: 10}} />
                                                    <YAxis axisLine={false} tickLine={false} />
                                                    <Tooltip cursor={{fill: '#e0e7ff'}} />
                                                    <Bar dataKey="count" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={40} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    
                                    {/* Stats Panel */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1 flex flex-col justify-center">
                                        <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                                            <span className="text-sm font-bold text-gray-500">Monto Promedio</span>
                                            <span className="text-2xl font-bold text-[#1E293B]">$150.00</span>
                                        </div>
                                         <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-xl">
                                            <span className="text-sm font-bold text-gray-500">Motivo Principal</span>
                                            <span className="text-sm font-bold text-indigo-600">Emergencia / Ahorro</span>
                                        </div>
                                         <div className="bg-blue-50 border-l-4 border-blue-500 p-4">
                                            <p className="text-xs text-blue-800">
                                                <strong>Conclusión:</strong> El ticket promedio bajo indica que la función se usa para 'tapar huecos' de liquidez (micro-adelantos), validando la efectividad de las reglas de límite.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 4. ENGAGEMENT DETAIL MODAL */}
                {activeKpiModal === 'engagement' && (
                     <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                             <div className="bg-[#F59E0B] p-6 flex justify-between items-center text-white">
                                <div>
                                    <h2 className="text-2xl font-bold font-['Space_Grotesk']">Uso y Adherencia</h2>
                                    <p className="text-yellow-100 text-sm">Distribución de interacción por funcionalidad</p>
                                </div>
                                <button onClick={() => setActiveKpiModal(null)} className="text-white/80 hover:text-white"><X size={24} /></button>
                            </div>
                            <div className="p-8 overflow-y-auto">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                    {/* Radar Chart */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center">
                                            <MousePointer size={18} className="mr-2 text-[#F59E0B]" /> Mapa de Calor de Uso
                                        </h4>
                                        <div className="h-64">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={ENGAGEMENT_RADAR}>
                                                    <PolarGrid />
                                                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 10, fill: '#64748B'}} />
                                                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                                    <Radar name="Engagement" dataKey="A" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                                                    <Tooltip />
                                                </RadarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                    
                                    {/* Insight Text */}
                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm col-span-2 md:col-span-1 flex flex-col justify-center">
                                        <h4 className="font-bold text-gray-800 mb-4">Adherencia a Bienestar vs. Pago</h4>
                                        <p className="text-sm text-gray-600 mb-4">
                                            Aunque el EWA (Pago) sigue siendo el driver principal, vemos un crecimiento sostenido en el módulo de <strong>FWI y Gastos</strong> (65-75% de uso).
                                        </p>
                                        <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                                            <p className="text-sm text-yellow-800">
                                                <strong>Insight:</strong> La plataforma está migrando de ser vista como un "cajero automático" a un "consejero financiero". El incremento del 12% en engagement global se debe a las nuevas alertas de IA.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* INTERVENTION MODAL (RISK CLUSTERS) */}
                {showInterventionModal && selectedCluster && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold text-[#1E293B]">Intervención Grupal</h3>
                                <button onClick={() => setShowInterventionModal(false)}><X size={24} className="text-gray-400" /></button>
                            </div>
                            
                            <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-6">
                                <p className="text-sm text-orange-800">
                                    Estás desplegando una acción para <strong>{selectedCluster.count} empleados</strong> del departamento de <strong>{selectedCluster.department}</strong>.
                                </p>
                            </div>

                            <div className="space-y-4 mb-8">
                                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1C81F2] transition-all">
                                    <input type="radio" name="action" className="w-5 h-5 text-[#1C81F2]" />
                                    <div className="ml-3">
                                        <span className="block font-bold text-sm text-gray-800">Activar Taller de Bienestar</span>
                                        <span className="block text-xs text-gray-500">Charla financiera obligatoria. Costo: $200</span>
                                    </div>
                                </label>
                                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1C81F2] transition-all">
                                    <input type="radio" name="action" className="w-5 h-5 text-[#1C81F2]" />
                                    <div className="ml-3">
                                        <span className="block font-bold text-sm text-gray-800">Campaña de Comunicación EWA</span>
                                        <span className="block text-xs text-gray-500">Push notification sobre adelanto de sueldo. Gratis.</span>
                                    </div>
                                </label>
                                <label className="flex items-center p-4 border border-gray-200 rounded-xl cursor-pointer hover:border-[#1C81F2] transition-all">
                                    <input type="radio" name="action" className="w-5 h-5 text-[#1C81F2]" />
                                    <div className="ml-3">
                                        <span className="block font-bold text-sm text-gray-800">Subsidio Temporal de Intereses</span>
                                        <span className="block text-xs text-gray-500">0% interés en préstamos por 30 días. Alto Costo.</span>
                                    </div>
                                </label>
                            </div>

                            <button 
                                onClick={() => setShowInterventionModal(false)}
                                className="w-full bg-[#1C81F2] text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-600 transition-colors"
                            >
                                Confirmar Despliegue
                            </button>
                        </div>
                    </div>
                )}

                {/* MAPPING MODAL */}
                {activeConfigModal === 'mapping' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk']">Verificación de Mapeo</h3>
                                    <p className="text-sm text-gray-500">Conecta tus Centros de Costo (HRIS) con las unidades de Treevü.</p>
                                </div>
                                <button onClick={() => setActiveConfigModal(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>

                            {/* Alert Section */}
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl mb-6 flex items-start">
                                <AlertTriangle size={20} className="text-yellow-600 mr-3 mt-1" />
                                <div>
                                    <p className="text-sm font-bold text-yellow-800">Atención Requerida</p>
                                    <p className="text-xs text-yellow-700">
                                        Se detectaron <strong>35 empleados</strong> en 'TEMP_STAFF_Q3' sin un departamento asignado en Treevü. Esto afecta sus métricas de riesgo.
                                    </p>
                                </div>
                            </div>

                            {/* Mapping Table */}
                            <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 text-gray-500 font-bold uppercase text-xs">
                                        <tr>
                                            <th className="p-4">Origen (HRIS ID)</th>
                                            <th className="p-4">Destino Treevü</th>
                                            <th className="p-4">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MOCK_DEPT_MAPPING.map((item, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="p-4 font-mono text-gray-600">{item.source}</td>
                                                <td className="p-4 font-bold text-[#1E293B] flex items-center">
                                                    {item.treevu}
                                                    {item.status === 'warning' && <span className="ml-2 text-xs text-red-500 font-normal">(Sin Mapeo)</span>}
                                                </td>
                                                <td className="p-4">
                                                    {item.status === 'mapped' ? (
                                                        <span className="flex items-center text-green-600 text-xs font-bold bg-green-100 px-2 py-1 rounded w-max"><Link size={12} className="mr-1"/> Mapeado</span>
                                                    ) : (
                                                        <span className="flex items-center text-yellow-600 text-xs font-bold bg-yellow-100 px-2 py-1 rounded w-max"><AlertTriangle size={12} className="mr-1"/> Pendiente</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex justify-end space-x-3">
                                <button className="px-4 py-2 border border-gray-300 rounded-xl text-gray-600 text-sm font-bold hover:bg-gray-50">Descargar Reporte</button>
                                <button onClick={() => setActiveConfigModal(null)} className="px-4 py-2 bg-[#1C81F2] text-white rounded-xl text-sm font-bold hover:bg-blue-600 shadow-sm flex items-center">
                                    <RefreshCw size={16} className="mr-2" /> Sincronizar Manualmente
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* PAYROLL CONFIG MODAL */}
                {activeConfigModal === 'payroll' && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
                            <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk']">Motor de Reglas EWA</h3>
                                    <p className="text-sm text-gray-500">Define cómo Treevü calcula la liquidez y enruta las solicitudes.</p>
                                </div>
                                <button onClick={() => setActiveConfigModal(null)} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Section 1: Cycle Config */}
                                <div>
                                    <h4 className="font-bold text-[#1E293B] mb-4 flex items-center text-sm uppercase tracking-wider">
                                        <Clock size={16} className="mr-2 text-[#1C81F2]" /> Configuración de Ciclo
                                    </h4>
                                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Frecuencia de Pago</label>
                                            <div className="flex space-x-2">
                                                <button className="flex-1 py-2 bg-white border border-[#1C81F2] text-[#1C81F2] font-bold rounded-lg text-sm">Quincenal</button>
                                                <button className="flex-1 py-2 bg-white border border-gray-200 text-gray-500 font-bold rounded-lg text-sm hover:border-gray-300">Mensual</button>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Cortes de Nómina</label>
                                            <select className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm outline-none">
                                                <option>Días 15 y 30</option>
                                                <option>Días 14 y 28</option>
                                                <option>Cada Viernes</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 2: Calculation Base */}
                                <div>
                                    <h4 className="font-bold text-[#1E293B] mb-4 flex items-center text-sm uppercase tracking-wider">
                                        <DollarSign size={16} className="mr-2 text-[#3CB7A9]" /> Base de Cálculo
                                    </h4>
                                    <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <div className="flex justify-between items-center">
                                            <label className="text-sm font-medium text-gray-700">Salario Base</label>
                                            <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded">Bruto</span>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">Estimación Deducciones</label>
                                            <div className="flex items-center">
                                                <input type="range" min="0" max="40" defaultValue="20" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#3CB7A9] mr-3" />
                                                <span className="font-bold text-[#3CB7A9]">20%</span>
                                            </div>
                                            <p className="text-[10px] text-gray-400 mt-1">Margen de seguridad para impuestos y SS.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Limits (Crucial) */}
                                <div className="md:col-span-2">
                                    <h4 className="font-bold text-[#1E293B] mb-4 flex items-center text-sm uppercase tracking-wider">
                                        <Shield size={16} className="mr-2 text-orange-500" /> Reglas de Límite (Protección de Nómina)
                                    </h4>
                                    <div className="bg-orange-50 p-6 rounded-xl border border-orange-100">
                                        <div className="grid grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-bold text-orange-900 mb-2">Límite Máximo General</label>
                                                <div className="flex items-center bg-white p-2 rounded-lg border border-orange-200">
                                                    <input type="number" defaultValue="50" className="w-16 font-bold text-right outline-none text-orange-900" />
                                                    <span className="ml-1 text-orange-900">% del Devengado Neto</span>
                                                </div>
                                                <p className="text-xs text-orange-700 mt-2">Recomendado: 50% para evitar saldo negativo.</p>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-orange-900 mb-2">Límite para Aliados/Comisión</label>
                                                <div className="flex items-center bg-white p-2 rounded-lg border border-orange-200">
                                                    <input type="number" defaultValue="70" className="w-16 font-bold text-right outline-none text-orange-900" />
                                                    <span className="ml-1 text-orange-900">% del Devengado</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 4: Routing Channels (EWA Lite Core) */}
                                <div className="md:col-span-2">
                                    <h4 className="font-bold text-[#1E293B] mb-4 flex items-center text-sm uppercase tracking-wider">
                                        <Server size={16} className="mr-2 text-indigo-600" /> Canales de Enrutamiento
                                    </h4>
                                    <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 flex items-start justify-between">
                                        <div>
                                            <p className="text-sm font-bold text-indigo-900 mb-1">Método de Entrega de Solicitudes</p>
                                            <p className="text-xs text-indigo-700 mb-4">Cómo Treevü envía la instrucción de pago a tu Tesorería.</p>
                                            <div className="flex space-x-3">
                                                <span className="flex items-center px-3 py-1 bg-white rounded-full text-xs font-bold text-indigo-600 border border-indigo-200 shadow-sm">
                                                    <CheckCircle size={12} className="mr-1" /> SFTP (Batch)
                                                </span>
                                                <span className="flex items-center px-3 py-1 bg-white/50 rounded-full text-xs font-bold text-gray-400 border border-transparent">
                                                    API Real-time
                                                </span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-bold text-indigo-900 uppercase mb-1">Frecuencia de Desembolso</p>
                                            <p className="font-bold text-lg text-indigo-700">Diario - 10:00 AM</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end pt-4 border-t border-gray-100">
                                <button onClick={() => setActiveConfigModal(null)} className="px-6 py-3 bg-[#1E293B] text-white font-bold rounded-xl shadow-lg hover:bg-slate-800 transition-colors">
                                    Guardar Reglas
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* WELCOME ONBOARDING MODAL (B2B EWA Lite Education) */}
                {showOnboarding && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300">
                            <div className="bg-[#1E293B] p-8 text-white flex flex-col justify-center md:w-2/5 relative overflow-hidden">
                                <div className="absolute -top-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
                                <ShieldCheck size={48} className="mb-6 relative z-10 text-[#3CB7A9]" />
                                <h2 className="text-3xl font-bold font-['Space_Grotesk'] mb-2 relative z-10">Bienvenido al Control</h2>
                                <p className="text-slate-300 text-sm relative z-10">Gestión Operativa de Liquidez (EWA Lite)</p>
                            </div>
                            <div className="p-8 md:w-3/5 bg-white">
                                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                                    Estimado equipo de RR.HH. y Finanzas, Treevü es su socio tecnológico para gestionar el acceso al salario devengado. Nuestra plataforma es el <strong>"Data Bridge"</strong> que transforma la data de su HRIS/Nómina en una prestación de bienestar, sin riesgos de <em>fintech</em> o custodia de fondos.
                                </p>
                                
                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Valor Central</h4>
                                        <p className="text-sm font-bold text-[#1E293B]">Automatización</p>
                                        <p className="text-[10px] text-slate-400">Cálculo y límites delegados.</p>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                                        <h4 className="text-xs font-bold text-slate-500 uppercase mb-1">Modelo</h4>
                                        <p className="text-sm font-bold text-[#1E293B]">No-Fintech</p>
                                        <p className="text-[10px] text-slate-400">Treevü no mueve fondos.</p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <p className="text-xs font-bold text-slate-500 uppercase">Sus pasos iniciales:</p>
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold mr-3">1</span>
                                        <span className="text-sm text-blue-900">Vaya a <strong>Configuración</strong> y verifique reglas.</span>
                                    </div>
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg border border-blue-100">
                                        <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white rounded-full text-xs font-bold mr-3">2</span>
                                        <span className="text-sm text-blue-900">Monitoree <strong>Gestión de Solicitudes</strong>.</span>
                                    </div>
                                </div>

                                <button onClick={() => setShowOnboarding(false)} className="w-full bg-[#1E293B] text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg">
                                    Revisar Configuración de Reglas
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
