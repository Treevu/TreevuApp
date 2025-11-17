import React, { useState } from 'react';
import { useModal } from '../contexts/ModalContext';
import TeamsView from './TeamsView';
import MissionsView from './MissionsView';
import { 
    UsersIcon, GiftIcon, FlagIcon, BuildingOffice2Icon, PaperAirplaneIcon, TrophyIcon
} from './Icons';
import SubNavBar from './SubNavBar';
import GamificationBar from './GamificationBar';
import { useAuth } from '../contexts/AuthContext';
import SquadLeaderboard from './SquadLeaderboard';

type ClubSubTab = 'squad' | 'missions' | 'ranking';

const CorporateFeatureLock: React.FC = () => {
    const { openModal } = useModal();
    
    return (
        <div className="bg-surface rounded-2xl p-6 text-center animate-grow-and-fade-in">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BuildingOffice2Icon className="w-9 h-9 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Squad: Tu Aventura Colectiva</h2>
            <p className="text-sm text-on-surface-secondary mt-2 max-w-sm mx-auto">
                El Squad es una funcionalidad exclusiva para empresas. Invita a tu organización a unirse a treevü para desbloquear misiones de equipo, rankings y un bosque colaborativo.
            </p>
            <button
                onClick={() => openModal('leadCapture', { type: 'business' })}
                className="mt-6 inline-flex items-center gap-2 bg-primary text-primary-dark font-bold py-2.5 px-6 rounded-xl hover:opacity-90 transition-opacity text-sm"
            >
                <PaperAirplaneIcon className="w-5 h-5" />
                Sugerir mi Empresa a treevü
            </button>
        </div>
    );
};


const ClubView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<ClubSubTab>('squad');
    const { openModal } = useModal();
    const { user } = useAuth();

    const tabs = [
        { id: 'squad' as const, label: 'Mi Squad', Icon: UsersIcon },
        { id: 'missions' as const, label: 'Iniciativas', Icon: FlagIcon },
        { id: 'ranking' as const, label: 'Ranking', Icon: TrophyIcon },
    ];

    if (!user?.companyId) {
        return (
            <div className="animate-fade-in space-y-4">
                <GamificationBar onOpen={() => openModal('gamificationLevels')} />
                <CorporateFeatureLock />
            </div>
        )
    }
    
    return (
        <div className="animate-fade-in space-y-4">
            <GamificationBar onOpen={() => openModal('gamificationLevels')} />
            
            <SubNavBar tabs={tabs} activeTab={activeTab} onTabClick={(t) => setActiveTab(t)} />
            
            {activeTab === 'squad' && (
                <div className="space-y-4 animate-fade-in">
                    <TeamsView />
                </div>
            )}
            {activeTab === 'missions' && <MissionsView />}
            {activeTab === 'ranking' && <SquadLeaderboard />}
        </div>
    );
};

export default ClubView;