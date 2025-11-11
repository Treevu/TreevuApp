import React from 'react';
import { TrophyIcon, HandThumbUpIcon } from '@/components/ui/Icons';
import Tooltip from '@/components/ui/Tooltip.tsx';

interface KudosData {
    department: string;
    kudos: number;
}

interface KudosLeaderboardWidgetProps {
    data: KudosData[];
}

const KudosLeaderboardWidget: React.FC<KudosLeaderboardWidgetProps> = ({ data }) => {
    const topDepartments = data.slice(0, 5);
    const maxKudos = topDepartments.length > 0 ? Math.max(...topDepartments.map(d => d.kudos)) : 0;

    const getRankColor = (rank: number) => {
        if (rank === 0) return 'text-yellow-400';
        if (rank === 1) return 'text-slate-400';
        if (rank === 2) return 'text-orange-400';
        return 'text-on-surface-secondary';
    };

    return (
        <div className="bg-surface rounded-2xl p-5 relative h-full flex flex-col">
            <div className="absolute top-4 right-4">
                <Tooltip id="kudos-leaderboard-tooltip" text="Mide y fomenta la cultura de reconocimiento. Este ranking muestra los departamentos más activos enviando y recibiendo 'kudos'." />
            </div>
            <h3 className="text-lg font-bold text-on-surface mb-4 flex items-center">
                <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400" />
                Ranking de Kudos
            </h3>

            {topDepartments.length > 0 ? (
                <div className="flex-1 space-y-3">
                    {topDepartments.map((item, index) => (
                        <div key={item.department} className="flex items-center gap-3 text-sm">
                            <div className={`w-6 font-bold text-lg text-center ${getRankColor(index)}`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <p className="font-bold text-on-surface truncate">{item.department}</p>
                                <div className="h-2 w-full bg-active-surface rounded-full mt-1">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400"
                                        style={{ width: maxKudos > 0 ? `${(item.kudos / maxKudos) * 100}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>
                            <div className="font-bold text-primary flex items-center gap-1">
                                <HandThumbUpIcon className="w-4 h-4" />
                                {item.kudos.toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex items-center justify-center text-center text-on-surface-secondary text-sm">
                    <p>No hay datos de Kudos para mostrar.</p>
                </div>
            )}
        </div>
    );
};

export default KudosLeaderboardWidget;