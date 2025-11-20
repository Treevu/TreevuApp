


import React, { useState, useRef } from 'react';
import { useStore } from '../contexts/Store';
import { 
  UserRole, 
  SubscriptionTier, 
  AppView,
  OfferType
} from '../types';
import { 
  BuildingOfficeIcon, 
  SparklesIcon, 
  LockClosedIcon, 
  XMarkIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
  PencilIcon,
  CameraIcon,
  PlusIcon,
  PhotoIcon,
  StarIcon,
  UserCircleIcon,
  BoltIcon,
  ArrowRightOnRectangleIcon,
  TagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ChartBarIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';
import Tooltip from '../components/Tooltip';
import { ScoreBadge, EmptyState } from '../components/UIAtoms';
import FlipCard from '../components/FlipCard';
import { StreamlinedAreaChart } from '../components/ModernCharts';
import B2CAnalytics from '../components/B2CAnalytics';
import PricingModal from '../components/PricingModal';
import ProfileMenu from '../components/ProfileMenu';
import { 
  ProfileDetailsView, 
  SecurityView, 
  GeneralSettingsView, 
  HelpView 
} from '../components/SettingsViews';
import { CameraView } from '../components/Camera';
import TreevuCard from '../components/TreevuCard'; // Imported TreevuCard
import { 
    CreateOfferModal, 
    ContributeGoalModal, 
    BudgetConfigModal, 
    RedemptionModal, 
    FileImportModal,
    SquadZone,
    LevelUpModal,
    AIChatOverlay
} from './DashboardView_Partials';

// --- Local Components ---

const TreevuLogo: React.FC<{ size?: string }> = ({ size = "text-xl" }) => (
    <span className={`font-sans font-bold tracking-tight flex items-baseline ${size}`}>
        <span className="text-emerald-500">tree</span>
        <span className="text-red-500">v</span>
        <span className="text-emerald-500">ü</span>
    </span>
);

const ToastContainer: React.FC = () => {
    const { notifications, removeNotification } = useStore();

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm pointer-events-none px-4">
            {notifications.map((n) => (
                <div 
                    key={n.id} 
                    className={`
                        pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border animate-slideUp
                        ${n.type === 'success' ? 'bg-emerald-500/90 border-emerald-400 text-white' : ''}
                        ${n.type === 'error' ? 'bg-red-500/90 border-red-400 text-white' : ''}
                        ${n.type === 'info' ? 'bg-blue-500/90 border-blue-400 text-white' : ''}
                        ${n.type === 'warning' ? 'bg-yellow-500/90 border-yellow-400 text-black' : ''}
                    `}
                    onClick={() => removeNotification(n.id)}
                >
                    {n.type === 'success' && <CheckCircleIcon className="w-5 h-5" />}
                    {n.type === 'error' && <XMarkIcon className="w-5 h-5" />}
                    {n.type === 'warning' && <ExclamationCircleIcon className="w-5 h-5" />}
                    {n.type === 'info' && <InformationCircleIcon className="w-5 h-5" />}
                    <p className="text-sm font-bold">{n.message}</p>
                </div>
            ))}
        </div>
    );
};

interface LockProps {
  isLocked: boolean;
  featureName: string;
  upgradeAction: () => void;
  children: React.ReactNode;
  themeColor?: 'blue' | 'purple' | 'accent';
}

const PremiumFeatureLock: React.FC<LockProps> = ({ isLocked, featureName, upgradeAction, children, themeColor = 'accent' }) => {
  if (!isLocked) return <>{children}</>;

  const themeClasses = {
      blue: { icon: 'text-blue-400', btn: 'bg-blue-500 text-white hover:bg-blue-400' },
      purple: { icon: 'text-purple-400', btn: 'bg-purple-500 text-white hover:bg-purple-400' },
      accent: { icon: 'text-accent', btn: 'bg-accent text-black hover:bg-yellow-300' }
  };

  const theme = themeClasses[themeColor] || themeClasses.accent;

  return (
    <div className="relative w-full h-full">
      <div className="blur-sm pointer-events-none select-none w-full h-full opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 rounded-xl p-4 text-center backdrop-blur-[1px]">
        <LockClosedIcon className={`w-8 h-8 mb-2 ${theme.icon}`} />
        <p className="text-white font-bold text-sm mb-2">{featureName}</p>
        <button onClick={(e) => { e.stopPropagation(); upgradeAction(); }} className={`${theme.btn} text-xs font-bold px-3 py-1.5 rounded-full hover:scale-105 transition-transform shadow-lg`}>
          Desbloquear
        </button>
      </div>
    </div>
  );
};

const MatrixInsightModal: React.FC<{ isOpen: boolean; onClose: () => void; dept: string }> = ({ isOpen, onClose, dept }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-surface border border-white/10 p-6 rounded-2xl max-w-md w-full relative shadow-2xl" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white"><XMarkIcon className="w-6 h-6" /></button>
                <h3 className="text-xl font-bold text-white mb-2">Análisis: {dept}</h3>
                <p className="text-gray-300 text-sm mb-4">
                    Este departamento muestra un patrón de riesgo en la matriz. La IA sugiere una revisión detallada de la compensación y carga laboral.
                </p>
                <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                    <h4 className="text-blue-400 font-bold text-xs uppercase mb-2">Recomendación IA</h4>
                    <ul className="text-sm text-gray-400 list-disc pl-4 space-y-1">
                        <li>Revisar paridad salarial en {dept}.</li>
                        <li>Programar sesión de feedback 1:1.</li>
                        <li>Activar beneficios de "Salario On-Demand".</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

const AccessPortal: React.FC<{ onSelectRole: (r: UserRole) => void }> = ({ onSelectRole }) => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fadeIn relative z-10">
            <div className="text-center mb-10">
                <div className="mb-4">
                    <TreevuLogo size="text-6xl" />
                </div>
                <p className="text-lg text-gray-400">Bienestar Financiero 360° con IA</p>
            </div>

            <h2 className="text-white font-bold text-xl mb-6">Selecciona tu rol en treevü</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <button onClick={() => onSelectRole(UserRole.EMPLOYEE)} className="group relative bg-surface/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-surface hover:border-emerald-500/50 transition-all hover:-translate-y-2 shadow-xl text-left overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-emerald-500/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                           <UserCircleIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-emerald-400 mb-2 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]">Persona</h3>
                        <p className="text-gray-400 text-sm">Comprobante capturado, control asegurado.</p>
                    </div>
                </button>

                <button onClick={() => onSelectRole(UserRole.EMPLOYER)} className="group relative bg-surface/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-surface hover:border-blue-500/50 transition-all hover:-translate-y-2 shadow-xl text-left overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-blue-500/20 transition-colors"></div>
                    <div className="relative z-10">
                         <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform">
                           <BuildingOfficeIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-blue-400 mb-2 drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]">Empresa</h3>
                        <p className="text-gray-400 text-sm">La inteligencia que reduce el riesgo de fuga de tu talento.</p>
                    </div>
                </button>

                <button onClick={() => onSelectRole(UserRole.MERCHANT)} className="group relative bg-surface/60 backdrop-blur-md border border-white/10 p-8 rounded-3xl hover:bg-surface hover:border-purple-500/50 transition-all hover:-translate-y-2 shadow-xl text-left overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-bl-full -mr-10 -mt-10 group-hover:bg-purple-500/20 transition-colors"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center mb-6 text-purple-400 group-hover:scale-110 transition-transform">
                           <StarIcon className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-purple-400 mb-2 drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]">Socio</h3>
                        <p className="text-gray-400 text-sm">De ofertas a aciertos. IA Marketing que no falla.</p>
                    </div>
                </button>
            </div>
        </div>
    );
};

// --- Dashboard Implementations ---

const EmployerDashboard: React.FC = () => {
    const { companyKPIs, user, togglePricingModal } = useStore();
    const isLocked = user.subscriptionTier === SubscriptionTier.PLUS;
    const [selectedBubble, setSelectedBubble] = useState<string | null>(null);

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-4 animate-fadeIn">
            {selectedBubble && <MatrixInsightModal isOpen={true} onClose={() => setSelectedBubble(null)} dept={selectedBubble} />}
            
            {/* HERO: Holographic ID Card */}
            <TreevuCard />

            {/* AI Insight - Blue Theme */}
            <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 border border-blue-500/30 rounded-xl p-4 flex items-start gap-4 relative overflow-hidden shadow-lg mb-6">
                <SparklesIcon className="w-6 h-6 text-cyan-400 shrink-0 mt-1 animate-pulse" />
                <div>
                    <h4 className="font-bold text-cyan-200 text-sm mb-1 flex items-center gap-2">Insight Diario IA <span className="bg-cyan-500/20 text-[10px] px-2 py-0.5 rounded text-cyan-300 border border-cyan-500/30">Morning Brief</span></h4>
                    <p className="text-sm text-cyan-100 italic leading-relaxed">"¡Hola! ¡Excelente día! 🌞 Ojo: El riesgo de fuga en Ventas está en 35%. Es clave actuar proactivamente para retener talento. 🚀 👉 Programa 1:1s estratégicos."</p>
                </div>
                <div className="absolute top-4 right-4">
                     <Tooltip content="Insights generados por IA (Gemini 2.5). Se actualizan cada 24h." position="left" />
                </div>
            </div>

            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-surface border border-blue-500/30 p-4 rounded-xl h-36 flex flex-col items-center justify-center relative hover:border-blue-400/50 transition-colors">
                     <div className="absolute top-2 right-2"><Tooltip content="Índice 0-100 compuesto por: Salud Fiscal, Balance Vida-Trabajo y Desarrollo." /></div>
                     <ScoreBadge label="FWI Global" value={companyKPIs.avgFWI} trend={companyKPIs.trend?.avgFWI} variant="success" size="md" />
                 </div>
                 <div className="bg-surface border border-blue-500/30 p-4 rounded-xl relative overflow-hidden h-36 flex flex-col items-center justify-center hover:border-blue-400/50 transition-colors">
                     <div className="absolute top-2 right-2 z-20"><Tooltip content="Probabilidad (%) de que empleados clave renuncien en 30 días." /></div>
                     <PremiumFeatureLock isLocked={isLocked} featureName="Riesgo de Fuga" themeColor="blue" upgradeAction={() => togglePricingModal(true)}>
                        <ScoreBadge label="Riesgo Fuga" value={`${companyKPIs.flightRiskScore}%`} trend={companyKPIs.trend?.flightRiskScore} variant="danger" size="md" />
                     </PremiumFeatureLock>
                 </div>
                 <div className="bg-surface border border-blue-500/30 rounded-xl h-36 flex flex-col items-center justify-center">
                     {/* Strict Color: Use Cyan/Blue for money in B2B context instead of Emerald */}
                     <FlipCard themeColor="blue" heightClass="h-full w-full" frontContent={<div className="flex flex-col items-center justify-center h-full"><div className="flex items-center gap-1"><span className="text-xs text-gray-400 uppercase font-bold">Ahorro Retención</span></div><span className="text-2xl font-bold text-cyan-400 mt-2">S/ {(companyKPIs.retentionSavings / 1000).toFixed(0)}k</span></div>} backContent="Cálculo: (Costo Reemplazo x Fugas Evitadas) - Costo Treevü." />
                 </div>
                 <div className="bg-surface border border-blue-500/30 p-4 rounded-xl h-36 flex flex-col items-center justify-center relative hover:border-blue-400/50 transition-colors">
                     <div className="absolute top-2 right-2"><Tooltip content="Fórmula: (Ahorro Retención + Aumento Productividad) / Inversión Mensual." /></div>
                     <ScoreBadge label="ROI Cult." value={`${companyKPIs.roiMultiplier}x`} variant="success" size="md" />
                 </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                 {/* Adoption & Mood */}
                 <div className="space-y-4">
                     <FlipCard 
                        themeColor="blue"
                        heightClass="h-48" 
                        frontContent={
                             <div className="h-full flex flex-col justify-between">
                                 <div className="flex justify-between items-center"><h3 className="text-sm font-bold text-gray-300 uppercase">Adopción del Equipo</h3></div>
                                 <div className="space-y-3">
                                     <div>
                                         <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Activos (Daily)</span><span className="text-blue-400">{companyKPIs.adoption?.active}%</span></div>
                                         <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="h-full bg-blue-500" style={{ width: `${companyKPIs.adoption?.active}%` }}></div></div>
                                     </div>
                                     <div>
                                         <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Esporádicos</span><span className="text-cyan-400">{companyKPIs.adoption?.sporadic}%</span></div>
                                         <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="h-full bg-cyan-500" style={{ width: `${companyKPIs.adoption?.sporadic}%` }}></div></div>
                                     </div>
                                     <div>
                                         <div className="flex justify-between text-xs text-gray-400 mb-1"><span>Inactivos</span><span className="text-gray-500">{companyKPIs.adoption?.inactive}%</span></div>
                                         <div className="w-full bg-gray-800 h-1.5 rounded-full"><div className="h-full bg-gray-500" style={{ width: `${companyKPIs.adoption?.inactive}%` }}></div></div>
                                     </div>
                                 </div>
                             </div>
                        } 
                        backContent="Métrica de Engagement: 'Activos' usan la app +3 veces/semana. 'Esporádicos' al menos 1 vez/semana." 
                     />

                     <FlipCard 
                        themeColor="blue"
                        heightClass="h-48"
                        frontContent={
                             <div className="h-full flex flex-col justify-between">
                                 <div className="flex justify-between items-center mb-2"><h3 className="text-sm font-bold text-gray-300 uppercase">Tendencia de Ánimo (7 Días)</h3><span className="text-xl">😐 {companyKPIs.teamMoodScore}/100</span></div>
                                 <StreamlinedAreaChart data={companyKPIs.history?.moodHistory || []} color="text-blue-400" gradientColor="#3B82F6" height={100} />
                             </div>
                        }
                        backContent="Evolución del sentimiento reportado en el 'Daily Pulse' al inicio de la app."
                     />
                 </div>

                 {/* FWI vs Risk Matrix - Blue Theme (Adjusted Dimensions) */}
                 <div className="bg-surface border border-blue-500/30 rounded-xl p-4 relative h-80 overflow-hidden flex flex-col hover:border-blue-400/50 transition-colors shadow-lg">
                     <PremiumFeatureLock isLocked={isLocked} featureName="Matriz de Talento" themeColor="blue" upgradeAction={() => togglePricingModal(true)}>
                         <div className="flex items-center justify-between mb-2 z-20 relative">
                             <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                 <UserGroupIcon className="w-4 h-4 text-blue-400" />
                                 Matriz: FWI vs Riesgo
                             </h3>
                             <div className="flex gap-2 text-[10px] font-bold">
                                 <span className="flex items-center gap-1 text-cyan-400"><div className="w-2 h-2 rounded-full bg-cyan-500"></div> Ideal</span>
                                 <span className="flex items-center gap-1 text-red-400"><div className="w-2 h-2 rounded-full bg-red-500"></div> Crítico</span>
                             </div>
                         </div>
                         
                         {/* Chart Area with Margins for Axes */}
                         <div className="relative flex-1 border-l border-b border-white/20 mt-2 ml-12 mb-8">
                             
                             {/* Semantic Quadrants Background */}
                             <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 pointer-events-none opacity-30">
                                <div className="bg-cyan-500/10 border-r border-b border-white/5 flex items-center justify-center"><span className="text-[10px] font-bold text-cyan-500/50 -rotate-45">BIENESTAR</span></div>
                                <div className="bg-yellow-500/10 border-b border-white/5 flex items-center justify-center"><span className="text-[10px] font-bold text-yellow-500/50 -rotate-45">MERCENARIOS</span></div>
                                <div className="bg-blue-500/10 border-r border-white/5 flex items-center justify-center"><span className="text-[10px] font-bold text-blue-500/50 -rotate-45">ESTANCADOS</span></div>
                                <div className="bg-red-500/10 flex items-center justify-center"><span className="text-[10px] font-bold text-red-500/50 -rotate-45">CRÍTICO</span></div>
                             </div>

                             {/* Grid Lines */}
                             <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                                 {[...Array(4)].map((_,i) => <div key={`v-${i}`} className="border-r border-white/5 h-full"></div>)}
                                 {[...Array(4)].map((_,i) => <div key={`h-${i}`} className="border-t border-white/5 w-full"></div>)}
                             </div>
                             
                             {/* Y Axis Labels (Within safe zone) */}
                             <div className="absolute -left-6 top-0 text-[9px] font-bold text-cyan-400">100</div>
                             <div className="absolute -left-6 top-1/2 -translate-y-1/2 text-[9px] font-bold text-gray-500">50</div>
                             <div className="absolute -left-6 bottom-0 text-[9px] font-bold text-red-400">0</div>
                             <div className="absolute -left-10 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] text-blue-300 font-bold tracking-widest whitespace-nowrap">FWI Score</div>
                             
                             {/* X Axis Labels (Within safe zone) */}
                             <div className="absolute left-0 -bottom-5 text-[9px] font-bold text-cyan-400">0</div>
                             <div className="absolute left-1/2 -bottom-5 -translate-x-1/2 text-[9px] font-bold text-gray-500">50</div>
                             <div className="absolute right-0 -bottom-5 text-[9px] font-bold text-red-400">100</div>
                             <div className="absolute left-1/2 -bottom-8 -translate-x-1/2 text-[9px] text-red-400 font-bold tracking-widest uppercase">Riesgo Fuga &rarr;</div>
                             
                             {/* Bubbles */}
                             {[
                                 { id: 'Marketing', x: 60, y: 70, r: 40, c: 'bg-white', risk: 'Medio', fwi: 70 },
                                 { id: 'Ventas', x: 80, y: 35, r: 55, c: 'bg-red-500', risk: 'Alto', fwi: 35 },
                                 { id: 'IT', x: 30, y: 85, r: 45, c: 'bg-cyan-500', risk: 'Bajo', fwi: 85 },
                                 { id: 'HR', x: 20, y: 80, r: 35, c: 'bg-blue-400', risk: 'Bajo', fwi: 80 },
                             ].map((b) => (
                                 <div 
                                     key={b.id}
                                     onClick={() => setSelectedBubble(b.id)}
                                     className={`absolute rounded-full ${b.c} hover:scale-110 transition-all cursor-pointer shadow-xl border-2 border-white/20 flex flex-col items-center justify-center group z-10 backdrop-blur-sm bg-opacity-90`}
                                     style={{ 
                                        left: `${b.x}%`, 
                                        bottom: `${b.y}%`, 
                                        width: `${Math.max(24, b.r * 0.8)}px`, // Scale down slightly for fit
                                        height: `${Math.max(24, b.r * 0.8)}px`,
                                        transform: 'translate(-50%, 50%)'
                                     }}
                                 >
                                     <span className={`text-[8px] font-bold ${b.c === 'bg-white' ? 'text-black' : 'text-white'} leading-tight truncate w-full text-center px-1`}>{b.id}</span>
                                 </div>
                             ))}
                         </div>
                     </PremiumFeatureLock>
                 </div>
            </div>

             {/* Simulator Teaser - Blue Theme */}
             <div className="bg-surface border border-blue-500/30 rounded-xl p-6 flex justify-between items-center hover:border-blue-400/50 transition-colors">
                 <div>
                     <h3 className="text-lg font-bold text-white">Simulador de Impacto</h3>
                     <p className="text-sm text-gray-400">¿Qué pasa si doy un bono de S/ 500?</p>
                 </div>
                 <button className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-400 shadow-lg shadow-blue-500/30">Simular Bono</button>
                 <Tooltip content="Proyección basada en ML sobre cómo una inversión afecta el FWI." />
             </div>
        </div>
    );
};

const EmployeeWallet: React.FC = () => {
    const { 
        expenses, 
        user, 
        togglePricingModal, 
        addExpense, 
        levelUp,
        setLevelUp,
        savingsGoals,
        offers,
        redeemOffer
    } = useStore();
    
    const [showCamera, setShowCamera] = useState(false);
    const [showFabMenu, setShowFabMenu] = useState(false);
    const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [fileUploadTrigger, setFileUploadTrigger] = useState(0);
    
    // File upload ref
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleScanComplete = (result: any) => {
        setShowCamera(false);
        if (result) {
             addExpense({
                 merchant: result.merchant,
                 amount: parseFloat(result.total),
                 date: result.date,
                 category: result.category,
                 isFormal: result.isFormal,
                 ruc: result.ruc
             });
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
             // Simulate OCR delay and success
             setTimeout(() => {
                addExpense({
                    merchant: "Uploaded Receipt",
                    amount: 45.00,
                    isFormal: true,
                    date: new Date().toISOString()
                });
                setShowFabMenu(false);
             }, 1500);
        }
    };

    return (
        <div className="p-4 max-w-4xl mx-auto pb-24 animate-fadeIn">
            {showCamera && <CameraView onCapture={handleScanComplete} onClose={() => setShowCamera(false)} />}
            {levelUp && <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />}
            {contributeGoalId && <ContributeGoalModal goalId={contributeGoalId} onClose={() => setContributeGoalId(null)} />}
            {showBudgetModal && <BudgetConfigModal onClose={() => setShowBudgetModal(false)} />}
            
            {/* Hidden File Input */}
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileUpload} />

            {/* HERO: Holographic ID Card (Now with Budget) */}
            <div className="relative cursor-pointer" onClick={() => setShowBudgetModal(true)}>
                <TreevuCard />
                {/* Tooltip hinting interaction */}
                <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                   <Tooltip content="Toca para editar presupuesto" />
                </div>
            </div>

            {/* Analytics Grid */}
            <B2CAnalytics 
                expenses={expenses} 
                budget={user.monthlyBudget} 
                subscriptionTier={user.subscriptionTier} 
                onUpgrade={() => togglePricingModal(true)} 
            />

            {/* Savings Goals Teaser */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-lg">Mis Metas</h3>
                    <button className="text-emerald-400 text-xs font-bold">+ Nueva</button>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {savingsGoals.map(goal => (
                        <div key={goal.id} className="min-w-[200px] bg-surface border border-white/10 rounded-xl p-4 relative overflow-hidden group cursor-pointer hover:border-emerald-500/50 transition-colors" onClick={() => setContributeGoalId(goal.id)}>
                             <div className={`absolute top-0 right-0 w-16 h-16 ${goal.color} opacity-10 rounded-bl-full`}></div>
                             <div className="relative z-10">
                                 <p className="font-bold text-white">{goal.title}</p>
                                 <p className="text-xs text-gray-400 mb-3">Faltan S/ {goal.targetAmount - goal.currentAmount}</p>
                                 <div className="w-full bg-gray-700 h-1.5 rounded-full overflow-hidden">
                                     <div className={`h-full ${goal.color.replace('bg-', 'bg-')}`} style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}></div>
                                 </div>
                                 <div className="mt-3 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                     <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white hover:bg-white/20">Aportar +</span>
                                 </div>
                             </div>
                             <div className="absolute top-2 right-2"><Tooltip content="Ahorra formalizando gastos para completar esta meta." /></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* MARKETPLACE & BENEFITS SECTION */}
            <div className="mt-8">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        <ShoppingBagIcon className="w-5 h-5 text-emerald-400" /> Marketplace & Beneficios
                    </h3>
                    <span className="text-xs text-gray-400">Ver todo</span>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    {offers.map((offer) => (
                        <div 
                            key={offer.id} 
                            className={`min-w-[240px] bg-surface border rounded-xl p-4 flex flex-col justify-between relative group transition-all duration-300
                            ${offer.isCashback 
                                ? 'border-yellow-400/60 shadow-[0_0_20px_rgba(250,204,21,0.15)]' 
                                : 'border-white/10 hover:border-emerald-500/50'
                            }`}
                        >
                            {offer.isCashback && (
                                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-amber-500 text-black text-[9px] font-extrabold px-3 py-1 rounded-full shadow-lg z-20 flex items-center gap-1 whitespace-nowrap">
                                    <SparklesIcon className="w-3 h-3 animate-pulse" /> CASHBACK
                                </span>
                            )}
                            {offer.type === OfferType.COMPANY && (
                                <span className="absolute top-2 right-2 bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-10">Exclusivo Empresa</span>
                            )}
                            {offer.isFlash && (
                                <span className="absolute top-2 left-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-lg z-10 animate-pulse">FLASH ⚡</span>
                            )}
                            
                            <div className="flex items-start gap-3 mb-3">
                                <img src={offer.image} className="w-12 h-12 rounded-lg object-cover bg-gray-800" />
                                <div>
                                    <h4 className="font-bold text-white text-sm leading-tight">{offer.title}</h4>
                                    <p className="text-xs text-gray-400">{offer.merchantName}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center gap-1">
                                    <span className="text-lg">🌳</span>
                                    <span className="font-bold text-emerald-400">{offer.costTreevus}</span>
                                </div>
                                <button 
                                    onClick={() => redeemOffer(offer.id)}
                                    className="px-3 py-1.5 bg-white/10 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors"
                                >
                                    Canjear
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Transactions List */}
            <div className="mt-8">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    Movimientos Recientes <Tooltip content="Tus últimos registros." />
                </h3>
                <div className="space-y-3">
                    {expenses.slice(0, 5).map((expense) => (
                        <div key={expense.id} className="bg-surface border border-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${expense.isFormal ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                    {expense.isFormal ? <CheckCircleIcon className="w-5 h-5" /> : <InformationCircleIcon className="w-5 h-5" />}
                                </div>
                                <div>
                                    <p className="text-white font-medium text-sm">{expense.merchant}</p>
                                    <p className="text-xs text-gray-400">{expense.category} • {new Date(expense.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-white font-bold">- S/ {expense.amount.toFixed(2)}</p>
                                {expense.treevusEarned > 0 && (
                                    <p className="text-[10px] text-emerald-400 font-bold">+{expense.treevusEarned} pts</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Squad Zone */}
            <SquadZone />

            {/* FAB Speed Dial */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
                {/* Speed Dial Options */}
                {showFabMenu && (
                    <div className="flex flex-col gap-3 mb-2 animate-slideUp">
                        <button onClick={() => { setShowCamera(true); setShowFabMenu(false); }} className="flex items-center gap-3 px-4 py-2 bg-surface border border-white/10 rounded-full shadow-xl hover:bg-white/10 transition-colors">
                             <span className="text-white text-xs font-bold">Cámara</span>
                             <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-black">
                                 <CameraIcon className="w-5 h-5" />
                             </div>
                        </button>
                        <button className="flex items-center gap-3 px-4 py-2 bg-surface border border-white/10 rounded-full shadow-xl hover:bg-white/10 transition-colors">
                             <span className="text-white text-xs font-bold">Manual</span>
                             <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-black">
                                 <PencilIcon className="w-5 h-5" />
                             </div>
                        </button>
                        <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-3 px-4 py-2 bg-surface border border-white/10 rounded-full shadow-xl hover:bg-white/10 transition-colors">
                             <span className="text-white text-xs font-bold">Subir</span>
                             <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white">
                                 <PhotoIcon className="w-5 h-5" />
                             </div>
                        </button>
                    </div>
                )}
                
                {/* Main Trigger Button */}
                <button 
                    onClick={() => setShowFabMenu(!showFabMenu)}
                    className={`w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.6)] transition-transform duration-300 ${showFabMenu ? 'rotate-45' : ''}`}
                >
                    <PlusIcon className="w-8 h-8 text-black" />
                </button>
            </div>
        </div>
    );
};

const MerchantDashboard: React.FC = () => {
    const { hourlyTraffic, sectorHourlyTraffic, offers, user, togglePricingModal } = useStore();
    const isLocked = user.subscriptionTier === SubscriptionTier.FREE;
    const [showCreateOffer, setShowCreateOffer] = useState(false);
    
    // Calculate totals
    const totalRevenue = offers.reduce((sum, o) => sum + (o.revenueGenerated || 0), 0);
    const totalRedemptions = offers.reduce((sum, o) => sum + o.redemptions, 0);

    return (
        <div className="p-4 max-w-7xl mx-auto space-y-4 animate-fadeIn">
             {showCreateOffer && <CreateOfferModal onClose={() => setShowCreateOffer(false)} />}

             {/* HERO: Holographic ID Card */}
             <TreevuCard />

             {/* Header with Actions */}
             <div className="flex justify-end items-center mb-4">
                <button onClick={() => setShowCreateOffer(true)} className="px-4 py-2 bg-purple-500 text-white font-bold rounded-lg hover:bg-purple-400 shadow-lg shadow-purple-500/30 text-sm flex items-center gap-2">
                    <PlusIcon className="w-4 h-4" /> Crear Oferta
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div className="bg-surface border border-purple-500/30 p-4 rounded-xl hover:border-purple-500/50 transition-colors relative">
                     <div className="absolute top-2 right-2"><Tooltip content="Ventas totales generadas a través de ofertas Treevü." /></div>
                     <ScoreBadge label="Ingresos" value={`S/ ${totalRevenue}`} trend={12.5} variant="success" />
                 </div>
                 <div className="bg-surface border border-purple-500/30 p-4 rounded-xl hover:border-purple-500/50 transition-colors relative">
                     <div className="absolute top-2 right-2"><Tooltip content="Cantidad de cupones canjeados en tienda." /></div>
                     <ScoreBadge label="Redenciones" value={totalRedemptions} trend={5.2} variant="neutral" />
                 </div>
                 <div className="bg-surface border border-purple-500/30 p-4 rounded-xl hover:border-purple-500/50 transition-colors relative overflow-hidden">
                     <div className="absolute top-2 right-2 z-20"><Tooltip content="Gasto promedio por cliente captado." /></div>
                     <PremiumFeatureLock isLocked={isLocked} featureName="Ticket Promedio" themeColor="purple" upgradeAction={() => togglePricingModal(true)}>
                        <ScoreBadge label="Ticket Prom." value="S/ 42.50" trend={-2.1} variant="warning" />
                        <p className="text-[10px] text-gray-500 mt-1">vs S/ 38.00 Sector</p>
                     </PremiumFeatureLock>
                 </div>
                 <div className="bg-surface border border-purple-500/30 p-4 rounded-xl hover:border-purple-500/50 transition-colors relative overflow-hidden">
                     <div className="absolute top-2 right-2 z-20"><Tooltip content="Retorno sobre Inversión en Publicidad." /></div>
                     <PremiumFeatureLock isLocked={isLocked} featureName="ROI Marketing" themeColor="purple" upgradeAction={() => togglePricingModal(true)}>
                        <ScoreBadge label="ROAS" value="8.4x" variant="success" />
                     </PremiumFeatureLock>
                 </div>
            </div>

            {/* Traffic Analysis Chart - PURPLE THEME STRICT */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 bg-surface border border-purple-500/30 rounded-xl p-4 h-80 flex flex-col hover:border-purple-500/50 transition-colors shadow-lg relative">
                     <div className="flex justify-between items-center mb-4">
                         <h3 className="text-white font-bold text-sm uppercase flex items-center gap-2">
                             <ChartBarIcon className="w-4 h-4 text-purple-400" /> Ritmo del Negocio <Tooltip content="Comparativa de afluencia por hora: Tu Negocio vs Sector." />
                         </h3>
                         <div className="flex gap-3 text-[10px]">
                             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Tu Tráfico</span>
                             <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-gray-600"></div> Sector</span>
                         </div>
                     </div>
                     
                     {/* Bar Chart - Corrected to Purple */}
                     <div className="flex-1 flex items-end gap-2">
                         {hourlyTraffic.map((data, i) => {
                             const sectorData = sectorHourlyTraffic[i];
                             return (
                                 <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                                     <div className="w-full flex gap-0.5 items-end h-[80%] relative">
                                         {/* Sector Bar (Background) */}
                                          <div 
                                            className="w-1/2 bg-gray-700 rounded-t-sm transition-all group-hover:bg-gray-600 absolute right-0 bottom-0" 
                                            style={{ height: isLocked ? '0%' : `${sectorData.volume}%`, opacity: isLocked ? 0 : 1 }}
                                          ></div>
                                          {/* My Bar (Foreground - PURPLE) */}
                                          <div 
                                            className={`w-full bg-purple-500 rounded-t-sm transition-all group-hover:bg-purple-400 z-10 ${data.isPeak ? 'shadow-[0_0_10px_rgba(168,85,247,0.4)]' : ''}`} 
                                            style={{ height: `${data.volume}%` }}
                                          ></div>
                                     </div>
                                     <span className="text-[9px] text-gray-500 rotate-0">{data.hour}</span>
                                 </div>
                             );
                         })}
                     </div>
                     
                     {/* Premium Overlay for Sector Data */}
                     {isLocked && (
                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-500/30 pointer-events-auto flex items-center gap-2">
                                  <LockClosedIcon className="w-4 h-4 text-purple-400" />
                                  <span className="text-xs text-white font-bold">Desbloquear Benchmark Sectorial</span>
                                  <button onClick={() => togglePricingModal(true)} className="text-[10px] bg-purple-500 text-white px-2 py-1 rounded font-bold hover:bg-purple-400">Upgrade</button>
                              </div>
                         </div>
                     )}
                </div>

                {/* Funnel - PURPLE THEME STRICT */}
                <div className="bg-surface border border-purple-500/30 rounded-xl p-4 h-80 flex flex-col hover:border-purple-500/50 transition-colors relative">
                     <div className="absolute top-2 right-2"><Tooltip content="Conversión de visualizaciones a ventas reales." /></div>
                     <h3 className="text-white font-bold text-sm uppercase mb-4 flex items-center gap-2"><CursorArrowRaysIcon className="w-4 h-4 text-purple-400" /> Embudo de Conversión</h3>
                     
                     <div className="flex-1 flex flex-col justify-center gap-1 relative">
                         {/* Connecting Line Animation (Purple) */}
                         <div className="absolute top-4 bottom-4 left-1/2 w-0.5 bg-gradient-to-b from-purple-500/20 via-purple-500 to-purple-500/50 -translate-x-1/2 z-0 animate-pulse"></div>

                         {/* Step 1: Views */}
                         <div className="w-full bg-gray-800/50 p-3 rounded-lg border border-white/5 relative z-10 hover:border-purple-500/30 transition-colors group">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-xs text-gray-400 font-bold uppercase group-hover:text-white"><EyeIcon className="w-3 h-3 inline mr-1"/> Vistas</span>
                                 <span className="text-white font-bold">1,240</span>
                             </div>
                             <div className="w-full bg-gray-700 h-1 rounded-full"><div className="w-full bg-purple-500 h-full rounded-full"></div></div>
                         </div>

                         {/* Connector Metric */}
                         <div className="self-center bg-black/50 text-[10px] text-gray-400 px-2 py-0.5 rounded-full border border-white/10 z-20 my-1">
                             CTR: <span className="text-yellow-400 font-bold">12%</span>
                         </div>

                         {/* Step 2: Clicks */}
                         <div className="w-[80%] self-center bg-gray-800/50 p-3 rounded-lg border border-white/5 relative z-10 hover:border-purple-500/30 transition-colors group">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-xs text-gray-400 font-bold uppercase group-hover:text-white">Clics</span>
                                 <span className="text-white font-bold">148</span>
                             </div>
                             <div className="w-full bg-gray-700 h-1 rounded-full"><div className="w-full bg-purple-400 h-full rounded-full"></div></div>
                         </div>

                         {/* Connector Metric */}
                         <div className="self-center bg-black/50 text-[10px] text-gray-400 px-2 py-0.5 rounded-full border border-white/10 z-20 my-1">
                             Conv: <span className="text-purple-300 font-bold">35%</span>
                         </div>

                         {/* Step 3: Sales - Corrected to Purple/Fuchsia */}
                         <div className="w-[60%] self-center bg-purple-900/20 p-3 rounded-lg border border-purple-500/30 relative z-10 hover:bg-purple-900/30 transition-colors group shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                             <div className="flex justify-between items-center mb-1">
                                 <span className="text-xs text-purple-400 font-bold uppercase group-hover:text-purple-300">Canjes</span>
                                 <span className="text-white font-bold text-lg">52</span>
                             </div>
                             <div className="w-full bg-gray-700 h-1 rounded-full"><div className="w-full bg-fuchsia-500 h-full rounded-full"></div></div>
                         </div>
                     </div>
                </div>
            </div>
            
            {/* Active Offers Management */}
            <div className="mt-8">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">Mis Ofertas Activas <Tooltip content="Gestiona tus promociones vigentes." /></h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {offers.map(offer => (
                        <div key={offer.id} className="bg-surface border border-white/10 p-4 rounded-xl flex gap-4 items-center group hover:bg-white/5 transition-colors">
                            <img src={offer.image} className="w-16 h-16 rounded-lg object-cover opacity-80 group-hover:opacity-100" />
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-white">{offer.title}</h4>
                                    {offer.isFlash && <span className="text-[10px] bg-purple-500 text-white px-2 py-0.5 rounded-full animate-pulse">FLASH ⚡</span>}
                                </div>
                                <p className="text-xs text-gray-400 mb-2">{offer.description}</p>
                                <div className="flex gap-3 text-xs">
                                    <span className="text-purple-300 font-bold">{offer.redemptions} canjes</span>
                                    <span className="text-gray-500">•</span>
                                    <span className="text-gray-400">Generado: S/ {offer.revenueGenerated}</span>
                                </div>
                            </div>
                            <button className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white">
                                <PencilIcon className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    
                    {/* Add New Card Placeholder */}
                    <button onClick={() => setShowCreateOffer(true)} className="border border-dashed border-white/20 rounded-xl flex flex-col items-center justify-center p-4 text-gray-500 hover:text-purple-400 hover:border-purple-500/50 hover:bg-purple-500/5 transition-all min-h-[100px]">
                        <PlusIcon className="w-8 h-8 mb-2" />
                        <span className="text-sm font-bold">Crear Nueva Oferta</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Main Dashboard View ---

const DashboardView: React.FC = () => {
    const { role, user, switchRole, togglePricingModal, isChatOpen, toggleChat, currentView, goBack } = useStore();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    if (role === UserRole.GUEST) {
        return <AccessPortal onSelectRole={switchRole} />;
    }

    const renderContent = () => {
        if (currentView === AppView.PROFILE_DETAILS) return <ProfileDetailsView />;
        if (currentView === AppView.SECURITY) return <SecurityView />;
        if (currentView === AppView.SETTINGS) return <GeneralSettingsView />;
        if (currentView === AppView.HELP) return <HelpView />;
        
        // Default Dashboard Views
        switch (role) {
            case UserRole.EMPLOYEE: return <EmployeeWallet />;
            case UserRole.EMPLOYER: return <EmployerDashboard />;
            case UserRole.MERCHANT: return <MerchantDashboard />;
            default: return <div className="p-8 text-center text-gray-500">Role not found</div>;
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative">
            <ToastContainer />
            <PricingModal />
            {isChatOpen && <AIChatOverlay />}

            {/* Header */}
            <header className="sticky top-0 z-50 bg-base/80 backdrop-blur-xl border-b border-white/10 px-4 py-3">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {currentView !== AppView.DASHBOARD && (
                            <button onClick={goBack} className="p-2 -ml-2 text-gray-400 hover:text-white transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                            </button>
                        )}
                        <div onClick={() => switchRole(UserRole.GUEST)} className="cursor-pointer">
                            <TreevuLogo />
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {/* Treevü Points Counter Pill */}
                        <div className="hidden md:flex items-center gap-2 bg-black/20 border border-white/10 rounded-full px-3 py-1.5">
                            <span className="text-lg">🌳</span>
                            <span className="font-bold text-emerald-400 text-sm">{user.treevus.toLocaleString()}</span>
                        </div>

                        {/* AI Chat Trigger */}
                        <button 
                            onClick={() => toggleChat(!isChatOpen)}
                            className={`p-2 rounded-full transition-all duration-300 ${isChatOpen ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}
                        >
                            <SparklesIcon className="w-5 h-5" />
                        </button>

                        {/* Profile Menu Trigger */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                className="w-9 h-9 rounded-full border border-white/20 overflow-hidden hover:border-emerald-500 transition-colors"
                            >
                                <img src={user.avatarUrl} className="w-full h-full object-cover" />
                            </button>
                            <ProfileMenu 
                                user={user} 
                                isOpen={isProfileMenuOpen} 
                                onClose={() => setIsProfileMenuOpen(false)}
                                onSwitchRole={switchRole}
                                onOpenPricing={() => togglePricingModal(true)}
                                onSignOut={() => switchRole(UserRole.GUEST)}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative">
                {renderContent()}
            </main>
        </div>
    );
};

export default DashboardView;