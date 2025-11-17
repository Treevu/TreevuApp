import React, { useMemo, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTribes } from '../contexts/TribesContext';
import { TrophyIcon, TreevuCoinIcon, FireIcon } from './Icons';
import { badgeData } from '../services/gamificationService';

const SquadLeaderboard: React.FC = () => {
    const { user } = useAuth();
    const { tribes } = useTribes();
    const [sortBy, setSortBy] = useState<'treevus' | 'streak'>('treevus');

    const myTribe = useMemo(() => {
        if (!user?.tribeId) return null;
        return tribes.find(t => t.id === user.tribeId);
    }, [user, tribes]);

    const rankedMembers = useMemo(() => {
        if (!myTribe) return [];
        return [...myTribe.members].sort((a, b) => {
            if (sortBy === 'treevus') return b.treevus - a.treevus;
            return b.streak - a.streak;
        });
    }, [myTribe, sortBy]);

    const getRankContent = (rank: number) => {
        if (rank === 0) return '🥇';
        if (rank === 1) return '🥈';
        if (rank === 2) return '🥉';
        return <span className="text-on-surface-secondary font-bold">{rank + 1}</span>;
    };
    
    // This is a workaround as user object is not in the members array from context.
    // In a real app, the API would return the full user object for each member.
    const getMemberBadge = (memberName: string) => {
        if (memberName === 'Tú' && user?.featuredBadge) {
            return user.featuredBadge;
        }
        return null;
    }

    if (!myTribe) {
        return <div className="text-center text-on-surface-secondary">No perteneces a ningún Squad.</div>;
    }

    return (
        <div className="bg-surface rounded-2xl p-4 animate-grow-and-fade-in">
            <h2 className="text-lg font-bold text-on-surface mb-2 flex items-center">
                <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400"/>
                Ranking de Squad
            </h2>
            <div className="flex gap-2 mb-4">
                <button 
                    onClick={() => setSortBy('treevus')}
                    className={`flex-1 text-sm font-bold py-2 rounded-lg transition-colors ${sortBy === 'treevus' ? 'bg-primary text-primary-dark' : 'bg-active-surface text-on-surface-secondary'}`}
                >
                    Por Treevüs
                </button>
                <button 
                    onClick={() => setSortBy('streak')}
                    className={`flex-1 text-sm font-bold py-2 rounded-lg transition-colors ${sortBy === 'streak' ? 'bg-primary text-primary-dark' : 'bg-active-surface text-on-surface-secondary'}`}
                >
                    Por Racha
                </button>
            </div>
            <div className="space-y-2">
                {rankedMembers.map((member, index) => {
                    const isCurrentUser = member.id === user?.id;
                    const featuredBadgeKey = getMemberBadge(member.name);
                    const FeaturedBadgeIcon = featuredBadgeKey ? badgeData[featuredBadgeKey].icon : null;

                    return (
                        <div
                            key={member.id}
                            className={`p-2.5 rounded-lg flex items-center gap-3 transition-all duration-300 ${isCurrentUser ? 'bg-primary/20 ring-2 ring-primary' : 'bg-background'}`}
                        >
                            <div className="font-bold text-lg w-8 text-center flex-shrink-0">{getRankContent(index)}</div>
                            <div className="w-10 h-10 rounded-full bg-active-surface flex items-center justify-center font-bold text-sm flex-shrink-0">{member.avatarInitial}</div>
                            <div className="flex-1 min-w-0 flex items-center gap-2">
                                <p className="font-semibold text-sm truncate">{member.name}</p>
                                {FeaturedBadgeIcon && (
                                    <div className="tooltip-container">
                                        <FeaturedBadgeIcon className="w-4 h-4 text-primary" />
                                        <div className="tooltip-box !w-auto text-center">{badgeData[featuredBadgeKey!].title}</div>
                                    </div>
                                )}
                            </div>
                            <div className="font-bold text-primary flex items-center gap-1.5 text-sm">
                                {sortBy === 'treevus' ? (
                                    <>
                                        <TreevuCoinIcon className="w-5 h-5" level={user?.level}/>
                                        {member.treevus.toLocaleString()}
                                    </>
                                ) : (
                                    <>
                                        <FireIcon className="w-5 h-5"/>
                                        {member.streak}
                                    </>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SquadLeaderboard;