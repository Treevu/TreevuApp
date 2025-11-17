

import React from 'react';
import TeamChallengesWidget from './TeamChallengesWidget';
import KudosLeaderboardWidget from './KudosLeaderboardWidget';
import { type Challenge, type CurrentUserType } from '../../types/employer';
import GamificationInsightsWidget from './GamificationInsightsWidget';
import UpgradePlanCTA from '../UpgradePlanCTA';
import { SparklesIcon } from '../Icons';
import Logo from '../Logo';
import TreevuLogoText from '../TreevuLogoText';

interface EmployerStrategyViewProps {
    user: CurrentUserType;
    dashboardData: any;
    companyWideData: any;
    challenges: Challenge[];
    onOpenCreateChallengeModal: (suggestion?: Omit<Challenge, 'id'>) => void;
    refs: {
        teamChallengesRef: React.RefObject<HTMLDivElement>;
    };
}

const EmployerStrategyView: React.FC<EmployerStrategyViewProps> = ({
    user,
    dashboardData,
    companyWideData,
    challenges,
    onOpenCreateChallengeModal,
    refs
}) => {
     if (user.plan === 'Launch') {
        return (
            <div className="w-1/4 h-full p-4 sm:p-6 flex items-center justify-center">
                <UpgradePlanCTA
                    Icon={SparklesIcon}
                    title="Activa tus Palancas de Cultura"
                    description="Actualiza al plan Crece para lanzar iniciativas de equipo, medir el reconocimiento y acceder a insights de gamificación para potenciar el engagement."
                />
            </div>
        );
    }
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
                <h2 className="text-3xl font-bold mt-4 treevu-text">Engagement y Cultura</h2>
                <p className="text-on-surface-secondary">
                    Activa palancas culturales para fortalecer la moral y el rendimiento del equipo.
                </p>
            </header>

            {dashboardData.isEmpty ? (
                 <div className="text-center py-16 bg-surface rounded-2xl mt-6">
                    <h3 className="text-xl font-bold">Sin Datos para esta Selección</h3>
                    <p className="text-on-surface-secondary mt-2">No hay colaboradores que coincidan con los filtros actuales.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
                    <div className="lg:col-span-2">
                        <GamificationInsightsWidget data={dashboardData} companyWideData={companyWideData} />
                    </div>
                    <div ref={refs.teamChallengesRef}>
                        <TeamChallengesWidget
                            data={dashboardData}
                            challenges={challenges}
                            onOpenCreateChallengeModal={onOpenCreateChallengeModal}
                        />
                    </div>
                    <KudosLeaderboardWidget data={dashboardData.kudosLeaderboard} />
                </div>
            )}
        </div>
    );
}

export default EmployerStrategyView;
