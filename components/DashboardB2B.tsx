
import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, LineChart, Line, PieChart, Pie, Cell, Legend, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, AreaChart, Area } from 'recharts';
import { Store, ArrowUpRight, ToggleLeft, ToggleRight, Plus, AlertTriangle, CheckCircle, Clock, X, Filter, PieChart as PieChartIcon, BarChart2, Settings, LogOut, FileBarChart, Database, Shield, Server, Layers, ShieldCheck, MousePointer, Maximize2, Link, TrendingUp, DollarSign, Inbox, ClipboardCheck, Download, FileText, UserCheck, XCircle, RefreshCw, Briefcase, Users, ChevronDown, Info, Award, Leaf, Gift } from 'lucide-react';
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

// Mock Data for Finance Modals
const AGING_DATA = [ { range: '1-3 Días', amount: 850 }, { range: '4-7 Días', amount: 120 }, { range: '8+ Días', amount: 15.5 } ];
const PURPOSE_BREAKDOWN = [ { name: 'Emergencia', value: 60, color: '#EF4444' }, { name: 'General', value: 30, color: '#1C81F2' }, { name: 'Ahorro', value: 10, color: '#10B981' } ];
const DEDUCTION_COMPOSITION = [ { name: 'Principal', value: 985.50, color: '#1C81F2' }, { name: 'Tarifas EWA', value: 27.50, color: '#F59E0B' } ];
const FEE_BREAKDOWN = [ { type: 'Retiro Estándar', count: 12, total: 24.00 }, { type: 'Retiro Express', count: 1, total: 3.50 }, { type: 'Promo (Absorbida)', count: 5, total: 0.00 } ];

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

      // 2. Savings Distribution (Mock)
      const savingsDist = [
          { name: 'Potencia Ahorro', value: 60, color: '#10B981' }, 
          { name: 'Gasto Hormiga', value: 40, color: '#F59E0B' } 
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
                                                <button className="bg-white border border-gray-200 text-[#1E293B] px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-100 shadow-sm">Intervenir</button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'requests' && (
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden animate-in slide-in-from-right-4 duration-500">
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
                                            <button className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors font-bold text-xs px-3" onClick={() => setPendingRequests(prev => prev.filter(p => p.id !== req.id))}>Desembolsar</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {pendingRequests.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-gray-400">No hay solicitudes pendientes.</td></tr>}
                        </tbody>
                    </table>
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
                                    <button className="text-xs bg-white border border-orange-200 text-orange-700 px-3 py-1 rounded font-bold">Crear Campaña</button>
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

            {activeTab === 'reconciliation' && (
                <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div onClick={() => setActiveFinanceModal('receivable')} className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-orange-400 group">
                             <div className="flex justify-between items-start mb-4">
                                 <div><h3 className="font-bold text-lg text-gray-800">Cuentas x Cobrar (Activo)</h3><p className="text-xs text-gray-500">Adelantos pendientes de nómina</p></div>
                                 <div className="bg-orange-100 p-2 rounded-lg text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-colors"><Briefcase size={20} /></div>
                             </div>
                             <h2 className="text-4xl font-bold text-[#1E293B]">$985.50</h2>
                             <div className="mt-4 flex items-center text-xs text-gray-500"><Clock size={14} className="mr-1" /><span>Liquidación estimada: 15 Oct</span></div>
                        </div>
                        <div onClick={() => setActiveFinanceModal('deduction')} className="bg-white p-6 rounded-2xl shadow-sm border cursor-pointer hover:border-blue-400 group">
                             <div className="flex justify-between items-start mb-4">
                                 <div><h3 className="font-bold text-lg text-gray-800">Total a Descontar</h3><p className="text-xs text-gray-500">Ajuste nómina próximo ciclo</p></div>
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

        {/* MODALS */}
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
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-gray-700"><strong>Conclusión Operativa:</strong> El FWI en {filterArea} se mantiene estable. El uso de "Gasto Hormiga Detectado" ha correlacionado positivamente con la mejora de 4 puntos.</div>
                        </div>
                    )}
                    {activeKpiModal === 'savings' && (
                        <div>
                            <div className="mb-6"><h3 className="text-2xl font-bold text-[#1E293B]">Impacto Proyectado: Ahorro</h3><p className="text-sm text-gray-500">Distribución de mecanismos de ahorro</p></div>
                            <div className="flex items-center justify-center h-64 mb-6">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={modalChartData.savingsDist} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label>{modalChartData.savingsDist.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-teal-500 text-sm text-gray-700"><strong>Conclusión Operativa:</strong> El 60% del ahorro proviene de la función "Potencia tu Ahorro" (Solicitudes EWA dirigidas). Validar con Tesorería el procesamiento de estas etiquetas.</div>
                        </div>
                    )}
                    {activeKpiModal === 'adoption' && (
                        <div>
                             <div className="mb-6"><h3 className="text-2xl font-bold text-[#1E293B]">Adopción EWA</h3><p className="text-sm text-gray-500">Frecuencia de uso mensual</p></div>
                             <div className="h-64 mb-6 bg-slate-50 rounded-xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={modalChartData.adoptionDist}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" label={{ value: 'Retiros/Mes', position: 'bottom', offset: 0 }} /><YAxis /><Tooltip /><Bar dataKey="count" fill="#1C81F2" radius={[4, 4, 0, 0]} /></BarChart>
                                </ResponsiveContainer>
                             </div>
                             <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-gray-700"><strong>Conclusión Operativa:</strong> La mayoría de usuarios realiza 1-2 retiros al mes, indicando uso para emergencias puntuales y no dependencia crónica.</div>
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
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-teal-500 text-sm text-gray-700"><strong>Conclusión Operativa:</strong> Alto interés en "Metas". La plataforma es vista como herramienta de planificación, no solo de liquidez.</div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeFinanceModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveFinanceModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    {activeFinanceModal === 'receivable' ? (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Análisis de Adelantos Pendientes (Activo)</h3><p className="text-sm text-gray-500">Antigüedad y Composición del Activo</p></div>
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
                                <p className="text-xs text-gray-600 w-2/3">El 95% del activo es menor a 5 días. Riesgo de insolvencia bajo.</p>
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

        {/* TreePoints Issuance Modal */}
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
                                <label className="block text-xs font-bold text-gray-700 mb-1">{issueForm.targetType === 'Department' ? 'Departamento' : 'ID Empleado'}</label>
                                {issueForm.targetType === 'Department' ? (
                                    <select value={issueForm.targetId} onChange={(e) => setIssueForm({...issueForm, targetId: e.target.value})} className="w-full p-2 border rounded-lg text-sm">
                                        <option>Ventas</option><option>Logística</option><option>IT</option><option>Finanzas</option>
                                    </select>
                                ) : (
                                    <input type="text" value={issueForm.targetId} onChange={(e) => setIssueForm({...issueForm, targetId: e.target.value})} className="w-full p-2 border rounded-lg text-sm" placeholder="EMP-XXX" />
                                )}
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Cantidad de Puntos</label>
                                <input type="number" value={issueForm.amount} onChange={(e) => setIssueForm({...issueForm, amount: Number(e.target.value)})} className="w-full p-2 border rounded-lg text-sm font-bold" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Motivo / Campaña</label>
                                <input type="text" value={issueForm.reason} onChange={(e) => setIssueForm({...issueForm, reason: e.target.value})} className="w-full p-2 border rounded-lg text-sm" />
                            </div>
                            <div className="pt-4 flex space-x-3">
                                <button onClick={() => setShowIssueModal(false)} className="flex-1 py-3 border rounded-xl font-bold text-gray-500">Cancelar</button>
                                <button onClick={handleIssuePoints} className="flex-1 bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Asignar Puntos</button>
                            </div>
                        </div>
                    ) : issueStep === 'processing' ? (
                        <div className="py-8 text-center"><RefreshCw className="animate-spin mx-auto text-[#1C81F2] mb-4" size={32} /><p>Procesando asignación...</p></div>
                    ) : (
                        <div className="py-4 text-center">
                            <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
                            <h3 className="font-bold text-lg mb-2">¡Asignación Exitosa!</h3>
                            <p className="text-xs text-gray-500 mb-6">Se han emitido {issueForm.amount} puntos a {issueForm.targetId}.</p>
                            <button onClick={() => setShowIssueModal(false)} className="w-full bg-[#1C81F2] text-white py-3 rounded-xl font-bold">Cerrar</button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* TreePoints Statistical Drill-down Modals */}
        {activeTpModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveTpModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    
                    {activeTpModal === 'issuance' && (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Tendencia de Emisión</h3><p className="text-sm text-gray-500">Puntos otorgados vs. Objetivo</p></div>
                            <div className="h-64 mb-6 bg-slate-50 rounded-xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={TP_ISSUANCE_TREND}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Line type="monotone" dataKey="issued" name="Emitidos" stroke="#1C81F2" strokeWidth={2} />
                                        <Line type="monotone" dataKey="target" name="Objetivo" stroke="#94A3B8" strokeDasharray="5 5" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-blue-500 text-sm text-gray-700">
                                <strong>Insight:</strong> La emisión de puntos ha superado el objetivo en Octubre debido a la campaña de "Retención Q4".
                            </div>
                        </div>
                    )}

                    {activeTpModal === 'redemption' && (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Desglose de Canje</h3><p className="text-sm text-gray-500">Preferencias de los empleados</p></div>
                            <div className="h-64 mb-6 flex justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={TP_REDEMPTION_CATS} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value" label>
                                            {TP_REDEMPTION_CATS.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-teal-500 text-sm text-gray-700">
                                <strong>Insight:</strong> El 45% de los puntos se usan en el Marketplace, lo que valida la estrategia de beneficios externos.
                            </div>
                        </div>
                    )}

                    {activeTpModal === 'budget' && (
                        <div>
                            <div className="mb-6"><h3 className="text-xl font-bold text-[#1E293B]">Utilización del Presupuesto</h3><p className="text-sm text-gray-500">Consumo acumulado por trimestre</p></div>
                            <div className="h-64 mb-6 bg-slate-50 rounded-xl p-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={TP_BUDGET_USAGE}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="used" name="Usado" stackId="1" stroke="#8884d8" fill="#8884d8" />
                                        <Area type="monotone" dataKey="budget" name="Presupuesto Total" stackId="2" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.2} />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border-l-4 border-purple-500 text-sm text-gray-700">
                                <strong>Insight:</strong> Q4 muestra un consumo del 45% del presupuesto anual asignado, alineado con las bonificaciones de fin de año.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeConfigModal && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 relative">
                    <button onClick={() => setActiveConfigModal(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={24} /></button>
                    {activeConfigModal === 'mapping' ? (
                        <div>
                            <h3 className="text-xl font-bold text-[#1E293B] mb-4">Mapeo de Departamentos (Data Bridge)</h3>
                            <table className="w-full text-sm text-left mb-6">
                                <thead className="bg-gray-50 uppercase text-xs font-bold text-gray-500"><tr><th className="p-3">Código HRIS</th><th className="p-3">Nombre HRIS</th><th className="p-3">Mapeo Treevü</th><th className="p-3">Estado</th></tr></thead>
                                <tbody className="divide-y">
                                    {MOCK_DEPT_MAPPING.map((m,i) => (
                                        <tr key={i}>
                                            <td className="p-3 font-mono text-xs">{m.hrisCode}</td>
                                            <td className="p-3">{m.hrisName}</td>
                                            <td className="p-3 font-bold">{m.treevuMapping}</td>
                                            <td className="p-3"><span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${m.status === 'ok' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>{m.status}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="flex justify-end space-x-3"><button className="px-4 py-2 border rounded-lg font-bold text-gray-500">Descargar Reporte</button><button className="px-4 py-2 bg-[#1C81F2] text-white rounded-lg font-bold">Sincronizar Manualmente</button></div>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-xl font-bold text-[#1E293B] mb-6">Configuración de Reglas EWA</h3>
                            <div className="grid grid-cols-2 gap-6 mb-6">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-gray-400 uppercase border-b pb-2">Cálculo Devengado</h4>
                                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Base de Cálculo</label><select className="w-full border rounded-lg p-2 text-sm"><option>Salario Neto (Recomendado)</option><option>Salario Bruto</option></select></div>
                                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Estimación Deducciones</label><input type="text" value="22.5%" className="w-full border rounded-lg p-2 text-sm" readOnly /></div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-sm text-gray-400 uppercase border-b pb-2">Límites y Enrutamiento</h4>
                                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Límite Máximo EWA</label><select className="w-full border rounded-lg p-2 text-sm"><option>50% del Neto</option><option>30% del Neto</option></select></div>
                                    <div><label className="block text-xs font-bold text-gray-700 mb-1">Canal de Solicitudes</label><select className="w-full border rounded-lg p-2 text-sm"><option>API (Real-time)</option><option>SFTP (Batch Diario)</option></select></div>
                                </div>
                            </div>
                            <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-100 text-xs text-yellow-800 mb-6"><strong>Nota:</strong> Los cambios en el límite máximo afectarán la disponibilidad de todos los colaboradores en el siguiente ciclo de cálculo.</div>
                            <button className="w-full bg-[#1E293B] text-white py-3 rounded-xl font-bold">Guardar Cambios</button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Onboarding Modal logic retained... */}
        {showOnboarding && (
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
                    <div className="bg-[#1E293B] p-8 text-center text-white">
                        <Server size={48} className="mx-auto mb-4 text-blue-400" />
                        <h2 className="text-3xl font-bold mb-2 font-['Space_Grotesk']">Bienvenido al Centro de Control</h2>
                        <p className="text-blue-200">Gestión de Liquidez y Riesgo Operativo</p>
                    </div>
                    <div className="p-8">
                        <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                            Han dado el primer paso para transformar la nómina en una herramienta estratégica. Treevü es su <strong>Plataforma de Inteligencia Interna</strong>.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <ShieldCheck className="text-green-600 mb-2" size={24} />
                                <h4 className="font-bold text-sm text-[#1E293B] mb-1">Cero Riesgo Custodia</h4>
                                <p className="text-xs text-gray-500">Tesorería mantiene el control total del flujo de caja.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <Settings className="text-blue-600 mb-2" size={24} />
                                <h4 className="font-bold text-sm text-[#1E293B] mb-1">Automatización</h4>
                                <p className="text-xs text-gray-500">Nosotros gestionamos reglas y límites. Ustedes ejecutan.</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                <TrendingUp className="text-purple-600 mb-2" size={24} />
                                <h4 className="font-bold text-sm text-[#1E293B] mb-1">Visibilidad Total</h4>
                                <p className="text-xs text-gray-500">Correlacione estrés financiero con riesgo de rotación.</p>
                            </div>
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => { setShowOnboarding(false); setActiveTab('config'); }} className="flex-1 py-4 border-2 border-slate-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Configurar Reglas</button>
                            <button onClick={() => setShowOnboarding(false)} className="flex-1 bg-[#1C81F2] text-white py-4 rounded-xl font-bold shadow-lg hover:bg-blue-600">Ir al Dashboard Ejecutivo</button>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
