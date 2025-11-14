
import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTribes } from '../contexts/TribesContext';
import { TrophyIcon, UsersIcon } from './Icons';
import TreevuLogoText from './TreevuLogoText';

const SquadLeaderboard: React.FC = () => {
    const { user } = useAuth();
    const { tribes } = useTribes();

    const rankedSquads = useMemo(() => {
        return [...tribes].sort((a, b) => b.collectiveKudos - a.collectiveKudos);
    }, [tribes]);
    
    const getRankIcon = (rank: number) => {
        if (rank === 0) return <span role="img" aria-label="Primer lugar">🥇</span>;
        if (rank === 1) return <span role="img" aria-label="Segundo lugar">🥈</span>;
        if (rank === 2) return <span role="img" aria-label="Tercer lugar">🥉</span>;
        return <span className="text-on-surface-secondary">{rank + 1}</span>;
    };

    return (
        <div className="space-y-4 animate-grow-and-fade-in">
            <div className="bg-surface rounded-2xl p-4">
                <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center">
                    <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400"/>
                    Ranking de Escuadrones
                </h2>
                <p className="text-sm text-on-surface-secondary">
                    La competencia por el bienestar. El ranking se basa en la cosecha total de <TreevuLogoText isTreevus/> del escuadrón.
                </p>
            </div>
            
            <div className="space-y-3">
                {rankedSquads.map((squad, index) => {
                    const isMySquad = squad.id === user?.tribeId;
                    return (
                        <div
                            key={squad.id}
                            className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-300 ${isMySquad ? 'bg-primary/10 ring-2 ring-primary' : 'bg-surface'}`}
                        >
                            <div className="font-bold text-lg w-8 text-center flex items-center justify-center">
                                {getRankIcon(index)}
                            </div>
                            <div className="w-12 h-12 rounded-full bg-active-surface flex items-center justify-center text-2xl flex-shrink-0">{squad.icon}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-on-surface truncate">{squad.name}</p>
                                <p className="text-xs text-on-surface-secondary flex items-center gap-1">
                                    <UsersIcon className="w-3.5 h-3.5"/> {squad.members.length} miembros
                                </p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <p className="font-extrabold text-lg text-primary">{squad.collectiveKudos.toLocaleString()}</p>
                                <p className="text-xs text-on-surface-secondary -mt-1">Cosechados</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SquadLeaderboard;