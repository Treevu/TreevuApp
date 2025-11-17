



import React from 'react';
import { BuildingOffice2Icon, ArrowLeftIcon, SparklesIcon, TrophyIcon, ChartPieIcon, UsersIcon, LightBulbIcon, CheckBadgeIcon } from '../Icons';
import ThemeSwitcher from '../ThemeSwitcher';
import { useModal } from '../../contexts/ModalContext';
// FIX: Updated import for `CurrentUserType` to break circular dependency
import { type CurrentUserType } from '../../types/employer';
import EmployerStatusCard from './EmployerStatusCard';
import KpiCard from './KpiCard';
import Logo from '../Logo';
import TreevuLogoText from '../TreevuLogoText';
import UpgradePlanCTA from '../UpgradePlanCTA';

interface EmployerProfileViewProps {
    user: CurrentUserType;
    dashboardData: any;
    refs: {
        assistantBtnRef: React.RefObject<HTMLButtonElement>;
    };
    onTourInteraction?: () => void;
    isTourActiveStep?: boolean;
}

const AchievementsWidget: React.FC<{ data: any }> = ({ data }) => {
    const achievements = [
        { id: 'challenge', title: 'Estratega Activo', icon: '🚀', unlocked: true, desc: 'Lanzaste tu primera expedición.' },
        { id: 'roi', title: 'ROI Positivo', icon: '💰', unlocked: data.roiMultiplier > 1, desc: 'El programa genera más valor del que cuesta.' },
        { id: 'kudos', title: 'Motor de Cultura', icon: '💖', unlocked: data.kudosLeaderboard.reduce((acc: number, curr: any) => acc + curr.kudos, 0) > 100, desc: 'Tu equipo ha compartido más de 100 kudos.' },
        { id: 'fwi', title: 'Campeón del Bienestar', icon: '🏆', unlocked: data.financialWellnessIndex > 80, desc: 'Tu equipo alcanzó un FWI superior a 80.' },
    ];

    return (
        <div className="bg-surface rounded-2xl p-4">
            <h3 className="text-base font-bold text-on-surface mb-3">Logros de Liderazgo</h3>
            <div className="grid grid-cols-4 gap-3">
                {achievements.map(ach => (
                    <div key={ach.id} className="tooltip-container flex flex-col items-center">
                        <div className={`w-14 h-14 text-3xl rounded-full flex items-center justify-center transition-opacity ${ach.unlocked ? 'bg-active-surface' : 'bg-active-surface/50 grayscale opacity-60'}`}>
                           {ach.unlocked ? <span className="animate-grow-and-fade-in">{ach.icon}</span> : ach.icon}
                        </div>
                        <div className="tooltip-box !w-40 text-center">
                            <p className="font-bold">{ach.title}</p>
                            <p className="text-xs mt-1">{ach.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const EmployerProfileView: React.FC<EmployerProfileViewProps> = ({ user, dashboardData, refs, onTourInteraction, isTourActiveStep }) => {
    const { openModal } = useModal();

    const handleAssistantClick = () => {
        if (isTourActiveStep) {
            onTourInteraction?.();
        } else {
            openModal('employerAIAssistant', { data: dashboardData });
        }
    };

    const totalKudos = dashboardData.gamification.totalKudosSent + dashboardData.gamification.totalKudosReceived;

    return (
        <div className="w-1/4 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 pb-28">
            <header>
                 <div className="flex items-center gap-3">
                    <Logo className="w-10 h-10 text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold leading-tight -mb-1">
                            <TreevuLogoText />
                        </h1>
                        <p className="text-accent text-sm font-bold leading-none italic">
                            for business
                        </p>
                    </div>
                </div>
                <h2 className="text-3xl font-bold mt-4 treevu-text">Perfil y Asistente IA</h2>
                <p className="text-on-surface-secondary">
                    Administra tu perfil y accede a tu copiloto estratégico.
                </p>
            </header>
            
            {!dashboardData.isEmpty && (
                <>
                    <div className="space-y-4">
                        <KpiCard 
                            title="FWI DEL EQUIPO"
                            value={dashboardData.financialWellnessIndex.toFixed(0)}
                            history={dashboardData.fwiHistory}
                            tooltipText="Evolución del Índice de Bienestar Financiero promedio para el segmento seleccionado."
                            variant={dashboardData.financialWellnessIndex > 75 ? 'success' : dashboardData.financialWellnessIndex > 60 ? 'warning' : 'danger'}
                        />
                        <KpiCard 
                            title="ACTIVACIÓN DEL EQUIPO"
                            value={dashboardData.activationRate.toFixed(0)}
                            valueSuffix="%"
                            history={dashboardData.activationRateHistory}
                            tooltipText="Evolución del porcentaje de colaboradores activos en la plataforma."
                             variant={dashboardData.activationRate > 80 ? 'success' : dashboardData.activationRate > 60 ? 'warning' : 'danger'}
                        />
                         <KpiCard 
                            title="CULTURA DE RECONOCIMIENTO"
                            value={totalKudos.toLocaleString()}
                            subValue="Kudos"
                            history={dashboardData.kudosHistory}
                            tooltipText="Evolución del total de kudos (reconocimientos) enviados y recibidos en el equipo."
                            variant="default"
                        />
                    </div>
                    <AchievementsWidget data={dashboardData} />
                </>
            )}

            <div className="space-y-3">
                {user.plan === 'Launch' ? (
                    <div className="bg-surface rounded-2xl p-4">
                        <UpgradePlanCTA
                            Icon={SparklesIcon}
                            title="Asistente Estratégico IA"
                            description="Actualiza para desbloquear análisis avanzados, redacción de comunicados y proyecciones con IA."
                            variant="transparent"
                            origin="business"
                        />
                    </div>
                ) : (
                    <button
                        ref={refs.assistantBtnRef}
                        onClick={handleAssistantClick}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold bg-primary text-primary-dark rounded-xl hover:opacity-90 transition-opacity"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Asistente Estratégico IA
                    </button>
                )}
            </div>
            
            <div className="w-full">
                <h4 className="text-sm font-bold text-on-surface-secondary mb-2">Apariencia</h4>
                <ThemeSwitcher />
            </div>

        </div>
    );
};

export default EmployerProfileView;
