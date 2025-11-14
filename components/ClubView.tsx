import React, { useState } from 'react';
import TeamsView from './TeamsView';
import RewardsView from './RewardsView';
import { UsersIcon, GiftIcon, RocketLaunchIcon, BuildingStorefrontIcon, TrophyIcon, FlagIcon } from './Icons';
import SubNavBar from './SubNavBar';
import MissionsView from './MissionsView';
import OffersView from './OffersView';
import SquadLeaderboard from './SquadLeaderboard';
import ChallengesView from './ChallengesView';

type MainTab = 'squad' | 'marketplace' | 'community';
type SquadTab = 'team' | 'ranking' | 'missions';
type MarketplaceTab = 'rewards' | 'offers';
type CommunityTab = 'challenges';


const ClubView: React.FC = () => {
    const [activeMainTab, setActiveMainTab] = useState<MainTab>('squad');
    const [activeSquadTab, setActiveSquadTab] = useState<SquadTab>('team');
    const [activeMarketplaceTab, setActiveMarketplaceTab] = useState<MarketplaceTab>('rewards');

    const mainTabs: { id: MainTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'squad', label: 'Escuadrón', Icon: UsersIcon },
        { id: 'marketplace', label: 'Mercado', Icon: BuildingStorefrontIcon },
        { id: 'community', label: 'Comunidad', Icon: FlagIcon },
    ];

    const squadSubTabs: { id: SquadTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'team', label: 'Miembros', Icon: UsersIcon },
        { id: 'ranking', label: 'Ranking', Icon: TrophyIcon },
        { id: 'missions', label: 'Misiones', Icon: RocketLaunchIcon },
    ];

    const marketplaceSubTabs: { id: MarketplaceTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'rewards', label: 'Premios', Icon: GiftIcon },
        { id: 'offers', label: 'Ofertas', Icon: BuildingStorefrontIcon },
    ];

    const renderContent = () => {
        switch (activeMainTab) {
            case 'squad':
                switch (activeSquadTab) {
                    case 'team': return <TeamsView />;
                    case 'ranking': return <SquadLeaderboard />;
                    case 'missions': return <MissionsView />;
                    default: return null;
                }
            case 'marketplace':
                switch (activeMarketplaceTab) {
                    case 'rewards': return <RewardsView />;
                    case 'offers': return <OffersView />;
                    default: return null;
                }
            case 'community':
                return <ChallengesView />;
            default:
                return null;
        }
    };

    return (
        <div className="animate-fade-in">
            <SubNavBar
                tabs={mainTabs}
                activeTab={activeMainTab}
                onTabClick={(tab) => setActiveMainTab(tab)}
            />

            <div className="mt-4">
                 {activeMainTab === 'squad' && (
                    <SubNavBar
                        tabs={squadSubTabs}
                        activeTab={activeSquadTab}
                        onTabClick={(tab) => setActiveSquadTab(tab)}
                    />
                )}
                {activeMainTab === 'marketplace' && (
                    <SubNavBar
                        tabs={marketplaceSubTabs}
                        activeTab={activeMarketplaceTab}
                        onTabClick={(tab) => setActiveMarketplaceTab(tab)}
                    />
                )}
            </div>

            <div className="mt-6">
                {renderContent()}
            </div>
        </div>
    );
};

export default ClubView;