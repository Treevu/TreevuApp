import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Tribe, Mission, MissionMetric, TribeMember } from '../types/tribe';


const MOCK_MISSIONS: Mission[] = [
    {
        id: 'mission-formal-1',
        title: 'Expedición de Formalidad',
        description: 'Registren 50 gastos formales como equipo esta semana para fortalecer sus hábitos y su ahorro fiscal.',
        metric: 'formalExpenseCount',
        target: 50,
        reward: 1000,
        icon: '🧾',
    },
    {
        id: 'mission-kudos-1',
        title: 'Expedición de Camaradería',
        description: 'Envíen 100 kudos entre todos los miembros del escuadrón para fortalecer los lazos de equipo.',
        metric: 'kudosSentCount',
        target: 100,
        reward: 500,
        icon: '💖',
    },
];


// Mock data generation function (moved from DataContext)
const generateMockTribes = (): Tribe[] => {
    return [
        {
            id: 'centauri-1',
            name: 'Escuadrón Centauri',
            icon: '💫',
            members: [
                { id: 'user-mock-id', name: 'Tú', avatarInitial: 'AC', kudosReceived: 42 },
                { id: 'member-2', name: 'Ana', avatarInitial: 'A', kudosReceived: 210 },
                { id: 'member-3', name: 'Carlos', avatarInitial: 'C', kudosReceived: 180 },
                { id: 'member-4', name: 'Laura', avatarInitial: 'L', kudosReceived: 150 },
            ],
            collectiveKudos: 1250,
            activeMissionId: 'mission-formal-1', // Active mission for demo
            missionProgress: 35, // Some progress for demo
        },
        {
            id: 'orion-2',
            name: 'Flota de Orión',
            icon: '🚀',
            members: [
                { id: 'member-5', name: 'Pedro', avatarInitial: 'P', kudosReceived: 195 },
                { id: 'member-6', name: 'Sofía', avatarInitial: 'S', kudosReceived: 230 },
                { id: 'member-7', name: 'Mateo', avatarInitial: 'M', kudosReceived: 160 },
            ],
            collectiveKudos: 850,
        },
        {
            id: 'andromeda-3',
            name: 'Alianza Andrómeda',
            icon: '🌌',
            members: [
                { id: 'member-8', name: 'Valeria', avatarInitial: 'V', kudosReceived: 140 },
                { id: 'member-9', name: 'Diego', avatarInitial: 'D', kudosReceived: 175 },
                { id: 'member-10', name: 'Isabella', avatarInitial: 'I', kudosReceived: 200 },
                { id: 'member-11', name: 'Javier', avatarInitial: 'J', kudosReceived: 130 },
            ],
            collectiveKudos: 980,
        },
    ];
};

interface TribesContextType {
    tribes: Tribe[];
    missions: Mission[];
    sendKudos: (recipientId: string, amount: number, type: 'user' | 'tribe') => void;
    acceptMission: (tribeId: string, missionId: string) => void;
    updateMissionProgress: (tribeId: string, metric: MissionMetric, value: number) => void;
}

const TribesContext = createContext<TribesContextType | undefined>(undefined);

export const TribesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, updateUser } = useAuth();
    const [tribes, setTribes] = useState<Tribe[]>([]);
    const [missions] = useState<Mission[]>(MOCK_MISSIONS);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        let loadedTribes: Tribe[];
        try {
            const savedTribes = localStorage.getItem('treevu-tribes');
            if (savedTribes) {
                loadedTribes = JSON.parse(savedTribes);
            } else {
                loadedTribes = generateMockTribes();
            }
        } catch (e) { console.error("Failed to load tribes from localStorage", e); 
            loadedTribes = generateMockTribes();
        }

        // Dynamically inject the current user into their tribe for data consistency
        if (user && user.tribeId) {
            loadedTribes = loadedTribes.map(tribe => {
                // First, remove the user from any tribe they might erroneously be in
                tribe.members = tribe.members.filter(m => m.id !== user.id && m.name !== 'Tú');
                
                // Now, add or update the user in their correct tribe
                if (tribe.id === user.tribeId) {
                    const newMember: TribeMember = {
                        id: user.id,
                        name: 'Tú', // Keep UI consistent
                        avatarInitial: user.name.split(' ').map(n => n[0]).join(''),
                        kudosReceived: user.kudosReceived,
                    };
                    // Add the current user to the top of the list for easy access
                    tribe.members.unshift(newMember);
                }
                return tribe;
            });
        }

        setTribes(loadedTribes);
        setIsInitialLoad(false);
    }, [user]);
    
    useEffect(() => {
        if (isInitialLoad) return;
        try {
            localStorage.setItem('treevu-tribes', JSON.stringify(tribes));
        } catch(e) { console.error("Failed to save tribes to localStorage", e); }
    }, [tribes, isInitialLoad]);
    
    const updateMissionProgress = useCallback((tribeId: string, metric: MissionMetric, value: number) => {
        setTribes(prevTribes => 
            prevTribes.map(tribe => {
                if (tribe.id === tribeId && tribe.activeMissionId) {
                    const mission = missions.find(m => m.id === tribe.activeMissionId);
                    if (mission && mission.metric === metric) {
                        const newProgress = (tribe.missionProgress || 0) + value;
                        // Handle mission completion
                        if (newProgress >= mission.target) {
                            // TODO: Add team notification and distribute rewards
                            return { ...tribe, missionProgress: newProgress };
                        }
                        return { ...tribe, missionProgress: newProgress };
                    }
                }
                return tribe;
            })
        );
    }, [missions]);


    const sendKudos = useCallback((recipientId: string, amount: number, type: 'user' | 'tribe') => {
        if (!user) return;
        
        // Sending kudos always increments the "sent" counter.
        updateUser({ kudosSent: (user.kudosSent || 0) + 1 });
        if(user.tribeId) {
            updateMissionProgress(user.tribeId, 'kudosSentCount', 1);
        }

        setTribes(prevTribes => {
            return prevTribes.map(tribe => {
                if (type === 'user') {
                    // When giving to a user, 'amount' is always 1 (one recognition)
                    return {
                        ...tribe,
                        members: tribe.members.map(member => 
                            member.id === recipientId 
                                ? { ...member, kudosReceived: member.kudosReceived + 1 }
                                : member
                        )
                    };
                }
                if (type === 'tribe' && tribe.id === recipientId) {
                    // When contributing to the forest, 'amount' is the number of Treevüs
                    return { ...tribe, collectiveKudos: tribe.collectiveKudos + amount };
                }
                return tribe;
            });
        });
    }, [user, updateUser, updateMissionProgress]);
    
    const acceptMission = useCallback((tribeId: string, missionId: string) => {
        setTribes(prevTribes =>
            prevTribes.map(tribe =>
                tribe.id === tribeId
                    ? { ...tribe, activeMissionId: missionId, missionProgress: 0 }
                    : tribe
            )
        );
    }, []);

    const value = useMemo(() => ({ tribes, missions, sendKudos, acceptMission, updateMissionProgress }), [tribes, missions, sendKudos, acceptMission, updateMissionProgress]);
    
    return (
        <TribesContext.Provider value={value}>
            {children}
        </TribesContext.Provider>
    );
};

export const useTribes = () => {
    const context = useContext(TribesContext);
    if (context === undefined) {
        throw new Error('useTribes must be used within a TribesProvider');
    }
    return context;
};