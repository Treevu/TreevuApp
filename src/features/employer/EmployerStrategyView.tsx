import React from 'react';
import TeamChallengesWidget from './TeamChallengesWidget';
import KudosLeaderboardWidget from './KudosLeaderboardWidget';
import { type Challenge } from '@/types/employer';
import GamificationInsightsWidget from './GamificationInsightsWidget';

interface EmployerCultureViewProps {
    dashboardData: any;
    challenges: Challenge[];
    onOpenCreateChallengeModal: (suggestion?: Omit<Challenge, 'id'>) => void;
    refs: {
        teamChallengesRef: React.RefObject<HTMLDivElement>;
    };
}

const EmployerCultureView: React.FC<EmployerCultureViewProps> = ({
    dashboardData,
    challenges,
    onOpenCreateChallengeModal,
    refs
}) => {
    return (
        <div className="w-1/4 h-full overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 pb-28">
            <header>
                <h1 className="text-3xl font-bold">Cultura y Engagement</h1>
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
                    <KudosLeaderboardWidget data={dashboardData.kudosLeaderboard} />
                    <div ref={refs.teamChallengesRef}>
                        <TeamChallengesWidget
                            data={dashboardData}
                            challenges={challenges}
                            onOpenCreateChallengeModal={onOpenCreateChallengeModal}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        <GamificationInsightsWidget data={dashboardData.gamification} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default EmployerCultureView;
