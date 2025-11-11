import React, { useState } from 'react';
import TeamsView from './TeamsView';
import RewardsView from '@/features/gamification/RewardsView.tsx';
import ChallengesView from './ChallengesView';
import { UsersIcon, GiftIcon, RocketLaunchIcon } from '@/components/ui/Icons';
import SubNavBar from '@/components/layout/SubNavBar.tsx';
import MissionsView from './MissionsView';

type ClubSubTab = 'teams' | 'missions' | 'rewards';

const ClubView: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<ClubSubTab>('teams');

    const subTabs: { id: ClubSubTab; label: string; Icon: React.FC<{ className?: string }> }[] = [
        { id: 'teams', label: 'Escuadrones', Icon: UsersIcon },
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
