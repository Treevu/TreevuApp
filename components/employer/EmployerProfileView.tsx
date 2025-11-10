import React from 'react';
import { BuildingOffice2Icon, ArrowLeftIcon, SparklesIcon, TrophyIcon, ChartPieIcon, UsersIcon, LightBulbIcon, CheckBadgeIcon } from '../Icons';
import ThemeSwitcher from '../ThemeSwitcher';
import { useModal } from '../../contexts/ModalContext';
import { type CurrentUserType } from './EmployerDashboard';
import EmployerStatusCard from './EmployerStatusCard';

interface EmployerProfileViewProps {
    user: CurrentUserType;
    dashboardData: any;
    refs: {
        assistantBtnRef: React.RefObject<HTMLButtonElement>;
    };
    onTourInteraction?: () => void;
    isTourActiveStep?: boolean;
}

const LeadershipStats: React.FC<{ data: any }> = ({ data }) => (
    <div className="bg-surface rounded-2xl p-4">
        <h3 className="text-base font-bold text-on-surface mb-3">Panel de Liderazgo</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
            <div>
                <ChartPieIcon className="w-8 h-8 text-primary mx-auto"/>
                <p className="text-xl font-bold mt-1">{data.financialWellnessIndex.toFixed(0)}</p>
                <p className="text-xs text-on-surface-secondary">FWI Equipo</p>
            </div>
            <div>
                <UsersIcon className="w-8 h-8 text-primary mx-auto"/>
                <p className="text-xl font-bold mt-1">{data.activationRate.toFixed(0)}%</p>
                <p className="text-xs text-on-surface-secondary">Activación</p>
            </div>
            <div>
                <SparklesIcon className="w-8 h-8 text-yellow-400 mx-auto"/>
                <p className="text-xl font-bold mt-1">{data.kudosLeaderboard.reduce((acc: number, curr: any) => acc + curr.kudos, 0)}</p>
                <p className="text-xs text-on-surface-secondary">Kudos</p>
            </div>
        </div>
    </div>
);

const StrategicInsightCard: React.FC = () => (
    <div className="bg-surface rounded-2xl p-4">
        <h3 className="text-base font-bold text-on-surface mb-2 flex items-center">
            <LightBulbIcon className="w-5 h-5 mr-2 text-primary"/>
            Radar Estratégico
        </h3>
        <p className="text-sm text-on-surface-secondary italic">
            "El FWI de tu equipo subió 5 pts este mes. ¡Excelente! Considera lanzar un desafío de 'Balance Vida-Trabajo' para mantener el impulso."
        </p>
    </div>
);

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

    return (
        <div className="w-1/4 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 pb-28">
            <header>
                <h1 className="text-3xl font-bold">Perfil y Asistente IA</h1>
                <p className="text-on-surface-secondary">
                    Administra tu perfil y accede a tu copiloto estratégico.
                </p>
            </header>
            
            {!dashboardData.isEmpty && (
                <>
                    <LeadershipStats data={dashboardData} />
                    <StrategicInsightCard />
                    <AchievementsWidget data={dashboardData} />
                </>
            )}

            <div className="space-y-3">
                 <button
                    ref={refs.assistantBtnRef}
                    onClick={handleAssistantClick}
                    className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-primary bg-primary/20 rounded-xl hover:bg-primary/30"
                >
                    <SparklesIcon className="w-5 h-5 mr-2" />
                    Asistente Estratégico IA
                </button>
            </div>
            
            <div className="w-full">
                <h4 className="text-sm font-bold text-on-surface-secondary mb-2">Apariencia</h4>
                <ThemeSwitcher />
            </div>

        </div>
    );
};

export default EmployerProfileView;
