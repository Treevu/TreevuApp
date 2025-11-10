import React, { useState } from 'react';
import TeamsView from './TeamsView';
import RewardsView from './RewardsView';
import ChallengesView from './ChallengesView';
import { UsersIcon, GiftIcon, RocketLaunchIcon } from './Icons';
import SubNavBar from './SubNavBar';
import MissionsView from './MissionsView';

type ClubSubTab = 'teams' | 'missions' | 'rewards';

const ClubView: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<ClubSubTab>('teams');

    const subTabs: { id: ClubSubTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'teams', label: 'Equipos', Icon: UsersIcon },
        { id: 'missions', label: 'Misiones', Icon: RocketLaunchIcon },
        { id: 'rewards', label: 'Premios', Icon: GiftIcon },
    ];

    return (
        <div className="animate-fade-in">
            <SubNavBar
                tabs={subTabs}
                activeTab={activeSubTab}
                onTabClick={(tab) => setActiveSubTab(tab)}
            />

            <div className="space-y-4">
                {activeSubTab === 'teams' && <TeamsView />}
                {activeSubTab === 'rewards' && <RewardsView />}
                {activeSubTab === 'missions' && <MissionsView />}
            </div>
        </div>
    );
};

export default ClubView;
