import React, { useState, useRef, useEffect } from "react";
import { useStore } from "@/contexts/Store";
import { scanReceipt } from "@/services/geminiService";
import {
  UserRole,
  SubscriptionTier,
  AppView,
  OfferType,
  ExpenseCategory,
} from "@/types";
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
  ArrowRightStartOnRectangleIcon,
  TagIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  EyeIcon,
  CursorArrowRaysIcon,
  ChartBarIcon,
  ShoppingBagIcon,
  FlagIcon,
  ArrowLongRightIcon,
  FingerPrintIcon,
} from "@heroicons/react/24/outline";
import Tooltip from "@/components/Tooltip";
import { ScoreBadge, EmptyState } from "@/components/UIAtoms";
import FlipCard from "@/components/FlipCard";
import { StreamlinedAreaChart } from "@/components/ModernCharts";
import B2CAnalytics from "@/components/B2CAnalytics";
import PricingModal from "@/components/PricingModal";
import ProfileMenu from "@/components/ProfileMenu";
import {
  ProfileDetailsView,
  SecurityView,
  GeneralSettingsView,
  HelpView,
} from "@/components/SettingsViews";
import { CameraView } from "../components/Camera";
import TreevuCard from "../components/TreevuCard";
import {
  CreateOfferModal,
  ContributeGoalModal,
  BudgetConfigModal,
  RedemptionModal,
  FileImportModal,
  SquadZone,
  LevelUpModal,
  AIChatOverlay,
  OnboardingTour,
  ManualExpenseModal,
} from "./DashboardView_Partials";

// --- Local Components ---

const TreevuLogo: React.FC<{ size?: string }> = ({ size = "text-xl" }) => (
  <span
    className={`font-sans font-bold tracking-tight flex items-baseline justify-center ${size}`}
  >
    <span className="text-emerald-500">tree</span>
    <span className="text-red-500">v</span>
    <span className="text-emerald-500">ü</span>
  </span>
);

const ToastContainer: React.FC = () => {
  const { notifications, removeNotification } = useStore();

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-[90%] max-w-sm pointer-events-none px-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`
                        pointer-events-auto flex items-center gap-3 p-4 rounded-xl shadow-2xl backdrop-blur-md border animate-slideUp
                        ${
                          n.type === "success"
                            ? "bg-emerald-500/90 border-emerald-400 text-white"
                            : ""
                        }
                        ${
                          n.type === "error"
                            ? "bg-red-500/90 border-red-400 text-white"
                            : ""
                        }
                        ${
                          n.type === "info"
                            ? "bg-blue-500/90 border-blue-400 text-white"
                            : ""
                        }
                        ${
                          n.type === "warning"
                            ? "bg-yellow-500/90 border-yellow-400 text-black"
                            : ""
                        }
                    `}
          onClick={() => removeNotification(n.id)}
        >
          {n.type === "success" && (
            <CheckCircleIcon className="w-5 h-5 shrink-0" />
          )}
          {n.type === "error" && <XMarkIcon className="w-5 h-5 shrink-0" />}
          {n.type === "warning" && (
            <ExclamationCircleIcon className="w-5 h-5 shrink-0" />
          )}
          {n.type === "info" && (
            <InformationCircleIcon className="w-5 h-5 shrink-0" />
          )}
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
  themeColor?: "blue" | "purple" | "accent";
}

const PremiumFeatureLock: React.FC<LockProps> = ({
  isLocked,
  featureName,
  upgradeAction,
  children,
  themeColor = "accent",
}) => {
  if (!isLocked) return <>{children}</>;

  const themeClasses = {
    blue: {
      icon: "text-blue-400",
      btn: "bg-blue-500 text-white hover:bg-blue-400",
    },
    purple: {
      icon: "text-purple-400",
      btn: "bg-purple-500 text-white hover:bg-purple-400",
    },
    accent: {
      icon: "text-yellow-500 dark:text-accent",
      btn: "bg-yellow-400 dark:bg-accent text-black hover:bg-yellow-300",
    },
  };

  const theme = themeClasses[themeColor] || themeClasses.accent;

  return (
    <div className="relative w-full h-full">
      <div className="blur-sm pointer-events-none select-none w-full h-full opacity-50">
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 rounded-xl p-4 text-center backdrop-blur-[1px]">
        <LockClosedIcon className={`w-8 h-8 mb-2 ${theme.icon}`} />
        <p className="text-gray-900 dark:text-white font-bold text-sm mb-2">
          {featureName}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            upgradeAction();
          }}
          className={`${theme.btn} text-xs font-bold px-3 py-1.5 rounded-full hover:scale-105 transition-transform shadow-lg`}
        >
          Desbloquear
        </button>
      </div>
    </div>
  );
};

const MatrixInsightModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  dept: string;
}> = ({ isOpen, onClose, dept }) => {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-white/10 p-6 rounded-2xl max-w-md w-[95%] relative shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Análisis: {dept}
        </h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">
          Este departamento muestra un patrón de riesgo en la matriz. La IA
          sugiere una revisión detallada de la compensación y carga laboral.
        </p>
        <div className="bg-gray-100 dark:bg-white/5 p-4 rounded-xl border border-gray-200 dark:border-white/5">
          <h4 className="text-blue-500 dark:text-blue-400 font-bold text-xs uppercase mb-2">
            Recomendación IA
          </h4>
          <ul className="text-sm text-gray-700 dark:text-gray-400 list-disc pl-4 space-y-1">
            <li>Revisar paridad salarial en {dept}.</li>
            <li>Programar sesión de feedback 1:1.</li>
            <li>Activar beneficios de "Salario On-Demand".</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// --- MODERN ROLE CARD ---
const RoleCard: React.FC<{
  role: UserRole;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  theme: "emerald" | "blue" | "purple";
  onClick: () => void;
  delay: string;
}> = ({
  role,
  icon: Icon,
  title,
  subtitle,
  description,
  theme,
  onClick,
  delay,
}) => {
  const themeStyles = {
    emerald: {
      bg: "group-hover:bg-emerald-900/20",
      border: "group-hover:border-emerald-500/50",
      iconBg: "bg-emerald-500/10 text-emerald-400",
      glow: "shadow-[0_0_50px_-12px_rgba(52,211,153,0.3)]",
      text: "text-emerald-400",
      btn: "bg-emerald-500 text-black hover:bg-emerald-400",
    },
    blue: {
      bg: "group-hover:bg-blue-900/20",
      border: "group-hover:border-blue-500/50",
      iconBg: "bg-blue-500/10 text-blue-400",
      glow: "shadow-[0_0_50px_-12px_rgba(96,165,250,0.3)]",
      text: "text-blue-400",
      btn: "bg-blue-500 text-white hover:bg-blue-400",
    },
    purple: {
      bg: "group-hover:bg-purple-900/20",
      border: "group-hover:border-purple-500/50",
      iconBg: "bg-purple-500/10 text-purple-400",
      glow: "shadow-[0_0_50px_-12px_rgba(192,132,252,0.3)]",
      text: "text-purple-400",
      btn: "bg-purple-500 text-white hover:bg-purple-400",
    },
  };

  const s = themeStyles[theme];

  return (
    <div
      onClick={onClick}
      className={`group relative h-[380px] md:h-[450px] w-full rounded-[2rem] border border-white/10 bg-surface/40 backdrop-blur-sm cursor-pointer transition-all duration-500 hover:-translate-y-2 overflow-hidden ${s.border} animate-fadeIn`}
      style={{ animationDelay: delay }}
    >
      {/* Hover Background Glow */}
      <div
        className={`absolute inset-0 opacity-0 ${s.bg} transition-opacity duration-500`}
      ></div>

      {/* Top Highlight Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50"></div>

      <div className="relative z-10 h-full flex flex-col p-6 md:p-8">
        {/* Icon Container */}
        <div
          className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl ${s.iconBg} border border-white/5 flex items-center justify-center mb-6 md:mb-8 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 ${s.glow}`}
        >
          <Icon className="w-8 h-8 md:w-10 md:h-10" />
        </div>

        {/* Titles */}
        <div className="mb-auto">
          <p
            className={`text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase mb-2 ${s.text} opacity-80`}
          >
            {subtitle}
          </p>
          <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-3 md:mb-4 tracking-tight">
            {title}
          </h3>
          <p className="text-xs md:text-sm text-gray-400 leading-relaxed border-l-2 border-white/10 pl-4 group-hover:border-white/30 transition-colors">
            {description}
          </p>
        </div>

        {/* Bottom Action */}
        <div className="mt-4 md:mt-8 flex items-center justify-between pt-4 md:pt-6 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-widest">
              Acceso
            </span>
            <span className="text-white text-[10px] md:text-xs font-bold flex items-center gap-1">
              <FingerPrintIcon className="w-3 h-3" /> Biometric Ready
            </span>
          </div>
          <button
            className={`h-10 w-10 md:h-12 md:w-12 rounded-full ${s.btn} flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-0 rotate-[-45deg]`}
          >
            <ArrowLongRightIcon className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>
      </div>

      {/* Decorative Noise */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none"></div>
    </div>
  );
};

const AccessPortal: React.FC<{ onSelectRole: (r: UserRole) => void }> = ({
  onSelectRole,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#0F0F11]">
      {/* Modern Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Ambient Spotlights */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div
        className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16 animate-slideUp relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="mb-4 md:mb-6 inline-block">
          <div className="bg-white/5 border border-white/10 rounded-full px-4 md:px-6 py-1.5 md:py-2 backdrop-blur-md">
            <p className="text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-gray-300 uppercase">
              Ecosistema Financiero v2.5
            </p>
          </div>
        </div>

        <div className="mb-2 md:mb-4 transform hover:scale-105 transition-transform duration-500 flex justify-center">
          <TreevuLogo size="text-6xl md:text-9xl" />
        </div>

        <h2 className="text-lg md:text-3xl font-medium text-gray-400 tracking-tight max-w-2xl mx-auto leading-relaxed px-4 text-center">
          Donde el{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-bold">
            Bienestar
          </span>{" "}
          se encuentra con la{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 font-bold">
            Data
          </span>
          .
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl px-2 md:px-4 relative z-20">
        <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <RoleCard
            role={UserRole.EMPLOYEE}
            icon={UserCircleIcon}
            title="Persona"
            subtitle="B2C / Personal"
            description="Comprobante capturado, control asegurado. Tu billetera inteligente potenciada por gamificación."
            theme="emerald"
            onClick={() => onSelectRole(UserRole.EMPLOYEE)}
            delay="0.1s"
          />
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <RoleCard
            role={UserRole.EMPLOYER}
            icon={BuildingOfficeIcon}
            title="Empresa"
            subtitle="B2B / Corporate"
            description="La inteligencia que reduce el riesgo de fuga. Analítica predictiva para retener a tu mejor talento."
            theme="blue"
            onClick={() => onSelectRole(UserRole.EMPLOYER)}
            delay="0.2s"
          />
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <RoleCard
            role={UserRole.MERCHANT}
            icon={StarIcon}
            title="Socio"
            subtitle="B2B2C / Partner"
            description="De ofertas a aciertos. IA Marketing que convierte visitas anónimas en ventas reales."
            theme="purple"
            onClick={() => onSelectRole(UserRole.MERCHANT)}
            delay="0.3s"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 md:mt-16 flex flex-col items-center gap-2 opacity-40 hover:opacity-80 transition-opacity">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-white tracking-widest">
            SYSTEM OPERATIONAL
          </span>
        </div>
        <p className="text-[10px] text-gray-500 font-mono">
          POWERED BY GEMINI 2.5 FLASH • SECURE ENCLAVE
        </p>
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
    <div className="p-4 max-w-7xl mx-auto space-y-4 animate-fadeIn pb-20">
      {selectedBubble && (
        <MatrixInsightModal
          isOpen={true}
          onClose={() => setSelectedBubble(null)}
          dept={selectedBubble}
        />
      )}

      {/* HERO: Holographic ID Card */}
      <TreevuCard />

      {/* AI Insight - Blue Theme */}
      <div className="bg-gradient-to-r from-blue-100/50 to-cyan-100/50 dark:from-blue-900/50 dark:to-cyan-900/50 border border-blue-200 dark:border-blue-500/30 rounded-xl p-4 flex flex-col md:flex-row items-start gap-4 relative overflow-hidden shadow-lg mb-6">
        <SparklesIcon className="w-6 h-6 text-blue-500 dark:text-cyan-400 shrink-0 mt-1 animate-pulse" />
        <div className="flex-1">
          <h4 className="font-bold text-blue-800 dark:text-cyan-200 text-sm mb-1 flex items-center gap-2">
            Insight Diario IA{" "}
            <span className="bg-cyan-500/20 text-[10px] px-2 py-0.5 rounded text-blue-700 dark:text-cyan-300 border border-cyan-500/30">
              Morning Brief
            </span>
          </h4>
          <p className="text-sm text-blue-700 dark:text-cyan-100 italic leading-relaxed">
            "¡Hola! ¡Excelente día! 🌞 Ojo: El riesgo de fuga en Ventas está en
            35%. Es clave actuar proactivamente para retener talento. 🚀 👉
            Programa 1:1s estratégicos."
          </p>
        </div>
        <div className="absolute top-4 right-4">
          <Tooltip
            content="Insights generados por IA (Gemini 2.5). Se actualizan cada 24h."
            position="left"
          />
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-surface border border-blue-200 dark:border-blue-500/30 p-4 rounded-xl h-36 flex flex-col items-center justify-center relative hover:border-blue-400/50 transition-colors">
          <div className="absolute top-2 right-2">
            <Tooltip content="Índice 0-100 compuesto por: Salud Fiscal, Balance Vida-Trabajo y Desarrollo." />
          </div>
          <ScoreBadge
            label="FWI Global"
            value={companyKPIs.avgFWI}
            trend={companyKPIs.trend?.avgFWI}
            variant="success"
            size="md"
          />
        </div>
        <div className="bg-surface border border-blue-200 dark:border-blue-500/30 p-4 rounded-xl relative h-36 flex flex-col items-center justify-center hover:border-blue-400/50 transition-colors">
          <div className="absolute top-2 right-2 z-30">
            <Tooltip content="Probabilidad (%) de que empleados clave renuncien en 30 días." />
          </div>
          <PremiumFeatureLock
            isLocked={isLocked}
            featureName="Riesgo de Fuga"
            themeColor="blue"
            upgradeAction={() => togglePricingModal(true)}
          >
            <ScoreBadge
              label="Riesgo Fuga"
              value={`${companyKPIs.flightRiskScore}%`}
              trend={companyKPIs.trend?.flightRiskScore}
              variant="danger"
              size="md"
            />
          </PremiumFeatureLock>
        </div>
        <div className="bg-surface border border-blue-200 dark:border-blue-500/30 rounded-xl h-36 flex flex-col items-center justify-center">
          {/* Strict Color: Use Cyan/Blue for money in B2B context instead of Emerald */}
          <FlipCard
            themeColor="blue"
            heightClass="h-full w-full"
            frontContent={
              <div className="flex flex-col items-center justify-center h-full">
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold">
                    Ahorro Retención
                  </span>
                </div>
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400 mt-2">
                  S/ {(companyKPIs.retentionSavings / 1000).toFixed(0)}k
                </span>
              </div>
            }
            backContent="Cálculo: (Costo Reemplazo x Fugas Evitadas) - Costo Treevü."
          />
        </div>
        <div className="bg-surface border border-blue-200 dark:border-blue-500/30 p-4 rounded-xl h-36 flex flex-col items-center justify-center relative hover:border-blue-400/50 transition-colors">
          <div className="absolute top-2 right-2">
            <Tooltip content="Fórmula: (Ahorro Retención + Aumento Productividad) / Inversión Mensual." />
          </div>
          <ScoreBadge
            label="ROI Cult."
            value={`${companyKPIs.roiMultiplier}x`}
            variant="success"
            size="md"
          />
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
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase">
                    Adopción del Equipo
                  </h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Activos (Daily)</span>
                      <span className="text-blue-600 dark:text-blue-400">
                        {companyKPIs.adoption?.active}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${companyKPIs.adoption?.active}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Esporádicos</span>
                      <span className="text-cyan-600 dark:text-cyan-400">
                        {companyKPIs.adoption?.sporadic}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full">
                      <div
                        className="h-full bg-cyan-500"
                        style={{ width: `${companyKPIs.adoption?.sporadic}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Inactivos</span>
                      <span className="text-gray-500">
                        {companyKPIs.adoption?.inactive}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full">
                      <div
                        className="h-full bg-gray-400 dark:bg-gray-500"
                        style={{ width: `${companyKPIs.adoption?.inactive}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            }
            backContent="Clasifica a los empleados según su frecuencia de interacción con la plataforma: Daily (>3 veces/sem), Esporádicos (1 vez/sem), Inactivos (<1 vez/mes)."
          />

          <FlipCard
            themeColor="blue"
            heightClass="h-48"
            frontContent={
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase">
                    Tendencia de Ánimo (7 días)
                  </h3>
                  <span className="text-lg font-bold text-yellow-500">
                    😐 {companyKPIs.teamMoodScore}/100
                  </span>
                </div>
                <div className="flex-1 pt-4">
                  <StreamlinedAreaChart
                    data={companyKPIs.history?.moodHistory || []}
                    color="text-blue-400"
                    gradientColor="#60A5FA"
                    height={80}
                  />
                </div>
              </div>
            }
            backContent="Media móvil del 'Pulse Check' diario reportado por los colaboradores. Detecta bajones de moral antes de que se conviertan en renuncias."
          />
        </div>

        {/* Matrix */}
        <div className="bg-surface border border-blue-200 dark:border-blue-500/30 p-4 rounded-xl h-80 lg:h-[400px] relative group">
          <div className="absolute top-4 right-4 z-30">
            <Tooltip content="Matriz de Correlación: Eje Y = Bienestar (FWI), Eje X = Riesgo de Fuga." />
          </div>
          <PremiumFeatureLock
            isLocked={isLocked}
            featureName="Matriz de Retención"
            themeColor="blue"
            upgradeAction={() => togglePricingModal(true)}
          >
            <h3 className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase mb-2 relative z-10">
              Matriz: FWI vs Riesgo
            </h3>
            <div className="relative w-full h-full pb-8 ml-12 mb-8">
              {/* Zones Background */}
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 opacity-20">
                <div className="bg-emerald-500/20 rounded-tl-lg border-r border-b border-white/10 flex items-start justify-start p-2">
                  <span className="text-[10px] font-bold text-emerald-300">
                    Zona Ideal
                  </span>
                </div>
                <div className="bg-yellow-500/20 rounded-tr-lg border-b border-white/10 flex items-start justify-end p-2">
                  <span className="text-[10px] font-bold text-yellow-300">
                    Riesgo Latente
                  </span>
                </div>
                <div className="bg-blue-500/20 rounded-bl-lg border-r border-white/10 flex items-end justify-start p-2">
                  <span className="text-[10px] font-bold text-blue-300">
                    Estancamiento
                  </span>
                </div>
                <div className="bg-red-500/20 rounded-br-lg flex items-end justify-end p-2">
                  <span className="text-[10px] font-bold text-red-300">
                    Zona Crítica
                  </span>
                </div>
              </div>

              {/* Grid Lines */}
              <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 pointer-events-none">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`v-${i}`}
                    className="border-r border-white/5 h-full"
                  ></div>
                ))}
                {[...Array(4)].map((_, i) => (
                  <div
                    key={`h-${i}`}
                    className="border-b border-white/5 w-full col-span-4"
                  ></div>
                ))}
              </div>

              {/* Axes Labels */}
              <span className="absolute bottom-0 right-0 text-[10px] text-gray-400 font-bold">
                Riesgo Fuga →
              </span>
              <span className="absolute top-0 -left-10 text-[10px] text-gray-400 font-bold -rotate-90 origin-right">
                FWI Score
              </span>

              <span className="absolute bottom-0 left-0 text-[9px] text-gray-500">
                0
              </span>
              <span className="absolute bottom-0 left-1/2 text-[9px] text-gray-500">
                50
              </span>
              <span className="absolute bottom-0 right-2 text-[9px] text-gray-500">
                100
              </span>

              <span className="absolute bottom-0 -left-4 text-[9px] text-gray-500">
                0
              </span>
              <span className="absolute top-1/2 -left-5 text-[9px] text-gray-500">
                50
              </span>
              <span className="absolute top-0 -left-6 text-[9px] text-gray-500">
                100
              </span>

              {/* Bubbles */}
              <div
                className="absolute left-[20%] bottom-[70%] w-10 h-10 bg-emerald-500/80 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30 cursor-pointer hover:scale-125 transition-transform z-20 border border-white/20 group/bubble"
                onClick={() => setSelectedBubble("Tecnología")}
              >
                <span className="text-[8px] font-bold text-white">IT</span>
                <div className="absolute -top-8 opacity-0 group-hover/bubble:opacity-100 bg-black/80 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none">
                  Ver Análisis IT
                </div>
              </div>
              <div
                className="absolute left-[15%] bottom-[65%] w-8 h-8 bg-emerald-600/80 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-125 transition-transform z-20 border border-white/20 group/bubble"
                onClick={() => setSelectedBubble("RRHH")}
              >
                <span className="text-[8px] font-bold text-white">HR</span>
                <div className="absolute -top-8 opacity-0 group-hover/bubble:opacity-100 bg-black/80 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none">
                  Ver Análisis HR
                </div>
              </div>
              <div
                className="absolute left-[45%] bottom-[50%] w-12 h-12 bg-yellow-500/80 rounded-full flex items-center justify-center shadow-lg shadow-yellow-500/30 cursor-pointer hover:scale-125 transition-transform z-20 border border-white/20 group/bubble"
                onClick={() => setSelectedBubble("Marketing")}
              >
                <span className="text-[8px] font-bold text-black">MKT</span>
                <div className="absolute -top-8 opacity-0 group-hover/bubble:opacity-100 bg-black/80 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none">
                  Ver Análisis MKT
                </div>
              </div>
              <div
                className="absolute left-[70%] bottom-[35%] w-14 h-14 bg-red-500/80 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 animate-pulse cursor-pointer hover:scale-125 transition-transform z-20 border border-white/20 group/bubble"
                onClick={() => setSelectedBubble("Ventas")}
              >
                <span className="text-[8px] font-bold text-white">Ventas</span>
                <div className="absolute -top-8 opacity-0 group-hover/bubble:opacity-100 bg-black/80 text-white text-[9px] px-2 py-1 rounded whitespace-nowrap transition-opacity pointer-events-none">
                  Ver Análisis Ventas
                </div>
              </div>
            </div>
          </PremiumFeatureLock>
        </div>
      </div>
    </div>
  );
};

const MerchantDashboard: React.FC = () => {
  const {
    hourlyTraffic,
    sectorHourlyTraffic,
    sectorStats,
    offers,
    user,
    togglePricingModal,
  } = useStore();
  const isLocked = user.subscriptionTier === SubscriptionTier.FREE;
  const [isCreateOfferOpen, setIsCreateOfferOpen] = useState(false);

  const totalRevenue = offers.reduce(
    (acc, o) => acc + (o.revenueGenerated || 0),
    0
  );
  const totalRedemptions = offers.reduce((acc, o) => acc + o.redemptions, 0);
  const ticketAvg = totalRevenue / (totalRedemptions || 1);
  const trafficTotal = hourlyTraffic.reduce((acc, h) => acc + h.volume, 0);

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-6 animate-fadeIn pb-20">
      {isCreateOfferOpen && (
        <CreateOfferModal onClose={() => setIsCreateOfferOpen(false)} />
      )}
      <TreevuCard />

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-surface border border-purple-500/30 p-4 rounded-xl relative group">
          <div className="absolute top-2 right-2">
            <Tooltip content="Ingresos totales generados por canjes en la app." />
          </div>
          <h3 className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
            Ingresos App
          </h3>
          <p className="text-xl md:text-2xl font-bold text-purple-500 dark:text-purple-400">
            S/ {totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-surface border border-purple-500/30 p-4 rounded-xl relative group">
          <div className="absolute top-2 right-2">
            <Tooltip content="Cantidad de ofertas canjeadas exitosamente." />
          </div>
          <h3 className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
            Redenciones
          </h3>
          <p className="text-xl md:text-2xl font-bold text-purple-500 dark:text-purple-400">
            {totalRedemptions}
          </p>
        </div>
        <div className="bg-surface border border-purple-500/30 p-4 rounded-xl relative group">
          <div className="absolute top-2 right-2 z-30">
            <Tooltip content="Gasto promedio por cliente vs Sector." />
          </div>
          <h3 className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
            Ticket Promedio
          </h3>
          <div className="flex items-baseline gap-2">
            <p className="text-xl md:text-2xl font-bold text-purple-500 dark:text-purple-400">
              S/ {ticketAvg.toFixed(2)}
            </p>
            <span
              className={`text-xs font-bold ${
                ticketAvg >= sectorStats.avgTicket
                  ? "text-emerald-400"
                  : "text-red-400"
              } blur-[0.5px] lg:blur-none`}
            >
              vs S/ {sectorStats.avgTicket}
            </span>
          </div>
          {/* Upsell overlay for sector comparison if locked */}
          <div
            className={`absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl ${
              !isLocked ? "hidden" : ""
            }`}
          >
            <span className="text-[10px] bg-yellow-400 text-black px-2 py-1 rounded font-bold">
              Plan Amplify
            </span>
          </div>
        </div>
        <div className="bg-surface border border-purple-500/30 p-4 rounded-xl relative group">
          <div className="absolute top-2 right-2">
            <Tooltip content="Retorno sobre Inversión en Marketing." />
          </div>
          <h3 className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-1">
            ROAS (Est.)
          </h3>
          <p className="text-xl md:text-2xl font-bold text-purple-500 dark:text-purple-400">
            3.5x
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Comparative Traffic Analysis */}
        <div className="bg-surface border border-purple-500/30 rounded-xl p-6 relative">
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <ChartBarIcon className="w-5 h-5 text-purple-400" /> Ritmo del
              Negocio
              <Tooltip
                content="Afluencia por hora: Tu Negocio vs Promedio del Sector."
                position="bottom"
              />
            </h3>
            <PremiumFeatureLock
              isLocked={isLocked}
              featureName="Benchmark Sector"
              themeColor="purple"
              upgradeAction={() => togglePricingModal(true)}
            >
              <div className="flex items-center gap-3 text-[10px]">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-gray-300">Tu Negocio</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                  <span className="text-gray-500">Sector</span>
                </div>
              </div>
            </PremiumFeatureLock>
          </div>

          <div className="h-48 flex items-end gap-2 relative z-0">
            {hourlyTraffic.map((data, idx) => {
              const sectorVal = sectorHourlyTraffic[idx]?.volume || 0;
              const height = (data.volume / 100) * 100;
              const sectorHeight = (sectorVal / 100) * 100;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col justify-end h-full group relative"
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/90 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                    {data.hour}: {data.volume} vs {sectorVal}
                  </div>

                  {/* Sector Bar (Background) */}
                  <div
                    className={`w-full bg-gray-700/30 rounded-t-sm absolute bottom-0 transition-all duration-500 ${
                      isLocked ? "blur-sm opacity-50" : ""
                    }`}
                    style={{ height: `${sectorHeight}%` }}
                  />

                  {/* Merchant Bar (Foreground) - PURPLE THEME */}
                  <div
                    className={`w-full bg-purple-500 dark:bg-purple-600 rounded-t-sm relative z-10 transition-all duration-500 hover:bg-purple-400 ${
                      data.isPeak
                        ? "shadow-[0_0_10px_rgba(192,132,252,0.5)]"
                        : ""
                    }`}
                    style={{ height: `${height}%` }}
                  />

                  <span className="text-[9px] text-gray-500 mt-2 text-center hidden md:block">
                    {data.hour}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enhanced Conversion Funnel - PURPLE THEME */}
        <FlipCard
          themeColor="purple"
          heightClass="h-80"
          frontContent={
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-purple-400" />{" "}
                  Embudo de Conversión
                  <Tooltip
                    content="Customer Journey: Desde que ven tu oferta hasta que compran."
                    position="bottom"
                  />
                </h3>
              </div>
              <div className="flex-1 flex flex-col justify-center gap-1 px-4">
                {/* Step 1: Impressions */}
                <div className="w-full bg-gray-800/50 rounded-lg p-3 flex justify-between items-center border border-white/5 group hover:border-purple-500/30 transition-colors relative">
                  <div className="flex items-center gap-3">
                    <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase">
                      Vistas de Oferta
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-white">
                    12,450
                  </span>
                  {/* Connector Line */}
                  <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gray-700 z-0 group-hover:bg-purple-500/50 transition-colors"></div>
                </div>

                {/* Conversion Rate Pill */}
                <div
                  className="mx-auto z-10 bg-gray-900 border border-gray-700 rounded-full px-2 py-0.5 text-[9px] font-bold text-gray-400 hover:text-white hover:border-purple-500 transition-colors cursor-help"
                  title="CTR: Click Through Rate"
                >
                  4.2% CTR
                </div>

                {/* Step 2: Clicks/Interactions */}
                <div className="w-[80%] mx-auto bg-gray-800/50 rounded-lg p-3 flex justify-between items-center border border-white/5 group hover:border-purple-500/30 transition-colors relative">
                  <div className="flex items-center gap-3">
                    <CursorArrowRaysIcon className="w-4 h-4 text-gray-400 group-hover:text-white" />
                    <span className="text-[10px] sm:text-xs text-gray-400 font-bold uppercase">
                      Clics / Interés
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-white">
                    523
                  </span>
                  <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gray-700 z-0 group-hover:bg-purple-500/50 transition-colors"></div>
                </div>

                {/* Conversion Rate Pill */}
                <div
                  className="mx-auto z-10 bg-gray-900 border border-gray-700 rounded-full px-2 py-0.5 text-[9px] font-bold text-emerald-400 hover:border-emerald-500 transition-colors cursor-help"
                  title="Tasa de Canje"
                >
                  24% Conv.
                </div>

                {/* Step 3: Redemptions (Sales) - PURPLE/FUCHSIA */}
                <div className="w-[60%] mx-auto bg-gradient-to-r from-purple-900/40 to-fuchsia-900/40 rounded-lg p-3 flex justify-between items-center border border-purple-500/30 group hover:shadow-[0_0_15px_rgba(192,132,252,0.2)] transition-all">
                  <div className="flex items-center gap-3">
                    <ShoppingBagIcon className="w-4 h-4 text-purple-400 group-hover:text-white" />
                    <span className="text-[10px] sm:text-xs text-purple-200 font-bold uppercase">
                      Canjes (Ventas)
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-white text-lg">
                    125
                  </span>
                </div>
              </div>
            </div>
          }
          backContent={
            <div className="text-left space-y-2">
              <p className="text-xs">
                <strong className="text-white">Vistas:</strong> Usuarios que
                vieron tu oferta en el feed.
              </p>
              <p className="text-xs">
                <strong className="text-white">Clics:</strong> Usuarios que
                abrieron el detalle.
              </p>
              <p className="text-xs">
                <strong className="text-purple-400">Canjes:</strong> Ventas
                reales verificadas en caja.
              </p>
              <div className="mt-4 p-2 bg-white/5 rounded border border-white/10">
                <p className="text-[10px] text-gray-400">
                  💡 Tip: Tu tasa de clic es buena, pero la conversión final
                  podría mejorar con ofertas más agresivas.
                </p>
              </div>
            </div>
          }
        />
      </div>

      {/* Active Offers List */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-white">Mis Ofertas Activas</h3>
          <button
            onClick={() => setIsCreateOfferOpen(true)}
            className="flex items-center gap-2 bg-purple-500 hover:bg-purple-400 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors shadow-lg shadow-purple-500/20"
          >
            <PlusIcon className="w-4 h-4" /> Crear Oferta
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {offers.slice(0, 3).map((offer) => (
            <div
              key={offer.id}
              className="bg-surface border border-white/10 rounded-xl p-4 flex gap-4 group hover:border-purple-500/50 transition-colors"
            >
              <img
                src={offer.image}
                className="w-16 h-16 rounded-lg object-cover bg-gray-800"
              />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-white text-sm">
                    {offer.title}
                  </h4>
                  {offer.isFlash && (
                    <SparklesIcon className="w-4 h-4 text-purple-400 animate-pulse" />
                  )}
                </div>
                <p className="text-xs text-gray-400 line-clamp-1">
                  {offer.description}
                </p>
                <div className="flex justify-between items-end mt-2">
                  <span className="text-xs font-bold text-purple-400">
                    {offer.redemptions} canjes
                  </span>
                  <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-gray-300">
                    {offer.costTreevus} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Live Feed */}
      <div className="bg-surface border border-white/10 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
            Actividad en Vivo{" "}
            <Tooltip content="Log de transacciones en tiempo real." />
          </h3>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-300 flex items-center justify-center text-xs font-bold">
                MC
              </div>
              <div>
                <p className="text-xs text-gray-900 dark:text-white">
                  Canjeó <span className="font-bold">"20% Dscto Menú"</span>
                </p>
                <p className="text-[10px] text-gray-500">Hace 2 min</p>
              </div>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              +S/ 25.00
            </span>
          </div>
          {/* Mock Item 2 */}
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-white/5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors border border-gray-100 dark:border-white/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 flex items-center justify-center text-xs font-bold">
                JP
              </div>
              <div>
                <p className="text-xs text-gray-900 dark:text-white">
                  Vio oferta <span className="font-bold">"Cena para Dos"</span>
                </p>
                <p className="text-[10px] text-gray-500">Hace 15 min</p>
              </div>
            </div>
            <span className="text-gray-400 font-bold text-xs">--</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmployeeWallet: React.FC = () => {
  const {
    user,
    expenses,
    addExpense,
    savingsGoals,
    offers,
    togglePricingModal,
    contributeToGoal,
    redeemOffer,
    isBudgetModalOpen,
    toggleBudgetModal,
    addNotification,
  } = useStore();

  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isManualOpen, setIsManualOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // --- AUTO-TRIGGER BUDGET SETUP ---
  useEffect(() => {
    if (user.monthlyBudget === 0) {
      // If budget is 0, open config modal automatically via global trigger
      toggleBudgetModal(true);
    }
  }, [user.monthlyBudget]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to sanitize IA Category to Enum
  const mapCategory = (raw: string): ExpenseCategory => {
    if (!raw) return ExpenseCategory.OTHER;
    const values = Object.values(ExpenseCategory);
    const match = values.find((v) => v.toLowerCase() === raw.toLowerCase());
    if (match) return match;
    // Heuristic mapping
    if (raw.match(/food|comida|restaurante/i)) return ExpenseCategory.FOOD;
    if (raw.match(/transport|taxi|uber/i)) return ExpenseCategory.TRANSPORT;
    return ExpenseCategory.OTHER;
  };

  // Centralized Receipt Processor
  const handleProcessReceipt = async (imageBase64: string) => {
    setIsProcessing(true);
    addNotification("Procesando recibo con IA...", "info");

    try {
      const result = await scanReceipt(imageBase64);

      if (result.merchant.includes("Error")) {
        throw new Error(result.merchant);
      }

      addExpense({
        merchant: result.merchant,
        amount: result.total, // Corrected from result.amount if API returns total
        date: result.date,
        category: mapCategory(result.category),
        isFormal: result.isFormal,
        ruc: result.ruc,
      });

      addNotification("Gasto analizado y guardado.", "success");
    } catch (error) {
      console.error("Receipt Processing Error:", error);
      addNotification("Error al procesar el recibo. Intenta manual.", "error");
    } finally {
      setIsProcessing(false);
      setIsCameraOpen(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        if (event.target?.result) {
          const base64 = (event.target.result as string).split(",")[1];
          handleProcessReceipt(base64);
        }
      };

      reader.readAsDataURL(file);
      setIsMenuOpen(false);
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto space-y-4 animate-fadeIn pb-20">
      {isCameraOpen && (
        <CameraView
          onCapture={handleProcessReceipt}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
      {isGoalModalOpen && (
        <ContributeGoalModal
          goalId={isGoalModalOpen}
          onClose={() => setIsGoalModalOpen(null)}
        />
      )}
      {isBudgetModalOpen && (
        <BudgetConfigModal onClose={() => toggleBudgetModal(false)} />
      )}
      {isManualOpen && (
        <ManualExpenseModal onClose={() => setIsManualOpen(false)} />
      )}

      {/* Loading Overlay */}
      {isProcessing && (
        <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white font-bold animate-pulse">
            Analizando Comprobante...
          </p>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileUpload}
      />

      {/* Header: Now handled by main layout, but we keep spacing */}
      <div className="h-4" />

      {/* Hero Card */}
      <TreevuCard />

      {/* Analytics Section */}
      <B2CAnalytics
        expenses={expenses}
        budget={user.monthlyBudget}
        subscriptionTier={user.subscriptionTier}
        onUpgrade={() => togglePricingModal(true)}
      />

      {/* Goals Section */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <FlagIcon className="w-5 h-5 text-emerald-400" /> Mis Metas
            <Tooltip content="Ahorros para objetivos específicos. Aporta desde tu saldo disponible." />
          </h3>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {savingsGoals.map((goal) => {
            const percent = Math.min(
              100,
              Math.round((goal.currentAmount / goal.targetAmount) * 100)
            );
            return (
              <div
                key={goal.id}
                className="min-w-[200px] bg-surface border border-white/10 rounded-2xl p-4 relative overflow-hidden snap-center group transition-transform hover:scale-[1.02]"
              >
                <div
                  className={`absolute top-0 left-0 w-1 h-full ${goal.color}`}
                ></div>

                {/* Header with Image and Percent Badge */}
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-1 rounded-xl bg-white/5 text-white relative`}
                  >
                    <img
                      src={goal.image}
                      className="w-10 h-10 rounded-lg object-cover opacity-90"
                    />
                    <div className="absolute -bottom-2 -right-2 bg-black/80 border border-white/10 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow-sm">
                      {percent}%
                    </div>
                  </div>
                  <button
                    onClick={() => setIsGoalModalOpen(goal.id)}
                    className="bg-white/10 hover:bg-white/20 text-emerald-400 p-2 rounded-full transition-colors"
                  >
                    <PlusIcon className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <p className="text-xs text-gray-400 font-bold uppercase mb-1 truncate">
                  {goal.title}
                </p>
                <div className="flex items-end gap-1 mb-2">
                  <p className="text-lg font-bold text-white">
                    S/ {goal.currentAmount}
                  </p>
                  <span className="text-[10px] text-gray-500 mb-1">
                    de {goal.targetAmount}
                  </span>
                </div>

                {/* Enhanced Progress Bar */}
                <div className="w-full bg-gray-700/50 h-2 mt-2 rounded-full overflow-hidden border border-white/5">
                  <div
                    className={`h-full ${goal.color} transition-all duration-1000`}
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
          {/* Add Goal Placeholder */}
          <div className="min-w-[100px] bg-white/5 border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:bg-white/10 hover:text-white transition-colors cursor-pointer snap-center">
            <PlusIcon className="w-6 h-6" />
            <span className="text-xs font-bold">Nueva Meta</span>
          </div>
        </div>
      </div>

      {/* Marketplace & Benefits Section */}
      <div className="mt-8 mb-20">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-white flex items-center gap-2">
            <ShoppingBagIcon className="w-5 h-5 text-yellow-400" /> Marketplace
            & Beneficios
          </h3>
          <span className="text-xs text-emerald-400 font-bold cursor-pointer hover:underline">
            Ver Todo
          </span>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar snap-x">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className={`min-w-[240px] bg-surface border rounded-2xl overflow-hidden snap-center relative group ${
                offer.isCashback
                  ? "border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                  : "border-white/10"
              }`}
            >
              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                {offer.type === OfferType.COMPANY && (
                  <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md border border-blue-400">
                    Exclusivo
                  </span>
                )}
                {offer.isFlash && (
                  <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center gap-1 border border-purple-400 animate-pulse">
                    <BoltIcon className="w-3 h-3" /> Flash
                  </span>
                )}
                {offer.isCashback && (
                  <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center gap-1 border border-yellow-200">
                    <CurrencyDollarIcon className="w-3 h-3" /> Cashback
                  </span>
                )}
              </div>

              <div className="h-28 bg-gray-800 relative">
                <img
                  src={offer.image}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                />
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-3">
                  <p className="text-white font-bold text-sm truncate">
                    {offer.merchantName}
                  </p>
                </div>
              </div>

              <div className="p-3">
                <h4 className="text-white font-bold text-sm mb-1 truncate">
                  {offer.title}
                </h4>
                <p className="text-[10px] text-gray-400 line-clamp-2 h-8">
                  {offer.description}
                </p>

                <div className="mt-3 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 font-bold text-sm">
                      {offer.costTreevus}
                    </span>
                    <span className="text-[10px] text-gray-500">pts</span>
                  </div>
                  <button
                    onClick={() => redeemOffer(offer.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      user.treevus >= offer.costTreevus
                        ? "bg-emerald-500 text-black hover:scale-105 shadow-lg"
                        : "bg-white/10 text-gray-500 cursor-not-allowed"
                    }`}
                  >
                    Canjear
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAB Speed Dial (Center Bottom) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-4">
        {/* Speed Dial Options */}
        {isMenuOpen && (
          <div className="flex flex-col gap-3 mb-2 animate-slideUp">
            {/* Upload Option */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white hover:bg-white/10 shadow-lg transition-transform hover:scale-110"
            >
              <PhotoIcon className="w-5 h-5" />
            </button>
            <span className="absolute right-16 bottom-[116px] text-xs font-bold text-white bg-black/80 px-2 py-1 rounded pointer-events-none">
              Subir
            </span>

            {/* Manual Option */}
            <button
              onClick={() => {
                setIsManualOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-12 h-12 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white hover:bg-white/10 shadow-lg transition-transform hover:scale-110"
            >
              <PencilIcon className="w-5 h-5" />
            </button>
            <span className="absolute right-16 bottom-[60px] text-xs font-bold text-white bg-black/80 px-2 py-1 rounded pointer-events-none">
              Manual
            </span>

            {/* Camera Option (Primary in Menu) */}
            <button
              onClick={() => {
                setIsCameraOpen(true);
                setIsMenuOpen(false);
              }}
              className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-transform hover:scale-110"
            >
              <CameraIcon className="w-6 h-6" />
            </button>
            <span className="absolute right-16 bottom-2 text-xs font-bold text-emerald-400 bg-black/80 px-2 py-1 rounded pointer-events-none">
              Escanear
            </span>
          </div>
        )}

        {/* Main Trigger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`w-16 h-16 rounded-full bg-gradient-to-r from-primary to-emerald-600 text-black shadow-[0_0_30px_rgba(52,211,153,0.4)] flex items-center justify-center transition-all duration-300 ${
            isMenuOpen ? "rotate-45 scale-90" : "hover:scale-105"
          }`}
        >
          <PlusIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

// Wrapper to manage Profile Menu State locally
const ProfileMenuWrapper = () => {
  const {
    user,
    switchRole,
    togglePricingModal,
    switchRole: signOut,
  } = useStore(); // SignOut acts as role switch to GUEST
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      ></button>
      <ProfileMenu
        user={user}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onSwitchRole={switchRole}
        onOpenPricing={() => togglePricingModal(true)}
        onSignOut={() => switchRole(UserRole.GUEST)}
      />
    </>
  );
};

// --- MAIN DASHBOARD VIEW ---

const DashboardView: React.FC = () => {
  const {
    role,
    switchRole,
    user,
    isPricingOpen,
    isChatOpen,
    levelUp,
    setLevelUp,
    currentView,
    goBack,
  } = useStore();

  if (role === UserRole.GUEST) {
    return <AccessPortal onSelectRole={switchRole} />;
  }

  // --- MAIN LAYOUT (Authenticated) ---
  return (
    <div className="min-h-screen bg-base text-gray-900 dark:text-white transition-colors duration-300 font-sans">
      <PricingModal />
      <OnboardingTour />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-base/80 backdrop-blur-lg border-b border-gray-200 dark:border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          {currentView !== AppView.DASHBOARD && (
            <button
              onClick={goBack}
              className="p-2 -ml-2 rounded-full hover:bg-gray-200 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </button>
          )}
          <TreevuLogo />
        </div>

        <div className="flex items-center gap-3">
          {/* Treevüs Counter (Visible for everyone but Guest) */}
          {role !== UserRole.GUEST && (
            <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-3 py-1.5 rounded-full border border-gray-200 dark:border-white/10">
              <span className="text-sm">🌳</span>
              <span className="font-mono font-bold text-sm text-gray-900 dark:text-white">
                {user.treevus}
              </span>
            </div>
          )}

          {/* AI Chat Trigger */}
          <button
            onClick={() => useStore().toggleChat(!isChatOpen)}
            className="p-2 rounded-full bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 transition-colors relative"
          >
            <SparklesIcon className="w-5 h-5" />
            {/* Dot indicator */}
            <span className="absolute top-1.5 right-2 w-2 h-2 bg-indigo-500 rounded-full border border-white dark:border-black"></span>
          </button>

          {/* Profile */}
          <div className="relative group">
            <button className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-white/20 hover:border-primary transition-colors">
              <img
                src={user.avatarUrl}
                className="w-full h-full object-cover"
              />
            </button>
            <ProfileMenuWrapper />
          </div>
        </div>
      </header>

      {/* View Router */}
      <main className="relative">
        {currentView === AppView.DASHBOARD && (
          <>
            {role === UserRole.EMPLOYEE && <EmployeeWallet />}
            {role === UserRole.EMPLOYER && <EmployerDashboard />}
            {role === UserRole.MERCHANT && <MerchantDashboard />}
          </>
        )}

        {/* Settings Views */}
        {currentView === AppView.PROFILE_DETAILS && <ProfileDetailsView />}
        {currentView === AppView.SECURITY && <SecurityView />}
        {currentView === AppView.SETTINGS && <GeneralSettingsView />}
        {currentView === AppView.HELP && <HelpView />}
      </main>

      {/* Global Overlays */}
      <ToastContainer />
      {isChatOpen && <AIChatOverlay />}
      {levelUp && (
        <LevelUpModal level={levelUp} onClose={() => setLevelUp(null)} />
      )}
    </div>
  );
};

export default DashboardView;
