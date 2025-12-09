
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';
import { Store, ArrowUpRight, ToggleLeft, ToggleRight, Plus, AlertTriangle, CheckCircle, Clock, X, Filter, PieChart as PieChartIcon, BarChart2, Settings, LogOut, FileBarChart, Database, Shield, Server, Layers, ShieldCheck, MousePointer, Maximize2, Link, TrendingUp, DollarSign, Inbox, ClipboardCheck, Download, FileText, UserCheck, XCircle, RefreshCw, Briefcase, Users, ChevronDown, Info, Award, Leaf, Gift, Tag, Search, Mail, MapPin, Zap, MessageSquare, BookOpen, Ban, FileSearch, Target } from 'lucide-react';
import { EmployeeRisk, RiskCluster, TreePointStats, TreePointHeatmap, TreePointIssuance } from '../types';

const EMPLOYEES_DB: EmployeeRisk[] = [
  { id: 'e1', name: 'Sarah Connor', department: 'Ventas', fwiScore: 35, absenteeismRisk: 'Critical', ewaFrequency: 8, workModality: 'On-site', age: 29, tenure: 2, turnoverPropensity: 85 },
  { id: 'e2', name: 'John Doe', department: 'Logística', fwiScore: 42, absenteeismRisk: 'High', ewaFrequency: 6, workModality: 'On-site', age: 34, tenure: 5, turnoverPropensity: 72 },
  { id: 'e3', name: 'Jane Smith', department: 'IT', fwiScore: 78, absenteeismRisk: 'Low', ewaFrequency: 1, workModality: 'Remote', age: 27, tenure: 1, turnoverPropensity: 15 },
  { id: 'e4', name: 'Mike Ross', department: 'Legal', fwiScore: 65, absenteeismRisk: 'Medium', ewaFrequency: 3, workModality: 'Hybrid', age: 31, tenure: 3, turnoverPropensity: 30 },
  { id: 'e5', name: 'Rachel Zane', department: 'Legal', fwiScore: 70, absenteeismRisk: 'Low', ewaFrequency: 2, workModality: 'Hybrid', age: 28, tenure: 2, turnoverPropensity: 20 },
  { id: 'e6', name: 'Harvey Specter', department: 'Dirección', fwiScore: 92, absenteeismRisk: 'Low', ewaFrequency: 0, workModality: 'On-site', age: 45, tenure: 10, turnoverPropensity: 2 },
  { id: 'e7', name: 'Donna Paulsen', department: 'Dirección', fwiScore: 85, absenteeismRisk: 'Low', ewaFrequency: 1, workModality: 'On-site', age: 40, tenure: 12, turnoverPropensity: 5 },
  { id: 'e8', name: 'Jessica Pearson', department: 'Dirección', fwiScore: 88, absenteeismRisk: 'Low', ewaFrequency: 0, workModality: 'Hybrid', age: 50, tenure: 15, turnoverPropensity: 5 },
  { id: 'e9', name: 'Louis Litt', department: 'Finanzas', fwiScore: 60, absenteeismRisk: 'Medium', ewaFrequency: 4, workModality: 'On-site', age: 42, tenure: 8, turnoverPropensity: 40 },
  { id: 'e10', name: 'Katrina Bennett', department: 'Finanzas', fwiScore: 75, absenteeismRisk: 'Low', ewaFrequency: 1, workModality: 'Hybrid', age: 30, tenure: 4, turnoverPropensity: 10 },
];

const INITIAL_REQUESTS = [
    { id: 'REQ-8821', empName: 'Sarah Connor', empId: 'EMP-001', amount: 150.00, purpose: 'General', date: 'Hoy, 09:15 AM', bank: 'Chase ****4492', status: 'pending' },
    { id: 'REQ-8822', empName: 'Mike Ross', empId: 'EMP-042', amount: 20.00, purpose: 'Aporte Ahorro', date: 'Hoy, 09:45 AM', bank: 'Internal Savings', status: 'pending' },
];

const MOCK_PARTNERS = [
  { id: 'p1', name: 'Whole Foods Market', category: 'Alimentos', status: 'Active', offers: 3, engagement: 'High', commission: '5%' },
  { id: 'p2', name: 'Shell', category: 'Transporte', status: 'Active', offers: 1, engagement: 'Medium', commission: '3%' },
  { id: 'p3', name: 'Starbucks', category: 'Alimentos', status: 'Active', offers: 2, engagement: 'High', commission: '10%' },
  { id: 'p4', name: 'Gympass', category: 'Salud', status: 'Pending', offers: 5, engagement: 'Low', commission: 'Flat Fee' },
  { id: 'p5', name: 'Uber', category: 'Transporte', status: 'Active', offers: 1, engagement: 'Medium', commission: '3%' }
];

// Mock Data for Finance Modals
const AGING_DATA = [ { range: '1-3 Días', amount: 850 }, { range: '4-7 Días', amount: 120 }, { range: '8+ Días', amount: 15.5 } ];
const PURPOSE_BREAKDOWN = [ { name: 'Emergencia', value: 60, color: '#EF4444' }, { name: 'General', value: 30, color: '#1C81F2' }, { name: 'Ahorro', value: 10, color: '#10B981' } ];
const DEDUCTION_COMPOSITION = [ { name: 'Principal', value: 985.50, color: '#1C81F2' }, { name: 'Tarifas EWA', value: 27.50, color: '#F59E0B' } ];
const FEE_BREAKDOWN = [ { type: 'Retiro Estándar', count: 12, total: 24.00 }, { type: 'Retiro Express', count: 1, total: 3.50 }, { type: 'Promo (Absorbida)', count: 5, total: 0.00 } ];
const ADOPTION_QUALITY = [{ name: 'Sano (Emergencia)', value: 82, color: '#10B981' }, { name: 'Crónico (Déficit)', value: 18, color: '#EF4444' }];

// Partner Drill Down Data
const PARTNER_CATS = [{ name: 'Alimentos', value: 40, color: '#1C81F2' }, { name: 'Salud', value: 25, color: '#3CB7A9' }, { name: 'Transporte', value: 20, color: '#F59E0B' }, { name: 'Ocio', value: 15, color: '#94A3B8' }];
const PARTNER_OFFERS_TYPE = [{ name: 'Flash (Urgencia)', value: 15 }, { name: 'Evergreen (Fija)', value: 30 }];
const PARTNER_SAVINGS_TREND = [{ month: 'Ago', value: 35 }, { month: 'Sep', value: 42 }, { month: 'Oct', value: 47.5 }];

const MOCK_DEPT_MAPPING = [
    { hrisCode: 'CC-101', hrisName: 'Sales_North', treevuMapping: 'Ventas', status: 'ok' },
    { hrisCode: 'CC-102', hrisName: 'Logistics_Wh', treevuMapping: 'Logística', status: 'ok' },
    { hrisCode: 'CC-205', hrisName: 'Corp_HQ_Dir', treevuMapping: 'Dirección', status: 'ok' },
    { hrisCode: 'CC-999', hrisName: 'Temp_Staff_B', treevuMapping: 'Sin Asignar', status: 'warning' },
];

// TreePoints Mock Data
const MOCK_TP_STATS: TreePointStats = {
    totalIssued: 125000,
    redemptionRate: 68,
    fwiImpact: 5.2,
    budgetUtilization: 45
};

const MOCK_TP_HEATMAP: TreePointHeatmap[] = [
    { department: 'Ventas', pointsIssued: 45000, redemptionRate: 85, avgFwi: 52, impactLabel: 'High' },
    { department: 'Logística', pointsIssued: 30000, redemptionRate: 70, avgFwi: 48, impactLabel: 'High' },
    { department: 'IT', pointsIssued: 15000, redemptionRate: 40, avgFwi: 78, impactLabel: 'Low' },
    { department: 'Dirección', pointsIssued: 5000, redemptionRate: 20, avgFwi: 88, impactLabel: 'Low' },
    { department: 'Legal', pointsIssued: 10000, redemptionRate: 55, avgFwi: 68, impactLabel: 'Medium' },
    { department: 'Finanzas', pointsIssued: 20000, redemptionRate: 60, avgFwi: 62, impactLabel: 'Medium' }
];

// TreePoints Drill Down Data
const TP_ISSUANCE_TREND = [
    { month: 'Jul', issued: 15000, target: 12000 },
    { month: 'Ago', issued: 22000, target: 15000 },
    { month: 'Sep', issued: 35000, target: 30000 },
    { month: 'Oct', issued: 53000, target: 45000 },
];

const TP_REDEMPTION_CATS = [
    { name: 'Marketplace (Cupones)', value: 45, color: '#3CB7A9' },
    { name: 'Reducción Tarifa EWA', value: 30, color: '#1C81F2' },
    { name: 'Donaciones', value: 10, color: '#F59E0B' },
    { name: 'Sin Canjear', value: 15, color: '#94A3B8' }
];

const TP_BUDGET_USAGE = [
    { month: 'Q1', budget: 50000, used: 45000 },
    { month: 'Q2', budget: 50000, used: 38000 },
    { month: 'Q3', budget: 60000, used: 58000 },
    { month: 'Q4', budget: 100000, used: 45000 }, // Current
];

// Audit Log Data
const AUDIT_LOG = [
    { id: 'LOG-001', user: 'Admin HR (L. Litt)', action: 'Aprobación Pago', detail: 'Lote #442 - 15 Solicitudes', time: 'Hace 2 horas' },
    { id: 'LOG-002', user: 'Sistema', action: 'Alerta Riesgo', detail: 'Cluster Ventas - FWI Crítico', time: 'Hace 4 horas' },
    { id: 'LOG-003', user: 'Admin HR (J. Pearson)', action: 'Intervención', detail: 'Campaña Educativa enviada a Ventas', time: 'Ayer' },
];

const getAbsenteeismDays = (risk: string) => {
  switch(risk) { case 'Critical': return 18; case 'High': return 12; case 'Medium': return 7; default: return 2; }
};

const calculateCorrelation = (xArray: number[], yArray: number[]) => {
  const n = xArray.length; if (n === 0) return 0;
  const sumX = xArray.reduce((a, b) => a + b, 0);
  const sumY = yArray.reduce((a, b) => a + b, 0);
  const sumXY = xArray.reduce((sum, x, i) => sum + x * yArray[i], 0);
  const sumX2 = xArray.reduce((sum, x) => sum + x * x, 0);
  const sumY2 = yArray.reduce((sum, y) => sum + y * y, 0);
  const numerator = (n * sumXY) - (sumX * sumY);
  const denominator = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
  return denominator === 0 ? 0 : numerator / denominator;
};

const checkTenure = (years: number, filter: string) => {
    if (filter === 'All') return true;
    if (filter === '0-2') return years < 2;
    if (filter === '2-5') return years >= 2 && years <= 5;
    if (filter === '5+') return years > 5;
    return true;
};

export const DashboardB2B: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'reports' | 'requests' | 'reconciliation' | 'partners' | 'config' | 'treepoints'>('reports');
  
  // Advanced Filters State
  const [filterArea, setFilterArea] = useState<string>('All');
  const [filterModality, setFilterModality] = useState<string>('All');
  const [filterTenure, setFilterTenure] = useState<string>('All');

  const [pendingRequests, setPendingRequests] = useState(INITIAL_REQUESTS);
  const [activeKpiModal, setActiveKpiModal] = useState<string | null>(null);
  const [activeFinanceModal, setActiveFinanceModal] = useState<string | null>(null);
  const [activeConfigModal, setActiveConfigModal] = useState<'mapping' | 'payroll' | null>(null);
  const [activeTpModal, setActiveTpModal] = useState<'issuance' | 'redemption' | 'budget' | null>(null);
  const [activePartnerModal, setActivePartnerModal] = useState<any | null>(null); // Stores selected partner object
  const [activePartnerStatsModal, setActivePartnerStatsModal] = useState<'merchants' | 'offers' | 'savings' | null>(null);
  
  // Intervention Logic
  const [activeInterventionModal, setActiveInterventionModal] = useState<RiskCluster | null>(null);
  const [interventionStep, setInterventionStep] = useState<'select' | 'processing' | 'success'>('select');
  const [interventionType, setInterventionType] = useState<'education' | 'points' | 'rule'>('education');

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // TreePoints State
  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState<TreePointIssuance>({ targetType: 'Department', targetId: 'Ventas', amount: 100, reason: 'Bono Productividad' });
  const [issueStep, setIssueStep] = useState<'form' | 'processing' | 'success'>('form');

  // Filter Logic
  const filteredEmployees = useMemo(() => {
      return EMPLOYEES_DB.filter(emp => 
          (filterArea === 'All' || emp.department === filterArea) &&
          (filterModality === 'All' || emp.workModality === filterModality) &&
          (filterTenure === 'All' || checkTenure(emp.tenure, filterTenure))
      );
  }, [filterArea, filterModality, filterTenure]);
  
  // Dynamic Stats based on filtered employees
  const kpiStats = useMemo(() => {
    const count = filteredEmployees.length;
    if (count === 0) return { fwi: 0, savings: '0', adoption: 0, engagement: 0 };
    
    const avgFWI = Math.round(filteredEmployees.reduce((sum, emp) => sum + emp.fwiScore, 0) / count);
    const totalSavings = (count * 3.75).toFixed(1); // Mock calculation
    
    // Calculate Adoption based on ewaFrequency > 0
    const activeEwaUsers = filteredEmployees.filter(e => e.ewaFrequency > 0).length;
    const adoptionRate = Math.round((activeEwaUsers / count) * 100);
    
    // Mock Engagement calc
    const engagementScore = Math.min(100, Math.round(avgFWI * 1.1 + (adoptionRate * 0.2)));

    return { fwi: avgFWI, savings: totalSavings + 'k', adoption: adoptionRate, engagement: engagementScore };
  }, [filteredEmployees]);

  // Performance Bridge Data (Scatter)
  const scatterData = useMemo(() => filteredEmployees.map(emp => ({ x: emp.fwiScore, y: getAbsenteeismDays(emp.absenteeismRisk), z: 100, name: emp.name })), [filteredEmployees]);
  const correlation = useMemo(() => calculateCorrelation(scatterData.map(d => d.x), scatterData.map(d => d.y)), [scatterData]);

  // Risk Clusters (Grouped by Dept for filtered set)
  const riskClusters: RiskCluster[] = useMemo(() => {
      const clusters: Record<string, {count: number, totalIpr: number}> = {};
      filteredEmployees.forEach(emp => {
          if (!clusters[emp.department]) clusters[emp.department] = { count: 0, totalIpr: 0 };
          if (emp.fwiScore < 50) {
              clusters[emp.department].count++;
              clusters[emp.department].totalIpr += (emp.turnoverPropensity || 0);
          }
      });
      
      return Object.keys(clusters).map(dept => ({
          department: dept,
          count: clusters[dept].count,
          severity: clusters[dept].count > 2 ? 'Critical' : 'Medium',
          projectedLoss: clusters[dept].count * 3500,
          avgIpr: clusters[dept].count > 0 ? Math.round(clusters[dept].totalIpr / clusters[dept].count) : 0
      })).filter(c => c.count > 0).sort((a,b) => b.count - a.count);
  }, [filteredEmployees]);

  // Dynamic Chart Data for Modals based on Filtered Data
  const modalChartData = useMemo(() => {
      // 1. FWI Trend (Mocked relative to current Avg)
      const fwiTrend = [
          { month: 'Jul', score: kpiStats.fwi - 5 },
          { month: 'Ago', score: kpiStats.fwi - 2 },
          { month: 'Sep', score: kpiStats.fwi - 1 },
          { month: 'Oct', score: kpiStats.fwi }
      ];

      // 2. Savings Distribution (Mock) - UPDATED TO REFLECT FINANCIAL COSTS AVOIDED
      const savingsDist = [
          { name: 'Intereses Evitados', value: 75, color: '#10B981' }, 
          { name: 'Comisiones Mora', value: 25, color: '#F59E0B' } 
      ];

      // 3. Adoption Histogram (Actual Data)
      const adoptionDist = [
          { name: '0', count: filteredEmployees.filter(e => e.ewaFrequency === 0).length },
          { name: '1-2', count: filteredEmployees.filter(e => e.ewaFrequency >= 1 && e.ewaFrequency <= 2).length },
          { name: '3+', count: filteredEmployees.filter(e => e.ewaFrequency >= 3).length },
      ];

      // 4. Engagement Radar (Mock)
      const engagementRadar = [
          { subject: 'EWA', A: kpiStats.adoption, fullMark: 100 },
          { subject: 'Educación', A: kpiStats.engagement - 10, fullMark: 100 },
          { subject: 'Metas', A: kpiStats.engagement + 5, fullMark: 100 },
          { subject: 'Gasto', A: kpiStats.engagement, fullMark: 100 },
      ];

      return { fwiTrend, savingsDist, adoptionDist, engagementRadar };
  }, [kpiStats, filteredEmployees]);

  const handleIssuePoints = () => {
      setIssueStep('processing');
      setTimeout(() => {
          setIssueStep('success');
      }, 1500);
  };

  const handleInterventionSubmit = () => {
    setInterventionStep('processing');
    setTimeout(() => {
        setInterventionStep('success');
    }, 2000);
  };

  const SidebarItem = ({ id, icon: Icon, label, active, onClick }: any) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${active ? 'bg-[#1C81F2] text-white shadow-md' : 'text-gray-500 hover:bg-white hover:shadow-sm'}`}>
      <Icon size={20} /> <span className="font-bold text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen bg-[#F6FAFE] overflow-hidden">
        <aside className="hidden md:flex flex-col w-64 bg-slate-50 border-r border-slate-200 h-full p-6 fixed left-0 top-0 z-20">
            <div className="flex items-center space-x-2 mb-10 px-2">
                <div className="bg-[#1C81F2] p-2 rounded-lg"><PieChartIcon className="text-white" size={24} /></div>
                <div><span className="text-xl font-bold text-[#1E293B] font-['Space_Grotesk'] block">Treevü Corp</span><span className="text-[10px] text-gray-500 font-bold uppercase">RR.HH. Intelligence</span></div>
            </div>
            <nav className="flex-1 space-y-1">
                <div className="mb-6">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">ESTRATÉGICO</p>
                    <div className="space-y-1">
                        <SidebarItem id="reports" icon={FileBarChart} label="Dashboard Ejecutivo" active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
                        <SidebarItem id="partners" icon={Store} label="Red de Beneficios" active={activeTab === 'partners'} onClick={() => setActiveTab('partners')} />
                    </div>
                </div>
                <div className="mb-6">
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">OPERATIVO</p>
                    <div className="space-y-1">
                        <SidebarItem id="requests" icon={Inbox} label="Gestión Solicitudes" active={activeTab === 'requests'} onClick={() => setActiveTab('requests')} />
                        <SidebarItem id="reconciliation" icon={ClipboardCheck} label="Conciliación (Finanzas)" active={activeTab === 'reconciliation'} onClick={() => setActiveTab('reconciliation')} />
                        <SidebarItem id="treepoints" icon={Award} label="Gestión TreePoints" active={activeTab === 'treepoints'} onClick={() => setActiveTab('treepoints')} />
                    </div>
                </div>
                <div>
                    <p className="px-4 text-[10px] font-bold text-gray-400 uppercase mb-3 tracking-wider">SISTEMA</p>
                    <SidebarItem id="config" icon={Settings} label="Configuración" active={activeTab === 'config'} onClick={() => setActiveTab('config')} />
                </div>
            </nav>
        </aside>

        <main className="flex-1 md:ml-64 overflow-y-auto h-full p-6 md:p-10">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#1E293B] font-['Space_Grotesk']">
                        {activeTab === 'reports' && 'Inteligencia Corporativa'}
                        {activeTab === 'treepoints' && 'Gestión de TreePoints'}
                        {activeTab === 'requests' && 'Gestión de Solicitudes'}
                        {activeTab === 'reconciliation' && 'Conciliación Financiera'}
                        {activeTab === 'config' && 'Configuración de Cuenta'}
                        {activeTab === 'partners' && 'Red de Beneficios'}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {activeTab === 'reports' && 'Análisis de correlación: Bienestar Financiero vs Riesgo Operativo.'}
                        {activeTab === 'treepoints' && 'Administración de incentivos y análisis de impacto en FWI.'}
                        {activeTab === 'partners' && 'Gestión de aliados comerciales y análisis de impacto en engagement.'}
                    </p>
                </div>
                <div className="flex space-x-2">
                   <div className="bg-green-100 px-3 py-1 rounded-full flex items-center space-x-1"><CheckCircle size={14} className="text-green-600"/><span className="text-xs font-bold text-green-700">Sistema Saludable</span></div>
                </div>
            </header>

            {/* Global Filters */}
            {activeTab === 'reports' && (
                <div className="flex flex-wrap items-center gap-4 mb-8">
                    <div className="flex items-center space-x-2 text-gray-400 mr-2"><Filter size={18} /><span className="text-xs font-bold uppercase">Filtros:</span></div>
                    <div className="relative">
                        <select value={filterArea} onChange={(e) => setFilterArea(e.target.value)} className="appearance-none bg-white border border-gray-200 shadow-sm text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer min-w-[160px]">
                            <option value="All">Todos los Deptos</option><option value="Ventas">Ventas</option><option value="Logística">Logística</option><option value="IT">Tecnología (IT)</option><option value="Legal">Legal</option><option value="Dirección">Dirección</option><option value="Finanzas">Finanzas</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={filterModality} onChange={(e) => setFilterModality(e.target.value)} className="appearance-none bg-white border border-gray-200 shadow-sm text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer min-w-[160px]">
                            <option value="All">Todas Modalidades</option><option value="On-site">Presencial</option><option value="Hybrid">Híbrido</option><option value="Remote">Remoto</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                    <div className="relative">
                        <select value={filterTenure} onChange={(e) => setFilterTenure(e.target.value)} className="appearance-none bg-white border border-gray-200 shadow-sm text-gray-700 py-2 pl-4 pr-8 rounded-lg text-sm font-medium focus:outline-none focus:border-blue-500 cursor-pointer min-w-[160px]">
                            <option value="All">Todas las Edades</option><option value="0-2">Junior (0-2 años)</option><option value="2-5">Mid (2-5 años)</option><option value="5+">Senior (5+ años)</option>
                        </select>
                        <ChevronDown size={14} className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            )}

            {activeTab === 'reports' && (
                <div className="animate-in fade-in duration-500 space-y-8">
                    {/* Top KPIs */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden" onClick={() => setActiveKpiModal('fwi')}>
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={16} className="text-gray-400" /></div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">FWI Promedio</p>
                            <div className="flex items-baseline space-x-3">
                                <h2 className="text-4xl font-bold text-[#1E293B]">{kpiStats.fwi}</h2>
                                <div className="text-xs text-green-700 font-bold bg-green-100 px-2 py-1 rounded-full">+4pts</div>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-400 flex items-center">Ver detalle de tendencia <ArrowUpRight size={10} className="ml-1" /></div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden" onClick={() => setActiveKpiModal('savings')}>
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={16} className="text-gray-400" /></div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Ahorro Proyectado</p>
                            <div className="flex items-baseline space-x-2">
                                <h2 className="text-4xl font-bold text-[#1E293B]">${kpiStats.savings}</h2>
                                <span className="text-sm text-gray-500 font-medium">/ mes</span>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-400 flex items-center">Ver desglose de ahorro <ArrowUpRight size={10} className="ml-1" /></div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden" onClick={() => setActiveKpiModal('adoption')}>
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={16} className="text-gray-400" /></div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Adopción EWA</p>
                            <div className="flex items-baseline space-x-2">
                                <h2 className="text-4xl font-bold text-[#1C81F2]">{kpiStats.adoption}%</h2>
                                <span className="text-xs text-gray-500 font-bold">Activa</span>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-400 flex items-center">Ver frecuencia de uso <ArrowUpRight size={10} className="ml-1" /></div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-500 hover:shadow-md transition-all group relative overflow-hidden" onClick={() => setActiveKpiModal('engagement')}>
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity"><Maximize2 size={16} className="text-gray-400" /></div>
                            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Engagement</p>
                            <div className="flex items-baseline space-x-2">
                                <h2 className="text-4xl font-bold text-[#3CB7A9]">{kpiStats.engagement}%</h2>
                                <span className="text-xs text-green-600 font-bold">↑ 12%</span>
                            </div>
                            <div className="mt-2 text-[10px] text-gray-400 flex items-center">Ver distribución <ArrowUpRight size={10} className="ml-1" /></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                            <div className="flex justify-between items-start mb-6">
                                <div><h3 className="font-bold text-lg text-[#1E293B]">Puente de Rendimiento</h3><p className="text-sm text-gray-500">Correlación: Bienestar Financiero vs Riesgo Operativo</p></div>
                                <div className="bg-red-50 text-red-700 px-4 py-2 rounded-lg text-sm font-bold border border-red-100 shadow-sm">Correlación (r): {correlation.toFixed(2)}</div>
                            </div>
                            {Math.abs(correlation) > 0.7 && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 shadow-sm relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-400"></div>
                                    <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                                    <div className="text-xs text-red-800">
                                        <span className="font-bold">Insight Crítico:</span> En {filterArea === 'All' ? 'la organización' : filterArea}, los empleados con FWI &lt; 50 tienen <span className="font-bold text-red-600">5x más absentismo.</span>
                                    </div>
                                </div>
                            )}
                            <div className="h-64 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis type="number" dataKey="x" name="FWI Score" unit=" pts" domain={[0, 100]} tick={{fontSize: 12, fill: '#6b7280'}} axisLine={{stroke: '#9ca3af'}} tickLine={false} />
                                        <YAxis type="number" dataKey="y" name="Días Absentismo" unit=" días" tick={{fontSize: 12, fill: '#6b7280'}} axisLine={{stroke: '#9ca3af'}} tickLine={false} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const data = payload[0].payload;
                                                return <div className="bg-white p-2 shadow-lg border rounded text-xs"><strong>{data.name}</strong><br/>FWI: {data.x}<br/>Ausencias: {data.y}</div>;
                                            }
                                            return null;
                                        }}/>
                                        <Scatter name="Colaborador" data={scatterData} fill="#1C81F2" />
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <h3 className="font-bold text-lg text-[#1E293B] mb-6">Focos de Riesgo (Clusters)</h3>
                            <p className="text-xs text-gray-500 mb-4">Grupos con FWI &lt; 50 que requieren intervención.</p>
                            <div className="space-y-4">
                                {riskClusters.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm">No se detectaron focos de riesgo críticos.</div>
                                ) : (
                                    riskClusters.map((cluster, idx) => (
                                        <div key={idx} className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:shadow-md transition-all">
                                            <div className="flex justify-between items-center mb-2">
                                                <h4 className="font-bold text-[#1E293B]">{cluster.department}</h4>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${cluster.severity === 'Critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>{cluster.severity}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mb-3">{cluster.count} Personas en riesgo</p>
                                            <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                                                <div><p className="text-[10px] font-bold text-gray-400 uppercase">Pérdida Proy:</p><p className="font-bold text-red-600 text-xs">${(cluster.projectedLoss/1000).toFixed(1)}k</p></div>
                                                <button 
                                                  onClick={() => { setInterventionStep('select'); setActiveInterventionModal(cluster); }} 
                                                  className="bg-[#1C81F2] text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-blue-600 shadow-sm"
                                                >
                                                  Intervenir
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ... Other Tabs (Requests, TreePoints, etc.) ... */}
            {activeTab === 'requests' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div><h2 className="text-xl font-bold text-[#1E293B]">Gestión de Solicitudes (Inbox)</h2><p className="text-sm text-gray-500">Instrucciones de pago enrutadas por Treevü.</p></div>
                            <button className="flex items-center space-x-2 text-blue-600 font-bold bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100"><Download size={18} /><span>Descargar Payload Bancario</span></button>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500">
                                <tr><th className="p-4">ID Solicitud</th><th className="p-4">Colaborador</th><th className="p-4">Propósito</th><th className="p-4">Banco Destino</th><th className="p-4 text-right">Monto</th><th className="p-4 text-center">Acción</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {pendingRequests.map(req => (
                                    <tr key={req.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-xs">{req.id}</td>
                                        <td className="p-4 font-bold text-gray-700">{req.empName} <span className="text-xs font-normal text-gray-400 block">{req.empId}</span></td>
                                        <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${req.purpose === 'Aporte Ahorro' ? 'bg-teal-100 text-teal-700' : 'bg-gray-100 text-gray-600'}`}>{req.purpose}</span></td>
                                        <td className="p-4 text-gray-500 text-xs">{req.bank}</td>
                                        <td className="p-4 text-right font-bold text-[#1E293B]">${req.amount.toFixed(2)}</td>
                                        <td className="p-4 text-center">
                                            <div className="flex justify-center space-x-2">
                                                <button className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors" title="Rechazar"><XCircle size={18} /></button>
                                                <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-bold text-xs px-3" onClick={() => setPendingRequests(prev => prev.filter(p => p.id !== req.id))}>Autorizar Pago</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {pendingRequests.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No hay solicitudes pendientes.</td></tr>}
                            </tbody>
                        </table>
                    </div>

                    {/* AUDIT LOG SECTION - NEW */}
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <div className="flex items-center space-x-2">
                                <FileSearch className="text-gray-400" size={20} />
                                <h3 className="font-bold text-lg text-[#1E293B]">Bitácora de Auditoría (Audit Log)</h3>
                            </div>
                            <div className="flex space-x-2">
                                <button className="p-2 hover:bg-gray-50 rounded text-gray-500"><Filter size={16} /></button>
                                <button className="p-2 hover:bg-gray-50 rounded text-gray-500"><Download size={16} /></button>
                            </div>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500">
                                <tr><th className="p-4">ID Evento</th><th className="p-4">Usuario</th><th className="p-4">Acción</th><th className="p-4">Detalle</th><th className="p-4 text-right">Tiempo</th></tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {AUDIT_LOG.map(log => (
                                    <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-xs text-gray-400">{log.id}</td>
                                        <td className="p-4 font-bold text-gray-700">{log.user}</td>
                                        <td className="p-4"><span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">{log.action}</span></td>
                                        <td className="p-4 text-gray-600 text-xs">{log.detail}</td>
                                        <td className="p-4 text-right text-xs text-gray-400">{log.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'treepoints' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    {/* TP Overview Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-green-400 group" onClick={() => setActiveTpModal('issuance')}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Total Emitidos</p>
                                <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors"><Leaf size={20}/></div>
                            </div>
                            <h2 className="text-3xl font-bold text-[#1E293B]">{MOCK_TP_STATS.totalIssued.toLocaleString()} pts</h2>
                            <p className="text-xs text-gray-500 mt-1">Impacto FWI: <span className="text-green-600 font-bold">+{MOCK_TP_STATS.fwiImpact} pts</span></p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-400 group" onClick={() => setActiveTpModal('redemption')}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Tasa de Canje</p>
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Gift size={20}/></div>
                            </div>
                            <h2 className="text-3xl font-bold text-[#1E293B]">{MOCK_TP_STATS.redemptionRate}%</h2>
                            <p className="text-xs text-gray-500 mt-1">Alta participación</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-purple-400 group" onClick={() => setActiveTpModal('budget')}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Utilización Presupuesto</p>
                                <div className="bg-purple-100 p-2 rounded-lg text-purple-600 group-hover:bg-purple-500 group-hover:text-white transition-colors"><DollarSign size={20}/></div>
                            </div>
                            <h2 className="text-3xl font-bold text-[#1E293B]">{MOCK_TP_STATS.budgetUtilization}%</h2>
                            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden"><div className="bg-purple-500 h-full" style={{width: `${MOCK_TP_STATS.budgetUtilization}%`}}></div></div>
                        </div>
                    </div>

                    {/* Analytics & Actions */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
                            <div className="flex justify-between items-center mb-6">
                                <div><h3 className="font-bold text-lg text-[#1E293B]">Mapa de Calor: Impacto por Área</h3><p className="text-xs text-gray-500">Correlación: Puntos emitidos vs FWI Promedio</p></div>
                                <button onClick={() => { setIssueStep('form'); setShowIssueModal(true); }} className="flex items-center space-x-2 bg-[#1C81F2] text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-600 shadow-sm"><Plus size={16}/><span>Emitir Puntos</span></button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500"><tr><th className="p-3">Departamento</th><th className="p-3 text-right">Puntos Emitidos</th><th className="p-3 text-right">Tasa Canje</th><th className="p-3 text-right">FWI Promedio</th><th className="p-3 text-center">Impacto</th></tr></thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {MOCK_TP_HEATMAP.map((row, idx) => (
                                            <tr key={idx} className="hover:bg-gray-50">
                                                <td className="p-3 font-bold text-gray-700">{row.department}</td>
                                                <td className="p-3 text-right">{row.pointsIssued.toLocaleString()}</td>
                                                <td className="p-3 text-right">{row.redemptionRate}%</td>
                                                <td className="p-3 text-right font-bold">{row.avgFwi}</td>
                                                <td className="p-3 text-center"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${row.impactLabel === 'High' ? 'bg-green-100 text-green-700' : row.impactLabel === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{row.impactLabel}</span></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-sm border">
                            <h3 className="font-bold text-lg text-[#1E293B] mb-4">Acciones Recomendadas</h3>
                            <div className="space-y-4">
                                <div className="p-4 bg-orange-50 border border-orange-100 rounded-xl">
                                    <h4 className="font-bold text-sm text-orange-800 mb-1">Bono Retención: IT</h4>
                                    <p className="text-xs text-orange-600 mb-3">El departamento IT tiene un FWI alto pero baja redención. Incentivar uso.</p>
                                    <button 
                                        className="text-xs bg-white border border-orange-200 text-orange-700 px-3 py-1 rounded font-bold"
                                        onClick={() => { setIssueForm({...issueForm, reason: 'Campaña Retención IT', targetId: 'IT'}); setShowIssueModal(true); }}
                                    >
                                        Crear Campaña
                                    </button>
                                </div>
                                <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                                    <h4 className="font-bold text-sm text-blue-800 mb-1">Refuerzo: Logística</h4>
                                    <p className="text-xs text-blue-600 mb-3">Alto impacto detectado. Emitir bono de 500 pts para mantener la tendencia.</p>
                                    <button className="text-xs bg-white border border-blue-200 text-blue-700 px-3 py-1 rounded font-bold" onClick={() => { setIssueForm({...issueForm, targetId: 'Logística'}); setShowIssueModal(true); }}>Emitir Ahora</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* ... Other Tabs continued (Partners, Reconciliation, Config) ... */}
            {activeTab === 'partners' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="flex justify-between items-center">
                        <div><h2 className="text-2xl font-bold text-[#1E293B]">Red de Aliados Comerciales</h2><p className="text-gray-500">Gestiona los comercios conectados al ecosistema de beneficios.</p></div>
                        <button 
                            onClick={() => setShowInviteModal(true)}
                            className="bg-[#1C81F2] text-white px-4 py-2 rounded-xl font-bold flex items-center shadow-lg shadow-blue-900/10 hover:bg-blue-600 transition-colors"
                        >
                            <Plus size={20} className="mr-2" />Invitar Comercio
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-500 group transition-all" onClick={() => setActivePartnerStatsModal('merchants')}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Comercios Activos</p>
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors"><Store size={20}/></div>
                            </div>
                            <h2 className="text-3xl font-bold text-[#1E293B]">12</h2>
                            <p className="text-xs text-green-600 mt-1 flex items-center"><CheckCircle size={12} className="mr-1"/> 100% Operativos</p>
                        </div>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-orange-500 group transition-all" onClick={() => setActivePartnerStatsModal('offers')}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Ofertas Vigentes</p>
                                <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors"><Tag size={20}/></div>
                            </div>
                            <h2 className="text-3xl font-bold text-[#1E293B]">45</h2>
                            <p className="text-xs text-gray-500 mt-1">15 Flash Deals, 30 Evergreen</p>
                        </div>
                         <div className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-green-500 group transition-all" onClick={() => setActivePartnerStatsModal('savings')}>
                            <div className="flex justify-between items-start mb-2">
                                <p className="text-xs font-bold text-gray-400 uppercase">Ahorro Generado (YTD)</p>
                                <div className="bg-green-100 p-2 rounded-lg text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors"><DollarSign size={20}/></div>
                            </div>
                            <h2 className="text-3xl font-bold text-[#1E293B]">$124.5k</h2>
                            <p className="text-xs text-gray-500 mt-1">Beneficio directo al empleado</p>
                        </div>
                    </div>

                    {/* List */}
                     <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b flex justify-between items-center">
                            <h3 className="font-bold text-lg text-[#1E293B]">Directorio de Partners</h3>
                            <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded-lg border border-gray-200">
                                <Search size={16} className="text-gray-400" />
                                <input type="text" placeholder="Buscar comercio..." className="bg-transparent text-sm outline-none w-48"/>
                            </div>
                        </div>
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500"><tr><th className="p-4">Comercio</th><th className="p-4">Categoría</th><th className="p-4">Estado</th><th className="p-4">Engagement</th><th className="p-4">Ofertas Activas</th><th className="p-4 text-right">Acción</th></tr></thead>
                            <tbody className="divide-y divide-gray-100">
                                {MOCK_PARTNERS.map(partner => (
                                    <tr key={partner.id} className="hover:bg-gray-50 transition-colors">
                                         <td className="p-4 font-bold text-[#1E293B] flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3 text-gray-600 font-bold">{partner.name.charAt(0)}</div>
                                            {partner.name}
                                         </td>
                                         <td className="p-4 text-gray-600">{partner.category}</td>
                                         <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold ${partner.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{partner.status}</span></td>
                                         <td className="p-4">
                                            <div className="flex items-center">
                                                <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                                                    <div className={`h-full ${partner.engagement === 'High' ? 'bg-green-500 w-full' : partner.engagement === 'Medium' ? 'bg-yellow-500 w-2/3' : 'bg-red-500 w-1/3'}`}></div>
                                                </div>
                                                <span className="text-xs font-medium text-gray-500">{partner.engagement}</span>
                                            </div>
                                         </td>
                                         <td className="p-4 font-mono">{partner.offers}</td>
                                         <td className="p-4 text-right">
                                             <button 
                                                className="text-blue-600 font-bold text-xs hover:underline"
                                                onClick={() => setActivePartnerModal(partner)}
                                             >
                                                Gestionar
                                             </button>
                                         </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     </div>
                </div>
            )}

            {activeTab === 'reconciliation' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onClick={() => setActiveFinanceModal('receivable')} className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-orange-400 group">
                             <div className="flex justify-between items-start mb-4">
                                 <div><h3 className="font-bold text-lg text-gray-800">Nómina Adelantada (Por Deducir)</h3><p className="text-xs text-gray-500">Instrucciones de pago enviadas a banco</p></div>
                                 <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors"><Briefcase size={20} /></div>
                             </div>
                             <h2 className="text-4xl font-bold text-[#1E293B]">$985.50</h2>
                             <div className="mt-4 flex items-center text-xs text-gray-500"><Clock size={14} className="mr-1" /><span>Liquidación estimada: 15 Oct</span></div>
                        </div>
                        <div onClick={() => setActiveFinanceModal('deduction')} className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-400 group">
                             <div className="flex justify-between items-start mb-4">
                                 <div><h3 className="font-bold text-lg text-gray-800">Total a Descontar</h3><p className="text-xs text-gray-500">Ajuste automático próximo ciclo</p></div>
                                 <div className="bg-blue-100 p-2 rounded-lg text-blue-600 group-hover:bg-blue-500 group-hover:text-white transition-colors"><FileText size={20} /></div>
                             </div>
                             <h2 className="text-4xl font-bold text-[#1E293B]">$1,013.00</h2>
                             <div className="mt-4 flex items-center text-xs text-gray-500"><Info size={14} className="mr-1" /><span>Incluye $27.50 de tarifas</span></div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'config' && (
                <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-right-4 duration-500">
                     <div className="bg-white rounded-2xl shadow-sm border p-8">
                         <h2 className="text-2xl font-bold text-[#1E293B] mb-2">Integración de Datos (Data Bridge)</h2>
                         <p className="text-gray-500 mb-8">Estado de la conexión con HRIS y reglas de motor de cálculo.</p>
                         
                         <div className="space-y-4">
                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                 <div className="flex items-center space-x-4">
                                     <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><Layers size={24} /></div>
                                     <div><h4 className="font-bold text-[#1E293B]">Mapeo de Departamentos</h4><p className="text-xs text-gray-500">4 Centros de Costo detectados</p></div>
                                 </div>
                                 <button onClick={() => setActiveConfigModal('mapping')} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Verificar</button>
                             </div>

                             <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                 <div className="flex items-center space-x-4">
                                     <div className="bg-teal-100 p-2 rounded-lg text-teal-600"><Server size={24} /></div>
                                     <div><h4 className="font-bold text-[#1E293B]">Ingesta de Nómina (EWA Rules)</h4><p className="text-xs text-gray-500">Reglas de cálculo y límites</p></div>
                                 </div>
                                 <button onClick={() => setActiveConfigModal('payroll')} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Configurar</button>
                             </div>
                         </div>
                     </div>
                </div>
            )}
        </main>

        {/* --- MODALS --- */}

        {/* CONFIGURATION MODALS (Missing Loose End Fixed) */}
        {activeConfigModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveConfigModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    {activeConfigModal === 'mapping' ? (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Mapeo de Departamentos (HRIS)</h3><p className="text-sm text-gray-500">Conexión con estructura organizacional</p></div>
                            <table className="w-full text-sm text-left mb-6">
                                <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500"><tr><th className="p-3">Código HRIS</th><th className="p-3">Nombre Origen</th><th className="p-3">Treevü Dept</th><th className="p-3 text-center">Estado</th></tr></thead>
                                <tbody className="divide-y">
                                    {MOCK_DEPT_MAPPING.map((m, i) => (
                                        <tr key={i}>
                                            <td className="p-3 font-mono text-xs">{m.hrisCode}</td>
                                            <td className="p-3">{m.hrisName}</td>
                                            <td className="p-3 font-bold">{m.treevuMapping}</td>
                                            <td className="p-3 text-center"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${m.status === 'ok' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{m.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="bg-blue-50 p-4 rounded-xl text-xs text-blue-800 border border-blue-100">
                                <strong>Sincronización Automática:</strong> Los cambios en el organigrama se reflejan cada 24 horas.
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Reglas de Acceso (EWA Rules)</h3><p className="text-sm text-gray-500">Parámetros globales de cálculo</p></div>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between p-3 border rounded-xl">
                                    <div><p className="font-bold text-sm">Porcentaje Máximo de Retiro</p><p className="text-xs text-gray-500">Sobre salario devengado</p></div>
                                    <div className="flex items-center space-x-2"><input type="number" className="w-16 p-1 border rounded text-right font-bold" defaultValue={50} /><span className="text-sm font-bold">%</span></div>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-xl">
                                    <div><p className="font-bold text-sm">Días de Bloqueo (Blackout)</p><p className="text-xs text-gray-500">Antes del corte de nómina</p></div>
                                    <div className="flex items-center space-x-2"><input type="number" className="w-16 p-1 border rounded text-right font-bold" defaultValue={3} /><span className="text-sm font-bold">días</span></div>
                                </div>
                                <div className="flex items-center justify-between p-3 border rounded-xl">
                                    <div><p className="font-bold text-sm">Límite Transacciones / Mes</p><p className="text-xs text-gray-500">Por colaborador</p></div>
                                    <div className="flex items-center space-x-2"><input type="number" className="w-16 p-1 border rounded text-right font-bold" defaultValue={4} /><span className="text-sm font-bold">txs</span></div>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3">
                                <button onClick={() => setActiveConfigModal(null)} className="px-4 py-2 border rounded-lg font-bold text-gray-500">Cancelar</button>
                                <button className="px-4 py-2 bg-[#1C81F2] text-white rounded-lg font-bold">Guardar Reglas</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* PARTNER STATS DRILL-DOWN MODALS (New Feature) */}
        {activePartnerStatsModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActivePartnerStatsModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    {activePartnerStatsModal === 'merchants' && (
                        <div>
                            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Comercios por Categoría</h3>
                            <p className="text-sm text-gray-500 mb-6">Distribución de la red de aliados</p>
                            <div className="flex items-center justify-center h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={PARTNER_CATS} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label>
                                            {PARTNER_CATS.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                        </Pie>
                                        <Legend verticalAlign="bottom" height={36} />
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100">
                                <strong>Cobertura:</strong> La categoría 'Alimentos' domina la red (40%), asegurando cobertura para necesidades básicas de los empleados.
                            </div>
                        </div>
                    )}

                    {activePartnerStatsModal === 'offers' && (
                        <div>
                            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Tipología de Ofertas</h3>
                            <p className="text-sm text-gray-500 mb-6">Flash (Tiempo Limitado) vs Evergreen (Recurrente)</p>
                            <div className="h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={PARTNER_OFFERS_TYPE} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" width={120} />
                                        <Tooltip />
                                        <Bar dataKey="value" fill="#F59E0B" radius={[0, 4, 4, 0]} barSize={30}>
                                            {PARTNER_OFFERS_TYPE.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#F59E0B' : '#10B981'} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-xl text-sm text-orange-800 border border-orange-100">
                                <strong>Estrategia:</strong> Las ofertas Evergreen proveen estabilidad, mientras que las Flash generan picos de engagement.
                            </div>
                        </div>
                    )}

                    {activePartnerStatsModal === 'savings' && (
                        <div>
                            <h3 className="text-xl font-bold text-[#1E293B] mb-2">Tendencia de Ahorro Generado</h3>
                            <p className="text-sm text-gray-500 mb-6">Valor entregado al empleado (Mensual)</p>
                            <div className="h-64 mb-6 bg-slate-50 rounded-xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={PARTNER_SAVINGS_TREND}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="value" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Ahorro (k)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl text-sm text-green-800 border border-green-100">
                                <strong>Impacto:</strong> El ahorro mensual ha crecido un 35% en el último trimestre, mejorando el salario emocional percibido.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* INTERVENTION STUDIO MODAL */}
        {activeInterventionModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveInterventionModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    {interventionStep === 'select' ? (
                        <>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-[#1E293B] mb-1">Estudio de Intervención: {activeInterventionModal.department}</h3>
                                <p className="text-sm text-red-500 font-bold bg-red-50 inline-block px-2 py-1 rounded">Riesgo Detectado: {activeInterventionModal.severity}</p>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-4">
                                Has identificado un clúster de riesgo financiero en <strong>{activeInterventionModal.department}</strong> ({activeInterventionModal.count} empleados). Selecciona una acción correctiva para mitigar el riesgo de rotación.
                            </p>

                            <div className="space-y-3 mb-8">
                                <div 
                                    onClick={() => setInterventionType('education')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${interventionType === 'education' ? 'border-blue-500 bg-blue-50' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><BookOpen size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#1E293B]">Campaña Educativa (Push)</h4>
                                        <p className="text-xs text-gray-500">Enviar cápsulas de "Salud Financiera" y tips de ahorro.</p>
                                    </div>
                                </div>

                                <div 
                                    onClick={() => setInterventionType('points')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${interventionType === 'points' ? 'border-green-500 bg-green-50' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <div className="bg-green-100 p-2 rounded-lg text-green-600"><Gift size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#1E293B]">Incentivo Económico (TreePoints)</h4>
                                        <p className="text-xs text-gray-500">Asignar bono de 500 puntos para aliviar estrés inmediato.</p>
                                    </div>
                                </div>

                                <div 
                                    onClick={() => setInterventionType('rule')}
                                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start space-x-3 ${interventionType === 'rule' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-300'}`}
                                >
                                    <div className="bg-orange-100 p-2 rounded-lg text-orange-600"><Ban size={20} /></div>
                                    <div>
                                        <h4 className="font-bold text-sm text-[#1E293B]">Restricción Preventiva (Freno)</h4>
                                        <p className="text-xs text-gray-500">Limitar temporalmente el acceso EWA al 20% para evitar sobreendeudamiento.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-3">
                                <button onClick={() => setActiveInterventionModal(null)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                                <button onClick={handleInterventionSubmit} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold hover:bg-blue-600 shadow-lg">Ejecutar Acción</button>
                            </div>
                        </>
                    ) : interventionStep === 'processing' ? (
                        <div className="py-12 text-center">
                            <RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={40} />
                            <h3 className="text-lg font-bold text-gray-800">Procesando Intervención...</h3>
                            <p className="text-sm text-gray-500">Aplicando reglas al departamento {activeInterventionModal.department}</p>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                            <h3 className="text-xl font-bold text-[#1E293B] mb-2">¡Acción Completada!</h3>
                            <p className="text-sm text-gray-600 mb-6 px-4">
                                {interventionType === 'education' && "Se ha enviado la campaña 'Bienestar 101' a todos los dispositivos móviles del departamento."}
                                {interventionType === 'points' && "Se han acreditado 500 TreePoints a las billeteras de los colaboradores elegibles."}
                                {interventionType === 'rule' && "El límite de retiro se ha ajustado al 20% temporalmente. Se ha notificado a los usuarios."}
                            </p>
                            <button onClick={() => setActiveInterventionModal(null)} className="w-full bg-[#1E293B] text-white py-3 rounded-xl font-bold">Volver al Dashboard</button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Existing Modals logic retained (Invite Merchant, KPI Details, Partner Management, Finance, TreePoints...) */}
        {showInviteModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setShowInviteModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    <div className="mb-6 text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"><Store size={32} className="text-[#1C81F2]" /></div>
                        <h3 className="text-xl font-bold text-[#1E293B]">Invitar Comercio</h3>
                        <p className="text-sm text-gray-500 mt-2">Sugiere un nuevo aliado para la red de beneficios.</p>
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del Comercio</label>
                            <input type="text" placeholder="Ej: Gimnasio Local, Librería..." className="w-full p-3 border rounded-xl text-sm" />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Categoría</label>
                            <select className="w-full p-3 border rounded-xl text-sm bg-white">
                                <option>Alimentos y Bebidas</option>
                                <option>Salud y Bienestar</option>
                                <option>Transporte</option>
                                <option>Educación</option>
                                <option>Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email de Contacto (Opcional)</label>
                            <div className="flex items-center border rounded-xl overflow-hidden">
                                <span className="pl-3 text-gray-400"><Mail size={16} /></span>
                                <input type="email" placeholder="contacto@comercio.com" className="w-full p-3 text-sm outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Ubicación / Notas</label>
                            <div className="flex items-center border rounded-xl overflow-hidden">
                                <span className="pl-3 text-gray-400"><MapPin size={16} /></span>
                                <input type="text" placeholder="Cerca de la oficina central..." className="w-full p-3 text-sm outline-none" />
                            </div>
                        </div>
                        
                        <button onClick={() => setShowInviteModal(false)} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors shadow-lg mt-4">
                            Enviar Invitación
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* ... Rest of existing modals ... */}
        {activeKpiModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative overflow-hidden">
                    <button onClick={() => setActiveKpiModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    {activeKpiModal === 'fwi' && (
                        <div>
                            <div className="mb-6"><h3 className="text-2xl font-bold text-[#1E293B]">Análisis Detallado: FWI Promedio</h3><p className="text-sm text-gray-500">Mostrando datos para: {filterArea} / {filterModality}</p></div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                <div className="md:col-span-2 h-64 bg-slate-50 rounded-xl p-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={modalChartData.fwiTrend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis domain={[0, 100]} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#1C81F2" strokeWidth={3} /></LineChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-xl"><h4 className="font-bold text-blue-800 text-2xl">{kpiStats.fwi}</h4><p className="text-xs text-blue-600 uppercase">Score Actual</p></div>
                                    <div className="bg-green-50 p-4 rounded-xl"><h4 className="font-bold text-green-800 text-2xl">+4</h4><p className="text-xs text-green-600 uppercase">Tendencia</p></div>
                                </div>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-gray-700"><strong>Conclusión Operativa:</strong> La estabilidad del FWI indica una reducción en el estrés financiero, correlacionada con menor ausentismo en el equipo de Ventas.</div>
                        </div>
                    )}
                    {activeKpiModal === 'savings' && (
                        <div>
                            <div className="mb-4">
                                <h3 className="text-2xl font-bold text-[#1E293B]">Impacto Proyectado: Ahorro</h3>
                                <p className="text-sm text-gray-500">Capital retenido por los empleados</p>
                            </div>
                            
                            <div className="bg-indigo-50 p-4 rounded-xl border border-indigo-100 mb-6">
                                <div className="flex items-start space-x-3">
                                    <Info className="text-indigo-600 mt-1 flex-shrink-0" size={18} />
                                    <div>
                                        <h4 className="font-bold text-sm text-indigo-900">Definición y Cálculo</h4>
                                        <p className="text-xs text-indigo-800 mt-1 leading-relaxed">
                                            Representa el dinero que los colaboradores <strong>no gastaron en intereses</strong> y comisiones bancarias gracias al acceso a su salario devengado.
                                        </p>
                                        <div className="mt-2 bg-white/60 p-2 rounded text-xs font-mono text-indigo-900 border border-indigo-200">
                                            Ahorro = (Volumen EWA × Tasa Interés Mercado 15%) - (Tarifas Treevü)
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-center h-56 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={modalChartData.savingsDist} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>{modalChartData.savingsDist.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-teal-500 text-sm text-gray-700"><strong>Conclusión Operativa:</strong> El 75% del ahorro proviene de evitar intereses de tarjetas de crédito o préstamos rápidos, protegiendo la liquidez futura del colaborador.</div>
                        </div>
                    )}
                    {activeKpiModal === 'adoption' && (
                        <div>
                             <div className="mb-6"><h3 className="text-2xl font-bold text-[#1E293B]">Adopción EWA</h3><p className="text-sm text-gray-500">Frecuencia de uso mensual</p></div>
                             <div className="grid grid-cols-2 gap-6 mb-6">
                                 <div className="h-64 bg-slate-50 rounded-xl p-4">
                                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Distribución</h4>
                                    <ResponsiveContainer width="100%" height="90%">
                                        <BarChart data={modalChartData.adoptionDist}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" label={{ value: 'Retiros/Mes', position: 'bottom', offset: 0 }} /><YAxis /><Tooltip /><Bar dataKey="count" fill="#1C81F2" radius={[4, 4, 0, 0]} /></BarChart>
                                    </ResponsiveContainer>
                                 </div>
                                 <div className="h-64 bg-slate-50 rounded-xl p-4">
                                     <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Calidad de Adopción</h4>
                                     <ResponsiveContainer width="100%" height="90%">
                                         <PieChart>
                                             <Pie data={ADOPTION_QUALITY} cx="50%" cy="50%" innerRadius={50} outerRadius={70} dataKey="value" label>{ADOPTION_QUALITY.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie>
                                             <Tooltip /><Legend verticalAlign="bottom" height={36}/>
                                         </PieChart>
                                     </ResponsiveContainer>
                                 </div>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-gray-700"><strong>Distinción Crítica:</strong> El 82% es uso esporádico (Sano/Emergencia). Solo el 18% muestra recurrencia (Crónico), señalando un posible déficit estructural que requiere intervención educativa.</div>
                        </div>
                    )}
                    {activeKpiModal === 'engagement' && (
                        <div>
                            <div className="mb-6"><h3 className="text-2xl font-bold text-[#1E293B]">Engagement Score</h3><p className="text-sm text-gray-500">Uso por módulo de bienestar</p></div>
                            <div className="h-64 mb-6 bg-slate-50 rounded-xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={modalChartData.engagementRadar}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="subject" />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} />
                                        <Radar name="Engagement" dataKey="A" stroke="#3CB7A9" fill="#3CB7A9" fillOpacity={0.6} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-teal-500 text-sm text-gray-700"><strong>Conclusión Operativa:</strong> Los usuarios están utilizando la plataforma para planificación a largo plazo (Metas), no solo para liquidez inmediata.</div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ... Rest of modals (Partner Mgmt, Finance, TreePoints, Onboarding) ... */}
        {activePartnerModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActivePartnerModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    <div className="flex items-start space-x-4 mb-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-2xl font-bold text-gray-500">
                            {activePartnerModal.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-2xl font-bold text-[#1E293B]">{activePartnerModal.name}</h3>
                                    <p className="text-sm text-gray-500">{activePartnerModal.category}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${activePartnerModal.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                    {activePartnerModal.status}
                                </span>
                            </div>
                            <div className="mt-4 flex space-x-4 text-sm">
                                <div className="bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <span className="text-gray-500 block text-xs uppercase font-bold">Comisión</span>
                                    <span className="font-bold text-[#1E293B]">{activePartnerModal.commission}</span>
                                </div>
                                <div className="bg-slate-50 px-3 py-1.5 rounded-lg">
                                    <span className="text-gray-500 block text-xs uppercase font-bold">Engagement</span>
                                    <span className="font-bold text-[#1E293B]">{activePartnerModal.engagement}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6 mb-8">
                        <div className="bg-white border rounded-xl p-4 shadow-sm">
                            <h4 className="font-bold text-sm text-gray-800 mb-4">Rendimiento Mensual</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Redenciones</span>
                                    <span className="font-bold">452</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Vol. Generado</span>
                                    <span className="font-bold text-green-600">$12,450</span>
                                </div>
                                <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
                                    <div className="bg-[#1C81F2] h-full" style={{width: '75%'}}></div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border rounded-xl p-4 shadow-sm">
                            <h4 className="font-bold text-sm text-gray-800 mb-4">Configuración</h4>
                            <div className="space-y-3">
                                <button className="w-full text-left flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded transition-colors">
                                    <span className="text-gray-600">Renegociar Comisión</span>
                                    <Settings size={14} className="text-gray-400" />
                                </button>
                                <button className="w-full text-left flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded transition-colors">
                                    <span className="text-gray-600">Pausar Relación</span>
                                    <ToggleLeft size={14} className="text-gray-400" />
                                </button>
                                <button className="w-full text-left flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded transition-colors">
                                    <span className="text-red-500">Terminar Contrato</span>
                                    <XCircle size={14} className="text-red-400" />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-3 border-t pt-4">
                        <button onClick={() => setActivePartnerModal(null)} className="px-4 py-2 text-gray-500 font-bold hover:bg-gray-50 rounded-lg">Cerrar</button>
                        <button className="px-6 py-2 bg-[#1E293B] text-white font-bold rounded-lg shadow-sm hover:bg-black">Guardar Cambios</button>
                    </div>
                </div>
            </div>
        )}

        {activeFinanceModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveFinanceModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    {activeFinanceModal === 'receivable' ? (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Nómina Adelantada (Por Deducir)</h3><p className="text-sm text-gray-500">Instrucciones de pago enviadas a banco</p></div>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="bg-slate-50 rounded-xl p-4 h-56">
                                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Aging (Días)</h4>
                                    <ResponsiveContainer width="100%" height="90%"><BarChart data={AGING_DATA}><CartesianGrid vertical={false} /><XAxis dataKey="range" tick={{fontSize: 10}} /><YAxis hide /><Tooltip /><Bar dataKey="amount" fill="#1C81F2" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4 h-56">
                                    <h4 className="text-xs font-bold uppercase text-gray-400 mb-2">Por Propósito</h4>
                                    <ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={PURPOSE_BREAKDOWN} cx="50%" cy="50%" innerRadius={40} outerRadius={60} dataKey="value"><Cell fill="#EF4444"/><Cell fill="#1C81F2"/><Cell fill="#10B981"/></Pie><Tooltip /></PieChart></ResponsiveContainer>
                                </div>
                            </div>
                            <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs text-gray-600 w-2/3">
                                    <strong>Nota de Seguridad Jurídica (Prelación de Cobro):</strong> Aunque la empresa realiza la dispersión, la deducción de nómina tiene prioridad jurídica sobre otros acreedores externos, minimizando el riesgo de incobrabilidad casi a cero.
                                </p>
                                <button className="text-blue-600 font-bold text-xs flex items-center"><Download size={14} className="mr-1"/> Exportar Detalle</button>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Conciliación de Nómina</h3><p className="text-sm text-gray-500">Desglose Principal vs Tarifas</p></div>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="h-56"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={DEDUCTION_COMPOSITION} cx="50%" cy="50%" outerRadius={70} dataKey="value" label><Cell fill="#1C81F2"/><Cell fill="#F59E0B"/></Pie><Legend /></PieChart></ResponsiveContainer></div>
                                <div>
                                    <h4 className="font-bold text-sm mb-3">Desglose de Tarifas</h4>
                                    <table className="w-full text-xs">
                                        <thead className="bg-gray-50 text-gray-500 font-bold"><tr><th className="p-2 text-left">Tipo</th><th className="p-2 text-right">Total</th></tr></thead>
                                        <tbody className="divide-y">
                                            {FEE_BREAKDOWN.map((f,i) => (<tr key={i}> <td className="p-2">{f.type}</td><td className="p-2 text-right">${f.total.toFixed(2)}</td></tr>))}
                                        </tbody>
                                        <tfoot className="border-t font-bold"><tr><td className="p-2">Total</td><td className="p-2 text-right text-orange-500">$27.50</td></tr></tfoot>
                                    </table>
                                </div>
                            </div>
                            <button className="w-full bg-[#1E293B] text-white py-3 rounded-xl font-bold flex justify-center items-center"><FileText size={18} className="mr-2"/> Generar Archivo de Nómina (.CSV)</button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* TREEPOINTS DRILL-DOWN MODALS - NEW */}
        {activeTpModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveTpModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    {activeTpModal === 'issuance' && (
                        <div>
                            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Tendencia de Emisión</h3>
                            <p className="text-sm text-gray-500 mb-6">Puntos asignados vs. Objetivo mensual</p>
                            <div className="h-64 bg-slate-50 rounded-xl p-4 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={TP_ISSUANCE_TREND}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="issued" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Emitidos" />
                                        <Area type="monotone" dataKey="target" stroke="#94A3B8" strokeDasharray="5 5" fill="transparent" name="Meta" />
                                        <Legend />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-green-50 p-4 rounded-xl border-l-4 border-green-500 text-sm text-gray-700">
                                <strong>Insight:</strong> La emisión está un 15% por encima de la meta debido a los incentivos de ventas del Q3. Esto correlaciona positivamente con el aumento del FWI en ese departamento.
                            </div>
                        </div>
                    )}

                    {activeTpModal === 'redemption' && (
                        <div>
                            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Preferencias de Canje</h3>
                            <p className="text-sm text-gray-500 mb-6">¿En qué gastan los puntos los colaboradores?</p>
                            <div className="flex items-center justify-center h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={TP_REDEMPTION_CATS} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                                            {TP_REDEMPTION_CATS.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-gray-700">
                                <strong>Insight:</strong> El Marketplace (Cupones) es el principal motor. Los empleados valoran la capacidad de compra inmediata sobre la reducción de tarifas.
                            </div>
                        </div>
                    )}

                    {activeTpModal === 'budget' && (
                        <div>
                            <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Ejecución Presupuestal</h3>
                            <p className="text-sm text-gray-500 mb-6">Utilización del fondo de incentivos acumulado</p>
                            <div className="h-64 bg-slate-50 rounded-xl p-4 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={TP_BUDGET_USAGE}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="used" name="Gastado" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="budget" name="Presupuesto" fill="#E2E8F0" radius={[4, 4, 0, 0]} />
                                        <Legend />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-purple-50 p-4 rounded-xl border-l-4 border-purple-500 text-sm text-gray-700">
                                <strong>Estado:</strong> En curso (45%). Se proyecta alcanzar el 95% de ejecución para fin de año con la campaña de Navidad. El costo promedio por punto se mantiene estable en $0.01.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* TreePoints Issuance Modal (Existing) */}
        {showIssueModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6">
                    <div className="flex justify-between items-center mb-6"><h3 className="font-bold text-lg">Asignar TreePoints</h3><button onClick={() => setShowIssueModal(false)}><X size={20} /></button></div>
                    {issueStep === 'form' ? (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Tipo de Asignación</label>
                                <div className="flex space-x-2">
                                    <button onClick={() => setIssueForm({...issueForm, targetType: 'Department'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${issueForm.targetType === 'Department' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-500'}`}>Departamento</button>
                                    <button onClick={() => setIssueForm({...issueForm, targetType: 'Individual'})} className={`flex-1 py-2 rounded-lg text-xs font-bold border ${issueForm.targetType === 'Individual' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'border-gray-200 text-gray-500'}`}>Individual</button>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">{issueForm.targetType === 'Department' ? 'Departamento Destino' : 'ID Empleado'}</label>
                                {issueForm.targetType === 'Department' ? (
                                    <select value={issueForm.targetId} onChange={(e) => setIssueForm({...issueForm, targetId: e.target.value})} className="w-full p-3 border rounded-xl text-sm bg-white">
                                        <option>Ventas</option><option>Logística</option><option>IT</option><option>Dirección</option><option>Finanzas</option>
                                    </select>
                                ) : (
                                    <input type="text" placeholder="ID Empleado (Ej: EMP-001)" value={issueForm.targetId} onChange={(e) => setIssueForm({...issueForm, targetId: e.target.value})} className="w-full p-3 border rounded-xl text-sm" />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Cantidad de Puntos</label>
                                <input type="number" value={issueForm.amount} onChange={(e) => setIssueForm({...issueForm, amount: Number(e.target.value)})} className="w-full p-3 border rounded-xl text-sm font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Motivo / Concepto</label>
                                <input type="text" value={issueForm.reason} onChange={(e) => setIssueForm({...issueForm, reason: e.target.value})} className="w-full p-3 border rounded-xl text-sm" />
                            </div>
                            <button onClick={handleIssuePoints} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold hover:bg-blue-600 shadow-lg mt-2">Emitir Puntos</button>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                             {issueStep === 'processing' ? <RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={40} /> : <CheckCircle className="mx-auto text-green-500 mb-4" size={40} />}
                             <h3 className="text-xl font-bold text-[#1E293B] mb-2">{issueStep === 'processing' ? 'Procesando Emisión...' : '¡Puntos Asignados!'}</h3>
                             {issueStep === 'success' && <div className="text-sm text-gray-500 mb-4">Los puntos se han acreditado exitosamente.</div>}
                             {issueStep === 'success' && <button onClick={() => setShowIssueModal(false)} className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg font-bold">Cerrar</button>}
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* ONBOARDING MODAL */}
        {showOnboarding && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                  <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden">
                      <div className="bg-[#1C81F2] p-8 text-center text-white">
                          <PieChartIcon size={48} className="mx-auto mb-4" />
                          <h2 className="text-2xl font-bold mb-2">Bienvenido, Director HR</h2>
                          <p className="opacity-90">Inteligencia de Datos para Bienestar Financiero</p>
                      </div>
                      <div className="p-8">
                          <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                              Este dashboard te permite monitorear la salud financiera de tu organización, gestionar el programa de beneficios Treevü y tomar acciones preventivas basadas en datos.
                          </p>
                          <div className="space-y-4 mb-8">
                              <div className="flex items-start space-x-3">
                                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><FileBarChart size={20} /></div>
                                  <div><h4 className="font-bold text-sm text-[#1E293B]">Analítica de Riesgo</h4><p className="text-xs text-gray-500">Correlaciona estrés financiero con absentismo y rotación.</p></div>
                              </div>
                              <div className="flex items-start space-x-3">
                                  <div className="bg-green-100 p-2 rounded-lg text-green-600"><Store size={20} /></div>
                                  <div><h4 className="font-bold text-sm text-[#1E293B]">Red de Beneficios</h4><p className="text-xs text-gray-500">Administra los comercios aliados y el impacto del ahorro.</p></div>
                              </div>
                              <div className="flex items-start space-x-3">
                                  <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Award size={20} /></div>
                                  <div><h4 className="font-bold text-sm text-[#1E293B]">TreePoints & Incentivos</h4><p className="text-xs text-gray-500">Premia comportamientos positivos y fideliza talento clave.</p></div>
                              </div>
                          </div>
                          <button onClick={() => setShowOnboarding(false)} className="w-full bg-[#1E293B] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-black transition-all">Acceder al Panel</button>
                      </div>
                  </div>
              </div>
        )}
    </div>
  );
};
